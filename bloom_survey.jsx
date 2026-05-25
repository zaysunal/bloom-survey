import { useState, useEffect } from "react";

const PAL = {
  cream:"#F9F6F1", sand:"#F0EBE3", warm:"#E8E2DA",
  text:"#2E2A25", textMid:"#6B6460", textLight:"#A89F95",
  stem:"#5A7247", leaf:"#6B8C56", leafLight:"#8DAF78",
  wrap:"#C9B99A", wrapDark:"#B5A488",
  white:"#FFFFFF", danger:"#C0564E",
  grey:"#C2BBB3", greyLight:"#D5D0C9",
};

const FLOWERS = [
  { id:"peony", label:"Warm coral", petal:"#D4605A", petalDark:"#B84A45", center:"#F2CC8F" },
  { id:"iris", label:"Soft violet", petal:"#9B72AA", petalDark:"#7D5B8C", center:"#F7E8D0" },
  { id:"marigold", label:"Sunny gold", petal:"#E8A838", petalDark:"#CC8F2A", center:"#6B4226" },
  { id:"dahlia", label:"Soft blush", petal:"#D98DA0", petalDark:"#C4707E", center:"#F5E0D0" },
];

const GUESS_RIGHT = [
  "You nailed the color.",
  "That color intuition is on point.",
  "Exactly right. Are you reading the bouquet's mind?",
  "Color match. You might be part flower.",
];
const GUESS_WRONG = [
  "Not that color, but the garden had its own plans.",
  "Different color than you expected. Surprise is the best fertilizer.",
  "Wrong color, right spirit. We love it.",
  "The bouquet chose a different shade. Nature keeps you guessing.",
];
const pick = a => a[Math.floor(Math.random() * a.length)];

const DEFAULT_SURVEYS = [{
  id: "provocative-play-2026",
  title: "A Play That Asks Questions",
  subtitle: "Help us understand what families want from bold, boundary-pushing theater.",
  questions: [
    { id:"q1", text:"Would you bring your family to a play that challenges what children are taught about the world?", options:["Absolutely","I'd consider it","Probably not"] },
    { id:"q2", text:"What matters most to you in a performance made for young audiences?", options:["Brave storytelling","Pure entertainment","Learning moments"] },
    { id:"q3", text:"How do you feel when art sparks unexpected conversations with kids?", options:["I welcome it","It depends on the topic","I prefer to avoid it"] },
  ],
}];

const ADMIN_PASS = "flowers";

async function load(k, fb) { try { const r = await window.storage.get(k); return r?.value ? JSON.parse(r.value) : fb; } catch { return fb; } }
async function save(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch(e) { console.error(e); } }

/* ─── SVG ─── */
function Petals({ cx, cy, count, rx, ry, dist, color, dark }) {
  return Array.from({ length: count }).map((_, i) => (
    <ellipse key={i} cx={cx} cy={cy-dist} rx={rx} ry={ry} fill={color} stroke={dark} strokeWidth="0.8" transform={`rotate(${(360/count)*i},${cx},${cy})`}/>
  ));
}

function BouquetSVG({ answered, blooming, colorOrder=[0,1,2] }) {
  const fd = [{cx:82,cy:115},{cx:150,cy:85},{cx:218,cy:115}];
  const cf = i => FLOWERS[colorOrder[i]];
  const fs = i => ({
    transition:"filter 1.2s ease, opacity 1.2s ease",
    transformOrigin:`${fd[i].cx}px ${fd[i].cy}px`,
    ...(answered[i] ? {
      filter: blooming===i ? "url(#glow)" : "none",
      opacity: 1,
      animation: blooming===i ? "bloomPulse 0.9s ease-out" : "none",
    } : {
      filter: "grayscale(1) brightness(1.3)",
      opacity: 0.5,
    }),
  });
  return (
    <svg viewBox="0 0 300 370" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:260,height:"auto"}}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PAL.stem}/><stop offset="100%" stopColor="#4A6238"/></linearGradient>
      </defs>
      {/* stems - always visible as grey scaffolding */}
      <path d="M82,150 Q95,200 108,285" stroke={answered[0]?"url(#sg)":PAL.greyLight} strokeWidth="4" fill="none" strokeLinecap="round" style={{transition:"stroke 1.2s"}}/>
      <path d="M150,120 Q150,180 150,285" stroke={answered[1]?"url(#sg)":PAL.greyLight} strokeWidth="4.5" fill="none" strokeLinecap="round" style={{transition:"stroke 1.2s"}}/>
      <path d="M218,150 Q205,200 192,285" stroke={answered[2]?"url(#sg)":PAL.greyLight} strokeWidth="4" fill="none" strokeLinecap="round" style={{transition:"stroke 1.2s"}}/>
      {/* leaves */}
      <path d="M95,195 Q75,180 85,165 Q100,175 95,195Z" fill={answered[0]?PAL.leaf:PAL.greyLight} style={{transition:"fill 1.2s"}}/>
      <path d="M155,170 Q175,153 168,140 Q150,152 155,170Z" fill={answered[1]?PAL.leaf:PAL.greyLight} style={{transition:"fill 1.2s"}}/>
      <path d="M205,190 Q225,175 218,162 Q200,172 205,190Z" fill={answered[2]?PAL.leaf:PAL.greyLight} style={{transition:"fill 1.2s"}}/>
      {/* wrap */}
      <path d="M100,270 Q110,260 150,257 Q190,260 200,270 L195,295 Q190,305 150,307 Q110,305 105,295Z" fill={PAL.wrap} stroke={PAL.wrapDark} strokeWidth="1"/>
      <path d="M115,280 Q150,273 185,280" stroke={PAL.wrapDark} strokeWidth="0.8" fill="none"/>
      <path d="M118,290 Q150,288 182,290" stroke={PAL.wrapDark} strokeWidth="0.8" fill="none"/>
      {/* flowers */}
      <g style={fs(0)}><Petals cx={82} cy={115} count={7} rx={13} ry={22} dist={18} color={cf(0).petal} dark={cf(0).petalDark}/><Petals cx={82} cy={115} count={5} rx={9} ry={14} dist={10} color={cf(0).petalDark} dark={cf(0).petalDark}/><circle cx={82} cy={115} r={7} fill={cf(0).center}/></g>
      <g style={fs(1)}><Petals cx={150} cy={85} count={8} rx={16} ry={28} dist={22} color={cf(1).petal} dark={cf(1).petalDark}/><Petals cx={150} cy={85} count={6} rx={10} ry={17} dist={12} color={cf(1).petalDark} dark={cf(1).petalDark}/><circle cx={150} cy={85} r={8} fill={cf(1).center}/></g>
      <g style={fs(2)}><Petals cx={218} cy={115} count={10} rx={10} ry={20} dist={18} color={cf(2).petal} dark={cf(2).petalDark}/><Petals cx={218} cy={115} count={7} rx={7} ry={13} dist={10} color={cf(2).petalDark} dark={cf(2).petalDark}/><circle cx={218} cy={115} r={7} fill={cf(2).center}/></g>
    </svg>
  );
}

