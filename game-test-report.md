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

# Random attack correction — 2026-10-19

## Reproduced

- Live v1.0.0: five fresh battles all displayed Laser then Shield.
- Original engine: 30 fresh battles all selected Laser then Shield. The first workshop specification explicitly prescribed this sequence.

## Changed

Every battle opening and every Next exchange now samples Laser, Shield, or Claw independently with equal probability. The move is stored in state, so answering, rendering feedback, repeated inputs, and opening help cannot reroll it. Counters and feedback use that stored move. Repeats are allowed.

## Passed

- All 11 automated test groups passed: the six original regression groups plus equal-probability boundary checks, every attack/counter combination, all nine possible attack pairs, RNG call timing, and distribution checks.
- Seeded 30,000-battle sample: opening Laser 9,912 / Shield 10,161 / Claw 9,927; second Laser 9,933 / Shield 10,057 / Claw 10,010. All nine transition counts were between 3,220 and 3,439.
- Production Math.random 30,000-battle sample: opening Laser 10,113 / Shield 10,002 / Claw 9,885; second Laser 10,127 / Shield 9,945 / Claw 9,928. Every pair appeared; broad non-flaky distribution bounds passed.
- Browser sample of 30 battles: opening Laser 7 / Shield 9 / Claw 14; second Laser 8 / Shield 12 / Claw 10. All nine attack pairs appeared, including repeated moves.
- Browser: correct counters won a cell; incorrect counters lost a cell; completing cells 1/4/7 won the board; Play again reset to nine empty cells. Opening/closing help preserved the selected Claw attack.
- JavaScript syntax and whitespace checks passed.

The distribution checks demonstrate variety and catch fixed or heavily skewed selection; they do not claim cryptographic randomness or require equal counts in a small play session. Physical phone and screen-reader checks remain untested.
