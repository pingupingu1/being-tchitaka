import { useState } from "react";
import FullApp from "./FullApp";

// ====================== GOOGLE ICON ======================
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ====================== INLINE CSS ======================
const landingCSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { margin: 0 !important; padding: 0 !important; width: 100%; min-height: 100vh; }
body { font-family: 'DM Sans', sans-serif; background: #f0ede8; -webkit-font-smoothing: antialiased; }

@keyframes gspin { to { transform: rotate(360deg); } }
@keyframes blink2 { 0%,100%{opacity:1} 50%{opacity:.35} }

.lp-page { min-height: 100vh; display: flex; flex-direction: column; background: #f0ede8; }
.lp-topbar { display: flex; align-items: center; padding: 14px 40px; border-bottom: 1px solid rgba(0,0,0,0.08); background: rgba(240,237,232,0.96); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; }
.lp-logo { display: flex; align-items: center; gap: 10px; }
.lp-logo-mark { width: 40px; height: 40px; background: linear-gradient(135deg,#f5a623,#c97d0a); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 3px 14px rgba(245,166,35,0.35); }
.lp-logo-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #1a1814; }
.lp-logo-name span { color: #f5a623; }
.lp-logo-sub { font-size: 8px; letter-spacing: .2em; color: #7a7368; text-transform: uppercase; font-weight: 600; display: block; }
.lp-hero { flex: 1; display: grid; grid-template-columns: 1fr 420px; }
.lp-left { padding: 56px 48px; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid rgba(0,0,0,0.08); }
.lp-eyebrow { display: inline-flex; align-items: center; gap: 7px; background: rgba(245,166,35,0.12); border: 1px solid rgba(245,166,35,0.28); border-radius: 100px; padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: .15em; color: #f5a623; text-transform: uppercase; margin-bottom: 24px; width: fit-content; }
.lp-dot { width: 6px; height: 6px; border-radius: 50%; background: #f5a623; animation: blink2 2s infinite; flex-shrink: 0; }
.lp-h1 { font-family: 'Playfair Display', serif; font-size: clamp(40px,4vw,62px); font-weight: 900; line-height: 1.06; letter-spacing: -.025em; color: #1a1814; margin-bottom: 3px; }
.lp-h1i { font-family: 'Playfair Display', serif; font-size: clamp(40px,4vw,62px); font-weight: 700; font-style: italic; line-height: 1.06; letter-spacing: -.02em; color: #f5a623; margin-bottom: 24px; }
.lp-desc { font-size: 15px; line-height: 1.75; color: #7a7368; max-width: 420px; margin-bottom: 30px; }
.lp-feats { display: flex; flex-direction: column; gap: 8px; margin-bottom: 26px; }
.lp-feat { display: flex; align-items: center; gap: 11px; padding: 10px 14px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 11px; transition: all .2s; }
.lp-feat:hover { border-color: rgba(245,166,35,0.28); transform: translateX(3px); }
.lp-feat-ico { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.lp-feat-lbl { font-size: 13px; font-weight: 600; color: #1a1814; }
.lp-right { display: flex; align-items: center; justify-content: center; padding: 40px 32px; background: #f7f5f2; }
.lp-card { width: 100%; max-width: 360px; }
.lp-tabs { display: flex; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 4px; margin-bottom: 22px; gap: 3px; }
.lp-tab-btn { flex: 1; padding: 9px 8px; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; background: transparent; color: #7a7368; }
.lp-tab-btn.active { background: linear-gradient(135deg,#f5a623,#d4820a); color: #fff; box-shadow: 0 2px 10px rgba(245,166,35,0.35); }
.lp-ctitle { font-family: 'Playfair Display', serif; font-size: 23px; font-weight: 900; color: #1a1814; margin-bottom: 3px; }
.lp-csub { font-size: 13px; color: #7a7368; margin-bottom: 20px; }
.lp-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px; background: #fff; border: 1px solid rgba(0,0,0,0.1); border-radius: 13px; padding: 12px; font-size: 13.5px; font-weight: 600; color: #1a1814; cursor: pointer; transition: all .22s; font-family: 'DM Sans', sans-serif; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); min-height: 46px; }
.lp-google:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(0,0,0,0.1); }
.lp-google:disabled { opacity: 0.7; cursor: not-allowed; }
.lp-or { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.lp-or::before, .lp-or::after { content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.08); }
.lp-or span { font-size: 10.5px; font-weight: 600; letter-spacing: .12em; color: #b5afa8; text-transform: uppercase; }
.lp-err { display: flex; align-items: center; gap: 7px; background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.18); border-radius: 9px; padding: 8px 12px; margin-bottom: 12px; font-size: 12.5px; color: #dc2626; font-weight: 500; }
.lp-field { margin-bottom: 10px; }
.lp-flabel { font-size: 9.5px; font-weight: 700; letter-spacing: .1em; color: #7a7368; text-transform: uppercase; margin-bottom: 5px; display: block; }
.lp-fwrap { position: relative; }
.lp-fico { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #b5afa8; pointer-events: none; }
.lp-feye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 13px; color: #b5afa8; padding: 3px; }
.lp-input { width: 100% !important; background: #fff !important; border: 1px solid rgba(0,0,0,0.09) !important; border-radius: 10px !important; padding: 11px 11px 11px 34px !important; font-size: 13.5px !important; color: #1a1814 !important; font-family: 'DM Sans', sans-serif !important; outline: none !important; transition: all .2s; }
.lp-input::placeholder { color: #b5afa8; }
.lp-input:focus { border-color: rgba(245,166,35,0.5) !important; box-shadow: 0 0 0 3px rgba(245,166,35,0.08) !important; }
.lp-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.lp-remember { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
.lp-cb { width: 16px; height: 16px; background: #f5a623; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #fff; flex-shrink: 0; }
.lp-cb.off { background: #fff; border: 1.5px solid rgba(0,0,0,0.12); }
.lp-rem { font-size: 12.5px; color: #7a7368; }
.lp-forgot { font-size: 12.5px; font-weight: 600; color: #f5a623; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.lp-cta-btn { width: 100% !important; background: linear-gradient(135deg,#f5a623,#e8941a) !important; border: none !important; border-radius: 13px !important; padding: 13px !important; font-size: 14px !important; font-weight: 700 !important; color: #fff !important; cursor: pointer; font-family: 'DM Sans', sans-serif !important; transition: all .22s; margin-bottom: 12px !important; box-shadow: 0 4px 14px rgba(245,166,35,0.3); display: flex !important; align-items: center !important; justify-content: center !important; gap: 7px !important; min-height: 48px !important; }
.lp-cta-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(245,166,35,0.46); }
.lp-cta-btn:disabled { opacity: .75; cursor: not-allowed; }
.lp-cspin { width: 15px; height: 15px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: gspin .7s linear infinite; }
.lp-slink { text-align: center; font-size: 12.5px; color: #7a7368; margin-bottom: 16px; }
.lp-slink a { color: #f5a623; font-weight: 600; text-decoration: none; cursor: pointer; }
.lp-trust { display: flex; justify-content: center; gap: 14px; padding-top: 13px; border-top: 1px solid rgba(0,0,0,0.07); }
.lp-trust-item { display: flex; align-items: center; gap: 4px; font-size: 10.5px; color: #b5afa8; font-weight: 500; }

@media(max-width:900px) {
  .lp-hero { grid-template-columns: 1fr; }
  .lp-left { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.08); padding: 36px 24px; }
  .lp-right { padding: 32px 24px; }
  .lp-topbar { padding: 14px 20px; }
}
`;

// ====================== AUTH FORM ======================
function AuthForm({ tab, setTab, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = tab === "login";

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate auth — replace with your real Firebase/Supabase/etc. call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    // Derive display name from email
    const displayName = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
    onSignIn({ email, displayName, uid: "demo-uid" });
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    // Replace with your real Google OAuth call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onSignIn({ email: "user@gmail.com", displayName: "Google User", uid: "google-uid" });
  };

  return (
    <div className="lp-card">
      <div className="lp-tabs">
        <button className={`lp-tab-btn${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
        <button className={`lp-tab-btn${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Create Account</button>
      </div>

      <div className="lp-ctitle">{isLogin ? "Welcome back" : "Get started"}</div>
      <div className="lp-csub">{isLogin ? "Sign in to your Growth OS" : "Begin your growth journey"}</div>

      <button className="lp-google" onClick={handleGoogle} disabled={loading}>
        <GoogleIcon />
        {loading ? "Connecting..." : `Continue with Google`}
      </button>

      <div className="lp-or"><span>or</span></div>

      {error && <div className="lp-err">⚠ {error}</div>}

      <div className="lp-field">
        <label className="lp-flabel">Email</label>
        <div className="lp-fwrap">
          <span className="lp-fico">✉</span>
          <input
            className="lp-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>

      <div className="lp-field">
        <label className="lp-flabel">Password</label>
        <div className="lp-fwrap">
          <span className="lp-fico">🔒</span>
          <input
            className="lp-input"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button className="lp-feye" onClick={() => setShowPw(!showPw)} type="button">
            {showPw ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      <div className="lp-row">
        <div className="lp-remember" onClick={() => setRemember(!remember)}>
          <div className={`lp-cb${remember ? "" : " off"}`}>{remember ? "✓" : ""}</div>
          <span className="lp-rem">Remember me</span>
        </div>
        {isLogin && <button className="lp-forgot">Forgot password?</button>}
      </div>

      <button className="lp-cta-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? <span className="lp-cspin" /> : null}
        {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
      </button>

      <div className="lp-slink">
        {isLogin ? (
          <>Don't have an account? <a onClick={() => { setTab("signup"); setError(""); }}>Sign up free</a></>
        ) : (
          <>Already have an account? <a onClick={() => { setTab("login"); setError(""); }}>Sign in</a></>
        )}
      </div>

      <div className="lp-trust">
        <div className="lp-trust-item">🔒 Secure</div>
        <div className="lp-trust-item">🌱 Free to start</div>
        <div className="lp-trust-item">✨ AI-powered</div>
      </div>
    </div>
  );
}

// ====================== LANDING PAGE ======================
export default function LandingScreen() {
  const [tab, setTab] = useState("login");
  const [user, setUser] = useState(null);

  const features = [
    { ico: "🧠", bg: "#fef3e2", lbl: "AI-powered daily guidance" },
    { ico: "📊", bg: "#e8f0fe", lbl: "Mood & energy tracking" },
    { ico: "🔥", bg: "#fce8ef", lbl: "Streak & accountability system" },
    { ico: "🛠", bg: "#e8fef3", lbl: "Toolkit for real-life challenges" },
  ];

  if (user) {
    return (
      <FullApp
        email={user.email}
        displayName={user.displayName}
        uid={user.uid}
        onSignOut={() => setUser(null)}
      />
    );
  }

  return (
    <>
      <style>{landingCSS}</style>
      <div className="lp-page">
        {/* Top bar */}
        <div className="lp-topbar">
          <div className="lp-logo">
            <div className="lp-logo-mark">⭐</div>
            <div>
              <div className="lp-logo-name">Being <span>Tchitaka</span></div>
              <span className="lp-logo-sub">— Growth OS —</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="lp-hero">
          {/* Left: pitch */}
          <div className="lp-left">
            <div className="lp-eyebrow">
              <div className="lp-dot" />
              Personal Growth OS
            </div>
            <div className="lp-h1">Become the best</div>
            <div className="lp-h1i">version of yourself.</div>
            <p className="lp-desc">
              Daily check-ins, AI guidance, and real-life tools — all in one place.
              Build discipline, track your growth, and live with more intention every day.
            </p>
            <div className="lp-feats">
              {features.map(f => (
                <div className="lp-feat" key={f.lbl}>
                  <div className="lp-feat-ico" style={{ background: f.bg }}>{f.ico}</div>
                  <span className="lp-feat-lbl">{f.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: auth card */}
          <div className="lp-right">
            <AuthForm tab={tab} setTab={setTab} onSignIn={setUser} />
          </div>
        </div>
      </div>
    </>
  );
}
