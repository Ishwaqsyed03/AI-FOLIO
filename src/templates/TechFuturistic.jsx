import React from 'react';
import { Mail, Github, Linkedin, Cpu, Zap, Shield } from 'lucide-react';

const TechFuturistic = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="min-h-screen" style={{background:'#000000', color:'#00ff9f', fontFamily:"'Courier New',monospace"}}>
      <style>{`
        @keyframes tf-flicker{0%,100%{opacity:1;}92%{opacity:1;}93%{opacity:0.4;}94%{opacity:1;}96%{opacity:0.8;}97%{opacity:1;}}
        @keyframes tf-scan{0%{top:-5%;}100%{top:105%;}}
        @keyframes tf-glow{0%,100%{box-shadow:0 0 5px #00ff9f,0 0 10px #00ff9f;}50%{box-shadow:0 0 20px #00ff9f,0 0 40px #00ff9f,0 0 80px #00ff9f33;}}
        @keyframes tf-textGlow{0%,100%{text-shadow:0 0 4px #00ff9f;}50%{text-shadow:0 0 12px #00ff9f,0 0 24px #00ff9f55;}}
        @keyframes tf-fadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes tf-border{0%,100%{border-color:rgba(0,255,159,0.3);}50%{border-color:rgba(0,255,159,0.8);}}
        @keyframes tf-blink{0%,100%{opacity:1;}50%{opacity:0;}}
        .tf-glow{animation:tf-glow 2.5s ease-in-out infinite;}
        .tf-textglow{animation:tf-textGlow 3s ease-in-out infinite;}
        .tf-flicker{animation:tf-flicker 8s ease-in-out infinite;}
        .tf-f1{animation:tf-fadeIn 0.8s ease both;}
        .tf-f2{animation:tf-fadeIn 0.8s 0.2s ease both;}
        .tf-f3{animation:tf-fadeIn 0.8s 0.4s ease both;}
        .tf-cursor{animation:tf-blink 1s step-end infinite;}
        .tf-card{border:1px solid rgba(0,255,159,0.2);transition:all .3s ease;}
        .tf-card:hover{border-color:rgba(0,255,159,0.8);box-shadow:0 0 30px rgba(0,255,159,0.15),inset 0 0 30px rgba(0,255,159,0.03);transform:translateY(-3px);}
        .tf-skill{border:1px solid rgba(0,255,159,0.3);transition:all .2s ease;}
        .tf-skill:hover{border-color:#00ff9f;background:rgba(0,255,159,0.1);color:#00ff9f;}
      `}</style>

      {/* CRT scanline */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div style={{position:'absolute',left:0,right:0,height:'3px',background:'linear-gradient(90deg,transparent,rgba(0,255,159,0.12),transparent)',animation:'tf-scan 4s linear infinite'}} />
        <div className="absolute inset-0" style={{backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.15) 3px,rgba(0,0,0,0.15) 4px)',pointerEvents:'none'}} />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(rgba(0,255,159,0.6) 1px,transparent 1px)',backgroundSize:'32px 32px'}} />
      </div>

      <div className="relative" style={{zIndex:1}}>
        {/* Hero */}
        <header className="min-h-screen flex flex-col justify-center px-8 md:px-20 py-20" style={{borderBottom:'1px solid rgba(0,255,159,0.15)'}}>
          <div className="max-w-6xl">
            <div className="tf-f1 text-xs tracking-widest mb-4 opacity-60">
              [SYSTEM ONLINE] &gt; LOADING PORTFOLIO DATA...
            </div>
            <h1 className="tf-f2 tf-textglow tf-flicker font-black leading-none mb-4" style={{fontSize:'clamp(4rem,9vw,8rem)',letterSpacing:'-0.04em',color:'#00ff9f'}}>
              {data?.name||'Your Name'}
            </h1>
            <div className="tf-f3 flex items-center gap-3 mb-6">
              <Cpu size={20} style={{color:'#00ff9f'}} />
              <span className="text-xl tracking-wide opacity-80">{data?.title||'Your Title'}</span>
              <span className="tf-cursor text-green-400 text-xl">_</span>
            </div>
            <p className="tf-f3 text-sm leading-loose max-w-2xl mb-10 opacity-60">&gt; {data?.bio||''}</p>
            <div className="tf-f3 flex flex-wrap gap-4">
              {contact.email&&<a href={`mailto:${contact.email}`} className="tf-card flex items-center gap-2 px-6 py-3 text-sm bg-transparent" style={{color:'#00ff9f'}}><Mail size={15}/>{contact.email}</a>}
              {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="tf-card flex items-center gap-2 px-6 py-3 text-sm opacity-70 hover:opacity-100" style={{color:'#00ff9f'}}><Github size={15}/>GITHUB</a>}
              {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="tf-card flex items-center gap-2 px-6 py-3 text-sm opacity-70 hover:opacity-100" style={{color:'#00ff9f'}}><Linkedin size={15}/>LINKEDIN</a>}
            </div>
          </div>
        </header>

        {/* Skills hex grid */}
        <section className="py-24 px-8 md:px-20" style={{background:'#020a04'}}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-xs tracking-widest opacity-50 block mb-2">// CAPABILITIES_MATRIX</span>
              <h2 className="text-3xl font-black" style={{color:'#00ff9f'}}>TECH_STACK</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {skills.map((skill,i)=>(
                <div key={i} className="tf-skill text-center py-4 px-3 text-xs cursor-default" style={{background:'rgba(0,255,159,0.03)',color:'rgba(0,255,159,0.7)',animationDelay:`${i*0.04}s`}}>
                  [{skill}]
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-xs tracking-widest opacity-50 block mb-2">// WORK_LOG.SYS</span>
              <h2 className="text-3xl font-black" style={{color:'#00ff9f'}}>EXPERIENCE_RECORDS</h2>
            </div>
            <div className="space-y-4">
              {experience.map((exp,i)=>(
                <div key={i} className="tf-card p-8" style={{background:'rgba(0,255,159,0.02)'}}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Zap size={16} style={{color:'#00ff9f'}} />
                      <h3 className="font-bold text-lg" style={{color:'#00ff9f'}}>{exp.role}</h3>
                    </div>
                    <span className="text-xs opacity-50 border px-3 py-1" style={{borderColor:'rgba(0,255,159,0.2)'}}>{exp.duration}</span>
                  </div>
                  <p className="text-sm mb-3 opacity-60">&gt; {exp.company}</p>
                  <p className="text-xs leading-loose opacity-50">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-24 px-8 md:px-20" style={{background:'#020a04'}}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-xs tracking-widest opacity-50 block mb-2">// DEPLOYED_MODULES</span>
              <h2 className="text-3xl font-black" style={{color:'#00ff9f'}}>PROJECTS</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj,i)=>(
                <div key={i} className="tf-card p-8" style={{background:'rgba(0,255,159,0.02)'}}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={14} style={{color:'#00ff9f'}} />
                    <span className="text-xs opacity-40">MODULE_{String(i+1).padStart(3,'0')}</span>
                    <span className="text-xs ml-auto" style={{color:'#00ff9f'}}>● ACTIVE</span>
                  </div>
                  <h3 className="font-bold mb-3" style={{color:'#00ff9f'}}>{proj.name}</h3>
                  <p className="text-xs leading-loose opacity-50 mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(proj.technologies||[]).map((t,j)=>(
                      <span key={j} className="text-xs px-2 py-1 border opacity-60" style={{borderColor:'rgba(0,255,159,0.2)',color:'#00ff9f'}}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-xs tracking-widest opacity-50 block mb-2">// KNOWLEDGE_BASE</span>
              <h2 className="text-3xl font-black" style={{color:'#00ff9f'}}>EDUCATION</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {education.map((edu,i)=>(
                <div key={i} className="tf-card p-8" style={{background:'rgba(0,255,159,0.02)'}}>
                  <p className="text-xs opacity-40 mb-3">{edu.year}</p>
                  <h3 className="font-bold mb-2" style={{color:'#00ff9f'}}>{edu.degree}</h3>
                  <p className="text-sm opacity-60">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {customSections.length>0&&(
          <section className="py-24 px-8 md:px-20">
            <div className="max-w-6xl mx-auto space-y-6">
              {customSections.map((sec,i)=>(
                <div key={i} className="tf-card p-8">
                  {sec.title&&<h2 className="font-bold text-xl mb-4" style={{color:'#00ff9f'}}>&gt; {sec.title}</h2>}
                  <p className="text-xs leading-loose opacity-50">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="py-8 text-center text-xs opacity-30 border-t" style={{borderColor:'rgba(0,255,159,0.1)'}}>
          [EOF] {data?.name} · {contact.email} · SYSTEM_V2.0
        </footer>
      </div>
    </div>
  );
};

export default TechFuturistic;
