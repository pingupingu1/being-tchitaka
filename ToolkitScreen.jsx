import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .tk-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --tg:rgba(46,216,195,0.12);
    --dk:#0C1018; --dkc:#131820; --dks:#1A2030;
    --bdr:rgba(255,255,255,0.07);
    --tp:#F0EDE8; --tm:rgba(240,237,232,0.55); --ts:rgba(240,237,232,0.3);
    --purple:#9B59B6; --pink:#E91E8C; --blue:#3B82F6; --orange:#E8922A;
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column; overflow-x:hidden;
  }
  .tk-root*,.tk-root*::before,.tk-root*::after{box-sizing:border-box;margin:0;padding:0}

  .tk-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(ellipse 60% 40% at 85% 15%,rgba(155,89,182,0.06) 0%,transparent 55%),
               radial-gradient(ellipse 50% 40% at 15% 85%,rgba(245,166,35,0.05) 0%,transparent 55%)}

  /* TOPBAR */
  .tk-top{position:relative;z-index:10;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;background:rgba(12,16,24,0.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr)}
  .tk-back{width:38px;height:38px;border-radius:10px;background:var(--dks);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--tm);transition:all 0.18s}
  .tk-back:hover{color:var(--tp);border-color:rgba(255,255,255,0.15)}
  .tk-top-info{text-align:center}
  .tk-top-title{font-family:'Fraunces',serif;font-size:17px;font-weight:600}
  .tk-top-sub{font-size:10px;color:var(--ts);margin-top:1px}
  .tk-top-r{width:38px}

  /* GRID */
  .tk-grid{position:relative;z-index:10;display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:24px 28px}

  /* TOOL CARD */
  .tk-tool{border-radius:20px;overflow:hidden;cursor:pointer;transition:all 0.2s;animation:tkFade 0.4s ease both;position:relative}
  .tk-tool:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.35)}
  .tk-tool:nth-child(1){animation-delay:0.04s}.tk-tool:nth-child(2){animation-delay:0.08s}
  .tk-tool:nth-child(3){animation-delay:0.12s}.tk-tool:nth-child(4){animation-delay:0.16s}
  .tk-tool:nth-child(5){animation-delay:0.20s}.tk-tool:nth-child(6){animation-delay:0.24s}

  .tk-tool-inner{padding:22px 18px;display:flex;flex-direction:column;gap:10px;min-height:140px;position:relative;z-index:1}
  .tk-tool-icon{font-size:32px;margin-bottom:2px}
  .tk-tool-name{font-family:'Fraunces',serif;font-size:18px;font-weight:700;color:#fff;line-height:1.1}
  .tk-tool-desc{font-size:12px;color:rgba(255,255,255,0.7);line-height:1.45}
  .tk-tool-arrow{position:absolute;bottom:16px;right:16px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff}

  /* SUB-SCREEN SHARED */
  .tk-sub{position:relative;z-index:10;display:flex;flex-direction:column;min-height:100vh}
  .tk-sub-hero{padding:24px 28px 20px;border-bottom:1px solid var(--bdr)}
  .tk-sub-hero-row{display:flex;align-items:center;gap:14px;margin-bottom:14px}
  .tk-sub-icon{width:56px;height:56px;border-radius:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:28px}
  .tk-sub-name{font-family:'Fraunces',serif;font-size:22px;font-weight:800;letter-spacing:-0.3px;margin-bottom:4px}
  .tk-sub-tagline{font-size:13px;color:var(--tm);line-height:1.5}

  .tk-body{flex:1;overflow-y:auto;padding:20px 28px 40px;display:flex;flex-direction:column;gap:16px}

  /* CARD */
  .tk-card{background:var(--dkc);border:1px solid var(--bdr);border-radius:16px;padding:18px 20px}
  .tk-card-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ts);margin-bottom:12px;display:flex;align-items:center;gap:8px}
  .tk-card-title span{font-size:14px}

  /* BOUNDARY ITEMS */
  .tk-boundary-list{display:flex;flex-direction:column;gap:8px}
  .tk-boundary{background:var(--dks);border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all 0.18s}
  .tk-boundary:hover{border-color:rgba(255,255,255,0.12)}
  .tk-boundary.set{border-color:rgba(46,216,195,0.3);background:rgba(46,216,195,0.06)}
  .tk-b-icon{font-size:20px;flex-shrink:0}
  .tk-b-info{flex:1}
  .tk-b-name{font-size:14px;font-weight:600;margin-bottom:2px}
  .tk-b-desc{font-size:11px;color:var(--ts)}
  .tk-b-toggle{width:36px;height:20px;border-radius:10px;background:var(--dk);border:1px solid var(--bdr);position:relative;cursor:pointer;transition:all 0.2s;flex-shrink:0}
  .tk-boundary.set .tk-b-toggle{background:var(--teal);border-color:var(--teal)}
  .tk-b-toggle-dot{width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:all 0.2s}
  .tk-boundary.set .tk-b-toggle-dot{left:18px}

  /* CHALLENGE ITEMS */
  .tk-challenge-list{display:flex;flex-direction:column;gap:8px}
  .tk-challenge{background:var(--dks);border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;cursor:pointer;transition:all 0.18s}
  .tk-challenge:hover{border-color:rgba(255,255,255,0.12)}
  .tk-challenge.done{border-color:rgba(245,166,35,0.3);background:rgba(245,166,35,0.05)}
  .tk-ch-top{display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .tk-ch-icon{font-size:20px;flex-shrink:0}
  .tk-ch-name{font-size:14px;font-weight:600;flex:1}
  .tk-ch-pts{font-size:11px;color:var(--gold);font-weight:700;background:rgba(245,166,35,0.1);padding:2px 8px;border-radius:100px}
  .tk-ch-desc{font-size:12px;color:var(--ts);line-height:1.5}
  .tk-ch-check{width:22px;height:22px;border-radius:50%;border:2px solid var(--bdr);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all 0.18s}
  .tk-challenge.done .tk-ch-check{background:var(--gold);border-color:var(--gold);color:#0C1018}

  /* ROLEPLAY */
  .tk-rp-list{display:flex;flex-direction:column;gap:10px}
  .tk-rp-card{background:var(--dks);border:1px solid var(--bdr);border-radius:14px;padding:16px;cursor:pointer;transition:all 0.18s}
  .tk-rp-card:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-1px)}
  .tk-rp-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .tk-rp-icon{font-size:22px;flex-shrink:0}
  .tk-rp-name{font-family:'Fraunces',serif;font-size:16px;font-weight:600;flex:1}
  .tk-rp-badge{font-size:10px;padding:3px 8px;border-radius:100px;font-weight:600}
  .tk-rp-desc{font-size:12px;color:var(--ts);line-height:1.5;margin-bottom:10px}
  .tk-rp-btn{padding:8px 16px;border-radius:8px;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.18s;display:inline-flex;align-items:center;gap:6px}

  /* CREATOR */
  .tk-cr-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .tk-cr-item{background:var(--dks);border:1px solid var(--bdr);border-radius:12px;padding:14px 12px;text-align:center;cursor:pointer;transition:all 0.18s;display:flex;flex-direction:column;align-items:center;gap:7px}
  .tk-cr-item:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-1px)}
  .tk-cr-icon{font-size:26px}
  .tk-cr-name{font-size:13px;font-weight:600}
  .tk-cr-sub{font-size:10px;color:var(--ts)}

  /* LIFE ADMIN */
  .tk-la-list{display:flex;flex-direction:column;gap:7px}
  .tk-la-item{background:var(--dks);border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all 0.18s}
  .tk-la-item:hover{border-color:rgba(255,255,255,0.12)}
  .tk-la-item.done{border-color:rgba(46,216,195,0.25);background:rgba(46,216,195,0.04)}
  .tk-la-check{width:20px;height:20px;border-radius:6px;border:1.5px solid var(--bdr);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all 0.18s}
  .tk-la-item.done .tk-la-check{background:var(--teal);border-color:var(--teal);color:#0C1018}
  .tk-la-icon{font-size:16px;flex-shrink:0}
  .tk-la-text{flex:1;font-size:13px}
  .tk-la-cat{font-size:10px;color:var(--ts);margin-left:auto;flex-shrink:0}

  /* COUPLE */
  .tk-couple-list{display:flex;flex-direction:column;gap:10px}
  .tk-couple-card{background:var(--dks);border:1px solid var(--bdr);border-radius:14px;padding:16px;cursor:pointer;transition:all 0.18s}
  .tk-couple-card:hover{border-color:rgba(233,30,140,0.25);transform:translateY(-1px)}
  .tk-couple-top{display:flex;align-items:center;gap:10px;margin-bottom:7px}
  .tk-couple-icon{font-size:22px}
  .tk-couple-name{font-family:'Fraunces',serif;font-size:15px;font-weight:700;flex:1}
  .tk-couple-tag{font-size:10px;padding:2px 8px;border-radius:100px;background:rgba(233,30,140,0.12);color:var(--pink);font-weight:600}
  .tk-couple-desc{font-size:12px;color:var(--ts);line-height:1.5}

  /* PROMPT BOX */
  .tk-prompt{background:linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02));border:1px solid rgba(245,166,35,0.2);border-radius:14px;padding:18px 20px}
  .tk-prompt-lbl{font-size:10px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
  .tk-prompt-text{font-family:'Fraunces',serif;font-size:17px;font-weight:600;line-height:1.4;margin-bottom:12px}
  .tk-prompt-btn{padding:9px 20px;border-radius:9px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.18s;display:inline-flex;align-items:center;gap:6px}
  .tk-prompt-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px var(--gg)}

  /* SCORE CHIP ROW */
  .tk-score-row{display:flex;gap:8px}
  .tk-score-chip{flex:1;background:var(--dks);border:1px solid var(--bdr);border-radius:11px;padding:12px 10px;text-align:center}
  .tk-score-val{font-family:'Fraunces',serif;font-size:22px;font-weight:700;line-height:1}
  .tk-score-lbl{font-size:9px;color:var(--ts);margin-top:3px;letter-spacing:0.5px;text-transform:uppercase}

  /* INPUT */
  .tk-input{width:100%;background:var(--dks);border:1.5px solid var(--bdr);border-radius:11px;padding:12px 14px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.18s}
  .tk-input:focus{border-color:var(--gold)}
  .tk-input::placeholder{color:var(--ts)}
  .tk-textarea{width:100%;background:var(--dks);border:1.5px solid var(--bdr);border-radius:11px;padding:12px 14px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;resize:none;line-height:1.6;transition:border-color 0.18s}
  .tk-textarea:focus{border-color:var(--gold)}
  .tk-textarea::placeholder{color:var(--ts)}

  /* BTN */
  .tk-btn-gold{padding:12px 24px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.18s;box-shadow:0 3px 12px var(--gg);display:inline-flex;align-items:center;gap:7px}
  .tk-btn-gold:hover{transform:translateY(-1px);box-shadow:0 5px 18px var(--gg)}
  .tk-btn-ghost{padding:12px 24px;border-radius:10px;background:var(--dks);border:1px solid var(--bdr);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.18s}
  .tk-btn-ghost:hover{border-color:rgba(255,255,255,0.15);color:var(--tp)}

  /* ANIMATIONS */
  @keyframes tkFade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

  @media(max-width:600px){
    .tk-top,.tk-grid,.tk-body,.tk-sub-hero{padding-left:18px;padding-right:18px}
    .tk-grid{gap:10px}
    .tk-cr-grid{grid-template-columns:1fr 1fr}
  }
