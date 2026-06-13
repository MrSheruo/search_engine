export function cleanText(text: string) {
    return text
        .replace(/\r/g, "\n")
        .replace(/-\n/g, "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
