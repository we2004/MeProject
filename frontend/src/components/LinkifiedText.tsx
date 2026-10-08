import { splitTextWithLinks } from "../utils/linkify"

type LinkifiedTextProps = {
  text: string
}

function LinkifiedText({ text }: LinkifiedTextProps) {
  return (
    <>
      {splitTextWithLinks(text).map((part, idx) =>
        part.type === "link" ? (
          <a
            key={idx}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="break-all text-primary underline hover:opacity-80"
          >
            {part.value}
          </a>
        ) : (
          part.value
        )
      )}
    </>
  )
}

export default LinkifiedText
