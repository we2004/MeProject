import { Router, Response } from "express"
import { getDb } from "../database/db"
import { authenticate, AuthRequest } from "../middleware/auth"
import multer from "multer"
import path from "path"
import fs from "fs"
import { createClient } from "@supabase/supabase-js"

const router = Router()
router.use(authenticate)

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// For Cloud Run, we use /tmp for temporary storage during upload
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "application/pdf",
  "text/markdown",
  "text/plain"
]
const allowedExts = [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".md", ".txt"]

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type"))
    }
  }
})

router.get("/:id", async (req: AuthRequest, res: Response) => {
  const pool = getDb()
  const userId = req.user!.id

  try {
    const result = await pool.query(
      "SELECT * FROM attachments WHERE id = $1 AND userId = $2",
      [req.params.id, userId]
    )
    const attachment = result.rows[0]

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" })
    }

    res.json({
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      projectId: attachment.projectid,
      filePath: attachment.filepath,
      userId: attachment.userid
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post(
  "/",
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    const pool = getDb()
    const userId = req.user!.id
    const projectId = req.body.projectId

    if (!req.file || !projectId) {
      return res.status(400).json({ error: "File and projectId are required" })
    }

    try {
      const projectRes = await pool.query(
        "SELECT id FROM projects WHERE id = $1 AND userId = $2",
        [projectId, userId]
      )
      if (projectRes.rows.length === 0) {
        fs.unlinkSync(req.file.path)
        return res
          .status(404)
          .json({ error: "Project not found or unauthorized" })
      }

      const ext = path
        .extname(req.file.originalname)
        .toLowerCase()
        .replace(".", "")
      const type = ["png", "jpg", "jpeg", "svg", "pdf", "md", "txt"].includes(
        ext
      )
        ? ext
        : "txt"

      let finalFilePath = req.file.path;

      // Upload to Supabase Storage if configured
      if (supabase) {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `${userId}/${Date.now()}-${req.file.originalname}`;
        const { data, error } = await supabase.storage
          .from('attachments')
          .upload(fileName, fileContent, {
            contentType: req.file.mimetype,
          });

        if (error) {
          console.error("Supabase upload error:", error);
          // Fallback to local file path if supabase fails (not ideal for Cloud Run but prevents total failure)
        } else {
          finalFilePath = `supabase://${data.path}`;
          // Clean up local temp file since it's uploaded
          fs.unlinkSync(req.file.path);
        }
      }

      const result = await pool.query(
        "INSERT INTO attachments (name, type, projectId, filePath, userId) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [req.file.originalname, type, projectId, finalFilePath, userId]
      )

      res
        .status(201)
        .json({ id: result.rows[0].id, message: "Attachment uploaded" })
    } catch (error: any) {
      console.error(error)
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      res.status(500).json({ error: error.message || "Internal server error" })
    }
  }
)

router.get("/:id/download", async (req: AuthRequest, res: Response) => {
  const pool = getDb()
  const userId = req.user!.id

  try {
    const result = await pool.query(
      "SELECT * FROM attachments WHERE id = $1 AND userId = $2",
      [req.params.id, userId]
    )
    const attachment = result.rows[0]

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" })
    }

    if (attachment.filepath.startsWith('supabase://')) {
      if (!supabase) {
        return res.status(500).json({ error: "Supabase client not configured for downloads" });
      }
      const pathInBucket = attachment.filepath.replace('supabase://', '');
      const { data, error } = await supabase.storage.from('attachments').download(pathInBucket);
      if (error || !data) {
        console.error("Supabase download error:", error);
        return res.status(500).json({ error: "Could not download file from storage" });
      }
      
      const buffer = Buffer.from(await data.arrayBuffer());
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
      res.setHeader('Content-Type', data.type || 'application/octet-stream');
      return res.send(buffer);
    } else {
      // Local file download (fallback)
      if (!fs.existsSync(attachment.filepath)) {
        return res.status(404).json({ error: "File not found on disk" })
      }
      return res.download(attachment.filepath, attachment.name)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const pool = getDb()
  const userId = req.user!.id

  try {
    const result = await pool.query(
      "SELECT * FROM attachments WHERE id = $1 AND userId = $2",
      [req.params.id, userId]
    )
    const attachment = result.rows[0]
    
    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" })
    }

    await pool.query("DELETE FROM attachments WHERE id = $1 AND userId = $2", [
      req.params.id,
      userId
    ])

    if (attachment.filepath.startsWith('supabase://')) {
      if (supabase) {
        const pathInBucket = attachment.filepath.replace('supabase://', '');
        await supabase.storage.from('attachments').remove([pathInBucket]);
      }
    } else {
      // Delete local file
      if (fs.existsSync(attachment.filepath)) {
        fs.unlinkSync(attachment.filepath)
      }
    }

    res.json({ message: "Attachment deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
