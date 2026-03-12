# Hackathon Repository Validator

## Overview
A TypeScript npm package designed for hackathon organizers to validate participant GitHub repository submissions. The package takes a GitHub repository URL and a configuration object (e.g., maximum team size, valid time window) and returns a validation status along with a list of human contributors. 

The primary constraints are:
- Use the **GitHub API** exclusively (no cloning or downloading of source code).
- Filter out all known automated bots (Claude, Copilot, Dependabot, GitHub Actions, Snyk, etc.).
- Count only **human contributors** based on commit history.
- Ensure the project and its commits fall within the defined hackathon time window.

## Core Features and Requirements

### 1. Inputs
The main function should accept:
1. `repoUrl` (string): The standard GitHub URL (e.g., `https://github.com/organization/repo-name`).
2. `config` (object):
   - `githubToken` (string): A GitHub Personal Access Token for higher rate limits.
   - `timeWindow` (object):
     - `start` (Date | string): The official start time of the hackathon.
     - `end` (Date | string): The official end time of the hackathon.
   - `maxTeamSize` (number): The maximum allowed number of human contributors (e.g., 4).

### 2. Output
The package should return an object containing:
- `isValid` (boolean): `true` if all checks pass, otherwise `false`.
- `humanContributors` (array): A list of validated human GitHub usernames or profile data.
- `validationErrors` (array): A list of reasons why the repo might be invalid (e.g., "Team size exceeded", "Commits outside time window").

### 3. Logic & GitHub API Integration
- **Parse the URL**: Extract the `owner` and `repo` from the provided URL.
- **Repository Validation**: 
  - Fetch repository details using `GET /repos/{owner}/{repo}` to ensure the repo is public and accessible.
  - Optionally check if the repository creation date is after the hackathon start time (if required by strict hackathon rules).
- **Commit History fetching**:
  - Fetch all commits for the default branch within the specified `timeWindow` using the `since` and `until` parameters in `GET /repos/{owner}/{repo}/commits`.
- **Contributor Extraction & Bot Filtering**:
  - Extract the author information from each fetched commit.
  - Filter out known bots. This includes, but is not limited to:
    - Usernames ending in `[bot]` or `-bot`.
    - Known automation bots: `dependabot[bot]`, `github-actions[bot]`, `renovate[bot]`, `snyk-bot`.
    - Known AI assistants: `claude`, `copilot`, `gpt`, `sweep-ai`.
- **Team Size Validation**:
  - Check `humanContributors.length <= config.maxTeamSize`.

## Technical Stack & Tooling
- **Language**: TypeScript (strict mode enabled).
- **API Client**: `octokit` (officially supported GitHub SDK) or native `fetch`.
- **Testing**: `jest` or `vitest` for mocking GitHub API responses and ensuring bot filtering works accurately.
- **Build**: `tsup` or standard `tsc` for building the CommonJS and ESM package.
- **Deployment**: Configured to be published on npm under the organization's namespace.

## Recommended Steps for Antigravity
1. **Initialize Project**: Run `npm init -y` and set up the TypeScript configuration (`tsconfig.json`).
2. **Install Dependencies**: 
   - `npm install @octokit/rest`
   - `npm install -D typescript @types/node jest @types/jest ts-jest` (or equivalent test runner).
3. **Setup Structure**:
   - `src/index.ts`: Main entry point.
   - `src/validator.ts`: Core logic for API integration.
   - `src/bot-filter.ts`: A robust, extensible list/regex mechanism for stripping out bot accounts.
   - `src/types.ts`: TypeScript interfaces for configurations and return types.
4. **Implement**: Prioritize the `octokit` implementation to fetch commits by dates and robustly filter bots based on `.type === 'Bot'` properties and a hardcoded denylist if the type is inconclusive.
5. **Test**: Create unit tests mocking `octokit` to feed commits from human users and bots, ensuring the outputs match the constraints perfectly.