`;

/* ── TOOLS CONFIG ── */
const TOOLS = [
  { id:"boundaries", icon:"🛡️", name:"Boundaries",  desc:"Set & protect your limits", bg:"linear-gradient(135deg,#E8922A,#c97820)", color:"#E8922A" },
  { id:"couple",     icon:"💑", name:"Couple Mode",  desc:"Strengthen your relationship", bg:"linear-gradient(135deg,#E91E8C,#c01575)", color:"#E91E8C" },
  { id:"creator",    icon:"🎨", name:"Creator",      desc:"Build your creative output", bg:"linear-gradient(135deg,#2ED8C3,#1a9e8f)", color:"#2ED8C3" },
  { id:"lifeadmin",  icon:"📋", name:"Life Admin",   desc:"Organise your life systems", bg:"linear-gradient(135deg,#3B82F6,#2563eb)", color:"#3B82F6" },
  { id:"challenges", icon:"🏆", name:"Challenges",   desc:"Push your limits daily", bg:"linear-gradient(135deg,#9B59B6,#7b3f9e)", color:"#9B59B6" },
  { id:"roleplay",   icon:"🎭", name:"Roleplay",     desc:"Practice hard conversations", bg:"linear-gradient(135deg,#F59E0B,#d97706)", color:"#F59E0B" },
];

const BOUNDARIES_DATA = [
  { icon:"📵", name:"Phone-free mornings", desc:"No phone for first 30 mins after waking" },
  { icon:"🚫", name:"No work after 7pm",   desc:"Protect your evening for rest & family" },
  { icon:"🤐", name:"No gossip",           desc:"Refuse to speak negatively about others" },
  { icon:"💆", name:"Weekly alone time",   desc:"At least 2 hours of solitude per week" },
  { icon:"🥗", name:"No junk food weekdays",desc:"Clean eating Mon–Fri without exception" },
  { icon:"😤", name:"No venting to strangers",desc:"Process emotions with trusted people only" },
];

const CHALLENGES_DATA = [
  { icon:"🌅", name:"5AM Wake-Up", pts:50,  desc:"Wake up at 5AM and complete your morning routine", done:false },
  { icon:"💧", name:"3L Water Today", pts:30, desc:"Drink 3 litres of water throughout the day", done:false },
  { icon:"📵", name:"Social Media Detox", pts:40, desc:"Zero social media for the entire day", done:false },
  { icon:"🏃", name:"30-Min Walk", pts:25,  desc:"Take a 30-minute walk without your phone", done:false },
  { icon:"📖", name:"Read 20 Pages", pts:35, desc:"Read 20 pages of a non-fiction book", done:false },
  { icon:"🧘", name:"10-Min Meditation", pts:20, desc:"Complete a 10-minute mindfulness session", done:false },
  { icon:"✍️", name:"Gratitude Journal", pts:15, desc:"Write 3 things you're genuinely grateful for", done:false },
  { icon:"📞", name:"Call Someone You Love", pts:30, desc:"Have a meaningful conversation with family", done:false },
];

const ROLEPLAY_DATA = [
  { icon:"💼", name:"Salary Negotiation", badge:"Career",  color:"#3B82F6", desc:"Practice asking for what you're worth — confidently and calmly." },
  { icon:"💔", name:"Difficult Breakup",  badge:"Personal",color:"#E91E8C", desc:"Navigate a painful conversation with empathy and clarity." },
  { icon:"🤝", name:"Setting Boundaries", badge:"Growth",  color:"#2ED8C3", desc:"Say no firmly and kindly without guilt or over-explanation." },
  { icon:"😤", name:"Confronting a Friend",badge:"Social", color:"#F59E0B", desc:"Address a conflict before it damages the friendship." },
  { icon:"👨‍👩‍👧", name:"Family Tension",   badge:"Family", color:"#E8922A", desc:"Hold your ground without losing your love for them." },
  { icon:"🔥", name:"High-Pressure Pitch", badge:"Career", color:"#9B59B6", desc:"Present your idea under pressure with conviction." },
];

const CREATOR_DATA = [
  { icon:"✍️", name:"Content Ideas",   sub:"Generate 10 ideas in 5 min" },
  { icon:"📸", name:"Caption Writer",  sub:"For any photo or moment" },
  { icon:"🎙", name:"Script Builder",  sub:"Video/podcast scripts" },
  { icon:"🧵", name:"Thread Maker",    sub:"Twitter/X thread creator" },
  { icon:"📧", name:"Email Drafter",   sub:"Emails that get replies" },
  { icon:"🎯", name:"Hook Generator",  sub:"Scroll-stopping openers" },
];

const LIFE_ADMIN_DATA = [
  { icon:"🏠", cat:"Home",    text:"Pay rent / mortgage",       done:false },
  { icon:"💊", cat:"Health",  text:"Book dentist appointment",   done:false },
  { icon:"📄", cat:"Finance", text:"Review monthly expenses",    done:false },
  { icon:"🚗", cat:"Car",     text:"Service car this month",     done:false },
  { icon:"📋", cat:"Work",    text:"Update CV / LinkedIn",       done:false },
  { icon:"🎂", cat:"Family",  text:"Plan mum's birthday",        done:false },
  { icon:"💡", cat:"Home",    text:"Cancel unused subscriptions",done:false },
  { icon:"📱", cat:"Finance", text:"Check credit score",         done:false },
];

const COUPLE_DATA = [
  { icon:"💬", name:"Connect Question", tag:"Daily",   desc:"What's one thing I did this week that made you feel loved?" },
  { icon:"🎯", name:"Shared Goal",      tag:"Weekly",  desc:"Set one goal you'll work on together this week." },
  { icon:"🔥", name:"Appreciation",     tag:"Tonight", desc:"Tell your partner 3 specific things you appreciate about them." },
  { icon:"🧩", name:"Conflict Repair",  tag:"Support", desc:"Use this when things feel tense — a structured way to reconnect." },
  { icon:"💑", name:"Date Night Idea",  tag:"Fun",     desc:"Plan something unexpected for your partner this week." },
];

const ROLEPLAY_PROMPTS = [
  "Say: 'I'd like to discuss my compensation — I believe my contributions warrant a salary of...'",
  "Start with: 'I need to tell you something important, and I want to do this with care...'",
  "Try: 'I care about our relationship which is why I need to be honest with you...'",
  "Begin: 'I've been meaning to bring this up — I want us to address it before it gets bigger...'",
];

export default function ToolkitScreen({ onBack }) {
  const [active,      setActive]     = useState(null);
  const [boundaries,  setBoundaries] = useState({});
  const [challenges,  setChallenges] = useState({});
  const [laItems,     setLaItems]    = useState({});
  const [rpScene,     setRpScene]    = useState(null);
  const [rpInput,     setRpInput]    = useState("");
  const [crTool,      setCrTool]     = useState(null);
  const [crInput,     setCrInput]    = useState("");
  const [crOutput,    setCrOutput]   = useState("");
  const [promptIdx,   setPromptIdx]  = useState(0);
  const [coupleCard,  setCoupleCard] = useState(null);

  const tool = TOOLS.find(t => t.id === active);

  const togBoundary = i => setBoundaries(b => ({...b,[i]:!b[i]}));
  const togChallenge = i => setChallenges(c => ({...c,[i]:!c[i]}));
  const togLa = i => setLaItems(l => ({...l,[i]:!l[i]}));

  const totalPts = Object.entries(challenges).filter(([,v])=>v).reduce((a,[k])=>a+(CHALLENGES_DATA[+k]?.pts||0),0);

  const genCreator = () => {
    const outputs = {
      "Content Ideas": `10 Content Ideas based on "${crInput}":\n1. "The truth about ${crInput} nobody tells you"\n2. "I tried ${crInput} for 30 days — here's what happened"\n3. "5 mistakes beginners make with ${crInput}"\n4. "How ${crInput} changed my life in 90 days"\n5. "The ${crInput} guide for busy people"\n6. "Why most people fail at ${crInput}"\n7. "What I wish I knew before starting ${crInput}"\n8. "${crInput} vs. [alternative] — honest comparison"\n9. "The underrated side of ${crInput}"\n10. "Day 1 of my ${crInput} journey"`,
      "Caption Writer": `Caption for: "${crInput}"\n\n"${crInput} — because the version of me who used to settle for less deserved better.\n\nThis is what choosing yourself looks like. 🙌\n\n#growth #mindset #beingtchitaka #discipline"`,
      "Script Builder": `Script for: "${crInput}"\n\nHook: "If you've ever struggled with ${crInput}, this is for you."\n\nMain body: Walk through the 3 key points — what it is, why it matters, and how to start today.\n\nCTA: "Follow for more. Drop a comment if this resonated."`,
      "Thread Maker": `🧵 Thread on: ${crInput}\n\n1/ Most people think ${crInput} is complicated. It's not.\n\nHere's everything you need to know 👇\n\n2/ First — understand why it matters...\n\n3/ The biggest mistake people make is...\n\n4/ Here's the simple framework:\n• Step 1\n• Step 2  \n• Step 3\n\n5/ The bottom line: ${crInput} comes down to one decision...\n\nRT if this helped. Follow for more. 🔥`,
      "Email Drafter": `Subject: Quick question re: ${crInput}\n\nHi [Name],\n\nI hope this finds you well.\n\nI'm reaching out about ${crInput} — I think there's a real opportunity here worth exploring together.\n\n[Key point in 1 sentence]\n\nWould you be open to a 15-minute call this week?\n\nBest,\n[Your name]`,
      "Hook Generator": `5 Hooks for "${crInput}":\n\n1. "Nobody talks about this side of ${crInput}..."\n2. "I made every mistake with ${crInput} so you don't have to."\n3. "The ${crInput} advice that actually works (and why everything else fails)"\n4. "Stop scrolling if you've ever struggled with ${crInput}."\n5. "This one shift changed how I think about ${crInput} forever."`,
    };
    setCrOutput(outputs[crTool] || `Generated content for: ${crInput}`);
  };

  /* ── TOOL HUB ── */
  const renderTool = () => {
    /* BOUNDARIES */
    if (active === "boundaries") return (
      <div className="tk-body">
        <div className="tk-card">
          <div className="tk-card-title"><span>🛡️</span> Your Active Boundaries</div>
          <div className="tk-boundary-list">
            {BOUNDARIES_DATA.map((b,i) => (
              <div key={i} className={`tk-boundary ${boundaries[i]?"set":""}`} onClick={() => togBoundary(i)}>
                <span className="tk-b-icon">{b.icon}</span>
                <div className="tk-b-info">
                  <div className="tk-b-name">{b.name}</div>
                  <div className="tk-b-desc">{b.desc}</div>
                </div>
                <div className="tk-b-toggle"><div className="tk-b-toggle-dot"/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="tk-score-row">
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--teal)"}}>{Object.values(boundaries).filter(Boolean).length}</div>
            <div className="tk-score-lbl">Active</div>
          </div>
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--gold)"}}>{BOUNDARIES_DATA.length}</div>
            <div className="tk-score-lbl">Total</div>
          </div>
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--purple)"}}>🔥</div>
            <div className="tk-score-lbl">Holding</div>
          </div>
        </div>

        <div className="tk-prompt">
          <div className="tk-prompt-lbl">💡 Daily Reminder</div>
          <div className="tk-prompt-text">"A boundary is not a wall — it's a gate you control."</div>
          <button className="tk-prompt-btn" onClick={() => setPromptIdx(i => (i+1)%3)}>Next reminder →</button>
        </div>
      </div>
    );

    /* CHALLENGES */
    if (active === "challenges") return (
      <div className="tk-body">
        <div className="tk-score-row">
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--gold)"}}>{totalPts}</div>
            <div className="tk-score-lbl">Points today</div>
          </div>
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--teal)"}}>{Object.values(challenges).filter(Boolean).length}</div>
            <div className="tk-score-lbl">Completed</div>
          </div>
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--purple)"}}>🏆</div>
            <div className="tk-score-lbl">Streak</div>
          </div>
        </div>

        <div className="tk-card">
          <div className="tk-card-title"><span>⚡</span> Today's Challenges</div>
          <div className="tk-challenge-list">
            {CHALLENGES_DATA.map((c,i) => (
              <div key={i} className={`tk-challenge ${challenges[i]?"done":""}`} onClick={() => togChallenge(i)}>
                <div className="tk-ch-top">
                  <span className="tk-ch-icon">{c.icon}</span>
                  <span className="tk-ch-name">{c.name}</span>
                  <span className="tk-ch-pts">+{c.pts}pts</span>
                  <div className={`tk-ch-check ${challenges[i]?"done":""}`}>{challenges[i]&&"✓"}</div>
                </div>
                <div className="tk-ch-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    /* ROLEPLAY */
    if (active === "roleplay") return (
      <div className="tk-body">
        {!rpScene ? (
          <>
            <div className="tk-card">
              <div className="tk-card-title"><span>🎭</span> Choose a Scenario</div>
              <div className="tk-rp-list">
                {ROLEPLAY_DATA.map((r,i) => (
                  <div key={i} className="tk-rp-card" onClick={() => { setRpScene(r); setRpInput(""); }}>
                    <div className="tk-rp-top">
                      <span className="tk-rp-icon">{r.icon}</span>
                      <span className="tk-rp-name">{r.name}</span>
                      <span className="tk-rp-badge" style={{background:r.color+"20",color:r.color}}>{r.badge}</span>
                    </div>
                    <div className="tk-rp-desc">{r.desc}</div>
                    <button className="tk-rp-btn" style={{background:r.color+"18",color:r.color,border:`1px solid ${r.color}30`}}>
                      Practice →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="tk-prompt" style={{borderColor:rpScene.color+"30",background:rpScene.color+"09"}}>
              <div className="tk-prompt-lbl" style={{color:rpScene.color}}>{rpScene.icon} {rpScene.name}</div>
              <div className="tk-prompt-text">{rpScene.desc}</div>
              <div style={{fontSize:"13px",color:"var(--tm)",marginBottom:"12px",fontStyle:"italic",lineHeight:1.55}}>
                {ROLEPLAY_PROMPTS[ROLEPLAY_DATA.indexOf(rpScene) % ROLEPLAY_PROMPTS.length]}
              </div>
            </div>

            <div className="tk-card">
              <div className="tk-card-title"><span>✍️</span> Practice your response</div>
              <textarea className="tk-textarea" rows={5}
                placeholder="Type what you would say in this situation..."
                value={rpInput} onChange={e => setRpInput(e.target.value)}/>
              <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
                <button className="tk-btn-gold" onClick={() => setRpScene(null)}>← Back</button>
                {rpInput && <button className="tk-btn-ghost">Save response</button>}
              </div>
            </div>

            <div className="tk-card">
              <div className="tk-card-title"><span>💡</span> Coaching tips</div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {["Stay calm — lower your voice, not your resolve","Use 'I' statements, not 'you' accusations","Pause before responding — silence is power","Name what you need, not what they did wrong"].map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:"8px",fontSize:"13px",color:"var(--tm)",lineHeight:1.5}}>
                    <span style={{color:"var(--gold)",fontWeight:700,flexShrink:0}}>{i+1}.</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );

    /* CREATOR */
    if (active === "creator") return (
      <div className="tk-body">
        {!crTool ? (
          <div className="tk-card">
            <div className="tk-card-title"><span>🎨</span> Creator Tools</div>
            <div className="tk-cr-grid">
              {CREATOR_DATA.map((c,i) => (
                <div key={i} className="tk-cr-item" onClick={() => { setCrTool(c.name); setCrInput(""); setCrOutput(""); }}>
                  <span className="tk-cr-icon">{c.icon}</span>
                  <span className="tk-cr-name">{c.name}</span>
                  <span className="tk-cr-sub">{c.sub}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="tk-card">
              <div className="tk-card-title"><span>{CREATOR_DATA.find(c=>c.name===crTool)?.icon}</span> {crTool}</div>
              <div style={{marginBottom:"10px",fontSize:"12px",color:"var(--ts)"}}>What's your topic or subject?</div>
              <input className="tk-input" placeholder="e.g. discipline, morning routines, self-love..."
                value={crInput} onChange={e => setCrInput(e.target.value)}/>
              <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
                <button className="tk-btn-gold" onClick={genCreator} disabled={!crInput}>Generate ✨</button>
                <button className="tk-btn-ghost" onClick={() => { setCrTool(null); setCrOutput(""); }}>← Back</button>
              </div>
            </div>
            {crOutput && (
              <div className="tk-card">
                <div className="tk-card-title"><span>✨</span> Generated Output</div>
                <div style={{fontSize:"13px",color:"var(--tm)",lineHeight:1.7,whiteSpace:"pre-line"}}>{crOutput}</div>
                <div style={{display:"flex",gap:"8px",marginTop:"14px"}}>
                  <button className="tk-btn-gold" onClick={() => navigator.clipboard?.writeText(crOutput)}>Copy 📋</button>
                  <button className="tk-btn-ghost" onClick={() => { setCrInput(""); setCrOutput(""); }}>Regenerate</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );

    /* LIFE ADMIN */
    if (active === "lifeadmin") return (
      <div className="tk-body">
        <div className="tk-score-row">
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--teal)"}}>{Object.values(laItems).filter(Boolean).length}</div>
            <div className="tk-score-lbl">Done</div>
          </div>
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--ts)"}}>{LIFE_ADMIN_DATA.length - Object.values(laItems).filter(Boolean).length}</div>
            <div className="tk-score-lbl">Remaining</div>
          </div>
          <div className="tk-score-chip">
            <div className="tk-score-val" style={{color:"var(--blue)"}}>📋</div>
            <div className="tk-score-lbl">Admin</div>
          </div>
        </div>

        <div className="tk-card">
          <div className="tk-card-title"><span>📋</span> Life Tasks</div>
          <div className="tk-la-list">
            {LIFE_ADMIN_DATA.map((l,i) => (
              <div key={i} className={`tk-la-item ${laItems[i]?"done":""}`} onClick={() => togLa(i)}>
                <div className={`tk-la-check ${laItems[i]?"done":""}`}>{laItems[i]&&"✓"}</div>
                <span className="tk-la-icon">{l.icon}</span>
                <span className="tk-la-text" style={{textDecoration:laItems[i]?"line-through":"none",color:laItems[i]?"var(--ts)":"var(--tp)"}}>{l.text}</span>
                <span className="tk-la-cat">{l.cat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tk-prompt">
          <div className="tk-prompt-lbl">💡 Life Admin Tip</div>
          <div className="tk-prompt-text">"Handle the small things before they become big things."</div>
        </div>
      </div>
    );

    /* COUPLE MODE */
    if (active === "couple") return (
      <div className="tk-body">
        {!coupleCard ? (
          <>
            <div className="tk-prompt" style={{borderColor:"rgba(233,30,140,0.25)",background:"rgba(233,30,140,0.06)"}}>
              <div className="tk-prompt-lbl" style={{color:"var(--pink)"}}>💑 Couple's Daily Prompt</div>
              <div className="tk-prompt-text">"What's one thing I could do this week that would make you feel more supported?"</div>
              <button className="tk-prompt-btn" style={{background:"linear-gradient(135deg,#E91E8C,#c01575)"}}>
                Start Conversation →
              </button>
            </div>

            <div className="tk-card">
              <div className="tk-card-title"><span>❤️</span> Relationship Tools</div>
              <div className="tk-couple-list">
                {COUPLE_DATA.map((c,i) => (
                  <div key={i} className="tk-couple-card" onClick={() => setCoupleCard(c)}>
                    <div className="tk-couple-top">
                      <span className="tk-couple-icon">{c.icon}</span>
                      <span className="tk-couple-name">{c.name}</span>
                      <span className="tk-couple-tag">{c.tag}</span>
                    </div>
                    <div className="tk-couple-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="tk-prompt" style={{borderColor:"rgba(233,30,140,0.25)",background:"rgba(233,30,140,0.06)"}}>
              <div className="tk-prompt-lbl" style={{color:"var(--pink)"}}>
                {coupleCard.icon} {coupleCard.name} · {coupleCard.tag}
              </div>
              <div className="tk-prompt-text">{coupleCard.desc}</div>
            </div>
            <div className="tk-card">
              <div className="tk-card-title"><span>✍️</span> Your response / reflection</div>
              <textarea className="tk-textarea" rows={4}
                placeholder="Write your thoughts here..."
                value={rpInput} onChange={e => setRpInput(e.target.value)}/>
              <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
                <button className="tk-btn-gold" onClick={() => setCoupleCard(null)}>← Back</button>
                {rpInput && <button className="tk-btn-ghost">Save</button>}
              </div>
            </div>
          </>
        )}
      </div>
    );

    return null;
  };

  /* ── LIST ── */
  if (!active) return (
    <>
      <style>{S}</style>
      <div className="tk-root">
        <div className="tk-bg"/>
        <div className="tk-top">
          <div className="tk-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div className="tk-top-info">
            <div className="tk-top-title">Toolkit</div>
            <div className="tk-top-sub">Your growth tools</div>
          </div>
          <div className="tk-top-r"/>
        </div>
        <div className="tk-grid">
          {TOOLS.map(t => (
            <div key={t.id} className="tk-tool" style={{background:t.bg}} onClick={() => setActive(t.id)}>
              <div className="tk-tool-inner">
                <div className="tk-tool-icon">{t.icon}</div>
                <div className="tk-tool-name">{t.name}</div>
                <div className="tk-tool-desc">{t.desc}</div>
              </div>
              <div className="tk-tool-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  /* ── DETAIL ── */
  return (
    <>
      <style>{S}</style>
      <div className="tk-root">
        <div className="tk-bg"/>
        <div className="tk-top">
          <div className="tk-back" onClick={() => { setActive(null); setRpScene(null); setCrTool(null); setCoupleCard(null); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </div>
          <div className="tk-top-info">
            <div className="tk-top-title">{tool.name}</div>
            <div className="tk-top-sub">{tool.desc}</div>
          </div>
          <div className="tk-top-r"/>
        </div>

        <div className="tk-sub">
          <div className="tk-sub-hero">
            <div className="tk-sub-hero-row">
              <div className="tk-sub-icon" style={{background:tool.bg}}>{tool.icon}</div>
              <div>
                <div className="tk-sub-name">{tool.name}</div>
                <div className="tk-sub-tagline">{tool.desc}</div>
              </div>
            </div>
          </div>
          {renderTool()}
        </div>
      </div>
    </>
  );
}
