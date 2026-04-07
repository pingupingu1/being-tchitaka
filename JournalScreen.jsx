import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .jn-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --tg:rgba(46,216,195,0.12);
    --dk:#0C1018; --dkc:#131820; --dks:#1A2030;
    --bdr:rgba(255,255,255,0.07);
    --tp:#F0EDE8; --tm:rgba(240,237,232,0.55); --ts:rgba(240,237,232,0.3);
    --purple:#9B59B6; --pink:#E91E8C;
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column; overflow-x:hidden;
  }
  .jn-root*,.jn-root*::before,.jn-root*::after{box-sizing:border-box;margin:0;padding:0}

  .jn-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(ellipse 60% 40% at 90% 10%,rgba(245,166,35,0.06) 0%,transparent 55%),
      radial-gradient(ellipse 50% 40% at 10% 90%,rgba(46,216,195,0.04) 0%,transparent 55%)}

  /* TOPBAR */
  .jn-top{position:relative;z-index:10;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;background:rgba(12,16,24,0.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr)}
  .jn-back{width:38px;height:38px;border-radius:10px;background:var(--dks);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--tm);transition:all 0.18s}
  .jn-back:hover{color:var(--tp);border-color:rgba(255,255,255,0.15)}
  .jn-top-center{text-align:center}
  .jn-top-title{font-family:'Fraunces',serif;font-size:17px;font-weight:600}
  .jn-top-sub{font-size:10px;color:var(--ts);margin-top:1px}
  .jn-write-btn{padding:7px 16px;border-radius:100px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;gap:5px}
  .jn-write-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px var(--gg)}

  /* TABS */
  .jn-tabs{position:relative;z-index:10;display:flex;padding:0 28px;border-bottom:1px solid var(--bdr)}
  .jn-tab{padding:12px 20px;font-size:13px;font-weight:500;color:var(--ts);cursor:pointer;transition:all 0.18s;border-bottom:2px solid transparent;margin-bottom:-1px}
  .jn-tab:hover{color:var(--tm)}
  .jn-tab.active{color:var(--gold);border-bottom-color:var(--gold)}

  /* BODY */
  .jn-body{position:relative;z-index:10;flex:1;overflow-y:auto;padding:24px 28px 40px}

  /* STATS ROW */
  .jn-stats{display:flex;gap:10px;margin-bottom:24px}
  .jn-stat{flex:1;background:var(--dkc);border:1px solid var(--bdr);border-radius:14px;padding:14px 12px;text-align:center}
  .jn-stat-val{font-family:'Fraunces',serif;font-size:24px;font-weight:700;line-height:1}
  .jn-stat-lbl{font-size:9px;color:var(--ts);margin-top:4px;letter-spacing:0.5px;text-transform:uppercase}

  /* SEARCH */
  .jn-search-wrap{position:relative;margin-bottom:18px}
  .jn-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--ts);pointer-events:none}
  .jn-search{width:100%;background:var(--dkc);border:1.5px solid var(--bdr);border-radius:12px;padding:12px 14px 12px 42px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.18s}
  .jn-search:focus{border-color:var(--gold)}
  .jn-search::placeholder{color:var(--ts)}

  /* FILTER PILLS */
  .jn-filters{display:flex;gap:7px;margin-bottom:20px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
  .jn-filters::-webkit-scrollbar{display:none}
  .jn-filter{flex-shrink:0;padding:6px 14px;border-radius:100px;background:var(--dks);border:1px solid var(--bdr);font-size:12px;color:var(--tm);cursor:pointer;transition:all 0.18s;white-space:nowrap}
  .jn-filter:hover{border-color:rgba(245,166,35,0.3);color:var(--gold)}
  .jn-filter.active{background:rgba(245,166,35,0.1);border-color:rgba(245,166,35,0.3);color:var(--gold)}

  /* ENTRY CARD */
  .jn-entry{background:var(--dkc);border:1px solid var(--bdr);border-radius:16px;padding:18px 20px;margin-bottom:12px;cursor:pointer;transition:all 0.2s;animation:jnFade 0.4s ease both}
  .jn-entry:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,0.2)}
  .jn-entry-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px}
  .jn-entry-left{display:flex;align-items:center;gap:10px}
  .jn-entry-mood{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
  .jn-entry-date{font-size:12px;color:var(--ts)}
  .jn-entry-prompt{font-size:11px;color:var(--gold);font-weight:600;margin-top:1px}
  .jn-entry-dots{color:var(--ts);font-size:16px;cursor:pointer;padding:2px 6px}
  .jn-entry-body{font-size:14px;color:var(--tm);line-height:1.65;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .jn-entry-footer{display:flex;align-items:center;justify-content:space-between}
  .jn-entry-tags{display:flex;gap:5px;flex-wrap:wrap}
  .jn-entry-tag{padding:3px 9px;border-radius:100px;font-size:10px;font-weight:600}
  .jn-entry-wc{font-size:10px;color:var(--ts)}

  /* DATE GROUP */
  .jn-date-group{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ts);margin:20px 0 10px;display:flex;align-items:center;gap:8px}
  .jn-date-group::after{content:'';flex:1;height:1px;background:var(--bdr)}

  /* PROMPT CARD */
  .jn-prompt-card{background:linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02));border:1px solid rgba(245,166,35,0.2);border-radius:16px;padding:20px;margin-bottom:20px}
  .jn-prompt-lbl{font-size:10px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
  .jn-prompt-txt{font-family:'Fraunces',serif;font-size:20px;font-weight:700;line-height:1.3;margin-bottom:14px}
  .jn-prompt-btn{padding:10px 22px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.18s;display:inline-flex;align-items:center;gap:6px;box-shadow:0 3px 12px var(--gg)}
  .jn-prompt-btn:hover{transform:translateY(-1px)}

  /* WRITE VIEW */
  .jn-write{position:relative;z-index:10;flex:1;display:flex;flex-direction:column;padding:20px 28px 32px;gap:16px}

  .jn-write-prompt{background:linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02));border:1px solid rgba(245,166,35,0.2);border-radius:14px;padding:16px 18px}
  .jn-write-prompt-lbl{font-size:10px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:6px}
  .jn-write-prompt-txt{font-family:'Fraunces',serif;font-size:17px;font-weight:600;line-height:1.35}

  /* MOOD PICKER */
  .jn-mood-row{display:flex;gap:8px}
  .jn-mood-opt{width:44px;height:44px;border-radius:12px;background:var(--dkc);border:1.5px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:all 0.18s}
  .jn-mood-opt:hover{border-color:rgba(245,166,35,0.3);transform:scale(1.05)}
  .jn-mood-opt.sel{border-color:var(--gold);background:rgba(245,166,35,0.1);transform:scale(1.08)}

  /* TAG PICKER */
  .jn-tag-row{display:flex;gap:7px;flex-wrap:wrap}
  .jn-tag-opt{padding:5px 13px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.18s;border:1.5px solid var(--bdr);background:var(--dkc);color:var(--tm)}
  .jn-tag-opt:hover{border-color:rgba(255,255,255,0.15);color:var(--tp)}
  .jn-tag-opt.sel{color:#0C1018}

  /* TEXTAREA */
  .jn-textarea{flex:1;min-height:200px;background:var(--dkc);border:1.5px solid var(--bdr);border-radius:14px;padding:18px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:16px;line-height:1.75;resize:none;outline:none;transition:border-color 0.18s}
  .jn-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(245,166,35,0.08)}
  .jn-textarea::placeholder{color:var(--ts)}

  .jn-write-footer{display:flex;align-items:center;justify-content:space-between}
  .jn-wc{font-size:12px;color:var(--ts)}
  .jn-write-actions{display:flex;gap:8px}
  .jn-btn-save{padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;box-shadow:0 3px 14px var(--gg);display:flex;align-items:center;gap:7px}
  .jn-btn-save:hover{transform:translateY(-1px);box-shadow:0 5px 20px var(--gg)}
  .jn-btn-save:disabled{opacity:0.35;cursor:not-allowed;transform:none}
  .jn-btn-cancel{padding:12px 20px;border-radius:12px;background:var(--dkc);border:1.5px solid var(--bdr);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.18s}
  .jn-btn-cancel:hover{border-color:rgba(255,255,255,0.15);color:var(--tp)}

  /* ENTRY DETAIL MODAL */
  .jn-modal-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;animation:jnFade 0.2s ease}
  .jn-modal{width:100%;max-width:640px;background:var(--dkc);border:1px solid var(--bdr);border-radius:24px 24px 0 0;padding:28px 28px 48px;animation:jnSlideUp 0.3s ease;max-height:85vh;overflow-y:auto}
  .jn-modal-handle{width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);margin:0 auto 20px}
  .jn-modal-hdr{display:flex;align-items:center;gap:12px;margin-bottom:14px}
  .jn-modal-mood{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .jn-modal-date{font-size:13px;color:var(--ts)}
  .jn-modal-prompt{font-size:11px;color:var(--gold);font-weight:600;margin-top:2px}
  .jn-modal-body{font-size:15px;color:var(--tm);line-height:1.75;margin-bottom:16px;white-space:pre-wrap}
  .jn-modal-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
  .jn-modal-tag{padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600}
  .jn-modal-actions{display:flex;gap:8px}
  .jn-modal-btn{flex:1;padding:11px;border-radius:10px;border:1px solid var(--bdr);background:var(--dks);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;justify-content:center;gap:6px}
  .jn-modal-btn:hover{border-color:rgba(255,255,255,0.15);color:var(--tp)}

  /* EMPTY STATE */
  .jn-empty{text-align:center;padding:60px 20px;display:flex;flex-direction:column;align-items:center;gap:14px}
  .jn-empty-icon{font-size:48px;opacity:0.4}
  .jn-empty-title{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--tm)}
  .jn-empty-sub{font-size:14px;color:var(--ts);line-height:1.6;max-width:280px}

  /* STREAKS */
  .jn-streak-grid{display:flex;gap:4px;flex-wrap:wrap}
  .jn-streak-sq{width:26px;height:26px;border-radius:6px;background:var(--dks);transition:all 0.18s}
  .jn-streak-sq.done{background:rgba(245,166,35,0.6)}
  .jn-streak-sq.today{background:var(--gold);box-shadow:0 0 8px var(--gg)}

  /* ANIMATIONS */
  @keyframes jnFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes jnSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}

  @media(max-width:600px){
    .jn-top,.jn-tabs,.jn-body,.jn-write{padding-left:18px;padding-right:18px}
    .jn-stats{gap:7px}
  }
