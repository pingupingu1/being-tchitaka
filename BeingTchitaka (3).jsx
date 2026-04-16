import { useState, useEffect, useRef } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

// ─── FIREBASE INIT (safe for HMR) ────────────────────────────────────────────
const _fbConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
const firebaseApp    = getApps().length ? getApp() : initializeApp(_fbConfig);
const fbAuth         = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// ─── STRIPE PLAN PRICES ───────────────────────────────────────────────────────
const PLAN_PRICES = {
  pro:     import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE     || "9.99",
  premium: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE || "19.99",
};

// ─── WATSONX AI GUIDANCE ──────────────────────────────────────────────────────
async function callWatsonX({ mood, vals, name, tasks }) {
  const BASE   = import.meta.env.VITE_WATSONX_BASE_URL;
  const PROJ   = import.meta.env.VITE_WATSONX_PROJECT_ID;
  const MODEL  = import.meta.env.VITE_WATSONX_MODEL_ID || "ibm/granite-13b-chat-v2";
  const APIKEY = import.meta.env.VITE_WATSONX_API_KEY;
  const IAM    = import.meta.env.VITE_IBM_IAM_URL;
  const moodLabels = ["very low","low","neutral","good","great"];
  const taskList = tasks.map((t,i)=>`${i+1}. ${t.text}`).join("\n");
  const prompt = `You are Rodrigue, a certified growth coach. Write a warm 3-sentence personalised daily guidance for ${name}.\nCheck-in: mood=${moodLabels[mood??2]}, Stress=${vals.Stress}/10, Energy=${vals.Energy}/10, Focus=${vals.Focus}/10, Relationship=${vals.Relationship}/10.\nTasks today: ${taskList}\nEnd with one short affirmation.`;
  try {
    const iamRes = await fetch(IAM, {
      method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body: new URLSearchParams({grant_type:"urn:ibm:params:oauth:grant-type:apikey", apikey:APIKEY}),
    });
    if(!iamRes.ok) throw new Error("IAM "+iamRes.status);
    const {access_token} = await iamRes.json();
    const res = await fetch(`${BASE}/ml/v1/text/generation?version=2023-05-29`, {
      method:"POST",
      headers:{"Content-Type":"application/json", Authorization:`Bearer ${access_token}`},
      body: JSON.stringify({
        model_id:PROJ, project_id:PROJ, input:prompt,
        parameters:{decoding_method:"greedy",max_new_tokens:250,min_new_tokens:40,repetition_penalty:1.1},
      }),
    });
    if(!res.ok) throw new Error("WatsonX "+res.status);
    const data = await res.json();
    const text = data?.results?.[0]?.generated_text?.trim();
    if(!text) throw new Error("empty");
    return {ok:true, text};
  } catch(err) {
    console.warn("WatsonX fallback:", err.message);
    return {ok:false, text:"Stay calm and take one step at a time. Your fresh start is right now — breathe, focus on one thing, and trust the process. You have got this."};
  }
}


// ─── THEME ────────────────────────────────────────────────────────────────────
const G = "#f5a623";
const GD = "#c97d0a";
const DARK_BG = "#13120f";
const DARK_CARD = "#1e1c17";
const DARK_CARD2 = "#252218";

