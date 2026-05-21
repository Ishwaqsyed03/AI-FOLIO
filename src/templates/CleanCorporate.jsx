import React from 'react';
import { Mail, Phone, Github, Linkedin, Briefcase, GraduationCap, Award, ChevronRight } from 'lucide-react';

const CleanCorporate = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>
      <style>{`
        @keyframes cc-slideRight{from{opacity:0;transform:translateX(-30px);}to{opacity:1;transform:translateX(0);}}
        @keyframes cc-fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes cc-barFill{from{width:0;}to{width:var(--w);}}
        .cc-f1{animation:cc-slideRight .7s ease both;}
        .cc-f2{animation:cc-fadeUp .6s .15s ease both;}
        .cc-f3{animation:cc-fadeUp .6s .3s ease both;}
        .cc-f4{animation:cc-fadeUp .6s .45s ease both;}
        .cc-card:hover{box-shadow:0 10px 40px rgba(30,58,138,0.1);transform:translateY(-3px);}
        .cc-card{transition:all .3s ease;}
        .cc-skill-bar{height:4px;border-radius:99px;background:linear-gradient(90deg,#1d4ed8,#3b82f6);animation:cc-barFill 1.2s ease both;animation-delay:var(--d);}
        .cc-link:hover{color:#1d4ed8;}
        .cc-link{transition:color .2s ease;}
      `}</style>

      {/* Top bar */}
      <div className="h-1.5 w-full" style={{background:'linear-gradient(90deg,#1e3a8a,#2563eb,#3b82f6)'}} />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 text-white py-12 px-8 flex flex-col gap-8" style={{background:'linear-gradient(180deg,#1e3a8a 0%,#1e40af 60%,#1d4ed8 100%)'}}>
          {/* Avatar placeholder */}
          <div className="cc-f1">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-blue-800" style={{background:'rgba(255,255,255,0.15)',border:'3px solid rgba(255,255,255,0.3)'}}>
              {(data?.name||'?').charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-black text-center leading-tight mb-1">{data?.name||'Your Name'}</h1>
            <p className="text-blue-200 text-sm text-center font-medium">{data?.title||'Your Title'}</p>
          </div>

          {/* Contact in sidebar */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-blue-300 mb-4">Contact</h3>
            <div className="space-y-3">
              {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-start gap-3 text-sm text-blue-100 hover:text-white transition-colors"><Mail size={14} className="mt-0.5 flex-shrink-0"/><span className="break-all">{contact.email}</span></a>}
              {contact.phone&&<a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-blue-100 hover:text-white transition-colors"><Phone size={14} className="flex-shrink-0"/>{contact.phone}</a>}
              {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-blue-100 hover:text-white transition-colors"><Github size={14} className="flex-shrink-0"/>GitHub</a>}
              {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-blue-100 hover:text-white transition-colors"><Linkedin size={14} className="flex-shrink-0"/>LinkedIn</a>}
            </div>
          </div>

          {/* Skills in sidebar */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-blue-300 mb-4">Skills</h3>
            <div className="space-y-4">
              {skills.map((skill,i)=>(
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-blue-100">{skill}</span>
                  </div>
                  <div className="h-1 rounded-full w-full" style={{background:'rgba(255,255,255,0.1)'}}>
                    <div className="cc-skill-bar" style={{'--w':`${70+((i*17)%25)}%`,'--d':`${0.4+i*0.06}s`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education in sidebar */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-blue-300 mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((edu,i)=>(
                <div key={i}>
                  <p className="text-xs text-blue-300 mb-0.5">{edu.year}</p>
                  <p className="text-sm font-semibold text-white leading-tight">{edu.degree}</p>
                  <p className="text-xs text-blue-200">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <div className="px-10 py-12 border-b border-gray-100" style={{background:'linear-gradient(135deg,#f0f7ff,#ffffff)'}}>
            <p className="cc-f2 text-gray-600 max-w-2xl leading-relaxed text-base">{data?.bio||''}</p>
          </div>

          <div className="px-10 py-10">
            {/* Experience */}
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase size={20} className="text-blue-700" />
                <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">Work Experience</h2>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="space-y-8">
                {experience.map((exp,i)=>(
                  <div key={i} className="relative pl-6" style={{borderLeft:'2px solid #e5e7eb'}}>
                    <div className="absolute -left-2 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" style={{boxShadow:'0 0 0 2px #2563eb'}} />
                    <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full text-blue-700 bg-blue-50 border border-blue-100 flex-shrink-0">{exp.duration}</span>
                    </div>
                    <p className="text-blue-600 font-semibold text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-8">
                <Award size={20} className="text-blue-700" />
                <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">Projects</h2>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {projects.map((proj,i)=>(
                  <div key={i} className="cc-card rounded-xl p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2">{proj.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(proj.technologies||[]).map((t,j)=>(
                        <span key={j} className="px-2.5 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-100">{t}</span>
                      ))}
                    </div>
                    {proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="cc-link flex items-center gap-1 text-xs font-semibold text-gray-400"><ChevronRight size={14}/>View Project</a>}
                  </div>
                ))}
              </div>
            </section>

            {customSections.length>0&&(
              <section>
                <div className="space-y-8">
                  {customSections.map((sec,i)=>(
                    <div key={i} className="cc-card rounded-xl p-6 border border-gray-100">
                      {sec.title&&<h2 className="font-bold text-gray-900 text-lg mb-3">{sec.title}</h2>}
                      <p className="text-gray-500 text-sm leading-relaxed">{sec.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      <div className="h-1 w-full" style={{background:'linear-gradient(90deg,#1e3a8a,#2563eb,#3b82f6)'}} />
    </div>
  );
};

export default CleanCorporate;
