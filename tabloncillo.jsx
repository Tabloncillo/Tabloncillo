import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// TABLONCILLO V3 — BALONCESTO HABANERO
// Share Cards · PWA Install · Offline Banner · Enhanced UX
// ═══════════════════════════════════════════════════════════

const PIN="1976";
const TEAMS=[
  {id:"PLY",name:"Tiburones",zone:"Playa",c:"#0077B6",a:"#90E0EF"},
  {id:"CRO",name:"Cimarrones",zone:"Cerro",c:"#B5151D",a:"#FFD166"},
  {id:"D10",name:"Huracanes",zone:"Diez de Octubre",c:"#FF6B00",a:"#FFF"},
  {id:"CTH",name:"Gladiadores",zone:"Centro Habana",c:"#6A0572",a:"#F49FBC"},
  {id:"HVJ",name:"Corsarios",zone:"Habana Vieja",c:"#1B4332",a:"#D4A373"},
  {id:"MRN",name:"Alacranes",zone:"Marianao",c:"#023E8A",a:"#48CAE4"},
  {id:"LIS",name:"Panteras",zone:"La Lisa",c:"#212529",a:"#F8F9FA"},
  {id:"REG",name:"Mambises",zone:"Regla",c:"#9B2226",a:"#EE9B00"},
  {id:"GBK",name:"Gallos",zone:"Guanabacoa",c:"#2D6A4F",a:"#95D5B2"},
  {id:"BOY",name:"Águilas",zone:"Boyeros",c:"#3C096C",a:"#E0AAFF"},
  {id:"ARN",name:"Caribes",zone:"Arroyo Naranjo",c:"#774936",a:"#FFB703"},
  {id:"COT",name:"Caimanes",zone:"Cotorro",c:"#006D77",a:"#83C5BE"},
  {id:"SMP",name:"Dragones",zone:"San Miguel",c:"#D62828",a:"#F77F00"},
  {id:"PLZ",name:"Capitales",zone:"Plaza",c:"#1D3557",a:"#A8DADC"},
];
const gt=id=>TEAMS.find(t=>t.id===id)||TEAMS[0];
const F="'Barlow Condensed',-apple-system,sans-serif";
const BG="#0F0E0C",AC="#FF6B35",GD="#F0B429",GN="#2ECC71";
const CD={background:"#1A1917",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,overflow:"hidden"};
const CP={...CD,padding:"14px 16px"};

const LSB=[
  {y:"2023",ch:"Santiago de Cuba"},{y:"2022",ch:"Ciego de Ávila"},{y:"2019",ch:"Guantánamo"},
  {y:"2018",ch:"Pinar del Río"},{y:"2017",ch:"Capitalinos"},{y:"2016",ch:"Ciego de Ávila"},
  {y:"2015",ch:"Capitalinos"},{y:"2013",ch:"Guantánamo"},{y:"2012",ch:"Ciego de Ávila"},
  {y:"2010",ch:"Capitalinos"},{y:"2009",ch:"Capitalinos"},{y:"2008",ch:"Capitalinos"},
  {y:"2007",ch:"Ciego de Ávila"},{y:"2006",ch:"Ciego de Ávila"},{y:"2005",ch:"Ciego de Ávila"},
  {y:"2004",ch:"Ciego de Ávila"},{y:"2003",ch:"Ciego de Ávila"},{y:"2002",ch:"Ciego de Ávila"},
  {y:"2001",ch:"Ciego de Ávila"},{y:"2000",ch:"Santiago de Cuba"},{y:"1999",ch:"Santiago de Cuba"},
  {y:"1998",ch:"Santiago de Cuba"},{y:"1997",ch:"Ciego de Ávila"},{y:"1996",ch:"Ciego de Ávila"},
  {y:"1995",ch:"Ciudad de La Habana"},{y:"1994",ch:"Santiago de Cuba"},{y:"1993",ch:"Santiago de Cuba"},
];
const PROV=[
  {n:"Ciego de Ávila",t:10,c:"#FF8C00"},{n:"Santiago de Cuba",t:6,c:"#B5151D"},
  {n:"La Habana",t:5,c:"#1D3557"},{n:"Guantánamo",t:2,c:"#2D6A4F"},
  {n:"Pinar del Río",t:1,c:"#006D77"},{n:"Las Tunas",t:0,c:"#774936"},
  {n:"Camagüey",t:0,c:"#9B2226"},{n:"Artemisa",t:0,c:"#3C096C"},
];
const INTL=[
  {y:"1972",e:"Olímpicos Múnich",r:"🥉 Bronce",n:"Única medalla olímpica del Caribe"},
  {y:"1980",e:"Olímpicos Moscú",r:"6to lugar"},
  {y:"1995",e:"Centrobasket",r:"🥇"},{y:"1997",e:"Centrobasket",r:"🥇"},
  {y:"1999",e:"Centrobasket",r:"🥇"},
  {y:"2024",e:"Clasif. AmeriCup",r:"🔥 Victoria sobre EE.UU.",n:"Histórica en La Habana"},
];

const S={
  async get(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null}catch{return null}},
  async set(k,v){try{await window.storage.set(k,JSON.stringify(v))}catch(e){console.error(e)}},
  async list(p){try{const r=await window.storage.list(p);return r?.keys||[]}catch{return[]}},
};

