const { test } = require('node:test');
const assert = require('node:assert/strict');
const G = require('../engine.js');
const act = (s,type,extra={}) => G.transition(s,{type,...extra},()=>s.stage==='feedback'?(s.exchange===0?0.4:0.8):0);
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
    let b=G.beginBattle(()=>0);
    responses.forEach((response,i)=>{if(i)b={...b,stage:'battle',exchange:i,moveIndex:i};b=G.answerBattle(b,response);});
    assert.equal(b.player,player);assert.equal(b.alien,alien);assert.equal(b.stage,'summary');
    assert.strictEqual(G.answerBattle(b,'Shield'),b);
  }
  let b=G.answerBattle(G.beginBattle(()=>0),'Shield');
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

test('random selection covers equal thirds and every move uses its matching counter',()=>{
 for(const [value,index] of [[0,0],[1/3-Number.EPSILON,0],[1/3,1],[2/3-Number.EPSILON,1],[2/3,2],[1-Number.EPSILON,2]]){
  let s=G.transition(G.initial('board'),{type:'select',cell:0},()=>value);
  assert.equal(s.moveIndex,index);
  s=G.transition(s,{type:'answer',response:G.COUNTERS[index]},()=>{throw Error('An answer must not reroll');});
  assert.equal(s.alien,1);assert.equal(s.player,2);
  assert.match(s.feedback,new RegExp(G.MOVES[index]));
 }
 for(let index=0;index<3;index++) for(const response of G.COUNTERS){
  const b=G.beginBattle(()=>index/3);
  const next=G.answerBattle(b,response);
  const correct=response===G.COUNTERS[index];
  assert.equal(next.player,correct?2:1);assert.equal(next.alien,correct?1:2);
 }
});
test('all nine attack transitions, including repeats, are possible',()=>{
 for(let first=0;first<3;first++)for(let second=0;second<3;second++){
  let s=G.transition(G.initial('board'),{type:'select',cell:0},()=>first/3);
  s=G.transition(s,{type:'answer',response:G.COUNTERS[first]});
  s=G.transition(s,{type:'next'},()=>second/3);
  assert.equal(s.moveIndex,second);assert.equal(s.exchange,1);
  s=G.transition(s,{type:'answer',response:G.COUNTERS[second]});
  assert.equal(s.stage,'summary');assert.equal(s.board[0],'X');
 }
});
test('randomness is consumed only for a new battle or next active exchange',()=>{
 let calls=0;const rng=()=>{calls++;return 0.9;};
 let s=G.initial();s=G.transition(s,{type:'start'},rng);assert.equal(calls,0);
 s=G.transition(s,{type:'select',cell:0},rng);assert.equal(calls,1);assert.equal(s.moveIndex,2);
 const fixed=s;assert.strictEqual(G.transition(s,{type:'select',cell:1},rng),fixed);
 s=G.transition(s,{type:'answer',response:'Dodge'},rng);assert.equal(calls,1);
 assert.strictEqual(G.transition(s,{type:'answer',response:'Dodge'},rng),s);assert.equal(calls,1);
 s=G.transition(s,{type:'next'},rng);assert.equal(calls,2);
 s=G.transition(s,{type:'answer',response:'Dodge'},rng);assert.equal(s.stage,'summary');assert.equal(calls,2);
 assert.strictEqual(G.transition(s,{type:'next'},rng),s);assert.equal(calls,2);
 s=G.transition(s,{type:'return'},rng);s=G.transition(s,{type:'restart'},rng);
 assert.deepEqual(s,G.initial('board'));assert.equal(calls,2);
});
function seededRandom(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
function sampleAttacks(random,n){
 const first=[0,0,0],second=[0,0,0],pairs=Array.from({length:3},()=>[0,0,0]);
 for(let i=0;i<n;i++){
  let s=G.transition(G.initial('board'),{type:'select',cell:0},random);
  const a=s.moveIndex;first[a]++;
  s=G.transition(s,{type:'answer',response:G.COUNTERS[a]},random);
  s=G.transition(s,{type:'next'},random);second[s.moveIndex]++;pairs[a][s.moveIndex]++;
 }
 return {first,second,pairs};
}
test('30,000 seeded battles: balanced first/second moves and transitions',()=>{
 const {first,second,pairs}=sampleAttacks(seededRandom(20261019),30000);
 for(const counts of [first,second])for(const count of counts)assert.ok(count>9500&&count<10500,JSON.stringify(counts));
 for(const row of pairs)for(const count of row)assert.ok(count>3000&&count<3700,JSON.stringify(pairs));
 console.log('Seeded sample:',JSON.stringify({first,second,pairs}));
});
test('30,000 production-random battles: no fixed opening or second move',()=>{
 const {first,second,pairs}=sampleAttacks(Math.random,30000);
 // Broad bounds detect a fixed/skewed selection without making a flaky statistical test.
 for(const counts of [first,second])for(const count of counts)assert.ok(count>9000&&count<11000,JSON.stringify(counts));
 for(const row of pairs)for(const count of row)assert.ok(count>2700&&count<4000,JSON.stringify(pairs));
 console.log('Production sample:',JSON.stringify({first,second,pairs}));
});
