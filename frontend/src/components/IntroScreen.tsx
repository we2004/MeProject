import { useEffect } from "react"
import { motion } from "motion/react"

type IntroScreenProps = {
  onFinish: () => void
}

function IntroScreen({ onFinish }: IntroScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("introShown", "true")
      onFinish()
    }, 2200)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-lightBodyBackground"
    >
      <div className="flex flex-col items-center text-center">
        <motion.img
          src="/favicon.png"
          alt="MeProject"
          className="h-32 w-32"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.25,
            ease: "easeOut"
          }}
          className="mt-5 font-heading text-4xl font-semibold text-primary-font"
        >
          MeProject
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.55,
            ease: "easeOut"
          }}
          className="mt-2 font-body text-md text-primary-font/50"
        >
          For Effictivity, Productivity, and All the Other -ivities!!
        </motion.p>
      </div>
    </motion.div>
  )
}

export default IntroScreen