function Badge({id,sz=28}){const t=gt(id);return<div style={{width:sz,height:sz,borderRadius:sz*.3,background:`linear-gradient(135deg,${t.c},${t.c}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.3,fontWeight:900,color:t.a,fontFamily:F,letterSpacing:.5,flexShrink:0}}>{id}</div>}

// ─── SHARE CARD GENERATOR (Canvas → Image → WhatsApp) ──
function useShareCard(){
  const generate=useCallback(async(game)=>{
    const h=gt(game.home),a=gt(game.away);
    const W=600,H=380;const c=document.createElement("canvas");c.width=W;c.height=H;
    const x=c.getContext("2d");
    // Background
    const grad=x.createLinearGradient(0,0,W,H);grad.addColorStop(0,"#0F0E0C");grad.addColorStop(1,"#1A1917");
    x.fillStyle=grad;x.fillRect(0,0,W,H);
    // Top accent bar
    const bar=x.createLinearGradient(0,0,W,0);bar.addColorStop(0,a.c);bar.addColorStop(0.5,AC);bar.addColorStop(1,h.c);
    x.fillStyle=bar;x.fillRect(0,0,W,4);
    // Title
    x.fillStyle="#FF6B35";x.font="bold 14px sans-serif";x.textAlign="center";x.fillText("🏀 TABLONCILLO — BALONCESTO HABANERO",W/2,30);
    // Away team
    x.fillStyle=a.c;x.beginPath();x.roundRect(30,50,120,120,12);x.fill();
    x.fillStyle=a.a;x.font="bold 32px sans-serif";x.textAlign="center";x.fillText(game.away,90,105);
    x.fillStyle="#fff";x.font="bold 14px sans-serif";x.fillText(a.name,90,130);
    x.fillStyle="#aaa";x.font="12px sans-serif";x.fillText(a.zone,90,148);
    // Home team
    x.fillStyle=h.c;x.beginPath();x.roundRect(W-150,50,120,120,12);x.fill();
    x.fillStyle=h.a;x.font="bold 32px sans-serif";x.textAlign="center";x.fillText(game.home,W-90,105);
    x.fillStyle="#fff";x.font="bold 14px sans-serif";x.fillText(h.name,W-90,130);
    x.fillStyle="#aaa";x.font="12px sans-serif";x.fillText(h.zone,W-90,148);
    // Score
    const aw=game.as>game.hs,hw=game.hs>game.as;
    x.font="bold 64px sans-serif";x.textAlign="center";
    x.fillStyle=aw?"#fff":"#555";x.fillText(String(game.as),W/2-50,120);
    x.fillStyle="#333";x.font="bold 32px sans-serif";x.fillText("—",W/2,115);
    x.font="bold 64px sans-serif";
    x.fillStyle=hw?"#fff":"#555";x.fillText(String(game.hs),W/2+50,120);
    // FINAL badge
    x.fillStyle=GN;x.font="bold 12px sans-serif";x.fillText("FINAL",W/2,148);
    // Top 3 players
    if(game.ps?.length){
      const top=[...game.ps].sort((a,b)=>b.pts-a.pts).slice(0,3);
      x.fillStyle="rgba(255,255,255,0.04)";x.beginPath();x.roundRect(30,185,W-60,130,10);x.fill();
      x.fillStyle=GD;x.font="bold 12px sans-serif";x.textAlign="left";x.fillText("⭐ LÍDERES",46,210);
      top.forEach((p,i)=>{
        const y=230+i*30;const t2=gt(p.tm);
        x.fillStyle=t2.c;x.beginPath();x.roundRect(46,y-12,16,16,4);x.fill();
        x.fillStyle=t2.a;x.font="bold 8px sans-serif";x.textAlign="center";x.fillText(p.tm,54,y+1);
        x.textAlign="left";x.fillStyle="#ddd";x.font="bold 13px sans-serif";x.fillText(p.nm,70,y+2);
        x.fillStyle=AC;x.font="bold 13px sans-serif";x.fillText(`${p.pts}pts`,340,y+2);
        x.fillStyle="#b388ff";x.fillText(`${p.reb}reb`,400,y+2);
        x.fillStyle="#64ffda";x.fillText(`${p.ast}ast`,456,y+2);
        x.fillStyle="#888";x.font="11px sans-serif";x.fillText(`${t2.zone}`,510,y+2);
      });
    }
    // Footer
    x.fillStyle="#555";x.font="10px sans-serif";x.textAlign="center";
    x.fillText(`📅 ${game.dt}${game.loc?" · 📍 "+game.loc:""}`,W/2,H-30);
    x.fillStyle="#333";x.fillText("#BaloncestoHabanero #Tabloncillo",W/2,H-14);
    return c.toDataURL("image/png");
  },[]);
  return{generate};
}

function ShareBtn({game}){
  const{generate}=useShareCard();const[sharing,setSharing]=useState(false);
  const share=async()=>{
    setSharing(true);
    const h=gt(game.home),a=gt(game.away);
    let txt=`🏀 TABLONCILLO\n${a.name} (${a.zone}) ${game.as} — ${game.hs} ${h.name} (${h.zone})\n`;
    if(game.ps?.length){const top=[...game.ps].sort((x,y)=>y.pts-x.pts).slice(0,3);txt+=`\n⭐ Líderes:\n`;top.forEach(p=>{txt+=`${p.nm} (${gt(p.tm).zone}) — ${p.pts}pts ${p.reb}reb ${p.ast}ast\n`})}
    txt+=`\n📅 ${game.dt}${game.loc?" · "+game.loc:""}\n#BaloncestoHabanero #Tabloncillo`;
    try{
      const imgUrl=await generate(game);
      const blob=await(await fetch(imgUrl)).blob();
      const file=new File([blob],"tabloncillo.png",{type:"image/png"});
      if(navigator.canShare?.({files:[file]})){await navigator.share({text:txt,files:[file]})}
      else if(navigator.share){await navigator.share({text:txt})}
      else{window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank")}
    }catch{
      try{if(navigator.share)await navigator.share({text:txt});else window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank")}catch{}
    }
    setSharing(false);
  };
  return<button onClick={share} disabled={sharing} style={{display:"flex",alignItems:"center",gap:4,background:"#25D366",border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:F,letterSpacing:1,opacity:sharing?.6:1}}>{sharing?"...":"📤 COMPARTIR"}</button>
}

// ─── PREVIEW CARD (visual in-app) ───────────────────────
function GameCard({game}){
  const h=gt(game.home),a=gt(game.away);const hw=game.hs>game.as,aw=game.as>game.hs;
  const top=game.ps?[...game.ps].sort((x,y)=>y.pts-x.pts).slice(0,2):[];
  return<div style={{background:`linear-gradient(135deg,${a.c}11,#1A1917,${h.c}11)`,border:"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"14px 16px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${a.c},${AC},${h.c})`}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
          <Badge id={game.away} sz={22}/>
          <span style={{fontSize:13,fontWeight:aw?800:500,color:aw?"#fff":"#999",fontFamily:F,flex:1}}>{a.name}<span style={{color:"#555",fontSize:10,fontWeight:400,marginLeft:4}}>{a.zone}</span></span>
          <span style={{fontSize:18,fontWeight:900,color:aw?"#fff":"#555",fontFamily:F,fontVariantNumeric:"tabular-nums",width:32,textAlign:"right"}}>{game.as}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Badge id={game.home} sz={22}/>
          <span style={{fontSize:13,fontWeight:hw?800:500,color:hw?"#fff":"#999",fontFamily:F,flex:1}}>{h.name}<span style={{color:"#555",fontSize:10,fontWeight:400,marginLeft:4}}>{h.zone}</span></span>
          <span style={{fontSize:18,fontWeight:900,color:hw?"#fff":"#555",fontFamily:F,fontVariantNumeric:"tabular-nums",width:32,textAlign:"right"}}>{game.hs}</span>
        </div>
      </div>
      <div style={{textAlign:"right",marginLeft:12,minWidth:55}}>
        <div style={{fontSize:9,fontWeight:700,color:game.live?"#ff3b30":GN,letterSpacing:1,fontFamily:F}}>{game.live?"🔴 VIVO":"FINAL"}</div>
        <div style={{fontSize:8,color:"#444",marginTop:2}}>{game.dt}</div>
        {game.loc&&<div style={{fontSize:8,color:"#333",marginTop:1}}>{game.loc}</div>}
      </div>
    </div>
    {top.length>0&&<div style={{display:"flex",gap:8,marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.04)"}}>
      {top.map((p,i)=>{const t2=gt(p.tm);return<div key={i} style={{display:"flex",alignItems:"center",gap:4,flex:1}}>
        <div style={{width:6,height:6,borderRadius:3,background:t2.c,flexShrink:0}}/>
        <span style={{fontSize:9,color:"#888",fontFamily:F,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.nm}</span>
        <span style={{fontSize:10,fontWeight:800,color:AC,fontFamily:F,marginLeft:"auto",flexShrink:0}}>{p.pts}</span>
      </div>})}
    </div>}
  </div>
}

function BoxTable({players,teamId}){
  const t=gt(teamId);if(!players?.length)return null;
  return<div style={{marginBottom:12}}>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><Badge id={teamId} sz={18}/><span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>{t.name} — {t.zone}</span>
      <span style={{marginLeft:"auto",fontSize:12,fontWeight:900,color:AC,fontFamily:F}}>{players.reduce((s,p)=>s+p.pts,0)}</span></div>
    <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:10,fontFamily:F}}>
      <thead><tr>{["","MIN","PTS","REB","AST","ROB","BLQ","TC%"].map((h,i)=><th key={i} style={{padding:"4px 5px",textAlign:i?"center":"left",color:"#555",fontWeight:700,fontSize:8,letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,.04)"}}>{h}</th>)}</tr></thead>
      <tbody>{players.sort((a,b)=>b.pts-a.pts).map((p,i)=>{const fg=p.fga>0?Math.round(p.fgm/p.fga*100):0;return(
        <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,.02)"}}>
          <td style={{padding:"5px 5px",color:"#ddd",fontWeight:600,whiteSpace:"nowrap"}}><span style={{color:t.a,fontSize:9,marginRight:4}}>#{p.num}</span>{p.nm}</td>
          <td style={{textAlign:"center",color:"#666"}}>{p.min}</td>
          <td style={{textAlign:"center",color:p.pts>=20?AC:p.pts>=10?"#fff":"#aaa",fontWeight:700}}>{p.pts}</td>
          <td style={{textAlign:"center",color:"#b388ff"}}>{p.reb}</td>
          <td style={{textAlign:"center",color:"#64ffda"}}>{p.ast}</td>
          <td style={{textAlign:"center",color:GD}}>{p.stl}</td>
          <td style={{textAlign:"center",color:"#ff6b6b"}}>{p.blk}</td>
          <td style={{textAlign:"center",color:fg>=50?GN:"#888"}}>{fg}%</td>
        </tr>)})}</tbody>
    </table></div></div>
}

// ─── SCORES ─────────────────────────────────────────────
function ScoresView({games,schedule,onTeam}){
  const[exp,setExp]=useState(null);
  const upcoming=schedule.filter(s=>s.st==="sched").sort((a,b)=>new Date(a.dt)-new Date(b.dt));
  return<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {games.length>0&&<div style={{fontSize:12,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>RESULTADOS</div>}
    {games.map(g=>{const ex=exp===g.id;return<div key={g.id}>
      <div onClick={()=>setExp(ex?null:g.id)} style={{cursor:"pointer"}}><GameCard game={g}/></div>
      {ex&&<div style={{...CP,marginTop:-1,borderTop:"none",borderTopLeftRadius:0,borderTopRightRadius:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:10,color:"#555"}}>📍 {g.loc||"—"} · {g.dt}</span>
          <ShareBtn game={g}/>
        </div>
        <BoxTable players={g.ps?.filter(p=>p.tm===g.away)} teamId={g.away}/>
        <BoxTable players={g.ps?.filter(p=>p.tm===g.home)} teamId={g.home}/>
      </div>}
    </div>})}
    {!games.length&&<div style={{textAlign:"center",padding:40,color:"#555",fontSize:12}}>No hay juegos aún</div>}
    {upcoming.length>0&&<>
      <div style={{fontSize:12,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F,marginTop:8}}>PRÓXIMOS</div>
      {upcoming.map(s=>{const h=gt(s.home),a=gt(s.away);return<div key={s.id} style={{...CD,padding:"12px 14px",opacity:.7}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><Badge id={s.away} sz={22}/><span style={{fontSize:13,fontWeight:500,color:"#999",fontFamily:F}}>{a.name} <span style={{color:"#555",fontSize:10}}>{a.zone}</span></span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Badge id={s.home} sz={22}/><span style={{fontSize:13,fontWeight:500,color:"#999",fontFamily:F}}>{h.name} <span style={{color:"#555",fontSize:10}}>{h.zone}</span></span></div>
          </div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:700,color:"#888",fontFamily:F}}>{s.time||"TBD"}</div><div style={{fontSize:8,color:"#444",marginTop:2}}>{s.dt}</div>{s.loc&&<div style={{fontSize:8,color:"#333",marginTop:1}}>{s.loc}</div>}</div>
        </div>
      </div>})}</>}
  </div>
}

function StandView({games,onTeam}){
  const rec={};TEAMS.forEach(t=>{rec[t.id]={w:0,l:0,pf:0,pa:0}});
  games.forEach(g=>{const hw=g.hs>g.as;rec[g.home].w+=hw?1:0;rec[g.home].l+=hw?0:1;rec[g.home].pf+=g.hs;rec[g.home].pa+=g.as;rec[g.away].w+=hw?0:1;rec[g.away].l+=hw?1:0;rec[g.away].pf+=g.as;rec[g.away].pa+=g.hs});
  const sorted=TEAMS.map(t=>({...t,...rec[t.id],pct:rec[t.id].w+rec[t.id].l>0?rec[t.id].w/(rec[t.id].w+rec[t.id].l):0})).sort((a,b)=>b.pct-a.pct||b.pf-a.pf);
  return<div style={CD}>
    <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,.06)"}}><span style={{fontSize:13,fontWeight:900,color:"#fff",letterSpacing:2,fontFamily:F}}>POSICIONES — LIGA HABANA</span></div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:F}}>
      <thead><tr>{["#","","G","P","PCT","DIF"].map((h,i)=><th key={i} style={{padding:"6px 8px",textAlign:i<2?"left":"center",color:"#555",fontWeight:700,fontSize:8,letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,.04)",width:i===0?24:"auto"}}>{h}</th>)}</tr></thead>
      <tbody>{sorted.map((t,i)=><tr key={t.id} onClick={()=>onTeam(t.id)} style={{borderBottom:"1px solid rgba(255,255,255,.02)",background:i<4?"rgba(255,107,53,.02)":"transparent",cursor:"pointer"}}>
        <td style={{padding:"7px 8px",color:i<4?AC:"#555",fontWeight:900,fontSize:11}}>{i+1}</td>
        <td style={{padding:"7px 8px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Badge id={t.id} sz={18}/><span style={{color:"#ddd",fontWeight:600}}>{t.name}</span><span style={{color:"#555",fontSize:9}}>{t.zone}</span></div></td>
        <td style={{textAlign:"center",color:GN,fontWeight:700}}>{t.w}</td><td style={{textAlign:"center",color:"#888"}}>{t.l}</td>
        <td style={{textAlign:"center",color:"#aaa",fontWeight:600}}>{t.pct?t.pct.toFixed(3).slice(1):"—"}</td>
        <td style={{textAlign:"center",color:t.pf-t.pa>0?GN:t.pf-t.pa<0?"#ff6b6b":"#555",fontWeight:600}}>{t.pf-t.pa>0?"+":""}{t.pf-t.pa||"—"}</td>
      </tr>)}</tbody>
    </table>
    <div style={{padding:"8px 16px",borderTop:"1px solid rgba(255,255,255,.04)",fontSize:9,color:"#555"}}><span style={{color:AC}}>■</span> Top 4 → Playoffs (mejor de 5)</div>
  </div>
}

function LeadersView({games,onTeam}){
  const allP={};games.forEach(g=>{g.ps?.forEach(p=>{const k=`${p.nm}_${p.tm}`;if(!allP[k])allP[k]={nm:p.nm,tm:p.tm,num:p.num,gp:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0};allP[k].gp++;allP[k].pts+=p.pts;allP[k].reb+=p.reb;allP[k].ast+=p.ast;allP[k].stl+=p.stl;allP[k].blk+=p.blk;allP[k].fgm+=p.fgm;allP[k].fga+=p.fga})});
  const all=Object.values(allP);
  const cats=[{k:"pts",l:"ANOTADORES",c:AC,ic:"🔥"},{k:"reb",l:"REBOTEADORES",c:"#b388ff",ic:"💪"},{k:"ast",l:"ASISTENTES",c:"#64ffda",ic:"🎯"},{k:"stl",l:"ROBOS",c:GD,ic:"👋"},{k:"blk",l:"BLOQUEOS",c:"#ff6b6b",ic:"🖐️"}];
  if(!all.length)return<div style={{textAlign:"center",padding:40,color:"#555"}}>Se necesitan más juegos</div>;
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{fontSize:14,fontWeight:900,color:"#fff",letterSpacing:2,fontFamily:F}}>📈 LÍDERES</div>
    {cats.map(cat=>{const sorted=[...all].sort((a,b)=>(b[cat.k]/b.gp)-(a[cat.k]/a.gp)).slice(0,5);return<div key={cat.k} style={CD}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:6}}><span>{cat.ic}</span><span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>{cat.l}</span><span style={{fontSize:9,color:"#555",marginLeft:"auto"}}>POR JUEGO</span></div>
      {sorted.map((p,i)=>{const t=gt(p.tm);const avg=(p[cat.k]/p.gp).toFixed(1);return<div key={i} onClick={()=>onTeam(p.tm)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,.02)",cursor:"pointer"}}>
        <span style={{fontSize:14,fontWeight:900,color:i===0?cat.c:"#555",width:20,fontFamily:F}}>{i+1}</span>
        <Badge id={p.tm} sz={20}/><div style={{flex:1}}><div style={{fontSize:12,color:"#ddd",fontWeight:600,fontFamily:F}}>{p.nm}</div><div style={{fontSize:9,color:"#555"}}>{t.name} · #{p.num} · {p.gp}J</div></div>
        <span style={{fontSize:18,fontWeight:900,color:cat.c,fontFamily:F}}>{avg}</span>
      </div>})}
    </div>})}
  </div>
}

function TeamPage({teamId,games,onBack}){
  const t=gt(teamId);const tg=games.filter(g=>g.home===teamId||g.away===teamId);
  const w=tg.filter(g=>(g.home===teamId&&g.hs>g.as)||(g.away===teamId&&g.as>g.hs)).length;const l=tg.length-w;
  const roster={};tg.forEach(g=>{g.ps?.filter(p=>p.tm===teamId).forEach(p=>{const k=`${p.nm}_${p.num}`;if(!roster[k])roster[k]={nm:p.nm,num:p.num,gp:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,min:0};roster[k].gp++;roster[k].pts+=p.pts;roster[k].reb+=p.reb;roster[k].ast+=p.ast;roster[k].stl+=p.stl;roster[k].blk+=p.blk;roster[k].fgm+=p.fgm;roster[k].fga+=p.fga;roster[k].min+=p.min})});
  const players=Object.values(roster).sort((a,b)=>(b.pts/b.gp)-(a.pts/a.gp));
  const rivals={};tg.forEach(g=>{const opp=g.home===teamId?g.away:g.home;if(!rivals[opp])rivals[opp]={w:0,l:0};const won=(g.home===teamId&&g.hs>g.as)||(g.away===teamId&&g.as>g.hs);rivals[opp][won?"w":"l"]++});
  // Streak
  const streak=tg.slice(0,5).map(g=>(g.home===teamId&&g.hs>g.as)||(g.away===teamId&&g.as>g.hs));
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#888",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F,textAlign:"left",padding:0}}>← VOLVER</button>
    <div style={{...CP,background:`linear-gradient(135deg,${t.c}22,#1A1917)`,borderColor:`${t.c}44`}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Badge id={teamId} sz={48}/><div style={{flex:1}}>
          <div style={{fontSize:22,fontWeight:900,color:"#fff",fontFamily:F}}>{t.name}</div>
          <div style={{fontSize:12,color:"#888"}}>{t.zone}</div>
          {streak.length>0&&<div style={{display:"flex",gap:3,marginTop:4}}>{streak.map((w2,i)=><div key={i} style={{width:14,height:14,borderRadius:4,background:w2?GN:"#ff3b30",fontSize:8,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{w2?"V":"D"}</div>)}</div>}
        </div>
        <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:900,color:GN,fontFamily:F}}>{w}<span style={{color:"#555"}}>-</span><span style={{color:"#ff6b6b"}}>{l}</span></div><div style={{fontSize:8,color:"#555",letterSpacing:1}}>RÉCORD</div></div>
      </div>
    </div>
    {players.length>0&&<div style={CD}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.06)"}}><span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>PLANTILLA — PROMEDIOS</span></div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:10,fontFamily:F}}>
        <thead><tr>{["","JG","PTS","REB","AST","ROB","BLQ","TC%"].map((h,i)=><th key={i} style={{padding:"5px 6px",textAlign:i?"center":"left",color:"#555",fontWeight:700,fontSize:8,letterSpacing:1,borderBottom:"1px solid rgba(255,255,255,.04)"}}>{h}</th>)}</tr></thead>
        <tbody>{players.map((p,i)=>{const fg=p.fga>0?Math.round(p.fgm/p.fga*100):0;return<tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,.02)"}}>
          <td style={{padding:"5px 6px",color:"#ddd",fontWeight:600,whiteSpace:"nowrap"}}><span style={{color:t.a,fontSize:9,marginRight:4}}>#{p.num}</span>{p.nm}</td>
          <td style={{textAlign:"center",color:"#666"}}>{p.gp}</td>
          <td style={{textAlign:"center",color:AC,fontWeight:700}}>{(p.pts/p.gp).toFixed(1)}</td>
          <td style={{textAlign:"center",color:"#b388ff"}}>{(p.reb/p.gp).toFixed(1)}</td>
          <td style={{textAlign:"center",color:"#64ffda"}}>{(p.ast/p.gp).toFixed(1)}</td>
          <td style={{textAlign:"center",color:GD}}>{(p.stl/p.gp).toFixed(1)}</td>
          <td style={{textAlign:"center",color:"#ff6b6b"}}>{(p.blk/p.gp).toFixed(1)}</td>
          <td style={{textAlign:"center",color:fg>=50?GN:"#888"}}>{fg}%</td>
        </tr>})}</tbody>
      </table></div>
    </div>}
    {Object.keys(rivals).length>0&&<div style={CD}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.06)"}}><span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>CARA A CARA</span></div>
      {Object.entries(rivals).sort((a,b)=>(b[1].w+b[1].l)-(a[1].w+a[1].l)).map(([opp,r])=>{const o=gt(opp);return<div key={opp} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,.02)"}}>
        <Badge id={opp} sz={22}/><span style={{fontSize:12,color:"#ccc",fontWeight:600,flex:1,fontFamily:F}}>{o.name} <span style={{color:"#555",fontSize:10}}>{o.zone}</span></span>
        <span style={{fontSize:13,fontWeight:900,color:r.w>r.l?GN:r.l>r.w?"#ff6b6b":"#aaa",fontFamily:F}}>{r.w}-{r.l}</span>
      </div>})}
    </div>}
    <div style={CD}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.06)"}}><span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>ÚLTIMOS JUEGOS</span></div>
      {tg.slice(0,10).map(g=>{const isH=g.home===teamId;const opp=isH?g.away:g.home;const o=gt(opp);const won=(isH&&g.hs>g.as)||(!isH&&g.as>g.hs);return<div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,.02)"}}>
        <span style={{fontSize:10,fontWeight:800,color:won?GN:"#ff6b6b",width:14,fontFamily:F}}>{won?"V":"D"}</span>
        <Badge id={opp} sz={18}/><span style={{fontSize:11,color:"#ccc",flex:1,fontFamily:F}}>{isH?"vs":"@"} {o.name}</span>
        <span style={{fontSize:12,fontWeight:900,color:"#fff",fontFamily:F}}>{isH?g.hs:g.as}-{isH?g.as:g.hs}</span>
        <span style={{fontSize:9,color:"#555"}}>{g.dt}</span>
      </div>})}
    </div>
  </div>
}

