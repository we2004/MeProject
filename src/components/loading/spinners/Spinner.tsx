type SpinnerProps = {
  size?: "sm" | "md" | "lg"
  color?: "light" | "dark"
}

function Spinner({ size = "md", color = "dark" }: SpinnerProps) {
  const sizeStyles = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4"
  }

  return (
    <div
      className={`${sizeStyles[size]} animate-spin rounded-full ${color === "light" ? "border-white/40 border-t-white" : "border-primary/20 border-t-primary  "}   `}
    />
  )
}

export default Spinner
