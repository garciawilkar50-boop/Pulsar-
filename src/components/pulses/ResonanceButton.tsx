"use client";
import { useState } from "react";
import { AudioLines } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
export function ResonanceButton({pulseId,userId,initialCount,initiallyResonated}:{pulseId:string;userId:string;initialCount:number;initiallyResonated:boolean}){
 const [count,setCount]=useState(initialCount);const [on,setOn]=useState(initiallyResonated);const [busy,setBusy]=useState(false);
 async function toggle(){
  if(busy)return;setBusy(true);const next=!on;setOn(next);setCount(c=>c+(next?1:-1));const supabase=createClient();
  const result=next?await supabase.from("resonances").insert({pulse_id:pulseId,user_id:userId}):await supabase.from("resonances").delete().eq("pulse_id",pulseId).eq("user_id",userId);
  if(result.error){setOn(!next);setCount(c=>c+(next?-1:1));}setBusy(false);
 }
 return <button type="button" className={`resonate ${on?"on":""}`} onClick={toggle} disabled={busy} aria-pressed={on}><AudioLines size={15}/><span>Resonar</span><span>{count}</span></button>;
}