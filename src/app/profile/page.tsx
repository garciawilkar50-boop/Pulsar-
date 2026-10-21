import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRound, AudioLines } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { initials, timeAgo } from "@/lib/utils";
export default async function ProfilePage(){
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)redirect("/login");
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
 const {data:pulses}=await supabase.from("pulses").select("id,body,created_at,resonances(id)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(30);
 const name=profile?.display_name||user.email?.split("@")[0]||"Usuario";
 return <main className="page"><div className="shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">⌁</span>Pulsar</Link><nav className="nav"><Link href="/" className="btn btn-quiet">← Explorar</Link></nav></header><div style={{maxWidth:720,margin:"32px auto"}}><div className="panel"><div className="profile-head"><div className="avatar profile-avatar">{initials(name)}</div><div><p className="eyebrow">Tu espacio</p><h1 style={{fontSize:30,marginBottom:4}}>{name}</h1><p className="muted" style={{margin:0}}>{profile?.username?`@${profile.username}`:user.email}</p></div></div><ProfileEditor userId={user.id} initialName={profile?.display_name||name} initialUsername={profile?.username||""} initialBio={profile?.bio||""}/></div><div className="panel" style={{marginTop:18}}><p className="eyebrow">Tu voz</p><h2>Tus pulsos</h2>{!pulses?.length?<div className="empty"><AudioLines size={24}/><p style={{marginTop:12}}>Todavía no has emitido un pulso.</p><Link className="btn btn-primary" href="/">Emitir el primero</Link></div>:pulses.map(p=><article className="pulse" key={p.id}><p className="pulse-body">{p.body}</p><div className="pulse-actions"><span className="muted small">{timeAgo(p.created_at)}</span><span className="tag">{p.resonances?.length||0} resonancias</span></div></article>)}</div></div></div></main>;
}