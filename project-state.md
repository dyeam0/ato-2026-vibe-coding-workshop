# Project state

- Project: Alien Tic-Tac-Toe, orange-and-blue Command deck.
- Repository: https://github.com/dyeam0/ato-2026-vibe-coding-workshop
- Delivery branch: main, through PR #2 (fix/random-alien-attacks).
- Version: v1.0.1, random alien attack selection.
- Current stage: random alien attacks implemented and checked in the engine and browser; release prepared.
- Files: index.html, styles.css, engine.js, game.js, favicon.svg, vercel.json, tests/engine.test.cjs, brief/rules, README, and test report.
- Design: blue board and background, orange alien and actions, X for player and O for alien, responsive stacked layout on narrow screens.
- Rules: independent, equally likely Laser/Shield/Claw attacks with 2 health per side, one cell per battle, no automatic opponent turn.
- Verification: 11 automated test groups passed; browser battle win/loss, board win, replay, mid-battle restart, help preservation, and keyboard selection/response checked. See game-test-report.md.
- Hosting: three Yeam Team Vercel projects connected to this repository, all tracking main. See DEPLOYMENTS.md for permanent addresses.
- Development: ato-2026-vibe-coding-workshop-development, automatic builds and domain assignment on each successful push.
- Staging: ato-2026-vibe-coding-workshop-staging, automatic builds with manual Promote to update its permanent address. Initialized with the footer clarification from commit 329fb81.
- Production: ato-2026-vibe-coding-workshop, automatic builds with manual Promote. The existing live game is preserved during setup.
- Release procedure: test development, select the desired commit in the staging project's Deployments and Promote, test staging, then select that same commit in the production project and Promote. These are separate project builds and approvals, not an automatic cross-project promotion chain. Preserve the existing release tags.
- Deferred: physical phone testing, screen-reader testing, optional polish, and the Yeam Team website.
