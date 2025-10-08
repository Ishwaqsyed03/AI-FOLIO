import React from 'react';

const renderMarkdown = (text='') => {
  if (!text) return null; let html=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  html=html
    .replace(/```([\s\S]*?)```/g,(m,code)=>`<pre class=\"bg-black text-gray-100 text-xs p-3 rounded mb-3 overflow-x-auto\"><code>${code.replace(/`/g,'&#96;')}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code class=\"bg-gray-800 px-1 rounded text-xs\">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g,'<a href=\"$2\" class=\"text-cyan-400 underline\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>')
    .replace(/^\s*[-*] (.*)$/gm,'<li>$1</li>');
  html=html.replace(/(<li>.*<\/li>)/gs, m=>`<ul class=\"list-disc list-inside space-y-1 mb-3\">${m}</ul>`);
  html=html.split(/\n{2,}/).map(p=>`<p class=\"mb-3 leading-relaxed\">${p}</p>`).join('');
  return <div dangerouslySetInnerHTML={{__html: html}} />;
};
import { Mail, Github, Linkedin, Terminal } from 'lucide-react';

const ProfessionalDark = ({ data }) => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {data.name}
              </h1>
              <p className="text-2xl text-gray-300 mb-4">{data.title}</p>
              <p className="text-gray-400 max-w-2xl">{data.bio}</p>
            </div>
            <Terminal className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="flex gap-4 mt-6">
            {data.contact.email && <a href={`mailto:${data.contact.email}`} className="text-cyan-400 hover:text-cyan-300"><Mail /></a>}
            {data.contact.github && <a href={`https://${data.contact.github}`} className="text-cyan-400 hover:text-cyan-300"><Github /></a>}
            {data.contact.linkedin && <a href={`https://${data.contact.linkedin}`} className="text-cyan-400 hover:text-cyan-300"><Linkedin /></a>}
          </div>
        </header>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">$ skills --list</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center hover:border-cyan-400 transition-colors">
                <span className="text-gray-200">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">$ experience --show</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-8 border-l-4 border-cyan-400 pl-6 py-2">
              <h3 className="text-xl font-bold text-gray-100">{exp.role}</h3>
              <p className="text-cyan-400">{exp.company}</p>
              <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
              <p className="text-gray-400">{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">$ projects --featured</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.projects.map((project, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-cyan-400 transition-all">
                <h3 className="text-xl font-bold mb-2 text-gray-100">{project.name}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-900 text-cyan-400 text-xs rounded border border-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">$ education --list</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-100">{edu.degree}</h3>
              <p className="text-gray-300">{edu.institution}</p>
              <p className="text-gray-500">{edu.year}</p>
            </div>
          ))}
        </section>

        {Array.isArray(data.customSections) && data.customSections.length>0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">$ extra --sections</h2>
            {data.customSections.map((sec,i)=>(
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                {sec.title && <h3 className="text-2xl font-bold text-gray-100 mb-3">{sec.title}</h3>}
                <div className="prose prose-invert prose-sm max-w-none">{renderMarkdown(sec.content||'')}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDark;
