import { Router, Response } from "express"
import { getDb } from "../database"
import { authenticate, AuthRequest } from "../middleware/auth"
import multer from "multer"
import path from "path"
import fs from "fs"

const router = Router()
router.use(authenticate)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads")
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
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
  const db = getDb()
  const userId = req.user!.id

  try {
    const attachment = await db.get(
      "SELECT * FROM attachments WHERE id = ? AND userId = ?",
      [req.params.id, userId]
    )

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" })
    }

    res.json(attachment)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post(
  "/",
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    const db = getDb()
    const userId = req.user!.id
    const projectId = req.body.projectId

    if (!req.file || !projectId) {
      return res.status(400).json({ error: "File and projectId are required" })
    }

    try {
      const project = await db.get(
        "SELECT id FROM projects WHERE id = ? AND userId = ?",
        [projectId, userId]
      )
      if (!project) {
        // Clean up uploaded file if project not found
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

      const result = await db.run(
        "INSERT INTO attachments (name, type, projectId, filePath, userId) VALUES (?, ?, ?, ?, ?)",
        [req.file.originalname, type, projectId, req.file.path, userId]
      )

      res
        .status(201)
        .json({ id: result.lastID, message: "Attachment uploaded" })
    } catch (error: any) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      res.status(500).json({ error: error.message || "Internal server error" })
    }
  }
)

router.get("/:id/download", async (req: AuthRequest, res: Response) => {
  const db = getDb()
  const userId = req.user!.id

  try {
    const attachment = await db.get(
      "SELECT * FROM attachments WHERE id = ? AND userId = ?",
      [req.params.id, userId]
    )

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" })
    }

    res.download(attachment.filePath, attachment.name)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const db = getDb()
  const userId = req.user!.id

  try {
    const attachment = await db.get(
      "SELECT * FROM attachments WHERE id = ? AND userId = ?",
      [req.params.id, userId]
    )
    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" })
    }

    await db.run("DELETE FROM attachments WHERE id = ? AND userId = ?", [
      req.params.id,
      userId
    ])

    // Delete file
    if (fs.existsSync(attachment.filePath)) {
      fs.unlinkSync(attachment.filePath)
    }

    res.json({ message: "Attachment deleted" })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
