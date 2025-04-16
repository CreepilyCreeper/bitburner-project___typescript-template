# Important
This repo is for syncing of code files between computers. This requires committing + pushing of local repo to main repo on github, and syncing of main with the official bitburner typescript-template repo

2 links on the syncing process:
[Link 1](https://stackoverflow.com/questions/30413587/how-do-i-clone-a-repository-from-git-but-still-get-updates-made-to-the-original)
[Link 2](https://stackoverflow.com/questions/7244321/how-do-i-update-or-sync-a-forked-repository-on-github/7244456#7244456)

VSC will periodically fetch from the remotes:
- origin: the main (forked) repo
- upstream: the official repo I forked from
So maybe VSC will tell you how outdated our forked repo is

Code in \src

When committing, do "commit and sync" (which is a commit with staging, pull from main, then push to main), so everything is updated

### Remember to git pull before starting work