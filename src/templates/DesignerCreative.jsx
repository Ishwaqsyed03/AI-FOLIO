import React from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, Plus } from 'lucide-react';

const DesignerCreative = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",color:'#0a0a0a'}}>
      <style>{`
        @keyframes dc-reveal{0%{clip-path:inset(0 100% 0 0);}100%{clip-path:inset(0 0% 0 0);}}
        @keyframes dc-fadeUp{from{opacity:0;transform:translateY(50px);}to{opacity:1;transform:translateY(0);}}
        @keyframes dc-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}  }
        @keyframes dc-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        .dc-f1{animation:dc-fadeUp .8s ease both;}
        .dc-f2{animation:dc-fadeUp .8s .15s ease both;}
        .dc-f3{animation:dc-fadeUp .8s .3s ease both;}
        .dc-f4{animation:dc-fadeUp .8s .45s ease both;}
        .dc-spin{animation:dc-spin 20s linear infinite;}
        .dc-card:hover{background:#0a0a0a !important;color:white;}
        .dc-card:hover .dc-card-title{color:white;}
        .dc-card:hover .dc-card-text{color:#aaa;}
        .dc-card:hover .dc-card-tag{background:rgba(255,255,255,0.1);color:white;}
        .dc-card{transition:all .35s ease;cursor:pointer;}
        .dc-skill:hover{background:#e11d48;color:white;transform:scale(1.05);}
        .dc-skill{transition:all .25s ease;}
      `}</style>

      {/* Top nav stripe */}
      <div className="flex items-center justify-between px-8 md:px-16 py-6" style={{borderBottom:'1px solid #e5e7eb'}}>
        <div className="text-sm font-black tracking-widest uppercase">Portfolio</div>
        <div className="flex items-center gap-6 text-xs text-gray-400">
          {contact.email&&<a href={`mailto:${contact.email}`} className="hover:text-red-600 transition-colors">{contact.email}</a>}
          {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors flex items-center gap-1"><Github size={13}/>GitHub</a>}
          {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors flex items-center gap-1"><Linkedin size={13}/>LinkedIn</a>}
        </div>
      </div>

      {/* Hero - magazine split */}
      <header className="grid md:grid-cols-2 min-h-[90vh]">
        {/* Left: big typography */}
        <div className="flex flex-col justify-end px-8 md:px-16 py-20" style={{background:'#0a0a0a'}}>
          <div className="dc-f1 text-xs tracking-[0.5em] uppercase text-red-500 mb-8">— Creative & Designer —</div>
          <h1 className="dc-f2 font-black leading-none text-white mb-8" style={{fontSize:'clamp(4rem,8vw,7rem)',letterSpacing:'-0.04em'}}>
            {(data?.name||'Your Name').split(' ').map((w,i)=>(
              <span key={i} className="block">{w}</span>
            ))}
          </h1>
          <div className="dc-f3 flex items-center gap-4 mb-8">
            <div className="w-12 h-0.5 bg-red-500" />
            <p className="text-xl text-gray-400 font-light">{data?.title||'Your Title'}</p>
          </div>
          <div className="dc-f4 flex gap-4">
            {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-black bg-red-500 hover:bg-red-600 rounded-full transition-colors"><Mail size={15}/>{contact.email}</a>}
          </div>
        </div>
        {/* Right: rotating badge + bio */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 relative" style={{background:'#f8f8f8'}}>
          <div className="absolute top-12 right-12">
            <div className="dc-spin w-28 h-28">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <path id="circle-text" d="M60,10 a50,50 0 1,1 -0.01,0 Z" fill="none"/>
                <text fontSize="10" fill="#e11d48" fontWeight="bold" letterSpacing="4">
                  <textPath href="#circle-text">DESIGNER · CREATOR · BUILDER · INNOVATOR · </textPath>
                </text>
              </svg>
            </div>
          </div>
          <p className="dc-f3 text-2xl font-light leading-relaxed text-gray-700 max-w-md mb-12" style={{fontStyle:'italic'}}>
            "{data?.bio||''}"
          </p>
          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-3xl font-black text-red-500">{projects.length}</p>
              <p className="text-xs text-gray-400 mt-1">Projects</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-3xl font-black text-red-500">{skills.length}</p>
              <p className="text-xs text-gray-400 mt-1">Skills</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-3xl font-black text-red-500">{experience.length}</p>
              <p className="text-xs text-gray-400 mt-1">Roles</p>
            </div>
          </div>
        </div>
      </header>

      {/* Skills marquee style */}
      <section className="py-16 border-y border-gray-100 overflow-hidden bg-white">
        <div className="flex items-center gap-3 mb-8 px-8 md:px-16">
          <Plus size={16} className="text-red-500" />
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">Skills & Tools</h2>
        </div>
        <div className="px-8 md:px-16 flex flex-wrap gap-3">
          {skills.map((skill,i)=>(
            <span key={i} className="dc-skill px-5 py-2.5 text-sm font-semibold rounded-full border border-gray-200 cursor-default" style={{color:i%3===0?'#e11d48':i%3===1?'#0a0a0a':'#6b7280'}}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Experience - editorial rows */}
      <section className="py-24 px-8 md:px-16">
        <div className="flex items-baseline gap-6 mb-14">
          <span className="text-[7rem] font-black leading-none select-none" style={{color:'#f1f1f1',letterSpacing:'-0.04em'}}>02</span>
          <h2 className="text-4xl font-black" style={{letterSpacing:'-0.03em'}}>Experience</h2>
        </div>
        <div className="space-y-0">
          {experience.map((exp,i)=>(
            <div key={i} className="dc-card group grid md:grid-cols-4 gap-4 items-start py-8 px-6 rounded-2xl" style={{borderBottom:'1px solid #e5e7eb'}}>
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{exp.duration}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="dc-card-title text-xl font-black mb-1 transition-colors">{exp.role}</h3>
                <p className="dc-card-text text-gray-500 transition-colors">{exp.company}</p>
              </div>
              <p className="dc-card-text text-sm text-gray-400 leading-relaxed transition-colors">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 px-8 md:px-16" style={{background:'#f8f8f8'}}>
        <div className="flex items-baseline gap-6 mb-14">
          <span className="text-[7rem] font-black leading-none select-none" style={{color:'#ebebeb',letterSpacing:'-0.04em'}}>03</span>
          <h2 className="text-4xl font-black" style={{letterSpacing:'-0.03em'}}>Projects</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((proj,i)=>(
            <div key={i} className="dc-card bg-white rounded-3xl p-8 group border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <span className="text-5xl font-black" style={{color:'#f1f1f1',letterSpacing:'-0.04em'}}>{String(i+1).padStart(2,'0')}</span>
                {proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"><ArrowUpRight size={16}/></a>}
              </div>
              <h3 className="dc-card-title text-xl font-black mb-3 transition-colors">{proj.name}</h3>
              <p className="dc-card-text text-gray-500 text-sm leading-relaxed mb-5 transition-colors">{proj.description}</p>
              <div className="flex flex-wrap gap-2">
                {(proj.technologies||[]).map((t,j)=>(
                  <span key={j} className="dc-card-tag px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 transition-colors">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="py-24 px-8 md:px-16 bg-white">
        <div className="flex items-baseline gap-6 mb-14">
          <span className="text-[7rem] font-black leading-none select-none" style={{color:'#f1f1f1',letterSpacing:'-0.04em'}}>04</span>
          <h2 className="text-4xl font-black" style={{letterSpacing:'-0.03em'}}>Education</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu,i)=>(
            <div key={i} className="dc-card rounded-3xl p-8 border border-gray-100 bg-white">
              <div className="w-12 h-1 rounded-full bg-red-500 mb-6" />
              <h3 className="dc-card-title text-xl font-black mb-2 transition-colors">{edu.degree}</h3>
              <p className="dc-card-text text-gray-500 transition-colors">{edu.institution}</p>
              <p className="text-red-500 font-bold text-sm mt-3">{edu.year}</p>
            </div>
          ))}
        </div>
      </section>

      {customSections.length>0&&(
        <section className="py-24 px-8 md:px-16" style={{background:'#f8f8f8'}}>
          <div className="space-y-8">
            {customSections.map((sec,i)=>(
              <div key={i} className="dc-card bg-white rounded-3xl p-8 border border-gray-100">
                {sec.title&&<h2 className="dc-card-title text-2xl font-black mb-4 transition-colors">{sec.title}</h2>}
                <p className="dc-card-text text-gray-500 leading-relaxed transition-colors">{sec.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="grid md:grid-cols-2">
        <div className="px-8 md:px-16 py-12 bg-red-500 text-white flex flex-col justify-center">
          <p className="text-3xl font-black mb-2">{data?.name}</p>
          <p className="text-red-200">{data?.title}</p>
        </div>
        <div className="px-8 md:px-16 py-12 bg-black text-white flex flex-col justify-center gap-3">
          {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"><Mail size={15}/>{contact.email}</a>}
          {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"><Github size={15}/>GitHub</a>}
          {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"><Linkedin size={15}/>LinkedIn</a>}
        </div>
      </footer>
    </div>
  );
};

export default DesignerCreative;