function MiniFlower({ x, y, size, color, delay, dur }) {
  return (
    <div style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:size,height:size,animation:`sway ${dur||4}s ease-in-out ${delay||0}s infinite alternate`,pointerEvents:"none",opacity:0.5}}>
      <svg viewBox="0 0 40 40" style={{width:"100%",height:"100%"}}>
        {Array.from({length:6}).map((_,i)=><ellipse key={i} cx={20} cy={10} rx={4} ry={10} fill={color} transform={`rotate(${60*i},20,20)`} opacity={0.8}/>)}
        <circle cx={20} cy={20} r={4} fill={PAL.sand}/>
      </svg>
    </div>
  );
}

function MiniLeaf({ x, y, size, delay, flip }) {
  return <div style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:size,height:size*1.6,borderRadius:"50% 0 50% 50%",background:PAL.leafLight,opacity:0.22,transform:`rotate(${flip?180:30}deg)`,animation:`sway ${5+Math.random()*2}s ease-in-out ${delay||0}s infinite alternate`,pointerEvents:"none"}}/>;
}

function FallingPetal({ delay, x, color }) {
  return <div style={{position:"absolute",left:`${x}%`,top:-20,width:12,height:16,borderRadius:"50% 0 50% 50%",background:color,opacity:0.6,animation:`petalFall ${3+Math.random()*2}s ease-in ${delay}s infinite`,transform:`rotate(${Math.random()*360}deg)`}}/>;
}

