# Issue tracker: GitHub

Specs and tickets live in GitHub Issues for `TheiaSurette/thirsttrap.gay`. Use the `gh` CLI with `--repo TheiaSurette/thirsttrap.gay` for issue operations.

## Operations

- Read: `gh issue view <number> --repo TheiaSurette/thirsttrap.gay --json number,title,body,labels,comments,state`.
- List: `gh issue list --repo TheiaSurette/thirsttrap.gay --state open --json number,title,body,labels,assignees`; add label filters as needed and fetch comments for relevant issues.
- Publish: prepare the full issue body in a temporary Markdown file, then use `gh issue create --repo TheiaSurette/thirsttrap.gay --title "..." --body-file <path>` with the appropriate labels.
- Comment: prepare the comment in a temporary file, then use `gh issue comment <number> --repo TheiaSurette/thirsttrap.gay --body-file <path>`.
- Label: `gh issue edit <number> --repo TheiaSurette/thirsttrap.gay --add-label "..."` or `--remove-label "..."`.
- Close: `gh issue close <number> --repo TheiaSurette/thirsttrap.gay`; record completion or resolution evidence in a comment first.

When a skill says to publish to the issue tracker, create a GitHub issue. When it says to fetch a ticket, read its body, labels, state, and comments.

## Dependencies

Publish blockers before dependent tickets. Record each ticket's blockers in its body and use GitHub's native issue dependencies when available. Use the blocker's database issue ID, not its issue number, for dependency API calls. If native dependencies are unavailable, retain explicit `Blocked by: #...` links. A ticket is ready only when every blocker is closed.

Use native sub-issues for parent/child relationships when available; otherwise link children from the parent and the parent from each child. Parent/child relationships do not by themselves imply blocking dependencies.

## Pull requests as a triage surface

PRs as a request surface: no.

## Ready work

Specs and tickets produced by `/to-spec` and `/to-tickets` receive `ready-for-agent` once the invoking skill's review requirements are satisfied. They do not need a separate triage pass. See `triage-labels.md` for the canonical label mapping.