function HistoryView(){
  const[tab,setTab]=useState("ch");
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{fontSize:14,fontWeight:900,color:GD,letterSpacing:2,fontFamily:F}}>🏆 LA MEMORIA</div>
    <div style={{display:"flex",gap:0}}>{[["ch","CAMPEONES"],["prov","PROVINCIAS"],["intl","CUBA 🇨🇺"]].map(([k,l],i)=>
      <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",background:tab===k?"rgba(255,255,255,.06)":"transparent",border:"1px solid rgba(255,255,255,.06)",borderRadius:i===0?"8px 0 0 8px":i===2?"0 8px 8px 0":"0",borderLeft:i>0?"none":undefined,color:tab===k?"#fff":"#555",fontSize:9,fontWeight:800,letterSpacing:1.5,cursor:"pointer",fontFamily:F}}>{l}</button>)}</div>
    {tab==="ch"&&<div style={CD}><div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.06)"}}><span style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,fontFamily:F}}>LSB (1993–2023)</span></div>
      <div style={{maxHeight:400,overflowY:"auto"}}>{LSB.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,.02)"}}><span style={{fontSize:12,fontWeight:900,color:GD,width:36,fontFamily:F}}>{c.y}</span><span style={{fontSize:12,color:"#ddd",fontWeight:600,fontFamily:F}}>{c.ch}</span></div>)}</div>
    </div>}
    {tab==="prov"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{PROV.map((p,i)=>
      <div key={i} style={{...CP,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:8,background:p.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff"}}>{i+1}</div><div style={{fontSize:13,fontWeight:700,color:"#fff",fontFamily:F}}>{p.n}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:900,color:p.t>0?GD:"#333",fontFamily:F}}>{p.t}</div><div style={{fontSize:8,color:"#555",letterSpacing:1}}>TÍTULOS</div></div>
      </div>)}</div>}
    {tab==="intl"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{...CP,background:"linear-gradient(135deg,#1a1917,#1D3557)"}}><div style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:1,marginBottom:4,fontFamily:F}}>🇨🇺 SELECCIÓN NACIONAL</div><div style={{fontSize:10,color:"#aaa",lineHeight:1.6}}>FIBA #63 · Miembro 1937 · Única del Caribe con medalla olímpica</div></div>
      {INTL.map((e,i)=><div key={i} style={{...CP,display:"flex",gap:10}}><span style={{fontSize:12,fontWeight:900,color:GD,width:36,flexShrink:0,fontFamily:F}}>{e.y}</span><div><div style={{fontSize:12,color:"#ddd",fontWeight:600,fontFamily:F}}>{e.r}</div><div style={{fontSize:10,color:"#888"}}>{e.e}</div>{e.n&&<div style={{fontSize:9,color:AC,marginTop:2}}>{e.n}</div>}</div></div>)}
    </div>}
  </div>
}

