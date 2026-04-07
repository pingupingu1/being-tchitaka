import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ci-root {
    --gold:#F5A623; --gold2:#E8922A; --gg:rgba(245,166,35,0.25);
    --teal:#2ED8C3; --tg:rgba(46,216,195,0.15);
    --dk:#0C1018; --dkc:#131820; --dks:#1A2030;
    --bdr:rgba(255,255,255,0.07);
    --tp:#F0EDE8; --tm:rgba(240,237,232,0.55); --ts:rgba(240,237,232,0.3);
    --red:#FF5C5C; --purple:#9B59B6; --pink:#E91E8C;
    font-family:'DM Sans',sans-serif;
    min-height:100vh; width:100vw;
    background:var(--dk); color:var(--tp);
    display:flex; flex-direction:column;
    overflow-x:hidden;
  }
  .ci-root*,.ci-root*::before,.ci-root*::after{box-sizing:border-box;margin:0;padding:0}

  /* BG */
  .ci-bg {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 0%, rgba(46,216,195,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 100%, rgba(245,166,35,0.06) 0%, transparent 55%);
  }

  /* TOPBAR */
  .ci-top {
    position:relative; z-index:10; flex-shrink:0;
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 28px;
    background:rgba(12,16,24,0.8); backdrop-filter:blur(12px);
    border-bottom:1px solid var(--bdr);
  }
  .ci-top-left { display:flex; align-items:center; gap:12px; }
  .ci-back-btn {
    width:36px; height:36px; border-radius:10px;
    background:var(--dks); border:1px solid var(--bdr);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--tm); transition:all 0.18s;
  }
  .ci-back-btn:hover { color:var(--tp); border-color:rgba(255,255,255,0.15); }
  .ci-top-title { font-family:'Fraunces',serif; font-size:16px; font-weight:600; }
  .ci-top-date { font-size:11px; color:var(--ts); margin-top:1px; }
  .ci-top-badge {
    background:var(--tg); border:1px solid rgba(46,216,195,0.25);
    color:var(--teal); font-size:11px; font-weight:600;
    padding:4px 12px; border-radius:100px;
  }

  /* PROGRESS */
  .ci-prog { padding:14px 28px 0; position:relative; z-index:10; }
  .ci-prog-track { height:3px; background:rgba(255,255,255,0.07); border-radius:2px; overflow:hidden; }
  .ci-prog-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--teal),var(--gold)); transition:width 0.5s cubic-bezier(0.4,0,0.2,1); }
  .ci-prog-steps { display:flex; justify-content:space-between; margin-top:10px; }
  .ci-prog-step { font-size:10px; color:var(--ts); font-weight:500; letter-spacing:0.5px; text-transform:uppercase; transition:color 0.2s; }
  .ci-prog-step.active { color:var(--teal); }
  .ci-prog-step.done { color:var(--gold); }

  /* MAIN */
  .ci-main { flex:1; display:flex; align-items:flex-start; justify-content:center; padding:28px 28px 40px; position:relative; z-index:10; }
  .ci-wrap { width:100%; max-width:620px; }

  /* SECTION HEADER */
  .ci-section-hdr { margin-bottom:24px; }
  .ci-section-tag {
    display:inline-flex; align-items:center; gap:6px; margin-bottom:12px;
    background:var(--tg); border:1px solid rgba(46,216,195,0.2);
    border-radius:100px; padding:4px 12px;
    font-size:10px; color:var(--teal); font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
  }
  .ci-section-tag .ci-tag-dot { width:5px; height:5px; border-radius:50%; background:var(--teal); animation:ciPulse 2s infinite; }
  .ci-section-title { font-family:'Fraunces',serif; font-size:clamp(22px,3.5vw,32px); font-weight:800; line-height:1.1; letter-spacing:-0.5px; margin-bottom:8px; }
  .ci-section-title em { font-style:italic; font-weight:300; color:var(--teal); }
  .ci-section-sub { font-size:14px; color:var(--tm); line-height:1.6; }

  /* MOOD STEP */
  .ci-mood-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-bottom:8px; }
  .ci-mood-opt {
    background:var(--dkc); border:2px solid var(--bdr);
    border-radius:16px; padding:18px 10px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:8px;
    transition:all 0.2s; user-select:none;
  }
  .ci-mood-opt:hover { border-color:rgba(46,216,195,0.3); transform:translateY(-2px); }
  .ci-mood-opt.sel { border-color:var(--teal); background:var(--tg); box-shadow:0 0 0 3px rgba(46,216,195,0.1); transform:translateY(-2px); }
  .ci-mood-emoji { font-size:32px; transition:transform 0.2s; }
  .ci-mood-opt.sel .ci-mood-emoji { transform:scale(1.15); }
  .ci-mood-label { font-size:11px; font-weight:600; color:var(--tm); }
  .ci-mood-opt.sel .ci-mood-label { color:var(--teal); }

  .ci-mood-insight {
    background:var(--dkc); border:1px solid var(--bdr);
    border-radius:12px; padding:14px 16px; margin-top:8px;
    display:flex; align-items:center; gap:10px;
    animation:ciFadeUp 0.3s ease;
  }
  .ci-mood-insight-icon { font-size:20px; flex-shrink:0; }
  .ci-mood-insight-text { font-size:13px; color:var(--tm); line-height:1.5; }
  .ci-mood-insight-text b { color:var(--tp); }

  /* SLIDERS STEP */
  .ci-slider-list { display:flex; flex-direction:column; gap:20px; }
  .ci-slider-item { background:var(--dkc); border:1px solid var(--bdr); border-radius:14px; padding:18px 20px; }
  .ci-slider-item.focused { border-color:rgba(255,255,255,0.15); }
  .ci-slider-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  .ci-slider-meta { display:flex; align-items:center; gap:8px; }
  .ci-slider-icon { font-size:18px; }
  .ci-slider-name { font-size:14px; font-weight:600; }
  .ci-slider-desc { font-size:11px; color:var(--ts); margin-bottom:14px; }
  .ci-slider-val-wrap { display:flex; align-items:center; gap:6px; }
  .ci-slider-num { font-family:'Fraunces',serif; font-size:24px; font-weight:700; min-width:28px; text-align:right; }
  .ci-slider-max { font-size:11px; color:var(--ts); }

  .ci-range {
    width:100%; height:6px; border-radius:3px; appearance:none; outline:none; cursor:pointer;
    background:var(--dks);
  }
  .ci-range::-webkit-slider-thumb {
    appearance:none; width:20px; height:20px; border-radius:50%;
    cursor:pointer; border:2px solid rgba(255,255,255,0.2);
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
  }
  .ci-range-labels { display:flex; justify-content:space-between; margin-top:8px; }
  .ci-range-lbl { font-size:10px; color:var(--ts); }

  /* NOTE STEP */
  .ci-note-area {
    width:100%; min-height:140px; background:var(--dkc);
    border:1.5px solid var(--bdr); border-radius:14px;
    padding:16px 18px; color:var(--tp);
    font-family:'DM Sans',sans-serif; font-size:15px;
    resize:none; outline:none; line-height:1.7;
    transition:border-color 0.2s;
  }
  .ci-note-area:focus { border-color:var(--teal); box-shadow:0 0 0 3px rgba(46,216,195,0.08); }
  .ci-note-area::placeholder { color:var(--ts); }
  .ci-note-count { font-size:12px; color:var(--ts); text-align:right; margin-top:6px; }

  .ci-quick-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
  .ci-quick-tag {
    background:var(--dks); border:1px solid var(--bdr);
    border-radius:100px; padding:6px 14px;
    font-size:12px; color:var(--tm); cursor:pointer; transition:all 0.18s;
  }
  .ci-quick-tag:hover { border-color:rgba(46,216,195,0.3); color:var(--teal); }

  /* GUIDANCE STEP */
  .ci-loading {
    display:flex; flex-direction:column; align-items:center;
    justify-content:center; padding:60px 0; gap:20px;
    animation:ciFadeUp 0.4s ease;
  }
  .ci-loading-ring {
    width:64px; height:64px; border-radius:50%;
    border:3px solid var(--bdr); border-top-color:var(--teal);
    animation:ciSpin 1s linear infinite;
  }
  .ci-loading-text { font-size:14px; color:var(--tm); text-align:center; line-height:1.6; }
  .ci-loading-text b { color:var(--tp); display:block; font-family:'Fraunces',serif; font-size:18px; margin-bottom:4px; }

  .ci-guidance-card {
    background:linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02));
    border:1px solid rgba(245,166,35,0.2); border-radius:16px; padding:20px;
    margin-bottom:14px; animation:ciFadeUp 0.5s ease;
    position:relative; overflow:hidden;
  }
  .ci-guidance-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,var(--gold),var(--teal));
  }
  .ci-guidance-lbl { font-size:10px; color:var(--gold); letter-spacing:1.5px; text-transform:uppercase; font-weight:600; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .ci-guidance-headline { font-family:'Fraunces',serif; font-size:20px; font-weight:700; line-height:1.3; margin-bottom:10px; }
  .ci-guidance-body { font-size:13px; color:var(--tm); line-height:1.65; }

  .ci-plan-card {
    background:var(--dkc); border:1px solid var(--bdr);
    border-radius:14px; padding:18px 20px; margin-bottom:14px;
    animation:ciFadeUp 0.5s 0.1s ease both;
  }
  .ci-plan-title { font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--ts); margin-bottom:14px; }
  .ci-plan-list { display:flex; flex-direction:column; gap:10px; }
  .ci-plan-row { display:flex; align-items:center; gap:12px; }
  .ci-plan-num { width:22px; height:22px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:#0C1018; }
  .ci-plan-name { font-size:14px; font-weight:500; flex:1; }
  .ci-plan-dur { font-size:12px; color:var(--ts); }
  .ci-plan-check { width:18px; height:18px; border-radius:50%; border:1.5px solid var(--bdr); flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s; font-size:10px; }
  .ci-plan-check.done { background:var(--teal); border-color:var(--teal); color:#0C1018; }

  .ci-prayer-card {
    background:linear-gradient(135deg,rgba(46,216,195,0.08),rgba(46,216,195,0.02));
    border:1px solid rgba(46,216,195,0.2); border-radius:14px; padding:18px 20px;
    margin-bottom:14px; animation:ciFadeUp 0.5s 0.2s ease both;
    display:flex; align-items:flex-start; gap:12px;
  }
  .ci-prayer-icon { font-size:22px; flex-shrink:0; margin-top:2px; }
  .ci-prayer-label { font-size:10px; color:var(--teal); letter-spacing:1.5px; text-transform:uppercase; font-weight:600; margin-bottom:6px; }
  .ci-prayer-text { font-size:14px; color:var(--tm); line-height:1.65; font-style:italic; }

  .ci-score-row { display:flex; gap:10px; margin-bottom:14px; animation:ciFadeUp 0.5s 0.3s ease both; }
  .ci-score-chip {
    flex:1; background:var(--dkc); border:1px solid var(--bdr);
    border-radius:12px; padding:14px 12px; text-align:center;
  }
  .ci-score-val { font-family:'Fraunces',serif; font-size:24px; font-weight:700; line-height:1; }
  .ci-score-lbl { font-size:10px; color:var(--ts); margin-top:4px; letter-spacing:0.5px; text-transform:uppercase; }

  /* ══════════════════════════════════════════
     PAID CONSULTATION CARD
  ══════════════════════════════════════════ */
  .ci-consult-card {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,rgba(155,89,182,0.15),rgba(232,146,42,0.08));
    border:1px solid rgba(155,89,182,0.35);
    border-radius:18px; padding:22px;
    margin-bottom:14px;
    animation:ciFadeUp 0.5s 0.25s ease both;
  }
  .ci-consult-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#9B59B6,var(--gold),#E91E8C);
  }
  .ci-consult-card::after {
    content:'💬'; position:absolute; right:18px; top:18px;
    font-size:32px; opacity:0.15;
  }
  .ci-consult-badge {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(155,89,182,0.18); border:1px solid rgba(155,89,182,0.3);
    color:#c084fc; font-size:9px; font-weight:700;
    letter-spacing:1.5px; text-transform:uppercase;
    padding:3px 10px; border-radius:100px; margin-bottom:12px;
  }
  .ci-consult-badge-dot { width:4px; height:4px; border-radius:50%; background:#c084fc; animation:ciPulse 2s infinite; }
  .ci-consult-title {
    font-family:'Fraunces',serif; font-size:20px; font-weight:800;
    line-height:1.2; margin-bottom:8px; letter-spacing:-0.3px;
  }
  .ci-consult-desc {
    font-size:13px; color:var(--tm); line-height:1.65; margin-bottom:16px;
  }
  .ci-consult-meta {
    display:flex; align-items:center; gap:16px; margin-bottom:18px; flex-wrap:wrap;
  }
  .ci-consult-meta-item {
    display:flex; align-items:center; gap:6px;
    font-size:12px; color:var(--tm); font-weight:500;
  }
  .ci-consult-meta-icon { font-size:14px; }
  .ci-consult-price {
    font-family:'Fraunces',serif; font-size:28px; font-weight:800;
    color:var(--gold); line-height:1;
  }
  .ci-consult-price-sub { font-size:11px; color:var(--ts); margin-top:2px; }
  .ci-consult-row {
    display:flex; align-items:flex-end; justify-content:space-between; gap:16px;
  }
  .ci-consult-btn {
    flex-shrink:0;
    background:linear-gradient(135deg,#9B59B6,#7b3f9e);
    border:none; border-radius:12px;
    padding:13px 22px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
    color:#fff; cursor:pointer;
    display:flex; align-items:center; gap:8px;
    transition:all 0.2s;
    box-shadow:0 4px 20px rgba(155,89,182,0.4);
    white-space:nowrap;
  }
  .ci-consult-btn:hover { transform:translateY(-2px); box-shadow:0 6px 28px rgba(155,89,182,0.5); }
  .ci-consult-btn:active { transform:translateY(0); }

  /* TIME PICKER MODAL */
  .ci-modal-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(0,0,0,0.75); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; animation:ciFadeUp 0.2s ease;
  }
  .ci-modal {
    background:var(--dkc); border:1px solid rgba(255,255,255,0.1);
    border-radius:24px; padding:32px; width:100%; max-width:480px;
    position:relative; max-height:90vh; overflow-y:auto;
  }
  .ci-modal-close {
    position:absolute; top:16px; right:16px;
    width:32px; height:32px; border-radius:8px;
    background:var(--dks); border:1px solid var(--bdr);
    color:var(--tm); cursor:pointer; font-size:16px;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.18s;
  }
  .ci-modal-close:hover { color:var(--tp); }
  .ci-modal-title {
    font-family:'Fraunces',serif; font-size:24px; font-weight:800;
    margin-bottom:6px; letter-spacing:-0.3px;
  }
  .ci-modal-sub { font-size:13px; color:var(--tm); margin-bottom:24px; line-height:1.6; }
  .ci-time-section-title {
    font-size:11px; font-weight:700; letter-spacing:1.5px;
    text-transform:uppercase; color:var(--ts); margin-bottom:12px;
  }
  .ci-time-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:24px; }
  .ci-time-slot {
    background:var(--dks); border:1.5px solid var(--bdr);
    border-radius:10px; padding:10px 8px; text-align:center;
    cursor:pointer; transition:all 0.18s;
    font-size:13px; font-weight:500; color:var(--tm);
  }
  .ci-time-slot:hover { border-color:rgba(155,89,182,0.4); color:var(--tp); }
  .ci-time-slot.sel {
    border-color:#9B59B6; background:rgba(155,89,182,0.15);
    color:#c084fc; font-weight:700;
    box-shadow:0 0 0 3px rgba(155,89,182,0.1);
  }
  .ci-time-slot.unavail { opacity:0.3; cursor:not-allowed; }
  .ci-modal-summary {
    background:linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.03));
    border:1px solid rgba(245,166,35,0.2); border-radius:14px;
    padding:16px 18px; margin-bottom:20px;
  }
  .ci-modal-summary-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .ci-modal-summary-row:last-child { margin-bottom:0; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06); }
  .ci-modal-summary-lbl { font-size:12px; color:var(--tm); }
  .ci-modal-summary-val { font-size:13px; font-weight:600; color:var(--tp); }
  .ci-modal-summary-price { font-family:'Fraunces',serif; font-size:22px; font-weight:800; color:var(--gold); }
  .ci-modal-pay-btn {
    width:100%; padding:16px; border-radius:14px;
    background:linear-gradient(135deg,#9B59B6,#7b3f9e);
    border:none; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:16px; font-weight:700;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
    transition:all 0.2s;
    box-shadow:0 6px 24px rgba(155,89,182,0.4);
  }
  .ci-modal-pay-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(155,89,182,0.5); }
  .ci-modal-pay-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .ci-modal-note { font-size:11px; color:var(--ts); text-align:center; margin-top:10px; line-height:1.5; }

  /* CONFIRMATION SCREEN */
  .ci-confirm-wrap {
    text-align:center; padding:40px 20px;
    animation:ciFadeUp 0.5s ease;
  }
  .ci-confirm-ring {
    width:100px; height:100px; border-radius:50%; margin:0 auto 24px;
    background:linear-gradient(135deg,#9B59B6,#E91E8C);
    display:flex; align-items:center; justify-content:center;
    font-size:44px; box-shadow:0 8px 32px rgba(155,89,182,0.4);
    animation:ciBouncIn 0.6s ease;
  }
  .ci-confirm-title {
    font-family:'Fraunces',serif; font-size:28px; font-weight:800;
    margin-bottom:10px; letter-spacing:-0.5px;
  }
  .ci-confirm-title em { font-style:italic; font-weight:300; color:#c084fc; }
  .ci-confirm-sub { font-size:15px; color:var(--tm); line-height:1.7; margin-bottom:28px; }
  .ci-confirm-details {
    background:var(--dkc); border:1px solid var(--bdr);
    border-radius:16px; padding:20px; margin-bottom:28px; text-align:left;
  }
  .ci-confirm-detail-row {
    display:flex; justify-content:space-between;
    align-items:center; padding:8px 0;
    border-bottom:1px solid var(--bdr); font-size:13px;
  }
  .ci-confirm-detail-row:last-child { border-bottom:none; }
  .ci-confirm-detail-lbl { color:var(--tm); }
  .ci-confirm-detail-val { font-weight:600; color:var(--tp); }

  /* MARK COMPLETE */
  .ci-mark-btn {
    width:100%; padding:16px; border-radius:14px;
    background:linear-gradient(135deg,var(--teal),#1ab8a6);
    border:none; color:#0C1018;
    font-family:'DM Sans',sans-serif; font-size:16px; font-weight:700;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.2s; box-shadow:0 4px 20px rgba(46,216,195,0.3);
    animation:ciFadeUp 0.5s 0.4s ease both;
  }
  .ci-mark-btn:hover { transform:translateY(-2px); box-shadow:0 6px 28px rgba(46,216,195,0.4); }
  .ci-mark-btn.done { background:rgba(46,216,195,0.15); color:var(--teal); box-shadow:none; border:1px solid rgba(46,216,195,0.3); }

  /* NAV BUTTONS */
  .ci-nav { display:flex; gap:10px; margin-top:28px; }
  .ci-btn-primary {
    flex:1; padding:15px; border-radius:12px;
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    border:none; color:#0C1018;
    font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.2s; box-shadow:0 4px 16px var(--gg);
  }
  .ci-btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 24px var(--gg); }
  .ci-btn-primary:disabled { opacity:0.35; cursor:not-allowed; transform:none; box-shadow:none; }
  .ci-btn-back {
    padding:15px 20px; border-radius:12px;
    background:var(--dkc); border:1.5px solid var(--bdr);
    color:var(--tm); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px;
  }
  .ci-btn-back:hover { border-color:rgba(255,255,255,0.15); color:var(--tp); }
  .ci-hint { font-size:12px; color:var(--ts); text-align:center; margin-top:10px; line-height:1.5; }

  /* COMPLETED SCREEN */
  .ci-done-wrap { text-align:center; padding:40px 20px; animation:ciFadeUp 0.5s ease; }
  .ci-done-ring {
    width:100px; height:100px; border-radius:50%; margin:0 auto 24px;
    background:linear-gradient(135deg,var(--teal),#1ab8a6);
    display:flex; align-items:center; justify-content:center;
    font-size:44px; box-shadow:0 8px 32px rgba(46,216,195,0.35);
    animation:ciBouncIn 0.6s ease;
  }
  .ci-done-title { font-family:'Fraunces',serif; font-size:32px; font-weight:800; letter-spacing:-0.5px; margin-bottom:10px; }
  .ci-done-title em { font-style:italic; font-weight:300; color:var(--teal); }
  .ci-done-sub { font-size:15px; color:var(--tm); line-height:1.65; margin-bottom:32px; max-width:380px; margin-left:auto; margin-right:auto; }
  .ci-done-stats { display:flex; gap:10px; justify-content:center; margin-bottom:32px; flex-wrap:wrap; }
  .ci-done-chip { background:var(--dkc); border:1px solid var(--bdr); border-radius:12px; padding:14px 18px; text-align:center; min-width:90px; }
  .ci-done-chip-val { font-family:'Fraunces',serif; font-size:22px; font-weight:700; }
  .ci-done-chip-lbl { font-size:9px; color:var(--ts); margin-top:3px; letter-spacing:0.5px; text-transform:uppercase; }

  /* ANIMATIONS */
  @keyframes ciFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ciPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  @keyframes ciSpin { to{transform:rotate(360deg)} }
  @keyframes ciBouncIn { 0%{transform:scale(0.4);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  /* RESPONSIVE */
  @media(max-width:600px) {
    .ci-top { padding:14px 18px; }
    .ci-prog { padding:12px 18px 0; }
    .ci-main { padding:20px 18px 32px; }
    .ci-mood-grid { grid-template-columns:repeat(5,1fr); gap:6px; }
    .ci-mood-opt { padding:12px 6px; }
    .ci-mood-emoji { font-size:24px; }
    .ci-score-row { flex-wrap:wrap; }
    .ci-time-grid { grid-template-columns:repeat(2,1fr); }
    .ci-consult-row { flex-direction:column; }
    .ci-consult-btn { width:100%; justify-content:center; }
  }
`;

/* ── DATA ── */
const MOODS = [
  { id:1, emoji:"😞", label:"Rough",   insight:"Rough days are part of growth. Let's make today a little easier.", color:"#FF5C5C" },
  { id:2, emoji:"😕", label:"Low",     insight:"Feeling low is okay. Small actions today will shift your energy.", color:"#F5A623" },
  { id:3, emoji:"😐", label:"Okay",    insight:"Neutral is a great starting point. Let's build from here.", color:"#FFD080" },
  { id:4, emoji:"🙂", label:"Good",    insight:"Good energy! Let's channel it into something meaningful.", color:"#2ED8C3" },
  { id:5, emoji:"😄", label:"Great",   insight:"You're thriving! Let's make today count even more.", color:"#F5A623" },
];

const SLIDERS_DATA = [
  { key:"stress",  icon:"⚡", name:"Stress",       desc:"How tense or overwhelmed are you feeling?",      color:"#FF5C5C", low:"Calm",    high:"Stressed" },
  { key:"energy",  icon:"🔋", name:"Energy",        desc:"How much physical & mental energy do you have?",  color:"#F5A623", low:"Drained", high:"Energized" },
  { key:"focus",   icon:"🎯", name:"Focus",         desc:"How clear and sharp is your mind right now?",     color:"#2ED8C3", low:"Foggy",   high:"Sharp" },
  { key:"connect", icon:"❤️", name:"Connection",    desc:"How connected do you feel to others & yourself?", color:"#E91E8C", low:"Isolated",high:"Connected" },
];

const QUICK_NOTES = [
  "Feeling grateful today", "Anxious about work", "Slept well last night",
  "Need more energy", "Excited about something", "Missing someone",
];

const PRAYERS = [
  "Guide my thoughts and calm my heart. Help me act from a place of peace today. Amen.",
  "Give me the wisdom to focus on what matters and the courage to let go of what doesn't. Amen.",
  "May today bring clarity, purpose, and moments of real connection. Amen.",
];

const GUIDANCE_MSGS = [
  { headline:"Stay calm & take one step at a time.", body:"Your energy levels suggest you may be running on fumes. Today, focus on just ONE thing. Give it your full attention and let everything else wait. Breathe first, then act." },
  { headline:"Your consistency is building something powerful.", body:"Even when it feels slow, every check-in is a rep for your mind. You're showing up — that's the hardest part. Keep that momentum alive today." },
  { headline:"Protect your energy today.", body:"With stress elevated, guard your time carefully. Say no to one unnecessary task. Take 3 deep breaths between transitions. Your calm is your superpower." },
];

const getGuidance = (sliders) => {
  const avg = Object.values(sliders).reduce((a,b)=>a+b,0) / 4;
  if (avg <= 2.5) return GUIDANCE_MSGS[0];
  if (avg <= 3.5) return GUIDANCE_MSGS[2];
  return GUIDANCE_MSGS[1];
};

const PLAN_ITEMS = [
  { name:"5-min focus block",     dur:"5 min",  color:"#2ED8C3" },
  { name:"Call someone you love", dur:"10 min", color:"#E91E8C" },
  { name:"Journal entry",         dur:"2 min",  color:"#F5A623" },
];

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

const STEPS = ["Mood", "Check-In", "Note", "Guidance"];

/* ══════════════════════════════════════════
   CONSULTATION CARD COMPONENT
══════════════════════════════════════════ */
function ConsultationCard() {
  const [showModal,    setShowModal]    = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [paying,       setPaying]       = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const handlePay = () => {
    if (!selectedTime) return;
    setPaying(true);
    // TODO: Replace with real Stripe integration (recall stripe plan — Step 3+)
    setTimeout(() => { setPaying(false); setConfirmed(true); }, 2000);
  };

  // Confirmation screen
  if (confirmed) {
    return (
      <div className="ci-confirm-wrap">
        <div className="ci-confirm-ring">🎉</div>
        <h2 className="ci-confirm-title">Session <em>booked!</em></h2>
        <p className="ci-confirm-sub">
          Your 1-on-1 session with Rodrigue is confirmed.<br/>
          Check your email for the meeting link.
        </p>
        <div className="ci-confirm-details">
          <div className="ci-confirm-detail-row">
            <span className="ci-confirm-detail-lbl">Session type</span>
            <span className="ci-confirm-detail-val">1-on-1 Growth Session</span>
          </div>
          <div className="ci-confirm-detail-row">
            <span className="ci-confirm-detail-lbl">Coach</span>
            <span className="ci-confirm-detail-val">Rodrigue</span>
          </div>
          <div className="ci-confirm-detail-row">
            <span className="ci-confirm-detail-lbl">Time</span>
            <span className="ci-confirm-detail-val">{selectedTime}</span>
          </div>
          <div className="ci-confirm-detail-row">
            <span className="ci-confirm-detail-lbl">Duration</span>
            <span className="ci-confirm-detail-val">30 minutes</span>
          </div>
          <div className="ci-confirm-detail-row">
            <span className="ci-confirm-detail-lbl">Amount paid</span>
            <span className="ci-confirm-detail-val" style={{color:"var(--gold)"}}>$99.00</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── CARD ── */}
      <div className="ci-consult-card">
        <div className="ci-consult-badge">
          <div className="ci-consult-badge-dot"/>
          Paid Consultation
        </div>
        <div className="ci-consult-title">Book a 1 on 1 Growth Session</div>
        <div className="ci-consult-desc">
          Need deeper guidance? Book a private coaching session with <strong style={{color:"var(--tp)"}}>Rodrigue</strong> and get personalised strategies for your growth journey.
        </div>
        <div className="ci-consult-meta">
          <div className="ci-consult-meta-item">
            <span className="ci-consult-meta-icon">⏱️</span>
            30-minute session
          </div>
          <div className="ci-consult-meta-item">
            <span className="ci-consult-meta-icon">🔒</span>
            Secure payment
          </div>
          <div className="ci-consult-meta-item">
            <span className="ci-consult-meta-icon">✅</span>
            Instant confirmation
          </div>
        </div>
        <div className="ci-consult-row">
          <div>
            <div className="ci-consult-price">$99</div>
            <div className="ci-consult-price-sub">per session</div>
          </div>
          <button className="ci-consult-btn" onClick={() => setShowModal(true)}>
            📅 Book Session
          </button>
        </div>
      </div>

      {/* ── TIME PICKER MODAL ── */}
      {showModal && (
        <div className="ci-modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="ci-modal">
            <button className="ci-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div className="ci-modal-title">Book Your Session</div>
            <div className="ci-modal-sub">
              Select an available time slot for your 30-minute 1-on-1 session with Rodrigue.
            </div>

            <div className="ci-time-section-title">Available Times — Today</div>
            <div className="ci-time-grid">
              {TIME_SLOTS.map(slot => (
                <div
                  key={slot.time}
                  className={`ci-time-slot ${!slot.avail ? "unavail" : selectedTime===slot.time ? "sel" : ""}`}
                  onClick={() => slot.avail && setSelectedTime(slot.time)}
                >
                  {slot.time}
                  {!slot.avail && <div style={{fontSize:"10px",color:"var(--ts)",marginTop:"2px"}}>Taken</div>}
                </div>
              ))}
            </div>

            {selectedTime && (
              <div className="ci-modal-summary">
                <div className="ci-modal-summary-row">
                  <span className="ci-modal-summary-lbl">Session</span>
                  <span className="ci-modal-summary-val">1-on-1 with Rodrigue</span>
                </div>
                <div className="ci-modal-summary-row">
                  <span className="ci-modal-summary-lbl">Time</span>
                  <span className="ci-modal-summary-val">{selectedTime}</span>
                </div>
                <div className="ci-modal-summary-row">
                  <span className="ci-modal-summary-lbl">Duration</span>
                  <span className="ci-modal-summary-val">30 minutes</span>
                </div>
                <div className="ci-modal-summary-row">
                  <span className="ci-modal-summary-lbl">Total</span>
                  <span className="ci-modal-summary-price">$99</span>
                </div>
              </div>
            )}

            <button
              className="ci-modal-pay-btn"
              disabled={!selectedTime || paying}
              onClick={handlePay}
            >
              {paying ? (
                <>
                  <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"ciSpin .7s linear infinite"}}/>
                  Processing payment...
                </>
              ) : (
                <> 🔒 Pay $99 & Confirm Session </>
              )}
            </button>
            <div className="ci-modal-note">
              Payment secured by Stripe · 100% refundable if cancelled 24h before
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function DailyCheckIn({ onBack, onComplete }) {
  const [step,      setStep]    = useState(0);
  const [mood,      setMood]    = useState(null);
  const [sliders,   setSliders] = useState({ stress:3, energy:3, focus:3, connect:3 });
  const [note,      setNote]    = useState("");
  const [loading,   setLoading] = useState(false);
  const [loaded,    setLoaded]  = useState(false);
  const [planDone,  setPlanDone] = useState({});
  const [dayMarked, setDayMarked] = useState(false);
  const [finished,  setFinished] = useState(false);
  const [focusedSlider, setFocusedSlider] = useState(null);

  const progress = ((step + 1) / STEPS.length) * 100;
  const selectedMood = MOODS.find(m => m.id === mood);
  const guidance = getGuidance(sliders);
  const score = Math.round(
    ((mood || 3) * 10) +
    (sliders.energy * 4) +
    ((5 - sliders.stress) * 4) +
    (sliders.focus * 4) +
    (sliders.connect * 3)
  );

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setLoaded(true); }, 2200);
  };

  const canNext = () => {
    if (step === 0) return mood !== null;
    return true;
  };

  const next = () => {
    if (step === 2) { setStep(3); handleGenerate(); }
    else if (step === 3) { setFinished(true); }
    else setStep(s => s + 1);
  };

  const back = () => { if (step > 0) { setStep(s => s-1); setLoaded(false); setLoading(false); } };
  const togglePlan = i => setPlanDone(p => ({...p,[i]:!p[i]}));

  /* ── FINISHED SCREEN ── */
  if (finished) {
    return (
      <>
        <style>{S}</style>
        <div className="ci-root">
          <div className="ci-bg"/>
          <div className="ci-top">
            <div className="ci-top-left">
              <div className="ci-top-title">Daily Check-In</div>
            </div>
            <div className="ci-top-badge">✓ Complete</div>
          </div>
          <div className="ci-main">
            <div className="ci-wrap">
              <div className="ci-done-wrap">
                <div className="ci-done-ring">✓</div>
                <h1 className="ci-done-title">Day <em>checked in!</em></h1>
                <p className="ci-done-sub">
                  You showed up for yourself today. That's the most important thing.
                  Your guidance is set — now go live it.
                </p>
                <div className="ci-done-stats">
                  <div className="ci-done-chip">
                    <div className="ci-done-chip-val" style={{color:selectedMood?.color}}>{selectedMood?.emoji}</div>
                    <div className="ci-done-chip-lbl">Mood</div>
                  </div>
                  <div className="ci-done-chip">
                    <div className="ci-done-chip-val" style={{color:"var(--gold)"}}>{score}</div>
                    <div className="ci-done-chip-lbl">Score</div>
                  </div>
                  <div className="ci-done-chip">
                    <div className="ci-done-chip-val" style={{color:"var(--teal)"}}>🔥6</div>
                    <div className="ci-done-chip-lbl">Streak</div>
                  </div>
                  <div className="ci-done-chip">
                    <div className="ci-done-chip-val" style={{color:"var(--purple)"}}>{Object.values(planDone).filter(Boolean).length}/{PLAN_ITEMS.length}</div>
                    <div className="ci-done-chip-lbl">Tasks done</div>
                  </div>
                </div>
                <div className="ci-nav" style={{justifyContent:"center"}}>
                  <button className="ci-btn-primary" style={{maxWidth:"300px"}} onClick={onComplete || onBack}>
                    Back to Home →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div className="ci-root">
        <div className="ci-bg"/>

        {/* TOPBAR */}
        <div className="ci-top">
          <div className="ci-top-left">
            {onBack && (
              <div className="ci-back-btn" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </div>
            )}
            <div>
              <div className="ci-top-title">Daily Check-In</div>
              <div className="ci-top-date">
                {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
              </div>
            </div>
          </div>
          <div className="ci-top-badge">🔥 5 day streak</div>
        </div>

        {/* PROGRESS */}
        <div className="ci-prog">
          <div className="ci-prog-track">
            <div className="ci-prog-fill" style={{width:`${progress}%`}}/>
          </div>
          <div className="ci-prog-steps">
            {STEPS.map((s,i) => (
              <div key={s} className={`ci-prog-step ${i===step?"active":i<step?"done":""}`}>{s}</div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="ci-main">
          <div className="ci-wrap" key={step}>

            {/* ── STEP 0: MOOD ── */}
            {step === 0 && (
              <>
                <div className="ci-section-hdr">
                  <div className="ci-section-tag"><span className="ci-tag-dot"/>Mood Check</div>
                  <h2 className="ci-section-title">How are you <em>feeling</em>?</h2>
                  <p className="ci-section-sub">Be honest — this is just for you. No judgment here.</p>
                </div>
                <div className="ci-mood-grid">
                  {MOODS.map(m => (
                    <div key={m.id} className={`ci-mood-opt ${mood===m.id?"sel":""}`} onClick={() => setMood(m.id)}>
                      <span className="ci-mood-emoji">{m.emoji}</span>
                      <span className="ci-mood-label">{m.label}</span>
                    </div>
                  ))}
                </div>
                {selectedMood && (
                  <div className="ci-mood-insight">
                    <span className="ci-mood-insight-icon">{selectedMood.emoji}</span>
                    <div className="ci-mood-insight-text">
                      <b>Feeling {selectedMood.label}</b> — {selectedMood.insight}
                    </div>
                  </div>
                )}
                <div className="ci-nav">
                  <button className="ci-btn-primary" onClick={next} disabled={!canNext()}>Continue →</button>
                </div>
                <p className="ci-hint">Your mood helps us personalise your daily guidance.</p>
              </>
            )}

            {/* ── STEP 1: SLIDERS ── */}
            {step === 1 && (
              <>
                <div className="ci-section-hdr">
                  <div className="ci-section-tag"><span className="ci-tag-dot"/>Energy Levels</div>
                  <h2 className="ci-section-title">Rate your <em>energy.</em></h2>
                  <p className="ci-section-sub">Slide each one to where you genuinely are right now.</p>
                </div>
                <div className="ci-slider-list">
                  {SLIDERS_DATA.map(s => (
                    <div key={s.key} className={`ci-slider-item ${focusedSlider===s.key?"focused":""}`}>
                      <div className="ci-slider-hdr">
                        <div className="ci-slider-meta">
                          <span className="ci-slider-icon">{s.icon}</span>
                          <span className="ci-slider-name">{s.name}</span>
                        </div>
                        <div className="ci-slider-val-wrap">
                          <span className="ci-slider-num" style={{color:s.color}}>{sliders[s.key]}</span>
                          <span className="ci-slider-max">/5</span>
                        </div>
                      </div>
                      <div className="ci-slider-desc">{s.desc}</div>
                      <input type="range" className="ci-range" min="1" max="5"
                        value={sliders[s.key]} style={{accentColor:s.color}}
                        onFocus={() => setFocusedSlider(s.key)}
                        onBlur={() => setFocusedSlider(null)}
                        onChange={e => setSliders(p => ({...p,[s.key]:+e.target.value}))}/>
                      <div className="ci-range-labels">
                        <span className="ci-range-lbl">{s.low}</span>
                        <span className="ci-range-lbl">{s.high}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ci-nav">
                  <button className="ci-btn-back" onClick={back}>← Back</button>
                  <button className="ci-btn-primary" onClick={next}>Continue →</button>
                </div>
              </>
            )}

            {/* ── STEP 2: NOTE ── */}
            {step === 2 && (
              <>
                <div className="ci-section-hdr">
                  <div className="ci-section-tag"><span className="ci-tag-dot"/>Quick Note</div>
                  <h2 className="ci-section-title">Anything on <em>your mind?</em></h2>
                  <p className="ci-section-sub">Optional — a quick thought, or skip to get your guidance.</p>
                </div>
                <div className="ci-quick-row">
                  {QUICK_NOTES.map(q => (
                    <span key={q} className="ci-quick-tag" onClick={() => setNote(n => n ? n + ". " + q : q)}>
                      + {q}
                    </span>
                  ))}
                </div>
                <textarea className="ci-note-area"
                  placeholder="What's on your mind today? Even one sentence helps..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={300}
                />
                <div className="ci-note-count">{note.length}/300</div>
                <div className="ci-nav">
                  <button className="ci-btn-back" onClick={back}>← Back</button>
                  <button className="ci-btn-primary" onClick={next}>
                    {note ? "Generate Guidance →" : "Skip & Generate →"}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: GUIDANCE ── */}
            {step === 3 && (
              <>
                {loading && (
                  <div className="ci-loading">
                    <div className="ci-loading-ring"/>
                    <div className="ci-loading-text">
                      <b>Generating your guidance...</b>
                      Analysing your mood, energy levels, and patterns to craft today's plan.
                    </div>
                  </div>
                )}

                {!loading && loaded && (
                  <>
                    <div className="ci-section-hdr" style={{marginBottom:"20px"}}>
                      <div className="ci-section-tag"><span className="ci-tag-dot"/>Today's Guidance</div>
                      <h2 className="ci-section-title">Your <em>daily plan.</em></h2>
                    </div>

                    {/* Score chips */}
                    <div className="ci-score-row">
                      <div className="ci-score-chip">
                        <div className="ci-score-val" style={{color:selectedMood?.color}}>{selectedMood?.emoji} {selectedMood?.label}</div>
                        <div className="ci-score-lbl">Mood</div>
                      </div>
                      <div className="ci-score-chip">
                        <div className="ci-score-val" style={{color:"var(--gold)"}}>{score}</div>
                        <div className="ci-score-lbl">Daily Score</div>
                      </div>
                      <div className="ci-score-chip">
                        <div className="ci-score-val" style={{color:"var(--teal)"}}>{sliders.energy}/5</div>
                        <div className="ci-score-lbl">Energy</div>
                      </div>
                    </div>

                    {/* Coach message */}
                    <div className="ci-guidance-card">
                      <div className="ci-guidance-lbl">⭐ Coach Message</div>
                      <div className="ci-guidance-headline">{guidance.headline}</div>
                      <div className="ci-guidance-body">{guidance.body}</div>
                    </div>

                    {/* Today's plan */}
                    <div className="ci-plan-card">
                      <div className="ci-plan-title">Today's Plan</div>
                      <div className="ci-plan-list">
                        {PLAN_ITEMS.map((p,i) => (
                          <div className="ci-plan-row" key={i}>
                            <div className="ci-plan-num" style={{background:p.color}}>{i+1}</div>
                            <span className="ci-plan-name">{p.name}</span>
                            <span className="ci-plan-dur">{p.dur}</span>
                            <div className={`ci-plan-check ${planDone[i]?"done":""}`} onClick={() => togglePlan(i)}>
                              {planDone[i]&&"✓"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prayer */}
                    <div className="ci-prayer-card">
                      <span className="ci-prayer-icon">🙏</span>
                      <div>
                        <div className="ci-prayer-label">Prayer / Affirmation</div>
                        <div className="ci-prayer-text">
                          {PRAYERS[Math.floor(Math.random() * PRAYERS.length)]}
                        </div>
                      </div>
                    </div>

                    {/* ✅ PAID CONSULTATION CARD — inserted here in Guidance step */}
                    <ConsultationCard />

                    {/* Mark complete */}
                    <button
                      className={`ci-mark-btn ${dayMarked?"done":""}`}
                      onClick={() => { setDayMarked(true); setTimeout(() => setFinished(true), 800); }}>
                      {dayMarked ? "✓ Day Marked Complete!" : "Mark Day Complete ✓"}
                    </button>

                    <div className="ci-nav" style={{marginTop:"12px"}}>
                      <button className="ci-btn-back" onClick={back}>← Edit</button>
                      <button className="ci-btn-primary" onClick={() => setFinished(true)}>
                        Done for today →
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
