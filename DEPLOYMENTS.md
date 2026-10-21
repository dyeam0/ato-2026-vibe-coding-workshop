# Development, staging, and production

This workshop deliberately uses three Vercel projects to learn independent release controls. All three connect to the same GitHub repository and track `main`.

| Purpose | Permanent project URL | Update rule |
| --- | --- | --- |
| Development | https://ato-2026-vibe-coding-workshop-development.vercel.app/ | Automatically follows successful builds from main |
| Staging | https://ato-2026-vibe-coding-workshop-staging.vercel.app/ | Changes only when a build is manually promoted in the staging project |
| Production | https://ato-2026-vibe-coding-workshop.vercel.app/ | Changes only when a build is manually promoted in the original project |

## Find the Promote button

1. Open the correct project's Deployments page:
   - [Staging deployments](https://vercel.com/yeam-team/ato-2026-vibe-coding-workshop-staging/deployments)
   - [Production deployments](https://vercel.com/yeam-team/ato-2026-vibe-coding-workshop/deployments)
   - [Development deployments](https://vercel.com/yeam-team/ato-2026-vibe-coding-workshop-development/deployments)
2. Select a Ready build with the Git commit you intend to release. Confirm the project name before proceeding.
3. Open the three-dot menu near Visit, labelled Deployment Actions. Choose Promote.
4. Review the confirmation: it lists the permanent address that will move. Click Promote to complete the release.

Promote is disabled for the build already marked Current. A Ready build awaiting release is marked Staged. Each project has its own Current build.

## Release a change

Push or merge to main. All three projects build it automatically; development's permanent address updates automatically. Test development, note the commit SHA, promote that commit's build in the staging project, test staging, then promote the same commit's build in production when ready.

Promoting staging does not promote production. There is no enforced test or approval dependency between these projects: selecting the same tested commit is a deliberate release step. Each project builds its own deployment from that commit; Vercel's Promote button does not move a deployment across projects.

For another project, one or two Vercel projects may be enough. Automatic release can be enabled independently for each project.

## Settings and Vercel terminology

In each project, Settings → Environments → Production → Branch Tracking tracks main. Auto-assign Custom Production Domains is enabled in development, disabled in staging and production.

Vercel calls the primary environment of every project Production, even when the project's name ends in -development or -staging. Check the project name to distinguish the three destinations. These are three projects, not three named custom environments in one project.

## Addresses, aliases, and builds

The permanent addresses above are commonly called project URLs or domains. They act as aliases pointing to a selected deployment.

Each new deployment gets a unique deployment URL with a generated suffix. It remains tied to that deployment. New builds do not overwrite the old build at its unique URL. Development's alias moves automatically; staging and production aliases move when you Promote.

Vercel also creates branch URLs, which follow the latest successful deployment of a branch. Branch URLs are useful for testing the latest code, but do not use them as the manually controlled staging address.

An unchanged commit can be promoted or rolled back by switching the alias, without editing that deployment's contents. Redeploy creates another deployment. Old deployments and their unique URLs remain available subject to deletion, retention, and access settings.

## Workshop baseline

Development and staging were initialized from commit 329fb81's static game files (including the random-attacks footer note). Production was preserved. A subsequent documentation-only push verifies automatic development release and staged builds in the other two projects, leaving those newer builds ready for the learner to Promote.
