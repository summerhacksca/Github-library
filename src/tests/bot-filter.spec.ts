import { filterBots, Contributor } from '../bot-filter';

describe('bot-filter', () => {
  it('should filter out users explicitly typed as Bot', () => {
    const contributors: Contributor[] = [
      { login: 'human1' },
      { login: 'bot1', type: 'Bot' },
      { login: 'bot2', type: 'Bot' },
      { login: 'human2', type: 'User' },
    ];

    const result = filterBots(contributors);
    expect(result).toHaveLength(2);
    expect(result.map(c => c.login)).toEqual(['human1', 'human2']);
  });

  it('should filter out known CI/CD bots and auto dependency tools', () => {
    const contributors: Contributor[] = [
      { login: 'dependabot[bot]' },
      { login: 'github-actions[bot]' },
      { login: 'snyk-bot' },
      { login: 'human1' },
    ];

    const result = filterBots(contributors);
    expect(result).toHaveLength(1);
    expect(result[0].login).toBe('human1');
  });

  it('should filter out known AI dev tools', () => {
    const contributors: Contributor[] = [
      { login: 'claude' },
      { login: 'copilot' },
      { login: 'sweep-ai' },
      { login: 'alice' },
    ];

    const result = filterBots(contributors);
    expect(result).toHaveLength(1);
    expect(result[0].login).toBe('alice');
  });

  it('should filter out general [bot] suffixes via regex check', () => {
    const contributors: Contributor[] = [
      { login: 'random-app[bot]' },
      { login: 'my-custom-bot' },
      { login: 'bot-startup' }, // starts with bot-
      { login: 'anotherbot' }, // ends with bot
      { login: 'bob' },
    ];

    const result = filterBots(contributors);
    expect(result).toHaveLength(1);
    expect(result[0].login).toBe('bob');
  });
});
