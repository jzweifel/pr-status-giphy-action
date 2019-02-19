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

doChecks();

setTimeout(function() {
  console.log("Reached maximum timeout");
  process.exit(1);
}, 300000);

/**
 * @return {Promise}
 */
function doChecks() {
  console.log(`------ Scanning checks... ------`);
  return fetchChecks()
    .then(handleChecks)
    .catch(function(error) {
      console.log(error);
      process.exit(1);
    });
}

/**
 * @return {Promise} Promise representing an HTTP GET to the check-runs endpoint
 */
function fetchChecks() {
  return axios.get(
    `https://api.github.com/repos/${githubRepo}/commits/${githubSha}/check-runs`,
    {
      headers: { Accept: acceptHeader, Authorization: authHeader }
    }
  );
}

/**
 * TODO: Handle the checks. If any fails are found, post a thumbs down gif. If all succeed, post a thumbs up gif
 * @return {Promise}
 */
function handleChecks({ data }) {
  const filteredChecks = data.check_runs.filter(cr => cr.name !== githubAction);

  filteredChecks.forEach(check => {
    console.log(`Check ${check.name} has status ${check.status}`);
  });

  const failedChecks = filteredChecks.filter(
    cr => cr.status === "completed" && cr.conclusion === "failure"
  );

  if (failedChecks.length) {
    console.log("Checks failed!");
    process.exit(0);
  }

  const inProgressChecks = filteredChecks.filter(
    cr => cr.status === "queued" || cr.status === "in_progress"
  );

  if (inProgressChecks.length) {
    return new Promise(resolve => setTimeout(resolve, 5000)).then(doChecks);
  }

  console.log("All checks completed!");
  process.exit(0);
}
