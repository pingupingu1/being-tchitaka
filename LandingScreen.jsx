import React, { useState, useRef, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{margin:0!important;padding:0!important;width:100%;min-height:100vh}
body{font-family:'DM Sans',sans-serif;background:#13120f;-webkit-font-smoothing:antialiased}
@keyframes gspin{to{transform:rotate(360deg)}}
@keyframes blink2{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes gsModalIn{from{transform:scale(.92) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
@keyframes ringPop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes markPop{from{transform:scale(0) rotate(-20deg)}to{transform:scale(1) rotate(0deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(220px) rotate(720deg);opacity:0}}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,.4)}70%{box-shadow:0 0 0 10px rgba(245,166,35,0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

/* ── TOAST ── */
.toast-container{position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{background:#1e1c17;border:1px solid rgba(245,166,35,.35);border-radius:12px;padding:12px 16px;font-size:13px;font-weight:600;color:#f2ede6;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:slideDown .3s ease,fadeIn .3s ease;max-width:320px;pointer-events:all}
.toast-icon{font-size:16px;flex-shrink:0}
.toast-close{margin-left:auto;cursor:pointer;color:#9a9080;font-size:12px;padding:2px 4px}
.toast-close:hover{color:#f2ede6}

/* ── MODAL OVERLAY ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(10px);z-index:9990;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .2s ease}
.modal-box{background:#1e1c17;border:1px solid rgba(255,255,255,.1);border-radius:20px;width:100%;max-width:420px;max-height:85vh;overflow-y:auto;animation:gsModalIn .3s cubic-bezier(.34,1.2,.64,1);padding:24px;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.7)}
.modal-box.light{background:#fff;border-color:rgba(0,0,0,.1)}
.modal-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);cursor:pointer;font-size:12px;color:rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;transition:all .2s}
.modal-close:hover{background:rgba(255,255,255,.18);color:#f2ede6}
.modal-close.light{background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.1);color:#7a7368}
.modal-close.light:hover{background:rgba(0,0,0,.12);color:#1a1814}
.modal-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#f2ede6;margin-bottom:6px}
.modal-title.light{color:#1a1814}
.modal-sub{font-size:13px;color:#9a9080;margin-bottom:20px;line-height:1.6}
.modal-sub.light{color:#7a7368}

/* ── DARK SECTION ── */
.dark-section{background:#13120f;padding:48px 0 56px;width:100%}
.dark-section-inner{max-width:1100px;margin:0 auto;padding:0 24px}
.dark-col-labels{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;padding:0 4px}
.dark-col-label{font-size:11px;font-weight:800;letter-spacing:.16em;color:rgba(255,255,255,.35);text-transform:uppercase;text-align:center}
.dark-phones{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}

/* phone shell */
.phone{background:#1e1c17;border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.5);min-height:580px}
.phone-sb{display:flex;align-items:center;justify-content:space-between;padding:8px 16px 4px;background:#1e1c17}
.phone-sb-time{font-size:10px;font-weight:700;color:rgba(255,255,255,.5)}
.phone-sb-r{display:flex;align-items:center;gap:4px;font-size:8px;color:rgba(255,255,255,.4)}
.phone-sb-batt{width:16px;height:8px;border:1.5px solid rgba(255,255,255,.3);border-radius:2px;position:relative}
.phone-sb-batt::after{content:'';position:absolute;top:1.5px;left:1.5px;bottom:1.5px;width:60%;background:#f5a623;border-radius:1px}
.phone-body{flex:1;padding:8px 14px 14px;display:flex;flex-direction:column;overflow-y:auto;scrollbar-width:none}
.phone-body::-webkit-scrollbar{display:none}
.phone-bnav{display:flex;align-items:center;justify-content:space-around;padding:8px 0 10px;border-top:1px solid rgba(255,255,255,.07);background:#1e1c17;flex-shrink:0}
.phone-nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;opacity:.35;cursor:pointer;transition:opacity .2s;padding:2px 6px}
.phone-nav-item:hover{opacity:.65}
.phone-nav-item.on{opacity:1}
.phone-nav-ico{font-size:16px}
.phone-nav-lbl{font-size:8px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:.02em}
.phone-nav-item.on .phone-nav-lbl{color:#f5a623}

/* dark shared */
.dh-greeting{font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:#f2ede6;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.dh-stats{display:flex;gap:8px;margin-bottom:12px}
.dh-stat{flex:1;background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:10px 12px}
.dh-stat-lbl{font-size:8px;font-weight:700;letter-spacing:.12em;color:#9a9080;text-transform:uppercase;margin-bottom:2px}
.dh-stat-val{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#f5a623;line-height:1}
.dh-stat-unit{font-size:10px;color:#9a9080}
.dh-cta{width:100%;background:linear-gradient(135deg,#f5a623,#e8941a);border:none;border-radius:11px;padding:12px;font-size:13px;font-weight:700;color:#1a1200;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px;transition:all .2s}
.dh-cta:hover{opacity:.9;transform:translateY(-1px)}
.dh-calm{width:100%;background:#252218;border:1px solid rgba(255,255,255,.1);border-radius:11px;padding:11px;font-size:12.5px;font-weight:700;color:#f5a623;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:14px;transition:all .2s}
.dh-calm:hover{opacity:.8;transform:translateY(-1px)}
.dh-shdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.dh-stitle{font-size:12px;font-weight:800;color:#f2ede6}
.dh-task{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.dh-task:last-of-type{border-bottom:none}
.dh-task-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dh-task-lbl{flex:1;font-size:12px;font-weight:600;color:#f2ede6}
.dh-task-chk{width:16px;height:16px;border-radius:50%;border:1.5px solid rgba(255,255,255,.15);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:8px;cursor:pointer;transition:all .2s}
.dh-task-chk.done{background:#f5a623;border-color:#f5a623;color:#1a1200}
.dh-quote{background:linear-gradient(135deg,rgba(245,166,35,.1),rgba(245,166,35,.02));border:1px solid rgba(245,166,35,.2);border-radius:11px;padding:12px;margin-top:12px}
.dh-quote-lbl{font-size:9px;font-weight:700;letter-spacing:.12em;color:#f5a623;text-transform:uppercase;margin-bottom:5px}
.dh-quote-txt{font-size:12px;font-style:italic;color:#f2ede6;font-weight:600}
.dci-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.dci-back{font-size:12px;color:#f5a623;font-weight:700;cursor:pointer;transition:opacity .2s}
.dci-back:hover{opacity:.7}
.dci-prompt{font-size:12px;color:#9a9080;margin-bottom:12px}
.dci-moods{display:flex;justify-content:space-between;gap:4px;margin-bottom:14px}
.dci-mood{flex:1;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:18px;border-radius:9px;border:1.5px solid rgba(255,255,255,.1);background:#252218;cursor:pointer;transition:all .2s}
.dci-mood.sel{border-color:#f5a623;background:rgba(245,166,35,.12);transform:scale(1.08)}
.dci-sitem{margin-bottom:13px}
.dci-srow{display:flex;justify-content:space-between;margin-bottom:5px}
.dci-slbl{font-size:12px;font-weight:700;color:#f2ede6}
.dci-sval{font-size:12px;font-weight:800;color:#f5a623}
.dci-track{width:100%;-webkit-appearance:none;appearance:none;height:4px;border-radius:3px;background:rgba(255,255,255,.1);outline:none;cursor:pointer}
.dci-track::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#f5a623,#e8941a);box-shadow:0 2px 8px rgba(245,166,35,.5);cursor:pointer}
.dci-gen{width:100%;background:linear-gradient(135deg,#f5a623,#e8941a);border:none;border-radius:11px;padding:12px;font-size:13px;font-weight:700;color:#1a1200;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;margin-top:4px;transition:all .2s}
.dci-gen:hover{opacity:.9;transform:translateY(-1px)}
.dgd-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.dgd-back{font-size:12px;color:#f5a623;font-weight:700;cursor:pointer;transition:opacity .2s}
.dgd-back:hover{opacity:.7}
.dgd-title{font-size:13px;font-weight:800;color:#f2ede6}
.dgd-date{font-size:11px;font-weight:700;color:#f5a623;margin-bottom:10px}
.dgd-coach{background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:12px;margin-bottom:10px}
.dgd-clbl{font-size:8.5px;font-weight:700;letter-spacing:.12em;color:#9a9080;text-transform:uppercase;margin-bottom:5px}
.dgd-ctitle{font-size:13px;font-weight:800;color:#f2ede6;margin-bottom:6px}
.dgd-cbody{font-size:11px;color:#9a9080;line-height:1.6}
.dgd-phdr{font-size:11.5px;font-weight:800;color:#f2ede6;margin:8px 0 6px}
.dgd-pitem{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.dgd-pitem:last-of-type{border-bottom:none}
.dgd-pnum{width:19px;height:19px;background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#f5a623;flex-shrink:0}
.dgd-plbl{flex:1;font-size:12px;font-weight:600;color:#f2ede6}
.dgd-ptag{font-size:10px;color:#9a9080;background:rgba(255,255,255,.07);padding:2px 7px;border-radius:20px;border:1px solid rgba(255,255,255,.1)}
.dgd-pchk{width:16px;height:16px;border-radius:50%;border:1.5px solid rgba(255,255,255,.15);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px;transition:all .2s}
.dgd-pchk.done{background:#f5a623;border-color:#f5a623;color:#1a1200}
.dgd-prayer{background:rgba(245,166,35,.06);border:1px solid rgba(245,166,35,.18);border-radius:11px;padding:11px;margin:10px 0}
.dgd-pray-lbl{font-size:8.5px;font-weight:700;letter-spacing:.12em;color:#f5a623;text-transform:uppercase;margin-bottom:5px}
.dgd-pray-txt{font-size:11px;color:#9a9080;line-height:1.6;font-style:italic}
.dgd-mark{width:100%;background:#252218;border:1px solid rgba(245,166,35,.2);border-radius:11px;padding:11px;font-size:12.5px;font-weight:700;color:#f5a623;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
.dgd-mark:hover{background:#2e2a1f}
.dgd-mark.done{background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border-color:transparent}
.dtk-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.dtk-title{font-size:13px;font-weight:800;color:#f2ede6}
.dtk-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
.dtk-btn{background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:12px 10px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;cursor:pointer;transition:all .2s}
.dtk-btn:hover{border-color:rgba(245,166,35,.3);transform:translateY(-1px)}
.dtk-ico{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px}
.dtk-lbl{font-size:10.5px;font-weight:700;color:#f2ede6}
.dtk-prof{background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px}
.dtk-prof-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.dtk-prof-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#c97d0a,#8a5c0a);display:flex;align-items:center;justify-content:center;font-size:19px;color:#fff;border:2px solid rgba(245,166,35,.3);flex-shrink:0}
.dtk-prof-name{font-size:15px;font-weight:800;color:#f2ede6;margin-bottom:3px}
.dtk-prof-streak{font-size:11px;font-weight:700;color:#f5a623}
.dtk-prof-badge{background:linear-gradient(135deg,#f5a623,#d4820a);color:#1a1200;font-size:9px;font-weight:800;border-radius:20px;padding:2px 8px;margin-left:6px}
.dtk-mitem{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer;transition:opacity .17s}
.dtk-mitem:last-child{border-bottom:none}
.dtk-mitem:hover{opacity:.7}
.dtk-mico{font-size:13px}
.dtk-mlbl{flex:1;font-size:12px;font-weight:600;color:#f2ede6}
.dtk-marr{font-size:13px;color:#5a5248}

/* dark calm screen */
.dcalm-circle{width:110px;height:110px;border-radius:50%;background:radial-gradient(circle,rgba(245,166,35,.15),rgba(245,166,35,.02));border:2px solid rgba(245,166,35,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 16px;cursor:pointer;animation:breathe 4s ease-in-out infinite}
.dcalm-phase{font-size:11px;font-weight:700;color:#f5a623;letter-spacing:.1em;text-transform:uppercase}
.dcalm-count{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:#f2ede6}
.dcalm-session{background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 11px;margin-bottom:7px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .2s}
.dcalm-session:hover{border-color:rgba(245,166,35,.25)}
.dcalm-session.active{border-color:#f5a623;background:rgba(245,166,35,.06)}

/* dark profile */
.dprof-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:14px}
.dprof-av{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#c97d0a,#8a5c0a);display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;border:2px solid rgba(245,166,35,.4);margin-bottom:7px}
.dprof-stats{display:flex;gap:6px;margin-bottom:14px}
.dprof-stat{flex:1;background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px;text-align:center}
.dprof-stat-val{font-family:'Playfair Display',serif;font-size:19px;font-weight:900;color:#f5a623;line-height:1}
.dprof-stat-lbl{font-size:8.5px;font-weight:700;color:#9a9080;margin-top:2px}
.dprof-section{background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:4px 12px}
.dprof-item{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer;transition:opacity .17s}
.dprof-item:last-child{border-bottom:none}
.dprof-item:hover{opacity:.7}

/* dark programs */
.dprog-item{background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:11px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.dprog-item:hover{border-color:rgba(245,166,35,.25);transform:translateY(-1px)}
.dprog-badge{font-size:9px;font-weight:700;background:rgba(245,166,35,.15);color:#f5a623;border:1px solid rgba(245,166,35,.25);border-radius:20px;padding:2px 8px}
.dprog-bar{width:100%;height:3px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-top:7px}
.dprog-bar-fill{height:100%;background:linear-gradient(90deg,#f5a623,#e8941a);border-radius:3px}

/* ── LIGHT SECTION ── */
.light-section{background:#f0ede8;padding:48px 0 56px;width:100%}
.light-section-inner{max-width:1100px;margin:0 auto;padding:0 24px}
.light-topbar{display:flex;align-items:center;background:rgba(240,237,232,.97);border:1px solid rgba(0,0,0,.08);border-radius:14px 14px 0 0;padding:0 20px;height:52px}
.light-logo{display:flex;align-items:center;gap:8px}
.light-logo-mark{width:32px;height:32px;background:linear-gradient(135deg,#f5a623,#c97d0a);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px}
.light-logo-name{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#1a1814}
.light-logo-name span{color:#f5a623}
.light-logo-sub{font-size:7.5px;letter-spacing:.18em;color:#7a7368;text-transform:uppercase;font-weight:600;display:block}
.light-nav{display:flex;align-items:center;gap:1px;margin-left:16px}
.light-nav-btn{padding:5px 11px;border-radius:7px;font-size:11.5px;font-weight:600;color:#7a7368;cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif;transition:all .2s}
.light-nav-btn:hover{color:#1a1814;background:rgba(0,0,0,.04)}
.light-nav-btn.active{color:#f5a623;background:rgba(245,166,35,.12)}
.light-right{margin-left:auto;display:flex;align-items:center;gap:6px}
.light-avatar-pill{display:flex;align-items:center;gap:5px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:20px;padding:3px 10px 3px 4px}
.light-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#c97d0a,#8a5c0a);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff}
.light-av-name{font-size:11.5px;font-weight:700;color:#1a1814}
.light-badge{background:linear-gradient(135deg,#f5a623,#d4820a);color:#fff;font-size:8.5px;font-weight:800;border-radius:20px;padding:2px 8px}
.light-icon-btn{width:27px;height:27px;border-radius:6px;border:1px solid rgba(0,0,0,.08);background:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;color:#aaa;cursor:pointer;transition:all .2s}
.light-icon-btn:hover{border-color:rgba(0,0,0,.18);color:#555}
.light-panels{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(0,0,0,.08);border-top:none;border-radius:0 0 14px 14px;overflow:hidden;background:#f0ede8}
.lpanel{border-right:1px solid rgba(0,0,0,.08);background:#f0ede8;display:flex;flex-direction:column;min-height:580px}
.lpanel:last-child{border-right:none}
.lpanel-sb{display:flex;align-items:center;justify-content:space-between;padding:6px 12px 3px;background:#f0ede8}
.lpanel-sb-t{font-size:9px;font-weight:700;color:#b5afa8}
.lpanel-sb-r{display:flex;align-items:center;gap:3px;font-size:7.5px;color:#b5afa8}
.lpanel-sb-batt{width:14px;height:7px;border:1.5px solid #c5bfb8;border-radius:2px;position:relative}
.lpanel-sb-batt::after{content:'';position:absolute;top:1px;left:1px;bottom:1px;width:65%;background:#f5a623;border-radius:1px}
.lpanel-hdr{display:flex;align-items:center;justify-content:space-between;padding:5px 12px 7px}
.lpanel-back{font-size:11px;color:#f5a623;font-weight:700;cursor:pointer;transition:opacity .2s}
.lpanel-back:hover{opacity:.7}
.lpanel-title{font-size:12.5px;font-weight:800;color:#1a1814}
.lpanel-action{font-size:13px;color:#b5afa8;cursor:pointer}
.lpanel-body{padding:4px 12px 14px;flex:1;overflow-y:auto;scrollbar-width:none}
.lpanel-body::-webkit-scrollbar{display:none}
.lpanel-bnav{display:flex;align-items:center;justify-content:space-around;padding:6px 0 8px;border-top:1px solid rgba(0,0,0,.07);background:#fff;flex-shrink:0}
.lpanel-ni{display:flex;flex-direction:column;align-items:center;gap:1px;opacity:.32;cursor:pointer;padding:1px 6px;transition:opacity .2s}
.lpanel-ni:hover{opacity:.6}
.lpanel-ni.on{opacity:1}
.lpanel-ni-ico{font-size:15px}
.lpanel-ni-lbl{font-size:7.5px;font-weight:700;color:#7a7368;letter-spacing:.02em}
.lpanel-ni.on .lpanel-ni-lbl{color:#f5a623}

/* light shared */
.lh-hi{font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#1a1814;margin-bottom:10px;display:flex;align-items:center;gap:5px}
.lh-stats{display:flex;gap:6px;margin-bottom:10px}
.lh-stat{flex:1;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:8px 10px}
.lh-stat-lbl{font-size:7.5px;font-weight:700;letter-spacing:.1em;color:#7a7368;text-transform:uppercase;margin-bottom:2px}
.lh-stat-val{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:#f5a623;line-height:1}
.lh-stat-unit{font-size:9px;color:#7a7368}
.lh-cta{width:100%;background:linear-gradient(135deg,#f5a623,#e8941a);border:none;border-radius:10px;padding:11px;font-size:12.5px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:7px;box-shadow:0 3px 10px rgba(245,166,35,.28);transition:all .2s}
.lh-cta:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(245,166,35,.38)}
.lh-calm{width:100%;background:#1e1c18;border:none;border-radius:10px;padding:10px;font-size:12px;font-weight:700;color:#f5a623;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:12px;transition:all .2s}
.lh-calm:hover{opacity:.85;transform:translateY(-1px)}
.lh-shdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.lh-stitle{font-size:11.5px;font-weight:800;color:#1a1814}
.lh-sdone{font-size:11px;color:#f5a623;font-weight:600;cursor:pointer}
.lh-task{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(0,0,0,.07)}
.lh-task:last-of-type{border-bottom:none}
.lh-task-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.lh-task-lbl{flex:1;font-size:11.5px;font-weight:600;color:#1a1814}
.lh-task-arr{font-size:12px;color:#b5afa8}
.lh-task-chk{width:16px;height:16px;border-radius:50%;border:1.5px solid rgba(0,0,0,.12);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px;transition:all .2s}
.lh-task-chk.done{background:#f5a623;border-color:#f5a623;color:#fff}
.lh-quote{background:linear-gradient(135deg,rgba(245,166,35,.08),rgba(245,166,35,.02));border:1px solid rgba(245,166,35,.18);border-radius:10px;padding:10px;margin-top:10px}
.lh-quote-lbl{font-size:8.5px;font-weight:700;letter-spacing:.12em;color:#f5a623;text-transform:uppercase;margin-bottom:4px}
.lh-quote-txt{font-size:11px;font-style:italic;color:#1a1814;font-weight:600}
.lci-prompt{font-size:11.5px;color:#7a7368;margin-bottom:11px}
.lci-moods{display:flex;justify-content:space-between;gap:4px;margin-bottom:13px}
.lci-mood{flex:1;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:17px;border-radius:8px;border:1.5px solid rgba(0,0,0,.09);background:#fff;cursor:pointer;transition:all .2s}
.lci-mood.sel{border-color:#f5a623;background:rgba(245,166,35,.1);transform:scale(1.08)}
.lci-sitem{margin-bottom:12px}
.lci-srow{display:flex;justify-content:space-between;margin-bottom:4px}
.lci-slbl{font-size:11.5px;font-weight:700;color:#1a1814}
.lci-sval{font-size:11.5px;font-weight:800;color:#f5a623}
.lci-track{width:100%;-webkit-appearance:none;appearance:none;height:4px;border-radius:3px;background:rgba(0,0,0,.08);outline:none;cursor:pointer}
.lci-track::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:linear-gradient(135deg,#f5a623,#e8941a);box-shadow:0 2px 6px rgba(245,166,35,.4);cursor:pointer}
.lci-gen{width:100%;background:linear-gradient(135deg,#f5a623,#e8941a);border:none;border-radius:10px;padding:11px;font-size:12.5px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:5px;margin-top:4px;box-shadow:0 3px 10px rgba(245,166,35,.28);transition:all .2s}
.lci-gen:hover{transform:translateY(-1px)}
.lgd-date{font-size:11px;font-weight:700;color:#f5a623;margin-bottom:9px}
.lgd-coach{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:11px;margin-bottom:9px}
.lgd-clbl{font-size:8px;font-weight:700;letter-spacing:.12em;color:#7a7368;text-transform:uppercase;margin-bottom:5px}
.lgd-ctitle{font-size:12.5px;font-weight:800;color:#1a1814;margin-bottom:5px}
.lgd-cbody{font-size:11px;color:#7a7368;line-height:1.6}
.lgd-phdr{font-size:11px;font-weight:800;color:#1a1814;margin:8px 0 6px}
.lgd-pitem{display:flex;align-items:center;gap:7px;padding:7px 0;border-bottom:1px solid rgba(0,0,0,.07)}
.lgd-pitem:last-of-type{border-bottom:none}
.lgd-pnum{width:18px;height:18px;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.28);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:800;color:#f5a623;flex-shrink:0}
.lgd-plbl{flex:1;font-size:11.5px;font-weight:600;color:#1a1814}
.lgd-ptag{font-size:10px;color:#7a7368;background:#f0ede8;padding:2px 7px;border-radius:20px;border:1px solid rgba(0,0,0,.08)}
.lgd-pchk{width:16px;height:16px;border-radius:50%;border:1.5px solid rgba(0,0,0,.12);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px;transition:all .2s}
.lgd-pchk.done{background:#f5a623;border-color:#f5a623;color:#fff}
.lgd-prayer{background:rgba(245,166,35,.05);border:1px solid rgba(245,166,35,.16);border-radius:10px;padding:10px;margin:9px 0}
.lgd-pray-lbl{font-size:8px;font-weight:700;letter-spacing:.12em;color:#f5a623;text-transform:uppercase;margin-bottom:5px}
.lgd-pray-txt{font-size:11px;color:#7a7368;line-height:1.6;font-style:italic}
.lgd-mark{width:100%;background:#1e1c18;border:none;border-radius:10px;padding:11px;font-size:12px;font-weight:700;color:#f5a623;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
.lgd-mark:hover{opacity:.85}
.lgd-mark.done{background:linear-gradient(135deg,#16a34a,#15803d);color:#fff}
.ltk-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px}
.ltk-btn{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:10px 7px 9px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;transition:all .2s;position:relative}
.ltk-btn:hover{border-color:rgba(245,166,35,.28);transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.06)}
.ltk-ico{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
.ltk-lbl{font-size:9.5px;font-weight:700;color:#1a1814;text-align:center;line-height:1.2}
.ltk-badge{position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:#f5a623;border:1.5px solid #fff}
.ltk-prof{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:12px}
.ltk-prof-top{display:flex;align-items:center;gap:9px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(0,0,0,.07)}
.ltk-prof-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#c97d0a,#8a5c0a);display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff;border:2px solid rgba(245,166,35,.3);flex-shrink:0}
.ltk-prof-name{font-size:14px;font-weight:800;color:#1a1814;margin-bottom:3px}
.ltk-prof-streak{font-size:11px;font-weight:700;color:#f5a623}
.ltk-badge2{background:linear-gradient(135deg,#f5a623,#d4820a);color:#fff;font-size:8.5px;font-weight:800;border-radius:20px;padding:2px 8px;margin-left:5px}
.ltk-mitem{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.07);cursor:pointer;transition:opacity .17s}
.ltk-mitem:last-child{border-bottom:none}
.ltk-mitem:hover{opacity:.65}
.ltk-mico{font-size:13px}
.ltk-mlbl{flex:1;font-size:11.5px;font-weight:600;color:#1a1814}
.ltk-marr{font-size:12px;color:#b5afa8}

/* light calm */
.lcalm-circle{width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(245,166,35,.1),rgba(245,166,35,.01));border:2px solid rgba(245,166,35,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 14px;animation:breathe 4s ease-in-out infinite;cursor:pointer}
.lcalm-session{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:9px;padding:9px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px;margin-bottom:6px}
.lcalm-session:hover{border-color:rgba(245,166,35,.28);transform:translateY(-1px)}
.lcalm-session.active{border-color:#f5a623;background:rgba(245,166,35,.06)}

/* light profile */
.lprof-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:12px}
.lprof-av{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#c97d0a,#8a5c0a);display:flex;align-items:center;justify-content:center;font-size:21px;color:#fff;border:2px solid rgba(245,166,35,.35);margin-bottom:6px}
.lprof-stats{display:flex;gap:6px;margin-bottom:12px}
.lprof-stat{flex:1;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:9px;padding:7px;text-align:center}
.lprof-stat-val{font-family:'Playfair Display',serif;font-size:17px;font-weight:900;color:#f5a623;line-height:1}
.lprof-stat-lbl{font-size:8px;font-weight:700;color:#7a7368;margin-top:2px}
.lprof-section{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:11px;padding:4px 12px}
.lprof-item{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.07);cursor:pointer;transition:opacity .17s}
.lprof-item:last-child{border-bottom:none}
.lprof-item:hover{opacity:.65}

/* light programs */
.lprog-item{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:10px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.lprog-item:hover{border-color:rgba(245,166,35,.25);transform:translateY(-1px)}
.lprog-badge{font-size:9px;font-weight:700;background:rgba(245,166,35,.12);color:#f5a623;border:1px solid rgba(245,166,35,.22);border-radius:20px;padding:2px 8px}
.lprog-bar{width:100%;height:3px;background:rgba(0,0,0,.07);border-radius:3px;overflow:hidden;margin-top:6px}
.lprog-bar-fill{height:100%;background:linear-gradient(90deg,#f5a623,#e8941a);border-radius:3px}

/* ── GROWTH SESSION ENTRY CARDS ── */
.gs-entry-dark{background:linear-gradient(135deg,rgba(245,166,35,.13),rgba(245,166,35,.04));border:1px solid rgba(245,166,35,.3);border-radius:14px;padding:12px 14px;margin-bottom:12px;cursor:pointer;transition:all .22s;display:flex;align-items:center;gap:10px}
.gs-entry-dark:hover{border-color:rgba(245,166,35,.55);transform:translateY(-1px);box-shadow:0 4px 20px rgba(245,166,35,.15)}
.gs-entry-dark-ico{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,rgba(245,166,35,.2),rgba(245,166,35,.08));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;border:1px solid rgba(245,166,35,.25)}
.gs-entry-dark-body{flex:1}
.gs-entry-dark-title{font-size:11.5px;font-weight:800;color:#f2ede6;margin-bottom:2px}
.gs-entry-dark-sub{font-size:9.5px;color:#9a9080}
.gs-entry-dark-price{background:linear-gradient(135deg,#f5a623,#d4820a);color:#1a1200;font-size:10px;font-weight:800;border-radius:20px;padding:3px 10px;flex-shrink:0}
.gs-entry-light{background:linear-gradient(135deg,rgba(245,166,35,.09),rgba(245,166,35,.03));border:1px solid rgba(245,166,35,.25);border-radius:12px;padding:10px 12px;margin-bottom:10px;cursor:pointer;transition:all .22s;display:flex;align-items:center;gap:9px}
.gs-entry-light:hover{border-color:rgba(245,166,35,.5);transform:translateY(-1px);box-shadow:0 3px 14px rgba(245,166,35,.12)}
.gs-entry-light-ico{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,rgba(245,166,35,.18),rgba(245,166,35,.07));display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;border:1px solid rgba(245,166,35,.2)}
.gs-entry-light-body{flex:1}
.gs-entry-light-title{font-size:11px;font-weight:800;color:#1a1814;margin-bottom:1px}
.gs-entry-light-sub{font-size:9px;color:#7a7368}
.gs-entry-light-price{background:linear-gradient(135deg,#f5a623,#d4820a);color:#1a1200;font-size:9px;font-weight:800;border-radius:20px;padding:2px 9px;flex-shrink:0}

/* ── GROWTH SESSION MODAL ── */
.gs-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;animation:fadeIn .2s ease}
.gs-modal{background:#1e1c17;border:1px solid rgba(255,255,255,.1);border-radius:24px;width:100%;max-width:490px;overflow:hidden;position:relative;animation:gsModalIn .3s cubic-bezier(.34,1.2,.64,1);box-shadow:0 24px 80px rgba(0,0,0,.7)}
.gs-modal-scroll{max-height:90vh;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(245,166,35,.2) transparent}
.gs-modal-scroll::-webkit-scrollbar{width:4px}
.gs-modal-scroll::-webkit-scrollbar-thumb{background:rgba(245,166,35,.2);border-radius:4px}
.gs-close-btn{position:absolute;top:18px;right:18px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);cursor:pointer;font-size:13px;color:rgba(255,255,255,.5);z-index:20;display:flex;align-items:center;justify-content:center;transition:all .2s}
.gs-close-btn:hover{background:rgba(255,255,255,.15);color:#f2ede6}

/* stepper */
.gs-prog{padding:24px 56px 0 24px}
.gs-stepper{display:flex;align-items:center;margin-bottom:6px}
.gs-step-node{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;transition:all .35s;flex-shrink:0}
.gs-step-node.active{background:linear-gradient(135deg,#f5a623,#e8941a);color:#1a1200;box-shadow:0 0 20px rgba(245,166,35,.45)}
.gs-step-node.done{background:#16a34a;color:#fff}
.gs-step-node.idle{background:rgba(255,255,255,.07);color:#5a5248;border:1px solid rgba(255,255,255,.1)}
.gs-step-line{flex:1;height:2px;border-radius:2px;background:rgba(255,255,255,.08);transition:background .35s;margin:0 8px}
.gs-step-line.done{background:linear-gradient(90deg,#16a34a,#f5a623)}
.gs-step-labels{display:flex;justify-content:space-between;margin-bottom:24px;padding:0 4px}
.gs-step-lbl{font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;transition:color .3s}
.gs-step-lbl.active{color:#f5a623}
.gs-step-lbl.done{color:#4ade80}
.gs-step-lbl.idle{color:#3a3530}

/* coach row */
.gs-coach-row{display:flex;align-items:center;gap:14px;padding:0 24px 18px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:0}
.gs-coach-avatar{width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,#5a3010,#3d1f08);display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0;border:2px solid rgba(245,166,35,.3)}
.gs-coach-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#f2ede6;margin-bottom:3px}
.gs-coach-role{font-size:11.5px;color:#9a9080;margin-bottom:7px}
.gs-coach-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.gs-stars{font-size:12px;color:#f5a623}
.gs-rating{font-size:11.5px;color:#9a9080;font-weight:500}
.gs-verified{background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.22);border-radius:20px;padding:3px 10px;font-size:9.5px;font-weight:700;color:#4ade80}

/* coach desc */
.gs-coach-desc{padding:16px 24px;font-size:12.5px;color:#7a7368;line-height:1.7;font-style:italic;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:0}

/* section headers */
.gs-section-hdr{font-size:9.5px;font-weight:800;letter-spacing:.18em;color:#5a5248;text-transform:uppercase;padding:16px 24px 10px}

/* date pills */
.gs-dates{display:flex;gap:7px;padding:0 24px 18px;overflow-x:auto}
.gs-dates::-webkit-scrollbar{display:none}
.gs-date-pill{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#252218;cursor:pointer;transition:all .22s;min-width:50px}
.gs-date-pill:not(.gs-date-disabled):hover{border-color:rgba(245,166,35,.35);transform:translateY(-2px)}
.gs-date-pill.selected{background:linear-gradient(135deg,#f5a623,#e8941a);border-color:transparent;box-shadow:0 4px 18px rgba(245,166,35,.38)}
.gs-date-pill.gs-date-disabled{opacity:.3;cursor:not-allowed}
.gs-date-dow{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.gs-date-pill:not(.selected) .gs-date-dow{color:#7a7368}
.gs-date-pill.selected .gs-date-dow{color:rgba(26,18,0,.6)}
.gs-date-num{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;line-height:1}
.gs-date-pill:not(.selected) .gs-date-num{color:#f2ede6}
.gs-date-pill.selected .gs-date-num{color:#1a1200}
.gs-date-mo{font-size:8px;font-weight:700}
.gs-date-pill:not(.selected) .gs-date-mo{color:#5a5248}
.gs-date-pill.selected .gs-date-mo{color:rgba(26,18,0,.5)}

/* time slots */
.gs-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:0 24px 20px}
.gs-slot{padding:12px 8px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#252218;cursor:pointer;text-align:center;transition:all .22s}
.gs-slot:not(.gs-slot-unavail):not(.gs-slot-sel):hover{border-color:rgba(245,166,35,.3);transform:translateY(-1px)}
.gs-slot-sel{background:linear-gradient(135deg,rgba(245,166,35,.15),rgba(245,166,35,.04));border-color:rgba(245,166,35,.55)!important}
.gs-slot-unavail{opacity:.28;cursor:not-allowed}
.gs-slot-time{font-size:12px;font-weight:800;color:#f2ede6}
.gs-slot-sel .gs-slot-time{color:#f5a623}
.gs-slot-period{font-size:9.5px;color:#5a5248;margin-top:3px;font-weight:600}

/* session summary bar */
.gs-session-bar{margin:0 24px 20px;background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px}
.gs-session-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#1a3a7a,#1e4fd4);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:1px solid rgba(100,140,255,.2)}
.gs-session-info{flex:1}
.gs-session-name{font-size:13.5px;font-weight:800;color:#f2ede6;margin-bottom:3px}
.gs-session-meta{font-size:11px;color:#9a9080}
.gs-session-price{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:#f5a623}

/* main CTA */
.gs-cta{margin:0 24px 24px;width:calc(100% - 48px);background:linear-gradient(135deg,#c8912a,#d9a03a);border:none;border-radius:14px;padding:16px;font-size:14px;font-weight:700;color:#1a1100;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 6px 26px rgba(200,145,42,.3);transition:all .22s}
.gs-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 34px rgba(200,145,42,.45)}
.gs-cta:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;background:#3a3530;color:#5a5248}

/* payment step */
.gs-order-card{margin:0 24px 18px;background:#252218;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 16px}
.gs-order-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.06)}
.gs-order-title{font-size:9px;font-weight:800;letter-spacing:.16em;color:#5a5248;text-transform:uppercase}
.gs-order-change{font-size:11.5px;font-weight:700;color:#f5a623;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif}
.gs-order-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.gs-order-row:last-child{border-bottom:none;padding-top:10px;margin-top:4px;border-top:1px solid rgba(255,255,255,.08)}
.gs-order-lbl{font-size:12px;color:#7a7368}
.gs-order-val{font-size:12px;font-weight:700;color:#f2ede6}
.gs-order-total-lbl{font-size:13px;font-weight:800;color:#f2ede6}
.gs-order-total-val{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:#f5a623}
.gs-card-section{padding:0 24px}
.gs-field-lbl{font-size:9px;font-weight:800;letter-spacing:.14em;color:#5a5248;text-transform:uppercase;margin-bottom:7px}
.gs-field-wrap{position:relative;margin-bottom:12px}
.gs-field-input{width:100%;background:#252218;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:13px 14px;font-size:14px;color:#f2ede6;font-family:'DM Sans',sans-serif;outline:none;transition:all .22s;box-sizing:border-box}
.gs-field-input::placeholder{color:#3a3530}
.gs-field-input:focus{border-color:rgba(245,166,35,.5);box-shadow:0 0 0 3px rgba(245,166,35,.08)}
.gs-field-row{display:flex;gap:10px}
.gs-field-row .gs-field-wrap{flex:1}
.gs-card-brand{position:absolute;right:13px;top:50%;transform:translateY(-50%);font-size:18px;pointer-events:none}
.gs-secure-bar{display:flex;align-items:center;gap:9px;margin:14px 24px;background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.18);border-radius:11px;padding:11px 14px}
.gs-secure-txt{font-size:11.5px;color:#4ade80;font-weight:600}
.gs-stripe-row{display:flex;align-items:center;justify-content:center;gap:7px;margin:8px 24px 20px;font-size:10.5px;color:#3a3530;font-weight:600}
.gs-stripe-logo{font-weight:800;color:#635bff}

/* confirm step */
.gs-confirm-wrap{padding:8px 24px 32px;display:flex;flex-direction:column;align-items:center;text-align:center}
.gs-confirm-ring{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,rgba(245,166,35,.15),rgba(245,166,35,.04));border:2px solid rgba(245,166,35,.35);display:flex;align-items:center;justify-content:center;margin-bottom:20px;animation:ringPop .5s cubic-bezier(.34,1.56,.64,1)}
.gs-confirm-mark{font-size:44px;animation:markPop .4s .28s cubic-bezier(.34,1.56,.64,1) both}
.gs-confirm-h1{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:#f2ede6;margin-bottom:8px;animation:fadeUp .4s .4s both}
.gs-confirm-sub{font-size:13px;color:#7a7368;margin-bottom:24px;max-width:300px;line-height:1.65;animation:fadeUp .4s .5s both}
.gs-confirm-details{width:100%;background:#252218;border:1px solid rgba(245,166,35,.18);border-radius:18px;padding:16px;margin-bottom:20px;animation:fadeUp .4s .6s both}
.gs-detail-row{display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.gs-detail-row:last-child{border-bottom:none}
.gs-detail-icon{width:34px;height:34px;border-radius:10px;background:rgba(245,166,35,.1);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.gs-detail-text{text-align:left}
.gs-detail-lbl{font-size:10.5px;color:#7a7368;font-weight:600;margin-bottom:2px}
.gs-detail-val{font-size:13px;font-weight:700;color:#f2ede6}
.gs-cal-btn{width:100%;background:transparent;border:1px solid rgba(245,166,35,.3);border-radius:14px;padding:13px;font-size:13.5px;font-weight:700;color:#f5a623;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:10px;transition:all .22s;animation:fadeUp .4s .7s both}
.gs-cal-btn:hover{background:rgba(245,166,35,.07)}
.gs-cal-btn.added{color:#4ade80;border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.07)}
.gs-done-btn{width:100%;background:linear-gradient(135deg,#f5a623,#e8941a);border:none;border-radius:14px;padding:14px;font-size:13.5px;font-weight:700;color:#1a1200;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 6px 26px rgba(245,166,35,.38);transition:all .22s;animation:fadeUp .4s .8s both;display:flex;align-items:center;justify-content:center;gap:7px}
.gs-done-btn:hover{transform:translateY(-2px)}
.gs-confetti-container{position:absolute;top:0;left:0;right:0;height:200px;overflow:hidden;pointer-events:none;z-index:1}
.gs-confetti-piece{position:absolute;top:-10px;animation:confettiFall 2.2s ease-in forwards}

/* landing page */
.lp-page{min-height:100vh;display:flex;flex-direction:column;background:#13120f}
.lp-topbar{display:flex;align-items:center;padding:16px 48px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(19,18,15,.97);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100}
.lp-logo{display:flex;align-items:center;gap:10px}
.lp-logo-mark{width:44px;height:44px;background:linear-gradient(135deg,#f5a623,#c97d0a);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 3px 14px rgba(245,166,35,.4)}
.lp-logo-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#f2ede6}
.lp-logo-name span{color:#f5a623}
.lp-logo-sub{font-size:8px;letter-spacing:.2em;color:#6b6058;text-transform:uppercase;font-weight:600;display:block}
.lp-hero{flex:1;display:grid;grid-template-columns:1fr 460px;min-height:calc(100vh - 73px)}
.lp-left{padding:64px 56px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(255,255,255,.06)}
.lp-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.25);border-radius:100px;padding:7px 16px;font-size:10px;font-weight:800;letter-spacing:.18em;color:#f5a623;text-transform:uppercase;margin-bottom:28px;width:fit-content}
.lp-dot{width:7px;height:7px;border-radius:50%;background:#f5a623;animation:blink2 2s infinite;flex-shrink:0}
.lp-h1{font-family:'Playfair Display',serif;font-size:clamp(44px,4.5vw,68px);font-weight:900;line-height:1.04;letter-spacing:-.03em;color:#f2ede6;margin-bottom:4px}
.lp-h1i{font-family:'Playfair Display',serif;font-size:clamp(44px,4.5vw,68px);font-weight:700;font-style:italic;line-height:1.04;letter-spacing:-.025em;color:#f5a623;margin-bottom:28px}
.lp-desc{font-size:15px;line-height:1.8;color:#9a9080;max-width:440px;margin-bottom:32px}
.lp-feats{display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.lp-feat{display:flex;align-items:center;gap:13px;padding:12px 16px;background:#1e1c17;border:1px solid rgba(255,255,255,.07);border-radius:12px;transition:all .2s}
.lp-feat:hover{border-color:rgba(245,166,35,.25);transform:translateX(4px)}
.lp-feat-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.lp-feat-lbl{font-size:13.5px;font-weight:600;color:#f2ede6}
.lp-lock{display:flex;align-items:center;gap:12px;background:#1e1c17;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px 16px}
.lp-lock-title{font-size:13px;font-weight:700;color:#f2ede6;margin-bottom:2px}
.lp-lock-sub{font-size:11.5px;color:#9a9080}
.lp-right{display:flex;align-items:center;justify-content:center;padding:48px 40px;background:#0f0e0b}
.lp-card{width:100%;max-width:380px}
.lp-tabs{display:flex;background:#1e1c17;border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:4px;margin-bottom:24px;gap:3px}
.lp-tab-btn{flex:1;padding:10px 8px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;background:transparent;color:#6b6058}
.lp-tab-btn.active{background:linear-gradient(135deg,#c97d0a,#a06008);color:#f2ede6;box-shadow:0 2px 10px rgba(245,166,35,.2)}
.lp-section-lbl{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.lp-section-lbl-line{width:28px;height:2px;background:#f5a623;border-radius:2px}
.lp-section-lbl-txt{font-size:10px;font-weight:800;letter-spacing:.18em;color:#f5a623;text-transform:uppercase}
.lp-ctitle{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:#f2ede6;margin-bottom:4px}
.lp-csub{font-size:13px;color:#9a9080;margin-bottom:22px}
.lp-google{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:#f2ede6;border:none;border-radius:13px;padding:13px;font-size:14px;font-weight:600;color:#1a1200;cursor:pointer;transition:all .22s;font-family:'DM Sans',sans-serif;margin-bottom:16px;min-height:48px;position:relative;overflow:hidden}
.lp-google:hover:not(:disabled){background:#fff;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.4)}
.lp-g-content{display:flex;align-items:center;gap:10px;transition:opacity .15s}
.lp-g-content.hidden{opacity:0}
.lp-g-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transition:opacity .15s}
.lp-g-overlay.show{opacity:1}
.lp-g-spin{width:18px;height:18px;border-radius:50%;border:2.5px solid transparent;border-top-color:#4285F4;border-right-color:#34A853;border-bottom-color:#FBBC05;border-left-color:#EA4335;animation:gspin .8s linear infinite}
.lp-or{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.lp-or::before,.lp-or::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
.lp-or span{font-size:10.5px;font-weight:600;letter-spacing:.12em;color:#4a4540;text-transform:uppercase}
.lp-err{display:flex;align-items:center;gap:7px;background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.25);border-radius:9px;padding:9px 12px;margin-bottom:12px;font-size:12.5px;color:#f87171;font-weight:500}
.lp-field{margin-bottom:12px}
.lp-flabel{font-size:9px;font-weight:800;letter-spacing:.15em;color:#6b6058;text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.lp-fwrap{position:relative}
.lp-feye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:#6b6058;padding:3px}
.lp-input{width:100%!important;background:#1a1814!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:11px!important;padding:13px 14px!important;font-size:14px!important;color:#f2ede6!important;font-family:'DM Sans',sans-serif!important;outline:none!important;transition:all .2s}
.lp-input::placeholder{color:#4a4540}
.lp-input:focus{border-color:rgba(245,166,35,.45)!important;box-shadow:0 0 0 3px rgba(245,166,35,.07)!important}
.lp-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.lp-remember{display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none}
.lp-cb{width:16px;height:16px;background:#f5a623;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#1a1200;flex-shrink:0}
.lp-cb.off{background:transparent;border:1.5px solid rgba(255,255,255,.15)}
.lp-rem{font-size:12.5px;color:#9a9080}
.lp-forgot{font-size:12.5px;font-weight:600;color:#f5a623;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}
.lp-cta-btn{width:100%!important;background:linear-gradient(135deg,#f5a623,#e8941a)!important;border:none!important;border-radius:13px!important;padding:14px!important;font-size:15px!important;font-weight:700!important;color:#1a1200!important;cursor:pointer;font-family:'DM Sans',sans-serif!important;transition:all .22s;margin-bottom:14px!important;box-shadow:0 4px 18px rgba(245,166,35,.35);display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:50px!important}
.lp-cta-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,166,35,.5)}
.lp-cta-btn:disabled{opacity:.7;cursor:not-allowed}
.lp-cspin{width:16px;height:16px;border:2.5px solid rgba(0,0,0,.2);border-top-color:#1a1200;border-radius:50%;animation:gspin .7s linear infinite}
.lp-slink{text-align:center;font-size:12.5px;color:#6b6058;margin-bottom:18px}
.lp-slink a{color:#f5a623;font-weight:700;text-decoration:none}
.lp-trust{display:flex;justify-content:center;gap:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06)}
.lp-trust-item{display:flex;align-items:center;gap:5px;font-size:10.5px;color:#4a4540;font-weight:600}
@media(max-width:900px){
  .dark-phones,.light-panels{grid-template-columns:repeat(2,1fr)}
  .dark-col-labels{grid-template-columns:repeat(2,1fr)}
  .lp-hero{grid-template-columns:1fr}
  .lp-left{border-right:none;border-bottom:1px solid rgba(255,255,255,.06);padding:40px 28px}
  .lp-right{padding:36px 28px}
}
@media(max-width:560px){
  .dark-phones,.light-panels{grid-template-columns:1fr}
  .lp-topbar{padding:14px 24px}
}
`;

/* ─── CONSTANTS ─── */
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const SLOTS = [
  { time:"9:00 AM",  period:"Morning",   off:false },
  { time:"10:30 AM", period:"Morning",   off:true  },
  { time:"12:00 PM", period:"Midday",    off:false },
  { time:"2:00 PM",  period:"Afternoon", off:false },
  { time:"3:30 PM",  period:"Afternoon", off:true  },
  { time:"5:00 PM",  period:"Evening",   off:false },
];
const NAV_ITEMS = [
  {ico:"🏠",lbl:"Home"},{ico:"🌙",lbl:"Calm"},
  {ico:"📱",lbl:"Programs"},{ico:"🛠",lbl:"Toolkit"},{ico:"👤",lbl:"Profile"},
];
const PROGRAMS = [
  {ico:"💪",name:"Focus Fortress",desc:"Build laser focus in 21 days",pct:40,badge:"Active"},
  {ico:"❤️",name:"Relationship Reset",desc:"Improve bonds with those you love",pct:15,badge:"New"},
  {ico:"🧠",name:"Mindset Mastery",desc:"Rewire limiting beliefs",pct:0,badge:""},
  {ico:"🌅",name:"Morning Ritual",desc:"Design your perfect morning routine",pct:70,badge:"Popular"},
];
const CALM_SESSIONS = [
  {ico:"🌬️",name:"Box Breathing",dur:"3 min"},
  {ico:"🌊",name:"Ocean Breath",dur:"5 min"},
  {ico:"🧘",name:"Body Scan",dur:"7 min"},
  {ico:"🌙",name:"Sleep Wind-down",dur:"10 min"},
];
const PROFILE_ITEMS = [
  {ico:"✏️",lbl:"Edit Profile"},
  {ico:"💎",lbl:"Manage Subscription"},
  {ico:"🔔",lbl:"Notifications"},
  {ico:"🔒",lbl:"Privacy & Security"},
  {ico:"❓",lbl:"Help & Support"},
  {ico:"🚪",lbl:"Sign Out"},
];

/* ─── TOAST SYSTEM ─── */
let _toastId = 0;
let _toastSetter = null;

function useToast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _toastSetter = setToasts; return () => { _toastSetter = null; }; }, []);
  const dismiss = (id) => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, dismiss };
}

function showToast(msg, duration = 3000) {
  if (!_toastSetter) return;
  const id = ++_toastId;
  _toastSetter(t => [...t, { id, msg }]);
  setTimeout(() => {
    _toastSetter(t => t.filter(x => x.id !== id));
  }, duration);
}

function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div className="toast" key={t.id}>
          <span className="toast-icon">✦</span>
          <span style={{flex:1}}>{t.msg}</span>
          <span className="toast-close" onClick={() => dismiss(t.id)}>✕</span>
        </div>
      ))}
    </div>
  );
}

/* ─── GOOGLE ICON ─── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── STATUS BARS ─── */
const DSB = () => (
  <div className="phone-sb">
    <span className="phone-sb-time">9:41</span>
    <div className="phone-sb-r"><span>▲▲▲</span><span>WiFi</span><div className="phone-sb-batt"/></div>
  </div>
);
const LSB = () => (
  <div className="lpanel-sb">
    <span className="lpanel-sb-t">9:41</span>
    <div className="lpanel-sb-r"><span>▲▲▲</span><span>WiFi</span><div className="lpanel-sb-batt"/></div>
  </div>
);

/* ─── CONFETTI ─── */
function Confetti() {
  const pieces = Array.from({length:22}, (_,i) => ({
    left: `${Math.random()*100}%`,
    delay: `${Math.random()*.9}s`,
    color: ['#f5a623','#fbbf24','#16a34a','#60a5fa','#f472b6','#a78bfa'][i%6],
    size: Math.random()*6+5,
  }));
  return (
    <div className="gs-confetti-container">
      {pieces.map((p,i) => (
        <div key={i} className="gs-confetti-piece" style={{
          left:p.left, animationDelay:p.delay, background:p.color,
          width:p.size, height:p.size, borderRadius:i%3===0?'50%':'2px',
        }}/>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   GROWTH SESSION MODAL
   ══════════════════════════════════════════════════ */
function GrowthSessionModal({ onClose }) {
  const [step,    setStep]    = useState(1);
  const [selDate, setSelDate] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [cardNum, setCardNum] = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvc,     setCvc]     = useState("");
  const [name,    setName]    = useState("");
  const [paying,  setPaying]  = useState(false);
  const [calAdded,setCalAdded]= useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = 0; }, [step]);

  const today = new Date();
  const dates = Array.from({length:7}, (_,i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      dow: DAYS[d.getDay()],
      num: d.getDate(),
      mo:  d.toLocaleString('en',{month:'short'}),
      disabled: i === 6,
    };
  });

  const fmtCard = v => v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ');
  const fmtExp  = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>2?d.slice(0,2)+'/'+d.slice(2):d; };

  const canStep2 = selDate !== null && selSlot !== null;
  const canPay   = cardNum.replace(/\s/g,'').length===16 && expiry.length===5 && cvc.length>=3 && name.trim().length>0;

  const handlePay = () => {
    if(!canPay) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setStep(3); }, 2200);
  };

  const selDateObj = selDate !== null ? dates[selDate] : null;
  const selSlotObj = selSlot !== null ? SLOTS[selSlot] : null;
  const stepState  = i => step > i+1 ? 'done' : step === i+1 ? 'active' : 'idle';

  const ctaLabel = () => {
    if(!canStep2) {
      if(selDate===null && selSlot===null) return 'Select a date & time to continue';
      if(selDate===null) return '⬆ Please select a date first';
      return 'Now pick a time slot';
    }
    return `Continue — ${selDateObj.dow} ${selDateObj.num} ${selDateObj.mo}, ${selSlotObj.time} →`;
  };

  return (
    <div className="gs-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="gs-modal">
        {step===3 && <Confetti/>}
        <button className="gs-close-btn" onClick={onClose}>✕</button>

        <div className="gs-modal-scroll" ref={scrollRef}>
          {/* STEPPER */}
          <div className="gs-prog">
            <div className="gs-stepper">
              {['Select Time','Payment','Confirmed'].map((lbl,i) => (
                <React.Fragment key={lbl}>
                  <div className={`gs-step-node ${stepState(i)}`}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  {i < 2 && <div className={`gs-step-line${step>i+1?' done':''}`}/>}
                </React.Fragment>
              ))}
            </div>
            <div className="gs-step-labels">
              {['Select Time','Payment','Confirmed'].map((lbl,i) => (
                <span key={lbl} className={`gs-step-lbl ${stepState(i)}`}>{lbl}</span>
              ))}
            </div>
          </div>

          {/* STEP 1 — SELECT TIME */}
          {step===1 && <>
            <div className="gs-coach-row">
              <div className="gs-coach-avatar">🧑🏾‍💼</div>
              <div>
                <div className="gs-coach-name">Rodrigue</div>
                <div className="gs-coach-role">Certified Growth Coach · 5+ yrs experience</div>
                <div className="gs-coach-meta">
                  <span className="gs-stars">★★★★★</span>
                  <span className="gs-rating">4.9 · 127 sessions</span>
                  <span className="gs-verified">✓ Verified</span>
                </div>
              </div>
            </div>
            <div className="gs-coach-desc">
              "Need deeper guidance? Book a private 1-on-1 coaching session and get a personalized breakthrough plan — tailored to exactly where you are right now."
            </div>
            <div className="gs-section-hdr">Choose a Date</div>
            <div className="gs-dates">
              {dates.map((d,i) => (
                <div
                  key={i}
                  className={`gs-date-pill${d.disabled?' gs-date-disabled':''}${selDate===i?' selected':''}`}
                  onClick={() => { if(!d.disabled){ setSelDate(i); } }}
                >
                  <span className="gs-date-dow">{d.dow}</span>
                  <span className="gs-date-num">{d.num}</span>
                  <span className="gs-date-mo">{d.mo}</span>
                </div>
              ))}
            </div>
            <div className="gs-section-hdr">Choose a Time</div>
            <div className="gs-slots">
              {SLOTS.map((s,i) => (
                <div
                  key={i}
                  className={`gs-slot${s.off?' gs-slot-unavail':selSlot===i?' gs-slot-sel':''}`}
                  onClick={() => !s.off && setSelSlot(i)}
                >
                  <div className="gs-slot-time">{s.time}</div>
                  <div className="gs-slot-period">{s.period}</div>
                </div>
              ))}
            </div>
            <div className="gs-session-bar">
              <div className="gs-session-icon">💎</div>
              <div className="gs-session-info">
                <div className="gs-session-name">Growth Session</div>
                <div className="gs-session-meta">60 min · Video call · With Rodrigue</div>
              </div>
              <div className="gs-session-price">$99</div>
            </div>
            <button className="gs-cta" disabled={!canStep2} onClick={() => setStep(2)}>
              {ctaLabel()}
            </button>
          </>}

          {/* STEP 2 — PAYMENT */}
          {step===2 && <>
            <div className="gs-order-card">
              <div className="gs-order-hdr">
                <span className="gs-order-title">Order Summary</span>
                <button className="gs-order-change" onClick={() => setStep(1)}>Change</button>
              </div>
              {[
                {lbl:'Session', val:'Growth Session — 60 min'},
                {lbl:'Date',    val:`${selDateObj?.dow}, ${selDateObj?.num} ${selDateObj?.mo}`},
                {lbl:'Time',    val:selSlotObj?.time},
                {lbl:'Coach',   val:'Rodrigue'},
              ].map(r => (
                <div className="gs-order-row" key={r.lbl}>
                  <span className="gs-order-lbl">{r.lbl}</span>
                  <span className="gs-order-val">{r.val}</span>
                </div>
              ))}
              <div className="gs-order-row">
                <span className="gs-order-total-lbl">Total</span>
                <span className="gs-order-total-val">$99</span>
              </div>
            </div>
            <div className="gs-card-section">
              <div className="gs-field-lbl">💳 Card Number</div>
              <div className="gs-field-wrap">
                <input className="gs-field-input" placeholder="1234  5678  9012  3456"
                  value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))}
                  maxLength={19} style={{paddingRight:46}}/>
                <span className="gs-card-brand">💳</span>
              </div>
              <div className="gs-field-lbl">👤 Cardholder Name</div>
              <div className="gs-field-wrap">
                <input className="gs-field-input" placeholder="Full name on card"
                  value={name} onChange={e => setName(e.target.value)}/>
              </div>
              <div className="gs-field-row">
                <div className="gs-field-wrap">
                  <div className="gs-field-lbl">📅 Expiry</div>
                  <input className="gs-field-input" placeholder="MM / YY"
                    value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} maxLength={5}/>
                </div>
                <div className="gs-field-wrap">
                  <div className="gs-field-lbl">🔒 CVC</div>
                  <input className="gs-field-input" placeholder="•••"
                    value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))} maxLength={4}/>
                </div>
              </div>
            </div>
            <div className="gs-secure-bar">
              <span style={{fontSize:15}}>🔐</span>
              <span className="gs-secure-txt">256-bit SSL encrypted · Your card info is never stored</span>
            </div>
            <button className="gs-cta" disabled={!canPay || paying} onClick={handlePay}>
              {paying
                ? <><span style={{width:16,height:16,border:'2.5px solid rgba(0,0,0,.2)',borderTopColor:'#1a1200',borderRadius:'50%',animation:'gspin .7s linear infinite',display:'inline-block'}}/><span>Processing…</span></>
                : '🔐  Pay $99 Securely →'}
            </button>
            <div className="gs-stripe-row">
              <span>Powered by</span>
              <span className="gs-stripe-logo">stripe</span>
              <span>·</span>
              <span>PCI DSS Level 1</span>
            </div>
          </>}

          {/* STEP 3 — CONFIRMED */}
          {step===3 && (
            <div className="gs-confirm-wrap">
              <div className="gs-confirm-ring">
                <span className="gs-confirm-mark">✦</span>
              </div>
              <div className="gs-confirm-h1">You're Booked!</div>
              <div className="gs-confirm-sub">
                Your growth session with Rodrigue is confirmed. A video call link has been sent to your email.
              </div>
              <div className="gs-confirm-details">
                {[
                  {ico:'📅', lbl:'Date',         val:`${selDateObj?.dow}, ${selDateObj?.num} ${selDateObj?.mo}`},
                  {ico:'🕐', lbl:'Time',         val:`${selSlotObj?.time} · 60 minutes`},
                  {ico:'🧑🏾‍💼',lbl:'Coach',       val:'Rodrigue · Certified Growth Coach'},
                  {ico:'📹', lbl:'Format',        val:'Video call (link via email)'},
                  {ico:'💎', lbl:'Amount paid',   val:'$99.00 · Confirmation sent'},
                ].map(r => (
                  <div className="gs-detail-row" key={r.lbl}>
                    <div className="gs-detail-icon">{r.ico}</div>
                    <div className="gs-detail-text">
                      <div className="gs-detail-lbl">{r.lbl}</div>
                      <div className="gs-detail-val">{r.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className={`gs-cal-btn${calAdded?' added':''}`} onClick={() => { setCalAdded(true); showToast('📅 Session added to your calendar!'); }}>
                {calAdded ? '✓ Added to Calendar' : '📅 Add to Calendar'}
              </button>
              <button className="gs-done-btn" onClick={onClose}>✦ Back to App</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SHARED SCREEN COMPONENTS ─── */

function ScreenHome({ dark, name, tasks, setTasks, onCheckin, onCalm, onGuidance, onBook, onNotif }) {
  const toggle = i => setTasks(t => t.map((x,j) => j===i ? {...x,done:!x.done} : x));
  if (dark) return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',marginBottom:6}}>
        <span style={{fontSize:16,color:'rgba(255,255,255,.4)',cursor:'pointer',transition:'color .2s'}}
          onClick={onNotif}
          onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.8)'}
          onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.4)'}>🔔</span>
      </div>
      <div className="dh-greeting">Hello, {name} 🔥</div>
      <div className="dh-stats">
        <div className="dh-stat" style={{cursor:'pointer'}} onClick={()=>showToast('🔥 You are on a 5-day streak! Keep going!')}><div className="dh-stat-lbl">STREAK</div><div className="dh-stat-val">5</div><div className="dh-stat-unit">days</div></div>
        <div className="dh-stat" style={{cursor:'pointer'}} onClick={()=>showToast('⭐ 72 pts today! Complete more tasks to earn more.')}><div className="dh-stat-lbl">SCORE</div><div className="dh-stat-val">72</div><div className="dh-stat-unit">pts today</div></div>
      </div>
      <button className="dh-cta" onClick={onCheckin}>Start Check-in →</button>
      <button className="dh-calm" onClick={onCalm}>🌙 Calm Now (3 min)</button>
      <div className="dh-shdr">
        <span className="dh-stitle">Today's Plan</span>
        <span style={{fontSize:14,color:'#5a5248',letterSpacing:2,cursor:'pointer'}} onClick={onGuidance}>···</span>
      </div>
      {tasks.map((t,i) => (
        <div className="dh-task" key={t.label}>
          <div className="dh-task-dot" style={{background:t.color}}/>
          <span className="dh-task-lbl" style={{textDecoration:t.done?'line-through':'none',opacity:t.done?.6:1}}>{t.label}</span>
          <span style={{fontSize:13,color:'#5a5248',cursor:'pointer'}} onClick={onGuidance}>›</span>
          <div className={`dh-task-chk${t.done?' done':''}`} onClick={()=>{toggle(i);if(!t.done)showToast(`✅ "${t.label}" marked done!`);}}>{t.done?'✓':''}</div>
        </div>
      ))}
      <div className="dh-quote" style={{cursor:'pointer'}} onClick={()=>showToast('💡 Discipline is the bridge between goals and achievement.')}><div className="dh-quote-lbl">Daily Quote</div><div className="dh-quote-txt">Discipline &gt; Motivation</div></div>
      <div className="gs-entry-dark" style={{marginTop:12}} onClick={onBook}>
        <div className="gs-entry-dark-ico">💎</div>
        <div className="gs-entry-dark-body">
          <div className="gs-entry-dark-title">Growth Session</div>
          <div className="gs-entry-dark-sub">1-on-1 with Rodrigue</div>
        </div>
        <span className="gs-entry-dark-price">$99</span>
      </div>
    </>
  );
  return (
    <>
      <div className="lh-hi">Hello, {name} 🔥</div>
      <div className="lh-stats">
        <div className="lh-stat" style={{cursor:'pointer'}} onClick={()=>showToast('🔥 5-day streak! You are unstoppable!')}><div className="lh-stat-lbl">STREAK</div><div className="lh-stat-val">5</div><div className="lh-stat-unit">days</div></div>
        <div className="lh-stat" style={{cursor:'pointer'}} onClick={()=>showToast('⭐ 72 pts today — keep completing tasks!')}><div className="lh-stat-lbl">SCORE</div><div className="lh-stat-val">72</div><div className="lh-stat-unit">pts today</div></div>
      </div>
      <button className="lh-cta" onClick={onCheckin}>Start Check-in →</button>
      <button className="lh-calm" onClick={onCalm}>🌙 Calm Now (3 min)</button>
      <div className="lh-shdr">
        <span className="lh-stitle">Today's Plan</span>
        <span className="lh-sdone" onClick={onGuidance}>Done</span>
      </div>
      {tasks.map((t,i) => (
        <div className="lh-task" key={t.label}>
          <div className="lh-task-dot" style={{background:t.color}}/>
          <span className="lh-task-lbl" style={{textDecoration:t.done?'line-through':'none',opacity:t.done?.6:1}}>{t.label}</span>
          <span className="lh-task-arr" style={{cursor:'pointer'}} onClick={onGuidance}>›</span>
          <div className={`lh-task-chk${t.done?' done':''}`} onClick={()=>{toggle(i);if(!t.done)showToast(`✅ "${t.label}" marked done!`);}}>{t.done?'✓':''}</div>
        </div>
      ))}
      <div className="lh-quote" style={{cursor:'pointer'}} onClick={()=>showToast('💡 Tap to share this quote with someone who needs it!')}><div className="lh-quote-lbl">Daily Quote</div><div className="lh-quote-txt">Discipline &gt; Motivation</div></div>
      <div className="gs-entry-light" style={{marginTop:10}} onClick={onBook}>
        <div className="gs-entry-light-ico">💎</div>
        <div className="gs-entry-light-body">
          <div className="gs-entry-light-title">Growth Session</div>
          <div className="gs-entry-light-sub">Book with Rodrigue</div>
        </div>
        <span className="gs-entry-light-price">$99</span>
      </div>
    </>
  );
}

function ScreenCheckin({ dark, mood, setMood, vals, setVals, onGenerate, onBack }) {
  const set = (k,v) => setVals(s => ({...s,[k]:v}));
  const moodLabels = ['Struggling','Meh','Okay','Good','Great'];
  if (dark) return (
    <>
      <div className="dci-hdr">
        <span className="dci-back" onClick={onBack}>‹ Daily Check-in</span>
        <span style={{fontSize:16,color:'#5a5248',cursor:'pointer'}} onClick={onBack}>×</span>
      </div>
      <p className="dci-prompt">How are you feeling today?</p>
      <div className="dci-moods">
        {['😞','😕','😐','🙂','😄'].map((m,i) => <div key={m} className={`dci-mood${mood===i?' sel':''}`} onClick={()=>{setMood(i);showToast(`Feeling ${moodLabels[i]} today — noted! ✦`);}}>{m}</div>)}
      </div>
      {Object.entries(vals).map(([k,v]) => (
        <div className="dci-sitem" key={k}>
          <div className="dci-srow"><span className="dci-slbl">{k}</span><span className="dci-sval">{v}/5</span></div>
          <input type="range" min={1} max={5} value={v} className="dci-track" onChange={e=>set(k,+e.target.value)}/>
        </div>
      ))}
      <button className="dci-gen" onClick={onGenerate}>Generate Guidance →</button>
    </>
  );
  return (
    <>
      <p className="lci-prompt">How are you feeling today?</p>
      <div className="lci-moods">
        {['😞','😕','😐','🙂','😄'].map((m,i) => <div key={m} className={`lci-mood${mood===i?' sel':''}`} onClick={()=>{setMood(i);showToast(`Feeling ${moodLabels[i]} today — noted! ✦`);}}>{m}</div>)}
      </div>
      {Object.entries(vals).map(([k,v]) => (
        <div className="lci-sitem" key={k}>
          <div className="lci-srow"><span className="lci-slbl">{k}</span><span className="lci-sval">{v}/5</span></div>
          <input type="range" min={1} max={5} value={v} className="lci-track" onChange={e=>set(k,+e.target.value)}/>
        </div>
      ))}
      <button className="lci-gen" onClick={onGenerate}>Generate Guidance →</button>
    </>
  );
}

function ScreenGuidance({ dark, tasks, setTasks, markedDone, setMarkedDone, onBack }) {
  const toggle = i => setTasks(t => t.map((x,j) => j===i ? {...x,done:!x.done} : x));
  const today = new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  if (dark) return (
    <>
      <div className="dgd-hdr"><span className="dgd-back" onClick={onBack}>‹ Back</span><span className="dgd-title">Today's Guidance</span><span style={{width:32}}/></div>
      <div className="dgd-date">📅 {today}</div>
      <div className="dgd-coach">
        <div className="dgd-clbl">🧠 COACH MESSAGE</div>
        <div className="dgd-ctitle">Stay calm & take one step at a time.</div>
        <div className="dgd-cbody">Your sleep and stress levels have been a challenge, but today you have a fresh start. Take a deep breath and focus on one thing at a time. You've got this.</div>
      </div>
      <div className="dgd-phdr">📋 Today's Plan</div>
      {tasks.map((t,i) => (
        <div className="dgd-pitem" key={t.label}>
          <div className="dgd-pnum">{i+1}</div>
          <span className="dgd-plbl">{t.label}</span>
          {i===0&&<span className="dgd-ptag">5 min</span>}
          {i===2&&<span className="dgd-ptag">2 min</span>}
          <div className={`dgd-pchk${t.done?' done':''}`} onClick={()=>{toggle(i);if(!t.done)showToast(`✅ Task ${i+1} complete!`);}}>{t.done?'✓':''}</div>
        </div>
      ))}
      <div className="dgd-prayer" style={{cursor:'pointer'}} onClick={()=>showToast('🙏 Prayer noted. Stay grounded today.')}><div className="dgd-pray-lbl">🙏 PRAYER/AFFIRMATION</div><div className="dgd-pray-txt">Guide my thoughts and calm my heart. Help me act from a place of peace and grace today. Amen.</div></div>
      <button className={`dgd-mark${markedDone?' done':''}`} onClick={()=>{setMarkedDone(!markedDone);if(!markedDone)showToast('🎉 Day marked complete! Amazing work!');}}>
        {markedDone?'✓ Day Complete!':'Mark Day Complete ✓'}
      </button>
    </>
  );
  return (
    <>
      <div className="lpanel-hdr" style={{padding:'0 0 7px'}}>
        <span className="lpanel-back" onClick={onBack}>‹ Back</span>
        <span className="lpanel-title">Today's Guidance</span>
        <span style={{width:28}}/>
      </div>
      <div className="lgd-date">📅 {today}</div>
      <div className="lgd-coach">
        <div className="lgd-clbl">🧠 Coach Message</div>
        <div className="lgd-ctitle">Stay calm & take one step at a time.</div>
        <div className="lgd-cbody">Your sleep and stress levels have been a challenge, but today you have a fresh start. Take a deep breath and focus on one thing at a time.</div>
      </div>
      <div className="lgd-phdr">📋 Today's Plan</div>
      {tasks.map((t,i) => (
        <div className="lgd-pitem" key={t.label}>
          <div className="lgd-pnum">{i+1}</div>
          <span className="lgd-plbl">{t.label}</span>
          {i===0&&<span className="lgd-ptag">5 min</span>}
          {i===2&&<span className="lgd-ptag">2 min</span>}
          <div className={`lgd-pchk${t.done?' done':''}`} onClick={()=>{toggle(i);if(!t.done)showToast(`✅ Task ${i+1} complete!`);}}>{t.done?'✓':''}</div>
        </div>
      ))}
      <div className="lgd-prayer" style={{cursor:'pointer'}} onClick={()=>showToast('🙏 Prayer noted. Stay grounded today.')}><div className="lgd-pray-lbl">🙏 Prayer/Affirmation</div><div className="lgd-pray-txt">Guide my thoughts and calm my heart. Help me act from a place of peace and grace today. Amen.</div></div>
      <button className={`lgd-mark${markedDone?' done':''}`} onClick={()=>{setMarkedDone(!markedDone);if(!markedDone)showToast('🎉 Day marked complete! Amazing work!');}}>
        {markedDone?'✓ Day Complete!':'Mark Day Complete ✓'}
      </button>
    </>
  );
}

function ScreenCalm({ dark, onBack }) {
  const [active,   setActive]   = useState(0);
  const [running,  setRunning]  = useState(false);
  const [phase,    setPhase]    = useState('INHALE');
  const [count,    setCount]    = useState(4);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const startStop = () => {
    if(running) {
      clearInterval(timerRef.current); setRunning(false); setPhase('INHALE'); setCount(4); setProgress(0);
      showToast('⏸ Breathing session paused.');
    } else {
      setRunning(true);
      showToast('🌬️ Starting breathing session…');
      const phases=['INHALE','HOLD','EXHALE','HOLD'], durs=[4,4,4,4];
      let pi=0, rem=durs[0], total=0;
      timerRef.current = setInterval(() => {
        rem--; total++; setCount(rem); setProgress(Math.min(100,(total/32)*100));
        if(rem<=0){ pi=(pi+1)%4; rem=durs[pi]; setPhase(phases[pi]); setCount(rem); }
        if(total>=32){ clearInterval(timerRef.current); setRunning(false); setPhase('DONE'); setProgress(100); showToast('✨ Session complete! Great work.'); }
      }, 1000);
    }
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  const selectSession = (i) => {
    setActive(i);
    clearInterval(timerRef.current);
    setRunning(false);setPhase('INHALE');setCount(4);setProgress(0);
    showToast(`🌬️ Selected: ${CALM_SESSIONS[i].name} (${CALM_SESSIONS[i].dur})`);
  };

  if (dark) return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <span style={{fontSize:12,color:'#f5a623',fontWeight:700,cursor:'pointer'}} onClick={()=>{clearInterval(timerRef.current);onBack();}}>‹ Back</span>
        <span style={{fontSize:13,fontWeight:800,color:'#f2ede6'}}>Calm</span>
        <span style={{width:32}}/>
      </div>
      <div className="dcalm-circle" onClick={startStop} style={{border:`2px solid ${running?'#f5a623':'rgba(245,166,35,.3)'}`,boxShadow:running?'0 0 28px rgba(245,166,35,.35)':'none'}}>
        <span className="dcalm-phase">{running?phase:phase==='DONE'?'DONE':'TAP'}</span>
        <span className="dcalm-count">{running?count:phase==='DONE'?'✓':'▶'}</span>
      </div>
      <div style={{width:'100%',height:4,background:'rgba(255,255,255,.08)',borderRadius:3,overflow:'hidden',marginBottom:10}}>
        <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#f5a623,#e8941a)',borderRadius:3,transition:'width .5s'}}/>
      </div>
      <p style={{fontSize:11.5,color:'#9a9080',textAlign:'center',marginBottom:12,lineHeight:1.6}}>{running?`${phase} slowly…`:phase==='DONE'?'Session complete! 🎉':'Tap the circle to begin'}</p>
      {CALM_SESSIONS.map((s,i) => (
        <div key={s.name} className={`dcalm-session${active===i?' active':''}`} onClick={()=>selectSession(i)}>
          <span style={{fontSize:18}}>{s.ico}</span>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:'#f2ede6'}}>{s.name}</div><div style={{fontSize:9.5,color:'#9a9080'}}>{s.dur}</div></div>
          {active===i&&<span style={{fontSize:10,color:'#f5a623',fontWeight:700}}>▶</span>}
        </div>
      ))}
    </>
  );
  return (
    <>
      <div className="lpanel-hdr" style={{padding:'0 0 7px'}}>
        <span className="lpanel-back" onClick={onBack}>‹ Back</span>
        <span className="lpanel-title">Calm</span>
        <span style={{width:28}}/>
      </div>
      <div className="lcalm-circle" onClick={startStop} style={{border:`2px solid ${running?'#f5a623':'rgba(245,166,35,.25)'}`,boxShadow:running?'0 0 20px rgba(245,166,35,.2)':'none'}}>
        <span style={{fontSize:10,fontWeight:700,color:'#f5a623',letterSpacing:'.1em'}}>{running?phase:phase==='DONE'?'DONE':'TAP'}</span>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:'#1a1814'}}>{running?count:phase==='DONE'?'✓':'▶'}</span>
      </div>
      <div style={{width:'100%',height:3,background:'rgba(0,0,0,.08)',borderRadius:3,overflow:'hidden',marginBottom:10}}>
        <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#f5a623,#e8941a)',borderRadius:3,transition:'width .5s'}}/>
      </div>
      <p style={{fontSize:11,color:'#7a7368',textAlign:'center',marginBottom:10,lineHeight:1.6}}>{running?`${phase} slowly…`:phase==='DONE'?'Session complete! 🎉':'Tap the circle to begin'}</p>
      {CALM_SESSIONS.map((s,i) => (
        <div key={s.name} className={`lcalm-session${active===i?' active':''}`} onClick={()=>selectSession(i)}>
          <span style={{fontSize:16}}>{s.ico}</span>
          <div style={{flex:1}}><div style={{fontSize:10.5,fontWeight:700,color:'#1a1814'}}>{s.name}</div><div style={{fontSize:9,color:'#7a7368'}}>{s.dur}</div></div>
          {active===i&&<span style={{fontSize:9,color:'#f5a623',fontWeight:700}}>▶</span>}
        </div>
      ))}
    </>
  );
}

function ScreenPrograms({ dark, onBack, onBook }) {
  const [expanded, setExpanded] = useState(null);
  const [started, setStarted] = useState({});
  const toggle = i => setExpanded(expanded===i ? null : i);
  const startProgram = (p, i) => {
    setStarted(s => ({...s, [i]:true}));
    showToast(`🚀 "${p.name}" program ${p.pct>0?'resumed':'started'}! Let's go!`);
  };
  if (dark) return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <span style={{fontSize:12,color:'#f5a623',fontWeight:700,cursor:'pointer'}} onClick={onBack}>‹ Back</span>
        <span style={{fontSize:13,fontWeight:800,color:'#f2ede6'}}>Programs</span>
        <span style={{width:32}}/>
      </div>
      {PROGRAMS.map((p,i) => (
        <div key={p.name} className="dprog-item" onClick={()=>toggle(i)}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
            <span style={{fontSize:20}}>{p.ico}</span>
            {p.badge&&<span className="dprog-badge">{p.badge}</span>}
          </div>
          <div style={{fontSize:12,fontWeight:800,color:'#f2ede6',marginBottom:3}}>{p.name}</div>
          <div style={{fontSize:10.5,color:'#9a9080'}}>{p.desc}</div>
          <div className="dprog-bar"><div className="dprog-bar-fill" style={{width:`${started[i]?Math.min(p.pct+5,100):p.pct}%`}}/></div>
          {expanded===i&&<div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,.07)'}}>
            <div style={{fontSize:10.5,color:'#f5a623',fontWeight:700,marginBottom:4}}>Progress: {started[i]?Math.min(p.pct+5,100):p.pct}%</div>
            <button style={{width:'100%',background:'linear-gradient(135deg,#f5a623,#e8941a)',border:'none',borderRadius:8,padding:'9px',fontSize:11.5,fontWeight:700,color:'#1a1200',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",marginBottom:6}}
              onClick={e=>{e.stopPropagation();startProgram(p,i);}}>
              {p.pct>0?'Continue Program →':'Start Program →'}
            </button>
            <button style={{width:'100%',background:'#252218',border:'1px solid rgba(245,166,35,.2)',borderRadius:8,padding:'8px',fontSize:11,fontWeight:700,color:'#f5a623',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}
              onClick={e=>{e.stopPropagation();showToast('📤 Program details shared!');}}>
              Share Program
            </button>
          </div>}
        </div>
      ))}
      <div className="gs-entry-dark" onClick={onBook} style={{marginTop:4}}>
        <div className="gs-entry-dark-ico">💎</div>
        <div className="gs-entry-dark-body"><div className="gs-entry-dark-title">Get Coached 1-on-1</div><div className="gs-entry-dark-sub">Accelerate your progress with Rodrigue</div></div>
        <span className="gs-entry-dark-price">$99</span>
      </div>
    </>
  );
  return (
    <>
      <div className="lpanel-hdr" style={{padding:'0 0 7px'}}>
        <span className="lpanel-back" onClick={onBack}>‹ Back</span>
        <span className="lpanel-title">Programs</span>
        <span style={{width:28}}/>
      </div>
      {PROGRAMS.map((p,i) => (
        <div key={p.name} className="lprog-item" onClick={()=>toggle(i)}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
            <span style={{fontSize:18}}>{p.ico}</span>
            {p.badge&&<span className="lprog-badge">{p.badge}</span>}
          </div>
          <div style={{fontSize:11.5,fontWeight:800,color:'#1a1814',marginBottom:2}}>{p.name}</div>
          <div style={{fontSize:10,color:'#7a7368'}}>{p.desc}</div>
          <div className="lprog-bar"><div className="lprog-bar-fill" style={{width:`${started[i]?Math.min(p.pct+5,100):p.pct}%`}}/></div>
          {expanded===i&&<div style={{marginTop:9,paddingTop:9,borderTop:'1px solid rgba(0,0,0,.07)'}}>
            <div style={{fontSize:10,color:'#f5a623',fontWeight:700,marginBottom:4}}>Progress: {started[i]?Math.min(p.pct+5,100):p.pct}%</div>
            <button style={{width:'100%',background:'linear-gradient(135deg,#f5a623,#e8941a)',border:'none',borderRadius:8,padding:'8px',fontSize:11,fontWeight:700,color:'#fff',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 3px 10px rgba(245,166,35,.28)',marginBottom:5}}
              onClick={e=>{e.stopPropagation();startProgram(p,i);}}>
              {p.pct>0?'Continue Program →':'Start Program →'}
            </button>
            <button style={{width:'100%',background:'#f0ede8',border:'1px solid rgba(245,166,35,.2)',borderRadius:8,padding:'7px',fontSize:10.5,fontWeight:700,color:'#c97d0a',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}
              onClick={e=>{e.stopPropagation();showToast('📤 Program details shared!');}}>
              Share Program
            </button>
          </div>}
        </div>
      ))}
      <div className="gs-entry-light" onClick={onBook} style={{marginTop:4}}>
        <div className="gs-entry-light-ico">💎</div>
        <div className="gs-entry-light-body"><div className="gs-entry-light-title">Get Coached 1-on-1</div><div className="gs-entry-light-sub">Accelerate with Rodrigue</div></div>
        <span className="gs-entry-light-price">$99</span>
      </div>
    </>
  );
}

function ScreenToolkit({ dark, name, onBook, onProfile, onNav }) {
  const toolActionsDark = [
    {ico:'🛡',lbl:'Boundaries',  bg:'#2a2010', fn:()=>showToast('🛡 Boundaries module — learn to say No with confidence.')},
    {ico:'🎭',lbl:'Roleplay',    bg:'#1a1428', fn:()=>showToast('🎭 Roleplay coach starting — practice difficult conversations.')},
    {ico:'💑',lbl:'Couple',      bg:'#2a1018', fn:()=>showToast('💑 Couple mode activated! Great for relationship growth.')},
    {ico:'✍️',lbl:'Creator',     bg:'#101828', fn:()=>showToast('✍️ Creator Engine loading — build your content strategy.')},
    {ico:'📋',lbl:'Life Admin',  bg:'#0f1e1c', fn:()=>showToast('📋 Life Admin — organise your tasks and priorities.')},
    {ico:'🎯',lbl:'Challenges',  bg:'#1a1428', fn:()=>onNav&&onNav('programs')},
  ];
  const toolActionsLight = [
    {ico:'🛡',lbl:'Boundaries',    bg:'#fef3e2', badge:false, fn:()=>showToast('🛡 Boundaries module — learn to say No with confidence.')},
    {ico:'💑',lbl:'Couple Mode',   bg:'#fce8ef', badge:false, fn:()=>showToast('💑 Couple mode activated! Great for relationship growth.')},
    {ico:'✍️',lbl:'Creator Engine',bg:'#e8f0fe', badge:true,  fn:()=>showToast('✍️ Creator Engine loading — build your content strategy.')},
    {ico:'📋',lbl:'Life Admin',    bg:'#e8fef3', badge:false, fn:()=>showToast('📋 Life Admin — organise your tasks and priorities.')},
    {ico:'🎯',lbl:'Challenges',    bg:'#dbeafe', badge:false, fn:()=>onNav&&onNav('programs')},
    {ico:'🏁',lbl:'Goals',         bg:'#fce8ef', badge:false, fn:()=>showToast('🏁 Goals tracker — set, track and crush your goals.')},
  ];

  if (dark) return (
    <>
      <div className="dtk-hdr">
        <span className="dtk-title">≡ Toolkit</span>
        <span style={{fontSize:14,color:'#5a5248',letterSpacing:2,cursor:'pointer'}} onClick={()=>showToast('⚙️ Toolkit settings coming soon!')}>···</span>
      </div>
      <div className="gs-entry-dark" onClick={onBook}>
        <div className="gs-entry-dark-ico">💎</div>
        <div className="gs-entry-dark-body"><div className="gs-entry-dark-title">Book Growth Session</div><div className="gs-entry-dark-sub">Private coaching with Rodrigue</div></div>
        <span className="gs-entry-dark-price">$99</span>
      </div>
      <div className="dtk-grid">
        {toolActionsDark.map((t,i) => (
          <div className="dtk-btn" key={i} onClick={t.fn}><div className="dtk-ico" style={{background:t.bg}}>{t.ico}</div><div className="dtk-lbl">{t.lbl}</div></div>
        ))}
      </div>
      <div className="dtk-prof">
        <div className="dtk-prof-top">
          <div className="dtk-prof-av">👤</div>
          <div>
            <div className="dtk-prof-name">{name}</div>
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              <span className="dtk-prof-streak">🔥 Streak: 5 days</span>
              <span className="dtk-prof-badge">Pro</span>
            </div>
          </div>
        </div>
        {[{ico:'✏️',lbl:'Edit Profile'},{ico:'💎',lbl:'Manage Subscription'},{ico:'🔔',lbl:'Notifications'}].map(m => (
          <div className="dtk-mitem" key={m.lbl} onClick={()=>{if(m.lbl==='Edit Profile'||m.lbl==='Manage Subscription'||m.lbl==='Notifications')onProfile();else showToast(`${m.ico} ${m.lbl} opening…`);}}>
            <span className="dtk-mico">{m.ico}</span><span className="dtk-mlbl">{m.lbl}</span><span className="dtk-marr">›</span>
          </div>
        ))}
      </div>
    </>
  );
  return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:800,color:'#1a1814'}}>≡ Toolkit</span>
        <span style={{fontSize:13,color:'#b5afa8',cursor:'pointer'}} onClick={()=>showToast('⚙️ Toolkit settings coming soon!')}>···</span>
      </div>
      <div className="gs-entry-light" onClick={onBook}>
        <div className="gs-entry-light-ico">💎</div>
        <div className="gs-entry-light-body"><div className="gs-entry-light-title">Book Growth Session</div><div className="gs-entry-light-sub">Private coaching with Rodrigue</div></div>
        <span className="gs-entry-light-price">$99</span>
      </div>
      <div className="ltk-grid">
        {toolActionsLight.map((t,i) => (
          <div className="ltk-btn" key={i} onClick={t.fn}>
            {t.badge&&<div className="ltk-badge"/>}
            <div className="ltk-ico" style={{background:t.bg}}>{t.ico}</div>
            <div className="ltk-lbl">{t.lbl}</div>
          </div>
        ))}
      </div>
      <div className="ltk-prof">
        <div className="ltk-prof-top">
          <div className="ltk-prof-av">👤</div>
          <div>
            <div className="ltk-prof-name">{name}</div>
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              <span className="ltk-prof-streak">🔥 Streak: 5 days</span>
              <span className="ltk-badge2">Premium</span>
            </div>
          </div>
        </div>
        {[{ico:'✏️',lbl:'Edit Profile'},{ico:'💎',lbl:'Manage Subscription'},{ico:'🔔',lbl:'Notifications'}].map(m => (
          <div className="ltk-mitem" key={m.lbl} onClick={()=>{onProfile();}}>
            <span className="ltk-mico">{m.ico}</span><span className="ltk-mlbl">{m.lbl}</span><span className="ltk-marr">›</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ScreenProfile({ dark, name, onBack, onSignOut }) {
  const badge = dark ? <span className="dtk-prof-badge">Pro</span> : <span className="ltk-badge2">Premium</span>;
  const stats = [{v:'5',l:'Streak'},{v:'72',l:'Score'},{v:'12',l:'Days'},{v:'3',l:'Programs'}];
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(name);

  const profileActions = {
    'Edit Profile':         ()=>setEditMode(true),
    'Manage Subscription':  ()=>showToast('💎 Subscription: Premium Plan · Renews May 6, 2026'),
    'Notifications':        ()=>showToast('🔔 Notifications: All alerts enabled'),
    'Privacy & Security':   ()=>showToast('🔒 Privacy: Your data is encrypted and never shared'),
    'Help & Support':       ()=>showToast('❓ Help Center: support@beingtchitaka.com'),
    'Sign Out':              onSignOut,
  };

  if (dark) return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <span style={{fontSize:12,color:'#f5a623',fontWeight:700,cursor:'pointer'}} onClick={onBack}>‹ Back</span>
        <span style={{fontSize:13,fontWeight:800,color:'#f2ede6'}}>Profile</span>
        <span style={{width:32}}/>
      </div>
      {editMode ? (
        <div style={{background:'#252218',border:'1px solid rgba(245,166,35,.2)',borderRadius:12,padding:14,marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:'.14em',color:'#5a5248',textTransform:'uppercase',marginBottom:8}}>Edit Display Name</div>
          <input style={{width:'100%',background:'#1a1814',border:'1px solid rgba(245,166,35,.3)',borderRadius:9,padding:'10px 12px',fontSize:13,color:'#f2ede6',fontFamily:"'DM Sans',sans-serif",outline:'none',marginBottom:10,boxSizing:'border-box'}}
            value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your name"/>
          <div style={{display:'flex',gap:8}}>
            <button style={{flex:1,background:'linear-gradient(135deg,#f5a623,#e8941a)',border:'none',borderRadius:8,padding:'9px',fontSize:11.5,fontWeight:700,color:'#1a1200',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}
              onClick={()=>{setEditMode(false);showToast(`✅ Name updated to "${displayName}"!`);}}>Save</button>
            <button style={{flex:1,background:'#1a1814',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'9px',fontSize:11.5,fontWeight:700,color:'#9a9080',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}
              onClick={()=>setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="dprof-wrap">
          <div className="dprof-av">👤</div>
          <div style={{fontSize:16,fontWeight:800,color:'#f2ede6',marginBottom:2}}>{displayName}</div>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{fontSize:11,fontWeight:700,color:'#f5a623'}}>🔥 Streak: 5 days</span>
            {badge}
          </div>
        </div>
      )}
      <div className="dprof-stats">
        {stats.map(s => (
          <div key={s.l} className="dprof-stat" style={{cursor:'pointer'}} onClick={()=>showToast(`${s.l}: ${s.v}`)}><div className="dprof-stat-val">{s.v}</div><div className="dprof-stat-lbl">{s.l}</div></div>
        ))}
      </div>
      <div className="dprof-section">
        {PROFILE_ITEMS.map(m => (
          <div key={m.lbl} className="dprof-item" onClick={profileActions[m.lbl]}>
            <span style={{fontSize:14}}>{m.ico}</span>
            <span style={{flex:1,fontSize:12,fontWeight:600,color:'#f2ede6'}}>{m.lbl}</span>
            <span style={{fontSize:13,color:'#5a5248'}}>›</span>
          </div>
        ))}
      </div>
    </>
  );
  return (
    <>
      <div className="lpanel-hdr" style={{padding:'0 0 7px'}}>
        <span className="lpanel-back" onClick={onBack}>‹ Back</span>
        <span className="lpanel-title">Profile</span>
        <span style={{width:28}}/>
      </div>
      {editMode ? (
        <div style={{background:'#fff',border:'1px solid rgba(245,166,35,.2)',borderRadius:11,padding:12,marginBottom:12}}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:'.14em',color:'#7a7368',textTransform:'uppercase',marginBottom:7}}>Edit Display Name</div>
          <input style={{width:'100%',background:'#f9f7f4',border:'1px solid rgba(245,166,35,.3)',borderRadius:8,padding:'9px 11px',fontSize:12.5,color:'#1a1814',fontFamily:"'DM Sans',sans-serif",outline:'none',marginBottom:9,boxSizing:'border-box'}}
            value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your name"/>
          <div style={{display:'flex',gap:7}}>
            <button style={{flex:1,background:'linear-gradient(135deg,#f5a623,#e8941a)',border:'none',borderRadius:7,padding:'8px',fontSize:11,fontWeight:700,color:'#fff',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}
              onClick={()=>{setEditMode(false);showToast(`✅ Name updated to "${displayName}"!`);}}>Save</button>
            <button style={{flex:1,background:'#f0ede8',border:'1px solid rgba(0,0,0,.1)',borderRadius:7,padding:'8px',fontSize:11,fontWeight:700,color:'#7a7368',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}
              onClick={()=>setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="lprof-wrap">
          <div className="lprof-av">👤</div>
          <div style={{fontSize:15,fontWeight:800,color:'#1a1814',marginBottom:2}}>{displayName}</div>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{fontSize:10.5,fontWeight:700,color:'#f5a623'}}>🔥 Streak: 5 days</span>
            {badge}
          </div>
        </div>
      )}
      <div className="lprof-stats">
        {stats.map(s => (
          <div key={s.l} className="lprof-stat" style={{cursor:'pointer'}} onClick={()=>showToast(`${s.l}: ${s.v}`)}><div className="lprof-stat-val">{s.v}</div><div className="lprof-stat-lbl">{s.l}</div></div>
        ))}
      </div>
      <div className="lprof-section">
        {PROFILE_ITEMS.map(m => (
          <div key={m.lbl} className="lprof-item" onClick={profileActions[m.lbl]}>
            <span style={{fontSize:13}}>{m.ico}</span>
            <span style={{flex:1,fontSize:11.5,fontWeight:600,color:'#1a1814'}}>{m.lbl}</span>
            <span style={{fontSize:12,color:'#b5afa8'}}>›</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── DARK PHONE CONTAINER ─── */
function DarkPhone({ initialScreen, name, onBook, onSignOut, shared }) {
  const [screen, setScreen] = useState(initialScreen);
  const nav = lbl => {
    const m = {Home:'home',Calm:'calm',Programs:'programs',Toolkit:'toolkit',Profile:'profile'};
    setScreen(m[lbl]||'home');
  };
  const { tasks, setTasks, mood, setMood, vals, setVals, markedDone, setMarkedDone } = shared;
  const [notifOpen, setNotifOpen] = useState(false);

  const BNav = ({ active }) => (
    <div className="phone-bnav">
      {NAV_ITEMS.map(it => (
        <div key={it.lbl} className={`phone-nav-item${it.lbl===active?' on':''}`} onClick={()=>nav(it.lbl)}>
          <span className="phone-nav-ico">{it.ico}</span>
          <span className="phone-nav-lbl">{it.lbl}</span>
        </div>
      ))}
    </div>
  );

  const NotifPanel = () => (
    <div style={{background:'#252218',border:'1px solid rgba(245,166,35,.2)',borderRadius:14,padding:14,marginBottom:12}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:800,color:'#f2ede6'}}>🔔 Notifications</span>
        <span style={{fontSize:12,color:'#f5a623',cursor:'pointer'}} onClick={()=>setNotifOpen(false)}>✕</span>
      </div>
      {[{ico:'🔥',txt:'5-day streak! Keep it up!',t:'2m ago',fn:()=>showToast('🔥 5 days strong! Keep the momentum!')},
        {ico:'📅',txt:'Daily check-in reminder',t:'1h ago',fn:()=>setScreen('checkin')},
        {ico:'💎',txt:'New coaching slot available',t:'3h ago',fn:()=>onBook()}].map((n,i)=>(
        <div key={i} style={{display:'flex',gap:9,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.06)',cursor:'pointer'}} onClick={n.fn}>
          <span style={{fontSize:16}}>{n.ico}</span>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:'#f2ede6'}}>{n.txt}</div><div style={{fontSize:9.5,color:'#9a9080',marginTop:2}}>{n.t}</div></div>
          <span style={{fontSize:11,color:'#f5a623'}}>›</span>
        </div>
      ))}
    </div>
  );

  const activeNav = {home:'Home',checkin:'Home',guidance:'Home',calm:'Calm',programs:'Programs',toolkit:'Toolkit',profile:'Profile'}[screen]||'Home';

  const screens = {
    home:     <><div className="phone-body">{notifOpen&&<NotifPanel/>}<ScreenHome dark name={name} tasks={tasks} setTasks={setTasks} onCheckin={()=>setScreen('checkin')} onCalm={()=>setScreen('calm')} onGuidance={()=>setScreen('guidance')} onBook={onBook} onNotif={()=>setNotifOpen(o=>!o)}/></div><BNav active={activeNav}/></>,
    checkin:  <><div className="phone-body"><ScreenCheckin dark mood={mood} setMood={setMood} vals={vals} setVals={setVals} onGenerate={()=>setScreen('guidance')} onBack={()=>setScreen('home')}/></div><BNav active={activeNav}/></>,
    guidance: <><div className="phone-body"><ScreenGuidance dark tasks={tasks} setTasks={setTasks} markedDone={markedDone} setMarkedDone={setMarkedDone} onBack={()=>setScreen('home')}/></div><BNav active={activeNav}/></>,
    calm:     <><div className="phone-body"><ScreenCalm dark onBack={()=>setScreen('home')}/></div><BNav active="Calm"/></>,
    programs: <><div className="phone-body"><ScreenPrograms dark onBack={()=>setScreen('home')} onBook={onBook}/></div><BNav active="Programs"/></>,
    toolkit:  <><div className="phone-body"><ScreenToolkit dark name={name} onBook={onBook} onProfile={()=>setScreen('profile')} onNav={nav}/></div><BNav active="Toolkit"/></>,
    profile:  <><div className="phone-body"><ScreenProfile dark name={name} onBack={()=>setScreen('toolkit')} onSignOut={onSignOut}/></div><BNav active="Profile"/></>,
  };

  return <div className="phone"><DSB/>{screens[screen]||screens.home}</div>;
}

/* ─── LIGHT PANEL CONTAINER ─── */
function LightPanel({ initialScreen, name, onBook, onSignOut, shared }) {
  const [screen, setScreen] = useState(initialScreen);
  const nav = lbl => {
    const m = {Home:'home',Calm:'calm',Programs:'programs',Toolkit:'toolkit',Profile:'profile'};
    setScreen(m[lbl]||'home');
  };
  const { tasks, setTasks, mood, setMood, vals, setVals, markedDone, setMarkedDone } = shared;
  const [notifOpen, setNotifOpen] = useState(false);

  const activeNav = {home:'Home',checkin:'Home',guidance:'Home',calm:'Calm',programs:'Programs',toolkit:'Toolkit',profile:'Profile'}[screen]||'Home';

  const BNav = ({ active }) => (
    <div className="lpanel-bnav">
      {NAV_ITEMS.map(it => (
        <div key={it.lbl} className={`lpanel-ni${it.lbl===active?' on':''}`} onClick={()=>nav(it.lbl)}>
          <span className="lpanel-ni-ico">{it.ico}</span>
          <span className="lpanel-ni-lbl">{it.lbl}</span>
        </div>
      ))}
    </div>
  );

  const Header = ({ title, back, backFn, action, actionFn }) => (
    <div className="lpanel-hdr">
      {back ? <span className="lpanel-back" onClick={backFn}>{back}</span> : <div style={{width:28}}/>}
      <span className="lpanel-title">{title}</span>
      <span className="lpanel-action" onClick={actionFn||undefined} style={{cursor:actionFn?'pointer':'default'}}>{action||''}</span>
    </div>
  );

  const NotifPanel = () => (
    <div style={{background:'#fff',border:'1px solid rgba(245,166,35,.25)',borderRadius:12,padding:12,marginBottom:10,boxShadow:'0 4px 16px rgba(0,0,0,.08)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
        <span style={{fontSize:11.5,fontWeight:800,color:'#1a1814'}}>🔔 Notifications</span>
        <span style={{fontSize:11,color:'#f5a623',cursor:'pointer'}} onClick={()=>setNotifOpen(false)}>✕</span>
      </div>
      {[{ico:'🔥',txt:'5-day streak! Keep it up!',t:'2m ago',fn:()=>showToast('🔥 5 days strong! Keep the momentum!')},
        {ico:'📅',txt:'Daily check-in reminder',t:'1h ago',fn:()=>setScreen('checkin')},
        {ico:'💎',txt:'New coaching slot available',t:'3h ago',fn:()=>onBook()}].map((n,i)=>(
        <div key={i} style={{display:'flex',gap:8,padding:'7px 0',borderBottom:'1px solid rgba(0,0,0,.06)',cursor:'pointer'}} onClick={n.fn}>
          <span style={{fontSize:14}}>{n.ico}</span>
          <div style={{flex:1}}><div style={{fontSize:10.5,fontWeight:600,color:'#1a1814'}}>{n.txt}</div><div style={{fontSize:9,color:'#7a7368',marginTop:1}}>{n.t}</div></div>
          <span style={{fontSize:10,color:'#f5a623'}}>›</span>
        </div>
      ))}
    </div>
  );

  if(screen==='home') return (
    <div className="lpanel"><LSB/>
      <Header title="" action="🔔" actionFn={()=>setNotifOpen(o=>!o)}/>
      <div className="lpanel-body">{notifOpen&&<NotifPanel/>}<ScreenHome name={name} tasks={tasks} setTasks={setTasks} onCheckin={()=>setScreen('checkin')} onCalm={()=>setScreen('calm')} onGuidance={()=>setScreen('guidance')} onBook={onBook} onNotif={()=>setNotifOpen(o=>!o)}/></div>
      <BNav active={activeNav}/>
    </div>
  );
  if(screen==='checkin') return (
    <div className="lpanel"><LSB/>
      <Header title="Daily Check-in" back="‹ Back" backFn={()=>setScreen('home')} action="×" actionFn={()=>setScreen('home')}/>
      <div className="lpanel-body"><ScreenCheckin mood={mood} setMood={setMood} vals={vals} setVals={setVals} onGenerate={()=>setScreen('guidance')} onBack={()=>setScreen('home')}/></div>
      <BNav active={activeNav}/>
    </div>
  );
  if(screen==='guidance') return (
    <div className="lpanel"><LSB/>
      <Header title="Today's Guidance" back="‹ Back" backFn={()=>setScreen('home')}/>
      <div className="lpanel-body"><ScreenGuidance tasks={tasks} setTasks={setTasks} markedDone={markedDone} setMarkedDone={setMarkedDone} onBack={()=>setScreen('home')}/></div>
      <BNav active={activeNav}/>
    </div>
  );
  if(screen==='calm') return (
    <div className="lpanel"><LSB/>
      <Header title="Calm" back="‹ Back" backFn={()=>setScreen('home')}/>
      <div className="lpanel-body"><ScreenCalm onBack={()=>setScreen('home')}/></div>
      <BNav active="Calm"/>
    </div>
  );
  if(screen==='programs') return (
    <div className="lpanel"><LSB/>
      <Header title="Programs" back="‹ Back" backFn={()=>setScreen('home')}/>
      <div className="lpanel-body"><ScreenPrograms onBack={()=>setScreen('home')} onBook={onBook}/></div>
      <BNav active="Programs"/>
    </div>
  );
  if(screen==='toolkit') return (
    <div className="lpanel"><LSB/>
      <Header title=""/>
      <div className="lpanel-body"><ScreenToolkit name={name} onBook={onBook} onProfile={()=>setScreen('profile')} onNav={nav}/></div>
      <BNav active="Toolkit"/>
    </div>
  );
  if(screen==='profile') return (
    <div className="lpanel"><LSB/>
      <Header title="Profile" back="‹ Back" backFn={()=>setScreen('toolkit')}/>
      <div className="lpanel-body"><ScreenProfile name={name} onBack={()=>setScreen('toolkit')} onSignOut={onSignOut}/></div>
      <BNav active="Profile"/>
    </div>
  );
  return null;
}

/* ─── FULL APP ─── */
function FullApp({ email, onSignOut }) {
  const name = email
    ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
    : 'Alex';

  const [showBooking, setShowBooking] = useState(false);
  const [lightNav,    setLightNav]    = useState('Home');
  const [gridView,    setGridView]    = useState(true);

  const [tasks, setTasks] = useState([
    {label:'Do 5-min focus block', color:'#4a8fdb', done:false},
    {label:'Call Mom ❤️',          color:'#e85479', done:false},
    {label:'Journal 2 min',        color:'#f5a623', done:false},
  ]);
  const [mood,       setMood]       = useState(null);
  const [vals,       setVals]       = useState({Stress:4,Energy:3,Focus:3,Relationship:4});
  const [markedDone, setMarkedDone] = useState(false);
  const shared = { tasks, setTasks, mood, setMood, vals, setVals, markedDone, setMarkedDone };

  const lightScreenMap = {
    'Home':       ['home','checkin','guidance','toolkit'],
    'Calm':       ['calm','calm','calm','calm'],
    'Programs':   ['programs','programs','programs','programs'],
    'Toolkit':    ['toolkit','toolkit','toolkit','toolkit'],
    '👤 Profile': ['profile','profile','profile','profile'],
  };
  const lightScreens = lightScreenMap[lightNav] || lightScreenMap['Home'];

  return (
    <>
      {showBooking && <GrowthSessionModal onClose={() => setShowBooking(false)}/>}

      <div style={{background:'#0d0c09', minHeight:'100vh', overflowY:'auto'}}>
        {/* DARK SECTION */}
        <div className="dark-section">
          <div className="dark-section-inner">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
              <div style={{width:44,height:44,background:'linear-gradient(135deg,#f5a623,#c97d0a)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:'0 3px 14px rgba(245,166,35,.4)'}}>⭐</div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:'#f2ede6',lineHeight:1.1}}>Being <span style={{color:'#f5a623'}}>Tchitaka</span></div>
                <div style={{fontSize:9,letterSpacing:'0.2em',color:'#6b6058',textTransform:'uppercase',fontWeight:600}}>— GROWTH OS —</div>
              </div>
            </div>
            <div className="dark-col-labels">
              {['HOME','DAILY CHECK-IN','GUIDANCE','TOOLKIT'].map(l => <div className="dark-col-label" key={l}>{l}</div>)}
            </div>
            <div className="dark-phones">
              <DarkPhone initialScreen="home"     name={name} onBook={()=>setShowBooking(true)} onSignOut={onSignOut} shared={shared}/>
              <DarkPhone initialScreen="checkin"  name={name} onBook={()=>setShowBooking(true)} onSignOut={onSignOut} shared={shared}/>
              <DarkPhone initialScreen="guidance" name={name} onBook={()=>setShowBooking(true)} onSignOut={onSignOut} shared={shared}/>
              <DarkPhone initialScreen="toolkit"  name={name} onBook={()=>setShowBooking(true)} onSignOut={onSignOut} shared={shared}/>
            </div>
          </div>
        </div>

        {/* LIGHT SECTION */}
        <div className="light-section">
          <div className="light-section-inner">
            <div className="light-topbar">
              <div className="light-logo">
                <div className="light-logo-mark">⭐</div>
                <div>
                  <div className="light-logo-name">Being <span>Tchitaka</span></div>
                  <span className="light-logo-sub">— Growth OS —</span>
                </div>
              </div>
              <nav className="light-nav">
                {['Home','Calm','Programs','Toolkit','👤 Profile'].map(n => (
                  <button key={n} className={`light-nav-btn${lightNav===n?' active':''}`} onClick={()=>setLightNav(n)}>{n}</button>
                ))}
              </nav>
              <div className="light-right">
                <div className="light-avatar-pill" style={{cursor:'pointer'}} onClick={()=>setLightNav('👤 Profile')}>
                  <div className="light-av">{name[0].toUpperCase()}</div>
                  <span className="light-av-name">{name}</span>
                  <span className="light-badge">Premium</span>
                </div>
                <div className="light-icon-btn" title="Grid view"
                  style={{background:gridView?'rgba(245,166,35,.12)':'#fff',borderColor:gridView?'rgba(245,166,35,.4)':'rgba(0,0,0,.08)'}}
                  onClick={()=>setGridView(true)}>⊡</div>
                <div className="light-icon-btn" title="List view"
                  style={{background:!gridView?'rgba(245,166,35,.12)':'#fff',borderColor:!gridView?'rgba(245,166,35,.4)':'rgba(0,0,0,.08)'}}
                  onClick={()=>setGridView(false)}>⊞</div>
                <button
                  style={{background:'none',border:'1px solid rgba(0,0,0,.1)',borderRadius:7,padding:'4px 10px',fontSize:11,fontWeight:600,color:'#7a7368',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#fff'}
                  onMouseLeave={e=>e.currentTarget.style.background='none'}
                  onClick={onSignOut}>Sign out</button>
              </div>
            </div>
            <div className="light-panels" style={{gridTemplateColumns:gridView?'repeat(4,1fr)':'1fr'}}>
              {lightScreens.map((screen,idx) => (
                <LightPanel
                  key={`${lightNav}-${idx}`}
                  initialScreen={screen}
                  name={name}
                  onBook={()=>setShowBooking(true)}
                  onSignOut={onSignOut}
                  shared={shared}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── LANDING PAGE ─── */
export default function LandingScreen() {
  const [tab,        setTab]       = useState('signin');
  const [email,      setEmail]     = useState('');
  const [password,   setPassword]  = useState('');
  const [showPw,     setShowPw]    = useState(false);
  const [remember,   setRemember]  = useState(true);
  const [error,      setError]     = useState('');
  const [loading,    setLoading]   = useState(false);
  const [loggedIn,   setLoggedIn]  = useState(false);
  const [loginEmail, setLoginEmail]= useState('');
  const [gState,     setGState]    = useState('idle');

  const handleGoogle = () => {
    if(gState !== 'idle') return;
    setGState('loading'); setError('');
    setTimeout(() => { setGState('success'); setTimeout(() => { setLoginEmail('alex@gmail.com'); setLoggedIn(true); }, 650); }, 1800);
  };

  const validate = () => {
    if(!email.trim())              { setError('Please enter your email address.');       return false; }
    if(!/\S+@\S+\.\S+/.test(email)){ setError('Please enter a valid email address.');   return false; }
    if(!password.trim())           { setError('Please enter your password.');            return false; }
    if(password.length < 6)        { setError('Password must be at least 6 characters.');return false; }
    return true;
  };

  const handleSubmit = () => {
    setError(''); if(!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setLoginEmail(email); setLoggedIn(true); }, 1800);
  };

  const handleSignOut = () => { setLoggedIn(false); setLoginEmail(''); setEmail(''); setPassword(''); setGState('idle'); setError(''); };

  if(loggedIn) return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <ToastContainer/>
      <FullApp email={loginEmail} onSignOut={handleSignOut}/>
    </>
  );

  const isSignIn = tab === 'signin';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <ToastContainer/>
      <div className="lp-page">
        <div className="lp-topbar">
          <div className="lp-logo">
            <div className="lp-logo-mark">⭐</div>
            <div>
              <div className="lp-logo-name">Being <span>Tchitaka</span></div>
              <span className="lp-logo-sub">— Growth OS —</span>
            </div>
          </div>
        </div>
        <div className="lp-hero">
          <div className="lp-left">
            <div className="lp-eyebrow"><span className="lp-dot"/>Your daily growth system</div>
            <div className="lp-h1">Build the life</div>
            <div className="lp-h1i">you were made for.</div>
            <p className="lp-desc">Daily check-ins, mindset coaching, calm sessions, and structured programs — everything you need to grow with intention, every single day.</p>
            <div className="lp-feats">
              {[
                {ico:'📋',bg:'rgba(245,166,35,.15)',lbl:'Daily check-ins that keep you on track'},
                {ico:'🧠',bg:'rgba(100,140,255,.15)',lbl:'Mindset coaching tailored to you'},
                {ico:'💎',bg:'rgba(245,166,35,.12)',lbl:'Private coaching sessions with Rodrigue'},
                {ico:'🌙',bg:'rgba(140,100,255,.15)',lbl:'Calm sessions to reset and recharge'},
              ].map(f => (
                <div className="lp-feat" key={f.lbl} style={{cursor:'pointer'}} onClick={()=>showToast(`✦ ${f.lbl}`)}>
                  <div className="lp-feat-ico" style={{background:f.bg}}>{f.ico}</div>
                  <span className="lp-feat-lbl">{f.lbl}</span>
                </div>
              ))}
            </div>
            <div className="lp-lock" style={{cursor:'pointer'}} onClick={()=>showToast('🔒 Your data is 256-bit encrypted. GDPR compliant. Never sold.')}>
              <span style={{fontSize:24}}>🔒</span>
              <div><div className="lp-lock-title">Private, encrypted & never shared</div><div className="lp-lock-sub">Your data belongs to you. Always.</div></div>
            </div>
          </div>
          <div className="lp-right">
            <div className="lp-card">
              <div className="lp-tabs">
                <button className={`lp-tab-btn${tab==='signin'?' active':''}`} onClick={()=>{setTab('signin');setError('');}}>Sign In</button>
                <button className={`lp-tab-btn${tab==='create'?' active':''}`} onClick={()=>{setTab('create');setError('');}}>Create Account</button>
              </div>
              <div className="lp-section-lbl">
                <div className="lp-section-lbl-line"/>
                <span className="lp-section-lbl-txt">{isSignIn?'Sign In':'Create Account'}</span>
              </div>
              <div className="lp-ctitle">{isSignIn?'Welcome back':'Join Tchitaka'}</div>
              <div className="lp-csub">{isSignIn?'Sign in to continue your growth journey.':'Start your transformation today.'}</div>
              <button className="lp-google" onClick={handleGoogle} disabled={gState==='loading'}
                style={gState==='success'?{background:'linear-gradient(135deg,#f5a623,#e8941a)',color:'#1a1200'}:{}}>
                <div className={`lp-g-content${gState==='loading'?' hidden':''}`}>
                  {gState!=='success'&&<GoogleIcon/>}
                  {gState==='success'?'✓ Signed in with Google!':'Continue with Google'}
                </div>
                <div className={`lp-g-overlay${gState==='loading'?' show':''}`}>
                  <div className="lp-g-spin"/><span style={{fontSize:12,color:'#888'}}>Connecting…</span>
                </div>
              </button>
              <div className="lp-or"><span>or</span></div>
              {error && <div className="lp-err">⚠️ {error}</div>}
              <div className="lp-field">
                <label className="lp-flabel"><span>✉</span> Email Address</label>
                <input className="lp-input" type="email" placeholder="you@example.com" value={email}
                  onChange={e=>{setEmail(e.target.value);setError('');}}
                  onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>
              </div>
              <div className="lp-field">
                <label className="lp-flabel"><span>🔑</span> Password</label>
                <div className="lp-fwrap">
                  <input className="lp-input" type={showPw?'text':'password'} placeholder="Minimum 6 characters"
                    value={password} onChange={e=>{setPassword(e.target.value);setError('');}}
                    onKeyDown={e=>e.key==='Enter'&&handleSubmit()} style={{paddingRight:38}}/>
                  <button className="lp-feye" onClick={()=>setShowPw(!showPw)}>{showPw?'🙈':'👁'}</button>
                </div>
              </div>
              {isSignIn && (
                <div className="lp-row">
                  <div className="lp-remember" onClick={()=>setRemember(!remember)}>
                    <div className={`lp-cb${remember?'':' off'}`}>{remember?'✓':''}</div>
                    <span className="lp-rem">Remember me</span>
                  </div>
                  <button className="lp-forgot" onClick={()=>setError('Password reset link sent to your email!')}>Forgot password?</button>
                </div>
              )}
              <button className="lp-cta-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? <><div className="lp-cspin"/><span>Please wait…</span></> : isSignIn ? '✦ Sign In' : '✦ Create Account'}
              </button>
              <div className="lp-slink">
                {isSignIn
                  ? <>Don't have an account? <a href="#" onClick={e=>{e.preventDefault();setTab('create');setError('');}}>Create one free</a></>
                  : <>Already have an account? <a href="#" onClick={e=>{e.preventDefault();setTab('signin');setError('');}}>Sign in</a></>}
              </div>
              <div className="lp-trust">
                <div className="lp-trust-item" style={{cursor:'pointer'}} onClick={()=>showToast('🔒 Firebase Auth — industry-standard security')}>🔒 Firebase Auth</div>
                <div className="lp-trust-item" style={{cursor:'pointer'}} onClick={()=>showToast('🛡 256-bit SSL encryption on all data')}>🛡 256-bit SSL</div>
                <div className="lp-trust-item" style={{cursor:'pointer'}} onClick={()=>showToast('✅ GDPR compliant — your rights are protected')}>✅ GDPR Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
