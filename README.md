# Alien Tic-Tac-Toe · ATO 2026

An orange-and-blue solo browser game built during Mark Hinkle's AI Agents & Vibe Coding workshop. Pick a square, battle an alien, and win three Xs in a row.

## Play locally

Open `index.html` directly in a modern browser, or run this command in the repository:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. No package installation or build is needed.

## Rules

- Select an empty square. The board locks during its battle.
- Each side starts with 2 health. Alien moves follow Laser → Shield → Claw.
- Shield counters Laser; Blast counters Shield; Dodge counters Claw.
- A correct response damages the alien; a wrong response damages you.
- Choose once, then press Next exchange. At zero health, the fight ends immediately.
- Win to claim X; lose to claim O. No automatic opponent move follows.
- Three Xs win, three Os lose; a full board without a line is a draw.
- Restart game clears the entire board and battle. How to play preserves your place.

Use mouse, touch, or keyboard Tab and Enter/Space. The counter guide is always visible.

## Deploy to Vercel

Import this GitHub repository into a Vercel project. Choose **Other** as the framework, leave the build command empty, and use the repository root (`.`) as the output directory. The tracked `vercel.json` provides these settings. A v0 project is optional.

Publishing and any production-branch updates can make changes live. Check the intended branch and project before deploying.

## Check the rules

With Node.js available:

```sh
node --test tests/engine.test.cjs
```

The rules are separated in `engine.js`; browser rendering lives in `game.js` and `styles.css`. See `game-test-report.md` for checks actually completed and `project-state.md` for the current status.

## Course

Game concept and baseline rules: [Mark Hinkle's Vibe Coding for Non-Technical Professionals](https://github.com/mrhinkle/Vibe-Coding-for-Non-Technical-Professionals), particularly [Alien Tic-Tac-Toe](https://github.com/mrhinkle/Vibe-Coding-for-Non-Technical-Professionals/blob/main/docs/alien-tic-tac-toe.md).
