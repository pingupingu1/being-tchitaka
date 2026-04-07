import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pr-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --tg:rgba(46,216,195,0.12);
    --dk:#0C1018; --dkc:#131820; --dks:#1A2030;
    --bdr:rgba(255,255,255,0.07);
    --tp:#F0EDE8; --tm:rgba(240,237,232,0.55); --ts:rgba(240,237,232,0.3);
    --purple:#9B59B6; --pink:#E91E8C; --blue:#3B82F6;
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column;
    overflow-x:hidden;
  }
  .pr-root*,.pr-root*::before,.pr-root*::after{box-sizing:border-box;margin:0;padding:0}

  .pr-bg{
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(ellipse 60% 40% at 80% 10%,rgba(245,166,35,0.06) 0%,transparent 55%),
      radial-gradient(ellipse 50% 40% at 10% 90%,rgba(155,89,182,0.05) 0%,transparent 55%);
  }

  /* TOPBAR */
  .pr-top{
    position:relative;z-index:10;flex-shrink:0;
    display:flex;align-items:center;justify-content:space-between;
    padding:18px 28px;
    background:rgba(12,16,24,0.8);backdrop-filter:blur(12px);
    border-bottom:1px solid var(--bdr);
  }
  .pr-back{
    width:38px;height:38px;border-radius:10px;
    background:var(--dks);border:1px solid var(--bdr);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;color:var(--tm);transition:all 0.18s;
  }
  .pr-back:hover{color:var(--tp);border-color:rgba(255,255,255,0.15)}
  .pr-top-title{font-family:'Fraunces',serif;font-size:17px;font-weight:600}
  .pr-top-sub{font-size:10px;color:var(--ts);margin-top:1px}
  .pr-top-badge{
    background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.2);
    color:var(--gold);font-size:11px;font-weight:600;
    padding:4px 12px;border-radius:100px;
  }

  /* LIST VIEW */
  .pr-list{position:relative;z-index:10;padding:24px 28px;display:flex;flex-direction:column;gap:16px}

  .pr-section-lbl{
    font-size:10px;font-weight:700;letter-spacing:2.5px;
    text-transform:uppercase;color:var(--ts);margin-bottom:4px;
  }

  /* PROGRAM CARD */
  .pr-card{
    background:var(--dkc);border:1px solid var(--bdr);
    border-radius:18px;overflow:hidden;cursor:pointer;
    transition:all 0.2s;animation:prFade 0.4s ease both;
  }
  .pr-card:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.3)}
  .pr-card:nth-child(1){animation-delay:0.05s}
  .pr-card:nth-child(2){animation-delay:0.1s}
  .pr-card:nth-child(3){animation-delay:0.15s}
  .pr-card:nth-child(4){animation-delay:0.2s}

  .pr-card-header{padding:20px 20px 16px;display:flex;align-items:flex-start;gap:14px}
  .pr-card-icon{
    width:52px;height:52px;border-radius:14px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;font-size:26px;
  }
  .pr-card-info{flex:1}
  .pr-card-name{font-family:'Fraunces',serif;font-size:18px;font-weight:700;margin-bottom:4px}
  .pr-card-meta{font-size:12px;color:var(--ts);display:flex;align-items:center;gap:8px}
  .pr-card-meta span{display:flex;align-items:center;gap:3px}
  .pr-card-lock{
    width:28px;height:28px;border-radius:8px;
    background:rgba(255,255,255,0.05);border:1px solid var(--bdr);
    display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;
  }
  .pr-card-desc{font-size:13px;color:var(--tm);line-height:1.55;padding:0 20px 16px}

  /* PROGRESS BAR */
  .pr-card-progress{padding:0 20px 20px}
  .pr-progress-hdr{display:flex;justify-content:space-between;font-size:11px;margin-bottom:7px}
  .pr-progress-lbl{color:var(--tm);font-weight:500}
  .pr-progress-pct{color:var(--gold);font-weight:600}
  .pr-progress-track{height:5px;background:var(--dks);border-radius:3px;overflow:hidden}
  .pr-progress-fill{height:100%;border-radius:3px;transition:width 1s ease}

  /* TAGS ROW */
  .pr-tags{display:flex;gap:6px;padding:0 20px 18px;flex-wrap:wrap}
  .pr-tag{
    padding:4px 10px;border-radius:100px;font-size:10px;font-weight:600;
    background:rgba(255,255,255,0.05);border:1px solid var(--bdr);color:var(--ts);
  }

  /* START BTN */
  .pr-card-btn{
    margin:0 20px 20px;padding:12px;border-radius:10px;
    border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
    cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;
    transition:all 0.18s;width:calc(100% - 40px);
  }
  .pr-card-btn.primary{
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    color:#0C1018;box-shadow:0 3px 12px var(--gg);
  }
  .pr-card-btn.primary:hover{transform:translateY(-1px);box-shadow:0 5px 18px var(--gg)}
  .pr-card-btn.locked{
    background:rgba(255,255,255,0.04);border:1px solid var(--bdr);
    color:var(--ts);cursor:not-allowed;
  }
  .pr-card-btn.continue{
    background:var(--tg);border:1px solid rgba(46,216,195,0.25);
    color:var(--teal);
  }
  .pr-card-btn.continue:hover{background:rgba(46,216,195,0.18)}

  /* ═══ DETAIL VIEW ═══ */
  .pr-detail{position:relative;z-index:10;display:flex;flex-direction:column;min-height:100vh}

  /* HERO */
  .pr-hero{
    padding:28px 28px 24px;
    display:flex;flex-direction:column;gap:16px;
    position:relative;overflow:hidden;
  }
  .pr-hero::after{
    content:'';position:absolute;inset:0;
    background:linear-gradient(180deg,transparent 60%,var(--dk) 100%);
    pointer-events:none;
  }
  .pr-hero-top{display:flex;align-items:center;gap:16px;position:relative;z-index:1}
  .pr-hero-icon{
    width:72px;height:72px;border-radius:20px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;font-size:36px;
    box-shadow:0 8px 24px rgba(0,0,0,0.3);
  }
  .pr-hero-name{font-family:'Fraunces',serif;font-size:26px;font-weight:800;letter-spacing:-0.5px;margin-bottom:6px}
  .pr-hero-tagline{font-size:14px;color:var(--tm);line-height:1.5}
  .pr-hero-stats{display:flex;gap:10px;position:relative;z-index:1;flex-wrap:wrap}
  .pr-hero-chip{
    background:rgba(255,255,255,0.06);border:1px solid var(--bdr);
    border-radius:10px;padding:10px 14px;text-align:center;
  }
  .pr-hero-chip-val{font-family:'Fraunces',serif;font-size:20px;font-weight:700;line-height:1}
  .pr-hero-chip-lbl{font-size:9px;color:var(--ts);margin-top:3px;letter-spacing:0.5px;text-transform:uppercase}

  /* DETAIL PROGRESS */
  .pr-detail-prog{padding:0 28px 20px;position:relative;z-index:1}
  .pr-detail-prog-hdr{display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px}
  .pr-detail-prog-lbl{color:var(--tm);font-weight:500}
  .pr-detail-prog-pct{font-weight:700}
  .pr-detail-track{height:6px;background:var(--dks);border-radius:3px;overflow:hidden}
  .pr-detail-fill{height:100%;border-radius:3px;transition:width 1s ease}

  /* TABS */
  .pr-tabs{
    display:flex;gap:2px;padding:0 28px 0;
    border-bottom:1px solid var(--bdr);
    position:relative;z-index:1;
  }
  .pr-tab{
    padding:10px 18px;font-size:13px;font-weight:500;
    color:var(--ts);cursor:pointer;transition:all 0.18s;
    border-bottom:2px solid transparent;margin-bottom:-1px;
  }
  .pr-tab:hover{color:var(--tm)}
  .pr-tab.active{color:var(--gold);border-bottom-color:var(--gold)}

  /* LESSONS TAB */
  .pr-lessons{padding:20px 28px;display:flex;flex-direction:column;gap:10px}

  .pr-day-section{margin-bottom:8px}
  .pr-day-label{
    font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;color:var(--ts);
    margin-bottom:8px;display:flex;align-items:center;gap:8px;
  }
  .pr-day-label::after{content:'';flex:1;height:1px;background:var(--bdr)}

  .pr-lesson{
    background:var(--dkc);border:1px solid var(--bdr);
    border-radius:14px;padding:14px 16px;
    display:flex;align-items:center;gap:14px;
    cursor:pointer;transition:all 0.18s;
  }
  .pr-lesson:hover{border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.03)}
  .pr-lesson.locked{opacity:0.5;cursor:not-allowed}
  .pr-lesson.active{border-color:rgba(245,166,35,0.3);background:rgba(245,166,35,0.05)}
  .pr-lesson.done{border-color:rgba(46,216,195,0.2)}

  .pr-lesson-num{
    width:36px;height:36px;border-radius:10px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;font-weight:700;font-family:'Fraunces',serif;
    background:var(--dks);color:var(--ts);transition:all 0.18s;
  }
  .pr-lesson.done .pr-lesson-num{background:rgba(46,216,195,0.15);color:var(--teal)}
  .pr-lesson.active .pr-lesson-num{background:rgba(245,166,35,0.15);color:var(--gold)}

  .pr-lesson-info{flex:1}
  .pr-lesson-title{font-size:14px;font-weight:600;margin-bottom:3px}
  .pr-lesson-meta{font-size:11px;color:var(--ts);display:flex;gap:8px}

  .pr-lesson-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .pr-lesson-dur{font-size:11px;color:var(--ts)}
  .pr-lesson-icon{font-size:16px}

  /* TODAY LESSON HIGHLIGHT */
  .pr-today-lesson{
    background:linear-gradient(135deg,rgba(245,166,35,0.1),rgba(245,166,35,0.03));
    border:1px solid rgba(245,166,35,0.25);
    border-radius:16px;padding:18px 20px;margin-bottom:16px;
    animation:prFade 0.4s ease;
  }
  .pr-today-lbl{font-size:10px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
  .pr-today-title{font-family:'Fraunces',serif;font-size:18px;font-weight:700;margin-bottom:6px}
  .pr-today-desc{font-size:13px;color:var(--tm);line-height:1.55;margin-bottom:14px}
  .pr-today-btn{
    padding:11px 24px;border-radius:10px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    border:none;color:#0C1018;font-family:'DM Sans',sans-serif;
    font-size:13px;font-weight:600;cursor:pointer;
    display:inline-flex;align-items:center;gap:7px;
    transition:all 0.18s;box-shadow:0 3px 12px var(--gg);
  }
  .pr-today-btn:hover{transform:translateY(-1px)}

  /* OVERVIEW TAB */
  .pr-overview{padding:20px 28px;display:flex;flex-direction:column;gap:14px}
  .pr-ov-card{background:var(--dkc);border:1px solid var(--bdr);border-radius:14px;padding:16px 18px}
  .pr-ov-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ts);margin-bottom:12px}
  .pr-ov-text{font-size:13px;color:var(--tm);line-height:1.65}
  .pr-ov-list{display:flex;flex-direction:column;gap:8px}
  .pr-ov-item{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--tm);line-height:1.5}
  .pr-ov-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:6px}
  .pr-streak-row{display:flex;gap:4px;flex-wrap:wrap}
  .pr-streak-day{
    width:28px;height:28px;border-radius:7px;
    display:flex;align-items:center;justify-content:center;font-size:11px;
    background:var(--dks);color:var(--ts);transition:all 0.18s;
  }
  .pr-streak-day.done{background:rgba(46,216,195,0.15);color:var(--teal)}
  .pr-streak-day.today{background:rgba(245,166,35,0.15);color:var(--gold);font-weight:700}

  /* BOTTOM CTA */
  .pr-detail-cta{
    padding:16px 28px 32px;position:sticky;bottom:0;
    background:linear-gradient(0deg,var(--dk) 70%,transparent 100%);
    z-index:10;
  }
  .pr-cta-btn{
    width:100%;padding:15px;border-radius:14px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    border:none;color:#0C1018;font-family:'DM Sans',sans-serif;
    font-size:16px;font-weight:700;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:8px;
    transition:all 0.2s;box-shadow:0 4px 20px var(--gg);
  }
  .pr-cta-btn:hover{transform:translateY(-2px);box-shadow:0 6px 28px var(--gg)}

  /* LESSON MODAL */
  .pr-modal-overlay{
    position:fixed;inset:0;z-index:100;
    background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);
    display:flex;align-items:flex-end;justify-content:center;
    animation:prFade 0.2s ease;
  }
  .pr-modal{
    width:100%;max-width:600px;
    background:var(--dkc);border:1px solid var(--bdr);
    border-radius:24px 24px 0 0;padding:28px 28px 40px;
    animation:prSlideUp 0.3s ease;max-height:85vh;overflow-y:auto;
  }
  .pr-modal-handle{width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);margin:0 auto 20px}
  .pr-modal-tag{font-size:10px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
  .pr-modal-title{font-family:'Fraunces',serif;font-size:22px;font-weight:700;margin-bottom:10px;letter-spacing:-0.3px}
  .pr-modal-meta{display:flex;gap:12px;margin-bottom:16px}
  .pr-modal-chip{
    display:flex;align-items:center;gap:5px;font-size:12px;color:var(--tm);
    background:var(--dks);border:1px solid var(--bdr);
    padding:4px 10px;border-radius:100px;
  }
  .pr-modal-body{font-size:14px;color:var(--tm);line-height:1.7;margin-bottom:20px}
  .pr-modal-points{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
  .pr-modal-point{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--tm);line-height:1.5}
  .pr-modal-point-dot{width:18px;height:18px;border-radius:50%;background:rgba(245,166,35,0.15);color:var(--gold);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;margin-top:1px}
  .pr-modal-btn{
    width:100%;padding:14px;border-radius:12px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    border:none;color:#0C1018;font-family:'DM Sans',sans-serif;
    font-size:15px;font-weight:600;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:8px;
    transition:all 0.2s;box-shadow:0 4px 16px var(--gg);
  }
  .pr-modal-btn:hover{transform:translateY(-1px)}

  /* ANIMATIONS */
  @keyframes prFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes prSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}

  /* RESPONSIVE */
  @media(max-width:600px){
    .pr-top,.pr-list,.pr-lessons,.pr-overview,.pr-detail-prog,.pr-tabs,.pr-detail-cta,.pr-hero{padding-left:18px;padding-right:18px}
    .pr-hero-stats{gap:7px}
    .pr-hero-chip{padding:8px 10px}
  }
