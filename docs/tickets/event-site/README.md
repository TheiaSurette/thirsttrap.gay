# Implementation tickets

Status: approved and published to GitHub with `ready-for-agent`. Issue bodies, labels, and native blocking relationships have been verified.

Parent: [Spec #1: Event-focused website and native applications of interest](https://github.com/TheiaSurette/thirsttrap.gay/issues/1). Its body, state, labels, and comments remain unchanged.

| Issue | Ticket snapshot | Blocked by |
| --- | --- | --- |
| [#2](https://github.com/TheiaSurette/thirsttrap.gay/issues/2) | [Upcoming-event homepage with animated word wall](01-event-homepage.md) | None |
| [#3](https://github.com/TheiaSurette/thirsttrap.gay/issues/3) | [Native volunteer applications with reliable Sheets delivery](02-volunteer-intake.md) | None |
| [#4](https://github.com/TheiaSurette/thirsttrap.gay/issues/4) | [DJ, drag, vendor, and multi-role applications](03-multi-role-intake.md) | [#3](https://github.com/TheiaSurette/thirsttrap.gay/issues/3) |
| [#5](https://github.com/TheiaSurette/thirsttrap.gay/issues/5) | [Team email notifications with independent recovery](04-team-notifications.md) | [#3](https://github.com/TheiaSurette/thirsttrap.gay/issues/3) |

The current unblocked work is #2 (event homepage) and #3 (native volunteer applications). After #3 is complete, #4 (multi-role applications) and #5 (team notifications) can proceed independently. Dependencies are recorded in both issue bodies and GitHub's native blocking relationships. Each issue links to the parent spec without changing it.

Each ticket includes its own user-visible behavior, integration work, and verification. The confirmed test boundaries remain event discovery and public application intake, with a small browser suite above them. No separate prefactoring or final-QA ticket is needed.

The application ticket creates working Get involved entry points in the public layout present when it is implemented. The homepage ticket preserves any already-landed application links; neither introduces dead links while waiting for the other.

Google write credentials, an isolated Google test destination, verified email sender configuration, and any technical delivery persistence remain explicit implementation prerequisites. Missing external setup is not counted as a completed integration.

Use GitHub for ongoing issue status and changes. These local files are publication snapshots, not a second tracker. Implementation has not started.
