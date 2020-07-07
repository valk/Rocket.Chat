This is a (mostly) empty branch whose sole purpose
is to be used by GitHub for running cronjobs, i.e.
scheduled-events.

Hint: Look in .github/workflows/

GitHub requires a fixed branch to be marked as the "default"
branch, and runs scheduled-events exclusively from there.
We, however, have no fixed default branch:
  - no master
  - no develop
  - not even staging or production anymore (they're deprecated)

We just have upstream's release tags and origin's sa_patches_*
branches with commits cherry-picked onto them from prior branches.
But no branch with a permanent, up-to-date existence.

Set this branch as GitHub's "default" branch so it can run cronjobs.
A side-effect is that this branch will be the default target for
PRs, but we are not currently using GitHub's PR system for this repo.
