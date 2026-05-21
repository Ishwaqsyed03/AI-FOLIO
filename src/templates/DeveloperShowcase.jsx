import React from 'react';
import { Mail, Github, Linkedin, Terminal, GitBranch, Code2, FolderOpen, ChevronRight, Circle } from 'lucide-react';

const DeveloperShowcase = ({ data }) => {
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const contact = data?.contact || {};
  const customSections = data?.customSections || [];

  return (
    <div className="min-h-screen" style={{background:'#1e1e1e',color:'#d4d4d4',fontFamily:"'Fira Code','Courier New',monospace"}}>
      <style>{`
        @keyframes ds-typewriter{from{width:0;}to{width:100%;}}
        @keyframes ds-blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes ds-fadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes ds-glow{0%,100%{box-shadow:none;}50%{box-shadow:0 0 20px rgba(86,156,214,0.3);}}
        .ds-f1{animation:ds-fadeIn .6s ease both;}
        .ds-f2{animation:ds-fadeIn .6s .15s ease both;}
        .ds-f3{animation:ds-fadeIn .6s .3s ease both;}
        .ds-cursor{animation:ds-blink 1s step-end infinite;}
        .ds-card:hover{background:#252526 !important;border-color:#569cd6 !important;transform:translateX(4px);}
        .ds-card{transition:all .25s ease;}
        .ds-file:hover{background:rgba(86,156,214,0.08);}
        .ds-file{transition:background .2s ease;}
        .ds-tag{transition:all .2s ease;}
        .ds-tag:hover{background:rgba(86,156,214,0.2);color:#9cdcfe;}
      `}</style>

      {/* Title bar */}
      <div className="flex items-center gap-3 px-6 py-3" style={{background:'#3c3c3c',borderBottom:'1px solid #2d2d2d'}}>
        <Circle size={12} style={{fill:'#ff5f57',color:'#ff5f57'}} />
        <Circle size={12} style={{fill:'#febc2e',color:'#febc2e'}} />
        <Circle size={12} style={{fill:'#28c840',color:'#28c840'}} />
        <span className="ml-4 text-xs text-gray-500">{(data?.name||'portfolio').toLowerCase().replace(/\s+/g,'-')}.tsx — VSCode</span>
      </div>

      <div className="flex min-h-screen">
        {/* File explorer sidebar */}
        <aside className="w-60 flex-shrink-0 border-r text-sm" style={{background:'#252526',borderColor:'#2d2d2d'}}>
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">Explorer</div>
          <div className="px-2">
            <div className="ds-file flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer text-gray-300">
              <FolderOpen size={14} style={{color:'#e8ab53'}} />
              <span className="font-semibold">{(data?.name||'portfolio').split(' ')[0].toLowerCase()}-portfolio</span>
            </div>
            {['hero.tsx','skills.ts','experience.ts','projects.ts','education.ts','contact.ts'].map((f,i)=>(
              <div key={i} className="ds-file flex items-center gap-2 px-4 py-1.5 text-xs cursor-pointer" style={{color:i===0?'#ce9178':i===1?'#9cdcfe':i===2?'#4ec9b0':i===3?'#dcdcaa':'#d4d4d4'}}>
                <Code2 size={12} />
                {f}
              </div>
            ))}
          </div>

          {/* Git status */}
          <div className="mt-6 px-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <GitBranch size={12}/>
              <span>main</span>
            </div>
            <div className="text-xs text-green-400">✓ Clean working tree</div>
          </div>
        </aside>

        {/* Main editor */}
        <main className="flex-1 overflow-hidden">
          {/* Tab bar */}
          <div className="flex" style={{background:'#2d2d2d',borderBottom:'1px solid #252526'}}>
            <div className="flex items-center gap-2 px-4 py-2 text-xs border-t-2" style={{borderTopColor:'#569cd6',background:'#1e1e1e',color:'#d4d4d4'}}>
              <Code2 size={12} style={{color:'#569cd6'}} />
              portfolio.tsx
            </div>
          </div>

          {/* Code editor content */}
          <div className="p-8 overflow-auto">
            {/* Hero as a code comment */}
            <div className="ds-f1 mb-12">
              <div className="text-xs mb-4" style={{color:'#608b4e'}}>
                {'/**'}<br/>
                {' * @author '}<span style={{color:'#9cdcfe'}}>{data?.name||'Your Name'}</span><br/>
                {' * @role '}<span style={{color:'#ce9178'}}>{data?.title||'Your Title'}</span><br/>
                {' */'}<br/>
              </div>
              <div>
                <span style={{color:'#569cd6'}}>const </span>
                <span style={{color:'#9cdcfe'}}>developer</span>
                <span style={{color:'#d4d4d4'}}> = </span>
                <span style={{color:'#d4d4d4'}}>{'{'}</span>
              </div>
              <div className="pl-8 my-2">
                <span style={{color:'#9cdcfe'}}>name</span><span>: </span><span style={{color:'#ce9178'}}>"{data?.name||'Your Name'}"</span>,
              </div>
              <div className="pl-8 my-2">
                <span style={{color:'#9cdcfe'}}>title</span><span>: </span><span style={{color:'#ce9178'}}>"{data?.title||'Your Title'}"</span>,
              </div>
              <div className="pl-8 my-2">
                <span style={{color:'#9cdcfe'}}>bio</span><span>: </span><span style={{color:'#ce9178'}}>"{(data?.bio||'').substring(0,80)}{data?.bio?.length>80?'...':''}"</span>,
              </div>
              <div className="pl-8 my-2">
                <span style={{color:'#9cdcfe'}}>skills</span><span>: [</span>
                {skills.slice(0,4).map((s,i)=><span key={i} style={{color:'#ce9178'}}>"{s}"{i<Math.min(3,skills.length-1)?', ':''}</span>)}
                {skills.length>4&&<span style={{color:'#608b4e'}}>{' /* +'+( skills.length-4)+' more */'}</span>}
                <span>],</span>
              </div>
              <div><span>{'}'}</span><span style={{color:'#608b4e'}}> // ready to ship</span><span className="ds-cursor" style={{color:'#569cd6'}}>|</span></div>

              {/* Contact links */}
              <div className="mt-6 flex flex-wrap gap-4">
                {contact.email&&<a href={`mailto:${contact.email}`} className="flex items-center gap-2 px-4 py-2 text-xs rounded" style={{background:'rgba(86,156,214,0.15)',border:'1px solid rgba(86,156,214,0.4)',color:'#9cdcfe'}}><Mail size={13}/>{contact.email}</a>}
                {contact.github&&<a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-xs rounded text-gray-400 hover:text-gray-200" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)'}}><Github size={13}/>GitHub</a>}
                {contact.linkedin&&<a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-xs rounded text-gray-400 hover:text-gray-200" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)'}}><Linkedin size={13}/>LinkedIn</a>}
              </div>
            </div>

            {/* Skills section */}
            <div className="ds-f2 mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Terminal size={16} style={{color:'#dcdcaa'}} />
                <span className="text-sm font-bold" style={{color:'#dcdcaa'}}>// SKILLS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {skills.map((skill,i)=>(
                  <div key={i} className="ds-tag px-3 py-2 rounded text-xs cursor-default text-center" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#4ec9b0'}}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="ds-f3 mb-12">
              <div className="flex items-center gap-2 mb-6">
                <GitBranch size={16} style={{color:'#dcdcaa'}} />
                <span className="text-sm font-bold" style={{color:'#dcdcaa'}}>// EXPERIENCE</span>
              </div>
              <div className="space-y-4">
                {experience.map((exp,i)=>(
                  <div key={i} className="ds-card rounded p-6" style={{background:'#252526',border:'1px solid #2d2d2d'}}>
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <ChevronRight size={14} style={{color:'#569cd6'}} />
                        <span className="font-bold text-sm" style={{color:'#9cdcfe'}}>{exp.role}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded" style={{background:'rgba(78,201,176,0.1)',color:'#4ec9b0',border:'1px solid rgba(78,201,176,0.2)'}}>{exp.duration}</span>
                    </div>
                    <p className="text-xs mb-2 pl-5" style={{color:'#ce9178'}}>{exp.company}</p>
                    <p className="text-xs leading-relaxed pl-5 text-gray-500">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <FolderOpen size={16} style={{color:'#dcdcaa'}} />
                <span className="text-sm font-bold" style={{color:'#dcdcaa'}}>// PROJECTS</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((proj,i)=>(
                  <div key={i} className="ds-card rounded p-6" style={{background:'#252526',border:'1px solid #2d2d2d'}}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs" style={{color:'#608b4e'}}>// {String(i+1).padStart(2,'0')}</span>
                    </div>
                    <h3 className="font-bold mb-2 text-sm" style={{color:'#dcdcaa'}}>{proj.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.technologies||[]).map((t,j)=>(
                        <span key={j} className="ds-tag px-2.5 py-1 text-xs rounded" style={{background:'rgba(86,156,214,0.1)',color:'#9cdcfe',border:'1px solid rgba(86,156,214,0.15)'}}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Code2 size={16} style={{color:'#dcdcaa'}} />
                <span className="text-sm font-bold" style={{color:'#dcdcaa'}}>// EDUCATION</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {education.map((edu,i)=>(
                  <div key={i} className="ds-card rounded p-5" style={{background:'#252526',border:'1px solid #2d2d2d'}}>
                    <p className="text-xs mb-1" style={{color:'#608b4e'}}>/* {edu.year} */</p>
                    <h3 className="font-bold text-sm mb-1" style={{color:'#9cdcfe'}}>{edu.degree}</h3>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            {customSections.length>0&&(
              <div>
                {customSections.map((sec,i)=>(
                  <div key={i} className="ds-card rounded p-6 mb-4" style={{background:'#252526',border:'1px solid #2d2d2d'}}>
                    {sec.title&&<h2 className="font-bold text-sm mb-3" style={{color:'#dcdcaa'}}>// {sec.title}</h2>}
                    <p className="text-xs text-gray-500 leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 text-xs" style={{background:'#007acc',color:'white'}}>
        <GitBranch size={12}/><span>main</span>
        <span className="ml-auto">{data?.name} · TypeScript · UTF-8</span>
      </div>
    </div>
  );
};

export default DeveloperShowcase;
