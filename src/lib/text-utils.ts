/**
 * Global text sanitization utility for PHISHNET.
 * Scrubs broken symbols, hidden unicode, and malformed characters from AI-generated content.
 */

export function sanitizeText(value: unknown): string {
  return String(value ?? "")
    // Remove common broken symbols and placeholders
    .replace(/[\uFFFD\u25A1\u25A0\u25FB\u25FC\u25FD\u25FE]/g, "")
    // Remove control characters except for newlines
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    // Normalize line endings and whitespace
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    // Remove raw markdown artifacts sometimes left by low-temp LLMs
    .replace(/\*\*/g, "")
    // Remove placeholders like [Date]
    .replace(/\[Date\]/gi, "")
    .trim();
}

export function sanitizeList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => sanitizeText(item)).filter(Boolean);
}

export function parseAISections(text: string) {
  if (!text) return [];
  const cleaned = sanitizeText(text);
  
  // Look for patterns like "1. Title:" or "Title:"
  const sections: { title: string; body: string }[] = [];
  const lines = cleaned.split('\n');
  let currentSection: { title: string; body: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Match "1. Title:" or "Section Name:"
    const match = trimmed.match(/^(\d+\.\s+)?([^:]+):/);
    
    if (match && trimmed.length < 100) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: match[2].trim(),
        body: ""
      };
    } else if (currentSection) {
      currentSection.body += (currentSection.body ? "\n" : "") + line;
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections;
}
