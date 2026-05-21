import React from 'react';
import { Mail, Github, Linkedin, Terminal, ChevronRight } from 'lucide-react';

const ProfessionalDark = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  const skillLevels = [92, 88, 85, 90, 78, 95, 82, 87, 91, 80, 76, 93, 84, 79, 88, 94, 81, 86];

  return (
    <div className="min-h-screen" style={{background:'#0a0a0f', color:'#e2e8f0', fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>
      <style>{`
        @keyframes pd-slideRight { from{opacity:0;transform:translateX(-40px);} to{opacity:1;transform:translateX(0);} }
        @keyframes pd-barFill { from{width:0;} to{width:var(--w);} }
        @keyframes pd-glow { 0%,100%{text-shadow:0 0 10px rgba(6,182,212,0.3);} 50%{text-shadow:0 0 30px rgba(6,182,212,0.8),0 0 60px rgba(6,182,212,0.3);} }
        @keyframes pd-scanline { 0%{top:-10%;} 100%{top:110%;} }
        @keyframes pd-blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes pd-fadeUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        .pd-f1{animation:pd-fadeUp 0.8s ease both;}
        .pd-f2{animation:pd-fadeUp 0.8s 0.15s ease both;}
        .pd-f3{animation:pd-fadeUp 0.8s 0.3s ease both;}
        .pd-glow{animation:pd-glow 3s ease-in-out infinite;}
        .pd-cursor{animation:pd-blink 1s step-end infinite;}
        .pd-card{border:1px solid rgba(6,182,212,0.15);transition:all .3s ease;}
        .pd-card:hover{border-color:rgba(6,182,212,0.5);box-shadow:0 0 40px rgba(6,182,212,0.1),inset 0 0 40px rgba(6,182,212,0.03);transform:translateY(-3px);}
        .pd-bar{height:3px;border-radius:99px;background:linear-gradient(90deg,#06b6d4,#3b82f6);animation:pd-barFill 1.5s ease both;animation-delay:var(--delay);}
        .pd-tag{border:1px solid rgba(6,182,212,0.2);transition:all .2s;}
        .pd-tag:hover{border-color:rgba(6,182,212,0.6);background:rgba(6,182,212,0.1);color:#67e8f9;}
        .pd-hex{clip-path:polygon(50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%);}
      `}</style>

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(6,182,212,0.08),transparent)',animation:'pd-scanline 6s linear infinite'}} />
        <div className="absolute inset-0 opacity-3" style={{backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(6,182,212,0.01) 2px,rgba(6,182,212,0.01) 4px)'}} />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(rgba(6,182,212,0.4) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      </div>

      <div className="relative" style={{zIndex:1}}>
        {/* Hero */}
        <header className="min-h-screen flex items-center px-8 md:px-20 py-20" style={{borderBottom:'1px solid rgba(6,182,212,0.1)'}}>
          <div className="max-w-6xl w-full">
            <div className="pd-f1 text-xs font-mono text-cyan-600 mb-6 tracking-widest">
              &gt; INITIALIZING_PORTFOLIO.EXE
              <span className="pd-cursor text-cyan-400 ml-1">_</span>
            </div>
            <h1 className="pd-f2 pd-glow font-black leading-none mb-4" style={{fontSize:'clamp(4rem,9vw,8rem)',letterSpacing:'-0.04em',color:'#06b6d4'}}>
              {data?.name || 'Your Name'}
            </h1>
            <div className="pd-f3 flex items-center gap-3 mb-8">
              <Terminal size={20} className="text-cyan-500" />
              <span className="text-xl text-gray-300 font-light">{data?.title || 'Your Title'}</span>
            </div>
            <p className="pd-f3 text-gray-500 max-w-2xl leading-relaxed mb-10 font-mono text-sm">
              <span className="text-cyan-600">// </span>{data?.bio || ''}
            </p>
            <div className="flex flex-wrap gap-4">
              {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-2 px-6 py-3 rounded text-sm font-mono font-medium" style={{background:'rgba(6,182,212,0.1)',border:'1px solid rgba(6,182,212,0.4)',color:'#67e8f9'}}><Mail size={15}/>{contact.email}</a>}
              {contact.github && <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded text-sm font-mono font-medium text-gray-400 hover:text-cyan-400" style={{border:'1px solid rgba(255,255,255,0.08)'}}><Github size={15}/>GitHub</a>}
              {contact.linkedin && <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded text-sm font-mono font-medium text-gray-400 hover:text-cyan-400" style={{border:'1px solid rgba(255,255,255,0.08)'}}><Linkedin size={15}/>LinkedIn</a>}
            </div>
          </div>
        </header>

        {/* Skills with progress bars */}
        <section className="py-24 px-8 md:px-20" style={{background:'#0d0d18'}}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <span className="font-mono text-cyan-600 text-xs tracking-widest">$ skills --verbose</span>
              <h2 className="text-4xl font-bold text-white mt-2">Technical Expertise</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-mono text-gray-300">{skill}</span>
                    <span className="text-xs font-mono text-cyan-600">{skillLevels[i % skillLevels.length]}%</span>
                  </div>
                  <div className="h-px w-full rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                    <div className="pd-bar" style={{'--w':`${skillLevels[i%skillLevels.length]}%`, '--delay':`${0.5+i*0.08}s`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <span className="font-mono text-cyan-600 text-xs tracking-widest">$ experience --show-all</span>
              <h2 className="text-4xl font-bold text-white mt-2">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="pd-card rounded-xl p-8" style={{background:'rgba(255,255,255,0.02)'}}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <ChevronRight size={16} className="text-cyan-500 flex-shrink-0" />
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    </div>
                    <span className="font-mono text-xs text-cyan-600 px-3 py-1 rounded" style={{background:'rgba(6,182,212,0.08)',border:'1px solid rgba(6,182,212,0.2)'}}>{exp.duration}</span>
                  </div>
                  <p className="text-cyan-400 font-medium mb-3 ml-7">{exp.company}</p>
                  <p className="text-gray-500 leading-relaxed ml-7">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-24 px-8 md:px-20" style={{background:'#0d0d18'}}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <span className="font-mono text-cyan-600 text-xs tracking-widest">$ projects --featured</span>
              <h2 className="text-4xl font-bold text-white mt-2">Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="pd-card rounded-xl p-8" style={{background:'rgba(255,255,255,0.02)'}}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-cyan-600">[{String(i+1).padStart(2,'0')}]</span>
                    <span className="font-mono text-xs text-green-500">STATUS: DEPLOYED</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{proj.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(proj.technologies||[]).map((t,j)=>(
                      <span key={j} className="pd-tag px-3 py-1 text-xs font-mono rounded text-gray-400" style={{background:'rgba(255,255,255,0.03)'}}>{t}</span>
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
            <div className="mb-14">
              <span className="font-mono text-cyan-600 text-xs tracking-widest">$ education --list</span>
              <h2 className="text-4xl font-bold text-white mt-2">Education</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu, i) => (
                <div key={i} className="pd-card rounded-xl p-8" style={{background:'rgba(255,255,255,0.02)'}}>
                  <div className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold text-cyan-400 mb-4" style={{background:'rgba(6,182,212,0.1)',border:'1px solid rgba(6,182,212,0.3)'}}>ED</div>
                  <h3 className="text-lg font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-gray-400">{edu.institution}</p>
                  <p className="font-mono text-xs text-cyan-600 mt-2">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {customSections.length > 0 && (
          <section className="py-24 px-8 md:px-20">
            <div className="max-w-6xl mx-auto space-y-8">
              {customSections.map((sec,i)=>(
                <div key={i} className="pd-card rounded-xl p-8">
                  {sec.title && <h2 className="text-2xl font-bold text-white mb-4">{sec.title}</h2>}
                  <p className="text-gray-500 leading-relaxed font-mono text-sm">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="py-10 text-center font-mono text-xs text-gray-700 border-t border-cyan-900/30">
          <span className="text-cyan-800">// </span>{data?.name} · {contact.email}
        </footer>
      </div>
    </div>
  );
};

export default ProfessionalDark;