`;

/* ── DATA ── */
const PROMPTS = [
  "What am I grateful for today?",
  "What made me feel most alive this week?",
  "What would I do differently if I started today over?",
  "What's one thing I need to let go of?",
  "Who has had the biggest impact on my life recently?",
  "What does my best self look like right now?",
  "What fear is holding me back and why?",
  "What small win can I celebrate today?",
];

const MOODS = [
  {emoji:"😞", label:"Rough",   color:"#FF5C5C", bg:"rgba(255,92,92,0.15)"},
  {emoji:"😕", label:"Low",     color:"#F5A623", bg:"rgba(245,166,35,0.15)"},
  {emoji:"😐", label:"Okay",    color:"#FFD080", bg:"rgba(255,208,128,0.15)"},
  {emoji:"🙂", label:"Good",    color:"#2ED8C3", bg:"rgba(46,216,195,0.15)"},
  {emoji:"😄", label:"Great",   color:"#F5A623", bg:"rgba(245,166,35,0.18)"},
];

const TAGS_OPTS = [
  {label:"Grateful",    color:"#F5A623"},
  {label:"Reflective",  color:"#9B59B6"},
  {label:"Hopeful",     color:"#2ED8C3"},
  {label:"Anxious",     color:"#FF5C5C"},
  {label:"Motivated",   color:"#E8922A"},
  {label:"Peaceful",    color:"#3B82F6"},
  {label:"Growth",      color:"#2ED8C3"},
  {label:"Struggling",  color:"#E91E8C"},
];

const FILTERS = ["All","Grateful","Reflective","Hopeful","Anxious","Motivated","Peaceful","Growth"];

const SAMPLE_ENTRIES = [
  {
    id:1, date:"Today", dateGroup:"Today",
    prompt:"What am I grateful for today?",
    mood:3, tags:["Grateful","Peaceful"],
    body:"Today I'm genuinely grateful for the small things — the morning light, a good cup of tea, and the fact that I woke up with the ability to choose how I respond to this day.\n\nI've been thinking a lot about discipline and how it's really just love in action. Loving your future self enough to do the hard thing now.",
    wc:52,
  },
  {
    id:2, date:"Yesterday", dateGroup:"This Week",
    prompt:"What made me feel most alive this week?",
    mood:4, tags:["Motivated","Growth"],
    body:"The conversation I had with my mentor yesterday was one of those rare moments where everything clicks. She told me: 'Stop waiting for permission to be the person you already are.' That hit deep.",
    wc:41,
  },
  {
    id:3, date:"Mon, Mar 18", dateGroup:"This Week",
    prompt:"What small win can I celebrate today?",
    mood:2, tags:["Reflective"],
    body:"Today was hard. I didn't feel motivated at all — but I still showed up. Did the 5-min focus block, called my sister, and wrote this. That's enough. Discipline doesn't care about your mood.",
    wc:38,
  },
  {
    id:4, date:"Sun, Mar 17", dateGroup:"Last Week",
    prompt:"What would I do differently if I started today over?",
    mood:3, tags:["Grateful","Hopeful"],
    body:"I'd start quieter. Less phone, more presence. I noticed today how much energy I waste scrolling before I even get out of bed. Tomorrow I'm trying the phone-free morning boundary for real.",
    wc:44,
  },
  {
    id:5, date:"Sat, Mar 16", dateGroup:"Last Week",
    prompt:"Who has had the biggest impact on my life recently?",
    mood:4, tags:["Grateful","Growth"],
    body:"Honestly — Alex from the growth community. The way he talks about purpose without making it feel overwhelming. Also reading 'The Almanack of Naval' again. Some books age like fine wine.",
    wc:39,
  },
];

export default function JournalScreen({ onBack }) {
  const [view,        setView]       = useState("list");   // "list" | "write" | "detail"
  const [tab,         setTab]        = useState("entries"); // "entries" | "insights"
  const [search,      setSearch]     = useState("");
  const [filter,      setFilter]     = useState("All");
  const [entries,     setEntries]    = useState(SAMPLE_ENTRIES);
  const [selected,    setSelected]   = useState(null);
  const [promptIdx,   setPromptIdx]  = useState(0);
  const [writeMood,   setWriteMood]  = useState(null);
  const [writeTags,   setWriteTags]  = useState([]);
  const [writeText,   setWriteText]  = useState("");
  const [writePrompt, setWritePrompt]= useState(PROMPTS[0]);

  const filtered = entries.filter(e => {
    const matchSearch = search === "" || e.body.toLowerCase().includes(search.toLowerCase()) || e.prompt.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.tags.includes(filter);
    return matchSearch && matchFilter;
  });

  const grouped = filtered.reduce((acc, e) => {
    if (!acc[e.dateGroup]) acc[e.dateGroup] = [];
    acc[e.dateGroup].push(e);
    return acc;
  }, {});

  const wordCount = writeText.trim().split(/\s+/).filter(Boolean).length;

  const saveEntry = () => {
    const newEntry = {
      id: Date.now(), date:"Just now", dateGroup:"Today",
      prompt: writePrompt,
      mood: writeMood ?? 2,
      tags: writeTags,
      body: writeText,
      wc: wordCount,
    };
    setEntries(e => [newEntry, ...e]);
    setWriteText(""); setWriteMood(null); setWriteTags([]);
    setView("list");
  };

  const toggleTag = (label) => {
    setWriteTags(t => t.includes(label) ? t.filter(x=>x!==label) : [...t, label]);
  };

  const openWrite = (prompt) => {
    setWritePrompt(prompt || PROMPTS[promptIdx]);
    setView("write");
  };

  /* ── WRITE VIEW ── */
  if (view === "write") return (
    <>
      <style>{S}</style>
      <div className="jn-root">
        <div className="jn-bg"/>
        <div className="jn-top">
          <div className="jn-back" onClick={() => setView("list")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div className="jn-top-center">
            <div className="jn-top-title">New Entry</div>
            <div className="jn-top-sub">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</div>
          </div>
          <button className="jn-write-btn" onClick={saveEntry} disabled={!writeText.trim()}>Save ✓</button>
        </div>

        <div className="jn-write">
          {/* Today's prompt */}
          <div className="jn-write-prompt">
            <div className="jn-write-prompt-lbl">✏️ Today's Prompt</div>
            <div className="jn-write-prompt-txt">{writePrompt}</div>
          </div>

          {/* Mood */}
          <div>
            <div style={{fontSize:"11px",fontWeight:600,color:"var(--ts)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"10px"}}>How are you feeling?</div>
            <div className="jn-mood-row">
              {MOODS.map((m,i)=>(
                <div key={i} className={`jn-mood-opt ${writeMood===i?"sel":""}`}
                  style={writeMood===i?{background:m.bg,borderColor:m.color}:{}}
                  onClick={()=>setWriteMood(i)}>
                  {m.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div style={{fontSize:"11px",fontWeight:600,color:"var(--ts)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"10px"}}>Tag this entry</div>
            <div className="jn-tag-row">
              {TAGS_OPTS.map((t,i)=>(
                <div key={i} className={`jn-tag-opt ${writeTags.includes(t.label)?"sel":""}`}
                  style={writeTags.includes(t.label)?{background:t.color,borderColor:t.color,color:"#0C1018"}:{}}
                  onClick={()=>toggleTag(t.label)}>
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea className="jn-textarea"
            placeholder="Start writing... there's no right or wrong here. Just you and your thoughts."
            value={writeText}
            onChange={e=>setWriteText(e.target.value)}
            autoFocus
          />

          {/* Footer */}
          <div className="jn-write-footer">
            <div className="jn-wc">{wordCount} words</div>
            <div className="jn-write-actions">
              <button className="jn-btn-cancel" onClick={()=>setView("list")}>Cancel</button>
              <button className="jn-btn-save" onClick={saveEntry} disabled={!writeText.trim()}>
                Save Entry ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* ── DETAIL VIEW ── */
  if (view === "detail" && selected) {
    const entry = entries.find(e=>e.id===selected);
    const mood = MOODS[entry.mood] || MOODS[2];
    return (
      <>
        <style>{S}</style>
        <div className="jn-root">
          <div className="jn-bg"/>
          <div className="jn-top">
            <div className="jn-back" onClick={()=>{setView("list");setSelected(null)}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </div>
            <div className="jn-top-center">
              <div className="jn-top-title">Journal Entry</div>
              <div className="jn-top-sub">{entry.date}</div>
            </div>
            <div style={{width:38}}/>
          </div>
          <div className="jn-body">
            <div style={{background:"var(--dkc)",border:"1px solid var(--bdr)",borderRadius:"16px",padding:"22px 22px",marginBottom:"16px"}}>
              <div className="jn-modal-hdr">
                <div className="jn-modal-mood" style={{background:mood.bg}}>{mood.emoji}</div>
                <div>
                  <div className="jn-modal-date">{entry.date} · {entry.wc} words</div>
                  <div className="jn-modal-prompt">{entry.prompt}</div>
                </div>
              </div>
              <div className="jn-modal-body">{entry.body}</div>
              <div className="jn-modal-tags">
                {entry.tags.map((tag,i)=>{
                  const t = TAGS_OPTS.find(x=>x.label===tag)||{color:"var(--gold)"};
                  return <span key={i} className="jn-modal-tag" style={{background:t.color+"20",color:t.color}}>{tag}</span>;
                })}
              </div>
              <div className="jn-modal-actions">
                <button className="jn-modal-btn" onClick={()=>openWrite(entry.prompt)}>✏️ Write again</button>
                <button className="jn-modal-btn" onClick={()=>{setEntries(e=>e.filter(x=>x.id!==selected));setView("list");setSelected(null)}}>🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── LIST VIEW ── */
  return (
    <>
      <style>{S}</style>
      <div className="jn-root">
        <div className="jn-bg"/>

        {/* TOPBAR */}
        <div className="jn-top">
          <div className="jn-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div className="jn-top-center">
            <div className="jn-top-title">Journal</div>
            <div className="jn-top-sub">{entries.length} entries</div>
          </div>
          <button className="jn-write-btn" onClick={()=>openWrite()}>+ Write</button>
        </div>

        {/* TABS */}
        <div className="jn-tabs">
          {["entries","insights"].map(t=>(
            <div key={t} className={`jn-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </div>
          ))}
        </div>

        <div className="jn-body">

          {/* ── ENTRIES TAB ── */}
          {tab === "entries" && (
            <>
              {/* Stats */}
              <div className="jn-stats">
                <div className="jn-stat">
                  <div className="jn-stat-val" style={{color:"var(--gold)"}}>{entries.length}</div>
                  <div className="jn-stat-lbl">Total entries</div>
                </div>
                <div className="jn-stat">
                  <div className="jn-stat-val" style={{color:"var(--teal)"}}>🔥5</div>
                  <div className="jn-stat-lbl">Day streak</div>
                </div>
                <div className="jn-stat">
                  <div className="jn-stat-val" style={{color:"var(--purple)"}}>
                    {entries.reduce((a,e)=>a+e.wc,0)}
                  </div>
                  <div className="jn-stat-lbl">Words written</div>
                </div>
              </div>

              {/* Today's Prompt */}
              <div className="jn-prompt-card">
                <div className="jn-prompt-lbl">✨ Today's Prompt</div>
                <div className="jn-prompt-txt">{PROMPTS[promptIdx]}</div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  <button className="jn-prompt-btn" onClick={()=>openWrite(PROMPTS[promptIdx])}>
                    ✏️ Write now
                  </button>
                  <button style={{padding:"10px 16px",borderRadius:"10px",background:"rgba(255,255,255,0.05)",border:"1px solid var(--bdr)",color:"var(--tm)",cursor:"pointer",fontSize:"12px",fontFamily:"'DM Sans',sans-serif"}}
                    onClick={()=>setPromptIdx(i=>(i+1)%PROMPTS.length)}>
                    Next prompt →
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="jn-search-wrap">
                <span className="jn-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </span>
                <input className="jn-search" placeholder="Search your journal..."
                  value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>

              {/* Filter pills */}
              <div className="jn-filters">
                {FILTERS.map(f=>(
                  <div key={f} className={`jn-filter ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f}</div>
                ))}
              </div>

              {/* Entries grouped by date */}
              {Object.keys(grouped).length === 0 ? (
                <div className="jn-empty">
                  <div className="jn-empty-icon">📓</div>
                  <div className="jn-empty-title">No entries found</div>
                  <div className="jn-empty-sub">Try a different search or filter, or write your first entry today.</div>
                </div>
              ) : (
                Object.entries(grouped).map(([group, groupEntries])=>(
                  <div key={group}>
                    <div className="jn-date-group">{group}</div>
                    {groupEntries.map(e=>{
                      const mood = MOODS[e.mood] || MOODS[2];
                      return (
                        <div key={e.id} className="jn-entry" onClick={()=>{setSelected(e.id);setView("detail")}}>
                          <div className="jn-entry-hdr">
                            <div className="jn-entry-left">
                              <div className="jn-entry-mood" style={{background:mood.bg}}>{mood.emoji}</div>
                              <div>
                                <div className="jn-entry-date">{e.date}</div>
                                <div className="jn-entry-prompt">{e.prompt}</div>
                              </div>
                            </div>
                            <div className="jn-entry-dots">···</div>
                          </div>
                          <div className="jn-entry-body">{e.body}</div>
                          <div className="jn-entry-footer">
                            <div className="jn-entry-tags">
                              {e.tags.map((tag,i)=>{
                                const t=TAGS_OPTS.find(x=>x.label===tag)||{color:"var(--gold)"};
                                return <span key={i} className="jn-entry-tag" style={{background:t.color+"18",color:t.color}}>{tag}</span>;
                              })}
                            </div>
                            <div className="jn-entry-wc">{e.wc} words</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </>
          )}

          {/* ── INSIGHTS TAB ── */}
          {tab === "insights" && (
            <>
              {/* Writing streak */}
              <div style={{background:"var(--dkc)",border:"1px solid var(--bdr)",borderRadius:"16px",padding:"18px 20px",marginBottom:"14px"}}>
                <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--ts)",marginBottom:"14px"}}>📅 30-Day Writing Streak</div>
                <div className="jn-streak-grid">
                  {Array.from({length:30},(_,i)=>(
                    <div key={i} className={`jn-streak-sq ${i<5?"done":i===5?"today":""}`}/>
                  ))}
                </div>
                <div style={{marginTop:"12px",fontSize:"12px",color:"var(--ts)"}}>
                  🔥 5-day streak · Best: 12 days
                </div>
              </div>

              {/* Mood over time */}
              <div style={{background:"var(--dkc)",border:"1px solid var(--bdr)",borderRadius:"16px",padding:"18px 20px",marginBottom:"14px"}}>
                <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--ts)",marginBottom:"14px"}}>😊 Mood Trends</div>
                <div style={{display:"flex",gap:"10px",marginBottom:"14px"}}>
                  {MOODS.map((m,i)=>{
                    const count = entries.filter(e=>e.mood===i).length;
                    return (
                      <div key={i} style={{flex:1,textAlign:"center"}}>
                        <div style={{fontSize:"20px",marginBottom:"4px"}}>{m.emoji}</div>
                        <div style={{fontSize:"16px",fontWeight:700,fontFamily:"'Fraunces',serif",color:m.color}}>{count}</div>
                        <div style={{fontSize:"9px",color:"var(--ts)",marginTop:"2px"}}>{m.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{fontSize:"12px",color:"var(--tm)",background:"var(--dks)",borderRadius:"9px",padding:"10px 12px"}}>
                  💡 Your most common mood this week is <b style={{color:"var(--teal)"}}>Good</b> — keep that momentum!
                </div>
              </div>

              {/* Most used tags */}
              <div style={{background:"var(--dkc)",border:"1px solid var(--bdr)",borderRadius:"16px",padding:"18px 20px",marginBottom:"14px"}}>
                <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--ts)",marginBottom:"14px"}}>🏷 Most Used Tags</div>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {TAGS_OPTS.slice(0,5).map((t,i)=>{
                    const count = entries.filter(e=>e.tags.includes(t.label)).length;
                    const pct = Math.round((count/entries.length)*100) || 0;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <span style={{fontSize:"12px",fontWeight:600,color:t.color,minWidth:"80px"}}>{t.label}</span>
                        <div style={{flex:1,height:"6px",background:"var(--dks)",borderRadius:"3px",overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:t.color,borderRadius:"3px",transition:"width 1s"}}/>
                        </div>
                        <span style={{fontSize:"11px",color:"var(--ts)",minWidth:"30px",textAlign:"right"}}>{count}x</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats summary */}
              <div style={{background:"var(--dkc)",border:"1px solid var(--bdr)",borderRadius:"16px",padding:"18px 20px"}}>
                <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--ts)",marginBottom:"14px"}}>📊 Writing Stats</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  {[
                    {val:entries.length,     lbl:"Total entries",  c:"var(--gold)"},
                    {val:entries.reduce((a,e)=>a+e.wc,0), lbl:"Words written", c:"var(--teal)"},
                    {val:Math.round(entries.reduce((a,e)=>a+e.wc,0)/Math.max(entries.length,1)), lbl:"Avg words/entry", c:"var(--purple)"},
                    {val:"5🔥", lbl:"Best streak", c:"var(--gold)"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:"var(--dks)",border:"1px solid var(--bdr)",borderRadius:"12px",padding:"14px 12px",textAlign:"center"}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:"22px",fontWeight:700,color:s.c,lineHeight:1}}>{s.val}</div>
                      <div style={{fontSize:"9px",color:"var(--ts)",marginTop:"4px",letterSpacing:"0.5px",textTransform:"uppercase"}}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
