import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --tg:rgba(46,216,195,0.12);
    --dk:#0C1018; --dkc:#131820; --dks:#1A2030;
    --bdr:rgba(255,255,255,0.07);
    --tp:#F0EDE8; --tm:rgba(240,237,232,0.55); --ts:rgba(240,237,232,0.3);
    --purple:#9B59B6; --pink:#E91E8C; --blue:#3B82F6; --red:#FF5C5C;
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column; overflow-x:hidden;
  }
  .pf-root*,.pf-root*::before,.pf-root*::after{box-sizing:border-box;margin:0;padding:0}

  .pf-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(ellipse 60% 50% at 50% 0%,rgba(245,166,35,0.07) 0%,transparent 55%),
      radial-gradient(ellipse 40% 40% at 10% 90%,rgba(46,216,195,0.04) 0%,transparent 50%)}

  /* TOPBAR */
  .pf-top{position:relative;z-index:10;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;background:rgba(12,16,24,0.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr)}
  .pf-back{width:38px;height:38px;border-radius:10px;background:var(--dks);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--tm);transition:all 0.18s}
  .pf-back:hover{color:var(--tp);border-color:rgba(255,255,255,0.15)}
  .pf-top-title{font-family:'Fraunces',serif;font-size:17px;font-weight:600}
  .pf-edit-btn{padding:7px 16px;border-radius:100px;background:var(--dks);border:1px solid var(--bdr);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s}
  .pf-edit-btn:hover{border-color:rgba(255,255,255,0.15);color:var(--tp)}

  /* BODY */
  .pf-body{position:relative;z-index:10;flex:1;overflow-y:auto;padding:24px 28px 48px;display:flex;flex-direction:column;gap:16px}

  /* HERO CARD */
  .pf-hero{background:var(--dkc);border:1px solid var(--bdr);border-radius:20px;padding:24px;position:relative;overflow:hidden}
  .pf-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--teal))}
  .pf-hero-top{display:flex;align-items:flex-start;gap:16px;margin-bottom:20px}
  .pf-avatar-wrap{position:relative;flex-shrink:0}
  .pf-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#F5A623,#9B59B6);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;color:#fff;border:3px solid rgba(245,166,35,0.4)}
  .pf-avatar-edit{position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:var(--gold);border:2px solid var(--dkc);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px}
  .pf-hero-info{flex:1}
  .pf-name{font-family:'Fraunces',serif;font-size:22px;font-weight:800;letter-spacing:-0.3px;display:flex;align-items:center;gap:8px;margin-bottom:4px}
  .pf-pro-badge{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0C1018;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;letter-spacing:0.5px}
  .pf-handle{font-size:13px;color:var(--ts);margin-bottom:6px}
  .pf-bio{font-size:13px;color:var(--tm);line-height:1.55}
  .pf-streak-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.2);border-radius:100px;padding:4px 12px;font-size:12px;font-weight:600;color:var(--gold);margin-top:8px}

  /* STAT CHIPS */
  .pf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .pf-stat{background:var(--dks);border:1px solid var(--bdr);border-radius:12px;padding:12px 8px;text-align:center}
  .pf-stat-val{font-family:'Fraunces',serif;font-size:20px;font-weight:700;line-height:1}
  .pf-stat-lbl{font-size:9px;color:var(--ts);margin-top:3px;letter-spacing:0.5px;text-transform:uppercase}

  /* PROGRESS BARS */
  .pf-progress-card{background:var(--dkc);border:1px solid var(--bdr);border-radius:16px;padding:18px 20px}
  .pf-progress-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ts);margin-bottom:14px;display:flex;align-items:center;gap:7px}
  .pf-progress-item{margin-bottom:12px}
  .pf-progress-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
  .pf-progress-lbl{color:var(--tm);font-weight:500}
  .pf-progress-pct{font-weight:600}
  .pf-bar{height:6px;border-radius:3px;background:var(--dks);overflow:hidden}
  .pf-fill{height:100%;border-radius:3px;transition:width 1s ease}

  /* SECTION */
  .pf-section{background:var(--dkc);border:1px solid var(--bdr);border-radius:16px;overflow:hidden}
  .pf-section-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ts);padding:14px 18px 10px;border-bottom:1px solid var(--bdr)}

  /* ROW */
  .pf-row{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--bdr);cursor:pointer;transition:background 0.18s}
  .pf-row:last-child{border-bottom:none}
  .pf-row:hover{background:rgba(255,255,255,0.02)}
  .pf-row-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
  .pf-row-info{flex:1}
  .pf-row-label{font-size:14px;font-weight:500}
  .pf-row-sub{font-size:11px;color:var(--ts);margin-top:2px}
  .pf-row-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .pf-row-value{font-size:12px;color:var(--ts)}
  .pf-row-arrow{color:var(--ts);font-size:14px}
  .pf-row-badge{padding:3px 8px;border-radius:100px;font-size:10px;font-weight:600}

  /* TOGGLE */
  .pf-toggle{width:42px;height:24px;border-radius:12px;position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0}
  .pf-toggle.on{background:var(--teal)}
  .pf-toggle.off{background:var(--dks);border:1px solid var(--bdr)}
  .pf-toggle-dot{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.3)}
  .pf-toggle.on .pf-toggle-dot{left:21px}
  .pf-toggle.off .pf-toggle-dot{left:3px}

  /* SUBSCRIPTION CARD */
  .pf-sub-card{background:linear-gradient(135deg,rgba(245,166,35,0.1),rgba(245,166,35,0.03));border:1px solid rgba(245,166,35,0.25);border-radius:16px;padding:20px;position:relative;overflow:hidden}
  .pf-sub-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--gold2))}
  .pf-sub-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
  .pf-sub-name{font-family:'Fraunces',serif;font-size:20px;font-weight:700;margin-bottom:3px}
  .pf-sub-price{font-size:13px;color:var(--tm)}
  .pf-sub-renews{font-size:11px;color:var(--ts);margin-top:2px}
  .pf-sub-features{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
  .pf-sub-feature{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--tm)}
  .pf-sub-check{width:18px;height:18px;border-radius:50%;background:rgba(46,216,195,0.15);color:var(--teal);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0}
  .pf-sub-btn{padding:11px 24px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.18s;box-shadow:0 3px 12px var(--gg)}
  .pf-sub-btn:hover{transform:translateY(-1px);box-shadow:0 5px 18px var(--gg)}

  /* ACHIEVEMENTS */
  .pf-achievements{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .pf-ach{background:var(--dks);border:1px solid var(--bdr);border-radius:12px;padding:12px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:5px}
  .pf-ach.unlocked{border-color:rgba(245,166,35,0.25);background:rgba(245,166,35,0.06)}
  .pf-ach-icon{font-size:24px;filter:grayscale(0.8)}
  .pf-ach.unlocked .pf-ach-icon{filter:grayscale(0)}
  .pf-ach-name{font-size:9px;color:var(--ts);text-align:center;line-height:1.3}
  .pf-ach.unlocked .pf-ach-name{color:var(--gold)}

  /* DANGER ZONE */
  .pf-danger{background:rgba(255,92,92,0.05);border:1px solid rgba(255,92,92,0.15);border-radius:16px;overflow:hidden}
  .pf-danger-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,92,92,0.6);padding:12px 18px 8px}
  .pf-danger-row{display:flex;align-items:center;gap:12px;padding:12px 18px;cursor:pointer;transition:background 0.18s;border-top:1px solid rgba(255,92,92,0.1)}
  .pf-danger-row:hover{background:rgba(255,92,92,0.05)}
  .pf-danger-label{font-size:14px;color:var(--red);flex:1}

  /* SIGN OUT */
  .pf-signout{width:100%;padding:15px;border-radius:14px;background:rgba(255,92,92,0.08);border:1.5px solid rgba(255,92,92,0.2);color:var(--red);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px}
  .pf-signout:hover{background:rgba(255,92,92,0.14);border-color:rgba(255,92,92,0.35)}

  /* EDIT MODAL */
  .pf-modal-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center}
  .pf-modal{width:100%;max-width:600px;background:var(--dkc);border:1px solid var(--bdr);border-radius:24px 24px 0 0;padding:28px 28px 48px;animation:pfSlideUp 0.3s ease;max-height:80vh;overflow-y:auto}
  .pf-modal-handle{width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);margin:0 auto 20px}
  .pf-modal-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;margin-bottom:20px}
  .pf-field{margin-bottom:16px}
  .pf-field-label{font-size:11px;font-weight:600;color:var(--ts);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:7px;display:block}
  .pf-field-input{width:100%;background:var(--dks);border:1.5px solid var(--bdr);border-radius:11px;padding:12px 14px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.18s}
  .pf-field-input:focus{border-color:var(--gold)}
  .pf-field-input::placeholder{color:var(--ts)}
  .pf-modal-actions{display:flex;gap:10px;margin-top:20px}
  .pf-modal-save{flex:1;padding:13px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.18s;box-shadow:0 3px 12px var(--gg)}
  .pf-modal-save:hover{transform:translateY(-1px)}
  .pf-modal-cancel{padding:13px 20px;border-radius:12px;background:var(--dks);border:1px solid var(--bdr);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.18s}
  .pf-modal-cancel:hover{border-color:rgba(255,255,255,0.15);color:var(--tp)}

  /* ANIMATIONS */
  @keyframes pfSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes pfFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

  .pf-body>*{animation:pfFade 0.4s ease both}
  .pf-body>*:nth-child(1){animation-delay:0.03s}
  .pf-body>*:nth-child(2){animation-delay:0.06s}
  .pf-body>*:nth-child(3){animation-delay:0.09s}
  .pf-body>*:nth-child(4){animation-delay:0.12s}
  .pf-body>*:nth-child(5){animation-delay:0.15s}
  .pf-body>*:nth-child(6){animation-delay:0.18s}
  .pf-body>*:nth-child(7){animation-delay:0.21s}
  .pf-body>*:nth-child(8){animation-delay:0.24s}

  @media(max-width:600px){
    .pf-top,.pf-body{padding-left:18px;padding-right:18px}
    .pf-stats{grid-template-columns:repeat(2,1fr)}
    .pf-achievements{grid-template-columns:repeat(4,1fr)}
  }
