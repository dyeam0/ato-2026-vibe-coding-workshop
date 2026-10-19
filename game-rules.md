# Game Rules: Alien Tic-Tac-Toe

## Goal
Win a battle to place X in the selected square. Lose a battle and the alien claims it as O. Complete an X line to win the board. If O completes a line, the aliens win. A full board with no line is a draw.

## Board
- The board has nine cells, numbered left-to-right and top-to-bottom: 1–3, 4–6, 7–9.
- Select one empty cell to begin a battle for that cell. The whole board is locked until the battle resolves.
- An occupied cell cannot be selected.
- One completed battle fills exactly its selected cell. No automatic opponent move follows.
- Winning lines: 1–2–3, 4–5–6, 7–8–9, 1–4–7, 2–5–8, 3–6–9, 1–5–9, and 3–5–7.
- Check for an X or O line before checking whether a full board is a draw.

## Battle
- Every battle starts with Player health 2/2 and Alien health 2/2.
- Alien moves are predictable and reset to Laser at the beginning of each battle: Laser → Shield → Claw.
- Responses: Shield counters Laser; Blast counters Shield; Dodge counters Claw.
- A correct response removes one alien health point. Any other response removes one player health point. Exactly one side loses one point per accepted response; no retaliation or simultaneous damage occurs.
- Accept only one response per exchange. Then disable the response buttons and explain the result.
- If both sides still have health, show an explicit Next exchange button. The next move appears only after it is activated.
- At zero alien health, the player wins the battle immediately. At zero player health, the alien wins immediately. Do not offer Next exchange after a battle ends.
- A battle ends within two or three exchanges. There is no battle draw.
- Resolve its pending cell exactly once: battle win places X; battle loss places O. Evaluate the board immediately.

## Game states and actions
| State | Player sees | Allowed action |
| --- | --- | --- |
| Instructions | Goal, counter guide, Start | Start opens an empty board. No play advances before Start. |
| Choose a cell | Board and instruction to choose an empty square | Selecting one empty cell opens one battle and locks the board. |
| Choose a response | Pending cell, both health totals, announced alien move | Choose one response; apply one damage result. |
| Exchange feedback | Explanation and updated health | Next exchange only if both sides have health. |
| Battle finished; board continues | Awarded cell and battle summary | Return to board; it does not place another mark. |
| Board finished | Final board and win/loss/draw result | Play again clears state and starts a new board. |
| Any active board or battle | Always-available Restart game | Immediately abandon all progress and clear the board and battle. |

## Visual direction
- Use an orange-and-blue space theme, with blue as the main board/background color and orange as the accent for the alien, pending cell, and primary action.
- Maintain readable contrast for text and controls; color is never the only signal for a mark, health change, or game state.
- Build visuals from CSS shapes and text; no downloaded assets are required.

## Controls and feedback
- Use standard buttons for cells, responses, Start, Next exchange, Return to board, Restart game, and Play again.
- Support mouse, touch, and keyboard Tab plus Enter or Space; show visible keyboard focus.
- Give each cell a readable label such as “Row 1, column 2, empty,” updated when occupied.
- State health numerically; never rely on color alone.
- Explain the damage in words, for example: “Shield counters Laser. Alien loses 1 health.” Distinguish winning a battle from winning the board.
- Restart game stays available during battle input and feedback. It clears the whole board and fight; there is no option to abandon one fight while keeping earlier marks.

## Replay reset
Play again clears all nine cells, pending cell, health, exchange number, selected response, and old feedback. A new game starts from the empty board. Restarting repeatedly must not create duplicate actions or stale controls.

## Completion checks
- Win a battle with Shield, Blast; exactly one X appears in the selected square.
- Lose a battle with Blast, Shield; exactly one O appears in the selected square.
- Repeatedly activate a response before Next exchange; only one damage event is accepted.
- Try an occupied cell and try a second cell during a battle; neither starts another battle.
- Check all eight lines, a full-board draw, and a last-cell line that should count as a win rather than a draw.
- Restart during battle feedback; all cells clear and no later mark from the abandoned battle appears.
- Play again after a finished board; all old marks, health, and battle state are gone.
