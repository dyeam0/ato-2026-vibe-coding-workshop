# Game Brief: Alien Tic-Tac-Toe

## Player and purpose
A casual player who wants a short, understandable browser game. The game demonstrates a familiar tic-tac-toe board with a simple, turn-based alien battle deciding each square.

## Game outcome
The player chooses an empty square and answers a short alien attack. Winning the battle places X in that square; losing places O. The player wins by completing an X line, loses if the aliens complete an O line, and draws if the board fills without a line.

## First version
- One player, one 3-by-3 board, and one battle at a time.
- Each battle starts with two health points for the player and two for the alien.
- The alien cycles through Laser, Shield, Claw; the matching player responses are Shield, Blast, Dodge.
- One accepted response changes exactly one side's health by one point.
- A finished battle resolves its selected square once, then returns to the board or ends the game.
- Restart game clears the board and any current battle.
- Use plain HTML, CSS, and JavaScript, standard buttons, and simple shapes.

## Visual direction
Use an orange-and-blue space theme. Blue should anchor the board and background; orange should highlight the alien, pending cell, and primary actions. Keep text high-contrast and pair color cues with words or symbols so the game remains clear to color-blind players. Use simple CSS shapes; no external artwork is needed.

## Supplied facts and assets
The rules and concept come from Mark Hinkle's Vibe Coding for Non-Technical Professionals course repository. No learner-provided artwork, sound, or other game assets have been supplied; the requested orange-and-blue palette is the visual customization. The current learner repository is `dyeam0/ato-2026-vibe-coding-workshop`; it currently contains only a README.

## Subject and assumptions
This is a fictional game. Assume one player, no accounts, no network play, no saved scores, and no external services. The featured Alien Tic-Tac-Toe concept is the working choice because Mark's course identifies it as the featured game.

## Observable success checks
1. Start shows an empty board and no battle is in progress.
2. Selecting one empty square starts a battle for that square and locks the rest of the board.
3. Correct and incorrect responses apply the stated health change once per exchange.
4. A battle win awards exactly one X; a battle loss awards exactly one O; there is no automatic opponent move.
5. Every row, column, and diagonal is recognized; a full board without a line is a draw.
6. Restart clears all board and battle state, including during a battle.
7. The instructions, health, current move, outcome, and available next action are understandable on laptop and phone.
8. The complete loop is playable: Start → choose square → battle → result → continue or restart.

## Out of scope for the first version
Timers, random attacks, extra attack types, animation effects, sound, accounts, databases, multiplayer, leaderboards, paid APIs, and external asset libraries.
