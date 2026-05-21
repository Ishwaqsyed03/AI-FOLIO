import React from 'react';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

const ArtisticPortfolio = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  const SWATCHES = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bce','#ff922b','#845ef7','#20c997'];

  return (
    <div className="min-h-screen bg-[#f0ebe3]" style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>
      <style>{`
        @keyframes ap-pop{0%{transform:scale(0) rotate(-10deg);opacity:0;}80%{transform:scale(1.05) rotate(1deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
        @keyframes ap-slideLeft{from{opacity:0;transform:translateX(-50px);}to{opacity:1;transform:translateX(0);}}
        @keyframes ap-fadeUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ap-float{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-10px) rotate(2deg);}66%{transform:translateY(-6px) rotate(-1deg);}}
        .ap-f1{animation:ap-pop .7s cubic-bezier(.34,1.56,.64,1) both;}
        .ap-f2{animation:ap-slideLeft .7s .1s ease both;}
        .ap-f3{animation:ap-fadeUp .7s .25s ease both;}
        .ap-f4{animation:ap-fadeUp .7s .4s ease both;}
        .ap-blob{animation:ap-float 6s ease-in-out infinite;}
        .ap-card:hover{transform:translateY(-6px) rotate(-0.5deg);box-shadow:6px 6px 0 rgba(0,0,0,0.12);}
        .ap-card{transition:all .3s cubic-bezier(.34,1.56,.64,1);}
        .ap-skill:hover{transform:scale(1.08) rotate(-1deg);}
        .ap-skill{transition:transform .2s cubic-bezier(.34,1.56,.64,1);}
        .ap-num{-webkit-text-stroke:2px currentColor;color:transparent;}
      `}</style>

      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
        <div className="ap-blob absolute w-72 h-72 rounded-full opacity-40" style={{background:'#ff6b6b',top:'-60px',right:'-60px',filter:'blur(40px)'}} />
        <div className="ap-blob absolute w-56 h-56 rounded-full opacity-30" style={{background:'#4d96ff',bottom:'-40px',left:'-40px',filter:'blur(40px)',animationDelay:'2s'}} />
        <div className="ap-blob absolute w-48 h-48 rounded-full opacity-25" style={{background:'#ffd93d',top:'50%',left:'60%',filter:'blur(50px)',animationDelay:'4s'}} />
      </div>

      <div className="relative" style={{zIndex:1}}>
        {/* Hero - big asymmetric layout */}
        <header className="min-h-screen flex flex-col justify-end px-8 md:px-20 py-20 relative overflow-hidden">
          {/* Big background number */}
          <div className="absolute top-12 right-8 text-[20rem] font-black leading-none select-none opacity-5 text-gray-900" style={{letterSpacing:'-0.05em'}}>01</div>

          <div className="max-w-6xl w-full">
            <div className="ap-f1 inline-block px-4 py-2 mb-8 text-sm font-bold tracking-widest uppercase text-white" style={{background:'#ff6b6b',transform:'rotate(-1deg)'}}>
              ✦ Creative Portfolio
            </div>
            <h1 className="ap-f2 font-black leading-none mb-6 text-gray-900" style={{fontSize:'clamp(4rem,10vw,9rem)',letterSpacing:'-0.05em'}}>
              {data?.name||'Your Name'}
            </h1>
            <div className="ap-f3 flex items-center gap-6 mb-8">
              <div className="w-24 h-3 rounded-full" style={{background:'linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77)'}} />
              <p className="text-2xl font-semibold text-gray-600">{data?.title||'Your Title'}</p>
            </div>
            <p className="ap-f4 text-lg text-gray-500 max-w-2xl leading-relaxed mb-10">{data?.bio||''}</p>
            <div className="ap-f4 flex flex-wrap gap-4">
              {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-2 px-6 py-3 font-bold text-sm text-white rounded-full" style={{background:'#ff6b6b'}}><Mail size={16}/>{contact.email}</a>}
              {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 font-bold text-sm border-2 border-gray-800 text-gray-800 rounded-full bg-transparent"><Github size={16}/>GitHub</a>}
              {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 font-bold text-sm border-2 border-gray-800 text-gray-800 rounded-full bg-transparent"><Linkedin size={16}/>LinkedIn</a>}
            </div>
          </div>
        </header>

        {/* Skills - colorful grid */}
        <section className="py-24 px-8 md:px-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[16rem] font-black opacity-[0.03] leading-none select-none text-gray-900">02</div>
          <div className="max-w-6xl mx-auto relative">
            <h2 className="text-5xl font-black text-gray-900 mb-14" style={{letterSpacing:'-0.03em'}}>
              What I<br/><span style={{WebkitTextStroke:'2px #ff6b6b',color:'transparent'}}>know</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {skills.map((skill,i)=>(
                <div key={i} className="ap-skill px-6 py-4 font-bold text-sm cursor-default" style={{background:SWATCHES[i%SWATCHES.length],color:'white',transform:`rotate(${(i%5-2)*0.8}deg)`,borderRadius:'4px'}}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-24 px-8 md:px-20 relative overflow-hidden" style={{background:'#f0ebe3'}}>
          <div className="absolute top-0 left-0 text-[16rem] font-black opacity-[0.04] leading-none select-none text-gray-900">03</div>
          <div className="max-w-6xl mx-auto relative">
            <h2 className="text-5xl font-black text-gray-900 mb-14" style={{letterSpacing:'-0.03em'}}>
              Where I<br/><span style={{WebkitTextStroke:'2px #4d96ff',color:'transparent'}}>worked</span>
            </h2>
            <div className="space-y-8">
              {experience.map((exp,i)=>(
                <div key={i} className="ap-card bg-white p-8" style={{borderLeft:`5px solid ${SWATCHES[i%SWATCHES.length]}`}}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{exp.role}</h3>
                      <p className="font-bold" style={{color:SWATCHES[i%SWATCHES.length]}}>{exp.company}</p>
                    </div>
                    <span className="px-4 py-2 font-bold text-xs text-white rounded-full flex-shrink-0" style={{background:SWATCHES[i%SWATCHES.length]}}>{exp.duration}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects - masonry-like */}
        <section className="py-24 px-8 md:px-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[16rem] font-black opacity-[0.03] leading-none select-none text-gray-900">04</div>
          <div className="max-w-6xl mx-auto relative">
            <h2 className="text-5xl font-black text-gray-900 mb-14" style={{letterSpacing:'-0.03em'}}>
              What I<br/><span style={{WebkitTextStroke:'2px #6bcb77',color:'transparent'}}>built</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((proj,i)=>(
                <div key={i} className="ap-card p-8" style={{background:i%2===0?'#f0ebe3':'white',border:`2px solid ${SWATCHES[(i+2)%SWATCHES.length]}`}}>
                  <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-xl" style={{background:SWATCHES[(i+2)%SWATCHES.length],transform:`rotate(${(i%3-1)*3}deg)`}}>{i+1}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{proj.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(proj.technologies||[]).map((t,j)=>(
                      <span key={j} className="px-3 py-1 text-xs font-bold text-white rounded" style={{background:SWATCHES[(i+j)%SWATCHES.length]}}>{t}</span>
                    ))}
                  </div>
                  {proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-sm" style={{color:SWATCHES[(i+2)%SWATCHES.length]}}><ExternalLink size={14}/>View</a>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-24 px-8 md:px-20" style={{background:'#f0ebe3'}}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-black text-gray-900 mb-14" style={{letterSpacing:'-0.03em'}}>Education</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu,i)=>(
                <div key={i} className="ap-card bg-white p-8" style={{borderTop:`5px solid ${SWATCHES[(i+4)%SWATCHES.length]}`}}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{color:SWATCHES[(i+4)%SWATCHES.length]}}>{edu.year}</p>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{edu.degree}</h3>
                  <p className="text-gray-500 font-medium">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {customSections.length>0&&(
          <section className="py-24 px-8 md:px-20 bg-white">
            <div className="max-w-6xl mx-auto space-y-8">
              {customSections.map((sec,i)=>(
                <div key={i} className="ap-card p-8" style={{border:`2px solid ${SWATCHES[i%SWATCHES.length]}`}}>
                  {sec.title&&<h2 className="text-2xl font-black text-gray-900 mb-4">{sec.title}</h2>}
                  <p className="text-gray-500 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="py-10 text-center text-sm font-bold bg-gray-900 text-gray-400">
          <span className="text-white">{data?.name}</span> · {contact.email}
        </footer>
      </div>
    </div>
  );
};

export default ArtisticPortfolio;
