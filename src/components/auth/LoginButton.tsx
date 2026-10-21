"use client";
import { useState } from "react";
import { Github, Chrome, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
export function LoginButton({ provider, label }: { provider: "google" | "github"; label: string }) {
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function signIn(){
    setLoading(true);setError("");
    try{
      const supabase=createClient();
      const {error:authError}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo:`${window.location.origin}/auth/callback`}});
      if(authError)throw authError;
    }catch(e){setError(e instanceof Error?e.message:"No se pudo iniciar sesión.");setLoading(false);}
  }
  const Icon=provider==="github"?Github:Chrome;
  return <div><button type="button" className="btn" style={{width:"100%",padding:14}} onClick={signIn} disabled={loading}>{loading?<LoaderCircle size={18}/>:<Icon size={18}/>} {loading?"Conectando…":label}</button>{error&&<p role="alert" className="small" style={{color:"#ff9caa",margin:"8px 0 0"}}>{error}</p>}</div>;
}