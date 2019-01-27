const NEUTRAL_ERROR_CODE = process.env.GITHUB_WORKFLOW ? 78 : 0;

/* eslint no-console: 0 */
console.log("Hello World!");

const githubEventPath = process.env.GITHUB_EVENT_PATH || "";

const githubEvent = githubEventPath ? require(githubEventPath) : "";

if (
  !githubEvent &&
  githubEvent.action != "synchronize" &&
  githubEvent.action != "opened"
)
  process.exit(NEUTRAL_ERROR_CODE);

console.log(`Pull Request #${githubEvent.number}`);
