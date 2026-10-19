/* Game rules with an injectable random source; no DOM, timers, storage, or network. */
(function (root) {
  'use strict';
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const MOVES = ['Laser', 'Shield', 'Claw'];
  const COUNTERS = ['Shield', 'Blast', 'Dodge'];
  function initial(stage = 'intro') {
    return { board: Array(9).fill(''), stage, pending: null, player: 2, alien: 2,
      exchange: 0, moveIndex: null, chosen: '', feedback: '', result: '', line: [] };
  }
  function boardOutcome(board) {
    const line = LINES.find(indices => board[indices[0]] && indices.every(i => board[i] === board[indices[0]]));
    if (line) return { result: board[line[0]] === 'X' ? 'win' : 'loss', line: [...line] };
    return { result: board.every(Boolean) ? 'draw' : '', line: [] };
  }
  function pickMove(random) { return Math.floor(random() * MOVES.length); }
  function beginBattle(random = Math.random) { return { player: 2, alien: 2, exchange: 0, moveIndex: pickMove(random), chosen: '', feedback: '', stage: 'battle' }; }
  function answerBattle(battle, response) {
    if (battle.stage !== 'battle' || !COUNTERS.includes(response)) return battle;
    const correct = response === COUNTERS[battle.moveIndex];
    const next = { ...battle, chosen: response, stage: 'feedback',
      player: battle.player - (correct ? 0 : 1), alien: battle.alien - (correct ? 1 : 0),
      feedback: correct ? `${response} counters ${MOVES[battle.moveIndex]}. Alien loses 1 health.`
        : `${response} does not counter ${MOVES[battle.moveIndex]}. You lose 1 health.` };
    if (next.player === 0 || next.alien === 0) next.stage = 'summary';
    return next;
  }
  function transition(state, action, random = Math.random) {
    if (action.type === 'restart') return initial('board');
    if (action.type === 'start' && state.stage === 'intro') return initial('board');
    if (action.type === 'select' && state.stage === 'board') {
      const i = action.cell;
      if (!Number.isInteger(i) || i < 0 || i > 8 || state.board[i]) return state;
      return { ...state, ...beginBattle(random), pending: i };
    }
    if (action.type === 'answer' && state.stage === 'battle') {
      let next = answerBattle(state, action.response);
      if (next === state || next.stage !== 'summary') return next;
      const board = [...state.board];
      board[state.pending] = next.alien === 0 ? 'X' : 'O';
      const outcome = boardOutcome(board);
      next = { ...next, board, ...outcome };
      if (outcome.result) next.stage = 'end';
      return next;
    }
    if (action.type === 'next' && state.stage === 'feedback') {
      return { ...state, stage: 'battle', exchange: state.exchange + 1, moveIndex: pickMove(random), chosen: '', feedback: '' };
    }
    if (action.type === 'return' && state.stage === 'summary') {
      return { ...state, stage: 'board', pending: null, chosen: '', feedback: '' };
    }
    return state;
  }
  const api = { initial, transition, boardOutcome, beginBattle, answerBattle, LINES, MOVES, COUNTERS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AlienGame = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