/* ═══════════ MAIN ═══════════ */
export default function BloomSurvey() {
  const [view, setView] = useState("landing");
  const [surveys, setSurveys] = useState(DEFAULT_SURVEYS);
  const [activeId, setActiveId] = useState(DEFAULT_SURVEYS[0].id);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answered, setAnswered] = useState([]);
  const [blooming, setBlooming] = useState(-1);
  const [phase, setPhase] = useState("guess");
  const [guessCorrect, setGuessCorrect] = useState(null);
  const [guessMessage, setGuessMessage] = useState("");
  const [guessRecord, setGuessRecord] = useState([]);
  const [guessIds, setGuessIds] = useState([]);
  const [lastGuessId, setLastGuessId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [colorOrder, setColorOrder] = useState([0,1,2]);
  const fc = pos => FLOWERS[colorOrder[pos]];

  const [adminAuth, setAdminAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [adminView, setAdminView] = useState("dash");
  const [resultsSurveyId, setResultsSurveyId] = useState(null);
  const [resultFilter, setResultFilter] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newSub, setNewSub] = useState("");
  const [newQs, setNewQs] = useState([{text:"",options:["","",""]},{text:"",options:["","",""]},{text:"",options:["","",""]}]);

  const activeSurvey = surveys.find(s => s.id === activeId) || surveys[0];

  useEffect(() => { (async () => {
    const s = await load("bloom-surveys", null);
    if (s?.length) setSurveys(s); else await save("bloom-surveys", DEFAULT_SURVEYS);
    const aid = await load("bloom-active-id", DEFAULT_SURVEYS[0].id);
    setActiveId(aid);
    const r = await load("bloom-responses", []);
    setResponses(r);
    setLoading(false);
  })(); }, []);

  const setActive = async id => { setActiveId(id); await save("bloom-active-id", id); };

  const beginSurvey = () => {
    if (!activeSurvey) return;
    setCurrentQ(0); setAnswers({}); setAnswered(activeSurvey.questions.map(()=>false));
    setBlooming(-1); setPhase("guess"); setGuessCorrect(null);
    setGuessRecord([]); setGuessIds([]); setLastGuessId(null); setBusy(false);
    setColorOrder([0,1,2]);
    setView("play");
  };

  const handleGuess = (flowerId) => {
    if (busy) return;
    const guessedIdx = FLOWERS.findIndex(f => f.id === flowerId);
    setGuessIds(prev => [...prev, flowerId]);
    setLastGuessId(flowerId);

    if (currentQ === 0) {
      const remaining = [0,1,2,3].filter(i => i !== guessedIdx).sort(() => Math.random() - 0.5);
      setColorOrder([guessedIdx, remaining[0], remaining[1]]);
      setGuessCorrect(true);
      setGuessMessage(pick(GUESS_RIGHT));
      setGuessRecord(prev => [...prev, true]);
    } else {
      const correct = flowerId === FLOWERS[colorOrder[currentQ]].id;
      setGuessCorrect(correct);
      setGuessMessage(correct ? pick(GUESS_RIGHT) : pick(GUESS_WRONG));
      setGuessRecord(prev => [...prev, correct]);
    }
    setTimeout(() => setPhase("question"), 600);
  };

  const handleAnswer = (qId, answer) => {
    if (busy) return;
    setBusy(true);
    const na = { ...answers, [qId]: answer };
    setAnswers(na);
    const aa = [...answered]; aa[currentQ] = true; setAnswered(aa);
    setBlooming(currentQ);
    setPhase("reaction");

    setTimeout(() => {
      setBlooming(-1);
      if (currentQ < activeSurvey.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setPhase("guess"); setGuessCorrect(null); setBusy(false);
      } else {
        const entry = {
          surveyId: activeSurvey.id, answers: na, completedAt: new Date().toISOString(),
          id: Date.now().toString(36), colorGuesses: [...guessIds], guessResults: [...guessRecord],
        };
        const updated = [...responses, entry];
        setResponses(updated);
        save("bloom-responses", updated);
        setView("complete"); setBusy(false);
      }
    }, 2200);
  };

  const tryLogin = () => {
    if (passInput === ADMIN_PASS) { setAdminAuth(true); setPassError(false); setAdminView("dash"); setView("admin"); }
    else setPassError(true);
  };

  const createSurvey = async () => {
    const qs = newQs.filter(q => q.text.trim()).map((q, i) => ({
      id: `q${i+1}`, text: q.text.trim(), options: q.options.map(o => o.trim()).filter(Boolean),
    }));
    if (!newTitle.trim() || qs.length < 1 || qs.some(q => q.options.length < 2)) return;
    const s = { id: Date.now().toString(36), title: newTitle.trim(), subtitle: newSub.trim(), questions: qs };
    const updated = [...surveys, s];
    setSurveys(updated); await save("bloom-surveys", updated);
    await setActive(s.id);
    setNewTitle(""); setNewSub(""); setNewQs([{text:"",options:["","",""]},{text:"",options:["","",""]},{text:"",options:["","",""]}]);
    setAdminView("dash");
  };

  const deleteSurvey = async id => {
    const updated = surveys.filter(s => s.id !== id);
    setSurveys(updated); await save("bloom-surveys", updated);
    if (activeId === id && updated.length) await setActive(updated[0].id);
  };

  const respondentsOf = sid => responses.filter(r => r.surveyId === sid);

  const getStats = (sid, filter) => {
    let rs = respondentsOf(sid);
    const survey = surveys.find(s => s.id === sid);
    if (!survey || !rs.length) return null;
    if (filter) rs = rs.filter(r => r.answers[filter.qId] === filter.answer);
    const stats = {};
    survey.questions.forEach(q => { stats[q.id] = {}; q.options.forEach(o => { stats[q.id][o] = rs.filter(r => r.answers[q.id] === o).length; }); });
    return { stats, total: rs.length };
  };

  const getColorStats = (sid, filter) => {
    let rs = respondentsOf(sid);
    if (filter) rs = rs.filter(r => r.answers[filter.qId] === filter.answer);
    let correct = 0, total = 0;
    rs.forEach(r => { if (r.guessResults) r.guessResults.forEach(g => { total++; if (g) correct++; }); });
    return { correct, total, responses: rs.length };
  };

  if (loading) return <div style={S.loadWrap}><div style={S.loadDot}/></div>;

  return (
    <div style={S.shell}>
      <style>{CSS}</style>

      {/* LANDING */}
      {view === "landing" && (
        <div style={S.landWrap}>
          <MiniFlower x={6} y={10} size={46} color={FLOWERS[0].petal} delay={0} dur={5}/>
          <MiniFlower x={80} y={5} size={38} color={FLOWERS[1].petal} delay={1.2} dur={4.5}/>
          <MiniFlower x={58} y={76} size={42} color={FLOWERS[2].petal} delay={0.5} dur={5.5}/>
          <MiniFlower x={12} y={70} size={30} color={FLOWERS[3].petal} delay={2} dur={4}/>
          <MiniFlower x={88} y={58} size={28} color={FLOWERS[0].petal} delay={0.8} dur={6}/>
          <MiniFlower x={38} y={6} size={26} color={FLOWERS[3].petal} delay={1.5} dur={4.8}/>
          <MiniFlower x={68} y={88} size={32} color={FLOWERS[2].petal} delay={1.8} dur={5.2}/>
          <MiniFlower x={22} y={42} size={22} color={FLOWERS[1].petal} delay={2.5} dur={5.6}/>
          <MiniLeaf x={25} y={28} size={18} delay={0.3}/>
          <MiniLeaf x={72} y={38} size={14} delay={1} flip/>
          <MiniLeaf x={92} y={20} size={16} delay={2.2}/>
          <MiniLeaf x={3} y={48} size={20} delay={0.7} flip/>
          <MiniLeaf x={48} y={90} size={15} delay={1.6}/>
          <div style={S.landContent}>
            <div style={S.badge}>bloom</div>
            {activeSurvey && <div style={S.surveyPill}>{activeSurvey.title}</div>}
            <h1 style={S.landTitle}>Every answer grows a flower</h1>
            <p style={S.landBody}>{activeSurvey?.subtitle || "Three questions. Three blooms. One bouquet waiting to come alive."}</p>
            <p style={S.landBodySm}>Guess which color appears next. Answer from the heart. Watch your bouquet come to life.</p>
            {activeSurvey ? (
              <button style={S.landBtn} onClick={beginSurvey}>Begin</button>
            ) : (
              <p style={S.landHint}>No active survey right now. Check back soon.</p>
            )}
            <p style={S.landHint}>{activeSurvey ? `${activeSurvey.questions.length} questions. About a minute.` : ""}</p>
          </div>
          <button style={S.hostLink} onClick={() => setView("admin-gate")}>Host login</button>
        </div>
      )}

      {/* PLAY */}
      {view === "play" && activeSurvey && (
        <div style={S.playWrap}>
          <button style={S.backBtn} onClick={() => setView("landing")}>&#8592; Back</button>
          <div style={S.bouquetArea}>
            <div style={{animation:phase==="reaction"?"gentlePulse 2s ease-in-out":"none"}}>
              <BouquetSVG answered={answered} blooming={blooming} colorOrder={colorOrder}/>
            </div>
            <div style={S.bloomCount}>{answered.filter(Boolean).length} of {activeSurvey.questions.length} bloomed</div>
          </div>

          {phase === "guess" && (
            <div key={`g-${currentQ}`} style={{...S.cardArea, animation:"fadeUp 0.45s ease-out"}}>
              <div style={S.phaseLabel}>Round {currentQ+1} of {activeSurvey.questions.length}</div>
              <h2 style={S.guessTitle}>Which color blooms next?</h2>
              <div style={S.swatchGrid}>
                {FLOWERS.map((f, fi) => {
                  const assignedPos = colorOrder.indexOf(fi);
                  const used = assignedPos !== -1 && assignedPos < currentQ;
                  return (
                    <button key={f.id} style={{...S.swatchBtn, opacity:used?0.18:1, pointerEvents:used?"none":"auto"}}
                      onClick={() => handleGuess(f.id)} disabled={used}>
                      <div style={{...S.swatch, background:f.petal}}/>
                      <span style={S.swatchLabel}>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "question" && (
            <div key={`q-${currentQ}`} style={{...S.cardArea, animation:"fadeUp 0.45s ease-out"}}>
              <div style={S.phaseLabel}>Question {currentQ+1}</div>
              <h2 style={S.qText}>{activeSurvey.questions[currentQ].text}</h2>
              <div style={S.optCol}>
                {activeSurvey.questions[currentQ].options.map(opt => (
                  <button key={opt} style={{...S.optBtn, borderColor:fc(currentQ).petal+"50"}}
                    onClick={() => handleAnswer(activeSurvey.questions[currentQ].id, opt)} disabled={busy}>
                    <span style={S.optText}>{opt}</span>
                    <span style={{...S.dot, background:fc(currentQ).petal}}/>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "reaction" && (() => {
            const guessedFlower = FLOWERS.find(f => f.id === lastGuessId);
            const actualFlower = fc(currentQ);
            return (
            <div key={`r-${currentQ}`} style={{...S.cardArea, animation:"fadeUp 0.4s ease-out", textAlign:"center"}}>
              <div style={S.reactionLabel}>Color guess result</div>
              <div style={{
                ...S.reactionBubble,
                background: guessCorrect?"#E8F5E4":"#FFF3E0",
                borderColor: guessCorrect?"#A5D6A0":"#FFCC80",
              }}>
                {guessCorrect ? (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:actualFlower.petal,boxShadow:"0 2px 6px rgba(0,0,0,0.12)"}}/>
                    <div style={S.reactionVerdict}>You picked {actualFlower.label.toLowerCase()} and nailed it</div>
                  </div>
                ) : (
                  <>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:10}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:guessedFlower?.petal||"#ccc",margin:"0 auto 4px",opacity:0.5,boxShadow:"0 2px 6px rgba(0,0,0,0.08)"}}/>
                        <div style={{fontSize:11,color:PAL.textLight}}>Your pick</div>
                      </div>
                      <div style={{fontSize:16,color:PAL.textLight}}>&#8594;</div>
                      <div style={{textAlign:"center"}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:actualFlower.petal,margin:"0 auto 4px",boxShadow:"0 2px 6px rgba(0,0,0,0.12)"}}/>
                        <div style={{fontSize:11,color:PAL.textMid,fontWeight:600}}>Bloomed</div>
                      </div>
                    </div>
                    <div style={S.reactionVerdict}>It was {actualFlower.label.toLowerCase()}</div>
                  </>
                )}
                <div style={S.reactionMsg}>{guessMessage}</div>
              </div>
            </div>
            );
          })()}
        </div>
      )}

      {/* COMPLETE */}
      {view === "complete" && (
        <div style={S.completeWrap}>
          <div style={S.petalBox}>
            {[0,1,2].map(pos => FLOWERS[colorOrder[pos]]).flatMap((f,fi) =>
              [0,1,2].map(pi => <FallingPetal key={`${fi}-${pi}`} delay={fi*0.5+pi*0.8} x={8+Math.random()*84} color={f.petal}/>)
            )}
          </div>
          <div style={{animation:"gentlePulse 3s ease-in-out infinite"}}>
            <BouquetSVG answered={[true,true,true]} blooming={-1} colorOrder={colorOrder}/>
          </div>
          <h1 style={S.completeTitle}>Your bouquet is complete</h1>
          <p style={S.completeGuess}>
            You guessed {guessRecord.filter(Boolean).length} of {guessRecord.length} flower colors correctly.
            {guessRecord.every(Boolean) ? " Perfect intuition." : guessRecord.filter(Boolean).length===0 ? " The garden kept all its secrets." : " Not bad at all."}
          </p>
          <p style={S.completeBody}>
            Thank you for sharing your voice. Every answer helps shape what bold,
            boundary-pushing theater looks like for the families who need it most.
          </p>
          <button style={S.primaryBtn} onClick={() => setView("landing")}>Back to the garden</button>
        </div>
      )}

      {/* ADMIN GATE */}
      {view === "admin-gate" && !adminAuth && (
        <div style={S.pageWrap}>
          <button style={S.backBtn} onClick={() => setView("landing")}>&#8592; Back</button>
          <div style={{maxWidth:340,margin:"60px auto 0",textAlign:"center"}}>
            <div style={S.badge}>host access</div>
            <h1 style={{...S.pageTitle,marginBottom:8}}>Welcome back</h1>
            <p style={{...S.pageSub,marginBottom:28}}>Enter the host password to manage surveys and view results.</p>
            <input type="password" value={passInput} placeholder="Password"
              onChange={e=>{setPassInput(e.target.value);setPassError(false);}}
              onKeyDown={e=>e.key==="Enter"&&tryLogin()}
              style={{...S.input, borderColor:passError?PAL.danger:PAL.warm, textAlign:"center"}}/>
            {passError && <div style={S.errorText}>That password didn't work. Try again.</div>}
            <button style={{...S.primaryBtn,marginTop:16,width:"100%"}} onClick={tryLogin}>Enter</button>
          </div>
        </div>
      )}

      {/* ADMIN DASH */}
      {view === "admin" && adminAuth && adminView === "dash" && (
        <div style={S.pageWrap}>
          <button style={S.backBtn} onClick={() => {setView("landing");setAdminAuth(false);setPassInput("");}}>&#8592; Log out</button>
          <h1 style={S.pageTitle}>Host Dashboard</h1>
          <p style={S.pageSub}>Create surveys, set the active one, track responses.</p>
          <button style={{...S.primaryBtn,marginTop:24,marginBottom:28,width:"100%"}} onClick={() => setAdminView("create")}>Create a new survey</button>
          <div style={S.secLabel}>Your Surveys</div>
          {surveys.map(s => {
            const n = respondentsOf(s.id).length;
            const isActive = s.id === activeId;
            return (
              <div key={s.id} style={{...S.adminCard, borderColor:isActive?FLOWERS[1].petal+"70":PAL.warm}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={S.cardTitle}>{s.title}</span>
                    {isActive && <span style={S.liveBadge}>LIVE</span>}
                  </div>
                  <div style={S.cardMeta}>{s.questions.length} questions / {n} responses</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                  {!isActive && <button style={S.smallBtn} onClick={() => setActive(s.id)}>Set live</button>}
                  {n > 0 && <button style={S.smallBtn} onClick={() => {setResultsSurveyId(s.id);setResultFilter(null);setAdminView("results");}}>Results</button>}
                  <button style={S.smallDanger} onClick={() => deleteSurvey(s.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADMIN CREATE */}
      {view === "admin" && adminAuth && adminView === "create" && (
        <div style={S.pageWrap}>
          <button style={S.backBtn} onClick={() => setAdminView("dash")}>&#8592; Dashboard</button>
          <h1 style={S.pageTitle}>New Survey</h1>
          <p style={{...S.pageSub,marginBottom:24}}>Three questions make one bouquet. Keep it focused.</p>
          <label style={S.label}>Survey title</label>
          <input style={S.input} value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="e.g. Audience Night Feedback"/>
          <label style={S.label}>Short description</label>
          <input style={S.input} value={newSub} onChange={e=>setNewSub(e.target.value)} placeholder="One line shown on the landing page"/>
          {newQs.map((q,qi) => (
            <div key={qi} style={S.qBlock}>
              <div style={{...S.label,display:"flex",alignItems:"center",gap:8,marginTop:0}}>
                <span style={{...S.dot,background:FLOWERS[qi]?.petal||PAL.textLight,width:10,height:10}}/>
                Question {qi+1}
              </div>
              <input style={S.input} value={q.text} placeholder="Your question"
                onChange={e=>{const u=[...newQs];u[qi]={...u[qi],text:e.target.value};setNewQs(u);}}/>
              {q.options.map((o,oi) => (
                <input key={oi} style={{...S.input,fontSize:13,padding:"10px 14px",marginTop:6}} value={o} placeholder={`Option ${oi+1}`}
                  onChange={e=>{const u=[...newQs];u[qi]={...u[qi],options:u[qi].options.map((v,vi)=>vi===oi?e.target.value:v)};setNewQs(u);}}/>
              ))}
            </div>
          ))}
          <button style={{...S.primaryBtn,width:"100%",marginTop:20}} onClick={createSurvey}>Save and set live</button>
        </div>
      )}

      {/* ADMIN RESULTS */}
      {view === "admin" && adminAuth && adminView === "results" && (() => {
        const survey = surveys.find(s => s.id === resultsSurveyId);
        if (!survey) return null;
        const totalCount = respondentsOf(resultsSurveyId).length;
        const result = getStats(resultsSurveyId, resultFilter);
        if (!result) return (
          <div style={S.pageWrap}>
            <button style={S.backBtn} onClick={() => setAdminView("dash")}>&#8592; Dashboard</button>
            <h1 style={S.pageTitle}>{survey.title}</h1>
            <p style={S.noData}>No responses yet</p>
          </div>
        );
        const { stats, total: filteredCount } = result;
        const colorStats = getColorStats(resultsSurveyId, resultFilter);
        const isFiltered = resultFilter !== null;
        return (
          <div style={S.pageWrap}>
            <button style={S.backBtn} onClick={() => setAdminView("dash")}>&#8592; Dashboard</button>
            <h1 style={S.pageTitle}>{survey.title}</h1>
            <div style={{...S.cardMeta, marginBottom:6}}>{totalCount} total responses</div>
            {isFiltered && (
              <div style={S.filterChip}>
                <span style={S.filterChipText}>Showing {filteredCount} of {totalCount} who answered "{resultFilter.answer}"</span>
                <button style={S.filterClear} onClick={() => setResultFilter(null)}>Clear filter</button>
              </div>
            )}
            <div style={{...S.resultCard, marginTop:16, marginBottom:6}}>
              <div style={S.rqLabel}>Color Guessing</div>
              <div style={{fontSize:14,color:PAL.textMid,lineHeight:1.5}}>
                {colorStats.responses > 0 ? (<>Across {colorStats.responses} respondent{colorStats.responses!==1?"s":""}, {colorStats.correct} of {colorStats.total} color guesses were correct ({colorStats.total>0?Math.round((colorStats.correct/colorStats.total)*100):0}%). First guess is always correct by design.</>) : "No color data recorded yet."}
              </div>
            </div>
            {survey.questions.map((q, qi) => {
              const isFilterSource = resultFilter?.qId === q.id;
              return (
                <div key={q.id} style={{...S.resultCard, borderColor:isFilterSource?FLOWERS[qi%4].petal+"60":PAL.warm}}>
                  <div style={S.rqLabel}>Q{qi+1}</div>
                  <div style={S.rqText}>{q.text}</div>
                  {isFilterSource && <div style={{fontSize:11,color:FLOWERS[qi%4].petal,fontWeight:600,marginTop:4,marginBottom:4}}>Filtering by this question</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
                    {q.options.map(opt => {
                      const val = stats?.[q.id]?.[opt]||0;
                      const pct = filteredCount?Math.round((val/filteredCount)*100):0;
                      const isActiveFilter = resultFilter?.qId===q.id && resultFilter?.answer===opt;
                      const barColor = FLOWERS[qi%4].petal;
                      return (
                        <div key={opt} style={{...S.barRow, cursor:isActiveFilter?"default":"pointer", opacity:isFilterSource&&!isActiveFilter?0.4:1}}
                          onClick={() => { if(isActiveFilter) setResultFilter(null); else setResultFilter({qId:q.id, answer:opt}); }}>
                          <div style={S.barLabel}>{opt}</div>
                          <div style={S.barTrack}><div style={{...S.barFill, width:`${pct}%`, background:isActiveFilter?barColor:barColor+"BB", boxShadow:isActiveFilter?`0 0 8px ${barColor}50`:"none"}}/></div>
                          <div style={{...S.barVal, fontWeight:isActiveFilter?700:400}}>{val} ({pct}%)</div>
                        </div>
                      );
                    })}
                  </div>
                  {!isFilterSource && !isFiltered && <div style={{fontSize:11,color:PAL.textLight,marginTop:8,fontStyle:"italic"}}>Tap a bar to filter other questions by that answer</div>}
                </div>
              );
            })}
            <button style={{...S.dangerLink,marginTop:16}} onClick={async () => {
              if(confirm("Clear all responses for this survey?")) {
                const updated = responses.filter(r=>r.surveyId!==resultsSurveyId);
                setResponses(updated); await save("bloom-responses",updated); setResultFilter(null);
              }
            }}>Clear responses for this survey</button>
          </div>
        );
      })()}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
button{cursor:pointer;border:none;background:none;font-family:inherit}
button:active{transform:scale(0.97)}
input{font-family:'DM Sans',sans-serif}
input:focus{outline:none;border-color:#9B72AA !important}
@keyframes bloomPulse{0%{transform:scale(0.82)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
@keyframes petalFall{0%{transform:translateY(0) rotate(0deg);opacity:.6}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes fadeUp{0%{opacity:0;transform:translateY(22px)}100%{opacity:1;transform:translateY(0)}}
@keyframes gentlePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
@keyframes sway{0%{transform:translateY(0) rotate(-3deg)}100%{transform:translateY(-8px) rotate(3deg)}}
`;

const S = {
  shell:{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:`linear-gradient(180deg,${PAL.cream} 0%,${PAL.sand} 100%)`,color:PAL.text,position:"relative",overflow:"hidden"},
  loadWrap:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:PAL.cream},
  loadDot:{width:12,height:12,borderRadius:"50%",background:PAL.textLight,animation:"gentlePulse 1.5s ease-in-out infinite"},
  landWrap:{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"40px 28px",position:"relative",overflow:"hidden",textAlign:"center"},
  landContent:{position:"relative",zIndex:2,maxWidth:380},
  badge:{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,letterSpacing:5,textTransform:"uppercase",color:PAL.textLight,marginBottom:24},
  surveyPill:{display:"inline-block",fontSize:12,fontWeight:600,color:FLOWERS[1].petal,background:FLOWERS[1].petal+"14",borderRadius:20,padding:"6px 18px",marginBottom:20,letterSpacing:0.5},
  landTitle:{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:400,lineHeight:1.2,marginBottom:16,color:PAL.text},
  landBody:{fontSize:15,lineHeight:1.7,color:PAL.textMid,marginBottom:8,maxWidth:340,margin:"0 auto 8px"},
  landBodySm:{fontSize:13,lineHeight:1.6,color:PAL.textLight,marginBottom:32,maxWidth:320,margin:"0 auto 32px",fontStyle:"italic"},
  landBtn:{fontSize:16,fontWeight:600,color:PAL.white,background:FLOWERS[1].petal,borderRadius:12,padding:"16px 56px",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 20px rgba(155,114,170,0.25)"},
  landHint:{fontSize:12,color:PAL.textLight,marginTop:18},
  hostLink:{position:"absolute",bottom:24,right:24,fontSize:12,color:PAL.textLight,textDecoration:"underline",textUnderlineOffset:3,zIndex:3,fontFamily:"'DM Sans',sans-serif"},
  pageWrap:{minHeight:"100vh",padding:"16px 24px 60px",maxWidth:480,margin:"0 auto",width:"100%"},
  backBtn:{fontSize:14,color:PAL.textMid,fontWeight:500,marginBottom:16,padding:"8px 0",fontFamily:"'DM Sans',sans-serif"},
  pageTitle:{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:400,lineHeight:1.2,marginBottom:6},
  pageSub:{fontSize:14,lineHeight:1.6,color:PAL.textLight},
  noData:{fontSize:14,color:"#B5AFA7",fontStyle:"italic",marginTop:20},
  playWrap:{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"14px 22px 36px",maxWidth:480,margin:"0 auto",width:"100%"},
  bouquetArea:{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0 8px"},
  bloomCount:{fontSize:11,color:PAL.textLight,fontWeight:500,letterSpacing:1,textTransform:"uppercase",marginTop:2},
  cardArea:{flex:1,display:"flex",flexDirection:"column",paddingTop:4},
  phaseLabel:{fontSize:11,fontWeight:600,color:PAL.textLight,letterSpacing:1.5,textTransform:"uppercase",textAlign:"center",marginBottom:10},
  guessTitle:{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:400,textAlign:"center",marginBottom:24,color:PAL.text},
  swatchGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,justifyItems:"center",maxWidth:280,margin:"0 auto"},
  swatchBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:10,borderRadius:12,border:"2px solid transparent",transition:"opacity 0.3s"},
  swatch:{width:50,height:50,borderRadius:"50%",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"},
  swatchLabel:{fontSize:12,fontWeight:500,color:PAL.textMid},
  qText:{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:400,lineHeight:1.4,textAlign:"center",color:PAL.text,marginBottom:24,padding:"0 4px"},
  optCol:{display:"flex",flexDirection:"column",gap:12},
  optBtn:{display:"flex",alignItems:"center",justifyContent:"space-between",background:PAL.white,borderRadius:12,padding:"16px 18px",border:"1.5px solid",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.3s"},
  optText:{fontSize:15,fontWeight:500,color:"#3D3833"},
  dot:{width:8,height:8,borderRadius:"50%",opacity:0.5},
  reactionBubble:{borderRadius:14,padding:"20px 24px",border:"1.5px solid",marginBottom:18},
  reactionLabel:{fontSize:11,fontWeight:600,color:PAL.textLight,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12},
  reactionVerdict:{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:6},
  reactionMsg:{fontSize:14,color:PAL.textMid,lineHeight:1.5},
  reactionNote:{fontSize:13,color:PAL.textLight,fontStyle:"italic"},
  completeWrap:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center",position:"relative"},
  petalBox:{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",overflow:"hidden",zIndex:0},
  completeTitle:{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:400,marginBottom:10,position:"relative",zIndex:1},
  completeGuess:{fontSize:14,color:FLOWERS[1].petal,fontWeight:500,marginBottom:12,position:"relative",zIndex:1},
  completeBody:{fontSize:14,lineHeight:1.7,color:PAL.textMid,maxWidth:320,marginBottom:30,position:"relative",zIndex:1},
  primaryBtn:{fontSize:15,fontWeight:600,color:PAL.white,background:FLOWERS[1].petal,borderRadius:11,padding:"15px 36px",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 3px 14px rgba(155,114,170,0.2)",border:"none",cursor:"pointer",position:"relative",zIndex:1},
  input:{width:"100%",fontSize:15,padding:"13px 16px",borderRadius:10,border:`1.5px solid ${PAL.warm}`,background:PAL.white,color:PAL.text},
  errorText:{fontSize:13,color:PAL.danger,marginTop:8},
  label:{fontSize:12,fontWeight:600,color:PAL.textMid,marginBottom:6,marginTop:18,display:"block",letterSpacing:0.5},
  qBlock:{marginTop:20,padding:"16px 18px",background:PAL.white,borderRadius:12,border:`1px solid ${PAL.warm}`},
  secLabel:{fontSize:12,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:PAL.textLight,marginBottom:14},
  adminCard:{display:"flex",alignItems:"flex-start",background:PAL.white,borderRadius:12,padding:"16px 18px",border:"1.5px solid",marginBottom:10,borderColor:PAL.warm},
  cardTitle:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600},
  cardMeta:{fontSize:12,color:PAL.textLight,fontWeight:500},
  liveBadge:{fontSize:10,fontWeight:700,letterSpacing:1.5,color:FLOWERS[1].petal,background:FLOWERS[1].petal+"18",borderRadius:6,padding:"2px 8px"},
  smallBtn:{fontSize:12,fontWeight:600,color:FLOWERS[1].petal,background:FLOWERS[1].petal+"14",borderRadius:8,padding:"6px 14px",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  smallDanger:{fontSize:12,fontWeight:500,color:PAL.danger,textDecoration:"underline",textUnderlineOffset:2,fontFamily:"'DM Sans',sans-serif"},
  resultCard:{background:PAL.white,borderRadius:12,padding:"18px 20px",border:`1px solid ${PAL.warm}`,marginBottom:14},
  rqLabel:{fontSize:11,fontWeight:600,color:PAL.textLight,letterSpacing:1,textTransform:"uppercase",marginBottom:5},
  rqText:{fontSize:14,fontWeight:500,color:"#3D3833",lineHeight:1.5},
  barRow:{display:"flex",alignItems:"center",gap:10,padding:"4px 0",borderRadius:6,transition:"opacity 0.2s"},
  barLabel:{fontSize:12,color:PAL.textMid,width:115,flexShrink:0,textAlign:"right"},
  barTrack:{flex:1,height:10,background:"#EEEAE4",borderRadius:5,overflow:"hidden"},
  barFill:{height:"100%",borderRadius:5,transition:"width 0.6s ease, box-shadow 0.3s",minWidth:2},
  barVal:{fontSize:11,color:PAL.textLight,width:64,flexShrink:0},
  filterChip:{display:"flex",alignItems:"center",gap:10,background:FLOWERS[1].petal+"12",border:`1px solid ${FLOWERS[1].petal}30`,borderRadius:10,padding:"10px 14px",marginTop:12,marginBottom:6,flexWrap:"wrap"},
  filterChipText:{fontSize:13,color:PAL.text,flex:1,minWidth:180},
  filterClear:{fontSize:12,fontWeight:600,color:FLOWERS[1].petal,background:PAL.white,border:`1px solid ${FLOWERS[1].petal}40`,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"},
  dangerLink:{fontSize:13,color:PAL.danger,fontWeight:500,textDecoration:"underline",textUnderlineOffset:3,fontFamily:"'DM Sans',sans-serif"},
};
