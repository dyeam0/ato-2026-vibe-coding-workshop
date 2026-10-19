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
- Hosting: https://ato-2026-vibe-coding-workshop.vercel.app/ in the existing Yeam Team Vercel project. GitHub is connected; pushes to main build automatically. Auto-assign Custom Production Domains is disabled, so production builds wait for manual promotion.
- Pending change: footer clarification, “Attacks are random. Repeats can happen.” This small change verifies the GitHub build workflow; the user will choose when to Promote in Vercel.
- Release procedure: review the staged build, then manually Promote it in Vercel when approved by the user. The live tagged release is v1.0.1. Preserve the existing v1.0.0 and v1.0.1 tags.
- Deferred: physical phone testing, screen-reader testing, optional polish, and the Yeam Team website.
