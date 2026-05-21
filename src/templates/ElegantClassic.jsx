import React from 'react';
import { Mail, Phone, Github, Linkedin, MapPin } from 'lucide-react';

const ElegantClassic = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="min-h-screen" style={{background:'#f9f6f1', fontFamily:"'Georgia','Times New Roman',serif", color:'#2c2c2c'}}>
      <style>{`
        @keyframes ec-fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes ec-slideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ec-lineGrow{from{width:0;}to{width:100%;}}
        @keyframes ec-goldShimmer{0%,100%{color:#b5902a;}50%{color:#d4aa47;}}
        .ec-f1{animation:ec-fadeIn 1s ease both;}
        .ec-f2{animation:ec-slideUp .8s .2s ease both;}
        .ec-f3{animation:ec-slideUp .8s .4s ease both;}
        .ec-f4{animation:ec-slideUp .8s .6s ease both;}
        .ec-divider{animation:ec-lineGrow 1.2s .3s ease both;width:0;}
        .ec-gold{animation:ec-goldShimmer 4s ease-in-out infinite;}
        .ec-card:hover{box-shadow:0 8px 40px rgba(181,144,42,0.12);transform:translateY(-3px);}
        .ec-card{transition:all .3s ease;}
        .ec-skill:hover{background:#b5902a;color:white;border-color:#b5902a;}
        .ec-skill{transition:all .25s ease;}
      `}</style>

      {/* Top ornament line */}
      <div className="h-1 w-full" style={{background:'linear-gradient(90deg,#b5902a,#d4aa47,#b5902a)'}} />

      {/* Hero */}
      <header className="py-24 px-8 md:px-24 text-center" style={{borderBottom:'1px solid #e8dfc8'}}>
        <div className="ec-f1 text-xs tracking-[0.4em] uppercase mb-6" style={{color:'#b5902a'}}>— Portfolio —</div>
        <h1 className="ec-f2 font-black leading-tight mb-4" style={{fontSize:'clamp(3.5rem,8vw,7rem)',letterSpacing:'-0.02em',color:'#1a1a1a',fontFamily:"'Georgia',serif"}}>
          {data?.name||'Your Name'}
        </h1>
        <div className="ec-f3 flex items-center justify-center gap-4 mb-8">
          <div className="ec-divider h-px flex-1" style={{maxWidth:'80px',background:'#b5902a'}} />
          <p className="text-xl font-light tracking-widest" style={{color:'#b5902a',fontFamily:"'Georgia',serif"}}>{data?.title||'Your Title'}</p>
          <div className="ec-divider h-px flex-1" style={{maxWidth:'80px',background:'#b5902a'}} />
        </div>
        <p className="ec-f4 text-lg leading-relaxed mx-auto mb-10 text-gray-600" style={{maxWidth:'640px',fontFamily:"'Georgia',serif",fontStyle:'italic'}}>{data?.bio||''}</p>
        <div className="ec-f4 flex flex-wrap justify-center gap-6 text-sm" style={{color:'#6b5c3e'}}>
          {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-yellow-700"><Mail size={15}/>{contact.email}</a>}
          {contact.phone&&<a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-yellow-700"><Phone size={15}/>{contact.phone}</a>}
          {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-700"><Github size={15}/>GitHub</a>}
          {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-700"><Linkedin size={15}/>LinkedIn</a>}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 md:px-16">
        {/* Skills */}
        <section className="py-20" style={{borderBottom:'1px solid #e8dfc8'}}>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-bold" style={{color:'#1a1a1a',letterSpacing:'0.05em'}}>EXPERTISE</h2>
            <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,#b5902a,transparent)'}} />
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill,i)=>(
              <span key={i} className="ec-skill px-5 py-2.5 text-sm border rounded-none cursor-default" style={{borderColor:'#c9a84c',color:'#6b5c3e',background:'transparent',fontFamily:"'Georgia',serif"}}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience timeline */}
        <section className="py-20" style={{borderBottom:'1px solid #e8dfc8'}}>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-bold" style={{color:'#1a1a1a',letterSpacing:'0.05em'}}>EXPERIENCE</h2>
            <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,#b5902a,transparent)'}} />
          </div>
          <div className="space-y-0">
            {experience.map((exp,i)=>(
              <div key={i} className="flex gap-8 pb-16 relative group">
                <div className="flex flex-col items-center w-6 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full mt-2 border-2 group-hover:scale-125 transition-transform" style={{background:'#b5902a',borderColor:'#b5902a'}} />
                  {i<experience.length-1&&<div className="w-px flex-1 mt-1" style={{background:'linear-gradient(to bottom,#b5902a40,transparent)'}} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs tracking-widest uppercase mb-2" style={{color:'#b5902a'}}>{exp.duration}</p>
                  <h3 className="text-2xl font-bold mb-1" style={{color:'#1a1a1a'}}>{exp.role}</h3>
                  <p className="text-base italic mb-4" style={{color:'#6b5c3e',fontFamily:"'Georgia',serif"}}>{exp.company}</p>
                  <p className="leading-relaxed text-gray-600" style={{fontFamily:"'Georgia',serif"}}>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="py-20" style={{borderBottom:'1px solid #e8dfc8'}}>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-bold" style={{color:'#1a1a1a',letterSpacing:'0.05em'}}>PROJECTS</h2>
            <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,#b5902a,transparent)'}} />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj,i)=>(
              <div key={i} className="ec-card p-8" style={{background:'#fdfaf4',border:'1px solid #e8dfc8'}}>
                <div className="w-10 h-px mb-6" style={{background:'#b5902a'}} />
                <h3 className="text-xl font-bold mb-3" style={{color:'#1a1a1a'}}>{proj.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic" style={{fontFamily:"'Georgia',serif"}}>{proj.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(proj.technologies||[]).map((t,j)=>(
                    <span key={j} className="px-3 py-1 text-xs border" style={{borderColor:'#c9a84c',color:'#8b6914'}}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="py-20">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-bold" style={{color:'#1a1a1a',letterSpacing:'0.05em'}}>EDUCATION</h2>
            <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,#b5902a,transparent)'}} />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu,i)=>(
              <div key={i} className="ec-card p-8" style={{background:'#fdfaf4',border:'1px solid #e8dfc8'}}>
                <p className="text-xs tracking-widest uppercase mb-3" style={{color:'#b5902a'}}>{edu.year}</p>
                <h3 className="text-xl font-bold mb-2" style={{color:'#1a1a1a'}}>{edu.degree}</h3>
                <p className="italic" style={{color:'#6b5c3e',fontFamily:"'Georgia',serif"}}>{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>

        {customSections.length>0&&(
          <section className="py-20 border-t" style={{borderColor:'#e8dfc8'}}>
            <div className="space-y-12">
              {customSections.map((sec,i)=>(
                <div key={i}>
                  {sec.title&&<h2 className="text-2xl font-bold mb-6" style={{color:'#1a1a1a'}}>{sec.title}</h2>}
                  <p className="text-gray-600 leading-relaxed italic" style={{fontFamily:"'Georgia',serif"}}>{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="h-1 w-full" style={{background:'linear-gradient(90deg,#b5902a,#d4aa47,#b5902a)'}} />
      <footer className="py-10 text-center text-xs tracking-widest uppercase" style={{color:'#b5902a',background:'#f9f6f1'}}>
        {data?.name} · {contact.email}
      </footer>
    </div>
  );
};

export default ElegantClassic;
