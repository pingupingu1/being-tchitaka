import { useState } from "react";
import { ConsultationCard, LightConsultationCard, CONSULT_CSS } from './ConsultationCard';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  .r{--gold:#F5A623;--gold2:#E8922A;--gg:rgba(245,166,35,0.28);--teal:#2ED8C3;--dk:#0C1018;--dkc:#131820;--dks:#1A2030;--bdr:rgba(255,255,255,0.07);--tp:#F0EDE8;--tm:rgba(240,237,232,0.55);--ts:rgba(240,237,232,0.3);font-family:'DM Sans',sans-serif;width:100vw;min-height:100vh;overflow-x:hidden;background:var(--dk);color:var(--tp);display:flex;flex-direction:column}
  .r*,.r*::before,.r*::after{box-sizing:border-box;margin:0;padding:0}
  .tb{flex-shrink:0;height:52px;width:100%;background:rgba(12,16,24,0.97);backdrop-filter:blur(16px);border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;padding:0 16px}
  .tb-logo{display:flex;align-items:center;gap:8px}
  .tb-icon{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px var(--gg)}
  .tb-icon svg{width:15px;height:15px;color:#fff}
  .tb-name{font-family:'Fraunces',serif;font-size:15px;font-weight:600}
  .tb-name span{color:var(--gold)}
  .tb-sub{font-size:7.5px;color:var(--ts);letter-spacing:2px;text-transform:uppercase}
  .tb-nav{display:flex;align-items:center;gap:1px}
  .tb-n{padding:5px 11px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;color:var(--tm);border:none;background:none;font-family:'DM Sans',sans-serif;transition:all 0.18s}
  .tb-n:hover{color:var(--tp);background:rgba(255,255,255,0.05)}
  .tb-n.on{color:var(--gold);background:rgba(245,166,35,0.1)}
  .tb-r{display:flex;align-items:center;gap:7px}
  .tb-bell{width:28px;height:28px;border-radius:7px;background:var(--dks);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--tm);position:relative;transition:color 0.18s}
  .tb-bell:hover{color:var(--tp)}
  .tb-dot{position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;background:var(--gold);border:1.5px solid var(--dk)}
  .tb-av{width:28px;height:28px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,var(--gold),#9B59B6);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;border:1.5px solid rgba(245,166,35,0.4)}
  .dk-grid{height:calc(100vh - 52px);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:8px;padding:8px}
  .dp{background:var(--dkc);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;animation:fu 0.4s ease both}
  .dp:nth-child(1){animation-delay:0.03s}.dp:nth-child(2){animation-delay:0.06s}.dp:nth-child(3){animation-delay:0.09s}.dp:nth-child(4){animation-delay:0.12s}.dp:nth-child(5){animation-delay:0.15s}.dp:nth-child(6){animation-delay:0.18s}.dp:nth-child(7){animation-delay:0.21s}.dp:nth-child(8){animation-delay:0.24s}
  .dp-top{flex-shrink:0;padding:7px 11px 5px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between}
  .dp-lbl{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--ts)}
  .dp-badge{font-size:9px;color:var(--tm)}
  .dp-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 11px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.07) transparent}
  .dp-body::-webkit-scrollbar{width:3px}.dp-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px}
  .dnav{flex-shrink:0;border-top:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-around;padding:5px 0 4px}
  .dni{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:7.5px;color:var(--ts);cursor:pointer;padding:2px 6px;border-radius:5px;transition:color 0.15s}
  .dni.on{color:var(--gold)}.dni svg{width:13px;height:13px}
  .ci-h{background:linear-gradient(135deg,rgba(46,216,195,0.14),rgba(46,216,195,0.04));border-bottom:1px solid rgba(46,216,195,0.14);padding:8px 11px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
  .ci-title{font-family:'Fraunces',serif;font-size:13px;font-weight:600}
  .ci-sub{font-size:9px;color:var(--tm);margin-top:1px}
  .ci-badge{background:rgba(46,216,195,0.13);border:1px solid rgba(46,216,195,0.28);color:var(--teal);font-size:8px;font-weight:600;padding:2px 6px;border-radius:100px}
  .h-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
  .h-greet{font-size:14px;font-weight:600}.h-date{font-size:9px;color:var(--ts);margin-top:2px}
  .h-score{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 2px 8px var(--gg);flex-shrink:0}
  .h-sn{font-family:'Fraunces',serif;font-size:13px;font-weight:800;color:#0C1018;line-height:1}
  .h-sl{font-size:5.5px;font-weight:700;color:rgba(12,16,24,0.6)}
  .h-stats{display:flex;gap:6px;margin-bottom:8px}
  .h-stat{flex:1;background:var(--dks);border:1px solid var(--bdr);border-radius:8px;padding:7px 6px;text-align:center}
  .h-sv{font-family:'Fraunces',serif;font-size:18px;font-weight:700;color:var(--gold);line-height:1}
  .h-sv.t{color:var(--teal);font-size:14px}
  .h-sl2{font-size:7.5px;color:var(--ts);margin-top:2px;letter-spacing:0.5px;text-transform:uppercase}
  .bg{width:100%;padding:8px;border-radius:8px;margin-bottom:5px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 8px var(--gg)}
  .bg:hover{transform:translateY(-1px)}
  .bgh{width:100%;padding:7px;border-radius:8px;margin-bottom:9px;background:var(--dks);border:1px solid var(--bdr);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s}
  .bgh:hover{border-color:rgba(46,216,195,0.3);color:var(--teal)}
  .slbl{font-size:9.5px;font-weight:600;color:var(--tm);margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}
  .slbl span{color:var(--ts);font-size:9px;font-weight:400}
  .task{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:7px;background:var(--dks);border:1px solid transparent;cursor:pointer;transition:border-color 0.15s;margin-bottom:4px}
  .task:hover{border-color:var(--bdr)}
  .tdot{width:7px;height:7px;border-radius:50%;flex-shrink:0;border:1.5px solid}.tdot.dn{background:currentColor}
  .tn{font-size:11px;flex:1}.tn.dn{text-decoration:line-through;color:var(--ts)}
  .tck{font-size:9px;color:var(--ts)}.tck.dn{color:var(--teal)}
  .qt{background:var(--dks);border:1px solid var(--bdr);border-radius:7px;padding:7px 9px;margin-top:7px}
  .ql{font-size:7.5px;color:var(--ts);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:2px}
  .qv{font-family:'Fraunces',serif;font-style:italic;font-size:11px;color:var(--gold)}
  .mood-r{display:flex;gap:4px;justify-content:center;margin-bottom:11px}
  .mood{font-size:20px;cursor:pointer;transition:transform 0.18s;filter:grayscale(0.35)}
  .mood.on,.mood:hover{transform:scale(1.3);filter:grayscale(0)}
  .slg{margin-bottom:9px}
  .slrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px}
  .sll{font-size:10px;color:var(--tm)}.slv{font-size:10px;font-weight:600}
  .sli{width:100%;height:4px;border-radius:2px;background:var(--dks);appearance:none;outline:none;cursor:pointer}
  .sli::-webkit-slider-thumb{appearance:none;width:12px;height:12px;border-radius:50%;background:var(--gold);box-shadow:0 0 5px var(--gg);cursor:pointer}
  .bgen{width:100%;padding:9px;border-radius:8px;margin-top:9px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 10px var(--gg)}
  .bgen:hover{transform:translateY(-1px)}
  .gdhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
  .gdtitle{font-family:'Fraunces',serif;font-size:13px;font-weight:600}
  .gddate{font-size:9px;color:var(--teal);font-weight:500}
  .cbox{background:linear-gradient(135deg,rgba(245,166,35,0.08),rgba(245,166,35,0.02));border:1px solid rgba(245,166,35,0.15);border-radius:9px;padding:8px 10px;margin-bottom:9px}
  .clbl{font-size:8px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:3px}
  .chead{font-family:'Fraunces',serif;font-size:12px;font-weight:600;line-height:1.3;margin-bottom:4px}
  .cbody{font-size:9.5px;color:var(--tm);line-height:1.55}
  .pi{display:flex;align-items:center;gap:6px;margin-bottom:5px}
  .pn{width:17px;height:17px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#0C1018}
  .pname{font-size:10.5px;flex:1}.ptime{font-size:9px;color:var(--ts)}
  .pradio{width:12px;height:12px;border-radius:50%;border:1.5px solid var(--bdr);flex-shrink:0}
  .praybox{background:var(--dks);border:1px solid var(--bdr);border-radius:7px;padding:7px 9px;margin:9px 0;display:flex;align-items:flex-start;gap:5px}
  .prayicon{font-size:11px;margin-top:1px}
  .praytxt{font-size:9.5px;color:var(--tm);line-height:1.5;font-style:italic}
  .bmark{width:100%;padding:9px;border-radius:8px;background:var(--teal);border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 9px rgba(46,216,195,0.28)}
  .bmark:hover{transform:translateY(-1px)}.bmark.dn{background:rgba(46,216,195,0.13);color:var(--teal);box-shadow:none}
  .tkgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
  .tkb{border-radius:9px;padding:8px 4px;border:none;cursor:pointer;color:#fff;font-family:'DM Sans',sans-serif;font-size:8.5px;font-weight:600;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:all 0.18s;min-height:52px;text-align:center}
  .tkb:hover{transform:translateY(-2px);filter:brightness(1.1)}.tkb span{font-size:16px}
  .tkb1{background:linear-gradient(135deg,#E8922A,#c97820)}.tkb2{background:linear-gradient(135deg,#E91E8C,#c01575)}.tkb3{background:linear-gradient(135deg,#2ED8C3,#1a9e8f)}.tkb4{background:linear-gradient(135deg,#3B82F6,#2563eb)}.tkb5{background:linear-gradient(135deg,#9B59B6,#7b3f9e)}.tkb6{background:linear-gradient(135deg,#F59E0B,#d97706)}
  .calmbox{background:linear-gradient(135deg,#080f1e,#0d1a30);border-radius:10px;padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:8px}
  .cwaves{display:flex;align-items:flex-end;gap:2.5px;height:24px}
  .cwave{width:2.5px;border-radius:1.5px;background:var(--teal);opacity:0.75;animation:cw 1.2s ease-in-out infinite}
  .cwave:nth-child(2){animation-delay:0.1s}.cwave:nth-child(3){animation-delay:0.2s}.cwave:nth-child(4){animation-delay:0.3s}.cwave:nth-child(5){animation-delay:0.2s}.cwave:nth-child(6){animation-delay:0.1s}.cwave:nth-child(7){animation-delay:0s}
  .cplay{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;transition:all 0.18s}
  .cplay:hover{background:rgba(255,255,255,0.2);transform:scale(1.06)}
  .ctitle{font-size:12px;font-weight:600;color:#fff}.csub{font-size:9px;color:rgba(255,255,255,0.45)}
  .prog{display:flex;align-items:center;gap:8px;padding:8px 9px;border-radius:9px;background:var(--dks);border:1px solid var(--bdr);cursor:pointer;transition:all 0.18s;margin-bottom:5px}
  .prog:hover,.prog.on{border-color:rgba(245,166,35,0.28);background:rgba(245,166,35,0.05)}
  .progic{font-size:18px;flex-shrink:0}.prognm{font-size:11px;font-weight:600}.progmt{font-size:9px;color:var(--ts)}.proglk{margin-left:auto;color:var(--ts);font-size:12px}
  .jprompt{font-family:'Fraunces',serif;font-size:15px;font-weight:700;color:var(--gold);line-height:1.3;margin-bottom:8px}
  .jarea{width:100%;min-height:65px;background:var(--dks);border:1.5px solid var(--bdr);border-radius:7px;padding:7px 9px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:10px;resize:none;outline:none;line-height:1.6;transition:border-color 0.18s}
  .jarea:focus{border-color:var(--gold)}.jarea::placeholder{color:var(--ts)}
  .bwrite{width:100%;margin-top:6px;padding:9px;border-radius:8px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#0C1018;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 8px var(--gg)}
  .bwrite:hover{transform:translateY(-1px)}
  .pftop{display:flex;align-items:center;gap:9px;margin-bottom:9px}
  .pfav{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--gold),#9B59B6);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;border:2px solid rgba(245,166,35,0.38)}
  .pfname{font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px}
  .pfpro{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0C1018;font-size:7.5px;font-weight:700;padding:1.5px 5px;border-radius:100px}
  .pfstr{font-size:9.5px;color:var(--tm);margin-top:2px}.pfstr b{color:var(--gold)}
  .pflnk{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:7px;background:var(--dks);border:1px solid var(--bdr);font-size:10px;color:var(--tm);cursor:pointer;transition:all 0.18s;margin-bottom:4px}
  .pflnk:hover{border-color:rgba(245,166,35,0.2);color:var(--tp)}
  .pfbar{margin-top:8px}.pfbi{margin-bottom:6px}
  .pfbr{display:flex;justify-content:space-between;font-size:9.5px;margin-bottom:3px}
  .pfbl{color:var(--tm)}.pfbp{color:var(--ts)}
  .pfb{height:4px;border-radius:2px;background:var(--dks);overflow:hidden}.pff{height:100%;border-radius:2px}
  .bso{width:100%;padding:8px;margin-top:8px;background:rgba(255,92,92,0.08);border:1px solid rgba(255,92,92,0.18);border-radius:7px;color:#FF5C5C;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;transition:all 0.18s}
  .bso:hover{background:rgba(255,92,92,0.14)}
  .divider{background:#e8eaed;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}
  .divline{flex:1;height:1px;background:#ccc}
  .divlbl{font-family:'Fraunces',serif;font-size:12px;font-weight:600;color:#666;white-space:nowrap}
  .ls{background:#f0f2f5;padding:0 8px 16px;flex-shrink:0}
  .lgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .lp{background:#fff;border:1px solid #e8eaed;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 2px 12px rgba(0,0,0,0.07)}
  .lp-bar{background:#f8f9fa;border-bottom:1px solid #eee;padding:6px 10px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
  .lp-dots{display:flex;gap:4px}.lp-dot{width:7px;height:7px;border-radius:50%}
  .lp-title{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa}.lp-right{font-size:8px;color:#bbb}
  .lp-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 11px;scrollbar-width:thin;scrollbar-color:#eee transparent}
  .lp-body::-webkit-scrollbar{width:3px}.lp-body::-webkit-scrollbar-thumb{background:#eee;border-radius:2px}
  .lnav{flex-shrink:0;border-top:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-around;padding:5px 0 4px;background:#fafafa}
  .lni{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:7px;color:#bbb;cursor:pointer;padding:2px 5px;border-radius:5px;transition:color 0.15s}
  .lni.on{color:#F5A623}.lni svg{width:12px;height:12px}
  .lci-h{background:linear-gradient(135deg,#e8faf8,#f0fdfb);border-bottom:1px solid #c8ede9;padding:8px 11px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
  .lci-title{font-family:'Fraunces',serif;font-size:13px;font-weight:600;color:#1a1a2e}
  .lci-sub{font-size:8.5px;color:#888;margin-top:1px}
  .lci-badge{background:#d4f3ef;border:1px solid #b2ede8;color:#1a9e8f;font-size:8px;font-weight:600;padding:2px 6px;border-radius:100px}
  .lh-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
  .lh-greet{font-size:13px;font-weight:600;color:#1a1a2e}.lh-date{font-size:8px;color:#aaa;margin-top:2px}
  .lh-score{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#F5A623,#E8922A);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(245,166,35,0.3);flex-shrink:0}
  .lh-sn{font-family:'Fraunces',serif;font-size:12px;font-weight:800;color:#fff;line-height:1}
  .lh-sl{font-size:5px;font-weight:700;color:rgba(255,255,255,0.8)}
  .lh-stats{display:flex;gap:5px;margin-bottom:8px}
  .lh-stat{flex:1;background:#f8f9fa;border:1px solid #eee;border-radius:8px;padding:7px 6px;text-align:center}
  .lh-sv{font-family:'Fraunces',serif;font-size:17px;font-weight:700;color:#1a1a2e;line-height:1}
  .lh-sl2{font-size:7px;color:#aaa;margin-top:2px;letter-spacing:0.5px;text-transform:uppercase}
  .lbg{width:100%;padding:8px;border-radius:9px;margin-bottom:5px;background:linear-gradient(135deg,#F5A623,#E8922A);border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 8px rgba(245,166,35,0.3)}
  .lbg:hover{transform:translateY(-1px)}
  .lbgh{width:100%;padding:7px;border-radius:9px;margin-bottom:9px;background:#E8F8F6;border:1px solid #b2ede8;color:#1a9e8f;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s}
  .lbgh:hover{background:#d4f3ef}
  .lslbl{font-size:9px;font-weight:600;color:#666;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}
  .lslbl span{color:#ccc;font-size:8.5px;font-weight:400}
  .ltask{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:7px;background:#f8f9fa;border:1px solid transparent;cursor:pointer;transition:border-color 0.15s;margin-bottom:4px}
  .ltask:hover{border-color:#eee}
  .ltdot{width:7px;height:7px;border-radius:50%;flex-shrink:0;border:1.5px solid}.ltdot.dn{background:currentColor}
  .ltn{font-size:10.5px;flex:1;color:#333}.ltn.dn{text-decoration:line-through;color:#bbb}
  .ltck{font-size:9px;color:#ccc}.ltck.dn{color:#2ED8C3}
  .lqt{background:#fffbf3;border:1px solid #f5e6c0;border-radius:7px;padding:7px 9px;margin-top:7px}
  .lql{font-size:7px;color:#ccc;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:2px}
  .lqv{font-family:'Fraunces',serif;font-style:italic;font-size:11px;color:#F5A623}
  .lmoodr{display:flex;gap:4px;justify-content:center;margin-bottom:10px}
  .lmood{font-size:19px;cursor:pointer;transition:transform 0.18s;filter:grayscale(0.3)}
  .lmood.on,.lmood:hover{transform:scale(1.3);filter:grayscale(0)}
  .lslg{margin-bottom:8px}
  .lslrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px}
  .lsll{font-size:9.5px;color:#555}.lslv{font-size:9.5px;font-weight:600;color:#333}
  .lsli{width:100%;height:4px;border-radius:2px;background:#eee;appearance:none;outline:none;cursor:pointer}
  .lsli::-webkit-slider-thumb{appearance:none;width:12px;height:12px;border-radius:50%;background:#F5A623;box-shadow:0 0 4px rgba(245,166,35,0.4);cursor:pointer}
  .lbgen{width:100%;padding:9px;border-radius:9px;margin-top:8px;background:linear-gradient(135deg,#F5A623,#E8922A);border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 8px rgba(245,166,35,0.3)}
  .lbgen:hover{transform:translateY(-1px)}
  .lgdhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
  .lgdtitle{font-family:'Fraunces',serif;font-size:13px;font-weight:600;color:#1a1a2e}
  .lgddate{font-size:8.5px;color:#2ED8C3;font-weight:500}
  .lcbox{background:#fffbf3;border:1px solid #f5e6c0;border-radius:9px;padding:8px 10px;margin-bottom:8px}
  .lclbl{font-size:7.5px;color:#F5A623;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:3px}
  .lchead{font-family:'Fraunces',serif;font-size:12px;font-weight:600;line-height:1.3;margin-bottom:3px;color:#1a1a2e}
  .lcbody{font-size:9px;color:#666;line-height:1.55}
  .lpi{display:flex;align-items:center;gap:6px;margin-bottom:5px}
  .lpn{width:16px;height:16px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:7.5px;font-weight:700;color:#fff}
  .lpname{font-size:10px;flex:1;color:#333}.lptime{font-size:8.5px;color:#aaa}
  .lpradio{width:11px;height:11px;border-radius:50%;border:1.5px solid #ddd;flex-shrink:0}
  .lpraybox{background:#f8f9fa;border:1px solid #eee;border-radius:7px;padding:7px 9px;margin:8px 0;display:flex;align-items:flex-start;gap:5px}
  .lprayicon{font-size:11px;margin-top:1px}.lpraytxt{font-size:9px;color:#888;line-height:1.5;font-style:italic}
  .lbmark{width:100%;padding:9px;border-radius:9px;background:#2ED8C3;border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 8px rgba(46,216,195,0.3)}
  .lbmark:hover{transform:translateY(-1px)}.lbmark.dn{background:#e8faf8;color:#2ED8C3;box-shadow:none;border:1px solid #b2ede8}
  .ltkgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
  .ltkb{border-radius:9px;padding:8px 4px;border:none;cursor:pointer;color:#fff;font-family:'DM Sans',sans-serif;font-size:8px;font-weight:600;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:all 0.18s;min-height:50px;text-align:center}
  .ltkb:hover{transform:translateY(-2px);filter:brightness(1.08)}.ltkb span{font-size:15px}
  .lprog{display:flex;align-items:center;gap:8px;padding:8px 9px;border-radius:9px;background:#f8f9fa;border:1px solid #eee;cursor:pointer;transition:all 0.18s;margin-bottom:5px}
  .lprog:hover,.lprog.on{border-color:rgba(245,166,35,0.3);background:#fffbf3}
  .lprogic{font-size:17px;flex-shrink:0}.lprognm{font-size:11px;font-weight:600;color:#1a1a2e}.lprogmt{font-size:8.5px;color:#aaa}.lproglk{margin-left:auto;color:#ccc;font-size:12px}
  .ljprompt{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:#F5A623;line-height:1.3;margin-bottom:7px}
  .ljarea{width:100%;min-height:60px;background:#f8f9fa;border:1.5px solid #eee;border-radius:7px;padding:7px 9px;color:#333;font-family:'DM Sans',sans-serif;font-size:10px;resize:none;outline:none;line-height:1.6;transition:border-color 0.18s}
  .ljarea:focus{border-color:#F5A623}.ljarea::placeholder{color:#bbb}
  .lbwrite{width:100%;margin-top:6px;padding:9px;border-radius:8px;background:linear-gradient(135deg,#F5A623,#E8922A);border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.18s;box-shadow:0 2px 8px rgba(245,166,35,0.3)}
  .lbwrite:hover{transform:translateY(-1px)}
  .lpftop{display:flex;align-items:center;gap:9px;margin-bottom:9px}
  .lpfav{width:36px;height:36px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#c8a96e,#8a7048);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;border:2px solid rgba(245,166,35,0.3)}
  .lpfname{font-size:13px;font-weight:600;color:#1a1a2e;display:flex;align-items:center;gap:5px}
  .lpfpro{background:linear-gradient(135deg,#F5A623,#E8922A);color:#fff;font-size:7px;font-weight:700;padding:1.5px 5px;border-radius:100px}
  .lpfstr{font-size:9px;color:#888;margin-top:2px}.lpfstr b{color:#F5A623}
  .lpflnk{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:7px;background:#f8f9fa;border:1px solid #eee;font-size:10px;color:#555;cursor:pointer;transition:all 0.18s;margin-bottom:4px}
  .lpflnk:hover{border-color:rgba(245,166,35,0.2);color:#333}
  .lpfbars{margin-top:8px}.lpfbi{margin-bottom:6px}
  .lpfbr{display:flex;justify-content:space-between;font-size:9px;margin-bottom:3px}
  .lpfbl{color:#555}.lpfbp{color:#aaa}
  .lpfbar{height:4px;border-radius:2px;background:#eee;overflow:hidden}.lpffill{height:100%;border-radius:2px}
  .mnav{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(12,16,24,0.97);backdrop-filter:blur(12px);border-top:1px solid var(--bdr);padding:4px 0 12px;z-index:100}
  .mnavin{display:flex;justify-content:space-around}
  .mni{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:8.5px;color:var(--ts);cursor:pointer;padding:4px 10px;border-radius:6px;transition:color 0.15s}
  .mni.on{color:var(--gold)}.mni svg{width:16px;height:16px}
  @keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cw{0%,100%{height:4px}50%{height:20px}}
  @media(max-width:1100px){.dk-grid{grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,auto);height:auto}.lgrid{grid-template-columns:1fr 1fr}}
  @media(max-width:650px){.dk-grid{grid-template-columns:1fr;height:auto}.lgrid{grid-template-columns:1fr}.dp,.lp{min-height:280px}.tb-nav{display:none}.mnav{display:block}}
  ${CONSULT_CSS}
`;

const TASKS=[{id:1,name:"Do 5-min focus block",color:"#2ED8C3"},{id:2,name:"Call Mom ❤️",color:"#E91E8C"},{id:3,name:"Journal 2 min",color:"#F5A623"}];
const SLIDERS=[{k:"stress",l:"Stress",c:"#FF5C5C"},{k:"energy",l:"Energy",c:"#F5A623"},{k:"focus",l:"Focus",c:"#2ED8C3"},{k:"relationship",l:"Relationship",c:"#9B59B6"}];
const PLAN=[{n:1,name:"Focus",time:"5 min",c:"#2ED8C3"},{n:2,name:"Call Mom",time:"",c:"#E91E8C"},{n:3,name:"Journal",time:"2 min",c:"#F5A623"}];
const TOOLKIT=[{cls:"tkb1",lc:"ltkb tkb1",icon:"🛡️",label:"Boundaries"},{cls:"tkb2",lc:"ltkb tkb2",icon:"💑",label:"Couple Mode"},{cls:"tkb6",lc:"ltkb tkb6",icon:"🎨",label:"Creator"},{cls:"tkb4",lc:"ltkb tkb4",icon:"📋",label:"Life Admin"},{cls:"tkb5",lc:"ltkb tkb5",icon:"🏆",label:"Challenges"},{cls:"tkb3",lc:"ltkb tkb3",icon:"🎭",label:"Roleplay"}];
const PROGS=[{icon:"🎯",name:"Discipline",meta:"17 days",on:true,locked:false},{icon:"🦋",name:"Purpose",meta:"5 easy · 14 days",on:false,locked:true}];
const BARS=[{l:"Mindset",p:65,c:"#2ED8C3"},{l:"Discipline",p:45,c:"#9B59B6"},{l:"Calm",p:55,c:"#F5A623"}];
const LINKS=["✏️ Edit Profile","💳 Manage Subscription","🔔 Notifications"];
const NAV_SVG={
  Home:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Calm:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  Prog:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Tools:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Me:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
};
const DarkNav=({active})=>(<div className="dnav">{[["Home","Home"],["Calm","Calm"],["Prog","Prog"],["Tools","Tools"],["Me","Me"]].map(([l,k])=>(<div key={l} className={`dni ${active===k?"on":""}`}>{NAV_SVG[k]}<span>{l}</span></div>))}</div>);
const LightNav=({active})=>(<div className="lnav">{[["Home","Home"],["Calm","Calm"],["Prog","Prog"],["Tools","Tools"],["Me","Me"]].map(([l,k])=>(<div key={l} className={`lni ${active===k?"on":""}`}>{NAV_SVG[k]}<span>{l}</span></div>))}</div>);
const MacDots=()=>(<div className="lp-dots"><div className="lp-dot" style={{background:"#ff5f57"}}/><div className="lp-dot" style={{background:"#febc2e"}}/><div className="lp-dot" style={{background:"#28c840"}}/></div>);

export default function HomeScreen({onLogout,onCheckIn,onCalm,onPrograms,onToolkit,onJournal,onProfile}){
  const [mood,setMood]=useState(2);
  const [sld,setSld]=useState({stress:4,energy:3,focus:3,relationship:4});
  const [done,setDone]=useState({1:true,2:false,3:false});
  const [dayDone,setDayDone]=useState(false);
  const [nav,setNav]=useState("Home");
  const moods=["😞","😕","😐","🙂","😄"];
  const tog=id=>setDone(p=>({...p,[id]:!p[id]}));

  return(<><style>{S}</style><div className="r">
    <header className="tb">
      <div className="tb-logo">
        <div className="tb-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L8 8H3l3.5 4L5 18l7-3.5L19 18l-1.5-6L21 8h-5L12 2z"/></svg></div>
        <div><div className="tb-name">Being <span>Tchitaka</span></div><div className="tb-sub">— Growth OS —</div></div>
      </div>
      <nav className="tb-nav">{["Home","Calm","Programs","Toolkit","& Profile"].map(n=>(<button key={n} className={`tb-n ${nav===n?"on":""}`} onClick={()=>setNav(n)}>{n}</button>))}</nav>
      <div className="tb-r">
        <div className="tb-bell"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><div className="tb-dot"/></div>
        <div className="tb-av">A</div>
      </div>
    </header>

    <div className="dk-grid">
      {/* D1 HOME */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— HOME —</span><span className="dp-badge">🔔</span></div>
        <div className="dp-body">
          <div className="h-hdr"><div><div className="h-greet">Hello, Alex 🔥</div><div className="h-date">Wednesday, Apr 24</div></div><div className="h-score"><div className="h-sn">72</div><div className="h-sl">SCORE</div></div></div>
          <div className="h-stats"><div className="h-stat"><div className="h-sv">5</div><div className="h-sl2">Streak days</div></div><div className="h-stat"><div className="h-sv t">72%</div><div className="h-sl2">Mindset</div></div></div>
          <button className="bg" onClick={onCheckIn}>Start Check-in →</button>
          <button className="bgh" onClick={onCalm}>🌙 Calm Now (3 min)</button>
          <div className="slbl">Today's Plan <span>···</span></div>
          {TASKS.map(t=>(<div className="task" key={t.id} onClick={()=>tog(t.id)}><div className={`tdot ${done[t.id]?"dn":""}`} style={{color:t.color,borderColor:t.color,...(done[t.id]?{background:t.color}:{})}}/><span className={`tn ${done[t.id]?"dn":""}`}>{t.name}</span><span className={`tck ${done[t.id]?"dn":""}`}>{done[t.id]?"✓":"○"}</span></div>))}
          <div className="qt"><div className="ql">Daily Quote</div><div className="qv">Discipline &gt; Motivation</div></div>
        </div>
        <DarkNav active="Home"/>
      </div>

      {/* D2 CHECK-IN */}
      <div className="dp">
        <div className="ci-h"><div><div className="ci-title">Daily Check-In</div><div className="ci-sub">How are you feeling today?</div></div><div className="ci-badge">← Active</div></div>
        <div className="dp-body">
          <div className="slbl" style={{marginBottom:"7px"}}>Mood</div>
          <div className="mood-r">{moods.map((m,i)=><span key={i} className={`mood ${mood===i?"on":""}`} onClick={()=>setMood(i)}>{m}</span>)}</div>
          {SLIDERS.map(s=>(<div className="slg" key={s.k}><div className="slrow"><span className="sll">{s.l}</span><span className="slv">{sld[s.k]}</span></div><input type="range" className="sli" min="1" max="5" value={sld[s.k]} style={{accentColor:s.c}} onChange={e=>setSld(p=>({...p,[s.k]:+e.target.value}))}/></div>))}
          <button className="bgen">Generate Guidance →</button>
        </div>
        <DarkNav active="Home"/>
      </div>

      {/* D3 GUIDANCE — ✅ ConsultationCard added here */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— GUIDANCE —</span><span className="dp-badge" style={{color:"#2ED8C3"}}>Wed, Apr 24</span></div>
        <div className="dp-body">
          <div className="gdhdr"><div className="gdtitle">Today's Guidance</div><div className="gddate">Wed, Apr 24</div></div>
          <div className="cbox">
            <div className="clbl">⭐ Coach Message</div>
            <div className="chead">Stay calm &amp; take one step at a time.</div>
            <div className="cbody">Your sleep and stress levels have been a challenge, but today you have a fresh start. Take a deep breath and focus on one thing. Call Mom — it will help you and her.</div>
          </div>
          <div className="slbl" style={{marginBottom:"6px"}}>Today's Plan</div>
          {PLAN.map(p=>(<div className="pi" key={p.n}><div className="pn" style={{background:p.c}}>{p.n}</div><span className="pname">{p.name}</span><span className="ptime">{p.time}</span><div className="pradio"/></div>))}
          <div className="praybox"><span className="prayicon">🙏</span><div className="praytxt">Guide my thoughts and calm my heart. Help me act from a place of peace today. Amen.</div></div>

          {/* ✅ PAID CONSULTATION CARD — DARK THEME */}
          <ConsultationCard />

          <button className={`bmark ${dayDone?"dn":""}`} onClick={()=>setDayDone(!dayDone)}>
            {dayDone?"✓ Day Completed!":"Mark Day Complete ✓"}
          </button>
        </div>
        <DarkNav active="Prog"/>
      </div>

      {/* D4 TOOLKIT */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— TOOLKIT —</span></div>
        <div className="dp-body">
          <div className="slbl" style={{marginBottom:"8px"}}>Toolkit</div>
          <div className="tkgrid">{TOOLKIT.map(t=><button key={t.label} className={`tkb ${t.cls}`} onClick={onToolkit}><span>{t.icon}</span>{t.label}</button>)}</div>
          <div style={{marginTop:"10px",borderTop:"1px solid var(--bdr)",paddingTop:"10px"}}>
            <div className="dp-lbl" style={{marginBottom:"8px"}}>— PROFILE —</div>
            <div className="pftop"><div className="pfav">A</div><div><div className="pfname">Alex <span className="pfpro">PRO</span></div><div className="pfstr">🔥 Streak: <b>5 days</b></div></div></div>
            {LINKS.map(l=><div className="pflnk" key={l} onClick={onProfile}>{l}</div>)}
            <div className="pfbar">{BARS.map(b=>(<div className="pfbi" key={b.l}><div className="pfbr"><span className="pfbl">{b.l}</span><span className="pfbp">{b.p}%</span></div><div className="pfb"><div className="pff" style={{width:`${b.p}%`,background:b.c}}/></div></div>))}</div>
          </div>
        </div>
        <DarkNav active="Tools"/>
      </div>

      {/* D5 CALM */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— CALM —</span></div>
        <div className="dp-body">
          <div className="calmbox">
            <div className="cwaves">{[7,12,18,23,18,12,7].map((h,i)=><div key={i} className="cwave" style={{height:`${h}px`,animationDelay:`${i*0.1}s`}}/>)}</div>
            <button className="cplay"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg></button>
            <div className="ctitle">3-Min Session</div><div className="csub">Breathe &amp; reset</div>
          </div>
        </div>
        <DarkNav active="Calm"/>
      </div>

      {/* D6 PROGRAMS */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— PROGRAMS —</span></div>
        <div className="dp-body">
          <div className="slbl" style={{marginBottom:"8px"}}>Programs</div>
          {PROGS.map(p=>(<div key={p.name} className={`prog ${p.on?"on":""}`} onClick={p.on?onPrograms:undefined}><span className="progic">{p.icon}</span><div><div className="prognm">{p.name}</div><div className="progmt">{p.meta}</div></div>{p.locked&&<span className="proglk">🔒</span>}</div>))}
        </div>
        <DarkNav active="Prog"/>
      </div>

      {/* D7 JOURNAL */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— JOURNAL —</span><span className="dp-badge">✏️</span></div>
        <div className="dp-body">
          <div className="slbl" style={{marginBottom:"5px"}}>Today Prompt</div>
          <div className="jprompt">What am I grateful for?</div>
          <textarea className="jarea" placeholder="Start writing your thoughts here..." rows={3}/>
          <button className="bwrite" onClick={onJournal}>✏️ Save Entry</button>
        </div>
        <DarkNav active="Home"/>
      </div>

      {/* D8 PROFILE */}
      <div className="dp">
        <div className="dp-top"><span className="dp-lbl">— PROFILE —</span><span className="dp-badge">···</span></div>
        <div className="dp-body">
          <div className="pftop"><div className="pfav">A</div><div><div className="pfname">Alex <span className="pfpro">PRO</span></div><div className="pfstr">🔥 Streak: <b>5 days</b></div></div></div>
          {LINKS.map(l=><div className="pflnk" key={l}>{l}</div>)}
          <div className="pfbar">{BARS.map(b=>(<div className="pfbi" key={b.l}><div className="pfbr"><span className="pfbl">{b.l}</span><span className="pfbp">{b.p}%</span></div><div className="pfb"><div className="pff" style={{width:`${b.p}%`,background:b.c}}/></div></div>))}</div>
          {onLogout&&<button className="bso" onClick={onLogout}>Sign Out</button>}
        </div>
        <DarkNav active="Me"/>
      </div>
    </div>

    <div className="divider"><div className="divline"/><div className="divlbl">🌤 Light Theme View</div><div className="divline"/></div>

    <div className="ls"><div className="lgrid">
      {/* L1 HOME */}
      <div className="lp">
        <div className="lp-bar"><MacDots/><div className="lp-title">HOME</div><div className="lp-right">🔔</div></div>
        <div className="lp-body">
          <div className="lh-hdr"><div><div className="lh-greet">Hello, Alex 🔥</div><div className="lh-date">Wednesday, Apr 24</div></div><div className="lh-score"><div className="lh-sn">72</div><div className="lh-sl">SCORE</div></div></div>
          <div className="lh-stats"><div className="lh-stat"><div className="lh-sv">5</div><div className="lh-sl2">Streak days</div></div><div className="lh-stat"><div className="lh-sv" style={{color:"#2ED8C3",fontSize:"14px"}}>72%</div><div className="lh-sl2">Mindset</div></div></div>
          <button className="lbg">Start Check-in →</button>
          <button className="lbgh">🌙 Calm Now (3 min)</button>
          <div className="lslbl">Today's Plan <span>Done</span></div>
          {TASKS.map(t=>(<div className="ltask" key={t.id} onClick={()=>tog(t.id)}><div className={`ltdot ${done[t.id]?"dn":""}`} style={{color:t.color,borderColor:t.color,...(done[t.id]?{background:t.color}:{})}}/><span className={`ltn ${done[t.id]?"dn":""}`}>{t.name}</span><span className={`ltck ${done[t.id]?"dn":""}`}>{done[t.id]?"✓":"○"}</span></div>))}
          <div className="lqt"><div className="lql">Daily Quote</div><div className="lqv">Discipline &gt; Motivation</div></div>
        </div>
        <LightNav active="Home"/>
      </div>

      {/* L2 CHECK-IN */}
      <div className="lp">
        <div className="lci-h"><div><div className="lci-title">Daily Check-in</div><div className="lci-sub">How are you feeling today?</div></div><div className="lci-badge">← Active</div></div>
        <div className="lp-body">
          <div className="lslbl" style={{marginBottom:"7px"}}>Mood</div>
          <div className="lmoodr">{moods.map((m,i)=><span key={i} className={`lmood ${mood===i?"on":""}`} onClick={()=>setMood(i)}>{m}</span>)}</div>
          {SLIDERS.map(s=>(<div className="lslg" key={s.k}><div className="lslrow"><span className="lsll">{s.l}</span><span className="lslv">{sld[s.k]}</span></div><input type="range" className="lsli" min="1" max="5" value={sld[s.k]} style={{accentColor:s.c}} onChange={e=>setSld(p=>({...p,[s.k]:+e.target.value}))}/></div>))}
          <button className="lbgen">Generate Guidance →</button>
        </div>
        <LightNav active="Home"/>
      </div>

      {/* L3 GUIDANCE — ✅ LightConsultationCard added here */}
      <div className="lp">
        <div className="lp-bar"><MacDots/><div className="lp-title">GUIDANCE</div><div className="lp-right" style={{color:"#2ED8C3"}}>Wed, Apr 24</div></div>
        <div className="lp-body">
          <div className="lgdhdr"><div className="lgdtitle">Today's Guidance</div><div className="lgddate">Wed, Apr 24</div></div>
          <div className="lcbox">
            <div className="lclbl">⭐ Coach Message</div>
            <div className="lchead">Stay calm &amp; take one step at a time.</div>
            <div className="lcbody">Your sleep and stress levels have been a challenge, but today you have a fresh start. Take a deep breath and focus on one thing. Call Mom — it will help you and her.</div>
          </div>
          <div className="lslbl" style={{marginBottom:"6px"}}>Today's Plan</div>
          {PLAN.map(p=>(<div className="lpi" key={p.n}><div className="lpn" style={{background:p.c}}>{p.n}</div><span className="lpname">{p.name}</span><span className="lptime">{p.time}</span><div className="lpradio"/></div>))}
          <div className="lpraybox"><span className="lprayicon">🙏</span><div className="lpraytxt">Guide my thoughts and calm my heart. Help me act from a place of peace today. Amen.</div></div>

          {/* ✅ PAID CONSULTATION CARD — LIGHT THEME */}
          <LightConsultationCard />

          <button className={`lbmark ${dayDone?"dn":""}`} onClick={()=>setDayDone(!dayDone)}>
            {dayDone?"✓ Day Completed!":"Mark Day Complete ✓"}
          </button>
        </div>
        <LightNav active="Prog"/>
      </div>

      {/* L4 TOOLKIT + PROFILE */}
      <div className="lp">
        <div className="lp-bar"><MacDots/><div className="lp-title">TOOLKIT</div><div className="lp-right">···</div></div>
        <div className="lp-body">
          <div className="lslbl" style={{marginBottom:"8px"}}>Toolkit</div>
          <div className="ltkgrid">{TOOLKIT.map(t=><button key={t.label} className={t.lc}><span>{t.icon}</span>{t.label}</button>)}</div>
          <div style={{marginTop:"10px",borderTop:"1px solid #f0f0f0",paddingTop:"10px"}}>
            <div className="lslbl" style={{color:"#aaa",letterSpacing:"2px",fontSize:"8px",textTransform:"uppercase",marginBottom:"8px"}}>— PROFILE —</div>
            <div className="lpftop"><div className="lpfav">A</div><div><div className="lpfname">Alex <span className="lpfpro">PRO</span></div><div className="lpfstr">🔥 Streak: <b>5 days</b></div></div></div>
            {LINKS.map(l=><div className="lpflnk" key={l}>{l}</div>)}
            <div className="lpfbars">{BARS.map(b=>(<div className="lpfbi" key={b.l}><div className="lpfbr"><span className="lpfbl">{b.l}</span><span className="lpfbp">{b.p}%</span></div><div className="lpfbar"><div className="lpffill" style={{width:`${b.p}%`,background:b.c}}/></div></div>))}</div>
          </div>
        </div>
        <LightNav active="Tools"/>
      </div>
    </div></div>

    <nav className="mnav"><div className="mnavin">{[["Home","Home"],["Calm","Calm"],["Programs","Prog"],["Toolkit","Tools"],["Me","Me"]].map(([label,key])=>(<div key={label} className={`mni ${nav===label?"on":""}`} onClick={()=>setNav(label)}>{NAV_SVG[key]}{label}</div>))}</div></nav>
  </div></>);
}