// ─── ADMIN ──────────────────────────────────────────────
function AdminPanel({onSave,onSchedule}){
  const[mode,setMode]=useState("game");const[home,setHome]=useState("");const[away,setAway]=useState("");
  const[dt,setDt]=useState(new Date().toISOString().split("T")[0]);const[loc,setLoc]=useState("");const[time,setTime]=useState("");
  const[hp,setHp]=useState([]);const[ap,setAp]=useState([]);const[saving,setSaving]=useState(false);
  const addP=(tm,isH)=>{const b={nm:"",num:"",min:0,pts:0,reb:0,ast:0,stl:0,blk:0,fgm:0,fga:0,tm};isH?setHp(p=>[...p,b]):setAp(p=>[...p,b])};
  const upP=(isH,i,k,v)=>{(isH?setHp:setAp)(prev=>{const n=[...prev];n[i]={...n[i],[k]:["nm","num"].includes(k)?v:parseInt(v)||0};return n})};
  const rmP=(isH,i)=>{(isH?setHp:setAp)(prev=>prev.filter((_,j)=>j!==i))};
  const hs=hp.reduce((s,p)=>s+p.pts,0),as=ap.reduce((s,p)=>s+p.pts,0);
  const save=async()=>{setSaving(true);
    if(mode==="schedule")await onSchedule({id:`sched_${Date.now()}`,home,away,dt,loc,time,st:"sched"});
    else await onSave({id:`game_${Date.now()}`,home,away,hs,as,dt,loc,ps:[...hp,...ap],live:false,createdAt:Date.now()});
    setSaving(false);setHome("");setAway("");setHp([]);setAp([]);setLoc("");setTime("")};
  const inp={background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 10px",color:"#fff",fontSize:12,fontFamily:F,outline:"none",width:"100%"};
  const sm={...inp,width:46,textAlign:"center",padding:"6px 3px"};
  const btn=a=>({background:a?AC:"rgba(255,255,255,.04)",border:`1px solid ${a?AC:"rgba(255,255,255,.08)"}`,borderRadius:8,padding:"8px 14px",color:a?"#fff":"#888",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F});
  return<div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",gap:0}}>{[["game","📋 RESULTADO"],["schedule","📅 PROGRAMAR"]].map(([k,l],i)=>
      <button key={k} onClick={()=>setMode(k)} style={{flex:1,padding:"8px 0",background:mode===k?`${AC}22`:"transparent",border:`1px solid ${mode===k?AC+"44":"rgba(255,255,255,.06)"}`,borderRadius:i===0?"8px 0 0 8px":"0 8px 8px 0",borderLeft:i>0?"none":undefined,color:mode===k?AC:"#555",fontSize:10,fontWeight:800,letterSpacing:1,cursor:"pointer",fontFamily:F}}>{l}</button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div><div style={{fontSize:9,color:"#888",fontWeight:700,marginBottom:4,letterSpacing:1}}>VISITANTE</div><select value={away} onChange={e=>{setAway(e.target.value);setAp([])}} style={{...inp,cursor:"pointer"}}><option value="">—</option>{TEAMS.filter(t=>t.id!==home).map(t=><option key={t.id} value={t.id}>{t.name} — {t.zone}</option>)}</select></div>
      <div><div style={{fontSize:9,color:"#888",fontWeight:700,marginBottom:4,letterSpacing:1}}>LOCAL</div><select value={home} onChange={e=>{setHome(e.target.value);setHp([])}} style={{...inp,cursor:"pointer"}}><option value="">—</option>{TEAMS.filter(t=>t.id!==away).map(t=><option key={t.id} value={t.id}>{t.name} — {t.zone}</option>)}</select></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div><div style={{fontSize:9,color:"#888",fontWeight:700,marginBottom:4,letterSpacing:1}}>FECHA</div><input type="date" value={dt} onChange={e=>setDt(e.target.value)} style={inp}/></div>
      <div><div style={{fontSize:9,color:"#888",fontWeight:700,marginBottom:4,letterSpacing:1}}>{mode==="schedule"?"HORA":"LUGAR"}</div>{mode==="schedule"?<input placeholder="7:00 PM" value={time} onChange={e=>setTime(e.target.value)} style={inp}/>:<input placeholder="Sala Ramón Fonst" value={loc} onChange={e=>setLoc(e.target.value)} style={inp}/>}</div>
    </div>
    {mode==="schedule"&&<div><div style={{fontSize:9,color:"#888",fontWeight:700,marginBottom:4,letterSpacing:1}}>LUGAR</div><input placeholder="Sala Ramón Fonst" value={loc} onChange={e=>setLoc(e.target.value)} style={inp}/></div>}
    {mode==="game"&&home&&away&&<>{[{ps:ap,tm:away,isH:false},{ps:hp,tm:home,isH:true}].map(({ps,tm,isH})=>{const t=gt(tm);return<div key={tm} style={{...CP}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:6}}><Badge id={tm} sz={20}/><span style={{fontSize:12,fontWeight:800,color:"#fff",fontFamily:F}}>{t.name}</span></div>
        <span style={{fontSize:14,fontWeight:900,color:AC,fontFamily:F}}>{ps.reduce((s,p)=>s+p.pts,0)}</span></div>
      {ps.map((p,i)=><div key={i} style={{display:"flex",gap:3,marginBottom:3,alignItems:"center",flexWrap:"wrap"}}>
        <input placeholder="#" value={p.num} onChange={e=>upP(isH,i,"num",e.target.value)} style={{...sm,width:28}}/>
        <input placeholder="Nombre" value={p.nm} onChange={e=>upP(isH,i,"nm",e.target.value)} style={{...inp,flex:1,minWidth:80}}/>
        {[["min","MIN"],["pts","PTS"],["reb","REB"],["ast","AST"],["stl","ROB"],["blk","BLQ"],["fgm","TCA"],["fga","TCI"]].map(([k,l])=>
          <div key={k} style={{textAlign:"center"}}><div style={{fontSize:6,color:"#555",fontWeight:700}}>{l}</div><input value={p[k]||""} onChange={e=>upP(isH,i,k,e.target.value)} style={sm}/></div>)}
        <button onClick={()=>rmP(isH,i)} style={{background:"none",border:"none",color:"#ff3b30",cursor:"pointer",fontSize:13,padding:"0 3px"}}>✕</button>
      </div>)}
      <button onClick={()=>addP(tm,isH)} style={{...btn(false),width:"100%",marginTop:4,textAlign:"center",fontSize:10}}>+ JUGADOR</button>
    </div>})}
    <div style={{...CP,background:"linear-gradient(135deg,#1a1917,#252320)",textAlign:"center"}}>
      <div style={{fontSize:10,color:"#888",fontWeight:700,letterSpacing:2,marginBottom:6}}>MARCADOR</div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16}}>
        <div><div style={{fontSize:10,color:"#999"}}>{gt(away).zone}</div><div style={{fontSize:28,fontWeight:900,color:as>hs?"#fff":"#555",fontFamily:F}}>{as}</div></div>
        <span style={{fontSize:16,color:"#333"}}>—</span>
        <div><div style={{fontSize:10,color:"#999"}}>{gt(home).zone}</div><div style={{fontSize:28,fontWeight:900,color:hs>as?"#fff":"#555",fontFamily:F}}>{hs}</div></div>
      </div>
    </div></>}
    {home&&away&&<button onClick={save} disabled={saving||(mode==="game"&&(!hp.length||!ap.length))} style={{...btn(true),width:"100%",padding:"10px 0",fontSize:13,letterSpacing:2,opacity:saving?.5:1}}>{saving?"GUARDANDO...":mode==="schedule"?"📅 PROGRAMAR":"💾 GUARDAR"}</button>}
  </div>
}

