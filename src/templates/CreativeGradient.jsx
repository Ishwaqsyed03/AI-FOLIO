import React from 'react';

const renderMarkdown = (text='') => {
  if (!text) return null;
  let html = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  html = html
    .replace(/```([\s\S]*?)```/g,(m,code)=>`<pre class=\"bg-black/40 text-white text-xs p-3 rounded mb-3 overflow-x-auto\"><code>${code.replace(/`/g,'&#96;')}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code class=\"bg-white/20 px-1 rounded text-sm\">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g,'<a href=\"$2\" class=\"underline text-yellow-300\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>')
    .replace(/^\s*[-*] (.*)$/gm,'<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, match => `<ul class=\"list-disc list-inside space-y-1 mb-3\">${match}</ul>`);
  html = html.split(/\n{2,}/).map(p=>`<p class=\"mb-3 leading-relaxed\">${p}</p>`).join('');
  return <div dangerouslySetInnerHTML={{__html: html}} />;
};
import { Mail, Phone, Linkedin, Github, ExternalLink } from 'lucide-react';

const CreativeGradient = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
            ✨ Portfolio
          </div>
          <h1 className="text-6xl font-bold mb-4">{data.name}</h1>
          <p className="text-2xl mb-6 text-white/90">{data.title}</p>
          <p className="text-lg max-w-2xl mx-auto text-white/80">{data.bio}</p>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="py-6 px-8 bg-white/10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
          {data.contact.email && (
            <a href={`mailto:${data.contact.email}`} className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <Mail size={18} />
              <span>{data.contact.email}</span>
            </a>
          )}
          {data.contact.linkedin && (
            <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
          )}
          {data.contact.github && (
            <a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
              <Github size={18} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Skills & Expertise</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 px-8 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.projects.map((project, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all">
                <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                <p className="text-white/90 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/20 text-sm rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-yellow-300 hover:text-yellow-200">
                    View Project <ExternalLink size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-center">Work Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                <p className="text-xl text-white/80 mb-3">{exp.company}</p>
                <p className="text-white/70 mb-4">{exp.duration}</p>
                <p className="text-white/90">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 px-8 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-center">Education</h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
                <p className="text-xl text-white/80">{edu.institution}</p>
                <p className="text-white/70 mt-2">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {Array.isArray(data.customSections) && data.customSections.length > 0 && (
        <section className="py-16 px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            {data.customSections.map((sec, idx)=>(
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                {sec.title && <h2 className="text-3xl font-bold mb-4">{sec.title}</h2>}
                <div className="prose prose-invert prose-sm max-w-none">{renderMarkdown(sec.content || '')}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CreativeGradient;
