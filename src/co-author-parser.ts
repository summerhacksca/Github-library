const CO_AUTHOR_REGEX = /^Co-authored-by: .+ <(.+)>$/gim;
const NOREPLY_REGEX = /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i;

export function parseCoAuthors(commitMessage: string): string[] {
  const identifiers = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = CO_AUTHOR_REGEX.exec(commitMessage)) !== null) {
    const email = match[1];
    const noReplyMatch = NOREPLY_REGEX.exec(email);
    identifiers.add(noReplyMatch ? noReplyMatch[1] : email);
  }

  return Array.from(identifiers);
}