// ─── MAIN ───────────────────────────────────────────────
export default function App(){
  const[tab,setTab]=useState("scores");const[games,setGames]=useState([]);const[schedule,setSchedule]=useState([]);
  const[isAdmin,setIsAdmin]=useState(false);const[pin,setPin]=useState("");const[showPin,setShowPin]=useState(false);
  const[teamPage,setTeamPage]=useState(null);const[loaded,setLoaded]=useState(false);const[offline,setOffline]=useState(!navigator.onLine);

  useEffect(()=>{
    const on=()=>setOffline(false);const off=()=>setOffline(true);
    window.addEventListener("online",on);window.addEventListener("offline",off);
    return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off)};
  },[]);

  useEffect(()=>{(async()=>{
    const gk=await S.list("game_");const gs=[];for(const k of gk){const g=await S.get(k);if(g)gs.push(g)}
    gs.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    const sk=await S.list("sched_");const ss=[];for(const k of sk){const s=await S.get(k);if(s)ss.push(s)}
    if(!gs.length){
      const s1={id:"game_s1",home:"CRO",away:"PLY",hs:78,as:85,dt:"2026-02-21",loc:"Sala Ramón Fonst",live:false,createdAt:Date.now(),
        ps:[{nm:"Carlos M. Hernández",num:"7",tm:"PLY",min:32,pts:24,reb:5,ast:7,stl:3,blk:0,fgm:9,fga:16},{nm:"Yoandri Pérez",num:"11",tm:"PLY",min:28,pts:18,reb:8,ast:2,stl:1,blk:2,fgm:7,fga:13},{nm:"Luis A. Rodríguez",num:"4",tm:"PLY",min:30,pts:15,reb:3,ast:4,stl:2,blk:0,fgm:6,fga:12},{nm:"Roberto García",num:"23",tm:"PLY",min:26,pts:12,reb:6,ast:1,stl:0,blk:1,fgm:5,fga:10},{nm:"Daniel Soto",num:"15",tm:"PLY",min:22,pts:16,reb:2,ast:3,stl:1,blk:0,fgm:6,fga:11},
          {nm:"Marcos Díaz",num:"10",tm:"CRO",min:34,pts:22,reb:4,ast:8,stl:2,blk:0,fgm:8,fga:17},{nm:"Alejandro Reyes",num:"33",tm:"CRO",min:30,pts:19,reb:10,ast:1,stl:0,blk:3,fgm:8,fga:15},{nm:"Ernesto Valdés",num:"5",tm:"CRO",min:28,pts:14,reb:3,ast:5,stl:3,blk:0,fgm:5,fga:12},{nm:"Jorge L. Martínez",num:"8",tm:"CRO",min:24,pts:13,reb:5,ast:2,stl:1,blk:1,fgm:5,fga:11},{nm:"René Álvarez",num:"21",tm:"CRO",min:20,pts:10,reb:2,ast:3,stl:0,blk:0,fgm:4,fga:9}]};
      const s2={id:"game_s2",home:"D10",away:"MRN",hs:92,as:88,dt:"2026-02-20",loc:"Ciudad Deportiva",live:false,createdAt:Date.now()-86400000,
        ps:[{nm:"Yordanis Durán",num:"3",tm:"D10",min:36,pts:28,reb:7,ast:5,stl:1,blk:1,fgm:11,fga:20},{nm:"Pedro A. Castillo",num:"14",tm:"D10",min:30,pts:20,reb:4,ast:6,stl:2,blk:0,fgm:8,fga:15},{nm:"Manuel Herrera",num:"9",tm:"D10",min:28,pts:16,reb:8,ast:2,stl:0,blk:2,fgm:7,fga:13},{nm:"Frank Domínguez",num:"22",tm:"D10",min:24,pts:14,reb:3,ast:3,stl:1,blk:0,fgm:5,fga:11},{nm:"Yoel Martínez",num:"6",tm:"D10",min:22,pts:14,reb:5,ast:1,stl:0,blk:1,fgm:6,fga:10},
          {nm:"Raúl Vega",num:"1",tm:"MRN",min:34,pts:26,reb:3,ast:9,stl:4,blk:0,fgm:10,fga:19},{nm:"Dainier López",num:"12",tm:"MRN",min:30,pts:22,reb:6,ast:2,stl:1,blk:1,fgm:9,fga:16},{nm:"Osmany Ruiz",num:"30",tm:"MRN",min:26,pts:18,reb:9,ast:1,stl:0,blk:3,fgm:7,fga:14},{nm:"Lester Concepción",num:"7",tm:"MRN",min:24,pts:12,reb:2,ast:4,stl:2,blk:0,fgm:4,fga:10},{nm:"Yunior Páez",num:"20",tm:"MRN",min:20,pts:10,reb:4,ast:2,stl:0,blk:0,fgm:4,fga:9}]};
      const s3={id:"game_s3",home:"REG",away:"CTH",hs:76,as:81,dt:"2026-02-19",loc:"Regla",live:false,createdAt:Date.now()-172800000,
        ps:[{nm:"Adel Borroto",num:"2",tm:"CTH",min:34,pts:23,reb:4,ast:6,stl:2,blk:0,fgm:9,fga:18},{nm:"Yosvani Leal",num:"14",tm:"CTH",min:30,pts:19,reb:7,ast:3,stl:1,blk:1,fgm:7,fga:14},{nm:"Dario Puig",num:"8",tm:"CTH",min:28,pts:17,reb:3,ast:5,stl:0,blk:0,fgm:6,fga:12},{nm:"Pavel Noa",num:"11",tm:"CTH",min:24,pts:12,reb:5,ast:2,stl:1,blk:2,fgm:5,fga:10},{nm:"Felix Cuesta",num:"25",tm:"CTH",min:20,pts:10,reb:2,ast:1,stl:0,blk:0,fgm:4,fga:9},
          {nm:"Osmani Torres",num:"6",tm:"REG",min:32,pts:21,reb:6,ast:4,stl:1,blk:1,fgm:8,fga:16},{nm:"Yariel Cárdenas",num:"13",tm:"REG",min:28,pts:18,reb:8,ast:2,stl:0,blk:2,fgm:7,fga:14},{nm:"Lázaro Mena",num:"9",tm:"REG",min:26,pts:15,reb:4,ast:3,stl:2,blk:0,fgm:6,fga:13},{nm:"Raunel Blanco",num:"17",tm:"REG",min:22,pts:12,reb:3,ast:5,stl:1,blk:0,fgm:5,fga:11},{nm:"Andy Pérez",num:"24",tm:"REG",min:20,pts:10,reb:5,ast:1,stl:0,blk:1,fgm:4,fga:10}]};
      const sc1={id:"sched_s1",home:"PLY",away:"D10",dt:"2026-02-23",time:"4:00 PM",loc:"Sala Ramón Fonst",st:"sched"};
      const sc2={id:"sched_s2",home:"CTH",away:"REG",dt:"2026-02-23",time:"6:00 PM",loc:"Ciudad Deportiva",st:"sched"};
      const sc3={id:"sched_s3",home:"GBK",away:"ARN",dt:"2026-02-24",time:"5:00 PM",loc:"Guanabacoa",st:"sched"};
      for(const g of[s1,s2,s3])await S.set(g.id,g);for(const s of[sc1,sc2,sc3])await S.set(s.id,s);
      gs.push(s1,s2,s3);ss.push(sc1,sc2,sc3);
    }
    setGames(gs);setSchedule(ss);setLoaded(true);
  })()},[]);

  const saveGame=async g=>{await S.set(g.id,g);setGames(prev=>[g,...prev])};
  const saveSched=async s=>{await S.set(s.id,s);setSchedule(prev=>[...prev,s])};
  const tryPin=()=>{if(pin===PIN){setIsAdmin(true);setShowPin(false);setPin("");setTab("admin")}else setPin("")};
  const goTeam=id=>{setTeamPage(id);setTab("team")};

  const tabs=[{k:"scores",i:"🏀",l:"JUEGOS"},{k:"standings",i:"📊",l:"TABLA"},{k:"leaders",i:"📈",l:"LÍDERES"},{k:"history",i:"🏆",l:"ARCHIVO"},...(isAdmin?[{k:"admin",i:"📋",l:"REPORTAR"}]:[])];

  return<div style={{minHeight:"100vh",background:BG,color:"#fff",fontFamily:F}}>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}input::placeholder{color:#555}select{appearance:none}option{background:#1a1917;color:#fff}`}</style>

    {/* Offline banner */}
    {offline&&<div style={{background:"#B5151D",padding:"6px 16px",textAlign:"center",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:1,fontFamily:F}}>📡 SIN CONEXIÓN — MODO OFFLINE</div>}

    <div style={{padding:"16px 16px 0",maxWidth:800,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div onClick={()=>{setTab("scores");setTeamPage(null)}} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${AC},${GD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏀</div>
          <div><div style={{fontSize:16,fontWeight:900,letterSpacing:3}}>TABLONCILLO</div><div style={{fontSize:8,letterSpacing:2,color:"#666",fontWeight:600}}>BALONCESTO HABANERO · LA HABANA</div></div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {!isAdmin&&<button onClick={()=>setShowPin(!showPin)} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#555",fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:F}}>🔑</button>}
          {isAdmin&&<div style={{padding:"4px 8px",background:`${AC}22`,borderRadius:8,border:`1px solid ${AC}33`}}><span style={{fontSize:8,fontWeight:700,color:AC,letterSpacing:1}}>REPORTERO</span></div>}
        </div>
      </div>
      {showPin&&<div style={{display:"flex",gap:6,marginBottom:12}}>
        <input type="password" maxLength={4} placeholder="PIN" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryPin()} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:14,fontFamily:F,outline:"none",width:80,textAlign:"center",letterSpacing:4}}/>
        <button onClick={tryPin} style={{background:AC,border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:F}}>→</button>
      </div>}
    </div>

    <div style={{padding:"0 16px 90px",maxWidth:800,margin:"0 auto"}}>
      {!loaded&&<div style={{textAlign:"center",padding:60,color:"#555"}}>Cargando...</div>}
      {loaded&&tab==="scores"&&<ScoresView games={games} schedule={schedule} onTeam={goTeam}/>}
      {loaded&&tab==="standings"&&<StandView games={games} onTeam={goTeam}/>}
      {loaded&&tab==="leaders"&&<LeadersView games={games} onTeam={goTeam}/>}
      {loaded&&tab==="history"&&<HistoryView/>}
      {loaded&&tab==="team"&&teamPage&&<TeamPage teamId={teamPage} games={games} onBack={()=>{setTeamPage(null);setTab("scores")}}/>}
      {loaded&&tab==="admin"&&isAdmin&&<AdminPanel onSave={saveGame} onSchedule={saveSched}/>}
    </div>

    <div style={{position:"fixed",bottom:0,left:0,right:0,background:`linear-gradient(180deg,transparent,${BG} 25%)`,paddingTop:20}}>
      <div style={{display:"flex",maxWidth:800,margin:"0 auto",padding:"0 8px 12px"}}>
        {tabs.map(tb=><button key={tb.k} onClick={()=>{setTab(tb.k);if(tb.k!=="team")setTeamPage(null)}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0",background:"none",border:"none",cursor:"pointer"}}>
          <span style={{fontSize:18,filter:tab===tb.k?"none":"grayscale(1) brightness(0.4)"}}>{tb.i}</span>
          <span style={{fontSize:7,fontWeight:800,letterSpacing:1,color:tab===tb.k?"#fff":"#444",fontFamily:F}}>{tb.l}</span>
          {tab===tb.k&&<div style={{width:4,height:4,borderRadius:2,background:AC}}/>}
        </button>)}
      </div>
    </div>
  </div>
}
