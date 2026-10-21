"use client";
import { useState } from "react";
import Link from "next/link";
import { AudioLines, LoaderCircle, Send, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ResonanceButton } from "@/components/pulses/ResonanceButton";
import { initials, timeAgo } from "@/lib/utils";

type Pulse = {
 id:string; user_id:string; body:string; created_at:string;
 profiles?: {username?:string|null;display_name?:string|null;avatar_url?:string|null}|Array<{username?:string|null;display_name?:string|null;avatar_url?:string|null}>|null;
 resonances?:Array<{id:string;user_id:string}>|null;
};
export function PulseFeed({initialPulses,userId,displayName}:{initialPulses:Pulse[];userId:string;displayName:string}){
 const [pulses,setPulses]=useState(initialPulses);const [body,setBody]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 async function emit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const text=body.trim();if(!text||text.length>280||busy)return;
  setBusy(true);setError("");const supabase=createClient();
  const {data,error:insertError}=await supabase.from("pulses").insert({user_id:userId,body:text}).select("id,user_id,body,created_at").single();
  if(insertError){setError("No se pudo emitir el pulso. Comprueba la configuración de Supabase.");setBusy(false);return;}
  setPulses(current=>[{...data,profiles:{display_name:displayName},resonances:[]},...current]);setBody("");setBusy(false);
 }
 return <><form className="panel composer" onSubmit={emit}><label htmlFor="pulse-body" className="eyebrow">Emite un pulso</label><textarea id="pulse-body" value={body} onChange={e=>setBody(e.target.value)} placeholder="¿Qué está resonando contigo?" rows={3} maxLength={280} required style={{marginTop:12}}/><div className="composer-footer"><span className="muted small">{body.length}/280 caracteres</span><button className="btn btn-primary" disabled={busy||!body.trim()}>{busy?<LoaderCircle size={16}/>:<Send size={16}/>} Emitir pulso</button></div>{error&&<p role="alert" className="small" style={{color:"#ff9caa",margin:"10px 0 0"}}>{error}</p>}</form>
 <div className="panel">{pulses.length===0?<div className="empty"><AudioLines size={28}/><h3 style={{marginTop:12,color:"var(--text)"}}>Todo empieza con un pulso.</h3><p>Comparte una idea para iniciar la conversación.</p></div>:pulses.map(p=>{
  const profile=Array.isArray(p.profiles)?p.profiles[0]:p.profiles;const name=profile?.display_name||profile?.username||"Usuario";const resonances=p.resonances||[];
  return <article className="pulse" key={p.id}><div className="pulse-top"><div className="avatar">{initials(name)}</div><div style={{minWidth:0}}><div className="pulse-name">{name}</div><div className="pulse-handle">{profile?.username?`@${profile.username} · `:""}{timeAgo(p.created_at)}</div></div><div style={{marginLeft:"auto"}}><span className="tag">Pulso</span></div></div><p className="pulse-body">{p.body}</p><div className="pulse-actions"><ResonanceButton pulseId={p.id} userId={userId} initialCount={resonances.length} initiallyResonated={resonances.some(r=>r.user_id===userId)}/><Link href="/profile" className="resonate"><UserRound size={15}/> Perfil</Link></div></article>;
 })}</div></>;
}