/**
 * List of known bot accounts and automation tools.
 * We include common CI/CD bots, dependency updaters, and AI coding assistants.
 */
const KNOWN_BOTS = new Set([
  'dependabot[bot]',
  'github-actions[bot]',
  'renovate[bot]',
  'snyk-bot',
  'greenkeeper[bot]',
  'semantic-release-bot',
  'claude',
  'copilot',
  'gpt',
  'sweep-ai',
  'dependabot-preview[bot]',
  'vercel[bot]'
]);

/**
 * Checks if a username patterns matches common bot naming conventions
 * e.g., anything ending with [bot] or -bot
 */
const BOT_REGEX_PATTERNS = [
  /\[bot\]$/i,
  /-bot$/i,
  /^bot-/i,
  /bot$/i // Catch-all for usernames ending in "bot" like "snykbot"
];

/**
 * Interface representing a minimal GitHub contributor representation
 * tailored for our filtering needs.
 */
export interface Contributor {
  login: string;
  type?: string; 
}

/**
 * Filters an array of contributors, removing any identified as bots.
 * 
 * @param contributors Array of contributors (from GitHub API)
 * @returns Array of just human contributors
 */
export function filterBots(contributors: Contributor[]): Contributor[] {
  return contributors.filter(contributor => {
    // 1. If GitHub API explicitly tells us it's a Bot
    if (contributor.type && contributor.type.toLowerCase() === 'bot') {
      return false;
    }

    const username = contributor.login.toLowerCase();

    // 2. Check against explicit set of known bot usernames
    if (KNOWN_BOTS.has(username)) {
      return false;
    }

    // 3. Check against common bot regex patterns
    for (const pattern of BOT_REGEX_PATTERNS) {
      if (pattern.test(username)) {
        return false;
      }
    }

    // 4. Sometimes AI bots or integrations use specific keywords in their names
    if (username.includes('claude') || username.includes('copilot') || username.includes('gpt')) {
      return false;
    }

    // If it passes all checks, we assume it's a human
    return true;
  });
}