`;

const ACHIEVEMENTS = [
  {icon:"🔥", name:"7-Day Streak",    unlocked:true},
  {icon:"📓", name:"First Journal",   unlocked:true},
  {icon:"🧘", name:"Calm Master",     unlocked:true},
  {icon:"🎯", name:"Goal Setter",     unlocked:true},
  {icon:"💪", name:"30-Day Streak",   unlocked:false},
  {icon:"🏆", name:"Program Complete",unlocked:false},
  {icon:"⭐", name:"Top Scorer",      unlocked:false},
  {icon:"🦁", name:"Legend",          unlocked:false},
];

const NOTIF_SETTINGS = [
  {key:"daily",    label:"Daily Check-In Reminder",  sub:"Get reminded to check in each day",    default:true},
  {key:"streak",   label:"Streak Alerts",            sub:"Don't let your streak die",            default:true},
  {key:"programs", label:"Program Updates",          sub:"New lessons and milestones",           default:true},
  {key:"calm",     label:"Calm Session Reminders",   sub:"Scheduled breathing sessions",         default:false},
  {key:"insights", label:"Weekly Insights",          sub:"Your growth summary every Sunday",     default:true},
  {key:"tips",     label:"Growth Tips",              sub:"Daily micro-wisdom from your coach",   default:false},
];

const APPEARANCE = [
  {key:"darkmode",   label:"Dark Mode",         sub:"Always on dark theme",          default:true},
  {key:"haptics",    label:"Haptic Feedback",   sub:"Vibrate on interactions",       default:true},
  {key:"animations", label:"Animations",        sub:"Smooth UI transitions",         default:true},
  {key:"compact",    label:"Compact View",      sub:"Show more content on screen",   default:false},
];

const PROGRESS_BARS = [
  {label:"Mindset",    pct:72, color:"#2ED8C3"},
  {label:"Discipline", pct:58, color:"#F5A623"},
  {label:"Calm",       pct:45, color:"#9B59B6"},
  {label:"Purpose",    pct:30, color:"#E91E8C"},
  {label:"Connection", pct:64, color:"#3B82F6"},
];

export default function ProfileScreen({ onBack, onLogout }) {
  const [editOpen,  setEditOpen]  = useState(false);
  const [notifs,    setNotifs]    = useState(() => Object.fromEntries(NOTIF_SETTINGS.map(n=>[n.key,n.default])));
  const [appear,    setAppear]    = useState(() => Object.fromEntries(APPEARANCE.map(a=>[a.key,a.default])));
  const [name,      setName]      = useState("Alex");
  const [handle,    setHandle]    = useState("@alex.tchitaka");
  const [bio,       setBio]       = useState("Building discipline one day at a time. On a mission to become my best self. 🔥");
  const [editName,  setEditName]  = useState(name);
  const [editHandle,setEditHandle]= useState(handle);
  const [editBio,   setEditBio]   = useState(bio);

  const saveEdit = () => {
    setName(editName); setHandle(editHandle); setBio(editBio);
    setEditOpen(false);
  };

  const togNotif = k => setNotifs(n => ({...n,[k]:!n[k]}));
  const togAppear = k => setAppear(a => ({...a,[k]:!a[k]}));

  return (
    <>
      <style>{S}</style>
      <div className="pf-root">
        <div className="pf-bg"/>

        {/* TOPBAR */}
        <div className="pf-top">
          <div className="pf-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div className="pf-top-title">Profile & Settings</div>
          <button className="pf-edit-btn" onClick={() => { setEditName(name); setEditHandle(handle); setEditBio(bio); setEditOpen(true); }}>
            Edit
          </button>
        </div>

        <div className="pf-body">

          {/* HERO */}
          <div className="pf-hero">
            <div className="pf-hero-top">
              <div className="pf-avatar-wrap">
                <div className="pf-avatar">A</div>
                <div className="pf-avatar-edit" onClick={() => setEditOpen(true)}>✏️</div>
              </div>
              <div className="pf-hero-info">
                <div className="pf-name">
                  {name}
                  <span className="pf-pro-badge">PRO</span>
                </div>
                <div className="pf-handle">{handle}</div>
                <div className="pf-bio">{bio}</div>
                <div className="pf-streak-badge">🔥 5-day streak · Joined Mar 2026</div>
              </div>
            </div>
            <div className="pf-stats">
              {[
                {val:"5",   lbl:"Streak",   c:"var(--gold)"},
                {val:"72",  lbl:"Score",    c:"var(--teal)"},
                {val:"17",  lbl:"Check-ins",c:"var(--purple)"},
                {val:"142", lbl:"Words",    c:"var(--gold)"},
              ].map((s,i) => (
                <div className="pf-stat" key={i}>
                  <div className="pf-stat-val" style={{color:s.c}}>{s.val}</div>
                  <div className="pf-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GROWTH PROGRESS */}
          <div className="pf-progress-card">
            <div className="pf-progress-title"><span>📊</span> Growth Progress</div>
            {PROGRESS_BARS.map((p,i) => (
              <div className="pf-progress-item" key={i}>
                <div className="pf-progress-row">
                  <span className="pf-progress-lbl">{p.label}</span>
                  <span className="pf-progress-pct" style={{color:p.color}}>{p.pct}%</span>
                </div>
                <div className="pf-bar">
                  <div className="pf-fill" style={{width:`${p.pct}%`, background:p.color}}/>
                </div>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENTS */}
          <div className="pf-progress-card">
            <div className="pf-progress-title"><span>🏆</span> Achievements</div>
            <div className="pf-achievements">
              {ACHIEVEMENTS.map((a,i) => (
                <div key={i} className={`pf-ach ${a.unlocked?"unlocked":""}`}>
                  <div className="pf-ach-icon">{a.icon}</div>
                  <div className="pf-ach-name">{a.name}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:"12px",color:"var(--ts)",marginTop:"12px",textAlign:"center"}}>
              4 of 8 unlocked · Keep going! 🔥
            </div>
          </div>

          {/* SUBSCRIPTION */}
          <div className="pf-sub-card">
            <div className="pf-sub-top">
              <div>
                <div className="pf-sub-name">Being Tchitaka <span style={{color:"var(--gold)"}}>Pro</span></div>
                <div className="pf-sub-price">$9.99 / month</div>
                <div className="pf-sub-renews">Renews Apr 20, 2026</div>
              </div>
              <div style={{background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"#0C1018",fontSize:"11px",fontWeight:700,padding:"4px 10px",borderRadius:"100px"}}>ACTIVE</div>
            </div>
            <div className="pf-sub-features">
              {["Unlimited programs & lessons","AI-powered daily guidance","All 6 toolkit tools","Priority coach messages","Export your journal"].map((f,i) => (
                <div key={i} className="pf-sub-feature">
                  <div className="pf-sub-check">✓</div>
                  {f}
                </div>
              ))}
            </div>
            <button className="pf-sub-btn">Manage Subscription →</button>
          </div>

          {/* ACCOUNT SETTINGS */}
          <div className="pf-section">
            <div className="pf-section-title">⚙️ Account</div>
            {[
              {icon:"👤",  bg:"rgba(245,166,35,0.15)",  label:"Edit Profile",       sub:"Name, handle, bio, avatar",      value:"",        arrow:true},
              {icon:"🔒",  bg:"rgba(46,216,195,0.15)",   label:"Change Password",    sub:"Last changed 30 days ago",       value:"",        arrow:true},
              {icon:"📧",  bg:"rgba(59,130,246,0.15)",   label:"Email Address",      sub:"alex@example.com",               value:"",        arrow:true},
              {icon:"🌍",  bg:"rgba(155,89,182,0.15)",   label:"Language",           sub:"",                               value:"English", arrow:true},
              {icon:"🕐",  bg:"rgba(245,166,35,0.1)",    label:"Time Zone",          sub:"",                               value:"GMT+2",   arrow:true},
            ].map((r,i) => (
              <div key={i} className="pf-row" onClick={() => i===0 && setEditOpen(true)}>
                <div className="pf-row-icon" style={{background:r.bg}}>{r.icon}</div>
                <div className="pf-row-info">
                  <div className="pf-row-label">{r.label}</div>
                  {r.sub && <div className="pf-row-sub">{r.sub}</div>}
                </div>
                <div className="pf-row-right">
                  {r.value && <span className="pf-row-value">{r.value}</span>}
                  {r.arrow && <span className="pf-row-arrow">›</span>}
                </div>
              </div>
            ))}
          </div>

          {/* NOTIFICATIONS */}
          <div className="pf-section">
            <div className="pf-section-title">🔔 Notifications</div>
            {NOTIF_SETTINGS.map(n => (
              <div key={n.key} className="pf-row" onClick={() => togNotif(n.key)}>
                <div className="pf-row-info">
                  <div className="pf-row-label">{n.label}</div>
                  <div className="pf-row-sub">{n.sub}</div>
                </div>
                <div className={`pf-toggle ${notifs[n.key]?"on":"off"}`}>
                  <div className="pf-toggle-dot"/>
                </div>
              </div>
            ))}
          </div>

          {/* APPEARANCE */}
          <div className="pf-section">
            <div className="pf-section-title">🎨 Appearance</div>
            {APPEARANCE.map(a => (
              <div key={a.key} className="pf-row" onClick={() => togAppear(a.key)}>
                <div className="pf-row-info">
                  <div className="pf-row-label">{a.label}</div>
                  <div className="pf-row-sub">{a.sub}</div>
                </div>
                <div className={`pf-toggle ${appear[a.key]?"on":"off"}`}>
                  <div className="pf-toggle-dot"/>
                </div>
              </div>
            ))}
          </div>

          {/* SUPPORT */}
          <div className="pf-section">
            <div className="pf-section-title">💬 Support</div>
            {[
              {icon:"📖", bg:"rgba(59,130,246,0.15)",   label:"Help Centre",       sub:"FAQs and guides"},
              {icon:"💌", bg:"rgba(46,216,195,0.15)",    label:"Contact Us",        sub:"We reply within 24 hours"},
              {icon:"⭐", bg:"rgba(245,166,35,0.15)",    label:"Rate the App",      sub:"Share your experience"},
              {icon:"🔗", bg:"rgba(155,89,182,0.15)",    label:"Share with Friends", sub:"Spread the growth"},
              {icon:"📄", bg:"rgba(255,255,255,0.05)",   label:"Privacy Policy",    sub:""},
              {icon:"📜", bg:"rgba(255,255,255,0.05)",   label:"Terms of Service",  sub:""},
            ].map((r,i) => (
              <div key={i} className="pf-row">
                <div className="pf-row-icon" style={{background:r.bg}}>{r.icon}</div>
                <div className="pf-row-info">
                  <div className="pf-row-label">{r.label}</div>
                  {r.sub && <div className="pf-row-sub">{r.sub}</div>}
                </div>
                <span className="pf-row-arrow">›</span>
              </div>
            ))}
          </div>

          {/* APP INFO */}
          <div style={{background:"var(--dkc)",border:"1px solid var(--bdr)",borderRadius:"14px",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:"13px",fontWeight:600}}>Being Tchitaka</div>
              <div style={{fontSize:"11px",color:"var(--ts)",marginTop:"2px"}}>Version 1.0.0 · Build 2026.03</div>
            </div>
            <div style={{fontSize:"22px"}}>🌿</div>
          </div>

          {/* DANGER ZONE */}
          <div className="pf-danger">
            <div className="pf-danger-title">Danger Zone</div>
            <div className="pf-danger-row">
              <span className="pf-danger-label">Clear all journal entries</span>
              <span style={{color:"var(--red)",fontSize:"18px"}}>›</span>
            </div>
            <div className="pf-danger-row">
              <span className="pf-danger-label">Reset all progress</span>
              <span style={{color:"var(--red)",fontSize:"18px"}}>›</span>
            </div>
            <div className="pf-danger-row">
              <span className="pf-danger-label">Delete account</span>
              <span style={{color:"var(--red)",fontSize:"18px"}}>›</span>
            </div>
          </div>

          {/* SIGN OUT */}
          <button className="pf-signout" onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>

        </div>

        {/* EDIT PROFILE MODAL */}
        {editOpen && (
          <div className="pf-modal-overlay" onClick={() => setEditOpen(false)}>
            <div className="pf-modal" onClick={e => e.stopPropagation()}>
              <div className="pf-modal-handle"/>
              <div className="pf-modal-title">Edit Profile</div>

              <div className="pf-field">
                <label className="pf-field-label">Display Name</label>
                <input className="pf-field-input" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your name"/>
              </div>
              <div className="pf-field">
                <label className="pf-field-label">Handle</label>
                <input className="pf-field-input" value={editHandle} onChange={e=>setEditHandle(e.target.value)} placeholder="@yourhandle"/>
              </div>
              <div className="pf-field">
                <label className="pf-field-label">Bio</label>
                <input className="pf-field-input" value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Tell your story..."/>
              </div>
              <div className="pf-field">
                <label className="pf-field-label">Avatar Emoji</label>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"4px"}}>
                  {["🦁","🦅","🌊","🔥","⚡","🌙","🌿","💎","🎯","🚀"].map(e=>(
                    <div key={e} style={{width:"40px",height:"40px",borderRadius:"10px",background:"var(--dks)",border:"1.5px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",cursor:"pointer",transition:"all 0.18s"}}
                      onClick={()=>{}}>{e}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pf-modal-actions">
                <button className="pf-modal-cancel" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="pf-modal-save" onClick={saveEdit}>Save Changes ✓</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
