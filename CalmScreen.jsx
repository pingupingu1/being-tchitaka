import { useState, useEffect, useRef } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .calm-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --teal2:#1ab8a6; --tg:rgba(46,216,195,0.2);
    --dk:#060c18; --dkc:#0d1525; --dks:#121e30;
    --bdr:rgba(255,255,255,0.07);
    --tp:#E8F4F8; --tm:rgba(232,244,248,0.55); --ts:rgba(232,244,248,0.28);
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column;
    overflow:hidden; position:relative;
  }
  .calm-root*,.calm-root*::before,.calm-root*::after{box-sizing:border-box;margin:0;padding:0}

  /* ── DEEP BG ── */
  .calm-bg {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 80% 60% at 50% 20%, rgba(46,216,195,0.08) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(15,30,60,0.9) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 80% 70%, rgba(245,166,35,0.04) 0%, transparent 50%),
      linear-gradient(180deg, #060c18 0%, #080f1e 50%, #060c18 100%);
  }

  /* floating orbs */
  .calm-orb {
    position:fixed; border-radius:50%; pointer-events:none; z-index:0;
    filter:blur(40px); animation:calmFloat 8s ease-in-out infinite;
  }
  .calm-orb-1 { width:300px; height:300px; top:-80px; left:-80px; background:rgba(46,216,195,0.06); animation-delay:0s; }
  .calm-orb-2 { width:200px; height:200px; bottom:100px; right:-60px; background:rgba(245,166,35,0.05); animation-delay:4s; }
  .calm-orb-3 { width:150px; height:150px; top:40%; left:50%; transform:translate(-50%,-50%); background:rgba(46,216,195,0.04); animation-delay:2s; }

  /* ── TOPBAR ── */
  .calm-top {
    position:relative; z-index:10; flex-shrink:0;
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 28px;
  }
  .calm-back {
    width:40px; height:40px; border-radius:12px;
    background:rgba(255,255,255,0.06); border:1px solid var(--bdr);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--tm); transition:all 0.2s;
  }
  .calm-back:hover { background:rgba(255,255,255,0.1); color:var(--tp); }
  .calm-top-title { font-family:'Fraunces',serif; font-size:16px; font-weight:600; letter-spacing:0.2px; }
  .calm-top-menu {
    width:40px; height:40px; border-radius:12px;
    background:rgba(255,255,255,0.06); border:1px solid var(--bdr);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--tm); transition:all 0.2s; gap:3px;
    flex-direction:column;
  }
  .calm-top-menu span { width:4px; height:4px; border-radius:50%; background:currentColor; display:block; }

  /* ── SESSION PICKER ── */
  .calm-sessions {
    position:relative; z-index:10; padding:0 28px 20px;
    display:flex; gap:8px; overflow-x:auto;
    scrollbar-width:none;
  }
  .calm-sessions::-webkit-scrollbar { display:none; }
  .calm-session-pill {
    flex-shrink:0; padding:7px 16px; border-radius:100px;
    background:rgba(255,255,255,0.05); border:1px solid var(--bdr);
    font-size:12px; font-weight:500; color:var(--tm);
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .calm-session-pill:hover { border-color:rgba(46,216,195,0.3); color:var(--teal); }
  .calm-session-pill.active { background:var(--tg); border-color:rgba(46,216,195,0.4); color:var(--teal); }

  /* ── MAIN CONTENT ── */
  .calm-main { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:0 28px 32px; position:relative; z-index:10; }

  /* ── BREATHING RING ── */
  .calm-ring-wrap { position:relative; display:flex; align-items:center; justify-content:center; margin:8px 0 24px; }

  .calm-ring-outer {
    width:220px; height:220px; border-radius:50%;
    background:rgba(46,216,195,0.04);
    border:1px solid rgba(46,216,195,0.1);
    display:flex; align-items:center; justify-content:center;
    position:relative;
  }

  .calm-ring-pulse {
    position:absolute; inset:0; border-radius:50%;
    border:2px solid rgba(46,216,195,0.3);
    animation:calmRingPulse 4s ease-in-out infinite;
  }
  .calm-ring-pulse-2 {
    position:absolute; inset:-12px; border-radius:50%;
    border:1.5px solid rgba(46,216,195,0.15);
    animation:calmRingPulse 4s ease-in-out infinite 0.5s;
  }
  .calm-ring-pulse-3 {
    position:absolute; inset:-24px; border-radius:50%;
    border:1px solid rgba(46,216,195,0.08);
    animation:calmRingPulse 4s ease-in-out infinite 1s;
  }

  .calm-ring-inner {
    width:160px; height:160px; border-radius:50%;
    background:radial-gradient(circle at 40% 35%, rgba(46,216,195,0.15) 0%, rgba(46,216,195,0.05) 60%, transparent 100%);
    border:1.5px solid rgba(46,216,195,0.2);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:4px; cursor:pointer; transition:all 0.3s;
    position:relative; z-index:2;
  }
  .calm-ring-inner:hover { border-color:rgba(46,216,195,0.4); background:radial-gradient(circle at 40% 35%, rgba(46,216,195,0.2) 0%, rgba(46,216,195,0.08) 60%, transparent 100%); }

  .calm-play-icon {
    width:48px; height:48px; border-radius:50%;
    background:linear-gradient(135deg,var(--teal),var(--teal2));
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 20px rgba(46,216,195,0.4); transition:all 0.2s;
  }
  .calm-ring-inner:hover .calm-play-icon { transform:scale(1.05); box-shadow:0 6px 28px rgba(46,216,195,0.5); }

  .calm-ring-label { font-size:12px; color:var(--teal); font-weight:500; margin-top:4px; letter-spacing:0.5px; }
  .calm-ring-session { font-size:10px; color:var(--ts); margin-top:1px; }

  /* ── BREATH GUIDE ── */
  .calm-breath-guide {
    text-align:center; margin-bottom:20px; min-height:32px;
    display:flex; flex-direction:column; align-items:center; gap:4px;
  }
  .calm-breath-phase { font-size:15px; font-weight:600; color:var(--teal); letter-spacing:1px; text-transform:uppercase; }
  .calm-breath-count { font-family:'Fraunces',serif; font-size:28px; font-weight:700; color:var(--tp); line-height:1; }
  .calm-breath-tip { font-size:12px; color:var(--ts); }

  /* ── WAVEFORM ── */
  .calm-wave-wrap { width:100%; margin-bottom:20px; position:relative; height:60px; display:flex; align-items:flex-end; justify-content:center; gap:3px; }
  .calm-wave-bar {
    border-radius:2px; transition:height 0.1s ease;
    background:linear-gradient(180deg,rgba(46,216,195,0.7),rgba(46,216,195,0.2));
  }

  /* ── TIMER ── */
  .calm-timer-row { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:20px; }
  .calm-timer { font-family:'Fraunces',serif; font-size:42px; font-weight:700; letter-spacing:2px; color:var(--tp); line-height:1; }
  .calm-timer-total { font-size:13px; color:var(--ts); text-align:center; margin-top:3px; }

  /* PROGRESS ARC */
  .calm-arc-wrap { position:relative; width:100px; height:100px; }
  .calm-arc-svg { width:100px; height:100px; transform:rotate(-90deg); }
  .calm-arc-bg { fill:none; stroke:rgba(255,255,255,0.06); stroke-width:3; }
  .calm-arc-fill { fill:none; stroke:var(--teal); stroke-width:3; stroke-linecap:round; transition:stroke-dashoffset 1s linear; }
  .calm-arc-timer { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .calm-arc-time { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--tp); line-height:1; }
  .calm-arc-lbl { font-size:9px; color:var(--ts); margin-top:2px; letter-spacing:0.5px; text-transform:uppercase; }

  /* ── CONTROLS ── */
  .calm-controls { display:flex; align-items:center; justify-content:center; gap:20px; margin-bottom:24px; }

  .calm-ctrl-btn {
    width:48px; height:48px; border-radius:14px;
    background:rgba(255,255,255,0.06); border:1px solid var(--bdr);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--tm); transition:all 0.2s;
  }
  .calm-ctrl-btn:hover { background:rgba(255,255,255,0.1); color:var(--tp); border-color:rgba(255,255,255,0.15); }
  .calm-ctrl-btn.active { background:var(--tg); border-color:rgba(46,216,195,0.3); color:var(--teal); }

  .calm-play-btn {
    width:68px; height:68px; border-radius:50%;
    background:linear-gradient(135deg,var(--teal),var(--teal2));
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:#060c18; transition:all 0.2s;
    box-shadow:0 4px 24px rgba(46,216,195,0.4);
    border:none;
  }
  .calm-play-btn:hover { transform:scale(1.06); box-shadow:0 6px 32px rgba(46,216,195,0.5); }
  .calm-play-btn:active { transform:scale(0.97); }

  /* ── VOLUME / SOUNDS ── */
  .calm-sounds-row { width:100%; display:flex; flex-direction:column; gap:10px; }
  .calm-vol-row { display:flex; align-items:center; gap:10px; }
  .calm-vol-icon { font-size:16px; color:var(--ts); flex-shrink:0; }
  .calm-vol-slider { flex:1; height:4px; border-radius:2px; background:rgba(255,255,255,0.08); appearance:none; outline:none; cursor:pointer; accentColor:var(--teal); }
  .calm-vol-slider::-webkit-slider-thumb { appearance:none; width:14px; height:14px; border-radius:50%; background:var(--teal); cursor:pointer; box-shadow:0 0 6px rgba(46,216,195,0.4); }

  .calm-bg-sounds { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; padding:2px 0; }
  .calm-bg-sounds::-webkit-scrollbar { display:none; }
  .calm-sound-chip {
    flex-shrink:0; padding:7px 14px; border-radius:100px;
    background:rgba(255,255,255,0.05); border:1px solid var(--bdr);
    font-size:12px; color:var(--tm); cursor:pointer; transition:all 0.2s;
    display:flex; align-items:center; gap:6px; white-space:nowrap;
  }
  .calm-sound-chip:hover { border-color:rgba(46,216,195,0.3); color:var(--teal); }
  .calm-sound-chip.active { background:var(--tg); border-color:rgba(46,216,195,0.4); color:var(--teal); }

  /* ── SESSION COMPLETE ── */
  .calm-complete {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    flex:1; text-align:center; padding:40px 20px;
    animation:calmFadeUp 0.6s ease;
  }
  .calm-complete-glow {
    width:120px; height:120px; border-radius:50%; margin:0 auto 28px;
    background:radial-gradient(circle,rgba(46,216,195,0.3) 0%,rgba(46,216,195,0.05) 70%,transparent 100%);
    display:flex; align-items:center; justify-content:center;
    animation:calmGlow 2s ease-in-out infinite;
  }
  .calm-complete-emoji { font-size:50px; }
  .calm-complete-title { font-family:'Fraunces',serif; font-size:32px; font-weight:800; letter-spacing:-0.5px; margin-bottom:10px; }
  .calm-complete-title em { font-style:italic; font-weight:300; color:var(--teal); }
  .calm-complete-sub { font-size:15px; color:var(--tm); line-height:1.65; margin-bottom:32px; max-width:340px; }
  .calm-complete-stats { display:flex; gap:12px; margin-bottom:32px; }
  .calm-stat-chip { background:var(--dkc); border:1px solid var(--bdr); border-radius:12px; padding:14px 18px; text-align:center; min-width:90px; }
  .calm-stat-val { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--teal); }
  .calm-stat-lbl { font-size:9px; color:var(--ts); margin-top:3px; letter-spacing:0.5px; text-transform:uppercase; }
  .calm-btn-done {
    padding:15px 40px; border-radius:14px;
    background:linear-gradient(135deg,var(--teal),var(--teal2));
    border:none; color:#060c18;
    font-family:'DM Sans',sans-serif; font-size:16px; font-weight:600;
    cursor:pointer; transition:all 0.2s; box-shadow:0 4px 20px rgba(46,216,195,0.35);
  }
  .calm-btn-done:hover { transform:translateY(-2px); box-shadow:0 6px 28px rgba(46,216,195,0.45); }

  /* ── ANIMATIONS ── */
  @keyframes calmFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
  @keyframes calmRingPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.5} }
  @keyframes calmFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes calmGlow { 0%,100%{box-shadow:0 0 30px rgba(46,216,195,0.2)} 50%{box-shadow:0 0 60px rgba(46,216,195,0.4)} }

  /* BREATH RING ANIMATION when playing */
  .calm-ring-inner.playing {
    animation:calmBreath 8s ease-in-out infinite;
  }
  @keyframes calmBreath {
    0%,100%{transform:scale(1);box-shadow:0 0 0 rgba(46,216,195,0)}
    25%{transform:scale(1.12);box-shadow:0 0 40px rgba(46,216,195,0.2)}
    50%{transform:scale(1.08);box-shadow:0 0 20px rgba(46,216,195,0.1)}
    75%{transform:scale(0.97);box-shadow:0 0 0 rgba(46,216,195,0)}
  }

  /* RESPONSIVE */
  @media(max-width:600px){
    .calm-top,.calm-sessions,.calm-main{padding-left:20px;padding-right:20px}
    .calm-ring-outer{width:180px;height:180px}
    .calm-ring-inner{width:130px;height:130px}
    .calm-timer{font-size:32px}
  }