// ─── DATA ────────────────────────────────────────────────────────────────────
const QUOTES = [
  "Discipline > Motivation",
  "Small steps daily build an extraordinary life.",
  "Be the energy you want to attract.",
  "Your consistency is your superpower.",
  "Win the morning, win the day.",
];
const MOODS = ["😞","😕","😐","🙂","😄"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const BOOKING_SLOTS = [
  {time:"9:00 AM",  off:false},
  {time:"10:00 AM", off:false},
  {time:"10:30 AM", off:true},
  {time:"12:00 PM", off:false},
  {time:"2:00 PM",  off:false},
  {time:"3:30 PM",  off:true},
  {time:"5:00 PM",  off:false},
];
const DEFAULT_PLAN = [
  {id:1, text:"Do 5-min focus block", color:"#4a8fdb", done:false},
  {id:2, text:"Call Mom ❤️",           color:"#e85479", done:false},
  {id:3, text:"Journal 2 min",         color:"#f5a623", done:false},
];
const TOOLKIT_ITEMS = [
  {icon:"🛡️", label:"Boundaries",    bg:"rgba(245,166,35,.15)"},
  {icon:"🎭", label:"Roleplay",       bg:"rgba(167,139,250,.15)"},
  {icon:"💑", label:"Couple Mode",    bg:"rgba(244,114,182,.15)"},
  {icon:"✍️", label:"Creator Engine", bg:"rgba(96,165,250,.15)"},
  {icon:"📋", label:"Life Admin",     bg:"rgba(52,211,153,.15)"},
  {icon:"🎯", label:"Challenges",     bg:"rgba(192,132,252,.15)"},
];
const PROGRAMS = [
  {icon:"🎯", name:"21-Day Discipline Reset",  days:17, total:21, color:"#f5a623", desc:"Build unshakeable daily habits that stick for life."},
  {icon:"🌟", name:"Discover Your Purpose",    days:5,  total:14, color:"#a78bfa", desc:"Clarity sessions to uncover your unique calling."},
  {icon:"🧘", name:"Calm & Mindfulness",       days:3,  total:7,  color:"#34d399", desc:"Daily calm practices to reset your nervous system."},
  {icon:"💑", name:"Couple Growth Journey",    days:8,  total:14, color:"#f472b6", desc:"Strengthen your relationship through growth rituals."},
];
const CALM_SESSIONS = [
  {icon:"🌙", name:"Evening Wind-Down",    dur:3,  type:"Breathwork"},
  {icon:"🌊", name:"Ocean Calm",           dur:5,  type:"Soundscape"},
  {icon:"🧘", name:"Body Scan Relaxation", dur:10, type:"Meditation"},
  {icon:"☀️", name:"Morning Clarity",      dur:7,  type:"Affirmations"},
  {icon:"🌿", name:"Nature Reset",         dur:4,  type:"Visualization"},
];
const NOTIFS = [
  {icon:"🔥", text:"You're on a 5-day streak! Keep it up.",        time:"Just now",    unread:true},
  {icon:"📋", text:"Your daily check-in is ready for today.",       time:"2 hrs ago",   unread:true},
  {icon:"💎", text:"Rodrigue has 3 open slots this week.",          time:"Yesterday",   unread:false},
  {icon:"🌟", text:"New program launched: Discover Your Purpose.",  time:"2 days ago",  unread:false},
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────
function fmtTime() {
  return new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
}
function todayStr() {
  return new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function useToast() {
  const [msgs, setMsgs] = useState([]);
  const show = (m) => {
    const id = Date.now();
    setMsgs(p => [...p, {id, m}]);
    setTimeout(() => setMsgs(p => p.filter(x => x.id !== id)), 3000);
  };
  const Toast = () => (
    <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none",alignItems:"center"}}>
      {msgs.map(({id,m}) => (
        <div key={id} style={{background:DARK_CARD,border:`1px solid ${G}`,color:"#f2ede6",padding:"10px 20px",borderRadius:22,fontSize:13,fontWeight:700,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
          {m}
        </div>
      ))}
    </div>
  );
  return {show, Toast};
}

// ─── STATUS BAR ──────────────────────────────────────────────────────────────
function SBar({dark}) {
  const [t, setT] = useState(fmtTime);
  useEffect(() => {const id = setInterval(()=>setT(fmtTime()),15000); return ()=>clearInterval(id);},[]);
  const c = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.4)";
  const bg = dark ? DARK_CARD : "#f0ede8";
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 14px 4px",background:bg,flexShrink:0}}>
      <span style={{fontSize:11,fontWeight:700,color:c}}>{t}</span>
      <div style={{display:"flex",gap:4,fontSize:9,color:c,alignItems:"center"}}>
        <span>▲▲▲</span><span>WiFi</span>
        <div style={{width:17,height:9,border:`1.5px solid ${c}`,borderRadius:2,position:"relative",marginLeft:2}}>
          <div style={{position:"absolute",top:1.5,left:1.5,bottom:1.5,width:"60%",background:G,borderRadius:1}}/>
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
function BNav({dark, active, onNav}) {
  const items=[
    {ico:"🏠",lbl:"Home"},
    {ico:"🌙",lbl:"Calm"},
    {ico:"📱",lbl:"Programs"},
    {ico:"🛠",lbl:"Toolkit"},
    {ico:"👤",lbl:"Profile"},
  ];
  const bg = dark ? DARK_CARD : "#fff";
  const border = dark ? "1px solid rgba(255,255,255,.07)" : "1px solid rgba(0,0,0,.07)";
  return (
    <div style={{display:"flex",justifyContent:"space-around",padding:"8px 0 10px",borderTop:border,background:bg,flexShrink:0}}>
      {items.map(it=>(
        <div key={it.lbl} onClick={()=>onNav&&onNav(it.lbl)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,opacity:it.lbl===active?1:0.35,cursor:"pointer",transition:"opacity .15s"}}>
          <span style={{fontSize:17}}>{it.ico}</span>
          <span style={{fontSize:9,fontWeight:700,color:it.lbl===active?G:dark?"rgba(255,255,255,.6)":"#9a9080"}}>{it.lbl}</span>
        </div>
      ))}
    </div>
  );
}

// ─── PHONE WRAPPER ────────────────────────────────────────────────────────────
function Phone({dark, active, label, onNav, children}) {
  const bg = dark ? DARK_CARD : "#fff";
  const border = dark ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(0,0,0,.07)";
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      {label && <div style={{fontSize:11,fontWeight:800,letterSpacing:".16em",color:dark?"rgba(255,255,255,.3)":"rgba(0,0,0,.3)",textTransform:"uppercase",textAlign:"center",marginBottom:14}}>{label}</div>}
      <div style={{background:bg,borderRadius:24,overflow:"hidden",border,display:"flex",flexDirection:"column",minHeight:590,boxShadow:dark?"0 8px 40px rgba(0,0,0,.5)":"0 4px 24px rgba(0,0,0,.08)"}}>
        <SBar dark={dark}/>
        <div style={{flex:1,padding:"10px 14px 12px",display:"flex",flexDirection:"column",overflowY:"auto"}}>
          {children}
        </div>
        <BNav dark={dark} active={active||"Home"} onNav={onNav}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════

// ── Overlay shell ─────────────────────────────────────────────────────────────
function Overlay({onClose, children, align="center"}) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:9000,display:"flex",alignItems:align==="top"?"flex-start":"center",justifyContent:align==="right"?"flex-end":"center",padding:20,paddingTop:align==="top"?80:20,paddingRight:align==="right"?20:20}}>
      {children}
    </div>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({onClose}) {
  const [step, setStep] = useState(1);
  const [selDate, setSelDate] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);
  const [calAdded, setCalAdded] = useState(false);

  const dates = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()+i+1);
    return {dow:DAYS_SHORT[d.getDay()],num:d.getDate(),mo:d.toLocaleString("en",{month:"short"}),off:d.getDay()===0};
  });
  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ");
  const fmtExp  = v => {const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};
  const canNext = selDate!==null && selSlot!==null;
  const canPay  = card.replace(/\s/g,"").length===16 && expiry.length===5 && cvc.length>=3 && name.trim().length>1;
  const sd = selDate!==null?dates[selDate]:null;
  const ss = selSlot!==null?BOOKING_SLOTS[selSlot]:null;

  const box={background:DARK_CARD,border:"1px solid rgba(232,160,32,.25)",borderRadius:22,padding:28,width:"100%",maxWidth:420,maxHeight:"88vh",overflowY:"auto",position:"relative"};
  const inp={width:"100%",padding:"10px 12px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:9,color:"#f2ede6",fontSize:13,outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:11,fontWeight:700,letterSpacing:.5,color:"rgba(255,255,255,.45)",marginBottom:5,display:"block"};
  const cta={width:"100%",padding:13,background:G,border:"none",borderRadius:10,color:"#1a1200",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8};

  return (
    <Overlay onClose={onClose}>
      <div style={box}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer"}}>✕</button>
        {/* Stepper */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20}}>
          {["Select Time","Payment","Confirmed"].map((l,i)=>(
            <span key={l} style={{display:"contents"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:step>i+1?G:step===i+1?G:"rgba(255,255,255,.1)",border:`2px solid ${step>=i+1?G:"rgba(255,255,255,.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step>=i+1?"#1a1200":"rgba(255,255,255,.3)",transition:"all .2s"}}>
                {step>i+1?"✓":i+1}
              </div>
              {i<2&&<div style={{height:2,width:32,background:step>i+1?G:"rgba(255,255,255,.1)",transition:"background .3s"}}/>}
            </span>
          ))}
        </div>

        {step===1 && <>
          <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(232,160,32,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>👨🏾‍💼</div>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:"#f2ede6"}}>Rodrigue</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>Certified Growth Coach · 5+ yrs</div>
              <div style={{fontSize:11,color:G,marginTop:2}}>★★★★★ 4.9 · 127 sessions</div>
            </div>
          </div>
          <div style={{background:"rgba(232,160,32,.08)",border:"1px solid rgba(232,160,32,.2)",borderRadius:10,padding:12,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>💎</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f2ede6"}}>1-on-1 Growth Session</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>30 min · Video call · With Rodrigue</div>
            </div>
            <div style={{background:G,color:"#1a1200",fontSize:12,fontWeight:800,borderRadius:8,padding:"3px 9px"}}>$99</div>
          </div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,.3)",textTransform:"uppercase",marginBottom:10}}>Choose a date</div>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {dates.map((d,i)=>(
              <div key={i} onClick={()=>!d.off&&(setSelDate(i),setSelSlot(null))} style={{padding:"8px 12px",borderRadius:10,border:`1.5px solid ${selDate===i?G:d.off?"rgba(255,255,255,.06)":"rgba(255,255,255,.1)"}`,background:selDate===i?"rgba(232,160,32,.15)":"rgba(255,255,255,.04)",cursor:d.off?"not-allowed":"pointer",opacity:d.off?.35:1,textAlign:"center",minWidth:44,transition:"all .15s"}}>
                <div style={{fontSize:9,color:selDate===i?G:"rgba(255,255,255,.4)",fontWeight:700}}>{d.dow}</div>
                <div style={{fontSize:16,fontWeight:800,color:selDate===i?G:"#f2ede6",lineHeight:1.2}}>{d.num}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>{d.mo}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,.3)",textTransform:"uppercase",marginBottom:10}}>Choose a time</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
            {BOOKING_SLOTS.map((sl,i)=>(
              <div key={i} onClick={()=>!sl.off&&setSelSlot(i)} style={{padding:"9px 6px",borderRadius:9,border:`1.5px solid ${selSlot===i?G:sl.off?"rgba(255,255,255,.05)":"rgba(255,255,255,.1)"}`,background:selSlot===i?"rgba(232,160,32,.15)":"rgba(255,255,255,.04)",cursor:sl.off?"not-allowed":"pointer",opacity:sl.off?.3:1,textAlign:"center",transition:"all .15s"}}>
                <div style={{fontSize:12,fontWeight:700,color:selSlot===i?G:"#f2ede6"}}>{sl.time}</div>
                {sl.off&&<div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>Taken</div>}
              </div>
            ))}
          </div>
          <button style={{...cta,opacity:canNext?1:.45,cursor:canNext?"pointer":"not-allowed"}} disabled={!canNext} onClick={()=>canNext&&setStep(2)}>
            {canNext?`Continue — ${sd?.dow} ${sd?.num}, ${ss?.time} →`:"Select a date & time to continue"}
          </button>
        </>}

        {step===2 && <>
          <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:14,marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:700,color:"#f2ede6"}}>Order Summary</span>
              <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:G,fontSize:12,cursor:"pointer",fontWeight:700}}>Change</button>
            </div>
            {[["Session","1-on-1 Growth Session · 30 min"],["Date",`${sd?.dow}, ${sd?.num} ${sd?.mo}`],["Time",ss?.time],["Coach","Rodrigue"],["Total","$99"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderTop:"1px solid rgba(255,255,255,.06)"}}>
                <span style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>{k}</span>
                <span style={{fontSize:12,fontWeight:k==="Total"?800:600,color:k==="Total"?G:"#f2ede6"}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
            <div><label style={lbl}>💳 Card Number</label><input style={inp} placeholder="1234 5678 9012 3456" value={card} onChange={e=>setCard(fmtCard(e.target.value))} maxLength={19}/></div>
            <div><label style={lbl}>👤 Cardholder Name</label><input style={inp} placeholder="Full name on card" value={name} onChange={e=>setName(e.target.value)}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={lbl}>📅 Expiry</label><input style={inp} placeholder="MM/YY" value={expiry} onChange={e=>setExpiry(fmtExp(e.target.value))} maxLength={5}/></div>
              <div><label style={lbl}>🔒 CVC</label><input style={inp} placeholder="•••" value={cvc} onChange={e=>setCvc(e.target.value.replace(/\D/g,"").slice(0,4))} maxLength={4}/></div>
            </div>
          </div>
          <div style={{background:"rgba(52,211,153,.07)",border:"1px solid rgba(52,211,153,.2)",borderRadius:9,padding:"9px 12px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>🔐</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>256-bit SSL encrypted · Your card info is never stored</span>
          </div>
          <button style={{...cta,opacity:canPay&&!paying?1:.45,cursor:canPay&&!paying?"pointer":"not-allowed"}} disabled={!canPay||paying} onClick={()=>{if(!canPay)return;setPaying(true);setTimeout(()=>{setPaying(false);setStep(3);},2200);}}>
            {paying?<><div style={{width:16,height:16,border:"2.5px solid rgba(0,0,0,.2)",borderTopColor:"#1a1200",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Processing…</>:"🔐 Pay $99 Securely →"}
          </button>
          <div style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,.25)",marginTop:8}}>Powered by Stripe · PCI DSS Level 1</div>
        </>}

        {step===3 && (
          <div style={{textAlign:"center",paddingTop:12}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(232,160,32,.15)",border:`2px solid ${G}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px"}}>✦</div>
            <div style={{fontSize:22,fontWeight:800,color:"#f2ede6",marginBottom:6}}>You're Booked!</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.45)",marginBottom:20,lineHeight:1.6}}>Your session with Rodrigue is confirmed. A video call link has been sent to your email.</div>
            {[["📅","Date",`${sd?.dow}, ${sd?.num} ${sd?.mo}`],["🕐","Time",`${ss?.time} · 30 minutes`],["👨🏾‍💼","Coach","Rodrigue · Certified Growth Coach"],["📹","Format","Video call (link sent via email)"],["💎","Amount","$99.00 · Confirmed"]].map(([ico,l,v])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.06)",textAlign:"left"}}>
                <span style={{fontSize:18,width:24,flexShrink:0}}>{ico}</span>
                <div><div style={{fontSize:10,color:"rgba(255,255,255,.35)",fontWeight:700}}>{l}</div><div style={{fontSize:12,fontWeight:600,color:"#f2ede6"}}>{v}</div></div>
              </div>
            ))}
            <button onClick={()=>setCalAdded(true)} style={{width:"100%",marginTop:18,padding:11,background:calAdded?"rgba(52,211,153,.15)":"rgba(255,255,255,.06)",border:`1px solid ${calAdded?"#34d399":"rgba(255,255,255,.12)"}`,borderRadius:10,color:calAdded?"#34d399":"#f2ede6",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
              {calAdded?"✓ Added to Calendar":"📅 Add to Calendar"}
            </button>
            <button onClick={onClose} style={{...cta,marginTop:10}}>✦ Back to App</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Overlay>
  );
}

// ── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotModal({onClose}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Overlay onClose={onClose}>
      <div style={{background:"#f0ebe0",borderRadius:20,padding:28,width:"100%",maxWidth:360,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#888"}}>✕</button>
        {!sent ? <>
          <div style={{fontSize:20,fontWeight:800,color:"#1a1814",marginBottom:6}}>Reset Password</div>
          <div style={{fontSize:13,color:"#777",marginBottom:18}}>Enter your email and we'll send you a reset link.</div>
          <input style={{width:"100%",padding:"11px 14px",border:"1px solid #ddd",borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:14}} placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <button onClick={()=>email&&setSent(true)} style={{width:"100%",padding:12,background:G,border:"none",borderRadius:9,color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>Send Reset Link</button>
        </> : <>
          <div style={{textAlign:"center",paddingTop:8}}>
            <div style={{fontSize:32,marginBottom:12}}>📧</div>
            <div style={{fontSize:18,fontWeight:800,color:"#1a1814",marginBottom:8}}>Check your inbox!</div>
            <div style={{fontSize:13,color:"#777",marginBottom:20}}>We sent a reset link to <strong>{email}</strong></div>
            <button onClick={onClose} style={{padding:"10px 28px",background:G,border:"none",borderRadius:9,color:"white",fontWeight:700,cursor:"pointer"}}>Done</button>
          </div>
        </>}
      </div>
    </Overlay>
  );
}

// ── Notification Modal ────────────────────────────────────────────────────────
function NotifModal({onClose}) {
  const [read, setRead] = useState(new Set());
  return (
    <Overlay onClose={onClose} align="top">
      <div onClick={e=>e.stopPropagation()} style={{background:DARK_CARD,border:"1px solid rgba(232,160,32,.2)",borderRadius:16,width:320,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:700,color:"#f2ede6"}}>Notifications</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setRead(new Set(NOTIFS.map((_,i)=>i)))} style={{background:"none",border:"none",color:G,fontSize:11,cursor:"pointer",fontWeight:600}}>Mark all read</button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:16,cursor:"pointer"}}>✕</button>
          </div>
        </div>
        {NOTIFS.map((n,i)=>(
          <div key={i} onClick={()=>setRead(s=>{const ns=new Set(s);ns.add(i);return ns;})} style={{padding:"12px 16px",borderBottom:i<NOTIFS.length-1?"1px solid rgba(255,255,255,.05)":"none",display:"flex",gap:10,alignItems:"flex-start",background:!read.has(i)&&n.unread?"rgba(232,160,32,.04)":"transparent",cursor:"pointer",transition:"background .15s"}}>
            <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#f2ede6",lineHeight:1.5}}>{n.text}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:3}}>{n.time}</div>
            </div>
            {n.unread&&!read.has(i)&&<div style={{width:8,height:8,borderRadius:"50%",background:G,flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
      </div>
    </Overlay>
  );
}

// ── Profile Modal ──────────────────────────────────────────────────────────────
function ProfileModal({onClose, displayName, email, onSave}) {
  const [name, setName] = useState(displayName);
  const [saved, setSaved] = useState(false);
  const inp={width:"100%",padding:"10px 12px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:9,color:"#f2ede6",fontSize:13,outline:"none",boxSizing:"border-box"};
  return (
    <Overlay onClose={onClose}>
      <div style={{background:DARK_CARD,border:"1px solid rgba(232,160,32,.2)",borderRadius:20,padding:28,width:"100%",maxWidth:380,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer"}}>✕</button>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#1a1200",margin:"0 auto 10px"}}>{displayName.charAt(0).toUpperCase()}</div>
          <div style={{fontSize:16,fontWeight:800,color:"#f2ede6"}}>{displayName}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>{email}</div>
          <span style={{display:"inline-block",background:"rgba(232,160,32,.15)",border:`1px solid ${G}`,color:G,fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 10px",marginTop:6}}>Premium</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
          <div><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>Display Name</label><input style={inp} value={name} onChange={e=>setName(e.target.value)}/></div>
          <div><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",display:"block",marginBottom:5}}>Email</label><input style={{...inp,opacity:.6,cursor:"not-allowed"}} value={email} disabled/></div>
        </div>
        {saved&&<div style={{background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#34d399",marginBottom:12,textAlign:"center"}}>✓ Profile updated successfully!</div>}
        <button onClick={()=>{onSave(name);setSaved(true);setTimeout(()=>{setSaved(false);onClose();},1500);}} style={{width:"100%",padding:12,background:G,border:"none",borderRadius:9,color:"#1a1200",fontSize:14,fontWeight:700,cursor:"pointer"}}>Save Changes</button>
      </div>
    </Overlay>
  );
}

// ── Subscription Modal ────────────────────────────────────────────────────────
function SubModal({onClose, show}) {
  const [upgrading, setUpgrading] = useState(null);
  const [upgraded, setUpgraded] = useState(null);
  const plans=[
    {name:"Free",    price:"$0",     features:["3 check-ins/week","Basic guidance","Calm library (2 sessions)"],              current:false},
    {name:"Premium", price:"$19/mo", features:["Unlimited check-ins","AI-powered guidance","Full calm library","Toolkit access","Priority support"], current:true},
    {name:"Pro+",    price:"$49/mo", features:["Everything in Premium","2 coaching sessions/mo","Custom programs","1-on-1 priority booking","Accountability partner"], current:false},
  ];
  if(!show) return null;
  return (
    <Overlay onClose={onClose}>
      <div style={{background:DARK_CARD,border:"1px solid rgba(232,160,32,.2)",borderRadius:20,padding:28,width:"100%",maxWidth:480,position:"relative",maxHeight:"88vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer"}}>✕</button>
        <div style={{fontSize:20,fontWeight:800,color:"#f2ede6",marginBottom:4}}>Manage Subscription</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:20}}>You're currently on the <strong style={{color:G}}>Premium</strong> plan.</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {plans.map(p=>(
            <div key={p.name} style={{border:`1.5px solid ${p.current||upgraded===p.name?G:"rgba(255,255,255,.1)"}`,borderRadius:14,padding:16,background:p.current||upgraded===p.name?"rgba(232,160,32,.06)":"rgba(255,255,255,.03)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#f2ede6"}}>{p.name}</div>
                  <div style={{fontSize:18,fontWeight:800,color:G}}>{p.price}</div>
                </div>
                {p.current||upgraded===p.name
                  ?<span style={{background:G,color:"#1a1200",fontSize:10,fontWeight:800,borderRadius:20,padding:"3px 10px"}}>Current</span>
                  :<button onClick={()=>{setUpgrading(p.name);setTimeout(()=>{setUpgrading(null);setUpgraded(p.name);},1500);}} style={{background:upgrading===p.name?"rgba(255,255,255,.1)":G,border:"none",borderRadius:9,padding:"7px 14px",fontSize:12,fontWeight:700,color:upgrading===p.name?"#f2ede6":"#1a1200",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                    {upgrading===p.name?<><div style={{width:12,height:12,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#f2ede6",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Processing…</>:"Upgrade"}
                  </button>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(255,255,255,.55)"}}>
                  <span style={{color:p.current||upgraded===p.name?G:"rgba(255,255,255,.3)"}}>✓</span>{f}
                </div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

// ── Toolkit Tool Modal ─────────────────────────────────────────────────────────
function ToolkitModal({tool, onClose, onBook}) {
  const descs={
    "Boundaries":"Define and communicate healthy boundaries in every area of your life — work, relationships, and personal time.",
    "Roleplay":"Practice difficult conversations and social scenarios to build confidence and communication skills.",
    "Couple Mode":"Shared growth exercises and check-ins designed for couples to grow together intentionally.",
    "Creator Engine":"Turn your ideas into content — blog posts, captions, scripts, and more powered by AI.",
    "Life Admin":"Organize and tackle life admin tasks: bills, appointments, paperwork, and to-dos in one place.",
    "Challenges":"Daily micro-challenges to push your comfort zone and build resilience over 7, 14, or 21 days.",
  };
  const t = TOOLKIT_ITEMS.find(x=>x.label===tool);
  const [opened, setOpened] = useState(false);
  if(!tool) return null;
  return (
    <Overlay onClose={onClose}>
      <div style={{background:DARK_CARD,border:"1px solid rgba(232,160,32,.2)",borderRadius:20,padding:28,width:"100%",maxWidth:360,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer"}}>✕</button>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{width:64,height:64,borderRadius:18,background:t?.bg||"rgba(232,160,32,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px"}}>{t?.icon}</div>
          <div style={{fontSize:20,fontWeight:800,color:"#f2ede6",marginBottom:8}}>{tool}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.7}}>{descs[tool]||"A powerful tool for your growth journey."}</div>
        </div>
        {opened
          ?<div style={{background:"rgba(52,211,153,.08)",border:"1px solid rgba(52,211,153,.25)",borderRadius:10,padding:"12px 14px",marginBottom:10,fontSize:12,color:"#34d399",textAlign:"center",fontWeight:600}}>✓ {tool} is now open! Use it to grow.</div>
          :<button onClick={()=>setOpened(true)} style={{width:"100%",padding:12,background:G,border:"none",borderRadius:10,color:"#1a1200",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:10}}>Open {tool}</button>}
        <button onClick={()=>{onClose();onBook();}} style={{width:"100%",padding:11,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:10,color:"rgba(255,255,255,.6)",fontSize:13,fontWeight:600,cursor:"pointer"}}>💎 Book 1-on-1 to go deeper → $99</button>
      </div>
    </Overlay>
  );
}

// ── Calm Player Modal ──────────────────────────────────────────────────────────
function CalmPlayerModal({session, onClose}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const durationSec = session.dur * 60;
  const elapsed = Math.round(progress * durationSec);
  const remaining = durationSec - elapsed;
  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const iRef = useRef(null);

  const toggle = () => {
    if(playing){clearInterval(iRef.current);setPlaying(false);}
    else{
      if(progress>=1)setProgress(0);
      setPlaying(true);
      iRef.current=setInterval(()=>{
        setProgress(p=>{if(p>=1){clearInterval(iRef.current);setPlaying(false);return 1;}return p+(1/durationSec);});
      },1000);
    }
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  const circumference = 2*Math.PI*54;
  if(!session) return null;
  return (
    <Overlay onClose={()=>{clearInterval(iRef.current);onClose();}}>
      <div style={{background:"#1a1814",border:"1px solid rgba(232,160,32,.2)",borderRadius:24,padding:32,width:"100%",maxWidth:340,position:"relative",textAlign:"center"}}>
        <button onClick={()=>{clearInterval(iRef.current);onClose();}} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer"}}>✕</button>
        <div style={{fontSize:36,marginBottom:8}}>{session.icon}</div>
        <div style={{fontSize:18,fontWeight:800,color:"#f2ede6",marginBottom:4}}>{session.name}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginBottom:24}}>{session.type} · {session.dur} min</div>
        <div style={{position:"relative",width:120,height:120,margin:"0 auto 24px"}}>
          <svg width="120" height="120" style={{transform:"rotate(-90deg)"}}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke={G} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={circumference*(1-progress)} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#f2ede6"}}>{fmt(remaining)}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>remaining</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:16,alignItems:"center"}}>
          <button onClick={()=>{setProgress(0);setPlaying(false);clearInterval(iRef.current);}} style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.6)",fontSize:14,cursor:"pointer"}}>⟲</button>
          <button onClick={toggle} style={{width:60,height:60,borderRadius:"50%",background:G,border:"none",fontSize:22,cursor:"pointer",color:"#1a1200",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {playing?"⏸":"▶"}
          </button>
          <button onClick={()=>{clearInterval(iRef.current);onClose();}} style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.6)",fontSize:14,cursor:"pointer"}}>✕</button>
        </div>
        {progress>=1&&<div style={{marginTop:16,fontSize:13,color:"#34d399",fontWeight:700}}>✓ Session complete! Great work.</div>}
      </div>
    </Overlay>
  );
}

// ── Add Task Modal ────────────────────────────────────────────────────────────
function AddTaskModal({onClose, onAdd}) {
  const [text, setText] = useState("");
  const colors = ["#4a8fdb","#e85479","#f5a623","#34d399","#a78bfa","#f472b6"];
  const [color, setColor] = useState(colors[0]);
  return (
    <Overlay onClose={onClose}>
      <div style={{background:DARK_CARD,border:"1px solid rgba(232,160,32,.2)",borderRadius:20,padding:28,width:"100%",maxWidth:380,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer"}}>✕</button>
        <div style={{fontSize:18,fontWeight:800,color:"#f2ede6",marginBottom:16}}>Add Task</div>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&text.trim()){onAdd({id:Date.now(),text:text.trim(),color,done:false});onClose();}}} placeholder="Task name…" style={{width:"100%",padding:"11px 14px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:9,color:"#f2ede6",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:14}}/>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",marginBottom:8}}>Colour</div>
          <div style={{display:"flex",gap:8}}>
            {colors.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:color===c?"3px solid white":"3px solid transparent",transition:"border .15s"}}/>)}
          </div>
        </div>
        <button onClick={()=>{if(text.trim()){onAdd({id:Date.now(),text:text.trim(),color,done:false});onClose();}}} style={{width:"100%",padding:12,background:text.trim()?G:"rgba(255,255,255,.1)",border:"none",borderRadius:9,color:text.trim()?"#1a1200":"rgba(255,255,255,.3)",fontSize:14,fontWeight:700,cursor:text.trim()?"pointer":"not-allowed"}}>Add Task</button>
      </div>
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════

// ── Calm Page ──────────────────────────────────────────────────────────────────
function CalmPage({onPlaySession}) {
  return (
    <div style={{background:DARK_BG,minHeight:"100vh",padding:"48px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48}}>🌙</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:900,color:"#f2ede6",marginTop:8}}>Calm & Restore</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,.4)",marginTop:6}}>Reset your mind. Breathe. Recharge.</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {CALM_SESSIONS.map((s,i)=>(
            <div key={i} style={{background:DARK_CARD,border:"1px solid rgba(255,255,255,.08)",borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"border-color .15s"}}
              onClick={()=>onPlaySession(i)}>
              <span style={{fontSize:30,width:40,textAlign:"center"}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#f2ede6"}}>{s.name}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>{s.type} · {s.dur} min</div>
              </div>
              <button onClick={e=>{e.stopPropagation();onPlaySession(i);}} style={{width:38,height:38,borderRadius:"50%",background:G,border:"none",color:"#1a1200",fontSize:14,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>▶</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Programs Page ──────────────────────────────────────────────────────────────
function ProgramsPage({onBook, show}) {
  const [active, setActive] = useState(null);
  const [continued, setContinued] = useState(new Set());
  if(!show) return null;
  return (
    <div style={{background:"#f0ede8",minHeight:"100vh",padding:"48px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:900,color:"#1a1814"}}>Growth Programs</div>
          <div style={{fontSize:14,color:"#7a7368",marginTop:4}}>Structured journeys designed for lasting transformation.</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {PROGRAMS.map((p,i)=>(
            <div key={i} style={{background:"#fff",border:`1px solid ${active===i?"rgba(0,0,0,.12)":"rgba(0,0,0,.07)"}`,borderRadius:16,padding:20,cursor:"pointer",transition:"all .2s"}} onClick={()=>setActive(active===i?null:i)}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:active===i?10:0}}>
                <span style={{fontSize:28}}>{p.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#1a1814"}}>{p.name}</div>
                  <div style={{fontSize:12,color:"#7a7368",marginTop:2}}>{p.desc}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:11,color:"#9a9080"}}>{p.days}/{p.total} days</div>
                  <div style={{height:4,width:80,background:"rgba(0,0,0,.07)",borderRadius:2,marginTop:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(p.days/p.total)*100}%`,background:p.color,borderRadius:2,transition:"width .3s"}}/>
                  </div>
                </div>
                <span style={{fontSize:12,color:"#b5afa8",marginLeft:8,transition:"transform .2s",transform:active===i?"rotate(90deg)":"rotate(0)"}}> ›</span>
              </div>
              {active===i && (
                <div style={{borderTop:"1px solid rgba(0,0,0,.07)",paddingTop:14,marginTop:4}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                    {[["Duration",`${p.total} days`],["Progress",`${Math.round((p.days/p.total)*100)}%`],["Completed",`${p.days} days`],["Remaining",`${p.total-p.days} days`]].map(([k,v])=>(
                      <div key={k} style={{background:"#f7f5f2",borderRadius:9,padding:"8px 12px"}}>
                        <div style={{fontSize:10,color:"#9a9080",marginBottom:2}}>{k}</div>
                        <div style={{fontSize:16,fontWeight:800,color:p.color}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {continued.has(i)
                    ?<div style={{background:"rgba(52,211,153,.08)",border:"1px solid rgba(52,211,153,.3)",borderRadius:9,padding:"10px 14px",fontSize:13,color:"#16a34a",fontWeight:600,textAlign:"center",marginBottom:8}}>✓ Continuing {p.name}! Keep going!</div>
                    :null}
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={e=>{e.stopPropagation();setContinued(s=>{const ns=new Set(s);ns.add(i);return ns;});}} style={{flex:1,padding:11,background:p.color,border:"none",borderRadius:9,color:"#1a1200",fontSize:13,fontWeight:700,cursor:"pointer"}}>Continue Program →</button>
                    <button onClick={e=>{e.stopPropagation();onBook();}} style={{padding:"11px 14px",background:"rgba(0,0,0,.05)",border:"1px solid rgba(0,0,0,.1)",borderRadius:9,fontSize:12,fontWeight:600,color:"#7a7368",cursor:"pointer",flexShrink:0}}>💎 1-on-1</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TASK ROW ────────────────────────────────────────────────────────────────
function TaskRow({task, onToggle, dark}) {
  const tc = dark ? "#f2ede6" : "#1a1814";
  const bc = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)";
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${bc}`}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:task.color,flexShrink:0}}/>
      <span style={{flex:1,fontSize:12,fontWeight:600,color:tc,textDecoration:task.done?"line-through":"none",opacity:task.done?.4:1}}>{task.text}</span>
      <div onClick={()=>onToggle(task.id)} style={{width:17,height:17,borderRadius:"50%",border:task.done?"none":`1.5px solid ${dark?"rgba(255,255,255,.2)":"rgba(0,0,0,.15)"}`,background:task.done?G:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,cursor:"pointer",color:"#1a1200",flexShrink:0,transition:"all .15s"}}>
        {task.done?"✓":""}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
function MainApp({displayName:initName, email, onSignOut}) {
  const [displayName, setDisplayName] = useState(initName);
  const [tasks, setTasks] = useState(DEFAULT_PLAN.map(t=>({...t})));
  const [mood, setMood] = useState(null);
  const [vals, setVals] = useState({Stress:4, Energy:3, Focus:3, Relationship:4});
  const [guidanceShown, setGuidanceShown] = useState(false);
  const [aiGuidanceText, setAiGuidanceText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [checkinHighlight, setCheckinHighlight] = useState(false);
  const checkinRef = useRef(null);
  const [darkDayMarked, setDarkDayMarked] = useState(false);
  const [lightDayMarked, setLightDayMarked] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [page, setPage] = useState("home");
  const [darkNav, setDarkNav] = useState("Home");
  const [lightNav, setLightNav] = useState("Home");

  // Modal state
  const [booking, setBooking] = useState(false);
  const [notif, setNotif] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [toolkitTool, setToolkitTool] = useState(null);
  const [calmSession, setCalmSession] = useState(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const {show, Toast} = useToast();

  const toggleTask = id => {
    setTasks(t=>t.map(x=>x.id===id?{...x,done:!x.done}:x));
    const task = tasks.find(x=>x.id===id);
    if(!task?.done) show("✓ Task completed! +24 pts");
  };
  const addTask = task => { setTasks(t=>[...t,task]); show("✓ Task added!"); };
  const doneTasks = tasks.filter(t=>t.done).length;
  const score = doneTasks * 24;

  const sliderColors = {Stress:"#f87171",Energy:"#34d399",Focus:"#f5a623",Relationship:"#a78bfa"};

  const handleNav = (nav, isDark) => {
    if(isDark) setDarkNav(nav); else setLightNav(nav);
    if(nav==="Calm"){ setPage("calm"); }
    else if(nav==="Programs"){ setPage("programs"); }
    else if(nav==="Profile"){ setProfileOpen(true); }
    else if(nav==="Toolkit"){ setToolkitTool("Boundaries"); }
    else if(nav==="Home"){ setPage("home"); setDarkNav("Home"); setLightNav("Home"); }
  };

  // ── DARK HOME SCREEN ──────────────────────────────────────────────────────
  const DarkHomeScreen = () => (
    <Phone dark label="HOME" active={darkNav} onNav={n=>handleNav(n,true)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:900,color:"#f2ede6"}}>Hello, {displayName} 🔥</div>
        <button onClick={()=>setNotif(true)} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:"5px 7px",cursor:"pointer",fontSize:14,position:"relative"}}>
          🔔
          <span style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:"#e85479",border:"2px solid "+DARK_CARD}}/>
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[{lbl:"STREAK",val:"5",unit:"days"},{lbl:"SCORE",val:String(score),unit:"pts today"}].map(s=>(
          <div key={s.lbl} style={{background:DARK_CARD2,border:"1px solid rgba(255,255,255,.07)",borderRadius:11,padding:"10px 12px"}}>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:".12em",color:"#9a9080",textTransform:"uppercase",marginBottom:2}}>{s.lbl}</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:900,color:G,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:10,color:"#9a9080"}}>{s.unit}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>{
        setCheckinHighlight(true);
        setTimeout(()=>setCheckinHighlight(false),2000);
        checkinRef.current?.scrollIntoView({behavior:"smooth",block:"center"});
        show("📋 Check-in panel highlighted →");
      }} style={{width:"100%",background:G,border:"none",borderRadius:11,padding:12,fontSize:13,fontWeight:700,color:"#1a1200",cursor:"pointer",marginBottom:8}}>Start Check-in →</button>
      <button onClick={()=>{setCalmSession(0);}} style={{width:"100%",background:DARK_CARD2,border:"1px solid rgba(255,255,255,.1)",borderRadius:11,padding:11,fontSize:12.5,fontWeight:700,color:G,cursor:"pointer",marginBottom:14}}>🌙 Calm Now (3 min)</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,fontWeight:800,color:"#f2ede6"}}>Today's Plan</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:doneTasks===tasks.length?"#34d399":G,fontWeight:600}}>{doneTasks}/{tasks.length}</span>
          <button onClick={()=>setAddTaskOpen(true)} style={{width:20,height:20,borderRadius:"50%",background:G,border:"none",color:"#1a1200",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>+</button>
        </div>
      </div>
      {tasks.map(t=><TaskRow key={t.id} task={t} onToggle={toggleTask} dark/>)}
      <div onClick={()=>{setQuoteIdx(i=>(i+1)%QUOTES.length);show("New quote!");}} style={{background:"rgba(232,160,32,.08)",border:"1px solid rgba(232,160,32,.2)",borderRadius:11,padding:12,marginTop:12,cursor:"pointer"}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:".12em",color:G,textTransform:"uppercase",marginBottom:5}}>Daily Quote · tap to refresh</div>
        <div style={{fontSize:12,fontStyle:"italic",color:"#f2ede6",fontWeight:600}}>"{QUOTES[quoteIdx]}"</div>
      </div>
      <div onClick={()=>setBooking(true)} style={{background:"rgba(232,160,32,.1)",border:"1px solid rgba(232,160,32,.3)",borderRadius:14,padding:12,marginTop:12,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:18}}>💎</span>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:800,color:"#f2ede6"}}>Book a 1-on-1 Growth Session</div><div style={{fontSize:9.5,color:"#9a9080"}}>Need deeper guidance?</div></div>
          <div style={{background:G,color:"#1a1200",fontSize:10,fontWeight:800,borderRadius:20,padding:"2px 8px"}}>$99</div>
        </div>
        <button onClick={e=>{e.stopPropagation();setBooking(true);}} style={{width:"100%",background:G,border:"none",borderRadius:9,padding:9,fontSize:11.5,fontWeight:700,color:"#1a1200",cursor:"pointer"}}>Book Session</button>
      </div>
    </Phone>
  );

  // ── DARK CHECK-IN SCREEN ───────────────────────────────────────────────────
  const DarkCheckinScreen = () => (
    <div ref={checkinRef} style={{outline:checkinHighlight?"3px solid "+G:"3px solid transparent",borderRadius:24,transition:"outline .3s"}}>
    <Phone dark label="DAILY CHECK-IN" active={darkNav} onNav={n=>handleNav(n,true)}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:12,color:G,fontWeight:700,cursor:"pointer"}} onClick={()=>show("Back!")}>‹ Daily Check-in</span>
        <button onClick={()=>show("Check-in saved!")} style={{background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:16,cursor:"pointer"}}>×</button>
      </div>
      <p style={{fontSize:12,color:"#9a9080",marginBottom:12}}>How are you feeling today?</p>
      <div style={{display:"flex",justifyContent:"space-between",gap:4,marginBottom:14}}>
        {MOODS.map((m,i)=>(
          <div key={m} onClick={()=>setMood(i)} style={{flex:1,aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,borderRadius:9,border:`1.5px solid ${mood===i?G:"rgba(255,255,255,.1)"}`,background:mood===i?"rgba(232,160,32,.12)":DARK_CARD2,cursor:"pointer",transition:"all .15s",transform:mood===i?"scale(1.08)":"scale(1)"}}>{m}</div>
        ))}
      </div>
      {Object.entries(vals).map(([k,v])=>(
        <div key={k} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:12,fontWeight:700,color:"#f2ede6"}}>{k}</span>
            <span style={{fontSize:12,fontWeight:800,color:sliderColors[k]}}>{v}</span>
          </div>
          <div style={{position:"relative",height:5,borderRadius:3,background:"rgba(255,255,255,.1)"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${(v/10)*100}%`,background:sliderColors[k],borderRadius:3,transition:"width .15s"}}/>
            <input type="range" min={1} max={10} step={1} value={v} onChange={e=>setVals(s=>({...s,[k]:+e.target.value}))} style={{position:"absolute",inset:0,opacity:0,width:"100%",cursor:"pointer"}}/>
          </div>
        </div>
      ))}
      <button onClick={async()=>{
        setAiLoading(true);
        const result = await callWatsonX({mood,vals,name:displayName,tasks});
        setAiGuidanceText(result.text);
        setGuidanceShown(true);
        setAiLoading(false);
        show(result.ok?"✓ AI Guidance generated!":"✓ Guidance ready (offline mode)");
      }} disabled={aiLoading} style={{width:"100%",background:G,border:"none",borderRadius:11,padding:12,fontSize:13,fontWeight:700,color:"#1a1200",cursor:aiLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:4,opacity:aiLoading?.7:1}}>
        {aiLoading?<><div style={{width:14,height:14,border:"2px solid rgba(0,0,0,.2)",borderTopColor:"#1a1200",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Generating…</>:"✦ Generate AI Guidance →"}
      </button>
      {guidanceShown&&aiGuidanceText&&<div style={{marginTop:12,background:"rgba(52,211,153,.07)",border:"1px solid rgba(52,211,153,.2)",borderRadius:9,padding:"10px 12px"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#34d399",marginBottom:5}}>✓ AI GUIDANCE READY</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>{aiGuidanceText.slice(0,120)}{aiGuidanceText.length>120?"…":""}</div>
        <div style={{fontSize:10,color:"#34d399",marginTop:5,fontWeight:600}}>→ See full guidance in the Guidance panel</div>
      </div>}
    </Phone>
    </div>
  );

  // ── DARK GUIDANCE SCREEN ───────────────────────────────────────────────────
  const DarkGuidanceScreen = () => (
    <Phone dark label="GUIDANCE" active={darkNav} onNav={n=>handleNav(n,true)}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:12,color:G,fontWeight:700,cursor:"pointer"}} onClick={()=>show("Back!")}>‹ Back</span>
        <span style={{fontSize:13,fontWeight:800,color:"#f2ede6"}}>Today's Guidance</span>
        <span style={{width:32}}/>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:G,marginBottom:10}}>📅 {todayStr()}</div>
      <div style={{background:DARK_CARD2,border:"1px solid rgba(255,255,255,.08)",borderRadius:11,padding:12,marginBottom:10}}>
        <div style={{fontSize:8.5,fontWeight:700,letterSpacing:".12em",color:"#9a9080",textTransform:"uppercase",marginBottom:5}}>🧠 COACH MESSAGE</div>
        <div style={{fontSize:13,fontWeight:800,color:"#f2ede6",marginBottom:6}}>Stay calm & take one step at a time.</div>
        <div style={{fontSize:11,color:"#9a9080",lineHeight:1.6}}>{aiGuidanceText || "Your sleep and stress levels have been a challenge, but today you have a fresh start. Take a deep breath and focus on one thing at a time. You've got this."}</div>
      </div>
      <div style={{fontSize:11.5,fontWeight:800,color:"#f2ede6",margin:"8px 0 6px"}}>📋 Today's Plan</div>
      {tasks.map((t,i)=>(
        <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<tasks.length-1?"1px solid rgba(255,255,255,.06)":"none"}}>
          <div style={{width:19,height:19,background:"rgba(232,160,32,.12)",border:"1px solid rgba(232,160,32,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:G,flexShrink:0}}>{i+1}</div>
          <span style={{flex:1,fontSize:12,fontWeight:600,color:"#f2ede6",textDecoration:t.done?"line-through":"none",opacity:t.done?.4:1}}>{t.text}</span>
          <div onClick={()=>toggleTask(t.id)} style={{width:16,height:16,borderRadius:"50%",border:t.done?"none":"1.5px solid rgba(255,255,255,.15)",background:t.done?G:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#1a1200"}}>{t.done?"✓":""}</div>
        </div>
      ))}
      <div style={{background:"rgba(232,160,32,.06)",border:"1px solid rgba(232,160,32,.18)",borderRadius:11,padding:11,margin:"10px 0"}}>
        <div style={{fontSize:8.5,fontWeight:700,letterSpacing:".12em",color:G,textTransform:"uppercase",marginBottom:5}}>🙏 PRAYER/AFFIRMATION</div>
        <div style={{fontSize:11,color:"#9a9080",lineHeight:1.6,fontStyle:"italic"}}>Guide my thoughts and calm my heart. Help me act from a place of peace and grace today. Amen.</div>
      </div>
      <div onClick={()=>setBooking(true)} style={{background:"rgba(232,160,32,.1)",border:"1px solid rgba(232,160,32,.28)",borderRadius:12,padding:10,marginBottom:8,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
          <span style={{fontSize:14}}>💎</span>
          <span style={{fontSize:11,fontWeight:800,color:"#f2ede6",flex:1}}>Book 1-on-1 Growth Session</span>
          <span style={{background:G,color:"#1a1200",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 7px"}}>$99</span>
        </div>
        <button onClick={e=>{e.stopPropagation();setBooking(true);}} style={{width:"100%",background:G,border:"none",borderRadius:8,padding:8,fontSize:11,fontWeight:700,color:"#1a1200",cursor:"pointer"}}>Book Session</button>
      </div>
      <button onClick={()=>setDarkDayMarked(m=>!m)} style={{width:"100%",background:darkDayMarked?"#16a34a":DARK_CARD2,border:darkDayMarked?"none":`1px solid rgba(232,160,32,.2)`,borderRadius:11,padding:11,fontSize:12.5,fontWeight:700,color:darkDayMarked?"#fff":G,cursor:"pointer",transition:"all .2s"}}>
        {darkDayMarked?"✓ Day Complete!":"Mark Day Complete ✓"}
      </button>
    </Phone>
  );

  // ── DARK TOOLKIT SCREEN ────────────────────────────────────────────────────
  const DarkToolkitScreen = () => (
    <Phone dark label="TOOLKIT" active={darkNav} onNav={n=>handleNav(n,true)}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:13,fontWeight:800,color:"#f2ede6"}}>≡ Toolkit</span>
        <button onClick={()=>show("Toolkit refreshed!")} style={{background:"none",border:"none",color:"#5a5248",fontSize:14,letterSpacing:2,cursor:"pointer"}}>···</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {TOOLKIT_ITEMS.map(t=>(
          <div key={t.label} onClick={()=>setToolkitTool(t.label)} style={{background:DARK_CARD2,border:"1px solid rgba(255,255,255,.08)",borderRadius:11,padding:"12px 10px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:6,cursor:"pointer",transition:"all .15s"}}>
            <div style={{width:34,height:34,borderRadius:9,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{t.icon}</div>
            <div style={{fontSize:10.5,fontWeight:700,color:"#f2ede6"}}>{t.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:DARK_CARD2,border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#1a1200",flexShrink:0}}>{displayName.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#f2ede6"}}>{displayName}</div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:11,fontWeight:700,color:G}}>🔥 Streak: 5 days</span>
              <span style={{background:G,color:"#1a1200",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 8px",marginLeft:4}}>Pro</span>
            </div>
          </div>
        </div>
        {[
          {ico:"✏️", lbl:"Edit Profile",        fn:()=>setProfileOpen(true)},
          {ico:"💎", lbl:"Manage Subscription", fn:()=>setSubOpen(true)},
          {ico:"🔔", lbl:"Notifications",        fn:()=>setNotif(true)},
        ].map(m=>(
          <div key={m.lbl} onClick={m.fn} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.06)",cursor:"pointer"}}>
            <span style={{fontSize:13}}>{m.ico}</span>
            <span style={{flex:1,fontSize:12,fontWeight:600,color:"#f2ede6"}}>{m.lbl}</span>
            <span style={{fontSize:13,color:"#5a5248"}}>›</span>
          </div>
        ))}
      </div>
    </Phone>
  );

  // ── LIGHT HOME SCREEN ──────────────────────────────────────────────────────
  const LightHomeScreen = () => (
    <Phone dark={false} label="HOME" active={lightNav} onNav={n=>handleNav(n,false)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:900,color:"#1a1814"}}>Hello, {displayName} 🔥</div>
        <button onClick={()=>setNotif(true)} style={{background:"rgba(0,0,0,.05)",border:"1px solid rgba(0,0,0,.08)",borderRadius:8,padding:"5px 7px",cursor:"pointer",fontSize:14,position:"relative"}}>
          🔔
          <span style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:"#e85479",border:"2px solid white"}}/>
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[{lbl:"STREAK",val:"5",unit:"days"},{lbl:"SCORE",val:String(score),unit:"pts today"}].map(s=>(
          <div key={s.lbl} style={{background:"#f7f5f2",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:"9px 11px"}}>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:".12em",color:"#9a9080",textTransform:"uppercase",marginBottom:2}}>{s.lbl}</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:G,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:9,color:"#9a9080"}}>{s.unit}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>{
        setCheckinHighlight(true);
        setTimeout(()=>setCheckinHighlight(false),2000);
        checkinRef.current?.scrollIntoView({behavior:"smooth",block:"center"});
        show("📋 Check-in panel highlighted →");
      }} style={{width:"100%",background:G,border:"none",borderRadius:10,padding:10,fontSize:12.5,fontWeight:700,color:"#1a1200",cursor:"pointer",marginBottom:7}}>Start Check-in →</button>
      <button onClick={()=>setCalmSession(0)} style={{width:"100%",background:"#f7f5f2",border:"1px solid rgba(0,0,0,.08)",borderRadius:10,padding:9,fontSize:12,fontWeight:600,color:"#7a7368",cursor:"pointer",marginBottom:12}}>🌙 Calm Now (3 min)</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,fontWeight:700,color:"#1a1814"}}>Today's Plan</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:doneTasks===tasks.length?"#34d399":G,fontWeight:600}}>{doneTasks}/{tasks.length} Done</span>
          <button onClick={()=>setAddTaskOpen(true)} style={{width:18,height:18,borderRadius:"50%",background:G,border:"none",color:"#1a1200",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>+</button>
        </div>
      </div>
      {tasks.map(t=><TaskRow key={t.id} task={t} onToggle={toggleTask} dark={false}/>)}
      <div onClick={()=>{setQuoteIdx(i=>(i+1)%QUOTES.length);show("New quote!");}} style={{background:"rgba(232,160,32,.06)",border:"1px solid rgba(232,160,32,.18)",borderRadius:10,padding:10,marginTop:10,marginBottom:10,cursor:"pointer"}}>
        <div style={{fontSize:8.5,fontWeight:700,letterSpacing:".1em",color:G,textTransform:"uppercase",marginBottom:4}}>Daily Quote · tap to refresh</div>
        <div style={{fontSize:11,fontStyle:"italic",color:"#5a4e3a",fontWeight:600}}>"{QUOTES[quoteIdx]}"</div>
      </div>
      <div onClick={()=>setBooking(true)} style={{background:"rgba(232,160,32,.06)",border:"1px solid rgba(232,160,32,.22)",borderRadius:12,padding:10,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
          <span style={{fontSize:15}}>💎</span>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:800,color:"#1a1814"}}>Book a 1-on-1 Growth Session</div><div style={{fontSize:9.5,color:"#7a7368"}}>Need deeper guidance? · 30 min</div></div>
          <div style={{background:G,color:"#1a1200",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 8px"}}>$99</div>
        </div>
        <button onClick={e=>{e.stopPropagation();setBooking(true);}} style={{width:"100%",background:G,border:"none",borderRadius:8,padding:8,fontSize:11,fontWeight:700,color:"#1a1200",cursor:"pointer"}}>Book Session</button>
      </div>
    </Phone>
  );

  // ── LIGHT CHECK-IN SCREEN ──────────────────────────────────────────────────
  const LightCheckinScreen = () => (
    <Phone dark={false} label="DAILY CHECK-IN" active={lightNav} onNav={n=>handleNav(n,false)}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontSize:12,color:G,fontWeight:700,cursor:"pointer"}} onClick={()=>show("Back!")}>‹ Back</span>
        <span style={{fontSize:12,fontWeight:700,color:"#1a1814"}}>Daily Check-in</span>
        <button onClick={()=>show("Check-in saved!")} style={{fontSize:12,color:"#b5afa8",background:"none",border:"none",cursor:"pointer"}}>···</button>
      </div>
      <p style={{fontSize:12,color:"#7a7368",marginBottom:12}}>How are you feeling today?</p>
      <div style={{display:"flex",justifyContent:"space-between",gap:4,marginBottom:14}}>
        {MOODS.map((m,i)=>(
          <div key={m} onClick={()=>setMood(i)} style={{flex:1,aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,borderRadius:9,border:`1.5px solid ${mood===i?G:"rgba(0,0,0,.09)"}`,background:mood===i?"rgba(232,160,32,.1)":"#f7f5f2",cursor:"pointer",transform:mood===i?"scale(1.08)":"scale(1)",transition:"all .15s"}}>{m}</div>
        ))}
      </div>
      {Object.entries(vals).map(([k,v])=>(
        <div key={k} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:12,fontWeight:600,color:"#1a1814"}}>{k}</span>
            <span style={{fontSize:12,fontWeight:700,color:sliderColors[k]}}>{v}</span>
          </div>
          <div style={{position:"relative",height:4,borderRadius:3,background:"rgba(0,0,0,.08)"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${(v/10)*100}%`,background:sliderColors[k],borderRadius:3,transition:"width .15s"}}/>
            <input type="range" min={1} max={10} step={1} value={v} onChange={e=>setVals(s=>({...s,[k]:+e.target.value}))} style={{position:"absolute",inset:0,opacity:0,width:"100%",cursor:"pointer"}}/>
          </div>
        </div>
      ))}
      <button onClick={async()=>{
        setAiLoading(true);
        const result = await callWatsonX({mood,vals,name:displayName,tasks});
        setAiGuidanceText(result.text);
        setGuidanceShown(true);
        setAiLoading(false);
        show(result.ok?"✓ AI Guidance generated!":"✓ Guidance ready");
      }} disabled={aiLoading} style={{width:"100%",background:G,border:"none",borderRadius:10,padding:11,fontSize:12.5,fontWeight:700,color:"#1a1200",cursor:aiLoading?"not-allowed":"pointer",marginTop:4,opacity:aiLoading?.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {aiLoading?<><div style={{width:14,height:14,border:"2px solid rgba(0,0,0,.2)",borderTopColor:"#1a1200",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Generating…</>:"✦ Generate AI Guidance →"}
      </button>
    </Phone>
  );

  // ── LIGHT GUIDANCE SCREEN ──────────────────────────────────────────────────
  const LightGuidanceScreen = () => (
    <Phone dark={false} label="GUIDANCE" active={lightNav} onNav={n=>handleNav(n,false)}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:12,color:G,fontWeight:700,cursor:"pointer"}} onClick={()=>show("Back!")}>‹ Back</span>
        <span style={{fontSize:12,fontWeight:700,color:"#1a1814"}}>Today's Guidance</span>
        <span style={{width:28}}/>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:G,marginBottom:9}}>📅 {todayStr()}</div>
      <div style={{background:"#fff",border:"1px solid rgba(0,0,0,.08)",borderRadius:10,padding:11,marginBottom:9}}>
        <div style={{fontSize:8,fontWeight:700,letterSpacing:".12em",color:"#7a7368",textTransform:"uppercase",marginBottom:5}}>🧠 Coach Message</div>
        <div style={{fontSize:12.5,fontWeight:800,color:"#1a1814",marginBottom:5}}>Stay calm & take one step at a time.</div>
        <div style={{fontSize:11,color:"#7a7368",lineHeight:1.6}}>{aiGuidanceText ? aiGuidanceText.slice(0,120)+"…" : "Your sleep and stress levels have been a challenge, but today you have a fresh start."}</div>
      </div>
      <div style={{fontSize:11.5,fontWeight:800,color:"#1a1814",margin:"8px 0 6px"}}>📋 Today's Plan</div>
      {tasks.map((t,i)=>(
        <div key={t.id} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 0",borderBottom:i<tasks.length-1?"1px solid rgba(0,0,0,.07)":"none"}}>
          <div style={{width:18,height:18,background:"rgba(232,160,32,.1)",border:"1px solid rgba(232,160,32,.28)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:800,color:G,flexShrink:0}}>{i+1}</div>
          <span style={{flex:1,fontSize:11.5,fontWeight:600,color:"#1a1814",textDecoration:t.done?"line-through":"none",opacity:t.done?.4:1}}>{t.text}</span>
          <div onClick={()=>toggleTask(t.id)} style={{width:15,height:15,borderRadius:"50%",border:t.done?"none":"1.5px solid rgba(0,0,0,.12)",background:t.done?G:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:"#fff"}}>{t.done?"✓":""}</div>
        </div>
      ))}
      <div style={{background:"rgba(232,160,32,.05)",border:"1px solid rgba(232,160,32,.16)",borderRadius:10,padding:10,margin:"9px 0"}}>
        <div style={{fontSize:8,fontWeight:700,letterSpacing:".12em",color:G,textTransform:"uppercase",marginBottom:5}}>🙏 Prayer/Affirmation</div>
        <div style={{fontSize:11,color:"#7a7368",lineHeight:1.6,fontStyle:"italic"}}>Guide my thoughts and calm my heart. Help me act from a place of peace and grace today. Amen.</div>
      </div>
      <div onClick={()=>setBooking(true)} style={{background:"rgba(232,160,32,.06)",border:"1px solid rgba(232,160,32,.22)",borderRadius:11,padding:10,marginBottom:8,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
          <span>💎</span><span style={{flex:1,fontSize:11,fontWeight:800,color:"#1a1814"}}>Book 1-on-1 Growth Session</span>
          <span style={{background:G,color:"#1a1200",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 7px"}}>$99</span>
        </div>
        <button onClick={e=>{e.stopPropagation();setBooking(true);}} style={{width:"100%",background:G,border:"none",borderRadius:8,padding:7,fontSize:11,fontWeight:700,color:"#1a1200",cursor:"pointer"}}>Book Session with Rodrigue</button>
      </div>
      <button onClick={()=>setLightDayMarked(m=>!m)} style={{width:"100%",background:lightDayMarked?"#16a34a":"#1e1c18",border:"none",borderRadius:10,padding:10,fontSize:12,fontWeight:700,color:lightDayMarked?"#fff":G,cursor:"pointer",transition:"all .2s"}}>
        {lightDayMarked?"✓ Day Complete!":"Mark Day Complete ✓"}
      </button>
    </Phone>
  );

  // ── LIGHT TOOLKIT SCREEN ───────────────────────────────────────────────────
  const LightToolkitScreen = () => (
    <Phone dark={false} label="TOOLKIT" active={lightNav} onNav={n=>handleNav(n,false)}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:12,fontWeight:700,color:"#1a1814"}}>≡ Toolkit</span>
        <button onClick={()=>show("Toolkit refreshed!")} style={{background:"none",border:"none",fontSize:12,color:"#b5afa8",cursor:"pointer"}}>···</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {TOOLKIT_ITEMS.map(t=>(
          <div key={t.label} onClick={()=>setToolkitTool(t.label)} style={{background:t.bg,borderRadius:12,padding:"12px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",textAlign:"center"}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <div style={{fontSize:9,fontWeight:700,color:"#1a1814"}}>{t.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#f7f5f2",border:"1px solid rgba(0,0,0,.07)",borderRadius:12,padding:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#1a1200",flexShrink:0}}>{displayName.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"#1a1814"}}>{displayName}</div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:10,fontWeight:700,color:G}}>🔥 Streak: 5 days</span>
              <span style={{background:G,color:"#1a1200",fontSize:8,fontWeight:800,borderRadius:20,padding:"2px 7px"}}>Premium</span>
            </div>
          </div>
        </div>
        {[
          {ico:"✏️", lbl:"Edit Profile",        fn:()=>setProfileOpen(true)},
          {ico:"💎", lbl:"Manage Subscription", fn:()=>setSubOpen(true)},
          {ico:"🔔", lbl:"Notifications",        fn:()=>setNotif(true)},
          {ico:"⭐", lbl:"Book 1-on-1 Session",  fn:()=>setBooking(true), gold:true},
        ].map(m=>(
          <div key={m.lbl} onClick={m.fn} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid rgba(0,0,0,.06)",cursor:"pointer"}}>
            <span style={{fontSize:12}}>{m.ico}</span>
            <span style={{flex:1,fontSize:11.5,fontWeight:600,color:m.gold?G:"#1a1814"}}>{m.lbl}</span>
            <span style={{fontSize:12,color:"#b5afa8"}}>›</span>
          </div>
        ))}
      </div>
    </Phone>
  );

  return (
    <div style={{minHeight:"100vh",background:DARK_BG}}>
      {/* TOP NAV */}
      <nav style={{background:"rgba(20,18,14,.97)",borderBottom:"1px solid rgba(232,160,32,.15)",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:G,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⭐</div>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#f2ede6"}}>Being <span style={{color:G}}>Tchitaka</span></div>
            <div style={{fontSize:9,letterSpacing:".2em",color:"rgba(255,255,255,.25)",textTransform:"uppercase"}}>— GROWTH OS —</div>
          </div>
        </div>
        <div className="top-nav-links" style={{display:"flex",gap:4}}>
          {[["home","Home"],["calm","Calm"],["programs","Programs"]].map(([pg,lbl])=>(
            <button key={lbl} onClick={()=>setPage(pg)} style={{padding:"7px 16px",borderRadius:7,fontSize:12.5,fontWeight:600,color:page===pg?G:"rgba(255,255,255,.45)",cursor:"pointer",border:"none",background:page===pg?"rgba(232,160,32,.1)":"transparent",transition:"all .15s"}}>{lbl}</button>
          ))}
          <button onClick={()=>setToolkitTool("Boundaries")} style={{padding:"7px 16px",borderRadius:7,fontSize:12.5,fontWeight:600,color:"rgba(255,255,255,.45)",cursor:"pointer",border:"none",background:"transparent"}}>Toolkit</button>
          <button onClick={()=>setProfileOpen(true)} style={{padding:"7px 16px",borderRadius:7,fontSize:12.5,fontWeight:600,color:"rgba(255,255,255,.45)",cursor:"pointer",border:"none",background:"transparent"}}>👤 Profile</button>
        </div>
        <div className="top-nav-user" style={{display:"flex",alignItems:"center",gap:10}}>
          <div onClick={()=>setProfileOpen(true)} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(232,160,32,.2)",borderRadius:20,padding:"4px 12px 4px 4px",cursor:"pointer"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#1a1200"}}>{displayName.charAt(0).toUpperCase()}</div>
            <span style={{fontSize:13,color:"#f2ede6"}}>{displayName}</span>
            <span style={{background:"rgba(232,160,32,.15)",border:`1px solid ${G}`,color:G,fontSize:9,fontWeight:700,borderRadius:4,padding:"2px 6px"}}>Premium</span>
          </div>
          <button onClick={()=>setNotif(true)} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"7px 10px",color:"rgba(255,255,255,.5)",fontSize:14,cursor:"pointer",position:"relative"}}>
            🔔
            <span style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:"#e85479",border:"1.5px solid "+DARK_BG}}/>
          </button>
          <button onClick={onSignOut} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"7px 14px",color:"rgba(255,255,255,.5)",fontSize:12,cursor:"pointer"}}>Sign out</button>
        </div>
        {/* Mobile-only quick nav */}
        <div className="mobile-quick-nav" style={{display:"none"}}>
          <button onClick={()=>setPage("home")} style={{background:page==="home"?"rgba(245,166,35,.15)":"none",border:"none",color:page==="home"?"#f5a623":"rgba(255,255,255,.5)",padding:"6px 10px",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:600}}>Home</button>
          <button onClick={()=>setPage("calm")} style={{background:page==="calm"?"rgba(245,166,35,.15)":"none",border:"none",color:page==="calm"?"#f5a623":"rgba(255,255,255,.5)",padding:"6px 10px",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:600}}>Calm</button>
          <button onClick={()=>setPage("programs")} style={{background:page==="programs"?"rgba(245,166,35,.15)":"none",border:"none",color:page==="programs"?"#f5a623":"rgba(255,255,255,.5)",padding:"6px 10px",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:600}}>Programs</button>
          <button onClick={()=>setProfileOpen(true)} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",padding:"6px 10px",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:600}}>Profile</button>
        </div>
      </nav>

      {/* PAGES */}
      {page==="home" && <>
        {/* DARK SECTION */}
        <div className="section-pad" style={{background:DARK_BG,padding:"36px 28px 44px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div className="phone-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14}}>
              <DarkHomeScreen/><DarkCheckinScreen/><DarkGuidanceScreen/><DarkToolkitScreen/>
            </div>
          </div>
        </div>
        {/* LIGHT SECTION */}
        <div style={{background:"#f0ede8",padding:"0 28px 44px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div className="light-topbar" style={{background:"rgba(240,237,232,.97)",border:"1px solid rgba(0,0,0,.08)",borderRadius:"14px 14px 0 0",padding:"0 18px",height:50,display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              <div style={{width:28,height:28,background:G,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⭐</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:"#1a1814"}}>Being <span style={{color:G}}>Tchitaka</span></div>
              <nav style={{display:"flex",gap:2,marginLeft:12}}>
                {["Home","Calm","Programs","Toolkit","👤 Profile"].map((n)=>(
                  <button key={n} onClick={()=>{
                    if(n==="Calm") setPage("calm");
                    else if(n==="Programs") setPage("programs");
                    else if(n==="Toolkit") setToolkitTool("Boundaries");
                    else if(n.includes("Profile")) setProfileOpen(true);
                    else setPage("home");
                  }} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,color:n==="Home"?G:"#7a7368",cursor:"pointer",border:"none",background:n==="Home"?"rgba(232,160,32,.12)":"transparent"}}>{n}</button>
                ))}
              </nav>
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
                <div onClick={()=>setProfileOpen(true)} style={{display:"flex",alignItems:"center",gap:5,background:"#fff",border:"1px solid rgba(0,0,0,.08)",borderRadius:20,padding:"3px 10px 3px 4px",cursor:"pointer"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#1a1200"}}>{displayName.charAt(0).toUpperCase()}</div>
                  <span style={{fontSize:11.5,fontWeight:700,color:"#1a1814"}}>{displayName}</span>
                  <span style={{background:G,color:"#1a1200",fontSize:8,fontWeight:800,borderRadius:20,padding:"2px 7px"}}>Premium</span>
                </div>
                <button onClick={onSignOut} style={{background:"none",border:"1px solid rgba(0,0,0,.1)",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:600,color:"#7a7368",cursor:"pointer"}}>Sign out</button>
              </div>
            </div>
            <div style={{background:"#f7f5f2",border:"1px solid rgba(0,0,0,.08)",borderTop:"none",borderRadius:"0 0 14px 14px",padding:18}}>
              <div className="phone-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14}}>
                <LightHomeScreen/><LightCheckinScreen/><LightGuidanceScreen/><LightToolkitScreen/>
              </div>
            </div>
          </div>
        </div>
      </>}

      {page==="calm" && (
        <>
          <button onClick={()=>setPage("home")} style={{position:"sticky",top:64,zIndex:50,margin:"16px 28px 0",display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:9,padding:"8px 16px",color:"rgba(255,255,255,.7)",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Back to Home</button>
          <CalmPage onPlaySession={i=>setCalmSession(i)}/>
        </>
      )}

      {page==="programs" && (
        <>
          <button onClick={()=>setPage("home")} style={{position:"sticky",top:64,zIndex:50,margin:"16px 28px 0",display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid rgba(0,0,0,.1)",borderRadius:9,padding:"8px 16px",color:"#7a7368",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Back to Home</button>
          <ProgramsPage show onBook={()=>setBooking(true)}/>
        </>
      )}

      {/* MODALS */}
      {booking && <BookingModal onClose={()=>setBooking(false)}/>}
      {notif   && <NotifModal  onClose={()=>setNotif(false)}/>}
      {profileOpen && <ProfileModal onClose={()=>setProfileOpen(false)} displayName={displayName} email={email} onSave={n=>setDisplayName(n)}/>}
      {subOpen && <SubModal show onClose={()=>setSubOpen(false)}/>}
      {toolkitTool && <ToolkitModal tool={toolkitTool} onClose={()=>setToolkitTool(null)} onBook={()=>setBooking(true)}/>}
      {calmSession!==null && <CalmPlayerModal session={CALM_SESSIONS[calmSession]} onClose={()=>setCalmSession(null)}/>}
      {addTaskOpen && <AddTaskModal onClose={()=>setAddTaskOpen(false)} onAdd={addTask}/>}

      <Toast/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function AuthScreen({onAuth}) {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [gState, setGState] = useState("idle");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const validate = () => {
    if(!email.trim()){setError("Please enter your email.");return false;}
    if(!/\S+@\S+\.\S+/.test(email)){setError("Invalid email address.");return false;}
    if(pw.length<6){setError("Password must be at least 6 characters.");return false;}
    return true;
  };
  const submit = async () => {
    setError(""); if(!validate()) return;
    setLoading(true);
    try {
      if(tab==="signin"){
        const cred = await signInWithEmailAndPassword(fbAuth, email, pw);
        onAuth(cred.user.email, cred.user.displayName || cred.user.email.split("@")[0]);
      } else {
        const cred = await createUserWithEmailAndPassword(fbAuth, email, pw);
        onAuth(cred.user.email, cred.user.email.split("@")[0]);
      }
    } catch(err) {
      const msg = err.code === "auth/user-not-found" ? "No account found with this email."
        : err.code === "auth/wrong-password" ? "Incorrect password. Try again."
        : err.code === "auth/email-already-in-use" ? "An account with this email already exists."
        : err.code === "auth/weak-password" ? "Password must be at least 6 characters."
        : err.code === "auth/invalid-credential" ? "Invalid email or password."
        : err.message;
      setError(msg);
    }
    setLoading(false);
  };
  const googleAuth = async () => {
    if(gState!=="idle") return;
    setGState("loading"); setError("");
    try {
      const cred = await signInWithPopup(fbAuth, googleProvider);
      setGState("success");
      setTimeout(()=>onAuth(cred.user.email, cred.user.displayName || cred.user.email.split("@")[0]), 500);
    } catch(err) {
      setGState("idle");
      setError(err.code==="auth/popup-closed-by-user" ? "Google sign-in was cancelled." : err.message);
    }
  };

  const inp={width:"100%",padding:"11px 14px",border:"1px solid #E0D8CC",borderRadius:9,fontSize:14,outline:"none",background:"white",boxSizing:"border-box",fontFamily:"inherit"};
  const features=[
    {ico:"📋", lbl:"Daily check-ins that keep you on track"},
    {ico:"🧠", lbl:"AI mindset coaching tailored to you"},
    {ico:"💎", lbl:"Private 1-on-1 coaching with Rodrigue"},
    {ico:"🌙", lbl:"Calm sessions to reset and recharge"},
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#F0EBE0",fontFamily:"Georgia,serif"}}>
      {showForgot && <ForgotModal onClose={()=>setShowForgot(false)}/>}
      {/* LEFT */}
      <div style={{flex:1.3,padding:"48px 52px",display:"flex",flexDirection:"column",gap:22}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:44,height:44,background:G,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⭐</div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:"#1a1814"}}>Being <span style={{color:G}}>Tchitaka</span></div>
            <div style={{fontSize:9,letterSpacing:"2px",color:"#999",textTransform:"uppercase"}}>— GROWTH OS —</div>
          </div>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(232,160,32,.12)",border:"1px solid rgba(232,160,32,.28)",borderRadius:20,padding:"5px 14px",width:"fit-content",fontSize:11,fontWeight:600,letterSpacing:1,color:GD}}>
          ● YOUR DAILY GROWTH SYSTEM
        </div>
        <div>
          <div style={{fontSize:46,lineHeight:1.15,fontWeight:900,color:"#1a1814"}}>Build the life</div>
          <div style={{fontSize:46,lineHeight:1.15,fontWeight:700,fontStyle:"italic",color:G}}>you were made for.</div>
        </div>
        <div style={{fontSize:14,color:"#666",lineHeight:1.8,maxWidth:460}}>Daily check-ins, mindset coaching, calm sessions, and structured programs — everything you need to grow with intention, every single day.</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {features.map(f=>(
            <div key={f.lbl} style={{background:"white",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,fontSize:13,color:"#333",fontWeight:600,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
              <span style={{fontSize:20,width:28,flexShrink:0}}>{f.ico}</span>{f.lbl}
            </div>
          ))}
          <div style={{background:"white",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
            <span style={{fontSize:20,width:28,flexShrink:0}}>🔒</span>
            <div><div style={{fontSize:13,fontWeight:700,color:"#333"}}>Private, encrypted & never shared</div><div style={{fontSize:11,color:"#999"}}>Your data belongs to you. Always.</div></div>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div style={{width:400,background:"white",padding:"40px 36px",display:"flex",flexDirection:"column",gap:18,boxShadow:"-4px 0 30px rgba(0,0,0,.07)"}}>
        <div style={{display:"flex",borderRadius:9,border:"1px solid #E0D8CC",overflow:"hidden"}}>
          {["signin","create"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setError("");}} style={{flex:1,padding:"10px",textAlign:"center",cursor:"pointer",fontSize:13,fontWeight:700,background:tab===t?G:"transparent",color:tab===t?"white":"#888",border:"none",transition:"all .2s",fontFamily:"inherit"}}>
              {t==="signin"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>
        <div>
          <div style={{fontSize:24,fontWeight:800,color:"#1a1814"}}>{tab==="signin"?"Welcome back":"Join Tchitaka"}</div>
          <div style={{fontSize:13,color:"#888",marginTop:4}}>{tab==="signin"?"Sign in to continue your growth journey.":"Start your transformation today."}</div>
        </div>
        <button onClick={googleAuth} disabled={gState==="loading"} style={{width:"100%",padding:12,border:"1px solid #E0D8CC",borderRadius:9,background:gState==="success"?G:"white",color:gState==="success"?"white":"#333",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all .2s",fontFamily:"inherit"}}>
          {gState==="success"?"✓ Signed in with Google!":gState==="loading"
            ?<><div style={{width:16,height:16,border:"2px solid #ddd",borderTopColor:G,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Connecting…</>
            :<><span style={{fontSize:16,display:"flex"}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </span>Continue with Google</>}
        </button>
        <div style={{textAlign:"center",color:"#bbb",fontSize:12,position:"relative"}}>
          <span style={{background:"white",padding:"0 10px",position:"relative",zIndex:1}}>OR</span>
          <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:"#E0D8CC"}}/>
        </div>
        {error&&<div style={{background:"#fff2f2",border:"1px solid #fdd",borderRadius:8,padding:"9px 12px",fontSize:13,color:"#c00"}}>⚠️ {error}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <label style={{fontSize:11,fontWeight:700,letterSpacing:.5,color:"#555"}}>EMAIL ADDRESS</label>
          <input style={inp} type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <label style={{fontSize:11,fontWeight:700,letterSpacing:.5,color:"#555"}}>PASSWORD</label>
          <div style={{position:"relative"}}>
            <input style={{...inp,paddingRight:42}} type={showPw?"text":"password"} placeholder="Minimum 6 characters" value={pw} onChange={e=>{setPw(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:"#aaa"}}>{showPw?"🙈":"👁"}</button>
          </div>
        </div>
        {tab==="signin"&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:"#555"}}>
              <input type="checkbox" checked={remember} onChange={()=>setRemember(!remember)} style={{accentColor:G,width:15,height:15}}/>Remember me
            </label>
            <button onClick={()=>setShowForgot(true)} style={{background:"none",border:"none",color:G,fontSize:13,cursor:"pointer",fontWeight:600,fontFamily:"inherit"}}>Forgot password?</button>
          </div>
        )}
        <button onClick={submit} disabled={loading} style={{width:"100%",padding:14,background:G,border:"none",borderRadius:9,color:"white",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loading?.7:1,fontFamily:"inherit",transition:"all .15s"}}>
          {loading?<><div style={{width:16,height:16,border:"2.5px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Please wait…</>:tab==="signin"?"✦ Sign In":"✦ Create Account"}
        </button>
        <div style={{textAlign:"center",fontSize:13,color:"#888"}}>
          {tab==="signin"
            ?<>Don't have an account? <span onClick={()=>{setTab("create");setError("");}} style={{color:G,fontWeight:700,cursor:"pointer"}}>Create one free</span></>
            :<>Already have an account? <span onClick={()=>{setTab("signin");setError("");}} style={{color:G,fontWeight:700,cursor:"pointer"}}>Sign in</span></>}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:11,color:"#aaa"}}>
          <span>🔒 Encrypted</span><span>🛡 SSL</span><span>✅ GDPR</span>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function BeingTchitakaApp() {
  const [user, setUser] = useState(null);       // {email, displayName}
  const [checking, setChecking] = useState(true);

  // Persist login across page refreshes via Firebase session
  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (firebaseUser) => {
      if(firebaseUser){
        const raw = firebaseUser.displayName || firebaseUser.email.split("@")[0];
        const name = raw.replace(/[^a-zA-Z ]/g," ").trim().split(" ")
          .map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ") || "Alex";
        setUser({email: firebaseUser.email, displayName: name});
      } else {
        setUser(null);
      }
      setChecking(false);
    });
    return () => unsub();
  }, []);

  const handleAuth = (email, displayName) => {
    const name = (displayName||email.split("@")[0])
      .replace(/[^a-zA-Z ]/g," ").trim().split(" ")
      .map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ") || "Alex";
    setUser({email, displayName: name});
  };

  const handleSignOut = async () => {
    await fbSignOut(fbAuth);
    setUser(null);
  };

  if(checking) return (
    <div style={{minHeight:"100vh",background:"#13120f",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{width:44,height:44,background:"#f5a623",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>⭐</div>
      <div style={{width:32,height:32,border:"3px solid rgba(245,166,35,.2)",borderTopColor:"#f5a623",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(245,166,35,.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(245,166,35,.6); }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#f5a623; cursor:pointer; }
        @media (max-width: 1100px) {
          .phone-grid-4 { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
        @media (max-width: 700px) {
          .phone-grid-4 { grid-template-columns: 1fr !important; }
          .top-nav-links { display: none !important; }
          .top-nav-user { display: none !important; }
          .section-pad { padding: 16px 12px 32px !important; }
          .light-topbar { display: none !important; }
          .mobile-quick-nav { display: flex !important; gap: 4px; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );

  if(!user) return <AuthScreen onAuth={handleAuth}/>;
  return <MainApp displayName={user.displayName} email={user.email} onSignOut={handleSignOut}/>;
}
