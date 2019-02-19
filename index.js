/* eslint no-console: 0 */
const axios = require("axios");
const NEUTRAL_ERROR_CODE = process.env.GITHUB_WORKFLOW ? 78 : 0;

const githubEventPath = process.env.GITHUB_EVENT_PATH || "";
const githubAction = process.env.GITHUB_ACTION || "";
const githubRepo = process.env.GITHUB_REPOSITORY || "";
const githubSha = process.env.GITHUB_SHA || "";
const githubToken = process.env.GITHUB_TOKEN || "";
const apiVersion = "v3";

const acceptHeader = `application/vnd.github.${apiVersion}+json; application/vnd.github.antiope-preview+json`;
const authHeader = `token ${githubToken}`;

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

console.log("Fetching check statuses...");

axios
  .get(`https://api.github.com/${githubRepo}/commits/${githubSha}/check-runs`, {
    headers: { Accept: acceptHeader, Authorization: authHeader }
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
    process.exit(1);
  });

setTimeout(function() {
  console.log("Reached maximum timeout");
  process.exit(1);
}, 60000);