`;

const SESSIONS = [
  { id:"3min",  label:"3 Min",   seconds:180,  desc:"Quick reset" },
  { id:"5min",  label:"5 Min",   seconds:300,  desc:"Short break" },
  { id:"10min", label:"10 Min",  seconds:600,  desc:"Deep focus" },
  { id:"20min", label:"20 Min",  seconds:1200, desc:"Full session" },
  { id:"sleep", label:"Sleep",   seconds:1800, desc:"Wind down" },
];

const SOUNDS = [
  { id:"rain",   icon:"🌧", label:"Rain" },
  { id:"ocean",  icon:"🌊", label:"Ocean" },
  { id:"forest", icon:"🌿", label:"Forest" },
  { id:"fire",   icon:"🔥", label:"Fire" },
  { id:"white",  icon:"〰️", label:"White noise" },
  { id:"none",   icon:"🔇", label:"None" },
];

const BREATH_PHASES = [
  { phase:"Breathe in", duration:4, tip:"Inhale slowly through your nose" },
  { phase:"Hold",       duration:4, tip:"Hold gently — relax your shoulders" },
  { phase:"Breathe out",duration:6, tip:"Exhale fully through your mouth" },
  { phase:"Hold",       duration:2, tip:"Brief pause before the next breath" },
];

const TOTAL_BREATH = BREATH_PHASES.reduce((a,p) => a + p.duration, 0); // 16s cycle

const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

const NUM_BARS = 40;

export default function CalmScreen({ onBack }) {
  const [sessionId,  setSessionId]  = useState("3min");
  const [playing,    setPlaying]    = useState(false);
  const [elapsed,    setElapsed]    = useState(0);
  const [volume,     setVolume]     = useState(70);
  const [sound,      setSound]      = useState("rain");
  const [muted,      setMuted]      = useState(false);
  const [breathIdx,  setBreathIdx]  = useState(0);
  const [breathSec,  setBreathSec]  = useState(0);
  const [waveBars,   setWaveBars]   = useState(() => Array.from({length:NUM_BARS},()=>8));
  const [completed,  setCompleted]  = useState(false);
  const [sessions,   setSessions]   = useState(0);

  const session = SESSIONS.find(s => s.id === sessionId);
  const remaining = session.seconds - elapsed;
  const progress = elapsed / session.seconds;
  const circumference = 2 * Math.PI * 44; // r=44 on 100px svg

  const timerRef = useRef(null);
  const breathRef = useRef(null);
  const waveRef = useRef(null);

  // Main timer
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= session.seconds) {
            setPlaying(false);
            setCompleted(true);
            setSessions(s => s + 1);
            clearInterval(timerRef.current);
            return session.seconds;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, session.seconds]);

  // Breath cycle
  useEffect(() => {
    if (!playing) return;
    breathRef.current = setInterval(() => {
      setBreathSec(s => {
        const phase = BREATH_PHASES[breathIdx];
        if (s + 1 >= phase.duration) {
          setBreathIdx(i => (i + 1) % BREATH_PHASES.length);
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(breathRef.current);
  }, [playing, breathIdx]);

  // Waveform animation
  useEffect(() => {
    if (!playing) return;
    waveRef.current = setInterval(() => {
      setWaveBars(bars => bars.map((_,i) => {
        const center = NUM_BARS / 2;
        const dist = Math.abs(i - center);
        const base = Math.max(4, 28 - dist * 1.2);
        const noise = (Math.random() - 0.5) * 16;
        return Math.max(4, Math.min(52, base + noise));
      }));
    }, 120);
    return () => clearInterval(waveRef.current);
  }, [playing]);

  const handlePlay = () => {
    if (completed) {
      setCompleted(false); setElapsed(0); setBreathIdx(0); setBreathSec(0);
    }
    setPlaying(p => !p);
  };

  const handleSession = (id) => {
    setSessionId(id); setElapsed(0); setPlaying(false);
    setCompleted(false); setBreathIdx(0); setBreathSec(0);
  };

  const currentBreath = BREATH_PHASES[breathIdx];
  const breathPct = breathSec / currentBreath.duration;

  if (completed) {
    const mins = Math.floor(session.seconds / 60);
    return (
      <>
        <style>{S}</style>
        <div className="calm-root">
          <div className="calm-bg"/>
          <div className="calm-orb calm-orb-1"/>
          <div className="calm-orb calm-orb-2"/>
          <div className="calm-top">
            <div className="calm-back" onClick={onBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </div>
            <div className="calm-top-title">Being Calm</div>
            <div style={{width:40}}/>
          </div>
          <div className="calm-complete">
            <div className="calm-complete-glow">
              <span className="calm-complete-emoji">🌿</span>
            </div>
            <h1 className="calm-complete-title">Session <em>complete.</em></h1>
            <p className="calm-complete-sub">
              You gave yourself {mins} minutes of peace. That's a gift.
              Carry this calm into the rest of your day.
            </p>
            <div className="calm-complete-stats">
              <div className="calm-stat-chip">
                <div className="calm-stat-val">{mins}m</div>
                <div className="calm-stat-lbl">Duration</div>
              </div>
              <div className="calm-stat-chip">
                <div className="calm-stat-val" style={{color:"var(--gold)"}}>{sessions}</div>
                <div className="calm-stat-lbl">Sessions</div>
              </div>
              <div className="calm-stat-chip">
                <div className="calm-stat-val">🔥</div>
                <div className="calm-stat-lbl">Streak</div>
              </div>
            </div>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center"}}>
              <button className="calm-btn-done" onClick={() => { setCompleted(false); setElapsed(0); }}>
                Session again
              </button>
              <button className="calm-btn-done" style={{background:"rgba(255,255,255,0.07)",color:"var(--tm)",boxShadow:"none"}} onClick={onBack}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div className="calm-root">
        <div className="calm-bg"/>
        <div className="calm-orb calm-orb-1"/>
        <div className="calm-orb calm-orb-2"/>
        <div className="calm-orb calm-orb-3"/>

        {/* TOPBAR */}
        <div className="calm-top">
          <div className="calm-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </div>
          <div className="calm-top-title">Being Calm 🌿</div>
          <div className="calm-top-menu">
            <span/><span/><span/>
          </div>
        </div>

        {/* SESSION PICKER */}
        <div className="calm-sessions">
          {SESSIONS.map(s => (
            <div key={s.id}
              className={`calm-session-pill ${sessionId===s.id?"active":""}`}
              onClick={() => handleSession(s.id)}>
              {s.label} · {s.desc}
            </div>
          ))}
        </div>

        {/* MAIN */}
        <div className="calm-main">

          {/* BREATHING RING */}
          <div className="calm-ring-wrap">
            <div className="calm-ring-outer">
              <div className="calm-ring-pulse"/>
              <div className="calm-ring-pulse-2"/>
              <div className="calm-ring-pulse-3"/>
              <div className={`calm-ring-inner ${playing?"playing":""}`} onClick={handlePlay}>
                <div className="calm-play-icon">
                  {playing
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                  }
                </div>
                <div className="calm-ring-label">{playing ? "Pause" : "Begin"}</div>
                <div className="calm-ring-session">{session.label} · {session.desc}</div>
              </div>
            </div>
          </div>

          {/* BREATH GUIDE */}
          <div className="calm-breath-guide">
            {playing ? (
              <>
                <div className="calm-breath-phase">{currentBreath.phase}</div>
                <div className="calm-breath-count">{currentBreath.duration - breathSec}</div>
                <div className="calm-breath-tip">{currentBreath.tip}</div>
              </>
            ) : (
              <>
                <div className="calm-breath-phase" style={{color:"var(--ts)"}}>4-4-6-2 Breathing</div>
                <div className="calm-breath-tip">Press begin to start your session</div>
              </>
            )}
          </div>

          {/* WAVEFORM */}
          <div className="calm-wave-wrap">
            {waveBars.map((h,i) => (
              <div key={i} className="calm-wave-bar"
                style={{
                  height: playing ? `${h}px` : "6px",
                  width: "3px",
                  opacity: playing ? 0.6 + (i / NUM_BARS) * 0.4 : 0.25,
                  transition: "height 0.12s ease, opacity 0.5s",
                }}
              />
            ))}
          </div>

          {/* TIMER + ARC */}
          <div className="calm-timer-row">
            <div>
              <div className="calm-timer">{fmtTime(remaining)}</div>
              <div className="calm-timer-total">of {fmtTime(session.seconds)}</div>
            </div>
            <div className="calm-arc-wrap">
              <svg className="calm-arc-svg" viewBox="0 0 100 100">
                <circle className="calm-arc-bg" cx="50" cy="50" r="44"/>
                <circle className="calm-arc-fill" cx="50" cy="50" r="44"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                />
              </svg>
              <div className="calm-arc-timer">
                <div className="calm-arc-time">{Math.round(progress * 100)}%</div>
                <div className="calm-arc-lbl">Done</div>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="calm-controls">
            {/* Restart */}
            <div className="calm-ctrl-btn" onClick={() => { setElapsed(0); setBreathIdx(0); setBreathSec(0); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
            </div>

            {/* Play/Pause */}
            <button className="calm-play-btn" onClick={handlePlay}>
              {playing
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              }
            </button>

            {/* Mute */}
            <div className={`calm-ctrl-btn ${muted?"active":""}`} onClick={() => setMuted(m => !m)}>
              {muted
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              }
            </div>
          </div>

          {/* VOLUME + BG SOUNDS */}
          <div className="calm-sounds-row">
            <div className="calm-vol-row">
              <span className="calm-vol-icon">🔉</span>
              <input type="range" className="calm-vol-slider" min="0" max="100"
                value={muted ? 0 : volume}
                onChange={e => { setVolume(+e.target.value); setMuted(false); }}
                style={{accentColor:"var(--teal)"}}
              />
              <span className="calm-vol-icon">🔊</span>
            </div>
            <div className="calm-bg-sounds">
              {SOUNDS.map(s => (
                <div key={s.id} className={`calm-sound-chip ${sound===s.id?"active":""}`}
                  onClick={() => setSound(s.id)}>
                  <span>{s.icon}</span>{s.label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
