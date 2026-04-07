import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ob-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --teal-d:rgba(46,216,195,0.15);
    --dk:#0C1018; --dkc:#131820; --dks:#1A2030;
    --bdr:rgba(255,255,255,0.07);
    --tp:#F0EDE8; --tm:rgba(240,237,232,0.55); --ts:rgba(240,237,232,0.3);
    --purple:#9B59B6; --pink:#E91E8C;
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column;
    overflow-x:hidden;
  }
  .ob-root*,.ob-root*::before,.ob-root*::after{box-sizing:border-box;margin:0;padding:0}

  /* BG */
  .ob-bg {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(ellipse 70% 50% at 10% 10%, rgba(245,166,35,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 90% 90%, rgba(46,216,195,0.06) 0%, transparent 55%);
  }

  /* TOPBAR */
  .ob-top {
    position:relative; z-index:10;
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 32px; flex-shrink:0;
  }
  .ob-logo { display:flex; align-items:center; gap:10px; }
  .ob-logo-icon {
    width:34px; height:34px; border-radius:9px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 10px var(--gg);
  }
  .ob-logo-icon svg { width:18px; height:18px; color:#fff; }
  .ob-logo-name { font-family:'Fraunces',serif; font-size:17px; font-weight:600; }
  .ob-logo-name span { color:var(--gold); }
  .ob-skip {
    font-size:13px; color:var(--tm); cursor:pointer;
    background:none; border:none; font-family:'DM Sans',sans-serif;
    padding:6px 14px; border-radius:8px; transition:all 0.18s;
  }
  .ob-skip:hover { color:var(--tp); background:rgba(255,255,255,0.05); }

  /* PROGRESS BAR */
  .ob-progress { padding:0 32px 28px; position:relative; z-index:10; }
  .ob-progress-track {
    height:3px; background:rgba(255,255,255,0.07); border-radius:2px; overflow:hidden;
  }
  .ob-progress-fill {
    height:100%; border-radius:2px;
    background:linear-gradient(90deg,var(--gold),var(--teal));
    transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
  }
  .ob-step-dots { display:flex; justify-content:center; gap:8px; margin-top:14px; }
  .ob-dot {
    width:8px; height:8px; border-radius:50%;
    background:rgba(255,255,255,0.12); transition:all 0.3s;
  }
  .ob-dot.active { background:var(--gold); box-shadow:0 0 8px var(--gold); width:24px; border-radius:4px; }
  .ob-dot.done { background:var(--teal); }

  /* MAIN CONTENT */
  .ob-main {
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:0 32px 40px; position:relative; z-index:10;
  }

  .ob-card {
    width:100%; max-width:560px;
    animation:obFadeUp 0.5s ease both;
  }

  /* STEP HEADER */
  .ob-step-tag {
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(245,166,35,0.1); border:1px solid rgba(245,166,35,0.2);
    border-radius:100px; padding:5px 14px; margin-bottom:20px;
    font-size:11px; color:var(--gold); font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
  }
  .ob-step-tag .ob-tag-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); animation:obPulse 2s infinite; }

  .ob-h1 { font-family:'Fraunces',serif; font-size:clamp(28px,4vw,40px); font-weight:800; line-height:1.1; letter-spacing:-1px; margin-bottom:10px; }
  .ob-h1 em { font-style:italic; font-weight:300; color:var(--gold); }
  .ob-sub { font-size:15px; color:var(--tm); line-height:1.6; margin-bottom:36px; }

  /* FORM ELEMENTS */
  .ob-field { margin-bottom:18px; }
  .ob-label { font-size:12px; font-weight:600; color:var(--tm); letter-spacing:0.5px; text-transform:uppercase; margin-bottom:8px; display:block; }

  .ob-input {
    width:100%; background:var(--dkc); border:1.5px solid var(--bdr);
    border-radius:12px; padding:14px 18px; color:var(--tp);
    font-family:'DM Sans',sans-serif; font-size:16px; outline:none;
    transition:all 0.2s;
  }
  .ob-input::placeholder { color:var(--ts); }
  .ob-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(245,166,35,0.1); background:rgba(245,166,35,0.02); }

  /* CHOICE GRID */
  .ob-choices { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:8px; }
  .ob-choice {
    background:var(--dkc); border:1.5px solid var(--bdr);
    border-radius:14px; padding:16px 14px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:10px;
    text-align:center; transition:all 0.2s; user-select:none;
  }
  .ob-choice:hover { border-color:rgba(245,166,35,0.3); background:rgba(245,166,35,0.04); }
  .ob-choice.sel { border-color:var(--gold); background:rgba(245,166,35,0.08); box-shadow:0 0 0 3px rgba(245,166,35,0.1); }
  .ob-choice-icon { font-size:28px; }
  .ob-choice-label { font-size:13px; font-weight:600; color:var(--tp); }
  .ob-choice-desc { font-size:11px; color:var(--tm); line-height:1.4; }

  /* SINGLE ROW CHOICES */
  .ob-choices-row { display:flex; flex-direction:column; gap:8px; margin-bottom:8px; }
  .ob-choice-row {
    background:var(--dkc); border:1.5px solid var(--bdr);
    border-radius:12px; padding:14px 18px; cursor:pointer;
    display:flex; align-items:center; gap:14px;
    transition:all 0.2s; user-select:none;
  }
  .ob-choice-row:hover { border-color:rgba(245,166,35,0.3); background:rgba(245,166,35,0.03); }
  .ob-choice-row.sel { border-color:var(--gold); background:rgba(245,166,35,0.07); }
  .ob-choice-row-icon { font-size:22px; flex-shrink:0; }
  .ob-choice-row-text { flex:1; }
  .ob-choice-row-label { font-size:14px; font-weight:600; }
  .ob-choice-row-desc { font-size:12px; color:var(--tm); margin-top:2px; }
  .ob-choice-row-check {
    width:20px; height:20px; border-radius:50%; border:2px solid var(--bdr);
    flex-shrink:0; display:flex; align-items:center; justify-content:center;
    transition:all 0.2s; font-size:11px;
  }
  .ob-choice-row.sel .ob-choice-row-check { background:var(--gold); border-color:var(--gold); color:#0C1018; }

  /* SLIDER TRACK */
  .ob-slider-group { margin-bottom:24px; }
  .ob-slider-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .ob-slider-label { font-size:13px; font-weight:600; color:var(--tp); }
  .ob-slider-val {
    font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--gold);
    min-width:32px; text-align:right;
  }
  .ob-slider {
    width:100%; height:6px; border-radius:3px;
    background:var(--dks); appearance:none; outline:none; cursor:pointer;
  }
  .ob-slider::-webkit-slider-thumb {
    appearance:none; width:20px; height:20px; border-radius:50%;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    box-shadow:0 2px 8px var(--gg); cursor:pointer;
    border:2px solid rgba(255,255,255,0.15);
  }
  .ob-slider-labels { display:flex; justify-content:space-between; margin-top:6px; }
  .ob-slider-end { font-size:10px; color:var(--ts); }

  /* STREAK PICKER */
  .ob-streak-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:8px; }
  .ob-streak-opt {
    background:var(--dkc); border:1.5px solid var(--bdr);
    border-radius:12px; padding:14px 8px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:5px;
    text-align:center; transition:all 0.2s; user-select:none;
  }
  .ob-streak-opt:hover { border-color:rgba(245,166,35,0.3); }
  .ob-streak-opt.sel { border-color:var(--gold); background:rgba(245,166,35,0.08); }
  .ob-streak-num { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--gold); }
  .ob-streak-lbl { font-size:10px; color:var(--tm); }

  /* AVATAR PICKER */
  .ob-avatar-grid { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:8px; }
  .ob-av-opt {
    width:56px; height:56px; border-radius:50%; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    font-size:24px; border:2.5px solid var(--bdr); transition:all 0.2s;
    background:var(--dkc);
  }
  .ob-av-opt:hover { border-color:rgba(245,166,35,0.4); transform:scale(1.08); }
  .ob-av-opt.sel { border-color:var(--gold); box-shadow:0 0 0 3px rgba(245,166,35,0.2); transform:scale(1.1); }

  /* WELCOME / COMPLETION */
  .ob-complete { text-align:center; padding:20px 0; }
  .ob-complete-icon {
    width:90px; height:90px; border-radius:50%; margin:0 auto 24px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    display:flex; align-items:center; justify-content:center;
    font-size:40px; box-shadow:0 8px 32px var(--gg);
    animation:obBounce 0.6s ease;
  }
  .ob-complete-title { font-family:'Fraunces',serif; font-size:36px; font-weight:800; letter-spacing:-1px; margin-bottom:12px; }
  .ob-complete-title em { font-style:italic; font-weight:300; color:var(--gold); }
  .ob-complete-sub { font-size:16px; color:var(--tm); line-height:1.65; margin-bottom:32px; max-width:400px; margin-left:auto; margin-right:auto; }
  .ob-stats-row { display:flex; gap:12px; justify-content:center; margin-bottom:36px; }
  .ob-stat-chip {
    background:var(--dkc); border:1px solid var(--bdr);
    border-radius:12px; padding:14px 20px; text-align:center; min-width:100px;
  }
  .ob-stat-chip-val { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--gold); }
  .ob-stat-chip-lbl { font-size:10px; color:var(--ts); margin-top:3px; letter-spacing:0.5px; text-transform:uppercase; }

  /* BUTTONS */
  .ob-btn-row { display:flex; gap:10px; margin-top:8px; }

  .ob-btn-primary {
    flex:1; padding:15px; border-radius:12px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    border:none; color:#0C1018;
    font-family:'DM Sans',sans-serif; font-size:16px; font-weight:600;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.2s; box-shadow:0 4px 20px var(--gg);
  }
  .ob-btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 28px var(--gg); }
  .ob-btn-primary:active { transform:translateY(0); }
  .ob-btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }

  .ob-btn-back {
    padding:15px 20px; border-radius:12px;
    background:var(--dkc); border:1.5px solid var(--bdr);
    color:var(--tm); font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
    cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px;
  }
  .ob-btn-back:hover { border-color:rgba(255,255,255,0.15); color:var(--tp); }

  /* HINT TEXT */
  .ob-hint { font-size:12px; color:var(--ts); text-align:center; margin-top:12px; line-height:1.5; }

  /* ANIMATIONS */
  @keyframes obFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes obPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  @keyframes obBounce { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  /* RESPONSIVE */
  @media(max-width:600px) {
    .ob-top { padding:16px 20px; }
    .ob-progress { padding:0 20px 24px; }
    .ob-main { padding:0 20px 32px; }
    .ob-choices { grid-template-columns:1fr; }
    .ob-streak-grid { grid-template-columns:repeat(2,1fr); }
  }
`;

/* ── DATA ── */
const GOALS = [
  { id:"mindset",     icon:"🧠", label:"Mindset",      desc:"Build mental strength & clarity" },
  { id:"discipline",  icon:"🎯", label:"Discipline",   desc:"Create powerful daily habits" },
  { id:"calm",        icon:"🌿", label:"Calm",         desc:"Reduce stress & find peace" },
  { id:"purpose",     icon:"✨", label:"Purpose",      desc:"Discover your true direction" },
  { id:"relations",   icon:"❤️", label:"Relationships", desc:"Strengthen bonds with others" },
  { id:"growth",      icon:"🚀", label:"Growth",       desc:"Level up every single day" },
];

const TIMES = [
  { id:"morning", icon:"🌅", label:"Morning",    desc:"Start the day with intention" },
  { id:"midday",  icon:"☀️", label:"Midday",     desc:"Refresh & reset at lunch" },
  { id:"evening", icon:"🌙", label:"Evening",    desc:"Reflect before you sleep" },
  { id:"flexible",icon:"⚡", label:"Flexible",   desc:"Whenever the moment is right" },
];

const STREAK_OPTS = [3,5,7,10,14,21,30,66];
const AVATARS = ["🦁","🦅","🌊","🔥","⚡","🌙","🌿","💎"];

const STEPS = [
  { tag:"Step 1 of 5", title:"What's your", titleEm:" name?", sub:"Let's make this personal. What should we call you?" },
  { tag:"Step 2 of 5", title:"What are your", titleEm:" goals?", sub:"Choose up to 3 areas you want to grow in. You can always change these later." },
  { tag:"Step 3 of 5", title:"When do you", titleEm:" check in?", sub:"Pick the time that works best for your daily routine." },
  { tag:"Step 4 of 5", title:"Set your", titleEm:" streak goal.", sub:"How many days do you want to commit to? Start ambitious, stay consistent." },
  { tag:"Step 5 of 5", title:"Pick your", titleEm:" avatar.", sub:"Choose a symbol that represents who you're becoming." },
];

export default function OnboardingScreen({ onComplete }) {
  const [step,    setStep]    = useState(0);
  const [name,    setName]    = useState("");
  const [goals,   setGoals]   = useState([]);
  const [time,    setTime]    = useState("");
  const [streak,  setStreak]  = useState(7);
  const [avatar,  setAvatar]  = useState("");
  const [done,    setDone]    = useState(false);
  const [wakeHr,  setWakeHr]  = useState(7);

  const TOTAL = STEPS.length;
  const progress = ((step + 1) / (TOTAL + 1)) * 100;

  const toggleGoal = id => {
    setGoals(g => g.includes(id) ? g.filter(x => x !== id) : g.length < 3 ? [...g, id] : g);
  };

  const canNext = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return goals.length >= 1;
    if (step === 2) return time !== "";
    if (step === 3) return streak > 0;
    if (step === 4) return avatar !== "";
    return true;
  };

  const next = () => {
    if (step < TOTAL - 1) { setStep(s => s + 1); }
    else { setDone(true); }
  };

  const back = () => { if (step > 0) setStep(s => s - 1); };

  if (done) {
    return (
      <>
        <style>{S}</style>
        <div className="ob-root">
          <div className="ob-bg"/>
          <div className="ob-top">
            <div className="ob-logo">
              <div className="ob-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L8 8H3l3.5 4L5 18l7-3.5L19 18l-1.5-6L21 8h-5L12 2z"/>
                </svg>
              </div>
              <div className="ob-logo-name">Being <span>Tchitaka</span></div>
            </div>
          </div>
          <div className="ob-main">
            <div className="ob-card ob-complete">
              <div className="ob-complete-icon">{avatar || "🔥"}</div>
              <h1 className="ob-complete-title">You're ready,<br/><em>{name}!</em></h1>
              <p className="ob-complete-sub">
                Your Growth OS is set up. Every check-in, every streak, every
                moment of calm — it all starts now.
              </p>
              <div className="ob-stats-row">
                <div className="ob-stat-chip">
                  <div className="ob-stat-chip-val">{streak}</div>
                  <div className="ob-stat-chip-lbl">Day goal</div>
                </div>
                <div className="ob-stat-chip">
                  <div className="ob-stat-chip-val">{goals.length}</div>
                  <div className="ob-stat-chip-lbl">Focus areas</div>
                </div>
                <div className="ob-stat-chip">
                  <div className="ob-stat-chip-val">{avatar}</div>
                  <div className="ob-stat-chip-lbl">Your spirit</div>
                </div>
              </div>
              <div className="ob-btn-row" style={{justifyContent:"center"}}>
                <button className="ob-btn-primary" style={{maxWidth:"320px"}} onClick={onComplete}>
                  Start My Journey →
                </button>
              </div>
              <p className="ob-hint">Your first check-in is waiting. Let's go. 🚀</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const st = STEPS[step];

  return (
    <>
      <style>{S}</style>
      <div className="ob-root">
        <div className="ob-bg"/>

        {/* TOPBAR */}
        <div className="ob-top">
          <div className="ob-logo">
            <div className="ob-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L8 8H3l3.5 4L5 18l7-3.5L19 18l-1.5-6L21 8h-5L12 2z"/>
              </svg>
            </div>
            <div className="ob-logo-name">Being <span>Tchitaka</span></div>
          </div>
          <button className="ob-skip" onClick={onComplete}>Skip setup</button>
        </div>

        {/* PROGRESS */}
        <div className="ob-progress">
          <div className="ob-progress-track">
            <div className="ob-progress-fill" style={{width:`${progress}%`}}/>
          </div>
          <div className="ob-step-dots">
            {STEPS.map((_,i) => (
              <div key={i} className={`ob-dot ${i === step ? "active" : i < step ? "done" : ""}`}/>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="ob-main">
          <div className="ob-card" key={step}>

            <div className="ob-step-tag">
              <span className="ob-tag-dot"/>
              {st.tag}
            </div>

            <h1 className="ob-h1">{st.title}<em>{st.titleEm}</em></h1>
            <p className="ob-sub">{st.sub}</p>

            {/* STEP 0 — NAME */}
            {step === 0 && (
              <div className="ob-field">
                <label className="ob-label">Your first name</label>
                <input
                  className="ob-input"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canNext() && next()}
                  autoFocus
                  maxLength={30}
                />
                {name.length >= 2 && (
                  <p className="ob-hint" style={{textAlign:"left",marginTop:"10px",color:"#2ED8C3"}}>
                    ✓ Welcome, {name}! Great name.
                  </p>
                )}
              </div>
            )}

            {/* STEP 1 — GOALS */}
            {step === 1 && (
              <>
                <div className="ob-choices">
                  {GOALS.map(g => (
                    <div key={g.id} className={`ob-choice ${goals.includes(g.id) ? "sel" : ""}`}
                      onClick={() => toggleGoal(g.id)}>
                      <span className="ob-choice-icon">{g.icon}</span>
                      <span className="ob-choice-label">{g.label}</span>
                      <span className="ob-choice-desc">{g.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="ob-hint">
                  {goals.length === 0 && "Select at least 1 goal"}
                  {goals.length === 1 && "✓ Good start — pick 1 or 2 more"}
                  {goals.length === 2 && "✓ Great — one more for a powerful trio"}
                  {goals.length === 3 && "✓ Perfect trio selected!"}
                </p>
              </>
            )}

            {/* STEP 2 — CHECK-IN TIME */}
            {step === 2 && (
              <div className="ob-choices-row">
                {TIMES.map(t => (
                  <div key={t.id} className={`ob-choice-row ${time === t.id ? "sel" : ""}`}
                    onClick={() => setTime(t.id)}>
                    <span className="ob-choice-row-icon">{t.icon}</span>
                    <div className="ob-choice-row-text">
                      <div className="ob-choice-row-label">{t.label}</div>
                      <div className="ob-choice-row-desc">{t.desc}</div>
                    </div>
                    <div className="ob-choice-row-check">
                      {time === t.id && "✓"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3 — STREAK GOAL */}
            {step === 3 && (
              <>
                <div className="ob-streak-grid">
                  {STREAK_OPTS.map(n => (
                    <div key={n} className={`ob-streak-opt ${streak === n ? "sel" : ""}`}
                      onClick={() => setStreak(n)}>
                      <div className="ob-streak-num">{n}</div>
                      <div className="ob-streak-lbl">days</div>
                    </div>
                  ))}
                </div>
                <p className="ob-hint" style={{marginTop:"16px"}}>
                  {streak <= 5  && "🌱 A gentle start — perfect for building the habit."}
                  {streak > 5  && streak <= 14 && "🔥 Solid commitment — you've got this!"}
                  {streak > 14 && streak <= 30 && "⚡ Ambitious — that's how legends are made."}
                  {streak > 30 && "🏆 Elite level. Your future self thanks you."}
                </p>
              </>
            )}

            {/* STEP 4 — AVATAR */}
            {step === 4 && (
              <>
                <div className="ob-avatar-grid">
                  {AVATARS.map(a => (
                    <div key={a} className={`ob-av-opt ${avatar === a ? "sel" : ""}`}
                      onClick={() => setAvatar(a)}>
                      {a}
                    </div>
                  ))}
                </div>
                {avatar && (
                  <p className="ob-hint" style={{marginTop:"16px",color:"var(--gold)"}}>
                    {avatar} — a powerful symbol for your journey.
                  </p>
                )}
              </>
            )}

            {/* NAV BUTTONS */}
            <div className="ob-btn-row" style={{marginTop:"28px"}}>
              {step > 0 && (
                <button className="ob-btn-back" onClick={back}>
                  ← Back
                </button>
              )}
              <button className="ob-btn-primary" onClick={next} disabled={!canNext()}>
                {step === TOTAL - 1 ? "Complete Setup 🎉" : "Continue →"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
