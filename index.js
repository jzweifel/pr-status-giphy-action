/* eslint no-console: 0 */
const NEUTRAL_ERROR_CODE = process.env.GITHUB_WORKFLOW ? 78 : 0;

const githubEventPath = process.env.GITHUB_EVENT_PATH || "";
const githubAction = process.env.GITHUB_ACTION || "";

const githubEvent = githubEventPath ? require(githubEventPath) : "";

if (
  !githubEvent ||
  (githubEvent.action !== "synchronize" && githubEvent.action !== "opened")
) {
  console.log(
    `GitHub event payload not found or Pull Request event does not have desired action. Action was ${
      githubEvent.action
    }.`
  );
  process.exit(NEUTRAL_ERROR_CODE);
}

console.log(
  `Running ${githubAction} for Pull Request #${
    githubEvent.number
  } triggered by action ${githubEvent.action}.`
);
