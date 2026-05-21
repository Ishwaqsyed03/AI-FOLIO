import React from 'react';
import { Mail, Phone, Github, Linkedin, ExternalLink, ArrowUpRight } from 'lucide-react';

const ModernMinimal = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="bg-[#fafafa] text-gray-900 min-h-screen font-sans" style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`
        @keyframes mm-fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes mm-fadeLeft { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
        @keyframes mm-expand { from { width:0; } to { width:100%; } }
        @keyframes mm-glow { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0);} 50%{box-shadow:0 0 20px 4px rgba(249,115,22,0.25);} }
        @keyframes mm-float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-8px);} }
        .mm-fade1{animation:mm-fadeUp .7s ease both;}
        .mm-fade2{animation:mm-fadeUp .7s .15s ease both;}
        .mm-fade3{animation:mm-fadeUp .7s .3s ease both;}
        .mm-fade4{animation:mm-fadeUp .7s .45s ease both;}
        .mm-fade5{animation:mm-fadeUp .7s .6s ease both;}
        .mm-bar-fill{animation:mm-expand 1.2s .8s ease both; width:0;}
        .mm-skill:hover{transform:translateY(-3px); box-shadow:0 8px 20px rgba(249,115,22,.2);}
        .mm-card:hover{transform:translateY(-6px); box-shadow:0 20px 60px rgba(0,0,0,.12);}
        .mm-card{transition:transform .3s ease,box-shadow .3s ease;}
        .mm-social:hover{transform:scale(1.15) rotate(-5deg);}
        .mm-social{transition:transform .25s ease;}
        .mm-dot-float{animation:mm-float 4s ease-in-out infinite;}
      `}</style>

      {/* Decorative background dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30" style={{zIndex:0}}>
        <div className="mm-dot-float absolute top-20 right-32 w-64 h-64 rounded-full" style={{background:'radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)'}} />
        <div className="absolute bottom-40 left-20 w-48 h-48 rounded-full" style={{background:'radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)', animation:'mm-float 6s 1s ease-in-out infinite'}} />
      </div>

      <div className="relative" style={{zIndex:1}}>
        {/* Hero */}
        <header className="min-h-screen flex items-center px-8 md:px-20 py-20" style={{background:'linear-gradient(135deg,#ffffff 0%,#fff7f0 60%,#fff3e8 100%)'}}>
          <div className="max-w-5xl w-full">
            <div className="mm-fade1 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 text-orange-600" style={{background:'rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.2)'}}>
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" style={{animation:'mm-glow 2s infinite'}} />
              Available for opportunities
            </div>
            <h1 className="mm-fade2 font-black leading-none mb-4 text-gray-900" style={{fontSize:'clamp(3.5rem,8vw,7rem)', letterSpacing:'-0.04em'}}>
              {data?.name || 'Your Name'}
            </h1>
            <div className="mm-fade3 flex items-center gap-4 mb-8">
              <div className="h-px bg-orange-400 flex-1" style={{maxWidth:'80px', animation:'mm-expand 0.8s 0.5s ease both', width:0}} />
              <p className="text-xl md:text-2xl text-gray-500 font-light tracking-wide">{data?.title || 'Your Title'}</p>
            </div>
            <p className="mm-fade4 text-lg text-gray-600 max-w-2xl leading-relaxed mb-10">{data?.bio || ''}</p>
            <div className="mm-fade5 flex flex-wrap gap-4">
              {contact.email && <a href={`mailto:${contact.email}`} className="mm-social flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white" style={{background:'linear-gradient(135deg,#f97316,#ea580c)'}}><Mail size={16}/>{contact.email}</a>}
              {contact.github && <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="mm-social flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border border-gray-200 bg-white hover:border-orange-300 text-gray-700"><Github size={16}/>GitHub</a>}
              {contact.linkedin && <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="mm-social flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border border-gray-200 bg-white hover:border-orange-300 text-gray-700"><Linkedin size={16}/>LinkedIn</a>}
            </div>
          </div>
        </header>

        {/* Skills */}
        <section className="py-24 px-8 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-14">
              <span className="text-7xl font-black text-gray-100 select-none leading-none">01</span>
              <h2 className="text-4xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span key={i} className="mm-skill px-5 py-2.5 rounded-full text-sm font-semibold cursor-default" style={{background:i%3===0?'#fff7f0':i%3===1?'#f8f8f8':'#fff3e8', border:`1px solid ${i%3===0?'rgba(249,115,22,0.3)':'rgba(0,0,0,0.08)'}`, color:i%3===0?'#c2410c':'#374151', animationDelay:`${i*0.05}s`, animation:'mm-fadeUp 0.5s ease both'}}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-24 px-8 md:px-20" style={{background:'#fafafa'}}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-14">
              <span className="text-7xl font-black text-gray-100 select-none leading-none">02</span>
              <h2 className="text-4xl font-bold text-gray-900">Experience</h2>
            </div>
            <div className="space-y-0">
              {experience.map((exp, i) => (
                <div key={i} className="relative flex gap-8 pb-12 group">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-orange-400 bg-white group-hover:bg-orange-400 transition-colors mt-1.5 flex-shrink-0" />
                    {i < experience.length - 1 && <div className="w-px flex-1 mt-2" style={{background:'linear-gradient(to bottom, rgba(249,115,22,0.4), rgba(249,115,22,0.1))'}} />}
                  </div>
                  <div className="flex-1 pt-0">
                    <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-1">{exp.duration}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{exp.role}</h3>
                    <p className="text-gray-500 font-medium mb-3">{exp.company}</p>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-24 px-8 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-14">
              <span className="text-7xl font-black text-gray-100 select-none leading-none">03</span>
              <h2 className="text-4xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((proj, i) => (
                <div key={i} className="mm-card bg-white rounded-2xl p-8 border border-gray-100" style={{boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{background:'linear-gradient(135deg,#f97316,#ea580c)'}}>{String(i+1).padStart(2,'0')}</div>
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-600 transition-colors"><ArrowUpRight size={20}/></a>}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{proj.name}</h3>
                  <p className="text-gray-600 mb-5 leading-relaxed text-sm">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(proj.technologies||[]).map((t,j)=>(
                      <span key={j} className="px-3 py-1 text-xs font-medium rounded-full text-orange-700" style={{background:'rgba(249,115,22,0.08)'}}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-24 px-8 md:px-20" style={{background:'linear-gradient(135deg,#fff7f0,#fafafa)'}}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-14">
              <span className="text-7xl font-black text-gray-100 select-none leading-none">04</span>
              <h2 className="text-4xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu, i) => (
                <div key={i} className="mm-card p-8 rounded-2xl bg-white border border-gray-100">
                  <div className="w-12 h-1 rounded-full bg-orange-400 mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                  <p className="text-gray-600 font-medium">{edu.institution}</p>
                  <p className="text-orange-500 text-sm mt-2 font-semibold">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {customSections.length > 0 && (
          <section className="py-24 px-8 md:px-20 bg-white">
            <div className="max-w-5xl mx-auto space-y-12">
              {customSections.map((sec,i)=>(
                <div key={i}>
                  {sec.title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{sec.title}</h2>}
                  <p className="text-gray-600 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 px-8 text-center bg-gray-900 text-gray-400 text-sm">
          <p className="font-medium text-white text-lg mb-2">{data?.name}</p>
          <p>{contact.email}</p>
        </footer>
      </div>
    </div>
  );
};

export default ModernMinimal;
