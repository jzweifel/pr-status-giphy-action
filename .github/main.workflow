workflow "Build and Publish" {
  on = "push"
  resolves = "Docker Publish"
}

workflow "Pull Request Status Checks" {
  resolves = "PR Status Giphy"
  on = "pull_request"
}

action "PR Status Giphy" {
  uses = "./"
}

action "Install NPM Dependencies" {
  uses = "actions/npm@master"
  args = ["install"]
}

action "ESLint" {
  needs = ["Install NPM Dependencies"]
  uses = "actions/npm@master"
  args = ["run lint"]
}

action "Shell Lint" {
  uses = "actions/bin/shellcheck@master"
  args = "entrypoint.sh"
}

action "Docker Lint" {
  uses = "docker://replicated/dockerfilelint"
  args = ["Dockerfile"]
}

action "Test" {
  uses = "actions/bin/bats@master"
  args = "test/*.bats"
}

action "Build" {
  needs = ["Shell Lint", "Docker Lint", "ESLint", "Test"]
  uses = "actions/docker/cli@master"
  args = "build -t pr-status-giphy-action ."
}

action "Docker Tag" {
  needs = ["Build"]
  uses = "actions/docker/tag@master"
  args = "pr-status-giphy-action jzweifel/pr-status-giphy-action --no-latest"
}

action "Publish Filter" {
  needs = ["Build"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Docker Login" {
  needs = ["Publish Filter"]
  uses = "actions/docker/login@master"
  secrets = [
    "DOCKER_USERNAME",
    "DOCKER_PASSWORD",
    "GITHUB_TOKEN",
  ]
}

action "Docker Publish" {
  needs = ["Docker Tag", "Docker Login"]
  uses = "actions/docker/cli@master"
  args = "push jzweifel/pr-status-giphy-action"
}
