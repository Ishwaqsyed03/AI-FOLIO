import React from 'react';
import { Mail, Github, Linkedin, ArrowRight, Star } from 'lucide-react';

const BoldColorful = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];
  const COLORS = ['#f59e0b','#ef4444','#3b82f6','#10b981','#8b5cf6','#f97316','#06b6d4','#ec4899'];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>
      <style>{`
        @keyframes bc-pop{0%{transform:scale(0.8) rotate(-3deg);opacity:0;}100%{transform:scale(1) rotate(0);opacity:1;}}
        @keyframes bc-fadeUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
        .bc-f1{animation:bc-pop .7s cubic-bezier(.34,1.56,.64,1) both;}
        .bc-f2{animation:bc-fadeUp .6s .1s ease both;}
        .bc-f3{animation:bc-fadeUp .6s .25s ease both;}
        .bc-f4{animation:bc-fadeUp .6s .4s ease both;}
        .bc-skill{transition:all .2s cubic-bezier(.34,1.56,.64,1);}
        .bc-skill:hover{transform:scale(1.1) rotate(-1deg);}
        .bc-card{transition:all .3s ease;}
        .bc-card:hover{transform:translateY(-6px);}
      `}</style>

      {/* Hero */}
      <header className="relative overflow-hidden px-8 md:px-20 pt-20 pb-32" style={{background:'#111111'}}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{background:'radial-gradient(circle,#f59e0b,transparent)',transform:'translate(40%,-40%)'}} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15" style={{background:'radial-gradient(circle,#ef4444,transparent)',transform:'translate(-30%,40%)'}} />
        <div className="max-w-6xl mx-auto relative">
          <div className="bc-f1 inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{background:'rgba(245,158,11,0.2)',border:'2px solid #f59e0b'}}>
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-wide">Portfolio</span>
          </div>
          <h1 className="bc-f2 font-black leading-none mb-6 text-white" style={{fontSize:'clamp(4rem,10vw,9rem)',letterSpacing:'-0.05em'}}>{data?.name||'Your Name'}</h1>
          <div className="bc-f3 flex items-center gap-6 mb-8">
            <div className="w-16 h-2 rounded-full bg-yellow-400" />
            <p className="text-2xl font-bold text-yellow-400">{data?.title||'Your Title'}</p>
          </div>
          <p className="bc-f4 text-gray-400 text-lg max-w-2xl leading-relaxed mb-10">{data?.bio||''}</p>
          <div className="bc-f4 flex flex-wrap gap-4">
            {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-full text-black bg-yellow-400"><Mail size={16}/>{contact.email}</a>}
            {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-full border-2 border-white/20 text-white"><Github size={16}/>GitHub</a>}
            {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-full border-2 border-white/20 text-white"><Linkedin size={16}/>LinkedIn</a>}
          </div>
        </div>
      </header>

      {/* Skills */}
      <section className="py-24 px-8 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-black mb-4" style={{letterSpacing:'-0.03em'}}>Skills</h2>
          <div className="w-20 h-2 rounded-full mb-14 bg-yellow-400" />
          <div className="flex flex-wrap gap-4">
            {skills.map((skill,i)=>(
              <span key={i} className="bc-skill px-6 py-3 rounded-full font-bold text-sm text-white cursor-default" style={{background:COLORS[i%COLORS.length],transform:`rotate(${(i%3-1)*1.5}deg)`}}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-24 px-8 md:px-20" style={{background:'#f8f8f8'}}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-black mb-4" style={{letterSpacing:'-0.03em'}}>Experience</h2>
          <div className="w-20 h-2 rounded-full mb-14 bg-red-500" />
          <div className="space-y-6">
            {experience.map((exp,i)=>(
              <div key={i} className="bc-card bg-white rounded-2xl p-8" style={{border:`3px solid ${COLORS[i%COLORS.length]}`}}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h3 className="text-2xl font-black text-black">{exp.role}</h3>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{background:COLORS[i%COLORS.length]}}>{exp.duration}</span>
                </div>
                <p className="font-bold mb-3" style={{color:COLORS[i%COLORS.length]}}>{exp.company}</p>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 px-8 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-black mb-4" style={{letterSpacing:'-0.03em'}}>Projects</h2>
          <div className="w-20 h-2 rounded-full mb-14 bg-blue-500" />
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj,i)=>(
              <div key={i} className="bc-card rounded-2xl p-8 bg-white" style={{border:`3px solid ${COLORS[(i+2)%COLORS.length]}`}}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white mb-6" style={{background:COLORS[(i+2)%COLORS.length]}}>{i+1}</div>
                <h3 className="text-xl font-black text-black mb-3">{proj.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(proj.technologies||[]).map((t,j)=>(
                    <span key={j} className="px-3 py-1 text-xs font-bold rounded-full text-white" style={{background:COLORS[(j+i+2)%COLORS.length]}}>{t}</span>
                  ))}
                </div>
                {proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-sm" style={{color:COLORS[(i+2)%COLORS.length]}}>View <ArrowRight size={16}/></a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-24 px-8 md:px-20" style={{background:'#111111'}}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-white mb-4" style={{letterSpacing:'-0.03em'}}>Education</h2>
          <div className="w-20 h-2 rounded-full mb-14 bg-purple-500" />
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu,i)=>(
              <div key={i} className="rounded-2xl p-8 border-2" style={{background:'rgba(255,255,255,0.04)',borderColor:COLORS[(i+4)%COLORS.length]}}>
                <div className="w-3 h-3 rounded-full mb-6" style={{background:COLORS[(i+4)%COLORS.length]}} />
                <h3 className="text-xl font-black text-white mb-2">{edu.degree}</h3>
                <p className="font-bold mb-2" style={{color:COLORS[(i+4)%COLORS.length]}}>{edu.institution}</p>
                <p className="text-gray-500 text-sm">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {customSections.length>0&&(
        <section className="py-24 px-8 md:px-20 bg-white">
          <div className="max-w-6xl mx-auto space-y-8">
            {customSections.map((sec,i)=>(
              <div key={i} className="rounded-2xl p-8" style={{border:`3px solid ${COLORS[i%COLORS.length]}`}}>
                {sec.title&&<h2 className="text-2xl font-black text-black mb-4">{sec.title}</h2>}
                <p className="text-gray-600 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="py-10 text-center text-sm font-bold bg-yellow-400 text-black">
        {data?.name} · {contact.email}
      </footer>
    </div>
  );
};

export default BoldColorful;
