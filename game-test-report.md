# Verification — Alien Tic-Tac-Toe v1

Version: first orange-and-blue Command deck implementation, 2026-10-19.

## Passed — automated rules checks

Run with `node --test tests/engine.test.cjs`: 6 test groups passed.

- All eight winning lines for X and O, full-board draw, and last-cell win precedence.
- All four prescribed battle sequences, single damage per response, immediate battle termination.
- Board locking, occupied-cell rejection, one mark per battle, and repeated-input rejection.
- Full X win, O win, draw, last-cell win, terminal lock, and replay reset through the game engine.
- Restart during a battle clears previous marks, pending cell, health, and feedback; stale actions do nothing.
- Invalid cells, invalid responses, and gameplay before Start are rejected.
- JavaScript syntax check passed for `game.js`.

## Passed — browser checks

Checked the actual static game at http://127.0.0.1:8000/ in the desktop app's in-app browser.

- Instructions before Start; empty board becomes available on Start.
- Correct counter, updated health, disabled response controls, explicit Next exchange.
- Winning battle awards one X, losing battle awards one O; no extra alien placement.
- Three Xs across the top row end the board immediately and show Play again.
- Play again clears the board.
- Restart during battle feedback clears both a previous mark and the in-progress fight.
- Opening and closing help preserves the pending battle, health, feedback, and response lock.
- Enter selects a square; Tab and Enter answer; focus moves to Next exchange.
- Narrow browser layout displays the board and battle in a readable vertical arrangement.

## Not tested

- Physical phone/touchscreen and other browsers.
- Screen-reader announcements with an actual screen reader.
- Vercel deployment and live-hosted experience.
- Full O-win and draw sequences in the browser UI (covered by engine tests).
