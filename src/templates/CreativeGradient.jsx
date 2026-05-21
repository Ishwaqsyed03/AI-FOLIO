import React from 'react';
import { Mail, Github, Linkedin, ExternalLink, Zap } from 'lucide-react';

const CreativeGradient = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="min-h-screen text-white" style={{background:'#07030f', fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>
      <style>{`
        @keyframes cg-aurora1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(60px,-40px) scale(1.1);} 66%{transform:translate(-40px,60px) scale(0.9);} }
        @keyframes cg-aurora2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-80px,50px) scale(1.15);} 66%{transform:translate(60px,-70px) scale(0.85);} }
        @keyframes cg-aurora3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(50px,80px) scale(1.2);} }
        @keyframes cg-fadeUp { from{opacity:0;transform:translateY(50px);} to{opacity:1;transform:translateY(0);} }
        @keyframes cg-shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes cg-pulse-ring { 0%{transform:scale(1);opacity:0.8;} 100%{transform:scale(1.8);opacity:0;} }
        @keyframes cg-rotate { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        .cg-blob1{animation:cg-aurora1 12s ease-in-out infinite;}
        .cg-blob2{animation:cg-aurora2 16s ease-in-out infinite;}
        .cg-blob3{animation:cg-aurora3 20s ease-in-out infinite;}
        .cg-f1{animation:cg-fadeUp 0.8s ease both;}
        .cg-f2{animation:cg-fadeUp 0.8s 0.2s ease both;}
        .cg-f3{animation:cg-fadeUp 0.8s 0.4s ease both;}
        .cg-f4{animation:cg-fadeUp 0.8s 0.6s ease both;}
        .cg-shimmer-text{background:linear-gradient(90deg,#c084fc,#f9a8d4,#67e8f9,#a78bfa,#c084fc);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:cg-shimmer 4s linear infinite;}
        .cg-glass{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(20px);}
        .cg-glass:hover{background:rgba(255,255,255,0.08);border-color:rgba(168,85,247,0.4);transform:translateY(-4px);box-shadow:0 20px 60px rgba(168,85,247,0.2);}
        .cg-glass{transition:all .3s ease;}
        .cg-skill{border:1px solid rgba(255,255,255,0.1);transition:all .25s ease;}
        .cg-skill:hover{border-color:rgba(168,85,247,0.6);background:rgba(168,85,247,0.15);transform:scale(1.05);}
        .cg-ring{animation:cg-pulse-ring 2s ease-out infinite;}
      `}</style>

      {/* Animated aurora blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{zIndex:0}}>
        <div className="cg-blob1 absolute rounded-full opacity-30" style={{width:'600px',height:'600px',top:'-200px',left:'-100px',background:'radial-gradient(circle,rgba(168,85,247,0.8),transparent 70%)',filter:'blur(60px)'}} />
        <div className="cg-blob2 absolute rounded-full opacity-25" style={{width:'700px',height:'700px',top:'200px',right:'-200px',background:'radial-gradient(circle,rgba(6,182,212,0.7),transparent 70%)',filter:'blur(70px)'}} />
        <div className="cg-blob3 absolute rounded-full opacity-20" style={{width:'500px',height:'500px',bottom:'-100px',left:'30%',background:'radial-gradient(circle,rgba(244,114,182,0.7),transparent 70%)',filter:'blur(60px)'}} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
      </div>

      <div className="relative" style={{zIndex:1}}>
        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 pt-20 pb-16">
          <div className="max-w-5xl w-full mx-auto">
            <div className="cg-f1 flex items-center gap-3 mb-8">
              <div className="relative w-3 h-3">
                <div className="cg-ring absolute inset-0 rounded-full bg-purple-400 opacity-60" />
                <div className="w-3 h-3 rounded-full bg-purple-400" />
              </div>
              <span className="text-sm text-purple-300 font-medium tracking-widest uppercase">Creative Portfolio</span>
            </div>
            <h1 className="cg-f2 font-black leading-none mb-6" style={{fontSize:'clamp(4rem,9vw,8rem)',letterSpacing:'-0.04em'}}>
              <span className="cg-shimmer-text">{data?.name || 'Your Name'}</span>
            </h1>
            <p className="cg-f3 text-2xl font-light text-purple-200 mb-6 tracking-wide">{data?.title || 'Your Title'}</p>
            <p className="cg-f4 text-gray-400 max-w-2xl leading-relaxed text-lg mb-10">{data?.bio || ''}</p>

            <div className="cg-f4 flex flex-wrap gap-4">
              {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white" style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)'}}><Mail size={16}/>{contact.email}</a>}
              {contact.github && <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="cg-glass flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-purple-200"><Github size={16}/>GitHub</a>}
              {contact.linkedin && <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="cg-glass flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-purple-200"><Linkedin size={16}/>LinkedIn</a>}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline gap-4 mb-14">
              <span className="text-xs font-bold tracking-widest text-purple-500 uppercase">Skills</span>
              <h2 className="text-4xl font-bold text-white">What I work with</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill, i) => (
                <div key={i} className="cg-skill rounded-2xl p-4 text-center cursor-default" style={{background:'rgba(255,255,255,0.03)', animationDelay:`${i*0.04}s`}}>
                  <div className="w-8 h-8 rounded-lg mx-auto mb-3 flex items-center justify-center text-lg font-bold" style={{background:`hsl(${(i*37+260)%360},60%,30%)`}}>
                    {skill.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline gap-4 mb-14">
              <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase">Experience</span>
              <h2 className="text-4xl font-bold text-white">My Journey</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="cg-glass rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                      <p className="text-purple-300 font-medium">{exp.company}</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300 flex-shrink-0" style={{background:'rgba(6,182,212,0.15)',border:'1px solid rgba(6,182,212,0.3)'}}>{exp.duration}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline gap-4 mb-14">
              <span className="text-xs font-bold tracking-widest text-pink-500 uppercase">Projects</span>
              <h2 className="text-4xl font-bold text-white">Featured Work</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="cg-glass rounded-3xl p-8 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:`linear-gradient(135deg,hsl(${i*60+260},70%,50%),hsl(${i*60+300},70%,40%))`}}>
                      <Zap size={20} className="text-white" />
                    </div>
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-400 transition-colors"><ExternalLink size={18}/></a>}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{proj.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(proj.technologies||[]).map((t,j)=>(
                      <span key={j} className="px-3 py-1 rounded-full text-xs font-medium text-purple-300" style={{background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.25)'}}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-baseline gap-4 mb-14">
              <span className="text-xs font-bold tracking-widest text-purple-500 uppercase">Education</span>
              <h2 className="text-4xl font-bold text-white">Academic Background</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu, i) => (
                <div key={i} className="cg-glass rounded-3xl p-8">
                  <div className="w-12 h-1 rounded-full mb-6" style={{background:`linear-gradient(90deg,hsl(${i*80+260},70%,60%),hsl(${i*80+320},70%,60%))`}} />
                  <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-purple-300 font-medium mb-2">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {customSections.length > 0 && (
          <section className="py-24 px-8 md:px-20">
            <div className="max-w-5xl mx-auto space-y-8">
              {customSections.map((sec,i)=>(
                <div key={i} className="cg-glass rounded-3xl p-8">
                  {sec.title && <h2 className="text-2xl font-bold text-white mb-4">{sec.title}</h2>}
                  <p className="text-gray-400 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5">
          <p className="text-white font-semibold text-lg mb-1">{data?.name}</p>
          <p>{contact.email}</p>
        </footer>
      </div>
    </div>
  );
};

export default CreativeGradient;
