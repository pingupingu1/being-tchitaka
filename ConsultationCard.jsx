import { useState } from "react";

/* ══════════════════════════════════════════════════════════
   CONSULTATION CARD STYLES
   Add these CSS classes to your existing stylesheet or
   inject via a <style> tag in the parent component.
══════════════════════════════════════════════════════════ */
export const CONSULT_CSS = `
  /* ── DARK THEME CONSULTATION CARD ── */
  .consult-card {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,rgba(155,89,182,0.15),rgba(232,146,42,0.06));
    border:1px solid rgba(155,89,182,0.35);
    border-radius:12px; padding:14px;
    margin-bottom:9px; cursor:default;
  }
  .consult-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#9B59B6,#F5A623,#E91E8C);
  }
  .consult-badge {
    display:inline-flex; align-items:center; gap:4px;
    background:rgba(155,89,182,0.2); border:1px solid rgba(155,89,182,0.3);
    color:#c084fc; font-size:8px; font-weight:700;
    letter-spacing:1.5px; text-transform:uppercase;
    padding:2px 8px; border-radius:100px; margin-bottom:8px;
  }
  .consult-badge-dot { width:4px; height:4px; border-radius:50%; background:#c084fc; animation:cpulse 2s infinite; }
  .consult-title { font-size:12px; font-weight:700; line-height:1.3; margin-bottom:5px; }
  .consult-desc { font-size:9.5px; color:rgba(240,237,232,0.5); line-height:1.55; margin-bottom:10px; }
  .consult-meta { display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
  .consult-meta-item { display:flex; align-items:center; gap:4px; font-size:9px; color:rgba(240,237,232,0.45); }
  .consult-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .consult-price { font-size:20px; font-weight:800; color:#F5A623; line-height:1; }
  .consult-price-sub { font-size:8.5px; color:rgba(240,237,232,0.3); margin-top:1px; }
  .consult-btn {
    background:linear-gradient(135deg,#9B59B6,#7b3f9e);
    border:none; border-radius:8px; padding:8px 14px;
    font-size:10px; font-weight:700; color:#fff; cursor:pointer;
    display:flex; align-items:center; gap:5px;
    transition:all 0.18s; box-shadow:0 3px 12px rgba(155,89,182,0.4);
    white-space:nowrap; font-family:'DM Sans',sans-serif;
  }
  .consult-btn:hover { transform:translateY(-1px); box-shadow:0 5px 18px rgba(155,89,182,0.5); }

  /* ── LIGHT THEME CONSULTATION CARD ── */
  .lconsult-card {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,rgba(155,89,182,0.08),rgba(245,166,35,0.04));
    border:1px solid rgba(155,89,182,0.25);
    border-radius:10px; padding:12px;
    margin-bottom:8px;
  }
  .lconsult-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#9B59B6,#F5A623,#E91E8C);
  }
  .lconsult-badge {
    display:inline-flex; align-items:center; gap:4px;
    background:rgba(155,89,182,0.1); border:1px solid rgba(155,89,182,0.2);
    color:#9B59B6; font-size:7.5px; font-weight:700;
    letter-spacing:1.5px; text-transform:uppercase;
    padding:2px 7px; border-radius:100px; margin-bottom:7px;
  }
  .lconsult-title { font-size:11.5px; font-weight:700; color:#1a1a2e; line-height:1.3; margin-bottom:4px; }
  .lconsult-desc { font-size:9px; color:#888; line-height:1.55; margin-bottom:9px; }
  .lconsult-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .lconsult-price { font-size:18px; font-weight:800; color:#F5A623; line-height:1; }
  .lconsult-price-sub { font-size:8px; color:#bbb; margin-top:1px; }
  .lconsult-btn {
    background:linear-gradient(135deg,#9B59B6,#7b3f9e);
    border:none; border-radius:8px; padding:7px 12px;
    font-size:9.5px; font-weight:700; color:#fff; cursor:pointer;
    display:flex; align-items:center; gap:4px;
    transition:all 0.18s; box-shadow:0 2px 10px rgba(155,89,182,0.35);
    white-space:nowrap; font-family:'DM Sans',sans-serif;
  }
  .lconsult-btn:hover { transform:translateY(-1px); }

  /* ── MODAL ── */
  .consult-modal-overlay {
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.8); backdrop-filter:blur(10px);
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:cfadein 0.2s ease;
  }
  .consult-modal {
    background:#131820; border:1px solid rgba(255,255,255,0.1);
    border-radius:22px; padding:28px; width:100%; max-width:440px;
    position:relative; max-height:90vh; overflow-y:auto;
  }
  .consult-modal-close {
    position:absolute; top:14px; right:14px;
    width:30px; height:30px; border-radius:8px;
    background:#1A2030; border:1px solid rgba(255,255,255,0.07);
    color:rgba(240,237,232,0.5); cursor:pointer; font-size:14px;
    display:flex; align-items:center; justify-content:center; transition:all 0.18s;
  }
  .consult-modal-close:hover { color:#F0EDE8; }
  .consult-modal-title { font-size:20px; font-weight:800; color:#F0EDE8; margin-bottom:4px; }
  .consult-modal-sub { font-size:12px; color:rgba(240,237,232,0.5); margin-bottom:20px; line-height:1.6; }
  .consult-section-lbl { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(240,237,232,0.3); margin-bottom:10px; }
  .consult-time-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:18px; }
  .consult-time-slot {
    background:#1A2030; border:1.5px solid rgba(255,255,255,0.07);
    border-radius:9px; padding:9px 6px; text-align:center;
    cursor:pointer; transition:all 0.18s;
    font-size:11.5px; font-weight:500; color:rgba(240,237,232,0.5);
  }
  .consult-time-slot:hover { border-color:rgba(155,89,182,0.4); color:#F0EDE8; }
  .consult-time-slot.sel {
    border-color:#9B59B6; background:rgba(155,89,182,0.15);
    color:#c084fc; font-weight:700;
  }
  .consult-time-slot.unavail { opacity:0.3; cursor:not-allowed; }
  .consult-summary {
    background:rgba(245,166,35,0.06); border:1px solid rgba(245,166,35,0.18);
    border-radius:12px; padding:14px 16px; margin-bottom:16px;
  }
  .consult-summary-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; font-size:12px; }
  .consult-summary-row:last-child { padding-top:10px; margin-top:4px; border-top:1px solid rgba(255,255,255,0.06); }
  .consult-summary-lbl { color:rgba(240,237,232,0.5); }
  .consult-summary-val { font-weight:600; color:#F0EDE8; }
  .consult-summary-price { font-size:20px; font-weight:800; color:#F5A623; }
  .consult-pay-btn {
    width:100%; padding:14px; border-radius:12px;
    background:linear-gradient(135deg,#9B59B6,#7b3f9e);
    border:none; color:#fff; font-size:14px; font-weight:700;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.2s; box-shadow:0 4px 18px rgba(155,89,182,0.4);
    font-family:'DM Sans',sans-serif;
  }
  .consult-pay-btn:hover { transform:translateY(-1px); }
  .consult-pay-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .consult-modal-note { font-size:10px; color:rgba(240,237,232,0.3); text-align:center; margin-top:8px; line-height:1.5; }

  /* ── CONFIRMATION ── */
  .consult-confirmed {
    background:rgba(155,89,182,0.1); border:1px solid rgba(155,89,182,0.3);
    border-radius:12px; padding:14px; margin-bottom:9px; text-align:center;
  }
  .consult-confirmed-icon { font-size:28px; margin-bottom:6px; }
  .consult-confirmed-title { font-size:13px; font-weight:700; color:#c084fc; margin-bottom:4px; }
  .consult-confirmed-sub { font-size:10px; color:rgba(240,237,232,0.5); line-height:1.5; }

  @keyframes cpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes cfadein { from{opacity:0} to{opacity:1} }
`;

