import React, { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════
const C = {
  bg:"#0A0C10", surface:"#12161C", surfaceRaised:"#181D25",
  border:"#1E2530", borderLight:"#252D3A",
  accent:"#E8572A", accentDim:"#E8572A18", accentBorder:"#E8572A40",
  green:"#1DB954", greenDim:"#1DB95418", greenBorder:"#1DB95440",
  yellow:"#F5A623", yellowDim:"#F5A62318", yellowBorder:"#F5A62340",
  red:"#E53E3E", redDim:"#E53E3E18", redBorder:"#E53E3E40",
  blue:"#4A9EFF", blueDim:"#4A9EFF18", blueBorder:"#4A9EFF40",
  purple:"#9B6DFF", purpleDim:"#9B6DFF18", purpleBorder:"#9B6DFF40",
  teal:"#00C9B1", tealDim:"#00C9B118", tealBorder:"#00C9B140",
  orange:"#FF8C42", orangeDim:"#FF8C4218", orangeBorder:"#FF8C4240",
  text:"#E8EDF5", textMid:"#9AA3B2", textDim:"#4E5968",
  font:"'DM Mono','IBM Plex Mono',monospace",
  fontDisplay:"'DM Sans','Segoe UI',sans-serif",
  radius:"10px", radiusSm:"6px",
};

// ═══════════════════════════════════════════════════════════════════════
// REFERENCE DATA
// ═══════════════════════════════════════════════════════════════════════
const SEED_STATION_LIST = [
  {id:"bracebridge", name:"Bracebridge", code:"BRB"},
  {id:"huntsville",  name:"Huntsville",  code:"HVL"},
  {id:"portcarling", name:"Port Carling",code:"PRC"},
  {id:"mactier",     name:"Mac Tier",    code:"MCT"},
  {id:"gravenhurst", name:"Gravenhurst", code:"GRV"},
];
const SEED_AMBULANCES = Array.from({length:22},(_,i)=>({
  id:`unit-${i+1}`, name:`Unit ${String(i+1).padStart(2,"0")}`,
  station:SEED_STATION_LIST[i%5].id, code:`MPS-${String(i+1).padStart(2,"0")}`,
}));
// Legacy aliases used by static components — will be overridden by dynamic state where needed
const STATION_LIST = SEED_STATION_LIST;
const STATION_NAMES = STATION_LIST.map(s=>s.name);
const AMBULANCES = SEED_AMBULANCES;
const UNITS = AMBULANCES.map(a=>a.code);
const INV_CATEGORIES = ["Medications","IV Supplies","Airway","Cardiac","Trauma","PPE","Equipment","Other"];

const SEED_ITEMS = [
  {id:"med-001",name:"Epinephrine 1:1000 (1mg/mL)",         category:"Medications", unit:"vial",   parLevel:6,  orderPoint:3},
  {id:"med-002",name:"Epinephrine 1:10000 (0.1mg/mL)",      category:"Medications", unit:"vial",   parLevel:6,  orderPoint:3},
  {id:"med-003",name:"Adenosine 6mg/2mL",                   category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-004",name:"Amiodarone 150mg/3mL",                category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-005",name:"Atropine 1mg/10mL",                   category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-006",name:"Diazepam 10mg/2mL",                   category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-007",name:"Fentanyl 100mcg/2mL",                 category:"Medications", unit:"vial",   parLevel:6,  orderPoint:3},
  {id:"med-008",name:"Glucagon 1mg Kit",                    category:"Medications", unit:"kit",    parLevel:2,  orderPoint:1},
  {id:"med-009",name:"Dextrose 50% (25g/50mL)",             category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-010",name:"Acetylsalicylic Acid 325mg",          category:"Medications", unit:"tablet", parLevel:30, orderPoint:15},
  {id:"med-011",name:"Nitroglycerin Spray 0.4mg/dose",      category:"Medications", unit:"bottle", parLevel:2,  orderPoint:1},
  {id:"med-012",name:"Naloxone 0.4mg/mL",                   category:"Medications", unit:"vial",   parLevel:6,  orderPoint:3},
  {id:"med-013",name:"Midazolam 5mg/mL",                    category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-014",name:"Morphine 10mg/mL",                    category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-015",name:"Salbutamol 2.5mg/2.5mL Neb",         category:"Medications", unit:"ampule", parLevel:8,  orderPoint:4},
  {id:"med-016",name:"Ipratropium 0.5mg/2.5mL Neb",        category:"Medications", unit:"ampule", parLevel:4,  orderPoint:2},
  {id:"med-017",name:"Diphenhydramine 50mg/mL",             category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-018",name:"Ondansetron 4mg/2mL",                 category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-019",name:"Ketorolac 30mg/mL",                   category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"med-020",name:"Lorazepam 2mg/mL",                    category:"Medications", unit:"vial",   parLevel:4,  orderPoint:2},
  {id:"iv-001", name:"NS 1000mL IV Bag",                    category:"IV Supplies", unit:"bag",    parLevel:10, orderPoint:5},
  {id:"iv-002", name:"NS 500mL IV Bag",                     category:"IV Supplies", unit:"bag",    parLevel:6,  orderPoint:3},
  {id:"iv-003", name:"IV Start Kit (18G)",                  category:"IV Supplies", unit:"kit",    parLevel:8,  orderPoint:4},
  {id:"iv-004", name:"IV Start Kit (20G)",                  category:"IV Supplies", unit:"kit",    parLevel:8,  orderPoint:4},
  {id:"iv-005", name:"IV Tubing (Macro)",                   category:"IV Supplies", unit:"set",    parLevel:6,  orderPoint:3},
  {id:"iv-006", name:"IO Needle (EZ-IO 25mm)",              category:"IV Supplies", unit:"needle", parLevel:4,  orderPoint:2},
  {id:"aw-001", name:"BVM Adult",                           category:"Airway",      unit:"unit",   parLevel:2,  orderPoint:1},
  {id:"aw-002", name:"BVM Pediatric",                       category:"Airway",      unit:"unit",   parLevel:1,  orderPoint:1},
  {id:"aw-003", name:"OPA Set (Sizes 0-5)",                 category:"Airway",      unit:"set",    parLevel:2,  orderPoint:1},
  {id:"aw-004", name:"NPA 28Fr with Lube",                  category:"Airway",      unit:"unit",   parLevel:4,  orderPoint:2},
  {id:"aw-005", name:"Supraglottic Airway (iGel) Adult",    category:"Airway",      unit:"unit",   parLevel:2,  orderPoint:1},
  {id:"aw-006", name:"ETT 7.5mm Cuffed",                   category:"Airway",      unit:"tube",   parLevel:2,  orderPoint:1},
  {id:"aw-007", name:"ETCO2 Colorimetric Detector",         category:"Airway",      unit:"unit",   parLevel:2,  orderPoint:1},
  {id:"aw-008", name:"Oxygen Mask NRB Adult",               category:"Airway",      unit:"mask",   parLevel:4,  orderPoint:2},
  {id:"ca-001", name:"AED Pads Adult",                      category:"Cardiac",     unit:"set",    parLevel:2,  orderPoint:1},
  {id:"ca-002", name:"AED Pads Pediatric",                  category:"Cardiac",     unit:"set",    parLevel:1,  orderPoint:1},
  {id:"ca-003", name:"12-Lead ECG Electrodes",              category:"Cardiac",     unit:"pack",   parLevel:4,  orderPoint:2},
  {id:"tr-001", name:"CAT Tourniquet",                      category:"Trauma",      unit:"unit",   parLevel:4,  orderPoint:2},
  {id:"tr-002", name:"Hemostatic Gauze",                    category:"Trauma",      unit:"roll",   parLevel:4,  orderPoint:2},
  {id:"tr-003", name:"Chest Seal Vented (HyFin)",          category:"Trauma",      unit:"pair",   parLevel:2,  orderPoint:1},
  {id:"tr-004", name:'SAM Splint 36"',                      category:"Trauma",      unit:"unit",   parLevel:4,  orderPoint:2},
  {id:"tr-005", name:"Trauma Dressing 4x4",                 category:"Trauma",      unit:"pack",   parLevel:10, orderPoint:5},
  {id:"ppe-001",name:"Nitrile Gloves Medium (box)",         category:"PPE",         unit:"box",    parLevel:4,  orderPoint:2},
  {id:"ppe-002",name:"Nitrile Gloves Large (box)",          category:"PPE",         unit:"box",    parLevel:4,  orderPoint:2},
  {id:"ppe-003",name:"N95 Respirator",                      category:"PPE",         unit:"each",   parLevel:20, orderPoint:10},
  {id:"ppe-004",name:"Isolation Gown",                      category:"PPE",         unit:"each",   parLevel:10, orderPoint:5},
  {id:"ppe-005",name:"Face Shield",                         category:"PPE",         unit:"each",   parLevel:4,  orderPoint:2},
];

// ═══════════════════════════════════════════════════════════════════════
// DEFAULT FORM TEMPLATES
// ═══════════════════════════════════════════════════════════════════════
const DEFAULT_TEMPLATES = [
  { id:"tpl-001", name:"Daily Vehicle Inspection", description:"Pre/Post shift vehicle check", category:"Vehicle", assignedTo:["All Stations"], frequency:"Daily", active:true, createdBy:"Admin",
    sections:[
      {id:"s1",title:"Vehicle Exterior",fields:[
        {id:"f1",label:"Body damage / new damage noted",type:"pass_fail",required:true},
        {id:"f2",label:"All lights functional (headlights, brake, emergency)",type:"pass_fail",required:true},
        {id:"f3",label:"Tires — condition and pressure acceptable",type:"pass_fail",required:true},
        {id:"f4",label:"Windshield / mirrors — no cracks or obstructions",type:"pass_fail",required:true},
        {id:"f5",label:"Exterior damage notes",type:"text",required:false},
      ]},
      {id:"s2",title:"Vehicle Interior",fields:[
        {id:"f6",label:"Seatbelts — all functional",type:"pass_fail",required:true},
        {id:"f7",label:"Heater / AC operational",type:"pass_fail",required:true},
        {id:"f8",label:"Interior cleanliness",type:"rating",required:true},
        {id:"f9",label:"Odometer reading",type:"number",required:true},
      ]},
      {id:"s3",title:"Mechanical",fields:[
        {id:"f10",label:"Fuel level",type:"select",options:["Full","3/4","1/2","1/4","Low"],required:true},
        {id:"f11",label:"Oil level acceptable",type:"pass_fail",required:true},
        {id:"f12",label:"Coolant level acceptable",type:"pass_fail",required:true},
        {id:"f13",label:"Warning lights on dash",type:"yes_no",required:true},
        {id:"f14",label:"Warning light details",type:"text",required:false},
      ]},
      {id:"s4",title:"Communications",fields:[
        {id:"f15",label:"Radio functional and programmed",type:"pass_fail",required:true},
        {id:"f16",label:"MDT / CAD terminal operational",type:"pass_fail",required:true},
        {id:"f17",label:"Siren / PA operational",type:"pass_fail",required:true},
        {id:"f18",label:"Stretcher secure and operational",type:"pass_fail",required:true},
      ]},
      {id:"s5",title:"Sign-Off",fields:[
        {id:"f19",label:"Employee Name / ID",type:"text",required:true},
        {id:"f20",label:"Partner Name / ID",type:"text",required:false},
        {id:"f21",label:"Unit Number",type:"select",options:UNITS,required:true},
        {id:"f22",label:"Shift",type:"select",options:["Days","Nights","Relief"],required:true},
        {id:"f23",label:"Additional comments",type:"textarea",required:false},
      ]},
    ]
  },
  { id:"tpl-002", name:"Controlled Substance Check", description:"Narcotic and controlled drug count", category:"Medications", assignedTo:["All Stations"], frequency:"Per Shift", active:true, createdBy:"Admin",
    sections:[
      {id:"s1",title:"Narcotic Count",fields:[
        {id:"f1",label:"Fentanyl 100mcg/2mL — count",type:"number",required:true},
        {id:"f2",label:"Morphine 10mg/mL — count",type:"number",required:true},
        {id:"f3",label:"Midazolam 5mg/mL — count",type:"number",required:true},
        {id:"f4",label:"Lorazepam 2mg/mL — count",type:"number",required:true},
        {id:"f5",label:"Counts match manifest",type:"yes_no",required:true},
        {id:"f6",label:"Discrepancy details",type:"textarea",required:false},
      ]},
      {id:"s2",title:"Seal Integrity",fields:[
        {id:"f7",label:"Drug bag seal intact",type:"yes_no",required:true},
        {id:"f8",label:"Current seal number",type:"text",required:true},
        {id:"f9",label:"Previous seal number matches record",type:"yes_no",required:true},
      ]},
      {id:"s3",title:"Sign-Off",fields:[
        {id:"f10",label:"Outgoing crew member",type:"text",required:true},
        {id:"f11",label:"Incoming crew member",type:"text",required:true},
        {id:"f12",label:"Unit Number",type:"select",options:UNITS,required:true},
        {id:"f13",label:"Date / Time of count",type:"text",required:true},
      ]},
    ]
  },
  { id:"tpl-003", name:"ALS Equipment Check", description:"Advanced life support equipment verification", category:"Equipment", assignedTo:["All Stations"], frequency:"Daily", active:true, createdBy:"Admin",
    sections:[
      {id:"s1",title:"Cardiac Monitor",fields:[
        {id:"f1",label:"Device powers on successfully",type:"pass_fail",required:true},
        {id:"f2",label:"Battery level",type:"select",options:["Full","75%","50%","25%","Low — needs charge"],required:true},
        {id:"f3",label:"Adult pads present and in-date",type:"pass_fail",required:true},
        {id:"f4",label:"Pediatric pads present and in-date",type:"pass_fail",required:true},
        {id:"f5",label:"12-Lead cable functional",type:"pass_fail",required:true},
        {id:"f6",label:"ETCO2 cable and adapter present",type:"pass_fail",required:true},
      ]},
      {id:"s2",title:"Airway Equipment",fields:[
        {id:"f7",label:"BVM adult — present and functional",type:"pass_fail",required:true},
        {id:"f8",label:"BVM pediatric — present",type:"pass_fail",required:true},
        {id:"f9",label:"iGel supraglottic airway — size 4 present",type:"pass_fail",required:true},
        {id:"f10",label:"Video laryngoscope functional",type:"pass_fail",required:true},
        {id:"f11",label:"Suction unit functional",type:"pass_fail",required:true},
      ]},
      {id:"s3",title:"IV / IO Equipment",fields:[
        {id:"f12",label:"IV kit — adequate stock",type:"pass_fail",required:true},
        {id:"f13",label:"EZ-IO drill present and charged",type:"pass_fail",required:true},
        {id:"f14",label:"NS 1000mL bags — min 4 present",type:"pass_fail",required:true},
      ]},
      {id:"s4",title:"Sign-Off",fields:[
        {id:"f15",label:"Completing Paramedic Name / ID",type:"text",required:true},
        {id:"f16",label:"Unit Number",type:"select",options:UNITS,required:true},
        {id:"f17",label:"Shift",type:"select",options:["Days","Nights","Relief"],required:true},
        {id:"f18",label:"Notes / deficiencies",type:"textarea",required:false},
      ]},
    ]
  },
  { id:"tpl-004", name:"Incident / Complaint Intake", description:"Document operational incidents and service concerns", category:"Incident", assignedTo:["All Stations"], frequency:"As Needed", active:true, createdBy:"Admin",
    sections:[
      {id:"s1",title:"Incident Classification",fields:[
        {id:"f1",label:"Incident type",type:"select",options:["Patient Complaint","Equipment Failure","Vehicle Incident","Clinical Concern","Workplace Injury","Near Miss","Public Complaint","Other"],required:true},
        {id:"f2",label:"Severity level",type:"select",options:["Low — Informational","Moderate — Requires follow-up","High — Immediate action required","Critical — Safety risk"],required:true},
        {id:"f3",label:"Date and time of incident",type:"text",required:true},
        {id:"f4",label:"Location / Station",type:"select",options:STATION_NAMES,required:true},
        {id:"f5",label:"Unit involved",type:"select",options:["N/A",...UNITS],required:true},
      ]},
      {id:"s2",title:"Incident Description",fields:[
        {id:"f6",label:"Brief description of what occurred",type:"textarea",required:true},
        {id:"f7",label:"Immediate actions taken",type:"textarea",required:true},
        {id:"f8",label:"Was a patient involved",type:"yes_no",required:true},
        {id:"f9",label:"Call incident number (no patient identifiers)",type:"text",required:false},
        {id:"f10",label:"Were there witnesses",type:"yes_no",required:true},
        {id:"f11",label:"Witness names / IDs",type:"text",required:false},
      ]},
      {id:"s3",title:"Contributing Factors",fields:[
        {id:"f12",label:"Equipment involved",type:"yes_no",required:true},
        {id:"f13",label:"Equipment details",type:"text",required:false},
        {id:"f14",label:"Environmental factors",type:"yes_no",required:true},
        {id:"f15",label:"MOHLTC notification required",type:"yes_no",required:true},
      ]},
      {id:"s4",title:"Reporting Employee",fields:[
        {id:"f16",label:"Your name / employee ID",type:"text",required:true},
        {id:"f17",label:"Your station",type:"select",options:STATION_NAMES,required:true},
        {id:"f18",label:"Certification level",type:"select",options:["EMR","PCP","ACP","CCP","Superintendent","Other"],required:true},
        {id:"f19",label:"Date of this report",type:"text",required:true},
      ]},
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════
// SHIFT DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════
const SEED_SHIFTS = [
  {id:"shift-001", label:"Day Shift",     start:"07:00", end:"19:00", color:"#F5A623"},
  {id:"shift-002", label:"Night Shift",   start:"19:00", end:"07:00", color:"#4A9EFF"},
  {id:"shift-003", label:"Day Relief",    start:"07:00", end:"19:00", color:"#1DB954"},
  {id:"shift-004", label:"Night Relief",  start:"19:00", end:"07:00", color:"#9B6DFF"},
];

// ═══════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════
const store = {
  async get(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage.set(k,JSON.stringify(v));}catch{}},
};

// ═══════════════════════════════════════════════════════════════════════
// INVENTORY HELPERS
// ═══════════════════════════════════════════════════════════════════════
function generateInventory(stations, ambulances, items){
  const stList  = stations  || SEED_STATION_LIST;
  const ambList = ambulances|| SEED_AMBULANCES;
  const itmList = items     || SEED_ITEMS;
  const inv={};
  [...stList.map(s=>s.id),...ambList.map(a=>a.id)].forEach(locId=>{
    itmList.forEach(item=>{
      const r=Math.random();
      let qty = r<0.12?0:r<0.25?Math.floor(item.orderPoint*0.5):r<0.45?item.orderPoint:item.parLevel+Math.floor(Math.random()*3);
      const exp=new Date(); exp.setMonth(exp.getMonth()+Math.floor(Math.random()*24)+1);
      const lotNum = item.category==="Medications"?`LOT${Math.floor(Math.random()*900000+100000)}`:null;
      inv[`${locId}__${item.id}`]={
        qty,
        expiry:item.category==="Medications"?exp.toISOString().split("T")[0]:null,
        lastUpdated:new Date().toISOString().split("T")[0],
        lotNumber:lotNum,
        lots: item.category==="Medications"?[{
          lotNumber:lotNum,
          qty,
          expiry:exp.toISOString().split("T")[0],
          receivedDate:new Date().toISOString().split("T")[0],
          supplier:"",
        }]:[],
      };
    });
  });
  return inv;
}
function invStatus(qty,item){if(qty===0)return"critical";if(qty<=item.orderPoint)return"low";if(qty>=item.parLevel)return"stocked";return"adequate";}
function statusColor(s){return s==="critical"?C.red:s==="low"?C.yellow:s==="stocked"?C.green:C.blue;}
function statusBg(s){return s==="critical"?C.redDim:s==="low"?C.yellowDim:s==="stocked"?C.greenDim:C.blueDim;}
function statusLabel(s){return s==="critical"?"CRITICAL":s==="low"?"LOW":s==="stocked"?"STOCKED":"ADEQUATE";}
function daysUntilExpiry(d){if(!d)return null;return Math.floor((new Date(d)-new Date())/(1000*60*60*24));}
function getFlags(sub,templates){
  const tpl=templates.find(t=>t.id===sub.templateId);
  if(!tpl)return[];
  return tpl.sections.flatMap(s=>s.fields).filter(f=>{const v=sub.data[f.id];return(f.type==="pass_fail"&&v==="fail")||(f.type==="yes_no"&&v==="yes");}).map(f=>({field:f,value:sub.data[f.id]}));
}
const fmtDate=(iso)=>{if(!iso)return"—";return new Date(iso).toLocaleString("en-CA",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});};
const uid=()=>`id-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const compColor=(p)=>p>=90?C.green:p>=70?C.yellow:C.red;

// ═══════════════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════════════
const Btn=({children,onClick,variant="default",size="md",disabled,style={}})=>{
  const p=size==="sm"?"6px 13px":size==="lg"?"13px 28px":"9px 18px";
  const fs=size==="sm"?12:size==="lg"?15:13;
  const bg=variant==="primary"?C.accent:variant==="success"?C.green:variant==="danger"?C.red:variant==="ghost"?"transparent":C.surfaceRaised;
  const col=["primary","success","danger"].includes(variant)?"#fff":C.textMid;
  const bdr=["ghost","default"].includes(variant)?`1px solid ${C.border}`:"none";
  return <button onClick={disabled?undefined:onClick} style={{cursor:disabled?"not-allowed":"pointer",border:bdr,borderRadius:C.radiusSm,fontFamily:C.fontDisplay,fontWeight:600,opacity:disabled?0.4:1,padding:p,fontSize:fs,background:bg,color:col,display:"inline-flex",alignItems:"center",gap:6,...style}}>{children}</button>;
};
const Tag=({label,color=C.blue})=><span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",padding:"2px 8px",borderRadius:3,color,background:`${color}18`,border:`1px solid ${color}33`,fontFamily:C.font,whiteSpace:"nowrap"}}>{label}</span>;
const Card=({children,style={},onClick})=><div onClick={onClick} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,padding:20,cursor:onClick?"pointer":"default",...style}}>{children}</div>;
const SHdr=({label})=><div style={{fontSize:11,fontWeight:700,color:C.textDim,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>{label}</div>;
const Progress=({value,color=C.green,height=6})=><div style={{height,background:C.border,borderRadius:99,overflow:"hidden"}}><div style={{width:`${Math.min(100,Math.max(0,value))}%`,height:"100%",background:color,borderRadius:99}}/></div>;
const inputSt={width:"100%",padding:"9px 13px",background:C.surfaceRaised,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,color:C.text,fontSize:13,fontFamily:C.font,outline:"none",boxSizing:"border-box"};
const NotifBadge=({count})=>count>0?<span style={{background:C.red,color:"#fff",fontSize:10,fontWeight:800,borderRadius:99,padding:"1px 6px",marginLeft:6,fontFamily:C.font}}>{count>99?"99+":count}</span>:null;

// ═══════════════════════════════════════════════════════════════════════
// UNIFIED DASHBOARD (new — combines both)
// ═══════════════════════════════════════════════════════════════════════
function UnifiedDashboard({inventory,orders,waste,submissions,templates,stations,vehicles,invItems,setPortal,setInvView,setInvLocation}){
  const stList=stations||SEED_STATION_LIST;
  const ambList=vehicles||SEED_AMBULANCES;
  const itmList=invItems||SEED_ITEMS;
  const allLocs=[...stList.map(s=>s.id),...ambList.map(a=>a.id)];
  let critInv=0,lowInv=0,expiringInv=0;
  itmList.forEach(item=>allLocs.forEach(locId=>{
    const e=inventory[`${locId}__${item.id}`];if(!e)return;
    const st=invStatus(e.qty,item);
    if(st==="critical")critInv++;else if(st==="low")lowInv++;
    if(e.expiry&&daysUntilExpiry(e.expiry)<=90&&e.qty>0)expiringInv++;
  }));
  const pendingOrders=orders.filter(o=>o.status==="pending").length;
  const recentSubs=submissions.slice(0,7);
  const unacked=submissions.filter(s=>getFlags(s,templates).length>0&&!s.acknowledgement).length;
  const todayStr=new Date().toISOString().split("T")[0];
  const todaySubs=submissions.filter(s=>s.submittedAt.startsWith(todayStr)).length;

  const restockNeeded=[];
  itmList.forEach(item=>{
    stList.forEach(st=>{
      const e=inventory[`${st.id}__${item.id}`];
      if(e&&(invStatus(e.qty,item)==="critical"||invStatus(e.qty,item)==="low"))
        restockNeeded.push({item,station:st,qty:e.qty,status:invStatus(e.qty,item)});
    });
  });

  const invFlagsFromInspections=[];
  submissions.slice(0,50).forEach(s=>{
    const tpl=templates.find(t=>t.id===s.templateId);if(!tpl)return;
    tpl.sections.flatMap(sec=>sec.fields).forEach(f=>{
      const v=s.data[f.id];
      if((f.type==="pass_fail"&&v==="fail")||(f.type==="yes_no"&&v==="yes")){
        const lower=f.label.toLowerCase();
        if(lower.includes("stock")||lower.includes("supply")||lower.includes("bag")||lower.includes("kit")||lower.includes("needle")||lower.includes("pad")||lower.includes("present")||lower.includes("adequate"))
          invFlagsFromInspections.push({sub:s,field:f,tpl});
      }
    });
  });

  const statCards=[
    {label:"Critical Inventory",val:critInv,color:C.red,sub:"Immediate restock needed",action:()=>{setPortal("inventory");setInvView("dashboard");}},
    {label:"Low Stock Items",val:lowInv,color:C.yellow,sub:"At or below order point",action:()=>{setPortal("inventory");setInvView("dashboard");}},
    {label:"Pending Orders",val:pendingOrders,color:C.blue,sub:"Awaiting fulfillment",action:()=>{setPortal("inventory");setInvView("orders");}},
    {label:"Expiring ≤90d",val:expiringInv,color:C.orange,sub:"Medications across all units",action:()=>{setPortal("inventory");setInvView("dashboard");}},
    {label:"Submissions Today",val:todaySubs,color:C.green,sub:"Inspections & forms",action:()=>setPortal("operations")},
    {label:"Unacknowledged Flags",val:unacked,color:C.red,sub:"Require superintendent review",action:()=>setPortal("superintendent")},
  ];

  return(
    <div style={{padding:28,fontFamily:C.fontDisplay}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:24,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Operations Overview</div>
        <div style={{fontSize:13,color:C.textMid,marginTop:4}}>District Municipality of Muskoka Paramedic Services — {new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {statCards.map(({label,val,color,sub,action})=>(
          <div key={label} onClick={action} style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${color}`,borderRadius:C.radius,padding:"16px 20px",cursor:"pointer"}}>
            <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
            <div style={{fontSize:30,fontWeight:800,color,letterSpacing:"-0.03em"}}>{val}</div>
            <div style={{fontSize:11,color:C.textDim,marginTop:4}}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Station health */}
        <Card>
          <SHdr label="Station Inventory Health"/>
          {stList.map(station=>{
            let crit=0,low=0,ok=0;
            itmList.forEach(item=>{
              const e=inventory[`${station.id}__${item.id}`];if(!e)return;
              const st=invStatus(e.qty,item);
              if(st==="critical")crit++;else if(st==="low")low++;else ok++;
            });
            const total=crit+low+ok||1;
            return(
              <div key={station.id} style={{marginBottom:12,cursor:"pointer"}} onClick={()=>{setPortal("inventory");setInvView("stations");setInvLocation({type:"station",id:station.id});}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,color:C.text,fontWeight:600}}>{station.name}</span>
                  <span style={{fontSize:11,fontFamily:C.font}}>
                    {crit>0&&<span style={{color:C.red,marginRight:8}}>●{crit}</span>}
                    {low>0&&<span style={{color:C.yellow}}>●{low}</span>}
                    {crit===0&&low===0&&<span style={{color:C.green}}>✓ Good</span>}
                  </span>
                </div>
                <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden",display:"flex"}}>
                  <div style={{width:`${(ok/total)*100}%`,background:C.green}}/>
                  <div style={{width:`${(low/total)*100}%`,background:C.yellow}}/>
                  <div style={{width:`${(crit/total)*100}%`,background:C.red}}/>
                </div>
              </div>
            );
          })}
        </Card>

        {/* Recent submissions */}
        <Card>
          <SHdr label="Recent Inspections & Forms"/>
          {recentSubs.length===0&&<div style={{color:C.textDim,fontSize:13}}>No submissions yet.</div>}
          {recentSubs.map(s=>{
            const flags=getFlags(s,templates);
            return(
              <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{s.templateName}</div>
                  <div style={{fontSize:11,color:C.textDim,fontFamily:C.font}}>{s.crewName||"—"} · {s.station||"—"} · {fmtDate(s.submittedAt)}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {flags.length>0?<Tag label={`${flags.length} FLAGS`} color={C.red}/>:<Tag label="CLEAN" color={C.green}/>}
                  {flags.length>0&&!s.acknowledgement&&<Tag label="PENDING" color={C.orange}/>}
                </div>
              </div>
            );
          })}
          {submissions.length>7&&<div style={{fontSize:11,color:C.textDim,textAlign:"center",marginTop:10,cursor:"pointer"}} onClick={()=>setPortal("superintendent")}>View all {submissions.length} submissions →</div>}
        </Card>
      </div>

      {/* Cross-system alert: inspection flags → inventory action */}
      {invFlagsFromInspections.length>0&&(
        <Card style={{border:`1px solid ${C.tealBorder}`,background:C.tealDim,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.teal}}>🔗 Inventory Action Required — From Inspection Findings</div>
            <Tag label={`${invFlagsFromInspections.length} ITEMS`} color={C.teal}/>
          </div>
          <div style={{fontSize:12,color:C.textMid,marginBottom:12}}>These equipment or supply items were flagged FAIL in recent inspections. Cross-referenced with inventory system.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8}}>
            {invFlagsFromInspections.slice(0,6).map((a,i)=>(
              <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"9px 12px",cursor:"pointer"}} onClick={()=>{setPortal("inventory");setInvView("dashboard");}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{a.field.label}</div>
                <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,marginTop:2}}>{a.tpl.name} · {a.sub.station} · {a.sub.unit}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Restock needed */}
      {restockNeeded.length>0&&(
        <Card style={{border:`1px solid ${C.yellowBorder}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.yellow}}>⚠ Station Restock Summary</div>
            <Btn size="sm" variant="primary" onClick={()=>{setPortal("inventory");setInvView("orders");}}>Go to Orders →</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
            {restockNeeded.slice(0,8).map((r,i)=>(
              <div key={i} style={{background:C.surface,border:`1px solid ${r.status==="critical"?C.redBorder:C.yellowBorder}`,borderRadius:C.radiusSm,padding:"9px 12px"}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{r.item.name}</div>
                <div style={{fontSize:11,fontFamily:C.font,color:C.textMid,marginTop:2}}>{r.station.name} · Have: <span style={{color:r.status==="critical"?C.red:C.yellow,fontWeight:700}}>{r.qty}</span> / Par: {r.item.parLevel}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// INVENTORY MODULE
// ═══════════════════════════════════════════════════════════════════════
function InventoryModule({inventory,setInventory,orders,setOrders,waste,setWaste,invView,setInvView,invLocation,setInvLocation,stations,setStations,vehicles,setVehicles,invItems,setInvItems}){
  const [locSearch,setLocSearch]=useState("");
  const filteredStations=stations.filter(s=>s.name.toLowerCase().includes(locSearch.toLowerCase()));
  const filteredUnits=vehicles.filter(a=>a.code.toLowerCase().includes(locSearch.toLowerCase())||a.name.toLowerCase().includes(locSearch.toLowerCase()));
  const locName=invLocation.type==="station"?stations.find(s=>s.id===invLocation.id)?.name:vehicles.find(a=>a.id===invLocation.id)?.code;

  const sideNavItems=[
    {id:"dashboard",  label:"Overview",   icon:"📊"},
    {id:"stations",   label:"Stations",   icon:"🏥"},
    {id:"fleet",      label:"Fleet",      icon:"🚑"},
    {id:"orders",     label:"Orders",     icon:"📦"},
    {id:"waste",      label:"Waste Log",  icon:"🗑"},
    {id:"lots",       label:"Lot Lookup", icon:"🔍"},
    {id:"configure",  label:"Configure",  icon:"⚙️"},
  ];

  return(
    <div style={{display:"flex",flex:1,overflow:"hidden",height:"100%"}}>
      <div style={{width:200,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"12px 8px"}}>
          {sideNavItems.map(n=>(
            <button key={n.id} onClick={()=>setInvView(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:C.radiusSm,marginBottom:2,background:invView===n.id?C.accentDim:"none",border:`1px solid ${invView===n.id?C.accentBorder:"transparent"}`,color:invView===n.id?C.accent:C.textMid,cursor:"pointer",fontSize:13,fontWeight:invView===n.id?700:400,textAlign:"left",fontFamily:C.fontDisplay}}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
        {(invView==="stations"||invView==="fleet")&&(
          <div style={{borderTop:`1px solid ${C.border}`,flex:1,overflowY:"auto"}}>
            <div style={{padding:"10px 8px 4px"}}>
              <input value={locSearch} onChange={e=>setLocSearch(e.target.value)} placeholder="Search..." style={{...inputSt,fontSize:12,padding:"6px 10px",background:C.bg}}/>
            </div>
            {invView==="stations"&&filteredStations.map(s=>(
              <button key={s.id} onClick={()=>setInvLocation({type:"station",id:s.id})} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 16px",background:invLocation.id===s.id?C.accentDim:"none",border:"none",color:invLocation.id===s.id?C.accent:C.textMid,cursor:"pointer",fontSize:12,textAlign:"left",fontFamily:C.fontDisplay}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:invLocation.id===s.id?C.accent:C.textDim,flexShrink:0}}/>
                {s.name}
              </button>
            ))}
            {invView==="fleet"&&filteredUnits.map(a=>(
              <button key={a.id} onClick={()=>setInvLocation({type:"ambulance",id:a.id})} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 16px",background:invLocation.id===a.id?C.accentDim:"none",border:"none",color:invLocation.id===a.id?C.accent:C.textMid,cursor:"pointer",fontSize:12,textAlign:"left",fontFamily:C.fontDisplay}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:invLocation.id===a.id?C.accent:C.textDim,flexShrink:0}}/>
                <span style={{flex:1}}>{a.code}</span>
                <span style={{fontSize:10,color:C.textDim}}>{stations.find(s=>s.id===a.station)?.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:24}}>
        {invView==="dashboard"  && <InvDashboard inventory={inventory} orders={orders} waste={waste} stations={stations} vehicles={vehicles} invItems={invItems}/>}
        {(invView==="stations"||invView==="fleet")&&(
          <div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:18,fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>{locName}</div>
              <div style={{fontSize:12,color:C.textMid,fontFamily:C.font}}>{invLocation.type==="station"?"Station Inventory":`Fleet Unit · ${stations.find(s=>s.id===vehicles.find(a=>a.id===invLocation.id)?.station)?.name}`}</div>
            </div>
            <InvTable inventory={inventory} setInventory={setInventory} locationId={invLocation.id} invItems={invItems} stations={stations} vehicles={vehicles}/>
          </div>
        )}
        {invView==="orders"    && <InvOrders inventory={inventory} orders={orders} setOrders={setOrders} stations={stations} invItems={invItems}/>}
        {invView==="waste"     && <InvWaste waste={waste} setWaste={setWaste} invItems={invItems} stations={stations}/>}
        {invView==="lots"      && <LotLookup inventory={inventory} stations={stations} vehicles={vehicles} invItems={invItems}/>}
        {invView==="configure" && <InvConfigure stations={stations} setStations={setStations} vehicles={vehicles} setVehicles={setVehicles} invItems={invItems} setInvItems={setInvItems} inventory={inventory} setInventory={setInventory}/>}
      </div>
    </div>
  );
}

function InvDashboard({inventory,orders,waste,stations,vehicles,invItems}){
  const stList=stations||SEED_STATION_LIST;
  const ambList=vehicles||SEED_AMBULANCES;
  const itmList=invItems||SEED_ITEMS;
  const allLocs=[...stList.map(s=>s.id),...ambList.map(a=>a.id)];
  let crit=0,low=0,expiring=0;
  itmList.forEach(item=>allLocs.forEach(locId=>{
    const e=inventory[`${locId}__${item.id}`];if(!e)return;
    const st=invStatus(e.qty,item);
    if(st==="critical")crit++;else if(st==="low")low++;
    if(e.expiry&&daysUntilExpiry(e.expiry)<=90&&e.qty>0)expiring++;
  }));
  const pending=orders.filter(o=>o.status==="pending").length;

  const expSoon=[];
  itmList.filter(i=>i.category==="Medications").forEach(item=>{
    allLocs.forEach(locId=>{
      const e=inventory[`${locId}__${item.id}`];if(!e||!e.expiry)return;
      const days=daysUntilExpiry(e.expiry);
      if(days!==null&&days<=60&&days>0&&e.qty>0){
        const loc=stList.find(s=>s.id===locId)?.name||ambList.find(a=>a.id===locId)?.code||locId;
        expSoon.push({item,loc,days,qty:e.qty});
      }
    });
  });
  expSoon.sort((a,b)=>a.days-b.days);

  const critItems=[];
  itmList.forEach(item=>{
    stList.forEach(st=>{
      const e=inventory[`${st.id}__${item.id}`];
      if(e&&invStatus(e.qty,item)==="critical")critItems.push({item,station:st.name,qty:e.qty});
    });
  });

  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>Inventory Overview</div>
        <div style={{fontSize:13,color:C.textMid,marginTop:4}}>All stations and fleet units</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Critical",val:crit,color:C.red},{label:"Low Stock",val:low,color:C.yellow},{label:"Expiring ≤90d",val:expiring,color:C.orange},{label:"Pending Orders",val:pending,color:C.blue}].map(({label,val,color})=>(
          <div key={label} style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${color}`,borderRadius:C.radius,padding:"14px 18px"}}>
            <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
            <div style={{fontSize:26,fontWeight:800,color,letterSpacing:"-0.03em"}}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <SHdr label="Station Inventory Health"/>
          {stList.map(station=>{
            let c=0,l=0,o=0;
            itmList.forEach(item=>{const e=inventory[`${station.id}__${item.id}`];if(!e)return;const st=invStatus(e.qty,item);if(st==="critical")c++;else if(st==="low")l++;else o++;});
            const total=c+l+o||1;
            return(
              <div key={station.id} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,color:C.text}}>{station.name}</span>
                  <span style={{fontSize:11,fontFamily:C.font}}>{c>0&&<span style={{color:C.red,marginRight:8}}>●{c} crit</span>}{l>0&&<span style={{color:C.yellow}}>●{l} low</span>}</span>
                </div>
                <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden",display:"flex"}}>
                  <div style={{width:`${(o/total)*100}%`,background:C.green}}/><div style={{width:`${(l/total)*100}%`,background:C.yellow}}/><div style={{width:`${(c/total)*100}%`,background:C.red}}/>
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <SHdr label="⏰ Medications Expiring ≤60 Days"/>
          {expSoon.length===0&&<div style={{color:C.textDim,fontSize:13}}>No medications expiring within 60 days. ✓</div>}
          <div style={{maxHeight:220,overflowY:"auto"}}>
            {expSoon.slice(0,12).map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                <div>
                  <div style={{color:C.text,fontWeight:600}}>{e.item.name}</div>
                  <div style={{color:C.textMid}}>{e.loc} — {e.qty} {e.item.unit}(s)</div>
                </div>
                <span style={{color:e.days<=30?C.red:C.yellow,fontWeight:800,fontFamily:C.font,fontSize:11}}>{e.days}d</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {critItems.length>0&&(
        <Card style={{border:`1px solid ${C.redBorder}`}}>
          <SHdr label="🔴 Critical Stock — Station Level"/>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>
              {["Item","Station","Category","Qty"].map(h=><th key={h} style={{textAlign:h==="Qty"?"right":"left",paddingBottom:8,fontWeight:600}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {critItems.slice(0,12).map((c,i)=>(
                <tr key={i} style={{borderTop:`1px solid ${C.border}`}}>
                  <td style={{padding:"8px 0",color:C.text,fontWeight:600}}>{c.item.name}</td>
                  <td style={{padding:"8px 0",color:C.textMid}}>{c.station}</td>
                  <td style={{padding:"8px 0",color:C.textMid}}>{c.item.category}</td>
                  <td style={{padding:"8px 0",color:C.red,fontWeight:800,textAlign:"right",fontFamily:C.font}}>{c.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function InvTable({inventory,setInventory,locationId,invItems,stations,vehicles}){
  const itmList=invItems||SEED_ITEMS;
  const stList=stations||SEED_STATION_LIST;
  const vehList=vehicles||SEED_AMBULANCES;
  const [search,setSearch]=useState("");
  const [catFilter,setCatFilter]=useState("All");
  const [statusFilter,setStatusFilter]=useState("All");
  const [editModal,setEditModal]=useState(null);
  const items=itmList.filter(item=>{
    if(catFilter!=="All"&&item.category!==catFilter)return false;
    if(search&&!item.name.toLowerCase().includes(search.toLowerCase()))return false;
    if(statusFilter!=="All"){const e=inventory[`${locationId}__${item.id}`];if(invStatus(e?.qty??0,item)!==statusFilter)return false;}
    return true;
  });
  const save=(item,updatedEntry)=>{
    const updated={...inventory,[`${locationId}__${item.id}`]:{...updatedEntry,lastUpdated:new Date().toISOString().split("T")[0]}};
    setInventory(updated);store.set("mps_inventory",updated);setEditModal(null);
  };
  const saveTransfer=(item,fromEntry,toLocId,toEntry)=>{
    const updated={
      ...inventory,
      [`${locationId}__${item.id}`]:{...fromEntry,lastUpdated:new Date().toISOString().split("T")[0]},
      [`${toLocId}__${item.id}`]:{...toEntry,lastUpdated:new Date().toISOString().split("T")[0]},
    };
    setInventory(updated);store.set("mps_inventory",updated);setEditModal(null);
  };
  return(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items..." style={{...inputSt,flex:1,minWidth:180}}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={inputSt}><option value="All">All Categories</option>{INV_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={inputSt}><option value="All">All Status</option>{["critical","low","adequate","stocked"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>
            {["Item","Category","Qty","Par","Order Pt","Status","Earliest Expiry","Lot(s)","Updated",""].map(h=><th key={h} style={{textAlign:["Qty","Par","Order Pt"].includes(h)?"center":"left",paddingBottom:10,fontWeight:600,paddingRight:12}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {items.map(item=>{
              const e=inventory[`${locationId}__${item.id}`]||{qty:0,expiry:null,lastUpdated:"—",lotNumber:null,lots:[]};
              const st=invStatus(e.qty,item);
              const days=daysUntilExpiry(e.expiry);
              const lots=e.lots||[];
              const activeLots=lots.filter(l=>l.qty>0);
              return(
                <tr key={item.id} style={{borderTop:`1px solid ${C.border}`}}>
                  <td style={{padding:"9px 12px 9px 0",color:C.text,fontWeight:600}}>{item.name}</td>
                  <td style={{padding:"9px 12px 9px 0",color:C.textMid}}>{item.category}</td>
                  <td style={{padding:"9px 12px 9px 0",color:st==="critical"?C.red:C.text,fontWeight:800,textAlign:"center",fontFamily:C.font}}>{e.qty}</td>
                  <td style={{padding:"9px 12px 9px 0",color:C.textMid,textAlign:"center"}}>{item.parLevel}</td>
                  <td style={{padding:"9px 12px 9px 0",color:C.textMid,textAlign:"center"}}>{item.orderPoint}</td>
                  <td style={{padding:"9px 12px 9px 0"}}><span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:3,color:statusColor(st),background:statusBg(st),border:`1px solid ${statusColor(st)}44`,fontFamily:C.font}}>{statusLabel(st)}</span></td>
                  <td style={{padding:"9px 12px 9px 0",fontSize:12}}>
                    {e.expiry?<span style={{color:days!==null&&days<=30?C.red:days!==null&&days<=90?C.yellow:C.textMid,fontFamily:C.font}}>{e.expiry} ({days}d)</span>:<span style={{color:C.textDim}}>N/A</span>}
                  </td>
                  <td style={{padding:"9px 12px 9px 0",fontSize:11,fontFamily:C.font}}>
                    {activeLots.length===0
                      ? <span style={{color:C.textDim}}>—</span>
                      : activeLots.map((l,i)=>(
                        <div key={i} style={{color:C.textMid,marginBottom:1}}>
                          <span style={{color:C.blue}}>{l.lotNumber}</span>
                          <span style={{color:C.textDim}}> ×{l.qty}</span>
                        </div>
                      ))
                    }
                  </td>
                  <td style={{padding:"9px 12px 9px 0",color:C.textMid,fontSize:12,fontFamily:C.font}}>{e.lastUpdated}</td>
                  <td style={{padding:"9px 0",whiteSpace:"nowrap"}}>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>setEditModal({item,entry:e,mode:"receive"})} style={{background:C.greenDim,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",color:C.green,fontSize:11,fontWeight:700}}>+ Receive</button>
                      <button onClick={()=>setEditModal({item,entry:e,mode:"transfer"})} style={{background:C.blueDim,border:`1px solid ${C.blueBorder}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",color:C.blue,fontSize:11,fontWeight:700}}>⇄ Transfer</button>
                      <button onClick={()=>setEditModal({item,entry:e,mode:"adjust"})} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",color:C.textMid,fontSize:11}}>Adjust</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editModal&&<InvEditModal
        item={editModal.item} entry={editModal.entry} mode={editModal.mode}
        fromLocId={locationId} inventory={inventory}
        stations={stList} vehicles={vehList}
        onSave={save} onTransfer={saveTransfer} onClose={()=>setEditModal(null)}
      />}
    </div>
  );
}

function InvEditModal({item,entry,mode,fromLocId,inventory,stations,vehicles,onSave,onTransfer,onClose}){
  const stList=stations||SEED_STATION_LIST;
  const vehList=vehicles||SEED_AMBULANCES;

  // Receive state
  const [qty,setQty]=useState(String(entry.qty));
  const [expiry,setExpiry]=useState(entry.expiry||"");
  const [lot,setLot]=useState("");
  const [supplier,setSupplier]=useState("");
  const [receivedDate,setReceivedDate]=useState(new Date().toISOString().split("T")[0]);
  const [adjNote,setAdjNote]=useState("");

  // Transfer state
  const [xferQty,setXferQty]=useState("1");
  const [xferLot,setXferLot]=useState("all"); // "all" or specific lot number
  const [toLocType,setToLocType]=useState("station");
  const [toLocId,setToLocId]=useState("");
  const [xferNote,setXferNote]=useState("");

  const lots=entry.lots||[];
  const activeLots=lots.filter(l=>l.qty>0);

  // Build destination location options
  const stationOpts=stList.filter(s=>s.id!==fromLocId).map(s=>({id:s.id,label:`${s.name} (Station)`,type:"station"}));
  const vehicleOpts=vehList.filter(v=>v.id!==fromLocId).map(v=>{
    const stn=stList.find(s=>s.id===v.station);
    return {id:v.id,label:`${v.code} — ${stn?.name||""}  (Vehicle)`,type:"vehicle"};
  });
  const allDests=toLocType==="station"?stationOpts:vehicleOpts;

  const handleReceive=()=>{
    if(!lot.trim())return;
    const newLot={lotNumber:lot.trim(),qty:parseInt(qty)||0,expiry:expiry||null,receivedDate,supplier};
    const existing=lots.find(l=>l.lotNumber===lot.trim());
    let updatedLots;
    if(existing){
      updatedLots=lots.map(l=>l.lotNumber===lot.trim()?{...l,qty:l.qty+(parseInt(qty)||0),expiry:expiry||l.expiry,supplier:supplier||l.supplier}:l);
    } else {
      updatedLots=[...lots,newLot];
    }
    const totalQty=updatedLots.reduce((s,l)=>s+l.qty,0);
    const earliestExpiry=updatedLots.filter(l=>l.expiry&&l.qty>0).map(l=>l.expiry).sort()[0]||null;
    onSave(item,{...entry,qty:totalQty,expiry:earliestExpiry,lotNumber:updatedLots[updatedLots.length-1]?.lotNumber||null,lots:updatedLots});
  };

  const handleAdjust=()=>{
    onSave(item,{...entry,qty:parseInt(qty)||0,expiry:expiry||entry.expiry,lots:entry.lots||[]});
  };

  const handleTransfer=()=>{
    if(!toLocId) return;
    const n=parseInt(xferQty)||0;
    if(n<=0||n>entry.qty) return;

    // Deduct from source
    let srcLots;
    if(xferLot==="all"||activeLots.length===0){
      // Proportionally reduce all lots
      let remaining=n;
      srcLots=lots.map(l=>{
        if(remaining<=0) return l;
        const take=Math.min(l.qty,remaining);
        remaining-=take;
        return {...l,qty:l.qty-take};
      }).filter(l=>l.qty>0);
    } else {
      // Deduct from specific lot
      srcLots=lots.map(l=>l.lotNumber===xferLot?{...l,qty:l.qty-n}:l).filter(l=>l.qty>0);
    }
    const srcQty=srcLots.reduce((s,l)=>s+l.qty,0);
    const srcExpiry=srcLots.filter(l=>l.expiry&&l.qty>0).map(l=>l.expiry).sort()[0]||null;

    // Add to destination — carry the lot info
    const destEntry=inventory[`${toLocId}__${item.id}`]||{qty:0,expiry:null,lastUpdated:"—",lotNumber:null,lots:[]};
    const destLots=[...(destEntry.lots||[])];
    const srcLotObj=xferLot!=="all"?lots.find(l=>l.lotNumber===xferLot):null;
    // For each transferred lot, merge into destination
    const lotsToTransfer=xferLot==="all"||!srcLotObj
      ? lots.filter(l=>l.qty>0)
      : [{...srcLotObj,qty:n}];

    lotsToTransfer.forEach(tl=>{
      const existing=destLots.find(l=>l.lotNumber===tl.lotNumber);
      if(existing){
        const take=Math.min(tl.qty,n);
        existing.qty+=take;
      } else {
        const take=Math.min(tl.qty,n);
        destLots.push({...tl,qty:take,receivedDate:new Date().toISOString().split("T")[0],supplier:tl.supplier||""});
      }
    });

    const destQty=destLots.reduce((s,l)=>s+l.qty,0);
    const destExpiry=destLots.filter(l=>l.expiry&&l.qty>0).map(l=>l.expiry).sort()[0]||null;

    const srcEntry={...entry,qty:srcQty,expiry:srcExpiry,lots:srcLots};
    const newDestEntry={...destEntry,qty:destQty,expiry:destExpiry,lots:destLots};
    onTransfer(item,srcEntry,toLocId,newDestEntry);
  };

  const removeLot=(lotNum)=>{
    const updatedLots=lots.filter(l=>l.lotNumber!==lotNum);
    const totalQty=updatedLots.reduce((s,l)=>s+l.qty,0);
    const earliestExpiry=updatedLots.filter(l=>l.expiry&&l.qty>0).map(l=>l.expiry).sort()[0]||null;
    onSave(item,{...entry,qty:totalQty,expiry:earliestExpiry,lots:updatedLots});
  };

  // Resolve human-readable name of fromLoc
  const fromName=stList.find(s=>s.id===fromLocId)?.name||vehList.find(v=>v.id===fromLocId)?.code||fromLocId;

  return(
    <div style={{position:"fixed",inset:0,background:"#00000099",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,width:"100%",maxWidth:580,maxHeight:"92vh",overflowY:"auto",padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontSize:15,fontWeight:800,color:C.text}}>
            {mode==="receive"?"Receive Stock":mode==="transfer"?"Transfer Stock":"Adjust Inventory"}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
        </div>
        <div style={{fontSize:12,color:C.textMid,marginBottom:20,fontFamily:C.font}}>
          {item.name} · {item.category} · <span style={{color:C.text,fontWeight:600}}>From: {fromName}</span>
          {" "}<span style={{color:C.textDim}}>· On hand: {entry.qty} {item.unit}</span>
        </div>

        {/* ── RECEIVE ── */}
        {mode==="receive"&&(
          <>
            <div style={{background:C.greenDim,border:`1px solid ${C.greenBorder}`,borderRadius:C.radiusSm,padding:"10px 14px",marginBottom:18,fontSize:12,color:C.green}}>
              📦 Record a new stock receipt. Each lot is tracked separately for recall and expiry management.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Lot Number *</label><input value={lot} onChange={e=>setLot(e.target.value)} style={inputSt} placeholder="e.g. LOT123456"/></div>
              <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Quantity Received ({item.unit})</label><input value={qty} onChange={e=>setQty(e.target.value)} type="number" min="1" style={inputSt}/></div>
              <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Expiry Date</label><input value={expiry} onChange={e=>setExpiry(e.target.value)} type="date" style={inputSt}/></div>
              <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Received Date</label><input value={receivedDate} onChange={e=>setReceivedDate(e.target.value)} type="date" style={inputSt}/></div>
              <div style={{gridColumn:"span 2"}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Supplier / Vendor</label><input value={supplier} onChange={e=>setSupplier(e.target.value)} style={inputSt} placeholder="e.g. Medline, Bound Tree"/></div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:24}}>
              <Btn onClick={onClose}>Cancel</Btn>
              <Btn variant="success" disabled={!lot.trim()||(parseInt(qty)||0)<=0} onClick={handleReceive}>+ Record Receipt</Btn>
            </div>
          </>
        )}

        {/* ── TRANSFER ── */}
        {mode==="transfer"&&(
          <>
            <div style={{background:C.blueDim,border:`1px solid ${C.blueBorder}`,borderRadius:C.radiusSm,padding:"10px 14px",marginBottom:18,fontSize:12,color:C.blue}}>
              ⇄ Move stock from <strong>{fromName}</strong> to another station or vehicle. Lot records travel with the stock.
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {/* Qty to transfer */}
              <div>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Quantity to Transfer ({item.unit}) *</label>
                <input value={xferQty} onChange={e=>setXferQty(e.target.value)} type="number" min="1" max={entry.qty} style={{...inputSt,border:`1px solid ${(parseInt(xferQty)||0)>entry.qty?C.red:C.border}`}}/>
                {(parseInt(xferQty)||0)>entry.qty&&<div style={{fontSize:11,color:C.red,marginTop:3}}>Exceeds available qty ({entry.qty})</div>}
              </div>

              {/* Lot selection (only if multiple lots) */}
              <div>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Lot to Transfer</label>
                <select value={xferLot} onChange={e=>setXferLot(e.target.value)} style={inputSt}>
                  <option value="all">All / Proportional</option>
                  {activeLots.map(l=><option key={l.lotNumber} value={l.lotNumber}>{l.lotNumber} (×{l.qty})</option>)}
                </select>
              </div>

              {/* Destination type */}
              <div>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Destination Type</label>
                <select value={toLocType} onChange={e=>{setToLocType(e.target.value);setToLocId("");}} style={inputSt}>
                  <option value="station">Station</option>
                  <option value="vehicle">Vehicle</option>
                </select>
              </div>

              {/* Destination location */}
              <div>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Destination *</label>
                <select value={toLocId} onChange={e=>setToLocId(e.target.value)} style={inputSt}>
                  <option value="">— Select destination —</option>
                  {allDests.map(d=><option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>

              <div style={{gridColumn:"span 2"}}>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Transfer Note (optional)</label>
                <input value={xferNote} onChange={e=>setXferNote(e.target.value)} style={inputSt} placeholder="e.g. Restocking MPS-05 from Bracebridge station"/>
              </div>
            </div>

            {/* Preview */}
            {toLocId&&(parseInt(xferQty)||0)>0&&(parseInt(xferQty)||0)<=entry.qty&&(()=>{
              const destEntry=inventory[`${toLocId}__${item.id}`]||{qty:0};
              const destName=stList.find(s=>s.id===toLocId)?.name||vehList.find(v=>v.id===toLocId)?.code||toLocId;
              const n=parseInt(xferQty);
              return(
                <div style={{background:C.surfaceRaised,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"12px 14px",marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.textDim,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Transfer Preview</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                    <div style={{background:C.bg,borderRadius:6,padding:"8px 12px"}}>
                      <div style={{color:C.textMid,marginBottom:3}}>📤 {fromName} (source)</div>
                      <div style={{color:C.text}}>{entry.qty} → <strong style={{color:C.red}}>{entry.qty-n}</strong> {item.unit}</div>
                    </div>
                    <div style={{background:C.bg,borderRadius:6,padding:"8px 12px"}}>
                      <div style={{color:C.textMid,marginBottom:3}}>📥 {destName} (destination)</div>
                      <div style={{color:C.text}}>{destEntry.qty} → <strong style={{color:C.green}}>{destEntry.qty+n}</strong> {item.unit}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:24}}>
              <Btn onClick={onClose}>Cancel</Btn>
              <Btn variant="primary"
                disabled={!toLocId||(parseInt(xferQty)||0)<=0||(parseInt(xferQty)||0)>entry.qty}
                onClick={handleTransfer}>⇄ Confirm Transfer</Btn>
            </div>
          </>
        )}

        {/* ── ADJUST ── */}
        {mode==="adjust"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Quantity ({item.unit})</label><input value={qty} onChange={e=>setQty(e.target.value)} type="number" min="0" style={inputSt}/></div>
              {item.category==="Medications"&&<div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Earliest Expiry</label><input value={expiry} onChange={e=>setExpiry(e.target.value)} type="date" style={inputSt}/></div>}
              <div style={{gridColumn:"span 2"}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Reason for Adjustment</label><input value={adjNote} onChange={e=>setAdjNote(e.target.value)} style={inputSt} placeholder="e.g. count correction, waste removal"/></div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:24}}>
              <Btn onClick={onClose}>Cancel</Btn>
              <Btn variant="primary" onClick={handleAdjust}>Save Adjustment</Btn>
            </div>
          </>
        )}

        {/* Active lot records (shown in receive + adjust modes) */}
        {mode!=="transfer"&&lots.length>0&&(
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16}}>
            <div style={{fontSize:11,fontWeight:700,color:C.textDim,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Active Lot Records</div>
            {lots.map((l,i)=>{
              const d=daysUntilExpiry(l.expiry);
              return(
                <div key={i} style={{background:C.surfaceRaised,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.blue,fontFamily:C.font}}>{l.lotNumber}</div>
                    <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,marginTop:3,display:"flex",gap:14}}>
                      <span>Qty: <strong style={{color:C.text}}>{l.qty} {item.unit}</strong></span>
                      {l.expiry&&<span style={{color:d!==null&&d<=30?C.red:d!==null&&d<=90?C.yellow:C.textMid}}>Exp: {l.expiry}{d!==null?` (${d}d)`:""}</span>}
                      {l.receivedDate&&<span>Recv: {l.receivedDate}</span>}
                      {l.supplier&&<span>From: {l.supplier}</span>}
                    </div>
                  </div>
                  <button onClick={()=>removeLot(l.lotNumber)} style={{background:"none",border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"3px 7px",cursor:"pointer",color:C.red,fontSize:11}}>Remove</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InvOrders({inventory,orders,setOrders,stations,invItems}){
  const stList=stations||SEED_STATION_LIST;
  const itmList=invItems||SEED_ITEMS;
  const [modal,setModal]=useState(false);
  const [filter,setFilter]=useState("All");
  const fulfill=id=>{const u=orders.map(o=>o.id===id?{...o,status:"fulfilled",fulfilledDate:new Date().toISOString().split("T")[0]}:o);setOrders(u);store.set("mps_orders",u);};
  const cancel=id=>{const u=orders.map(o=>o.id===id?{...o,status:"cancelled"}:o);setOrders(u);store.set("mps_orders",u);};
  const suggestions=[];
  itmList.forEach(item=>stList.forEach(st=>{const e=inventory[`${st.id}__${item.id}`];if(e&&(invStatus(e.qty,item)==="critical"||invStatus(e.qty,item)==="low"))suggestions.push({item,station:st,qty:e.qty,needed:item.parLevel-e.qty});}));
  const shown=filter==="All"?orders:orders.filter(o=>o.status===filter);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{fontSize:18,fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>Order Management</div><div style={{fontSize:13,color:C.textMid}}>Track supply orders across all locations</div></div>
        <Btn variant="primary" onClick={()=>setModal(true)}>+ New Order</Btn>
      </div>
      {suggestions.length>0&&(
        <div style={{background:C.yellowDim,border:`1px solid ${C.yellowBorder}`,borderRadius:C.radius,padding:16,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.yellow,marginBottom:10}}>⚠ Suggested Reorders ({suggestions.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
            {suggestions.slice(0,6).map((s,i)=>(
              <div key={i} style={{fontSize:12,color:C.text,background:C.surface,borderRadius:C.radiusSm,padding:"8px 12px"}}>
                <div style={{fontWeight:700}}>{s.item.name}</div>
                <div style={{color:C.textMid}}>{s.station.name} — Have: {s.qty}, Need: +{s.needed}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["All","pending","fulfilled","cancelled"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:C.radiusSm,fontSize:12,cursor:"pointer",fontWeight:600,background:filter===s?C.accent:C.surface,border:`1px solid ${filter===s?C.accent:C.border}`,color:filter===s?"#fff":C.textMid,fontFamily:C.fontDisplay}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>
      {shown.length===0&&<div style={{color:C.textDim,fontSize:14,textAlign:"center",padding:30}}>No orders found.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {shown.map(order=>(
          <div key={order.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{order.item}</div>
              <div style={{fontSize:12,color:C.textMid,marginTop:2,fontFamily:C.font}}>{order.location} · Qty: {order.qty} · {order.date}{order.notes?` · ${order.notes}`:""}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:3,color:order.status==="fulfilled"?C.green:order.status==="cancelled"?C.textMid:C.yellow,background:order.status==="fulfilled"?C.greenDim:order.status==="cancelled"?C.border:C.yellowDim,fontFamily:C.font}}>{order.status.toUpperCase()}</span>
              {order.status==="pending"&&<><Btn size="sm" variant="success" onClick={()=>fulfill(order.id)}>Fulfill</Btn><Btn size="sm" onClick={()=>cancel(order.id)}>Cancel</Btn></>}
            </div>
          </div>
        ))}
      </div>
      {modal&&<NewOrderModal onClose={()=>setModal(false)} stations={stList} invItems={itmList} onSave={order=>{const u=[{...order,id:uid(),date:new Date().toISOString().split("T")[0],status:"pending"},...orders];setOrders(u);store.set("mps_orders",u);setModal(false);}}/>}
    </div>
  );
}

function NewOrderModal({onClose,onSave,stations,invItems}){
  const stList=stations||SEED_STATION_LIST;
  const itmList=invItems||SEED_ITEMS;
  const [item,setItem]=useState(itmList[0]?.name||"");
  const [loc,setLoc]=useState(stList[0]?.name||"");
  const [qty,setQty]=useState("1");
  const [notes,setNotes]=useState("");
  return(
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Card style={{width:440,maxWidth:"90vw"}}>
        <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:20}}>Create New Order</div>
        {[{label:"Item",el:<select value={item} onChange={e=>setItem(e.target.value)} style={inputSt}>{itmList.map(i=><option key={i.id}>{i.name}</option>)}</select>},{label:"Deliver To",el:<select value={loc} onChange={e=>setLoc(e.target.value)} style={inputSt}>{stList.map(s=><option key={s.id}>{s.name}</option>)}</select>},{label:"Quantity",el:<input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={inputSt}/>},{label:"Notes",el:<input value={notes} onChange={e=>setNotes(e.target.value)} style={inputSt} placeholder="e.g. Urgent — critical stock"/>}].map(({label,el})=>(
          <div key={label} style={{marginBottom:14}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>{label}</label>{el}</div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" onClick={()=>onSave({item,location:loc,qty:parseInt(qty),notes})}>Submit Order</Btn></div>
      </Card>
    </div>
  );
}

function InvWaste({waste,setWaste,invItems,stations}){
  const itmList=invItems||SEED_ITEMS;
  const stList=stations||SEED_STATION_LIST;
  const [modal,setModal]=useState(false);
  const reasons=["Expired","Damaged","Contaminated","Patient Use – Wastage","Admin Error","Other"];
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{fontSize:18,fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>Waste & Discards</div><div style={{fontSize:13,color:C.textMid}}>Log expired, damaged, or wasted items</div></div>
        <Btn variant="primary" onClick={()=>setModal(true)}>+ Log Waste</Btn>
      </div>
      {waste.length===0&&<div style={{color:C.textDim,fontSize:14,textAlign:"center",padding:30}}>No waste records yet.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {waste.map((w,i)=>(
          <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{w.item}</div>
              <div style={{fontSize:12,color:C.textMid,fontFamily:C.font,marginTop:2}}>{w.location} · Qty: {w.qty} · {w.reason} · {w.date}</div>
            </div>
            <span style={{fontSize:12,color:C.textDim}}>{w.loggedBy}</span>
          </div>
        ))}
      </div>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <WasteForm reasons={reasons} invItems={itmList} stations={stList} onClose={()=>setModal(false)} onSave={entry=>{const u=[{...entry,id:uid(),date:new Date().toISOString().split("T")[0]},...waste];setWaste(u);store.set("mps_waste",u);setModal(false);}}/>
        </div>
      )}
    </div>
  );
}

function WasteForm({reasons,onClose,onSave,invItems,stations}){
  const itmList=invItems||SEED_ITEMS;
  const stList=stations||SEED_STATION_LIST;
  const [item,setItem]=useState(itmList[0]?.name||"");
  const [loc,setLoc]=useState(stList[0]?.name||"");
  const [qty,setQty]=useState("1");
  const [reason,setReason]=useState(reasons[0]);
  const [loggedBy,setLoggedBy]=useState("");
  return(
    <Card style={{width:440,maxWidth:"90vw"}}>
      <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:20}}>Log Waste / Discard</div>
      {[{label:"Item",el:<select value={item} onChange={e=>setItem(e.target.value)} style={inputSt}>{itmList.map(i=><option key={i.id}>{i.name}</option>)}</select>},{label:"Location",el:<select value={loc} onChange={e=>setLoc(e.target.value)} style={inputSt}>{stList.map(s=><option key={s.id}>{s.name}</option>)}</select>},{label:"Quantity",el:<input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={inputSt}/>},{label:"Reason",el:<select value={reason} onChange={e=>setReason(e.target.value)} style={inputSt}>{reasons.map(r=><option key={r}>{r}</option>)}</select>},{label:"Logged By",el:<input value={loggedBy} onChange={e=>setLoggedBy(e.target.value)} style={inputSt} placeholder="Name / Employee ID"/>}].map(({label,el})=>(
        <div key={label} style={{marginBottom:14}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>{label}</label>{el}</div>
      ))}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}><Btn onClick={onClose}>Cancel</Btn><Btn variant="danger" onClick={()=>onSave({item,location:loc,qty:parseInt(qty),reason,loggedBy})}>Log Waste</Btn></div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// OPERATIONS MODULE (Crew, Super, Admin, Reports) — condensed imports
// ═══════════════════════════════════════════════════════════════════════
// [All operations components from v2 — inline below]

// ═══════════════════════════════════════════════════════════════════════
// ROLE PERMISSIONS MAP
// ═══════════════════════════════════════════════════════════════════════
const ROLE_DEFAULTS = {
  "Crew":              {home:false, crew:true,  inventory:"vehicle", superintendent:false, admin:false, reports:false},
  "Superintendent":    {home:true,  crew:true,  inventory:"full",    superintendent:true,  admin:false, reports:false},
  "Operations Manager":{home:true,  crew:true,  inventory:"full",    superintendent:true,  admin:true,  reports:true},
  "Admin":             {home:true,  crew:true,  inventory:"full",    superintendent:true,  admin:true,  reports:true},
};
function getPerms(user){
  if(!user) return ROLE_DEFAULTS["Crew"];
  // User can have custom privileges stored, fall back to role defaults
  return user.privileges || ROLE_DEFAULTS[user.role] || ROLE_DEFAULTS["Crew"];
}

function LoginScreen({users,shifts,onLogin}){
  const shiftList=shifts&&shifts.length>0?shifts:SEED_SHIFTS;
  const [empId,setEmpId]=useState("");
  const [password,setPassword]=useState("");
  const [shiftId,setShiftId]=useState("");
  const [unit,setUnit]=useState("");
  const [error,setError]=useState("");
  const [step,setStep]=useState("login");
  const [authedUser,setAuthedUser]=useState(null);
  const activeUsers=users.filter(u=>u.status==="Active");

  const handleLogin=()=>{
    setError("");
    const user=users.find(u=>u.employeeId===empId);
    if(!user){setError("Employee not found. Check your ID.");return;}
    if(user.status==="Suspended"){setError("This account is suspended. Contact your manager.");return;}
    if(user.status==="Inactive"){setError("This account is inactive. Contact admin.");return;}
    if(!checkPassword(password,user.passwordHash)){setError("Incorrect password.");return;}
    setAuthedUser(user);setShiftId(shiftList[0]?.id||"");setStep("roster");
  };

  const handleRoster=()=>{
    if(!shiftId){setError("Please select your shift.");return;}
    const perms=getPerms(authedUser);
    const needsUnit=authedUser.role==="Crew";
    if(needsUnit&&!unit){setError("Please select your unit.");return;}
    const sel=shiftList.find(s=>s.id===shiftId)||shiftList[0];
    onLogin({...authedUser,unit:needsUnit?unit:authedUser.unit,shift:sel.label,shiftId:sel.id,shiftStart:sel.start,shiftEnd:sel.end,perms,rosteredAt:new Date().toISOString()});
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:C.fontDisplay,padding:24}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:64,height:64,background:C.accent,borderRadius:18,display:"grid",placeItems:"center",fontSize:30,margin:"0 auto 16px"}}>🚑</div>
          <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>MPS Unified Platform</div>
          <div style={{fontSize:12,color:C.textMid,marginTop:4,fontFamily:C.font}}>DISTRICT MUNICIPALITY OF MUSKOKA</div>
        </div>
        {step==="login"&&(
          <Card>
            <SHdr label="Sign In"/>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Employee</label>
              <select value={empId} onChange={e=>setEmpId(e.target.value)} style={inputSt}>
                <option value="">— Select your name —</option>
                {activeUsers.map(u=><option key={u.id} value={u.employeeId}>{u.firstName} {u.lastName} ({u.employeeId})</option>)}
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={inputSt} placeholder="Enter your password"/>
            </div>
            {error&&<div style={{background:C.redDim,border:`1px solid ${C.redBorder}`,borderRadius:C.radiusSm,padding:"8px 12px",fontSize:12,color:C.red,marginBottom:14}}>{error}</div>}
            <Btn variant="primary" size="lg" style={{width:"100%",justifyContent:"center"}} disabled={!empId||!password} onClick={handleLogin}>Sign In →</Btn>
          </Card>
        )}
        {step==="roster"&&authedUser&&(
          <Card style={{border:`1px solid ${C.greenBorder}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:C.accentDim,display:"grid",placeItems:"center",fontSize:18,fontWeight:700,color:C.accent,flexShrink:0}}>
                {authedUser.firstName[0]}{authedUser.lastName[0]}
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:C.text}}>{authedUser.firstName} {authedUser.lastName}</div>
                <div style={{fontSize:12,color:C.textMid,fontFamily:C.font}}>{authedUser.certLevel} · {authedUser.role}</div>
              </div>
            </div>
            <SHdr label="Roster On"/>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:8}}>Shift *</label>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {shiftList.map(s=>(
                  <div key={s.id} onClick={()=>setShiftId(s.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:C.radiusSm,border:`2px solid ${shiftId===s.id?(s.color||C.accent):C.border}`,background:shiftId===s.id?`${s.color||C.accent}18`:C.surfaceRaised,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:s.color||C.accent,flexShrink:0}}/>
                      <span style={{fontSize:13,fontWeight:shiftId===s.id?700:400,color:shiftId===s.id?(s.color||C.accent):C.text}}>{s.label}</span>
                    </div>
                    <span style={{fontSize:12,color:C.textMid,fontFamily:C.font,letterSpacing:"0.04em"}}>{s.start} – {s.end}</span>
                  </div>
                ))}
              </div>
            </div>
            {authedUser.role==="Crew"&&(
              <div style={{marginBottom:14}}>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Unit Assigned *</label>
                <select value={unit} onChange={e=>setUnit(e.target.value)} style={inputSt}>
                  <option value="">— Select unit —</option>
                  {AMBULANCES.map(a=><option key={a.id} value={a.id}>{a.code} ({STATION_LIST.find(s=>s.id===a.station)?.name||""})</option>)}
                </select>
              </div>
            )}
            {error&&<div style={{background:C.redDim,border:`1px solid ${C.redBorder}`,borderRadius:C.radiusSm,padding:"8px 12px",fontSize:12,color:C.red,marginBottom:14}}>{error}</div>}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <Btn onClick={()=>{setStep("login");setError("");setAuthedUser(null);}}>← Back</Btn>
              <Btn variant="success" size="lg" style={{flex:1,justifyContent:"center"}} onClick={handleRoster}>Roster On ✓</Btn>
            </div>
          </Card>
        )}
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:C.textDim,fontFamily:C.font}}>
          Contact your Operations Manager if you cannot sign in.
        </div>
      </div>
    </div>
  );
}

function StationSelect({onSelect}){
  // Kept for backwards compatibility — redirects to full LoginScreen pattern
  const [name,setName]=useState("");const[station,setStation]=useState("");const[unit,setUnit]=useState("");const[shift,setShift]=useState("");
  const valid=name.trim()&&station&&unit&&shift;
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:C.fontDisplay,padding:24}}>
      <div style={{width:"100%",maxWidth:440}}>
        <Card>
          <SHdr label="Identify Yourself to Begin"/>
          {[{label:"Name / ID",el:<input style={inputSt} value={name} onChange={e=>setName(e.target.value)}/>},{label:"Station",el:<select style={inputSt} value={station} onChange={e=>setStation(e.target.value)}><option value="">— Select —</option>{STATION_NAMES.map(s=><option key={s}>{s}</option>)}</select>},{label:"Unit",el:<select style={inputSt} value={unit} onChange={e=>setUnit(e.target.value)}><option value="">— Select —</option>{UNITS.map(u=><option key={u}>{u}</option>)}</select>},{label:"Shift",el:<select style={inputSt} value={shift} onChange={e=>setShift(e.target.value)}><option value="">— Select —</option>{["Days","Nights","Relief"].map(s=><option key={s}>{s}</option>)}</select>}].map(({label,el})=>(
            <div key={label} style={{marginBottom:14}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>{label}</label>{el}</div>
          ))}
          <Btn variant="primary" size="lg" disabled={!valid} onClick={()=>onSelect({name,station,unit,shift})} style={{width:"100%",justifyContent:"center",marginTop:8}}>Continue →</Btn>
        </Card>
      </div>
    </div>
  );
}

function CrewPortal({session,templates,submissions,setSubmissions,inventory,vehicles,invItems}){
  const [view,setView]=useState("home");
  const [activeTpl,setActiveTpl]=useState(null);
  const [submitted,setSubmitted]=useState(false);

  const crewName=`${session.firstName} ${session.lastName}`;
  const unitObj=vehicles.find(v=>v.id===session.unit);
  const unitCode=unitObj?.code||session.unit||"";
  const stationName=session.station||"";

  // Inventory scope: crew sees only their vehicle, others see all
  const vehicleInv=session.perms.inventory==="vehicle";

  const assigned=templates.filter(t=>t.active&&(!t.assignedTo||t.assignedTo.includes("All Stations")||t.assignedTo.includes(stationName)));
  const catColors={Vehicle:C.blue,Medications:C.red,Equipment:C.teal,Incident:C.yellow,Custom:C.purple};
  const catIcons={Vehicle:"🚑",Medications:"💊",Equipment:"🔧",Incident:"📋",Custom:"📝"};
  const todayStr=new Date().toISOString().split("T")[0];

  if(view==="form"&&activeTpl) return (
    <FormView
      template={activeTpl}
      crewInfo={{name:crewName,station:stationName,unit:unitCode,shift:session.shift}}
      submitted={submitted}
      onSubmit={data=>{
        const sub={id:uid(),templateId:activeTpl.id,templateName:activeTpl.name,category:activeTpl.category,
          submittedAt:new Date().toISOString(),data,status:"submitted",
          crewName,station:stationName,unit:unitCode,shift:session.shift,
          employeeId:session.employeeId,acknowledgement:null};
        const u=[sub,...submissions];
        setSubmissions(u);store.set("mps_submissions",u);
        setSubmitted(true);
        setTimeout(()=>{setSubmitted(false);setView("home");},2400);
      }}
      onBack={()=>setView("home")}
    />
  );

  // Build vehicle inventory summary for crew's unit
  const itmList=invItems||SEED_ITEMS;
  const unitInvItems=vehicleInv&&session.unit ? itmList.map(item=>{
    const e=inventory?.[`${session.unit}__${item.id}`];
    return e ? {...item,...e,status:invStatus(e.qty,item)} : null;
  }).filter(Boolean) : [];
  const critVehicle=unitInvItems.filter(i=>i.status==="critical").length;
  const lowVehicle=unitInvItems.filter(i=>i.status==="low").length;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fontDisplay}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.surface} 0%,${C.bg} 100%)`,borderBottom:`1px solid ${C.border}`,padding:"18px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:42,height:42,background:C.accent,borderRadius:10,display:"grid",placeItems:"center",fontSize:20}}>🚑</div>
          <div><div style={{fontSize:18,fontWeight:800,color:C.text}}>Crew Operations Portal</div><div style={{fontSize:12,color:C.textMid,fontFamily:C.font}}>MUSKOKA PARAMEDIC SERVICES</div></div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{crewName}</div>
          <div style={{fontSize:11,color:C.textMid,fontFamily:C.font}}>{stationName} · {unitCode} · {session.shift}</div>
          <div style={{fontSize:10,color:C.green,fontFamily:C.font,marginTop:1}}>● ON DUTY</div>
        </div>
      </div>

      <div style={{padding:"28px 28px",maxWidth:980,margin:"0 auto"}}>
        {/* Vehicle inventory alert for crew */}
        {vehicleInv&&session.unit&&(critVehicle>0||lowVehicle>0)&&(
          <div style={{background:critVehicle>0?C.redDim:C.yellowDim,border:`1px solid ${critVehicle>0?C.redBorder:C.yellowBorder}`,borderRadius:C.radius,padding:"12px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:critVehicle>0?C.red:C.yellow}}>⚠ {unitCode} Inventory Alert</div>
              <div style={{fontSize:12,color:C.textMid,marginTop:2}}>
                {critVehicle>0&&<span style={{color:C.red,marginRight:12}}>{critVehicle} critical item{critVehicle!==1?"s":""}</span>}
                {lowVehicle>0&&<span style={{color:C.yellow}}>{lowVehicle} low item{lowVehicle!==1?"s":""}</span>}
              </div>
            </div>
            <Btn size="sm" onClick={()=>setView("vehicle-inv")}>View Inventory →</Btn>
          </div>
        )}

        {view==="vehicle-inv"&&vehicleInv&&(
          <div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <Btn onClick={()=>setView("home")}>← Back</Btn>
              <div style={{fontSize:18,fontWeight:800,color:C.text}}>{unitCode} — Vehicle Inventory</div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                {["Item","Category","Qty","Par","Status","Expiry"].map(h=><th key={h} style={{textAlign:"left",paddingBottom:8,fontWeight:600,paddingRight:12}}>{h}</th>)}
              </tr></thead>
              <tbody>{unitInvItems.map(item=>{
                const days=daysUntilExpiry(item.expiry);
                return(<tr key={item.id} style={{borderTop:`1px solid ${C.border}`}}>
                  <td style={{padding:"8px 12px 8px 0",color:C.text,fontWeight:600}}>{item.name}</td>
                  <td style={{padding:"8px 12px",color:C.textMid,fontSize:12}}>{item.category}</td>
                  <td style={{padding:"8px 12px",color:item.status==="critical"?C.red:C.text,fontWeight:800,fontFamily:C.font}}>{item.qty}</td>
                  <td style={{padding:"8px 12px",color:C.textMid}}>{item.parLevel}</td>
                  <td style={{padding:"8px 12px"}}><span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:3,color:statusColor(item.status),background:statusBg(item.status),fontFamily:C.font}}>{statusLabel(item.status)}</span></td>
                  <td style={{padding:"8px 0",fontSize:12,fontFamily:C.font,color:days!==null&&days<=30?C.red:days!==null&&days<=90?C.yellow:C.textMid}}>{item.expiry?`${item.expiry} (${days}d)`:"—"}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        )}

        {view==="home"&&(
          <>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>What do you need to complete?</div>
              <div style={{fontSize:13,color:C.textMid,marginTop:4}}>
                Showing forms for <strong style={{color:C.text}}>{stationName}</strong>. All submissions are recorded automatically.
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16,marginBottom:32}}>
              {assigned.map(tpl=>{
                const color=catColors[tpl.category]||C.blue;
                const icon=catIcons[tpl.category]||"📋";
                const todaySubs=submissions.filter(s=>s.templateId===tpl.id&&s.submittedAt.startsWith(todayStr)&&s.employeeId===session.employeeId).length;
                return(
                  <div key={tpl.id} onClick={()=>{setActiveTpl(tpl);setView("form");}} style={{background:C.surface,border:`2px solid ${C.border}`,borderRadius:14,padding:24,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color}}/>
                    <div style={{fontSize:32,marginBottom:10}}>{icon}</div>
                    <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:6}}>{tpl.name}</div>
                    <div style={{fontSize:12,color:C.textMid,marginBottom:14,lineHeight:1.5}}>{tpl.description}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <Tag label={tpl.frequency} color={color}/>
                      {todaySubs>0&&<span style={{fontSize:11,color:C.green,fontFamily:C.font}}>✓ {todaySubs} today</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {submissions.filter(s=>s.employeeId===session.employeeId).length>0&&(
              <div>
                <SHdr label="Your Recent Submissions"/>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {submissions.filter(s=>s.employeeId===session.employeeId).slice(0,5).map(s=>(
                    <div key={s.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{s.templateName}</div><div style={{fontSize:11,color:C.textDim,fontFamily:C.font,marginTop:2}}>{fmtDate(s.submittedAt)} · {s.unit}</div></div>
                      <Tag label="SUBMITTED" color={C.green}/>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FormView({template,crewInfo,onSubmit,onBack,submitted}){
  const [answers,setAnswers]=useState({});const[active,setActive]=useState(0);const[errors,setErrors]=useState({});
  const sec=template.sections[active];const isLast=active===template.sections.length-1;
  const set=(fid,v)=>setAnswers(a=>({...a,[fid]:v}));
  const validate=()=>{const e={};sec.fields.forEach(f=>{if(f.required&&(answers[f.id]===undefined||answers[f.id]===""))e[f.id]=true;});setErrors(e);return Object.keys(e).length===0;};
  const next=()=>{if(validate()){setActive(s=>s+1);setErrors({});}};
  const prev=()=>{setActive(s=>s-1);setErrors({});};
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fontDisplay}}>
      {submitted&&<div style={{position:"fixed",inset:0,background:"#000000CC",zIndex:9999,display:"grid",placeItems:"center"}}><Card style={{textAlign:"center",padding:"40px 60px",border:`2px solid ${C.green}`}}><div style={{fontSize:48,marginBottom:12}}>✅</div><div style={{fontSize:22,fontWeight:800,color:C.text}}>Submitted Successfully</div><div style={{fontSize:14,color:C.textMid,marginTop:8}}>Inspection recorded.</div></Card></div>}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"16px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:10}}>
          <Btn variant="ghost" size="sm" onClick={onBack}>← Back</Btn>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:800,color:C.text}}>{template.name}</div><div style={{fontSize:12,color:C.textMid,fontFamily:C.font}}>Section {active+1} of {template.sections.length}: {sec.title}</div></div>
        </div>
        <div style={{display:"flex",gap:4}}>{template.sections.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:99,background:i<active?C.green:i===active?C.accent:C.border}}/>)}</div>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 24px"}}>
        <div style={{fontSize:18,fontWeight:800,color:C.text,marginBottom:20}}>{sec.title}</div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {sec.fields.map(field=><FieldInput key={field.id} field={field} value={answers[field.id]} onChange={v=>set(field.id,v)} error={errors[field.id]}/>)}
        </div>
        <div style={{display:"flex",gap:12,marginTop:28,justifyContent:"flex-end"}}>
          {active>0&&<Btn onClick={prev}>← Previous</Btn>}
          {!isLast&&<Btn variant="primary" onClick={next}>Next →</Btn>}
          {isLast&&<Btn variant="success" size="lg" onClick={()=>{if(validate())onSubmit(answers);}}>✓ Submit</Btn>}
        </div>
      </div>
    </div>
  );
}

function FieldInput({field,value,onChange,error}){
  const base={...inputSt,border:`1px solid ${error?C.red:C.border}`};
  const wrap=children=>(
    <div style={{background:C.surface,border:`1px solid ${error?C.red:C.border}`,borderRadius:C.radius,padding:"14px 16px"}}>
      <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:8}}>{field.label}{field.required&&<span style={{color:C.red,marginLeft:4}}>*</span>}</div>
      {children}
      {error&&<div style={{fontSize:11,color:C.red,marginTop:5,fontFamily:C.font}}>Required</div>}
    </div>
  );
  if(field.type==="pass_fail")return wrap(<div style={{display:"flex",gap:10}}>{[{val:"pass",label:"PASS",color:C.green},{val:"fail",label:"FAIL",color:C.red}].map(o=><button key={o.val} onClick={()=>onChange(o.val)} style={{flex:1,padding:"11px 0",borderRadius:C.radiusSm,cursor:"pointer",fontFamily:C.font,fontWeight:700,fontSize:14,border:`2px solid ${value===o.val?o.color:C.border}`,background:value===o.val?`${o.color}20`:C.surfaceRaised,color:value===o.val?o.color:C.textDim}}>{o.label}</button>)}</div>);
  if(field.type==="yes_no")return wrap(<div style={{display:"flex",gap:10}}>{[{val:"yes",label:"YES",color:C.yellow},{val:"no",label:"NO",color:C.green}].map(o=><button key={o.val} onClick={()=>onChange(o.val)} style={{flex:1,padding:"11px 0",borderRadius:C.radiusSm,cursor:"pointer",fontFamily:C.font,fontWeight:700,fontSize:14,border:`2px solid ${value===o.val?o.color:C.border}`,background:value===o.val?`${o.color}20`:C.surfaceRaised,color:value===o.val?o.color:C.textDim}}>{o.label}</button>)}</div>);
  if(field.type==="rating")return wrap(<div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>onChange(n)} style={{flex:1,padding:"10px 0",borderRadius:C.radiusSm,cursor:"pointer",fontFamily:C.font,fontWeight:700,fontSize:15,border:`2px solid ${value>=n?C.accent:C.border}`,background:value>=n?C.accentDim:C.surfaceRaised,color:value>=n?C.accent:C.textDim}}>{n}</button>)}</div>);
  if(field.type==="select")return wrap(<select value={value||""} onChange={e=>onChange(e.target.value)} style={base}><option value="">— Select —</option>{(field.options||[]).map(o=><option key={o}>{o}</option>)}</select>);
  if(field.type==="textarea")return wrap(<textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={4} style={{...base,resize:"vertical"}} placeholder="Enter details..."/>);
  if(field.type==="number")return wrap(<input type="number" value={value||""} onChange={e=>onChange(e.target.value)} style={base}/>);
  return wrap(<input type="text" value={value||""} onChange={e=>onChange(e.target.value)} style={base}/>);
}

function SuperintendentDash({templates,submissions,setSubmissions,roster,vehicles}){
  const [sel,setSel]=useState(null);
  const [filterDays,setFilterDays]=useState(7);
  const [filterTpl,setFilterTpl]=useState("all");
  const [filterStation,setFilterStation]=useState("All Stations");
  const cutoff=new Date(Date.now()-filterDays*86400000).toISOString();
  const filtered=submissions.filter(s=>s.submittedAt>=cutoff&&(filterTpl==="all"||s.templateId===filterTpl)&&(filterStation==="All Stations"||s.station===filterStation));
  const unacked=submissions.filter(s=>getFlags(s,templates).length>0&&!s.acknowledgement);
  const totalFlagged=filtered.filter(s=>getFlags(s,templates).length>0).length;
  const compPct=filtered.length>0?Math.round(((filtered.length-totalFlagged)/filtered.length)*100):100;
  const ack=(subId,note,by)=>{const u=submissions.map(s=>s.id===subId?{...s,acknowledgement:{note,by,at:new Date().toISOString()}}:s);setSubmissions(u);store.set("mps_submissions",u);};
  const ctrl={padding:"8px 12px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,color:C.text,fontSize:13,fontFamily:C.font,outline:"none"};

  if(sel){
    const tpl=templates.find(t=>t.id===sel.templateId);
    return (<SubDetail sub={sel} tpl={tpl} templates={templates} onBack={()=>setSel(null)} onAcknowledge={ack}/>);
  }

  // Active roster entries (crew currently on duty)
  const onDuty=roster||[];
  const todayStr=new Date().toISOString().split("T")[0];

  return(
    <div style={{padding:28,fontFamily:C.fontDisplay}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Superintendent Dashboard</div>
          <div style={{fontSize:13,color:C.textMid,marginTop:4}}>Compliance oversight and crew status</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select value={filterStation} onChange={e=>setFilterStation(e.target.value)} style={ctrl}>{["All Stations",...STATION_NAMES].map(s=><option key={s}>{s}</option>)}</select>
          <select value={filterDays} onChange={e=>setFilterDays(Number(e.target.value))} style={ctrl}>{[1,3,7,14,30].map(d=><option key={d} value={d}>Last {d}d</option>)}</select>
          <select value={filterTpl} onChange={e=>setFilterTpl(e.target.value)} style={ctrl}><option value="all">All Forms</option>{templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
        </div>
      </div>

      {/* Crew on duty panel */}
      <Card style={{marginBottom:20,border:`1px solid ${onDuty.length>0?C.greenBorder:C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:onDuty.length>0?14:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>🟢</span>
            <span style={{fontSize:13,fontWeight:700,color:C.text}}>Crew On Duty</span>
            <span style={{fontSize:11,fontFamily:C.font,color:C.textDim,marginLeft:4}}>{onDuty.length} active</span>
          </div>
        </div>
        {onDuty.length===0&&(
          <div style={{fontSize:12,color:C.textDim,fontFamily:C.font}}>No crew currently rostered on. Crew members appear here when they sign in via the Crew Portal.</div>
        )}
        {onDuty.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
            {onDuty.map((entry,i)=>{
              const unitObj=vehicles?.find(v=>v.id===entry.unit);
              const unitCode=unitObj?.code||entry.unit||"—";
              // Check if they have a truck check today
              const hasTruckCheck=submissions.some(s=>
                s.employeeId===entry.employeeId&&
                s.submittedAt.startsWith(todayStr)&&
                (s.category==="Vehicle"||s.templateName?.toLowerCase().includes("vehicle"))
              );
              const rosterTime=entry.rosteredAt?new Date(entry.rosteredAt).toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"}):"—";
              return(
                <div key={i} style={{background:C.surfaceRaised,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"12px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.text}}>{entry.firstName} {entry.lastName}</div>
                    <Tag label={entry.shift} color={C.blue}/>
                  </div>
                  <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,marginBottom:6}}>
                    <div>{entry.certLevel} · {entry.role}</div>
                    <div style={{marginTop:2}}>Unit: <strong style={{color:C.text}}>{unitCode}</strong> · Since {rosterTime}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {hasTruckCheck
                      ? <Tag label="✓ TRUCK CHECK" color={C.green}/>
                      : <Tag label="NO TRUCK CHECK" color={C.orange}/>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Submissions",val:filtered.length,color:C.blue},{label:"Flagged",val:totalFlagged,color:C.red},{label:"Unacknowledged",val:unacked.length,color:C.orange},{label:"Compliance",val:`${compPct}%`,color:compColor(compPct)}].map(({label,val,color})=>(
          <div key={label} style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${color}`,borderRadius:C.radius,padding:"16px 20px"}}>
            <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
            <div style={{fontSize:28,fontWeight:800,color,letterSpacing:"-0.03em"}}>{val}</div>
          </div>
        ))}
      </div>

      {unacked.length>0&&(
        <div style={{background:C.orangeDim,border:`1px solid ${C.orangeBorder}`,borderRadius:C.radius,padding:18,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:10}}>⚠ Unacknowledged Flags ({unacked.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {unacked.slice(0,4).map(s=>{const flags=getFlags(s,templates);return(
              <div key={s.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{s.templateName}</div><div style={{fontSize:11,color:C.textMid,fontFamily:C.font}}>{s.crewName} · {s.station} · {fmtDate(s.submittedAt)}</div><div style={{fontSize:11,color:C.red,marginTop:2}}>{flags.map(f=>f.field.label).join(" · ")}</div></div>
                <Btn size="sm" variant="primary" onClick={()=>setSel(s)}>Review →</Btn>
              </div>
            );})}
          </div>
        </div>
      )}

      <Card>
        <SHdr label="Submission Log"/>
        {filtered.length===0&&<div style={{color:C.textDim,fontSize:13}}>No submissions in this period.</div>}
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          {filtered.length>0&&<thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>{["Form","Employee","Station/Unit","Submitted","Flags","Status",""].map(h=><th key={h} style={{textAlign:"left",paddingBottom:10,fontWeight:600}}>{h}</th>)}</tr></thead>}
          <tbody>{filtered.slice(0,20).map(s=>{const flags=getFlags(s,templates);return(
            <tr key={s.id} style={{borderTop:`1px solid ${C.border}`}}>
              <td style={{padding:"9px 8px 9px 0",color:C.text,fontWeight:600}}>{s.templateName}</td>
              <td style={{padding:"9px 8px",color:C.textMid,fontSize:12}}>{s.crewName||"—"}</td>
              <td style={{padding:"9px 8px",color:C.textMid,fontSize:12,fontFamily:C.font}}>{s.station}/{s.unit}</td>
              <td style={{padding:"9px 8px",color:C.textMid,fontSize:12,fontFamily:C.font}}>{fmtDate(s.submittedAt)}</td>
              <td style={{padding:"9px 8px"}}>{flags.length>0?<Tag label={`${flags.length} FLAGS`} color={C.red}/>:<Tag label="CLEAN" color={C.green}/>}</td>
              <td style={{padding:"9px 8px"}}>{s.acknowledgement?<Tag label="ACKNOWLEDGED" color={C.green}/>:flags.length>0?<Tag label="PENDING" color={C.orange}/>:<Tag label="COMPLETE" color={C.blue}/>}</td>
              <td style={{padding:"9px 0",textAlign:"right"}}><Btn size="sm" onClick={()=>setSel(s)}>View</Btn></td>
            </tr>
          );})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function SubDetail({sub,tpl,templates,onBack,onAcknowledge}){
  const [ackNote,setAckNote]=useState("");const[ackName,setAckName]=useState("");const[showForm,setShowForm]=useState(false);
  const flags=getFlags(sub,templates);const acked=!!sub.acknowledgement;
  if(!tpl) return (<div style={{padding:28}}><Btn onClick={onBack}>← Back</Btn></div>);
  return(
    <div style={{padding:28,maxWidth:780,fontFamily:C.fontDisplay}}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24}}>
        <Btn onClick={onBack}>← Back</Btn>
        <div style={{flex:1}}><div style={{fontSize:18,fontWeight:800,color:C.text}}>{tpl.name}</div><div style={{fontSize:12,color:C.textMid,fontFamily:C.font}}>{sub.crewName} · {sub.station} · {sub.unit} · {fmtDate(sub.submittedAt)}</div></div>
        {flags.length>0&&<Tag label={`${flags.length} FLAGS`} color={C.red}/>}
        {acked&&<Tag label="ACKNOWLEDGED" color={C.green}/>}
      </div>
      {flags.length>0&&<div style={{background:C.redDim,border:`1px solid ${C.redBorder}`,borderRadius:C.radius,padding:16,marginBottom:20}}><div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:10}}>🚩 Flagged Items</div>{flags.map((f,i)=><div key={i} style={{fontSize:13,color:C.text,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}><span style={{color:C.textMid,marginRight:8}}>•</span>{f.field.label}<span style={{marginLeft:10,fontWeight:700,color:C.red,fontFamily:C.font}}>{f.value?.toUpperCase()}</span></div>)}</div>}
      {flags.length>0&&<Card style={{marginBottom:20,border:`1px solid ${acked?C.greenBorder:C.orangeBorder}`,background:acked?C.greenDim:C.orangeDim}}>
        {acked?<div><div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:6}}>✓ Acknowledged by {sub.acknowledgement.by}</div><div style={{fontSize:13,color:C.text}}>{sub.acknowledgement.note||"No note."}</div><div style={{fontSize:11,color:C.textMid,fontFamily:C.font,marginTop:4}}>{fmtDate(sub.acknowledgement.at)}</div></div>
        :showForm?<div><div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:12}}>Acknowledge This Submission</div>
          <div style={{marginBottom:10}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Superintendent Name *</label><input value={ackName} onChange={e=>setAckName(e.target.value)} style={inputSt}/></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Note / Actions Taken</label><textarea value={ackNote} onChange={e=>setAckNote(e.target.value)} rows={3} style={{...inputSt,resize:"vertical"}}/></div>
          <div style={{display:"flex",gap:8}}><Btn variant="success" onClick={()=>{if(ackName.trim()){onAcknowledge(sub.id,ackNote,ackName);setShowForm(false);}}}>✓ Confirm</Btn><Btn onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </div>:<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700,color:C.orange}}>Superintendent sign-off required</div><div style={{fontSize:12,color:C.textMid,marginTop:3}}>Flags require acknowledgement.</div></div><Btn variant="primary" onClick={()=>setShowForm(true)}>Acknowledge →</Btn></div>}
      </Card>}
      {tpl.sections.map(sec=>(
        <Card key={sec.id} style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12,borderBottom:`1px solid ${C.border}`,paddingBottom:10}}>{sec.title}</div>
          {sec.fields.map(f=>{const val=sub.data[f.id];const flagged=(f.type==="pass_fail"&&val==="fail")||(f.type==="yes_no"&&val==="yes");return(
            <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,color:C.textMid,flex:1,paddingRight:20}}>{f.label}</div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:C.font,color:flagged?C.red:val==="pass"||val==="no"?C.green:C.text}}>{val!==undefined&&val!==""?String(val).toUpperCase():<span style={{color:C.textDim}}>—</span>}{flagged&&" 🚩"}</div>
            </div>
          );})}
        </Card>
      ))}
    </div>
  );
}

function AdminPortal({templates,setTemplates,users,setUsers,shifts,setShifts}){
  const [adminTab,setAdminTab]=useState("forms");

  const adminTabs=[
    {id:"forms",  label:"Form Builder",    icon:"📋"},
    {id:"users",  label:"User Management", icon:"👥"},
    {id:"shifts", label:"Shift Schedule",  icon:"🕐"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",fontFamily:C.fontDisplay}}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 28px",display:"flex",alignItems:"center",gap:0,flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:700,color:C.textDim,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginRight:24}}>Admin</div>
        {adminTabs.map(t=>(
          <button key={t.id} onClick={()=>setAdminTab(t.id)} style={{padding:"0 18px",height:46,background:"none",border:"none",borderBottom:adminTab===t.id?`2px solid ${C.purple}`:"2px solid transparent",color:adminTab===t.id?C.purple:C.textMid,cursor:"pointer",fontSize:13,fontWeight:adminTab===t.id?700:400,fontFamily:C.fontDisplay,display:"flex",alignItems:"center",gap:7}}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {adminTab==="forms"  && <FormBuilderPanel templates={templates} setTemplates={setTemplates}/>}
        {adminTab==="users"  && <UserManagement users={users} setUsers={setUsers}/>}
        {adminTab==="shifts" && <ShiftManager shifts={shifts} setShifts={setShifts}/>}
      </div>
    </div>
  );
}

// ─── Shift Manager ──────────────────────────────────────────────────────────
const SHIFT_COLORS=["#F5A623","#4A9EFF","#1DB954","#9B6DFF","#E8572A","#00C9B1","#E53E3E","#FF8C42"];

function ShiftManager({shifts,setShifts}){
  const list=shifts&&shifts.length>0?shifts:SEED_SHIFTS;
  const [editing,setEditing]=useState(null);  // shift id being edited, or "new"
  const [form,setForm]=useState({label:"",start:"07:00",end:"19:00",color:SHIFT_COLORS[0]});
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  const startEdit=(s)=>{setEditing(s.id);setForm({label:s.label,start:s.start,end:s.end,color:s.color||SHIFT_COLORS[0]});};
  const startNew=()=>{setEditing("new");setForm({label:"",start:"07:00",end:"19:00",color:SHIFT_COLORS[list.length%SHIFT_COLORS.length]});};
  const cancel=()=>{setEditing(null);};

  const save=()=>{
    if(!form.label.trim())return;
    let updated;
    if(editing==="new"){
      updated=[...list,{id:`shift-${Date.now()}`,label:form.label.trim(),start:form.start,end:form.end,color:form.color}];
    } else {
      updated=list.map(s=>s.id===editing?{...s,...form,label:form.label.trim()}:s);
    }
    setShifts(updated);store.set("mps_shifts",updated);setEditing(null);
  };

  const remove=(id)=>{
    if(list.length<=1){return;}
    const updated=list.filter(s=>s.id!==id);
    setShifts(updated);store.set("mps_shifts",updated);
  };

  const moveUp=(idx)=>{
    if(idx===0)return;
    const updated=[...list];
    [updated[idx-1],updated[idx]]=[updated[idx],updated[idx-1]];
    setShifts(updated);store.set("mps_shifts",updated);
  };

  const moveDown=(idx)=>{
    if(idx===list.length-1)return;
    const updated=[...list];
    [updated[idx],updated[idx+1]]=[updated[idx+1],updated[idx]];
    setShifts(updated);store.set("mps_shifts",updated);
  };

  return(
    <div style={{padding:28,maxWidth:680,fontFamily:C.fontDisplay}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>Shift Schedule</div>
          <div style={{fontSize:13,color:C.textMid,marginTop:4}}>Define shifts available for crew to select when rostering on. Changes take effect immediately.</div>
        </div>
        {editing!=="new"&&<Btn variant="success" onClick={startNew}>+ Add Shift</Btn>}
      </div>

      {/* Add / edit form */}
      {editing&&(
        <Card style={{marginBottom:20,border:`1px solid ${editing==="new"?C.greenBorder:C.accentBorder}`,background:editing==="new"?C.greenDim:C.accentDim}}>
          <SHdr label={editing==="new"?"New Shift":"Edit Shift"}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div style={{gridColumn:"span 2"}}>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Shift Label *</label>
              <input value={form.label} onChange={e=>setF("label",e.target.value)} style={inputSt} placeholder="e.g. Day Shift, Night Relief"/>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Start Time *</label>
              <input type="time" value={form.start} onChange={e=>setF("start",e.target.value)} style={inputSt}/>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>End Time *</label>
              <input type="time" value={form.end} onChange={e=>setF("end",e.target.value)} style={inputSt}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:8}}>Colour</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {SHIFT_COLORS.map(col=>(
                  <button key={col} onClick={()=>setF("color",col)} style={{width:28,height:28,borderRadius:"50%",background:col,border:`3px solid ${form.color===col?"#fff":col}`,outline:form.color===col?`2px solid ${col}`:"none",cursor:"pointer"}}/>
                ))}
              </div>
            </div>
          </div>
          {/* Preview */}
          {form.label&&(
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.surfaceRaised,borderRadius:C.radiusSm,marginBottom:14,border:`2px solid ${form.color}`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:form.color,flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:700,color:form.color}}>{form.label}</span>
              <span style={{fontSize:12,color:C.textMid,fontFamily:C.font,marginLeft:"auto"}}>{form.start} – {form.end}</span>
            </div>
          )}
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={cancel}>Cancel</Btn>
            <Btn variant={editing==="new"?"success":"primary"} disabled={!form.label.trim()} onClick={save}>
              {editing==="new"?"Add Shift":"Save Changes"}
            </Btn>
          </div>
        </Card>
      )}

      {/* Shift list */}
      <Card>
        <SHdr label={`${list.length} Shift${list.length!==1?"s":""} Defined`}/>
        {list.length===0&&<div style={{fontSize:13,color:C.textDim}}>No shifts defined. Add one above.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {list.map((s,idx)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:C.surfaceRaised,borderRadius:C.radiusSm,border:`1px solid ${C.border}`}}>
              {/* Colour dot */}
              <div style={{width:12,height:12,borderRadius:"50%",background:s.color||C.accent,flexShrink:0}}/>
              {/* Label + time */}
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{s.label}</div>
                <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,marginTop:2}}>{s.start} – {s.end}</div>
              </div>
              {/* Reorder */}
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <button onClick={()=>moveUp(idx)} disabled={idx===0} style={{background:"none",border:"none",cursor:idx===0?"default":"pointer",color:idx===0?C.textDim:C.textMid,fontSize:12,padding:"1px 4px",lineHeight:1}}>▲</button>
                <button onClick={()=>moveDown(idx)} disabled={idx===list.length-1} style={{background:"none",border:"none",cursor:idx===list.length-1?"default":"pointer",color:idx===list.length-1?C.textDim:C.textMid,fontSize:12,padding:"1px 4px",lineHeight:1}}>▼</button>
              </div>
              {/* Edit / Remove */}
              <Btn size="sm" onClick={()=>startEdit(s)}>Edit</Btn>
              <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}}
                disabled={list.length<=1}
                onClick={()=>remove(s.id)}>Remove</Btn>
            </div>
          ))}
        </div>
        {list.length<=1&&<div style={{fontSize:11,color:C.textDim,marginTop:10,fontFamily:C.font}}>At least one shift must remain.</div>}
      </Card>
    </div>
  );
}


function FormBuilderPanel({templates,setTemplates}){
  const [view,setView]=useState("list");
  const [editing,setEditing]=useState(null);

  const toggle=id=>{const u=templates.map(t=>t.id===id?{...t,active:!t.active}:t);setTemplates(u);store.set("mps_templates",u);};
  const del=id=>{const u=templates.filter(t=>t.id!==id);setTemplates(u);store.set("mps_templates",u);};

  const handleSave=tpl=>{
    const u=view==="edit"
      ? templates.map(t=>t.id===tpl.id?tpl:t)
      : [{...tpl,id:uid(),createdBy:"Admin",active:true},...templates];
    setTemplates(u);store.set("mps_templates",u);
    setEditing(null);setView("list");
  };

  const openEdit=tpl=>{setEditing(tpl);setView("edit");};
  const openNew=()=>{setEditing(null);setView("builder");};
  const goBack=()=>{setEditing(null);setView("list");};

  if(view==="builder"){
    return <TemplateBuilder key="new" initial={null} onSave={handleSave} onBack={goBack}/>;
  }
  if(view==="edit"&&editing){
    return <TemplateBuilder key={editing.id} initial={editing} onSave={handleSave} onBack={goBack}/>;
  }

  return(
    <div style={{padding:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Form & Inspection Builder</div>
          <div style={{fontSize:13,color:C.textMid,marginTop:4}}>Create, assign, and manage inspection templates</div>
        </div>
        <Btn variant="primary" onClick={openNew}>+ New Template</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
        {templates.map(tpl=>(
          <Card key={tpl.id} style={{borderLeft:`3px solid ${tpl.active?C.green:C.textDim}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:C.text}}>{tpl.name}</div>
                <div style={{fontSize:12,color:C.textMid,marginTop:3}}>{tpl.description}</div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <Tag label={tpl.category} color={C.blue}/>
                <Tag label={tpl.active?"ACTIVE":"INACTIVE"} color={tpl.active?C.green:C.textDim}/>
              </div>
            </div>
            <div style={{fontSize:11,color:C.textDim,fontFamily:C.font,marginBottom:6}}>
              {tpl.sections.length} sections · {tpl.sections.reduce((a,s)=>a+s.fields.length,0)} fields · {tpl.frequency}
            </div>
            <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,marginBottom:14}}>
              📍 {(tpl.assignedTo||["All Stations"]).join(", ")}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn size="sm" onClick={()=>openEdit(tpl)}>Edit</Btn>
              <Btn size="sm" variant={tpl.active?"ghost":"success"} onClick={()=>toggle(tpl.id)}>{tpl.active?"Deactivate":"Activate"}</Btn>
              <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>del(tpl.id)}>Delete</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

const CERT_LEVELS = ["EMR","PCP","ACP","CCP","Superintendent","Operations Manager","Admin"];
const ROLES = ["Crew","Superintendent","Operations Manager","Admin"];
const USER_STATUS = ["Active","Suspended","Inactive"];

// Passwords are btoa-encoded. Default seed password = "mps2024" → btoa = "bXBzMjAyNA=="
const SEED_USERS = [
  {id:"usr-000",firstName:"Jason",lastName:"Oncz",employeeId:"EMP-0001",email:"j.oncz@muskoka.ca",role:"Operations Manager",certLevel:"Operations Manager",station:"Bracebridge",unit:"MPS-01",status:"Active",passwordHash:btoa("Admin123"),certExpiry:"2027-01-01",cprExpiry:"2027-01-01",medDirectorAuth:true,createdAt:"2022-01-01",lastLogin:null,notes:"Operations Manager — full platform access",
    privileges:{home:true,crew:true,inventory:"full",superintendent:true,admin:true,reports:true}},
  {id:"usr-001",firstName:"Sarah",lastName:"Mitchell",employeeId:"EMP-1001",email:"s.mitchell@muskoka.ca",role:"Admin",certLevel:"Operations Manager",station:"Bracebridge",unit:"MPS-01",status:"Active",passwordHash:btoa("mps2024"),certExpiry:"2026-06-30",cprExpiry:"2025-12-15",medDirectorAuth:true,createdAt:"2022-01-01",lastLogin:"2025-03-04",notes:"Platform administrator"},
  {id:"usr-002",firstName:"James",lastName:"Kowalski",employeeId:"EMP-1002",email:"j.kowalski@muskoka.ca",role:"Superintendent",certLevel:"Superintendent",station:"Bracebridge",unit:"MPS-02",status:"Active",passwordHash:btoa("mps2024"),certExpiry:"2026-03-15",cprExpiry:"2025-09-20",medDirectorAuth:true,createdAt:"2022-01-15",lastLogin:"2025-03-03",notes:""},
  {id:"usr-003",firstName:"Priya",lastName:"Sharma",employeeId:"EMP-1003",email:"p.sharma@muskoka.ca",role:"Crew",certLevel:"ACP",station:"Huntsville",unit:"MPS-05",status:"Active",passwordHash:btoa("mps2024"),certExpiry:"2026-01-10",cprExpiry:"2025-11-30",medDirectorAuth:true,createdAt:"2022-03-01",lastLogin:"2025-03-02",notes:""},
  {id:"usr-004",firstName:"Derek",lastName:"Fontaine",employeeId:"EMP-1004",email:"d.fontaine@muskoka.ca",role:"Crew",certLevel:"PCP",station:"Gravenhurst",unit:"MPS-12",status:"Active",passwordHash:btoa("mps2024"),certExpiry:"2025-08-22",cprExpiry:"2025-07-01",medDirectorAuth:false,createdAt:"2023-05-10",lastLogin:"2025-03-01",notes:""},
  {id:"usr-005",firstName:"Anika",lastName:"Leblanc",employeeId:"EMP-1005",email:"a.leblanc@muskoka.ca",role:"Crew",certLevel:"PCP",station:"Port Carling",unit:"MPS-09",status:"Active",passwordHash:btoa("mps2024"),certExpiry:"2025-04-15",cprExpiry:"2025-05-20",medDirectorAuth:false,createdAt:"2023-08-15",lastLogin:"2025-02-28",notes:"CPR renewal scheduled"},
  {id:"usr-006",firstName:"Marcus",lastName:"Thompson",employeeId:"EMP-1006",email:"m.thompson@muskoka.ca",role:"Crew",certLevel:"ACP",station:"Mac Tier",unit:"MPS-15",status:"Suspended",passwordHash:btoa("mps2024"),certExpiry:"2026-02-28",cprExpiry:"2025-10-10",medDirectorAuth:true,createdAt:"2021-11-01",lastLogin:"2025-01-15",notes:"Suspended pending HR review"},
  {id:"usr-007",firstName:"Olivia",lastName:"Chen",employeeId:"EMP-1007",email:"o.chen@muskoka.ca",role:"Crew",certLevel:"EMR",station:"Bracebridge",unit:"MPS-03",status:"Active",passwordHash:btoa("mps2024"),certExpiry:"2025-06-01",cprExpiry:"2025-08-15",medDirectorAuth:false,createdAt:"2024-01-20",lastLogin:"2025-03-04",notes:"Probationary period"},
];

function hashPassword(pw){ return btoa(pw); }
function checkPassword(pw,hash){ return btoa(pw)===hash; }

function genTempPassword(){
  const chars="ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({length:10},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

function UserManagement({users,setUsers}){
  const [view,setView]=useState("list"); // list | add | edit | detail | reset
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState("");
  const [filterRole,setFilterRole]=useState("All");
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterStation,setFilterStation]=useState("All");
  const [resetUser,setResetUser]=useState(null);
  const [resetToken,setResetToken]=useState(null);
  const [confirmDelete,setConfirmDelete]=useState(null);

  const save=(user)=>{
    const u=selected
      ? users.map(x=>x.id===user.id?user:x)
      : [{...user,id:uid(),createdAt:new Date().toISOString().split("T")[0],lastLogin:null,passwordHash:hashPassword(user.plainPassword||"changeme")},...users];
    setUsers(u); store.set("mps_users",u); setView("list"); setSelected(null);
  };

  const suspend=(id)=>{
    const u=users.map(x=>x.id===id?{...x,status:x.status==="Suspended"?"Active":"Suspended"}:x);
    setUsers(u); store.set("mps_users",u);
  };

  const remove=(id)=>{
    const u=users.filter(x=>x.id!==id);
    setUsers(u); store.set("mps_users",u); setConfirmDelete(null);
  };

  const doReset=(userId)=>{
    const temp=genTempPassword();
    const u=users.map(x=>x.id===userId?{...x,passwordHash:hashPassword(temp),mustChangePassword:true}:x);
    setUsers(u); store.set("mps_users",u); setResetToken(temp);
  };

  if(view==="add"||view==="edit") return (
    <UserForm
      initial={view==="edit"?selected:null}
      onSave={save}
      onBack={()=>{setView("list");setSelected(null);}}
    />
  );

  if(view==="detail"&&selected) return (
    <UserDetail
      user={selected}
      onBack={()=>{setView("list");setSelected(null);}}
      onEdit={()=>setView("edit")}
      onSuspend={()=>{suspend(selected.id);setSelected(u=>({...u,status:u.status==="Suspended"?"Active":"Suspended"}));}}
      onReset={()=>{doReset(selected.id);setView("list");}}
      onDelete={()=>setConfirmDelete(selected)}
    />
  );

  const filtered=users.filter(u=>{
    if(search&&!`${u.firstName} ${u.lastName} ${u.employeeId} ${u.email}`.toLowerCase().includes(search.toLowerCase()))return false;
    if(filterRole!=="All"&&u.role!==filterRole)return false;
    if(filterStatus!=="All"&&u.status!==filterStatus)return false;
    if(filterStation!=="All"&&u.station!==filterStation)return false;
    return true;
  });

  // Credential alerts
  const today=new Date();
  const soonDays=90;
  const credAlerts=users.filter(u=>{
    if(u.status!=="Active")return false;
    const certDays=u.certExpiry?Math.floor((new Date(u.certExpiry)-today)/(86400000)):null;
    const cprDays=u.cprExpiry?Math.floor((new Date(u.cprExpiry)-today)/(86400000)):null;
    return(certDays!==null&&certDays<=soonDays)||(cprDays!==null&&cprDays<=soonDays);
  });

  const statusCounts={Active:0,Suspended:0,Inactive:0};
  users.forEach(u=>{ if(statusCounts[u.status]!==undefined) statusCounts[u.status]++; });

  const ctrl={padding:"8px 12px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,color:C.text,fontSize:13,fontFamily:C.font,outline:"none"};

  return (
    <div style={{padding:28,fontFamily:C.fontDisplay}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>User Management</div>
          <div style={{fontSize:13,color:C.textMid,marginTop:4}}>Employee profiles, credentials, access control</div>
        </div>
        <Btn variant="primary" onClick={()=>setView("add")}>+ Add User</Btn>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total Users",     val:users.length,              color:C.blue},
          {label:"Active",          val:statusCounts.Active,       color:C.green},
          {label:"Suspended",       val:statusCounts.Suspended,    color:C.red},
          {label:"Credential Alerts",val:credAlerts.length,        color:C.orange},
        ].map(({label,val,color})=>(
          <div key={label} style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${color}`,borderRadius:C.radius,padding:"14px 18px"}}>
            <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
            <div style={{fontSize:26,fontWeight:800,color,letterSpacing:"-0.03em"}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Credential alerts panel */}
      {credAlerts.length>0&&(
        <div style={{background:C.orangeDim,border:`1px solid ${C.orangeBorder}`,borderRadius:C.radius,padding:16,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:12}}>⚠ Credential Renewals Due Within 90 Days</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:8}}>
            {credAlerts.map(u=>{
              const certDays=u.certExpiry?Math.floor((new Date(u.certExpiry)-today)/(86400000)):null;
              const cprDays=u.cprExpiry?Math.floor((new Date(u.cprExpiry)-today)/(86400000)):null;
              return (
                <div key={u.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"10px 14px",cursor:"pointer"}}
                  onClick={()=>{setSelected(u);setView("detail");}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.firstName} {u.lastName} <span style={{color:C.textMid,fontSize:11,fontWeight:400}}>({u.employeeId})</span></div>
                  <div style={{fontSize:11,fontFamily:C.font,color:C.textMid,marginTop:3,display:"flex",gap:12}}>
                    {certDays!==null&&certDays<=soonDays&&<span style={{color:certDays<=30?C.red:C.yellow}}>Cert: {certDays}d</span>}
                    {cprDays!==null&&cprDays<=soonDays&&<span style={{color:cprDays<=30?C.red:C.yellow}}>CPR: {cprDays}d</span>}
                    <span style={{color:C.textDim}}>{u.station} · {u.certLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, ID, email…"
          style={{...inputSt,flex:1,minWidth:200}}/>
        <select value={filterRole}    onChange={e=>setFilterRole(e.target.value)}    style={ctrl}><option value="All">All Roles</option>{ROLES.map(r=><option key={r}>{r}</option>)}</select>
        <select value={filterStatus}  onChange={e=>setFilterStatus(e.target.value)}  style={ctrl}><option value="All">All Status</option>{USER_STATUS.map(s=><option key={s}>{s}</option>)}</select>
        <select value={filterStation} onChange={e=>setFilterStation(e.target.value)} style={ctrl}><option value="All">All Stations</option>{STATION_NAMES.map(s=><option key={s}>{s}</option>)}</select>
      </div>

      {/* User table */}
      <Card style={{padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em",background:C.surfaceRaised,borderRadius:`${C.radius} ${C.radius} 0 0`}}>
              {["Employee","ID","Role / Cert","Station","Status","Cert Expiry","CPR Expiry","Actions"].map((h,i)=>(
                <th key={h} style={{textAlign:"left",padding:"12px 16px",fontWeight:600,borderBottom:`1px solid ${C.border}`}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0&&(
              <tr><td colSpan={8} style={{padding:32,textAlign:"center",color:C.textDim,fontSize:13}}>No users match your filters.</td></tr>
            )}
            {filtered.map(u=>{
              const certDays=u.certExpiry?Math.floor((new Date(u.certExpiry)-today)/(86400000)):null;
              const cprDays=u.cprExpiry?Math.floor((new Date(u.cprExpiry)-today)/(86400000)):null;
              const certColor=certDays!==null&&certDays<=30?C.red:certDays!==null&&certDays<=90?C.yellow:C.textMid;
              const cprColor=cprDays!==null&&cprDays<=30?C.red:cprDays!==null&&cprDays<=90?C.yellow:C.textMid;
              return (
                <tr key={u.id} style={{borderTop:`1px solid ${C.border}`,opacity:u.status==="Inactive"?0.5:1}}>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:u.status==="Suspended"?C.redDim:u.status==="Inactive"?C.border:C.accentDim,display:"grid",placeItems:"center",fontSize:13,fontWeight:700,color:u.status==="Suspended"?C.red:C.accent,flexShrink:0}}>
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <div style={{fontWeight:700,color:C.text}}>{u.firstName} {u.lastName}</div>
                        <div style={{fontSize:11,color:C.textDim,fontFamily:C.font}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"11px 16px",color:C.textMid,fontFamily:C.font,fontSize:12}}>{u.employeeId}</td>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>{u.role}</div>
                    <div style={{fontSize:11,color:C.textDim,fontFamily:C.font}}>{u.certLevel}</div>
                  </td>
                  <td style={{padding:"11px 16px",color:C.textMid,fontSize:12}}>{u.station}</td>
                  <td style={{padding:"11px 16px"}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:3,fontFamily:C.font,
                      color:u.status==="Active"?C.green:u.status==="Suspended"?C.red:C.textDim,
                      background:u.status==="Active"?C.greenDim:u.status==="Suspended"?C.redDim:C.border,
                      border:`1px solid ${u.status==="Active"?C.greenBorder:u.status==="Suspended"?C.redBorder:C.border}`}}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{padding:"11px 16px",fontFamily:C.font,fontSize:12,color:certColor}}>{u.certExpiry||"—"}{certDays!==null&&certDays<=90?` (${certDays}d)`:""}</td>
                  <td style={{padding:"11px 16px",fontFamily:C.font,fontSize:12,color:cprColor}}>{u.cprExpiry||"—"}{cprDays!==null&&cprDays<=90?` (${cprDays}d)`:""}</td>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{display:"flex",gap:6}}>
                      <Btn size="sm" onClick={()=>{setSelected(u);setView("detail");}}>View</Btn>
                      <Btn size="sm" onClick={()=>{setSelected(u);setView("edit");}}>Edit</Btn>
                      <Btn size="sm" variant="ghost"
                        style={{color:u.status==="Suspended"?C.green:C.yellow,borderColor:u.status==="Suspended"?C.greenBorder:C.yellowBorder}}
                        onClick={()=>suspend(u.id)}>
                        {u.status==="Suspended"?"Restore":"Suspend"}
                      </Btn>
                      <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>setConfirmDelete(u)}>Remove</Btn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Confirm delete modal */}
      {confirmDelete&&(
        <div style={{position:"fixed",inset:0,background:"#00000099",zIndex:1000,display:"grid",placeItems:"center"}}>
          <Card style={{maxWidth:420,width:"90vw",border:`1px solid ${C.redBorder}`}}>
            <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:8}}>Remove User?</div>
            <div style={{fontSize:13,color:C.textMid,marginBottom:20}}>
              This will permanently remove <strong style={{color:C.text}}>{confirmDelete.firstName} {confirmDelete.lastName}</strong> ({confirmDelete.employeeId}) from the platform. This action cannot be undone.
            </div>
            <div style={{fontSize:12,color:C.yellow,background:C.yellowDim,border:`1px solid ${C.yellowBorder}`,borderRadius:C.radiusSm,padding:"10px 14px",marginBottom:20}}>
              ⚠ Consider <strong>suspending</strong> instead of removing — suspension preserves the audit trail and submission history.
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <Btn onClick={()=>setConfirmDelete(null)}>Cancel</Btn>
              <Btn variant="danger" onClick={()=>remove(confirmDelete.id)}>Yes, Remove User</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Reset token display */}
      {resetToken&&(
        <div style={{position:"fixed",inset:0,background:"#00000099",zIndex:1000,display:"grid",placeItems:"center"}}>
          <Card style={{maxWidth:440,width:"90vw",border:`1px solid ${C.greenBorder}`}}>
            <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:8}}>Temporary Password Generated</div>
            <div style={{fontSize:13,color:C.textMid,marginBottom:16}}>Provide this temporary password to the employee. They will be required to change it on next login.</div>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"14px 18px",marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:800,color:C.green,fontFamily:C.font,letterSpacing:"0.1em"}}>{resetToken}</div>
              <div style={{fontSize:11,color:C.textDim,marginTop:6,fontFamily:C.font}}>Temporary — single use</div>
            </div>
            <Btn variant="success" style={{width:"100%",justifyContent:"center"}} onClick={()=>setResetToken(null)}>Done — I've noted this password</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── User Detail View ────────────────────────────────────────────────────────
function UserDetail({user,onBack,onEdit,onSuspend,onReset,onDelete}){
  const today=new Date();
  const certDays=user.certExpiry?Math.floor((new Date(user.certExpiry)-today)/(86400000)):null;
  const cprDays=user.cprExpiry?Math.floor((new Date(user.cprExpiry)-today)/(86400000)):null;

  const InfoRow=({label,value,valueColor})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
      <span style={{fontSize:12,color:C.textMid}}>{label}</span>
      <span style={{fontSize:13,fontWeight:600,color:valueColor||C.text,fontFamily:C.font}}>{value||"—"}</span>
    </div>
  );

  return (
    <div style={{padding:28,maxWidth:860,fontFamily:C.fontDisplay}}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24}}>
        <Btn onClick={onBack}>← Back</Btn>
        <div style={{flex:1}}>
          <div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:"-0.02em"}}>{user.firstName} {user.lastName}</div>
          <div style={{fontSize:12,color:C.textMid,fontFamily:C.font,marginTop:2}}>{user.employeeId} · {user.email}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={onEdit}>Edit Profile</Btn>
          <Btn variant="primary" onClick={onReset}>Reset Password</Btn>
          <Btn variant="ghost"
            style={{color:user.status==="Suspended"?C.green:C.yellow,borderColor:user.status==="Suspended"?C.greenBorder:C.yellowBorder}}
            onClick={onSuspend}>{user.status==="Suspended"?"Restore Access":"Suspend Access"}</Btn>
          <Btn variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={onDelete}>Remove</Btn>
        </div>
      </div>

      {user.status==="Suspended"&&(
        <div style={{background:C.redDim,border:`1px solid ${C.redBorder}`,borderRadius:C.radius,padding:"12px 18px",marginBottom:20,fontSize:13,color:C.red,fontWeight:700}}>
          🔒 This account is suspended. The employee cannot log in or submit forms.
        </div>
      )}
      {user.mustChangePassword&&(
        <div style={{background:C.yellowDim,border:`1px solid ${C.yellowBorder}`,borderRadius:C.radius,padding:"12px 18px",marginBottom:20,fontSize:13,color:C.yellow,fontWeight:700}}>
          🔑 Password reset issued — employee must change password on next login.
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SHdr label="Identity & Access"/>
          <InfoRow label="First Name"      value={user.firstName}/>
          <InfoRow label="Last Name"       value={user.lastName}/>
          <InfoRow label="Employee ID"     value={user.employeeId}/>
          <InfoRow label="Email"           value={user.email}/>
          <InfoRow label="Role"            value={user.role}/>
          <InfoRow label="Account Status"  value={user.status} valueColor={user.status==="Active"?C.green:user.status==="Suspended"?C.red:C.textDim}/>
          <InfoRow label="Account Created" value={user.createdAt}/>
          <InfoRow label="Last Login"      value={user.lastLogin||"Never"}/>
        </Card>

        <Card>
          <SHdr label="Credentials & Certification"/>
          <InfoRow label="Certification Level" value={user.certLevel}/>
          <InfoRow label="Home Station"        value={user.station}/>
          <InfoRow label="Assigned Unit"       value={user.unit}/>
          <InfoRow label="Cert Expiry"
            value={user.certExpiry?(certDays!==null&&certDays<=90?`${user.certExpiry} (${certDays}d)`:user.certExpiry):"—"}
            valueColor={certDays!==null&&certDays<=30?C.red:certDays!==null&&certDays<=90?C.yellow:C.text}/>
          <InfoRow label="CPR Expiry"
            value={user.cprExpiry?(cprDays!==null&&cprDays<=90?`${user.cprExpiry} (${cprDays}d)`:user.cprExpiry):"—"}
            valueColor={cprDays!==null&&cprDays<=30?C.red:cprDays!==null&&cprDays<=90?C.yellow:C.text}/>
          <InfoRow label="Med Director Authorization" value={user.medDirectorAuth?"Yes — Authorized":"No"} valueColor={user.medDirectorAuth?C.green:C.yellow}/>
        </Card>

        {user.notes&&(
          <Card style={{gridColumn:"span 2"}}>
            <SHdr label="Notes"/>
            <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{user.notes}</div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── User Add / Edit Form ────────────────────────────────────────────────────
function UserForm({initial,onSave,onBack}){
  const blank={firstName:"",lastName:"",employeeId:"",email:"",role:"Crew",certLevel:"PCP",station:STATION_NAMES[0],unit:UNITS[0],status:"Active",certExpiry:"",cprExpiry:"",medDirectorAuth:false,notes:"",plainPassword:""};
  const [form,setForm]=useState(initial||blank);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const isNew=!initial;
  const valid=form.firstName.trim()&&form.lastName.trim()&&form.employeeId.trim()&&form.email.trim()&&(isNew?form.plainPassword.trim():true);

  const sections=[
    {title:"Personal Information",fields:[
      {key:"firstName",   label:"First Name *",         type:"text",  placeholder:"e.g. Jane"},
      {key:"lastName",    label:"Last Name *",          type:"text",  placeholder:"e.g. Smith"},
      {key:"employeeId",  label:"Employee ID *",        type:"text",  placeholder:"e.g. EMP-1042"},
      {key:"email",       label:"Email Address *",      type:"email", placeholder:"e.g. j.smith@muskoka.ca"},
    ]},
    {title:"Role & Access",fields:[
      {key:"role",        label:"System Role",          type:"select",options:ROLES},
      {key:"status",      label:"Account Status",       type:"select",options:USER_STATUS},
      {key:"station",     label:"Home Station",         type:"select",options:STATION_NAMES},
      {key:"unit",        label:"Primary Unit",         type:"select",options:UNITS},
    ]},
    {title:"Credentials",fields:[
      {key:"certLevel",   label:"Certification Level",  type:"select",options:CERT_LEVELS},
      {key:"certExpiry",  label:"Cert Expiry Date",     type:"date"},
      {key:"cprExpiry",   label:"CPR Expiry Date",      type:"date"},
    ]},
    {title:"Notes",fields:[
      {key:"notes",       label:"Admin Notes",          type:"textarea",placeholder:"Optional — e.g. probation, restrictions, notes for file"},
    ]},
  ];

  return (
    <div style={{padding:28,maxWidth:780,fontFamily:C.fontDisplay}}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24}}>
        <Btn onClick={onBack}>← Back</Btn>
        <div style={{flex:1,fontSize:18,fontWeight:800,color:C.text}}>{isNew?"Add New User":"Edit User Profile"}</div>
        <Btn variant="primary" disabled={!valid} onClick={()=>onSave(form)}>
          {isNew?"Create User":"Save Changes"}
        </Btn>
      </div>

      {sections.map(sec=>(
        <Card key={sec.title} style={{marginBottom:16}}>
          <SHdr label={sec.title}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {sec.fields.map(f=>(
              <div key={f.key} style={{gridColumn:f.type==="textarea"?"span 2":"span 1"}}>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>{f.label}</label>
                {f.type==="select"?(
                  <select value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)} style={inputSt}>
                    {(f.options||[]).map(o=><option key={o}>{o}</option>)}
                  </select>
                ):f.type==="textarea"?(
                  <textarea value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)} rows={3} style={{...inputSt,resize:"vertical"}} placeholder={f.placeholder}/>
                ):(
                  <input type={f.type||"text"} value={form[f.key]||""} onChange={e=>set(f.key,e.target.value)} style={inputSt} placeholder={f.placeholder}/>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Privileges section */}
      <Card style={{marginBottom:16,border:`1px solid ${C.purpleBorder}`}}>
        <SHdr label="Role Privileges"/>
        <div style={{fontSize:12,color:C.textMid,marginBottom:14}}>
          Customize access for this user. Defaults are set by role — override here if needed.
        </div>
        {(()=>{
          const defaults=ROLE_DEFAULTS[form.role]||ROLE_DEFAULTS["Crew"];
          const perms=form.privileges||defaults;
          const setP=(k,v)=>set("privileges",{...perms,[k]:v});
          const rows=[
            {key:"home",         label:"Overview Dashboard",     desc:"See the platform home screen"},
            {key:"crew",         label:"Crew Portal",            desc:"Submit forms and inspections"},
            {key:"superintendent",label:"Superintendent Board",  desc:"View submissions, acknowledge flags, see roster"},
            {key:"admin",        label:"Admin Panel",            desc:"Manage users, templates, platform settings"},
            {key:"reports",      label:"Reports & Analytics",    desc:"View operational reports and export data"},
          ];
          return(
            <div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Inventory Access</label>
                <select value={perms.inventory||"none"} onChange={e=>setP("inventory",e.target.value)} style={inputSt}>
                  <option value="none">No Access</option>
                  <option value="vehicle">Vehicle Only (own unit)</option>
                  <option value="full">Full Inventory Access</option>
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {rows.map(row=>(
                  <div key={row.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:C.surfaceRaised,borderRadius:C.radiusSm,border:`1px solid ${C.border}`}}>
                    <div>
                      <div style={{fontSize:13,color:C.text,fontWeight:600}}>{row.label}</div>
                      <div style={{fontSize:11,color:C.textMid,marginTop:2}}>{row.desc}</div>
                    </div>
                    <button onClick={()=>setP(row.key,!perms[row.key])} style={{width:44,height:24,borderRadius:99,border:"none",cursor:"pointer",background:perms[row.key]?C.green:C.border,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:perms[row.key]?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                    </button>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10}}>
                <Btn size="sm" variant="ghost" onClick={()=>set("privileges",ROLE_DEFAULTS[form.role]||ROLE_DEFAULTS["Crew"])}>
                  Reset to {form.role} Defaults
                </Btn>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Med Director Auth toggle */}
      <Card style={{marginBottom:16}}>
        <SHdr label="Medical Director Authorization"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13,color:C.text,fontWeight:600}}>Advanced Authorization</div>
            <div style={{fontSize:12,color:C.textMid,marginTop:3}}>Employee is authorized under the Medical Director to perform advanced interventions</div>
          </div>
          <button onClick={()=>set("medDirectorAuth",!form.medDirectorAuth)} style={{width:48,height:26,borderRadius:99,border:"none",cursor:"pointer",background:form.medDirectorAuth?C.green:C.border,position:"relative",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:form.medDirectorAuth?24:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
          </button>
        </div>
      </Card>

      {/* Password section — new users only */}
      {isNew&&(
        <Card style={{border:`1px solid ${C.blueBorder}`}}>
          <SHdr label="Initial Password"/>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Temporary Password *</label>
            <input type="password" value={form.plainPassword||""} onChange={e=>set("plainPassword",e.target.value)} style={inputSt} placeholder="Set a temporary password for this user"/>
          </div>
          <div style={{fontSize:12,color:C.textDim,fontFamily:C.font}}>The employee will be prompted to change this password on first login. Minimum 8 characters recommended.</div>
          <div style={{marginTop:12}}>
            <Btn size="sm" onClick={()=>set("plainPassword",genTempPassword())}>Generate Temporary Password</Btn>
          </div>
          {form.plainPassword&&(
            <div style={{marginTop:10,background:C.bg,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:"10px 14px",fontFamily:C.font,fontSize:14,color:C.green,fontWeight:700,letterSpacing:"0.05em"}}>{form.plainPassword}</div>
          )}
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOT LOOKUP — search across all locations by lot number
// ═══════════════════════════════════════════════════════════════════════
function LotLookup({inventory,stations,vehicles,invItems}){
  const stList=stations||SEED_STATION_LIST;
  const ambList=vehicles||SEED_AMBULANCES;
  const itmList=invItems||SEED_ITEMS;
  const [query,setQuery]=useState("");
  const results=[];
  if(query.trim().length>=2){
    const q=query.trim().toLowerCase();
    const allLocs=[...stList.map(s=>({id:s.id,name:s.name,type:"Station"})),...ambList.map(a=>({id:a.id,name:a.code,type:"Unit"}))];
    allLocs.forEach(loc=>{
      itmList.forEach(item=>{
        const e=inventory[`${loc.id}__${item.id}`];
        if(!e||!e.lots)return;
        e.lots.forEach(lot=>{
          if(!lot.lotNumber)return;
          if(lot.lotNumber.toLowerCase().includes(q)){
            const days=daysUntilExpiry(lot.expiry);
            results.push({item,loc,lot,days});
          }
        });
      });
    });
  }

  return (
    <div style={{fontFamily:C.fontDisplay}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:"-0.02em",marginBottom:4}}>Lot Number Lookup</div>
        <div style={{fontSize:13,color:C.textMid}}>Search across all stations and units by lot number — use for recalls, expiry audits, or tracing a specific batch.</div>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,padding:20,marginBottom:20}}>
        <label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:8,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em"}}>Search Lot Number</label>
        <input
          value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="e.g. LOT123456 or partial number..."
          style={{...inputSt,fontSize:15,padding:"12px 16px"}}
          autoFocus
        />
        {query.trim().length>0&&query.trim().length<2&&<div style={{fontSize:12,color:C.textDim,marginTop:6,fontFamily:C.font}}>Enter at least 2 characters to search.</div>}
      </div>

      {query.trim().length>=2&&(
        results.length===0
          ? <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,padding:32,textAlign:"center",color:C.textDim,fontSize:13}}>No lot records found matching "{query}"</div>
          : (
            <div>
              <div style={{fontSize:13,fontWeight:700,color:C.teal,marginBottom:12}}>🔍 {results.length} result{results.length!==1?"s":""} for "{query}"</div>
              {results.map((r,i)=>{
                const expired=r.lot.expiry&&r.days!==null&&r.days<=0;
                const expiring=r.lot.expiry&&r.days!==null&&r.days>0&&r.days<=90;
                return (
                  <div key={i} style={{background:C.surface,border:`1px solid ${expired?C.redBorder:expiring?C.yellowBorder:C.border}`,borderLeft:`3px solid ${expired?C.red:expiring?C.yellow:C.teal}`,borderRadius:C.radius,padding:"14px 18px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                          <span style={{fontSize:15,fontWeight:800,color:C.blue,fontFamily:C.font}}>{r.lot.lotNumber}</span>
                          {expired&&<Tag label="EXPIRED" color={C.red}/>}
                          {expiring&&!expired&&<Tag label={`EXPIRES ${r.days}d`} color={C.yellow}/>}
                        </div>
                        <div style={{fontSize:14,fontWeight:700,color:C.text}}>{r.item.name}</div>
                        <div style={{fontSize:12,color:C.textMid,fontFamily:C.font,marginTop:4,display:"flex",gap:16,flexWrap:"wrap"}}>
                          <span>📍 {r.loc.type}: <strong style={{color:C.text}}>{r.loc.name}</strong></span>
                          <span>Qty: <strong style={{color:r.lot.qty===0?C.red:C.text}}>{r.lot.qty} {r.item.unit}</strong></span>
                          {r.lot.expiry&&<span style={{color:r.days!==null&&r.days<=30?C.red:r.days!==null&&r.days<=90?C.yellow:C.textMid}}>Exp: {r.lot.expiry}</span>}
                          {r.lot.receivedDate&&<span>Received: {r.lot.receivedDate}</span>}
                          {r.lot.supplier&&<span>From: {r.lot.supplier}</span>}
                        </div>
                      </div>
                      <Tag label={r.item.category} color={C.blue}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )
      )}

      {!query.trim()&&(
        <div style={{background:C.tealDim,border:`1px solid ${C.tealBorder}`,borderRadius:C.radius,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.teal,marginBottom:8}}>How to use Lot Lookup</div>
          <div style={{fontSize:12,color:C.textMid,lineHeight:1.7}}>
            Enter a full or partial lot number to find every location where that batch is stocked. Results show quantity, expiry date, receiving date, and supplier — useful for targeted recalls, expiry sweeps, or chain-of-custody queries across all stations and fleet units simultaneously.
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// INVENTORY CONFIGURE — manage stations, vehicles, and item catalogue
// ═══════════════════════════════════════════════════════════════════════
function InvConfigure({stations,setStations,vehicles,setVehicles,invItems,setInvItems,inventory,setInventory}){
  const [tab,setTab]=useState("stations"); // stations | vehicles | items
  const tabs=[{id:"stations",label:"Stations",icon:"🏥"},{id:"vehicles",label:"Vehicles",icon:"🚑"},{id:"items",label:"Item Catalogue",icon:"📋"}];

  const saveStations=(updated)=>{setStations(updated);store.set("mps_stations",updated);};
  const saveVehicles=(updated)=>{setVehicles(updated);store.set("mps_vehicles",updated);};
  const saveItems=(updated)=>{setInvItems(updated);store.set("mps_items",updated);};

  return (
    <div style={{fontFamily:C.fontDisplay}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:"-0.02em",marginBottom:4}}>Configure Inventory</div>
        <div style={{fontSize:13,color:C.textMid}}>Manage stations, vehicles, and the item catalogue. Changes apply immediately across the platform.</div>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:20,background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,overflow:"hidden"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"12px 0",background:tab===t.id?C.accentDim:"none",border:"none",borderBottom:tab===t.id?`2px solid ${C.accent}`:"2px solid transparent",color:tab===t.id?C.accent:C.textMid,cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,fontFamily:C.fontDisplay,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab==="stations" && <ConfigureStations stations={stations} onSave={saveStations} vehicles={vehicles} inventory={inventory} setInventory={setInventory}/>}
      {tab==="vehicles" && <ConfigureVehicles vehicles={vehicles} onSave={saveVehicles} stations={stations} inventory={inventory} setInventory={setInventory}/>}
      {tab==="items"    && <ConfigureItems invItems={invItems} onSave={saveItems} stations={stations} vehicles={vehicles} inventory={inventory} setInventory={setInventory}/>}
    </div>
  );
}

function ConfigureStations({stations,onSave,inventory,setInventory}){
  const [editing,setEditing]=useState(null);
  const [addMode,setAddMode]=useState(false);
  const [form,setForm]=useState({name:"",code:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const add=()=>{
    if(!form.name.trim()||!form.code.trim())return;
    const newSt={id:uid(),name:form.name.trim(),code:form.code.trim().toUpperCase()};
    // Seed inventory for this station with all items at 0
    const newInv={...inventory};
    (window._mpsInvItems||SEED_ITEMS).forEach(item=>{
      const key=`${newSt.id}__${item.id}`;
      if(!newInv[key])newInv[key]={qty:0,expiry:null,lastUpdated:new Date().toISOString().split("T")[0],lotNumber:null,lots:[]};
    });
    setInventory(newInv);store.set("mps_inventory",newInv);
    onSave([...stations,newSt]);
    setForm({name:"",code:""});setAddMode(false);
  };

  const update=(id)=>{
    if(!editing?.name.trim()||!editing?.code.trim())return;
    onSave(stations.map(s=>s.id===id?{...s,name:editing.name.trim(),code:editing.code.trim().toUpperCase()}:s));
    setEditing(null);
  };

  const remove=(id)=>{
    if(stations.length<=1){alert("At least one station must remain.");return;}
    onSave(stations.filter(s=>s.id!==id));
  };

  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <SHdr label="Stations"/>
        <Btn variant="primary" size="sm" onClick={()=>setAddMode(true)}>+ Add Station</Btn>
      </div>
      {addMode&&(
        <div style={{background:C.greenDim,border:`1px solid ${C.greenBorder}`,borderRadius:C.radiusSm,padding:14,marginBottom:14,display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:10,alignItems:"center"}}>
          <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Station name" style={inputSt}/>
          <input value={form.code} onChange={e=>set("code",e.target.value)} placeholder="Code (e.g. BRB)" style={{...inputSt,width:90}} maxLength={4}/>
          <Btn variant="success" size="sm" disabled={!form.name.trim()||!form.code.trim()} onClick={add}>Add</Btn>
          <Btn size="sm" onClick={()=>{setAddMode(false);setForm({name:"",code:""});}}>Cancel</Btn>
        </div>
      )}
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>
          {["Name","Code","Actions"].map(h=><th key={h} style={{textAlign:"left",paddingBottom:8,fontWeight:600}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {stations.map(s=>(
            <tr key={s.id} style={{borderTop:`1px solid ${C.border}`}}>
              <td style={{padding:"10px 0"}}>
                {editing?.id===s.id
                  ? <input value={editing.name} onChange={e=>setEditing(x=>({...x,name:e.target.value}))} style={{...inputSt,fontSize:13}}/>
                  : <span style={{color:C.text,fontWeight:600}}>{s.name}</span>}
              </td>
              <td style={{padding:"10px 12px"}}>
                {editing?.id===s.id
                  ? <input value={editing.code} onChange={e=>setEditing(x=>({...x,code:e.target.value}))} style={{...inputSt,width:80,fontSize:13}} maxLength={4}/>
                  : <span style={{color:C.textMid,fontFamily:C.font}}>{s.code}</span>}
              </td>
              <td style={{padding:"10px 0"}}>
                <div style={{display:"flex",gap:6}}>
                  {editing?.id===s.id
                    ? <><Btn size="sm" variant="success" onClick={()=>update(s.id)}>Save</Btn><Btn size="sm" onClick={()=>setEditing(null)}>Cancel</Btn></>
                    : <><Btn size="sm" onClick={()=>setEditing({id:s.id,name:s.name,code:s.code})}>Edit</Btn>
                        <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>remove(s.id)}>Remove</Btn></>
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ConfigureVehicles({vehicles,onSave,stations,inventory,setInventory}){
  const [editing,setEditing]=useState(null);
  const [addMode,setAddMode]=useState(false);
  const [form,setForm]=useState({name:"",code:"",station:stations[0]?.id||""});
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const [search,setSearch]=useState("");
  const filtered=vehicles.filter(v=>v.code.toLowerCase().includes(search.toLowerCase())||v.name.toLowerCase().includes(search.toLowerCase()));

  const add=()=>{
    if(!form.name.trim()||!form.code.trim())return;
    const newV={id:uid(),name:form.name.trim(),code:form.code.trim().toUpperCase(),station:form.station};
    const newInv={...inventory};
    (window._mpsInvItems||SEED_ITEMS).forEach(item=>{
      const key=`${newV.id}__${item.id}`;
      if(!newInv[key])newInv[key]={qty:0,expiry:null,lastUpdated:new Date().toISOString().split("T")[0],lotNumber:null,lots:[]};
    });
    setInventory(newInv);store.set("mps_inventory",newInv);
    onSave([...vehicles,newV]);
    setForm({name:"",code:"",station:stations[0]?.id||""});setAddMode(false);
  };

  const update=(id)=>{
    if(!editing?.name.trim()||!editing?.code.trim())return;
    onSave(vehicles.map(v=>v.id===id?{...v,name:editing.name.trim(),code:editing.code.trim().toUpperCase(),station:editing.station}:v));
    setEditing(null);
  };

  const remove=(id)=>{
    onSave(vehicles.filter(v=>v.id!==id));
  };

  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <SHdr label="Vehicles / Fleet Units"/>
        <div style={{display:"flex",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...inputSt,fontSize:12,padding:"6px 10px",width:160}}/>
          <Btn variant="primary" size="sm" onClick={()=>setAddMode(true)}>+ Add Vehicle</Btn>
        </div>
      </div>
      {addMode&&(
        <div style={{background:C.greenDim,border:`1px solid ${C.greenBorder}`,borderRadius:C.radiusSm,padding:14,marginBottom:14,display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:10,alignItems:"center"}}>
          <input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Name (e.g. Unit 23)" style={inputSt}/>
          <input value={form.code} onChange={e=>setF("code",e.target.value)} placeholder="Code (e.g. MPS-23)" style={{...inputSt,width:100}}/>
          <select value={form.station} onChange={e=>setF("station",e.target.value)} style={{...inputSt,width:130}}>
            {stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Btn variant="success" size="sm" disabled={!form.name.trim()||!form.code.trim()} onClick={add}>Add</Btn>
          <Btn size="sm" onClick={()=>setAddMode(false)}>Cancel</Btn>
        </div>
      )}
      <div style={{fontSize:11,color:C.textDim,fontFamily:C.font,marginBottom:8}}>{filtered.length} of {vehicles.length} vehicles</div>
      <div style={{maxHeight:460,overflowY:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>
            {["Name","Code","Station","Actions"].map(h=><th key={h} style={{textAlign:"left",paddingBottom:8,fontWeight:600,paddingRight:12}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(v=>(
              <tr key={v.id} style={{borderTop:`1px solid ${C.border}`}}>
                <td style={{padding:"9px 12px 9px 0"}}>
                  {editing?.id===v.id
                    ? <input value={editing.name} onChange={e=>setEditing(x=>({...x,name:e.target.value}))} style={{...inputSt,fontSize:13}}/>
                    : <span style={{color:C.text,fontWeight:600}}>{v.name}</span>}
                </td>
                <td style={{padding:"9px 12px"}}>
                  {editing?.id===v.id
                    ? <input value={editing.code} onChange={e=>setEditing(x=>({...x,code:e.target.value}))} style={{...inputSt,width:100,fontSize:13}}/>
                    : <span style={{color:C.textMid,fontFamily:C.font}}>{v.code}</span>}
                </td>
                <td style={{padding:"9px 12px"}}>
                  {editing?.id===v.id
                    ? <select value={editing.station} onChange={e=>setEditing(x=>({...x,station:e.target.value}))} style={{...inputSt,fontSize:12}}>
                        {stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    : <span style={{color:C.textMid,fontSize:12}}>{stations.find(s=>s.id===v.station)?.name||"—"}</span>}
                </td>
                <td style={{padding:"9px 0"}}>
                  <div style={{display:"flex",gap:6}}>
                    {editing?.id===v.id
                      ? <><Btn size="sm" variant="success" onClick={()=>update(v.id)}>Save</Btn><Btn size="sm" onClick={()=>setEditing(null)}>Cancel</Btn></>
                      : <><Btn size="sm" onClick={()=>setEditing({id:v.id,name:v.name,code:v.code,station:v.station})}>Edit</Btn>
                          <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>remove(v.id)}>Remove</Btn></>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ConfigureItems({invItems,onSave,inventory,setInventory}){
  const [editing,setEditing]=useState(null);
  const [addMode,setAddMode]=useState(false);
  const [search,setSearch]=useState("");
  const [catFilter,setCatFilter]=useState("All");
  const blank={name:"",category:"Medications",unit:"vial",parLevel:"4",orderPoint:"2"};
  const [form,setForm]=useState(blank);
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  const filtered=invItems.filter(i=>{
    if(catFilter!=="All"&&i.category!==catFilter)return false;
    if(search&&!i.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  const add=()=>{
    if(!form.name.trim())return;
    const newItem={id:uid(),name:form.name.trim(),category:form.category,unit:form.unit,parLevel:parseInt(form.parLevel)||4,orderPoint:parseInt(form.orderPoint)||2};
    onSave([...invItems,newItem]);
    setForm(blank);setAddMode(false);
  };

  const update=(id)=>{
    onSave(invItems.map(i=>i.id===id?{...i,name:editing.name.trim(),category:editing.category,unit:editing.unit,parLevel:parseInt(editing.parLevel)||i.parLevel,orderPoint:parseInt(editing.orderPoint)||i.orderPoint}:i));
    setEditing(null);
  };

  const remove=(id)=>{
    onSave(invItems.filter(i=>i.id!==id));
  };

  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <SHdr label="Item Catalogue"/>
        <div style={{display:"flex",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...inputSt,fontSize:12,padding:"6px 10px",width:160}}/>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{...inputSt,fontSize:12,padding:"6px 10px"}}>
            <option value="All">All</option>{INV_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <Btn variant="primary" size="sm" onClick={()=>setAddMode(true)}>+ Add Item</Btn>
        </div>
      </div>
      {addMode&&(
        <div style={{background:C.greenDim,border:`1px solid ${C.greenBorder}`,borderRadius:C.radiusSm,padding:14,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px 80px auto auto",gap:10,alignItems:"center"}}>
            <input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Item name *" style={inputSt}/>
            <select value={form.category} onChange={e=>setF("category",e.target.value)} style={inputSt}>{INV_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
            <input value={form.unit} onChange={e=>setF("unit",e.target.value)} placeholder="Unit (vial)" style={inputSt}/>
            <input value={form.parLevel} onChange={e=>setF("parLevel",e.target.value)} placeholder="Par" type="number" style={inputSt}/>
            <input value={form.orderPoint} onChange={e=>setF("orderPoint",e.target.value)} placeholder="Order" type="number" style={inputSt}/>
            <Btn variant="success" size="sm" disabled={!form.name.trim()} onClick={add}>Add</Btn>
            <Btn size="sm" onClick={()=>setAddMode(false)}>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{fontSize:11,color:C.textDim,fontFamily:C.font,marginBottom:8}}>{filtered.length} of {invItems.length} items</div>
      <div style={{maxHeight:500,overflowY:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{color:C.textDim,fontSize:11,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.06em"}}>
            {["Item Name","Category","Unit","Par Level","Order Point","Actions"].map(h=><th key={h} style={{textAlign:"left",paddingBottom:8,fontWeight:600,paddingRight:12}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(item=>(
              <tr key={item.id} style={{borderTop:`1px solid ${C.border}`}}>
                <td style={{padding:"9px 12px 9px 0",maxWidth:280}}>
                  {editing?.id===item.id
                    ? <input value={editing.name} onChange={e=>setEditing(x=>({...x,name:e.target.value}))} style={{...inputSt,fontSize:13}}/>
                    : <span style={{color:C.text,fontWeight:600}}>{item.name}</span>}
                </td>
                <td style={{padding:"9px 12px"}}>
                  {editing?.id===item.id
                    ? <select value={editing.category} onChange={e=>setEditing(x=>({...x,category:e.target.value}))} style={{...inputSt,fontSize:12}}>{INV_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                    : <Tag label={item.category} color={C.blue}/>}
                </td>
                <td style={{padding:"9px 12px"}}>
                  {editing?.id===item.id
                    ? <input value={editing.unit} onChange={e=>setEditing(x=>({...x,unit:e.target.value}))} style={{...inputSt,fontSize:12,width:80}}/>
                    : <span style={{color:C.textMid,fontFamily:C.font}}>{item.unit}</span>}
                </td>
                <td style={{padding:"9px 12px",textAlign:"center"}}>
                  {editing?.id===item.id
                    ? <input value={editing.parLevel} onChange={e=>setEditing(x=>({...x,parLevel:e.target.value}))} type="number" style={{...inputSt,fontSize:12,width:70}}/>
                    : <span style={{color:C.text,fontFamily:C.font}}>{item.parLevel}</span>}
                </td>
                <td style={{padding:"9px 12px",textAlign:"center"}}>
                  {editing?.id===item.id
                    ? <input value={editing.orderPoint} onChange={e=>setEditing(x=>({...x,orderPoint:e.target.value}))} type="number" style={{...inputSt,fontSize:12,width:70}}/>
                    : <span style={{color:C.textMid,fontFamily:C.font}}>{item.orderPoint}</span>}
                </td>
                <td style={{padding:"9px 0"}}>
                  <div style={{display:"flex",gap:6}}>
                    {editing?.id===item.id
                      ? <><Btn size="sm" variant="success" onClick={()=>update(item.id)}>Save</Btn><Btn size="sm" onClick={()=>setEditing(null)}>Cancel</Btn></>
                      : <><Btn size="sm" onClick={()=>setEditing({...item,parLevel:String(item.parLevel),orderPoint:String(item.orderPoint)})}>Edit</Btn>
                          <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>remove(item.id)}>Remove</Btn></>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


function TemplateBuilder({initial,onSave,onBack}){
  const blank={name:"",description:"",category:"Vehicle",frequency:"Daily",assignedTo:["All Stations"],sections:[{id:uid(),title:"Section 1",fields:[]}]};
  const [tpl,setTpl]=useState(initial||blank);const[activeSection,setActiveSection]=useState(0);
  const setMeta=(k,v)=>setTpl(t=>({...t,[k]:v}));
  const addSection=()=>{const s={id:uid(),title:`Section ${tpl.sections.length+1}`,fields:[]};setTpl(t=>({...t,sections:[...t.sections,s]}));setActiveSection(tpl.sections.length);};
  const updSec=(i,k,v)=>{const s=[...tpl.sections];s[i]={...s[i],[k]:v};setTpl(t=>({...t,sections:s}));};
  const remSec=(i)=>{const s=tpl.sections.filter((_,j)=>j!==i);setTpl(t=>({...t,sections:s}));if(activeSection>=s.length)setActiveSection(Math.max(0,s.length-1));};
  const addField=(si)=>{const f={id:uid(),label:"New field",type:"pass_fail",required:true,options:[]};const s=[...tpl.sections];s[si]={...s[si],fields:[...s[si].fields,f]};setTpl(t=>({...t,sections:s}));};
  const updField=(si,fi,k,v)=>{const s=[...tpl.sections];const fields=[...s[si].fields];fields[fi]={...fields[fi],[k]:v};s[si]={...s[si],fields};setTpl(t=>({...t,sections:s}));};
  const remField=(si,fi)=>{const s=[...tpl.sections];s[si]={...s[si],fields:s[si].fields.filter((_,j)=>j!==fi)};setTpl(t=>({...t,sections:s}));};
  const toggleStn=(st)=>{const curr=tpl.assignedTo||["All Stations"];if(st==="All Stations"){setMeta("assignedTo",["All Stations"]);return;}const f=curr.filter(s=>s!=="All Stations");const next=f.includes(st)?f.filter(s=>s!==st):[...f,st];setMeta("assignedTo",next.length===0?["All Stations"]:next);};
  const sec=tpl.sections[activeSection]||tpl.sections[0];
  return(
    <div style={{padding:28,fontFamily:C.fontDisplay,maxWidth:940,margin:"0 auto"}}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24}}><Btn onClick={onBack}>← Back</Btn><div style={{flex:1,fontSize:18,fontWeight:800,color:C.text}}>{initial?"Edit Template":"New Template"}</div><Btn variant="primary" onClick={()=>onSave(tpl)} disabled={!tpl.name.trim()}>Save Template</Btn></div>
      <Card style={{marginBottom:20}}>
        <SHdr label="Template Details"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Name *</label><input value={tpl.name} onChange={e=>setMeta("name",e.target.value)} style={inputSt}/></div>
          <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Category</label><select value={tpl.category} onChange={e=>setMeta("category",e.target.value)} style={inputSt}>{["Vehicle","Medications","Equipment","Incident","Custom"].map(c=><option key={c}>{c}</option>)}</select></div>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Description</label><input value={tpl.description} onChange={e=>setMeta("description",e.target.value)} style={inputSt}/></div>
          <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:5}}>Frequency</label><select value={tpl.frequency} onChange={e=>setMeta("frequency",e.target.value)} style={inputSt}>{["Daily","Per Shift","Weekly","Monthly","As Needed"].map(f=><option key={f}>{f}</option>)}</select></div>
          <div><label style={{fontSize:12,color:C.textMid,display:"block",marginBottom:8}}>Station Assignment</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["All Stations",...STATION_NAMES].map(s=>{const active=(tpl.assignedTo||["All Stations"]).includes(s);return<button key={s} onClick={()=>toggleStn(s)} style={{padding:"5px 12px",borderRadius:99,fontSize:11,cursor:"pointer",fontFamily:C.font,fontWeight:600,background:active?C.accentDim:"transparent",border:`1px solid ${active?C.accent:C.border}`,color:active?C.accent:C.textMid}}>{s}</button>;})}</div></div>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"190px 1fr",gap:16}}>
        <div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Sections</div>
          {tpl.sections.map((s,i)=><div key={s.id} onClick={()=>setActiveSection(i)} style={{padding:"9px 12px",borderRadius:C.radiusSm,marginBottom:4,cursor:"pointer",background:i===activeSection?C.accentDim:"none",border:`1px solid ${i===activeSection?C.accentBorder:C.border}`,color:i===activeSection?C.accent:C.textMid,fontSize:13,fontWeight:i===activeSection?700:400}}><div style={{fontSize:12}}>{s.title}</div><div style={{fontSize:10,color:C.textDim,fontFamily:C.font,marginTop:2}}>{s.fields.length} fields</div></div>)}
          <Btn size="sm" style={{width:"100%",marginTop:6,justifyContent:"center"}} onClick={addSection}>+ Section</Btn>
        </div>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <input value={sec.title} onChange={e=>updSec(activeSection,"title",e.target.value)} style={{...inputSt,fontSize:15,fontWeight:700,background:"transparent",flex:1,marginRight:10}}/>
            {tpl.sections.length>1&&<Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>remSec(activeSection)}>Remove</Btn>}
          </div>
          {sec.fields.length===0&&<div style={{color:C.textDim,fontSize:13,padding:"16px 0",textAlign:"center"}}>No fields yet. Add one below.</div>}
          {sec.fields.map((field,fi)=>(
            <div key={field.id} style={{background:C.surfaceRaised,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,padding:12,marginBottom:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,marginBottom:8}}>
                <input value={field.label} onChange={e=>updField(activeSection,fi,"label",e.target.value)} style={{...inputSt,fontSize:13}} placeholder="Field label..."/>
                <select value={field.type} onChange={e=>updField(activeSection,fi,"type",e.target.value)} style={{...inputSt,width:130}}>{["pass_fail","yes_no","text","textarea","number","select","rating"].map(ft=><option key={ft} value={ft}>{ft.replace("_","/")}</option>)}</select>
                <Btn size="sm" variant="ghost" style={{color:C.red,borderColor:C.redBorder}} onClick={()=>remField(activeSection,fi)}>✕</Btn>
              </div>
              <div style={{display:"flex",gap:16,alignItems:"center",fontSize:12,color:C.textMid,fontFamily:C.font}}>
                <label style={{cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><input type="checkbox" checked={field.required} onChange={e=>updField(activeSection,fi,"required",e.target.checked)} style={{accentColor:C.accent}}/>Required</label>
                {field.type==="select"&&<input value={(field.options||[]).join(", ")} onChange={e=>updField(activeSection,fi,"options",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} style={{...inputSt,fontSize:11,flex:1}} placeholder="Options: comma-separated"/>}
              </div>
            </div>
          ))}
          <Btn size="sm" onClick={()=>addField(activeSection)} style={{marginTop:4}}>+ Add Field</Btn>
        </Card>
      </div>
    </div>
  );
}

function ReportsView({templates,submissions,inventory,orders,waste}){
  const [filterDays,setFilterDays]=useState(30);const[filterTpl,setFilterTpl]=useState("all");
  const cutoff=new Date(Date.now()-filterDays*86400000).toISOString();
  const filtered=submissions.filter(s=>s.submittedAt>=cutoff&&(filterTpl==="all"||s.templateId===filterTpl));
  const fieldFlagCount={};
  filtered.forEach(s=>{const tpl=templates.find(t=>t.id===s.templateId);if(!tpl)return;tpl.sections.flatMap(sec=>sec.fields).forEach(f=>{const v=s.data[f.id];if((f.type==="pass_fail"&&v==="fail")||(f.type==="yes_no"&&v==="yes")){const key=`${tpl.name} — ${f.label}`;fieldFlagCount[key]=(fieldFlagCount[key]||0)+1;}});});
  const topFlags=Object.entries(fieldFlagCount).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const dailyCounts={};filtered.forEach(s=>{const d=s.submittedAt.split("T")[0];dailyCounts[d]=(dailyCounts[d]||0)+1;});
  const dailyArr=Object.entries(dailyCounts).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14);
  const maxCount=Math.max(...dailyArr.map(d=>d[1]),1);
  const totalOrders=orders.length;const pendingOrders=orders.filter(o=>o.status==="pending").length;const fulfilledOrders=orders.filter(o=>o.status==="fulfilled").length;
  const wasteByReason={};waste.forEach(w=>{wasteByReason[w.reason]=(wasteByReason[w.reason]||0)+1;});
  const ctrl={padding:"8px 12px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radiusSm,color:C.text,fontSize:13,fontFamily:C.font,outline:"none"};
  const exportCSV=()=>{
    const rows=filtered.map(s=>{const tpl=templates.find(t=>t.id===s.templateId);const row={Form:s.templateName,Employee:s.crewName||"",Station:s.station||"",Unit:s.unit||"",Shift:s.shift||"",Submitted:s.submittedAt,Flags:getFlags(s,templates).length,Acknowledged:s.acknowledgement?"Yes":"No"};if(tpl)tpl.sections.flatMap(sec=>sec.fields).forEach(f=>{row[f.label]=s.data[f.id]??"";});return row;});
    if(!rows.length)return;
    const headers=Object.keys(rows[0]);const csv=[headers.join(","),...rows.map(r=>headers.map(h=>`"${String(r[h]??"").replace(/"/g,'""')}"`).join(","))].join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`mps-report-${new Date().toISOString().split("T")[0]}.csv`;a.click();
  };
  return(
    <div style={{padding:28,fontFamily:C.fontDisplay}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Reports & Analytics</div><div style={{fontSize:13,color:C.textMid,marginTop:4}}>Unified platform data — inspections, inventory, orders, waste</div></div>
        <div style={{display:"flex",gap:8}}><select value={filterDays} onChange={e=>setFilterDays(Number(e.target.value))} style={ctrl}>{[7,14,30,90].map(d=><option key={d} value={d}>Last {d}d</option>)}</select><select value={filterTpl} onChange={e=>setFilterTpl(e.target.value)} style={ctrl}><option value="all">All Forms</option>{templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Inspections Filed",val:filtered.length,color:C.blue},{label:"Waste Events",val:waste.length,color:C.red},{label:"Total Orders",val:totalOrders,color:C.purple},{label:"Orders Fulfilled",val:fulfilledOrders,color:C.green}].map(({label,val,color})=>(
          <div key={label} style={{background:C.surface,border:`1px solid ${C.border}`,borderLeft:`3px solid ${color}`,borderRadius:C.radius,padding:"14px 18px"}}>
            <div style={{fontSize:11,color:C.textMid,fontFamily:C.font,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
            <div style={{fontSize:26,fontWeight:800,color,letterSpacing:"-0.03em"}}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <SHdr label="Daily Inspections Submitted"/>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:120,paddingBottom:20}}>
            {dailyArr.map(([date,count])=>(
              <div key={date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{fontSize:10,color:C.textDim,fontFamily:C.font}}>{count}</div>
                <div style={{width:"100%",background:C.accent,borderRadius:"3px 3px 0 0",height:`${(count/maxCount)*80}px`,minHeight:4}}/>
                <div style={{fontSize:9,color:C.textDim,fontFamily:C.font,transform:"rotate(-45deg)",transformOrigin:"top right",whiteSpace:"nowrap"}}>{date.slice(5)}</div>
              </div>
            ))}
            {dailyArr.length===0&&<div style={{color:C.textDim,fontSize:13}}>No data.</div>}
          </div>
        </Card>
        <Card>
          <SHdr label="Most Flagged Inspection Fields"/>
          {topFlags.length===0&&<div style={{color:C.textDim,fontSize:13}}>No flags in this period.</div>}
          {topFlags.map(([label,count])=>(
            <div key={label} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:C.text,flex:1,paddingRight:12}}>{label}</span><span style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:C.font}}>{count}×</span></div>
              <Progress value={(count/(topFlags[0]?.[1]||1))*100} color={C.red} height={5}/>
            </div>
          ))}
        </Card>
        <Card>
          <SHdr label="Order Status Breakdown"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            {[{label:"Pending",val:pendingOrders,color:C.yellow},{label:"Fulfilled",val:fulfilledOrders,color:C.green},{label:"Cancelled",val:orders.filter(o=>o.status==="cancelled").length,color:C.textDim}].map(({label,val,color})=>(
              <div key={label} style={{textAlign:"center",background:C.surfaceRaised,borderRadius:C.radiusSm,padding:"12px 8px"}}>
                <div style={{fontSize:22,fontWeight:800,color}}>{val}</div>
                <div style={{fontSize:11,color:C.textMid,fontFamily:C.font}}>{label}</div>
              </div>
            ))}
          </div>
          <SHdr label="Waste by Reason"/>
          {Object.entries(wasteByReason).length===0&&<div style={{color:C.textDim,fontSize:13}}>No waste records.</div>}
          {Object.entries(wasteByReason).map(([reason,count])=>(
            <div key={reason} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
              <span style={{color:C.textMid}}>{reason}</span><span style={{color:C.text,fontWeight:700,fontFamily:C.font}}>{count}</span>
            </div>
          ))}
        </Card>
        <Card>
          <SHdr label="Acknowledgement Compliance"/>
          {(()=>{const flaggedSubs=submissions.filter(s=>getFlags(s,templates).length>0);const acked=flaggedSubs.filter(s=>!!s.acknowledgement).length;const pct=flaggedSubs.length>0?Math.round((acked/flaggedSubs.length)*100):100;return(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                {[{label:"Flagged",val:flaggedSubs.length,color:C.red},{label:"Acknowledged",val:acked,color:C.green},{label:"Pending",val:flaggedSubs.length-acked,color:C.orange}].map(({label,val,color})=>(
                  <div key={label} style={{textAlign:"center",background:C.surfaceRaised,borderRadius:C.radiusSm,padding:"12px 8px"}}>
                    <div style={{fontSize:22,fontWeight:800,color}}>{val}</div>
                    <div style={{fontSize:11,color:C.textMid,fontFamily:C.font}}>{label}</div>
                  </div>
                ))}
              </div>
              <Progress value={pct} color={compColor(pct)} height={8}/>
              <div style={{fontSize:12,fontWeight:700,color:compColor(pct),marginTop:4,fontFamily:C.font,textAlign:"right"}}>{pct}% acknowledged</div>
            </div>
          );})()}
        </Card>
      </div>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <SHdr label="Export Data"/>
          <Btn size="sm" variant="primary" onClick={exportCSV}>⬇ Export Inspections CSV ({filtered.length} records)</Btn>
        </div>
        <div style={{fontSize:12,color:C.textMid,fontFamily:C.font}}>Full submission export includes all field answers, employee, station, unit, shift, flags, and acknowledgement status.</div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROOT APP — UNIFIED
// ═══════════════════════════════════════════════════════════════════════
export default function App(){
  const [loading,setLoading]=useState(true);
  const [session,setSession]=useState(null);
  const [roster,setRoster]=useState([]);
  const [portal,setPortal]=useState("home");
  const [templates,setTemplates]=useState([]);
  const [submissions,setSubmissions]=useState([]);
  const [inventory,setInventory]=useState(null);
  const [orders,setOrders]=useState([]);
  const [waste,setWaste]=useState([]);
  const [users,setUsers]=useState([]);
  const [shifts,setShifts]=useState(SEED_SHIFTS);
  const [stations,setStations]=useState(SEED_STATION_LIST);
  const [vehicles,setVehicles]=useState(SEED_AMBULANCES);
  const [invItems,setInvItems]=useState(SEED_ITEMS);
  const [invView,setInvView]=useState("dashboard");
  const [invLocation,setInvLocation]=useState({type:"station",id:"bracebridge"});

  useEffect(()=>{
    (async()=>{
      const tpls=await store.get("mps_templates")||DEFAULT_TEMPLATES;
      const subs=await store.get("mps_submissions")||[];
      let inv=await store.get("mps_inventory");
      const ords=await store.get("mps_orders")||[];
      const wst=await store.get("mps_waste")||[];
      const usrs=await store.get("mps_users")||SEED_USERS;
      const shfts=await store.get("mps_shifts")||SEED_SHIFTS;
      const sts=await store.get("mps_stations")||SEED_STATION_LIST;
      const veh=await store.get("mps_vehicles")||SEED_AMBULANCES;
      const itm=await store.get("mps_items")||SEED_ITEMS;
      if(!inv) inv=generateInventory(sts,veh,itm);
      window._mpsInvItems=itm;
      setTemplates(tpls);setSubmissions(subs);setInventory(inv);setOrders(ords);setWaste(wst);
      setUsers(usrs);setShifts(shfts);setStations(sts);setVehicles(veh);setInvItems(itm);
      setLoading(false);
    })();
  },[]);

  if(loading) return(
    <div style={{minHeight:"100vh",background:C.bg,display:"grid",placeItems:"center",fontFamily:C.font}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:48,height:48,background:C.accent,borderRadius:12,display:"grid",placeItems:"center",fontSize:24,margin:"0 auto 16px"}}>🚑</div>
        <div style={{color:C.textMid,fontSize:13}}>Loading MPS Unified Platform...</div>
      </div>
    </div>
  );

  if(!session) return (
    <LoginScreen
      users={users}
      shifts={shifts}
      onLogin={(authed)=>{
        setSession(authed);
        const entry={...authed,rosteredAt:new Date().toISOString()};
        setRoster(r=>[...r.filter(x=>x.employeeId!==authed.employeeId),entry]);
        const p=authed.perms||ROLE_DEFAULTS["Crew"];
        if(p.home) setPortal("home");
        else if(p.superintendent) setPortal("superintendent");
        else setPortal("crew");
      }}
    />
  );

  const perms=session.perms||ROLE_DEFAULTS["Crew"];
  const unackedCount=submissions.filter(s=>getFlags(s,templates).length>0&&!s.acknowledgement).length;
  const critInvCount=invItems.reduce((acc,item)=>{
    return acc+stations.filter(st=>{const e=inventory[`${st.id}__${item.id}`];return e&&invStatus(e.qty,item)==="critical";}).length;
  },0);

  const allNav=[
    {id:"home",           label:"Overview",       icon:"🏠", color:C.blue,   show:!!perms.home},
    {id:"crew",           label:"Crew Portal",    icon:"🚑", color:C.green,  show:!!perms.crew},
    {id:"inventory",      label:"Inventory",      icon:"📦", color:C.teal,   show:!!perms.inventory, badge:perms.inventory==="full"?critInvCount:0},
    {id:"superintendent", label:"Superintendent", icon:"📊", color:C.accent, show:!!perms.superintendent, badge:unackedCount},
    {id:"admin",          label:"Admin",          icon:"⚙️", color:C.purple, show:!!perms.admin},
    {id:"reports",        label:"Reports",        icon:"📈", color:C.orange, show:!!perms.reports},
  ].filter(n=>n.show);

  const allowedIds=allNav.map(n=>n.id);
  const activePortal=allowedIds.includes(portal)?portal:(allowedIds[0]||"crew");

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:C.fontDisplay,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:28}}>
          <div style={{width:32,height:32,background:C.accent,borderRadius:8,display:"grid",placeItems:"center",fontSize:16}}>🚑</div>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:C.text,letterSpacing:"-0.01em"}}>MPS UNIFIED PLATFORM</div>
            <div style={{fontSize:9,color:C.textDim,fontFamily:C.font,letterSpacing:"0.06em"}}>DISTRICT MUSKOKA PARAMEDIC SERVICES</div>
          </div>
        </div>
        <div style={{display:"flex",flex:1}}>
          {allNav.map(n=>(
            <button key={n.id} onClick={()=>setPortal(n.id)} style={{padding:"0 14px",height:56,background:"none",border:"none",borderBottom:activePortal===n.id?`2px solid ${n.color}`:"2px solid transparent",color:activePortal===n.id?n.color:C.textMid,cursor:"pointer",fontSize:13,fontWeight:activePortal===n.id?700:400,fontFamily:C.fontDisplay,display:"flex",alignItems:"center",gap:6,transition:"all 0.15s",whiteSpace:"nowrap"}}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              {n.badge>0&&<span style={{background:C.red,color:"#fff",fontSize:10,fontWeight:800,borderRadius:99,padding:"1px 5px",fontFamily:C.font}}>{n.badge>99?"99+":n.badge}</span>}
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginLeft:12,flexShrink:0}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text}}>{session.firstName} {session.lastName}</div>
            <div style={{fontSize:10,color:C.textMid,fontFamily:C.font}}>{session.role} · {session.shift}</div>
          </div>
          <button onClick={()=>{setRoster(r=>r.filter(x=>x.employeeId!==session.employeeId));setSession(null);setPortal("home");}} style={{padding:"5px 10px",borderRadius:C.radiusSm,fontSize:11,cursor:"pointer",background:"none",border:`1px solid ${C.border}`,color:C.textMid,fontFamily:C.font}}>Sign Out</button>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {activePortal==="home"&&inventory&&<UnifiedDashboard inventory={inventory} orders={orders} waste={waste} submissions={submissions} templates={templates} stations={stations} vehicles={vehicles} invItems={invItems} setPortal={setPortal} setInvView={setInvView} setInvLocation={setInvLocation}/>}
        {activePortal==="crew"&&inventory&&<CrewPortal session={session} templates={templates} submissions={submissions} setSubmissions={setSubmissions} inventory={inventory} vehicles={vehicles} invItems={invItems}/>}
        {activePortal==="inventory"&&inventory&&<InventoryModule inventory={inventory} setInventory={setInventory} orders={orders} setOrders={setOrders} waste={waste} setWaste={setWaste} invView={invView} setInvView={setInvView} invLocation={invLocation} setInvLocation={setInvLocation} stations={stations} setStations={setStations} vehicles={vehicles} setVehicles={setVehicles} invItems={invItems} setInvItems={setInvItems}/>}
        {activePortal==="superintendent"&&<SuperintendentDash templates={templates} submissions={submissions} setSubmissions={setSubmissions} roster={roster} vehicles={vehicles}/>}
        {activePortal==="admin"&&<AdminPortal templates={templates} setTemplates={setTemplates} users={users} setUsers={setUsers} shifts={shifts} setShifts={setShifts}/>}
        {activePortal==="reports"&&inventory&&<ReportsView templates={templates} submissions={submissions} inventory={inventory} orders={orders} waste={waste}/>}
      </div>
    </div>
  );
}
