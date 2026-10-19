const { test } = require('node:test');
const assert = require('node:assert/strict');
const G = require('../engine.js');
const act = (s,type,extra={}) => G.transition(s,{type,...extra});
function playCell(s, cell, responses) {
  s=act(s,'select',{cell});
  responses.forEach((response,i)=>{if(i)s=act(s,'next');s=act(s,'answer',{response});});
  return s;
}
test('board rules: all eight lines for both sides, draw, and last-cell win',()=>{
  for(const mark of ['X','O']) for(const line of G.LINES){const b=Array(9).fill('');line.forEach(i=>b[i]=mark);assert.equal(G.boardOutcome(b).result,mark==='X'?'win':'loss');}
  assert.equal(G.boardOutcome(['X','O','X','X','O','O','O','X','X']).result,'draw');
  assert.equal(G.boardOutcome(['X','O','O','O','X','X','X','O','X']).result,'win');
});
test('standalone battles: four prescribed outcomes, single damage and immediate ending',()=>{
  for(const [responses,player,alien] of [[['Shield','Blast'],2,0],[['Blast','Shield'],0,2],[['Shield','Shield','Dodge'],1,0],[['Blast','Blast','Blast'],0,1]]){
    let b=G.beginBattle();
    responses.forEach((response,i)=>{if(i)b={...b,stage:'battle',exchange:i};b=G.answerBattle(b,response);});
    assert.equal(b.player,player);assert.equal(b.alien,alien);assert.equal(b.stage,'summary');
    assert.strictEqual(G.answerBattle(b,'Shield'),b);
  }
  let b=G.answerBattle(G.beginBattle(),'Shield');
  assert.equal(b.alien,1);assert.equal(b.player,2);assert.strictEqual(G.answerBattle(b,'Shield'),b);
});
test('integration locks board, awards once, rejects occupied cells and repeated actions',()=>{
  let s=act(G.initial(),'start');s=act(s,'select',{cell:0});
  assert.strictEqual(act(s,'select',{cell:1}),s);
  s=act(s,'answer',{response:'Shield'});assert.strictEqual(act(s,'answer',{response:'Shield'}),s);
  s=act(s,'next');s=act(s,'answer',{response:'Blast'});
  assert.deepEqual(s.board,['X','','','','','','','','']);
  assert.strictEqual(act(s,'answer',{response:'Blast'}),s);
  s=act(s,'return');assert.strictEqual(act(s,'select',{cell:0}),s);
  s=playCell(s,1,['Blast','Shield']);assert.deepEqual(s.board,['X','O','','','','','','','']);
});
test('complete boards: X win, O win, draw, last-cell win and terminal lock',()=>{
 for(const [pattern,result] of [[['X','X','X'],'win'],[['O','O','O'],'loss'],[['X','O','X','X','O','O','O','X','X'],'draw'],[['X','O','O','O','X','X','X','O','X'],'win']]){
  let s=G.initial('board');pattern.forEach((mark,i)=>{s=playCell(s,i,mark==='X'?['Shield','Blast']:['Blast','Shield']);if(s.stage==='summary')s=act(s,'return');});
  assert.equal(s.stage,'end');assert.equal(s.result,result);assert.strictEqual(act(s,'select',{cell:8}),s);
  assert.deepEqual(act(s,'restart'),G.initial('board'));
 }
});
test('restart clears pending battle, prior marks, health and feedback; stale actions do nothing',()=>{
 let s=playCell(G.initial('board'),0,['Shield','Blast']);s=act(s,'return');s=act(s,'select',{cell:1});s=act(s,'answer',{response:'Blast'});
 s=act(s,'restart');assert.deepEqual(s,G.initial('board'));
 for(const type of ['answer','next','return']) assert.strictEqual(act(s,type,{response:'Shield'}),s);
 s=act(s,'select',{cell:7});assert.equal(s.pending,7);assert.equal(s.player,2);assert.equal(s.alien,2);assert.equal(s.exchange,0);
});
test('invalid cells, invalid responses and actions before Start are ignored',()=>{
 const intro=G.initial();assert.strictEqual(act(intro,'select',{cell:0}),intro);
 const s=G.initial('board');for(const cell of [-1,9,1.5,'0',null])assert.strictEqual(act(s,'select',{cell}),s);
 const battle=act(s,'select',{cell:0});assert.strictEqual(act(battle,'answer',{response:'Magic'}),battle);
});
