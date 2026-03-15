import { parseCoAuthors } from '../co-author-parser';

describe('co-author-parser', () => {
  it('should extract username from GitHub noreply email', () => {
    const message = 'Some commit\n\nCo-authored-by: Alice <alice@users.noreply.github.com>';
    expect(parseCoAuthors(message)).toEqual(['alice']);
  });

  it('should extract multiple co-authors', () => {
    const message = [
      'feat: add feature',
      '',
      'Co-authored-by: Alice <alice@users.noreply.github.com>',
      'Co-authored-by: Bob <bob@company.com>',
    ].join('\n');
    expect(parseCoAuthors(message)).toEqual(['alice', 'bob@company.com']);
  });

  it('should return empty array when no co-authors exist', () => {
    expect(parseCoAuthors('just a normal commit message')).toEqual([]);
  });

  it('should deduplicate co-authors', () => {
    const message = [
      'Co-authored-by: Alice <alice@users.noreply.github.com>',
      'Co-authored-by: Alice <alice@users.noreply.github.com>',
    ].join('\n');
    expect(parseCoAuthors(message)).toEqual(['alice']);
  });

  it('should return raw email for non-GitHub emails', () => {
    const message = 'Co-authored-by: Bob <bob@company.com>';
    expect(parseCoAuthors(message)).toEqual(['bob@company.com']);
  });
});