`;

/* ── DATA ── */
const PROGRAMS = [
  {
    id:"discipline",
    icon:"🎯",
    iconBg:"linear-gradient(135deg,#E8922A,#c97820)",
    name:"Discipline",
    tagline:"Build unbreakable daily habits in 17 days.",
    desc:"A structured 17-day program that transforms your willpower into automatic behaviour. Each day is a small, doable action.",
    days:17, lessonsTotal:17, lessonsComplete:5,
    difficulty:"Beginner", category:"Mindset",
    color:"#F5A623",
    locked:false,
    tags:["Habits","Focus","Willpower","Morning routine"],
    outcomes:["Build a 17-day unbroken streak","Complete your daily tasks without resistance","Develop a morning routine that sticks","Increase focus by reducing decision fatigue"],
    days_data:[
      { day:1,  title:"Why Discipline Beats Motivation",       dur:"5 min",  type:"read",   done:true  },
      { day:2,  title:"The 2-Minute Rule",                     dur:"4 min",  type:"read",   done:true  },
      { day:3,  title:"Designing Your Environment",            dur:"6 min",  type:"read",   done:true  },
      { day:4,  title:"Morning Anchor Habit",                  dur:"8 min",  type:"audio",  done:true  },
      { day:5,  title:"Identity-Based Habits",                 dur:"5 min",  type:"read",   done:true  },
      { day:6,  title:"Habit Stacking",                        dur:"5 min",  type:"read",   done:false, active:true },
      { day:7,  title:"Weekly Review Practice",                dur:"10 min", type:"journal",done:false },
      { day:8,  title:"Overcoming Resistance",                 dur:"6 min",  type:"read",   done:false },
      { day:9,  title:"The Power of Keystone Habits",          dur:"5 min",  type:"read",   done:false },
      { day:10, title:"Accountability Frameworks",             dur:"7 min",  type:"audio",  done:false },
      { day:11, title:"Energy Management",                     dur:"8 min",  type:"read",   done:false },
      { day:12, title:"Dealing with Setbacks",                 dur:"5 min",  type:"read",   done:false },
      { day:13, title:"Deep Work Protocol",                    dur:"9 min",  type:"audio",  done:false },
      { day:14, title:"Rest as a Discipline",                  dur:"4 min",  type:"read",   done:false },
      { day:15, title:"Systems vs Goals",                      dur:"6 min",  type:"read",   done:false },
      { day:16, title:"Building Your Personal Manifesto",      dur:"12 min", type:"journal",done:false },
      { day:17, title:"Graduation: Who You've Become",         dur:"8 min",  type:"audio",  done:false },
    ],
  },
  {
    id:"purpose",
    icon:"🦋",
    iconBg:"linear-gradient(135deg,#9B59B6,#7b3f9e)",
    name:"Purpose",
    tagline:"Discover what you're truly here to do.",
    desc:"A deep 14-day guided journey through reflection, values clarification, and vision building. For those who feel lost or ready for more.",
    days:14, lessonsTotal:14, lessonsComplete:0,
    difficulty:"Intermediate", category:"Growth",
    color:"#9B59B6",
    locked:true,
    tags:["Purpose","Values","Vision","Self-discovery"],
    outcomes:["Clarify your core values","Write a personal purpose statement","Design a 1-year vision","Release what no longer serves you"],
    days_data:[],
  },
  {
    id:"calm",
    icon:"🌊",
    iconBg:"linear-gradient(135deg,#2ED8C3,#1a9e8f)",
    name:"Calm Mind",
    tagline:"Master stress and find inner stillness.",
    desc:"21 days of mindfulness, breathwork, and mental decluttering. Learn to respond instead of react.",
    days:21, lessonsTotal:21, lessonsComplete:0,
    difficulty:"Beginner", category:"Calm",
    color:"#2ED8C3",
    locked:true,
    tags:["Mindfulness","Breathwork","Stress","Stillness"],
    outcomes:["Reduce daily stress levels","Build a consistent mindfulness practice","Improve sleep quality","Respond calmly in difficult situations"],
    days_data:[],
  },
  {
    id:"relationships",
    icon:"❤️",
    iconBg:"linear-gradient(135deg,#E91E8C,#c01575)",
    name:"Relationships",
    tagline:"Build deeper, more meaningful connections.",
    desc:"10 days to strengthen your bonds — with your partner, family, friends, and yourself.",
    days:10, lessonsTotal:10, lessonsComplete:0,
    difficulty:"Beginner", category:"Connection",
    color:"#E91E8C",
    locked:true,
    tags:["Love","Communication","Boundaries","Empathy"],
    outcomes:["Improve your communication skills","Set healthy boundaries confidently","Deepen your most important relationships","Practice radical honesty"],
    days_data:[],
  },
];

const TYPE_ICON = { read:"📖", audio:"🎧", journal:"✏️", video:"▶️" };

export default function ProgramsScreen({ onBack }) {
  const [view,         setView]        = useState("list");  // "list" | "detail"
  const [selected,     setSelected]    = useState(null);
  const [activeTab,    setActiveTab]   = useState("lessons");
  const [lessonModal,  setLessonModal] = useState(null);
  const [completed,    setCompleted]   = useState({});

  const prog = PROGRAMS.find(p => p.id === selected);

  const openProgram = (id) => {
    if (PROGRAMS.find(p => p.id === id)?.locked) return;
    setSelected(id); setView("detail"); setActiveTab("lessons");
  };

  const markLesson = (day) => {
    setCompleted(c => ({...c, [selected+":"+day]: true}));
    setLessonModal(null);
  };

  const isDone = (day) => completed[selected+":"+day];

  /* ── LIST VIEW ── */
  if (view === "list") return (
    <>
      <style>{S}</style>
      <div className="pr-root">
        <div className="pr-bg"/>
        <div className="pr-top">
          <div className="pr-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div>
            <div className="pr-top-title">Programs</div>
            <div className="pr-top-sub">Your growth library</div>
          </div>
          <div className="pr-top-badge">4 Programs</div>
        </div>

        <div className="pr-list">
          {PROGRAMS.map((p,idx) => {
            const pct = Math.round((p.lessonsComplete / p.lessonsTotal) * 100);
            return (
              <div key={p.id} className="pr-card" onClick={() => openProgram(p.id)}>
                <div className="pr-card-header">
                  <div className="pr-card-icon" style={{background:p.iconBg}}>{p.icon}</div>
                  <div className="pr-card-info">
                    <div className="pr-card-name">{p.name}</div>
                    <div className="pr-card-meta">
                      <span>📅 {p.days} days</span>
                      <span>·</span>
                      <span>📚 {p.lessonsTotal} lessons</span>
                      <span>·</span>
                      <span>{p.difficulty}</span>
                    </div>
                  </div>
                  {p.locked && <div className="pr-card-lock">🔒</div>}
                </div>
                <div className="pr-card-desc">{p.tagline}</div>
                <div className="pr-tags">
                  {p.tags.slice(0,3).map(t => <span key={t} className="pr-tag">{t}</span>)}
                </div>
                {!p.locked && (
                  <div className="pr-card-progress">
                    <div className="pr-progress-hdr">
                      <span className="pr-progress-lbl">{pct > 0 ? `${p.lessonsComplete} of ${p.lessonsTotal} lessons` : "Not started"}</span>
                      <span className="pr-progress-pct">{pct}%</span>
                    </div>
                    <div className="pr-progress-track">
                      <div className="pr-progress-fill" style={{width:`${pct}%`, background:p.color}}/>
                    </div>
                  </div>
                )}
                <button className={`pr-card-btn ${p.locked?"locked":pct>0?"continue":"primary"}`}
                  onClick={e => { e.stopPropagation(); openProgram(p.id); }}>
                  {p.locked ? "🔒 Unlock with Premium" : pct > 0 ? "→ Continue Program" : "→ Start Program"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  /* ── DETAIL VIEW ── */
  const pct = Math.round(((prog.lessonsComplete + Object.keys(completed).filter(k=>k.startsWith(selected+":")).length) / prog.lessonsTotal) * 100);
  const todayLesson = prog.days_data.find(d => d.active);

  return (
    <>
      <style>{S}</style>
      <div className="pr-root">
        <div className="pr-bg"/>

        {/* TOPBAR */}
        <div className="pr-top">
          <div className="pr-back" onClick={() => setView("list")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div>
            <div className="pr-top-title">{prog.name}</div>
            <div className="pr-top-sub">{prog.category} · {prog.difficulty}</div>
          </div>
          <div className="pr-top-badge" style={{color:prog.color,borderColor:prog.color+"40",background:prog.color+"14"}}>
            Day {prog.lessonsComplete + 1}
          </div>
        </div>

        <div className="pr-detail">
          {/* HERO */}
          <div className="pr-hero">
            <div className="pr-hero-top">
              <div className="pr-hero-icon" style={{background:prog.iconBg}}>{prog.icon}</div>
              <div>
                <div className="pr-hero-name">{prog.name}</div>
                <div className="pr-hero-tagline">{prog.tagline}</div>
              </div>
            </div>
            <div className="pr-hero-stats">
              <div className="pr-hero-chip">
                <div className="pr-hero-chip-val" style={{color:prog.color}}>{prog.days}</div>
                <div className="pr-hero-chip-lbl">Days</div>
              </div>
              <div className="pr-hero-chip">
                <div className="pr-hero-chip-val" style={{color:"var(--teal)"}}>{prog.lessonsComplete}</div>
                <div className="pr-hero-chip-lbl">Done</div>
              </div>
              <div className="pr-hero-chip">
                <div className="pr-hero-chip-val" style={{color:"var(--gold)"}}>{pct}%</div>
                <div className="pr-hero-chip-lbl">Progress</div>
              </div>
              <div className="pr-hero-chip">
                <div className="pr-hero-chip-val">🔥5</div>
                <div className="pr-hero-chip-lbl">Streak</div>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="pr-detail-prog">
            <div className="pr-detail-prog-hdr">
              <span className="pr-detail-prog-lbl">Overall progress</span>
              <span className="pr-detail-prog-pct" style={{color:prog.color}}>{pct}%</span>
            </div>
            <div className="pr-detail-track">
              <div className="pr-detail-fill" style={{width:`${pct}%`, background:prog.color}}/>
            </div>
          </div>

          {/* TABS */}
          <div className="pr-tabs">
            {["lessons","overview"].map(t => (
              <div key={t} className={`pr-tab ${activeTab===t?"active":""}`}
                onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </div>
            ))}
          </div>

          {/* LESSONS TAB */}
          {activeTab === "lessons" && (
            <div className="pr-lessons">
              {/* Today's lesson highlight */}
              {todayLesson && (
                <div className="pr-today-lesson">
                  <div className="pr-today-lbl">🌟 Today's Lesson — Day {todayLesson.day}</div>
                  <div className="pr-today-title">{todayLesson.title}</div>
                  <div className="pr-today-desc">
                    Today you learn about {todayLesson.title.toLowerCase()} — one of the most powerful concepts in building lasting discipline.
                  </div>
                  <button className="pr-today-btn" onClick={() => setLessonModal(todayLesson)}>
                    {TYPE_ICON[todayLesson.type]} Start Lesson · {todayLesson.dur}
                  </button>
                </div>
              )}

              {/* All lessons */}
              {["Week 1","Week 2","Week 3"].map((week, wi) => {
                const start = wi * 7;
                const lessons = prog.days_data.slice(start, start + 7);
                if (!lessons.length) return null;
                return (
                  <div className="pr-day-section" key={week}>
                    <div className="pr-day-label">{week}</div>
                    {lessons.map(l => {
                      const done = l.done || isDone(l.day);
                      return (
                        <div key={l.day}
                          className={`pr-lesson ${done?"done":l.active?"active":!l.done&&l.day>6?"locked":""}`}
                          onClick={() => { if (!(!l.done && l.day > 6)) setLessonModal(l); }}>
                          <div className="pr-lesson-num">
                            {done ? "✓" : l.active ? "▶" : l.day}
                          </div>
                          <div className="pr-lesson-info">
                            <div className="pr-lesson-title">{l.title}</div>
                            <div className="pr-lesson-meta">
                              <span>{TYPE_ICON[l.type]} {l.type}</span>
                              <span>·</span>
                              <span>{l.dur}</span>
                            </div>
                          </div>
                          <div className="pr-lesson-right">
                            {!l.done && l.day > 6
                              ? <span className="pr-lesson-icon">🔒</span>
                              : <span className="pr-lesson-icon">{done ? "✅" : l.active ? "🟡" : "⚪"}</span>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="pr-overview">
              <div className="pr-ov-card">
                <div className="pr-ov-title">About this program</div>
                <div className="pr-ov-text">{prog.desc}</div>
              </div>

              <div className="pr-ov-card">
                <div className="pr-ov-title">What you'll achieve</div>
                <div className="pr-ov-list">
                  {prog.outcomes.map(o => (
                    <div key={o} className="pr-ov-item">
                      <div className="pr-ov-dot"/>
                      {o}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pr-ov-card">
                <div className="pr-ov-title">Your streak — last 17 days</div>
                <div className="pr-streak-row">
                  {Array.from({length:17},(_,i) => (
                    <div key={i} className={`pr-streak-day ${i<5?"done":i===5?"today":""}`}>
                      {i<5 ? "✓" : i===5 ? "→" : i+1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pr-ov-card">
                <div className="pr-ov-title">Tags</div>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"4px"}}>
                  {prog.tags.map(t => (
                    <span key={t} className="pr-tag" style={{color:prog.color,borderColor:prog.color+"30",background:prog.color+"10"}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM CTA */}
          <div className="pr-detail-cta">
            <button className="pr-cta-btn"
              onClick={() => todayLesson && setLessonModal(todayLesson)}>
              {TYPE_ICON[todayLesson?.type || "read"]} Continue — Day {prog.lessonsComplete + 1}
            </button>
          </div>
        </div>

        {/* LESSON MODAL */}
        {lessonModal && (
          <div className="pr-modal-overlay" onClick={() => setLessonModal(null)}>
            <div className="pr-modal" onClick={e => e.stopPropagation()}>
              <div className="pr-modal-handle"/>
              <div className="pr-modal-tag">{TYPE_ICON[lessonModal.type]} Day {lessonModal.day} · {lessonModal.type}</div>
              <div className="pr-modal-title">{lessonModal.title}</div>
              <div className="pr-modal-meta">
                <div className="pr-modal-chip">⏱ {lessonModal.dur}</div>
                <div className="pr-modal-chip">📊 {prog.difficulty}</div>
                <div className="pr-modal-chip">🏷 {prog.category}</div>
              </div>
              <div className="pr-modal-body">
                Today's lesson explores <strong>{lessonModal.title.toLowerCase()}</strong> — a foundational concept in building the kind of discipline that lasts a lifetime.
                You'll walk away with a clear understanding and one simple action to take today.
              </div>
              <div className="pr-modal-points">
                {["Understand the core concept in under 5 minutes","Get one actionable insight to apply today","Build on yesterday's lesson","Log your reflection when complete"].map((pt,i) => (
                  <div key={i} className="pr-modal-point">
                    <div className="pr-modal-point-dot">{i+1}</div>
                    {pt}
                  </div>
                ))}
              </div>
              <button className="pr-modal-btn" onClick={() => markLesson(lessonModal.day)}>
                ✓ Mark as Complete
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
