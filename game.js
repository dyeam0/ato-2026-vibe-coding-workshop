(function () {
  'use strict';
  const G = window.AlienGame;
  let state = G.initial();
  const board = document.getElementById('board');
  const battle = document.getElementById('battle');
  const help = document.getElementById('help');
  const announcement = document.getElementById('announcement');
  const alienArt = '<div class="alien" aria-hidden="true"><span class="antenna"></span><span class="antenna second"></span></div>';
  const guide = '<div class="guide" aria-label="Attack counters"><span>Laser → Shield</span><span>Shield → Blast</span><span>Claw → Dodge</span></div>';
  const primary = (label, action) => `<div class="action"><button class="primary" type="button" data-action="${action}">${label}</button></div>`;
  const heading = text => `<h2 id="battle-title" tabindex="-1">${text}</h2>`;
  const health = (label, n, style='') => `<div>${label} <strong>${n}/2</strong><div class="hp ${style}" aria-hidden="true"><i class="${n<1?'empty':''}"></i><i class="${n<2?'empty':''}"></i></div></div>`;
  function resultTitle() { return state.result === 'win' ? 'You won!' : state.result === 'loss' ? 'The aliens won' : 'Draw'; }
  function render() {
    const s = state;
    document.getElementById('claimed').textContent = `${s.board.filter(Boolean).length} / 9 claimed`;
    board.setAttribute('aria-disabled', String(s.stage !== 'board'));
    board.innerHTML = s.board.map((mark,i) => `<button type="button" class="cell ${s.pending===i&&['battle','feedback'].includes(s.stage)?'pending':''} ${s.line.includes(i)?'winline':''}" data-cell="${i}" aria-label="Row ${Math.floor(i/3)+1}, column ${i%3+1}, ${mark || (s.pending===i?'battle in progress':'empty')}" ${s.stage!=='board'||mark?'disabled':''}>${mark==='X'?'<span class="mark-x" aria-hidden="true"></span>':mark==='O'?'<span class="mark-o" aria-hidden="true"></span>':s.pending===i?'<span class="sr-only">Battle in progress</span>':`<small aria-hidden="true">${i+1}</small>`}</button>`).join('');
    document.getElementById('board-status').textContent = s.stage==='intro'?'Your mission begins when you press Start.':s.stage==='board'?'Choose an empty square to challenge an alien.':s.stage==='end'?resultTitle():s.stage==='summary'?'Square awarded. Return to the board to continue.':`Board locked · battle for square ${s.pending+1}`;
    document.getElementById('restart-button').hidden = s.stage==='intro';
    if(s.stage==='intro') {
      battle.innerHTML = `<div class="panel-head"><strong>Mission briefing</strong><span>Ready when you are</span></div>${alienArt}${heading('Earth needs three Xs.')}<p class="sub">Choose a square. Counter the alien’s attacks to win it. Two hits decide each battle.</p>${guide}<p class="status">Three Xs win. Three Os lose. A full board without a line is a draw.</p>${primary('Start mission →','start')}`;
    } else if(s.stage==='board') {
      battle.innerHTML = `<div class="panel-head"><strong>Battle station</strong><span>Standby</span></div>${alienArt}${heading('Pick your battleground.')}<p class="sub">Select an empty square on the board. Win the battle to claim it as X.</p>${guide}<div class="action"><p class="sub">Each fight starts with fresh health.<br>You choose every square.</p></div>`;
    } else if(s.stage==='end') {
      const detail=s.result==='win'?'Three Xs aligned. Your corner of the galaxy is safe.':s.result==='loss'?'Three Os aligned. Regroup and try a new mission.':'The sector is contested. Try again for three in a row.';
      battle.innerHTML = `<div class="panel-head"><strong>Mission complete</strong><span>${s.board.filter(Boolean).length} squares claimed</span></div>${alienArt}${heading(resultTitle())}<p class="sub">${detail}</p><p class="status">${s.feedback}</p>${primary('Play again →','restart')}`;
    } else {
      const title=s.stage==='summary'?(s.alien===0?'Battle won. Square claimed!':'Battle lost. Alien claims O.'):s.stage==='feedback'?'Impact confirmed.':`Alien uses ${G.MOVES[s.moveIndex]}`;
      battle.innerHTML = `<div class="panel-head"><strong>Battle for square ${s.pending+1}</strong><span>Exchange ${s.exchange+1}</span></div><div class="healths">${health('You',s.player)}${health('Alien',s.alien,'alien-hp')}</div>${alienArt}${heading(title)}<p class="sub">${s.feedback || 'Choose the response that counters this attack.'}</p><div class="responses">${['Shield','Blast','Dodge'].map((response,i)=>`<button class="response ${s.chosen===response?'chosen':''}" type="button" data-response="${response}" ${s.stage!=='battle'?'disabled':''}><span class="symbol" aria-hidden="true">${['◈','✹','↝'][i]}</span>${response}</button>`).join('')}</div>${guide}${s.stage==='feedback'?primary('Next exchange →','next'):s.stage==='summary'?primary('Return to board →','return'):''}`;
    }
  }
  function dispatch(action) {
    if (help.open) return;
    const next=G.transition(state,action);
    if(next===state) return;
    state=next;render();
    // Move keyboard focus to the next meaningful action after replacing controls.
    let target;
    if(state.stage==='board') target=board.querySelector('button:not(:disabled)');
    else if(['intro','feedback','summary','end'].includes(state.stage)) target=battle.querySelector('[data-action]');
    else target=document.getElementById('battle-title');
    target?.focus({preventScroll:true});
    announcement.textContent=state.stage==='end'?`${state.feedback} ${resultTitle()}`:state.stage==='board'?'Choose an empty square.':`${document.getElementById('battle-title').textContent} ${state.feedback}`;
    if(action.type==='select' && window.matchMedia('(max-width: 650px)').matches) battle.scrollIntoView({block:'nearest',behavior:'instant'});
  }
  board.addEventListener('click',event=>{const cell=event.target.closest('[data-cell]');if(cell&&!cell.disabled)dispatch({type:'select',cell:Number(cell.dataset.cell)});});
  battle.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.disabled)return;if(button.dataset.response)dispatch({type:'answer',response:button.dataset.response});else if(button.dataset.action)dispatch({type:button.dataset.action});});
  document.getElementById('restart-button').addEventListener('click',()=>dispatch({type:'restart'}));
  document.getElementById('help-button').addEventListener('click',()=>help.showModal());
  document.getElementById('close-help').addEventListener('click',()=>help.close());
  document.getElementById('help-restart').addEventListener('click',()=>{help.close();dispatch({type:'restart'});});
  render();
})();
