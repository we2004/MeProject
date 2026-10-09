export type TextPart =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string }

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>]+/gi
const TRAILING_PUNCTUATION = /[.,!?;:'"\])}]$/

function trimTrailingPunctuation(url: string) {
  let end = url.length

  while (end > 0 && TRAILING_PUNCTUATION.test(url.slice(0, end))) {
    const last = url[end - 1]

    // Keep a closing bracket when the link itself opened it
    if (last === ")" || last === "]" || last === "}") {
      const open = last === ")" ? "(" : last === "]" ? "[" : "{"
      const section = url.slice(0, end)
      const opened = section.split(open).length - 1
      const closed = section.split(last).length - 1
      if (opened >= closed) break
    }

    end--
  }

  return url.slice(0, end)
}

function getSafeHref(url: string) {
  const candidate = /^www\./i.test(url) ? `https://${url}` : url

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    return parsed.href
  } catch {
    return null
  }
}

export function splitTextWithLinks(text: string): TextPart[] {
  const parts: TextPart[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index
    const url = trimTrailingPunctuation(match[0])
    const href = getSafeHref(url)

    if (!href) continue

    if (start > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, start) })
    }

    parts.push({ type: "link", value: url, href })
    lastIndex = start + url.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) })
  }

  return parts
}