/* ── TIME SLOTS DATA ── */
const TIME_SLOTS = [
  { time:"9:00 AM",  avail:true  },
  { time:"9:30 AM",  avail:false },
  { time:"10:00 AM", avail:true  },
  { time:"10:30 AM", avail:true  },
  { time:"11:00 AM", avail:false },
  { time:"11:30 AM", avail:true  },
  { time:"2:00 PM",  avail:true  },
  { time:"2:30 PM",  avail:true  },
  { time:"3:00 PM",  avail:false },
  { time:"3:30 PM",  avail:true  },
  { time:"4:00 PM",  avail:true  },
  { time:"4:30 PM",  avail:true  },
];

/* ══════════════════════════════════════════════════════════
   DARK THEME CONSULTATION CARD
   Use inside dark panels (dp-body)
══════════════════════════════════════════════════════════ */
export function ConsultationCard() {
  const [showModal,    setShowModal]    = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [paying,       setPaying]       = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const handlePay = () => {
    if (!selectedTime) return;
    setPaying(true);
    // TODO: Connect Stripe — recall stripe plan Step 3 to wire real payment
    setTimeout(() => { setPaying(false); setConfirmed(true); setShowModal(false); }, 2000);
  };

  if (confirmed) {
    return (
      <div className="consult-confirmed">
        <div className="consult-confirmed-icon">🎉</div>
        <div className="consult-confirmed-title">Session booked for {selectedTime}!</div>
        <div className="consult-confirmed-sub">Check your email for the meeting link with Rodrigue.</div>
      </div>
    );
  }

  return (
    <>
      <div className="consult-card">
        <div className="consult-badge"><div className="consult-badge-dot"/>Paid Consultation</div>
        <div className="consult-title">Book a 1 on 1 Growth Session</div>
        <div className="consult-desc">
          Need deeper guidance? Book a private coaching session with <strong style={{color:"#F0EDE8"}}>Rodrigue</strong>.
        </div>
        <div className="consult-meta">
          <div className="consult-meta-item">⏱️ 30-minute session</div>
          <div className="consult-meta-item">🔒 Secure payment</div>
        </div>
        <div className="consult-row">
          <div>
            <div className="consult-price">$99</div>
            <div className="consult-price-sub">per session</div>
          </div>
          <button className="consult-btn" onClick={() => setShowModal(true)}>📅 Book Session</button>
        </div>
      </div>

      {showModal && (
        <div className="consult-modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="consult-modal">
            <button className="consult-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div className="consult-modal-title">Book Your Session</div>
            <div className="consult-modal-sub">Select an available time slot for your 30-min session with Rodrigue.</div>

            <div className="consult-section-lbl">Available Times</div>
            <div className="consult-time-grid">
              {TIME_SLOTS.map(s => (
                <div key={s.time}
                  className={`consult-time-slot ${!s.avail?"unavail":selectedTime===s.time?"sel":""}`}
                  onClick={() => s.avail && setSelectedTime(s.time)}>
                  {s.time}
                  {!s.avail && <div style={{fontSize:"9px",color:"rgba(240,237,232,0.3)",marginTop:"2px"}}>Taken</div>}
                </div>
              ))}
            </div>

            {selectedTime && (
              <div className="consult-summary">
                <div className="consult-summary-row"><span className="consult-summary-lbl">Session</span><span className="consult-summary-val">1-on-1 with Rodrigue</span></div>
                <div className="consult-summary-row"><span className="consult-summary-lbl">Time</span><span className="consult-summary-val">{selectedTime}</span></div>
                <div className="consult-summary-row"><span className="consult-summary-lbl">Duration</span><span className="consult-summary-val">30 minutes</span></div>
                <div className="consult-summary-row"><span className="consult-summary-lbl">Total</span><span className="consult-summary-price">$99</span></div>
              </div>
            )}

            <button className="consult-pay-btn" disabled={!selectedTime || paying} onClick={handlePay}>
              {paying ? (
                <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"cpulse .7s linear infinite"}}/>Processing...</>
              ) : (
                <>🔒 Pay $99 &amp; Confirm Session</>
              )}
            </button>
            <div className="consult-modal-note">Secured by Stripe · Cancel 24h before for full refund</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   LIGHT THEME CONSULTATION CARD
   Use inside light panels (lp-body)
══════════════════════════════════════════════════════════ */
export function LightConsultationCard() {
  const [showModal,    setShowModal]    = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [paying,       setPaying]       = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const handlePay = () => {
    if (!selectedTime) return;
    setPaying(true);
    // TODO: Connect Stripe — recall stripe plan Step 3 to wire real payment
    setTimeout(() => { setPaying(false); setConfirmed(true); setShowModal(false); }, 2000);
  };

  if (confirmed) {
    return (
      <div style={{background:"rgba(155,89,182,0.08)",border:"1px solid rgba(155,89,182,0.2)",borderRadius:"9px",padding:"10px",marginBottom:"8px",textAlign:"center"}}>
        <div style={{fontSize:"22px",marginBottom:"4px"}}>🎉</div>
        <div style={{fontSize:"11px",fontWeight:700,color:"#9B59B6",marginBottom:"3px"}}>Session booked for {selectedTime}!</div>
        <div style={{fontSize:"9px",color:"#999",lineHeight:1.5}}>Check your email for the meeting link with Rodrigue.</div>
      </div>
    );
  }

  return (
    <>
      <div className="lconsult-card">
        <div className="lconsult-badge">📅 Paid Consultation</div>
        <div className="lconsult-title">Book a 1 on 1 Growth Session</div>
        <div className="lconsult-desc">
          Need deeper guidance? Book a private 30-min coaching session with <strong style={{color:"#1a1a2e"}}>Rodrigue</strong>.
        </div>
        <div className="lconsult-row">
          <div>
            <div className="lconsult-price">$99</div>
            <div className="lconsult-price-sub">per session</div>
          </div>
          <button className="lconsult-btn" onClick={() => setShowModal(true)}>📅 Book Session</button>
        </div>
      </div>

      {showModal && (
        <div className="consult-modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="consult-modal">
            <button className="consult-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div className="consult-modal-title">Book Your Session</div>
            <div className="consult-modal-sub">Select an available time slot for your 30-min session with Rodrigue.</div>

            <div className="consult-section-lbl">Available Times</div>
            <div className="consult-time-grid">
              {TIME_SLOTS.map(s => (
                <div key={s.time}
                  className={`consult-time-slot ${!s.avail?"unavail":selectedTime===s.time?"sel":""}`}
                  onClick={() => s.avail && setSelectedTime(s.time)}>
                  {s.time}
                  {!s.avail && <div style={{fontSize:"9px",color:"rgba(240,237,232,0.3)",marginTop:"2px"}}>Taken</div>}
                </div>
              ))}
            </div>

            {selectedTime && (
              <div className="consult-summary">
                <div className="consult-summary-row"><span className="consult-summary-lbl">Session</span><span className="consult-summary-val">1-on-1 with Rodrigue</span></div>
                <div className="consult-summary-row"><span className="consult-summary-lbl">Time</span><span className="consult-summary-val">{selectedTime}</span></div>
                <div className="consult-summary-row"><span className="consult-summary-lbl">Duration</span><span className="consult-summary-val">30 minutes</span></div>
                <div className="consult-summary-row"><span className="consult-summary-lbl">Total</span><span className="consult-summary-price">$99</span></div>
              </div>
            )}

            <button className="consult-pay-btn" disabled={!selectedTime || paying} onClick={handlePay}>
              {paying ? <>Processing...</> : <>🔒 Pay $99 &amp; Confirm Session</>}
            </button>
            <div className="consult-modal-note">Secured by Stripe · Cancel 24h before for full refund</div>
          </div>
        </div>
      )}
    </>
  );
}
