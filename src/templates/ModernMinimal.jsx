import React from 'react';
import { Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';

// Minimal inline markdown parser (very lightweight, handles subset)
const renderMarkdown = (text='') => {
  if (!text) return null;
  let html = text
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
  html = html
    .replace(/```([\s\S]*?)```/g,(m,code)=>`<pre class="bg-gray-900 text-gray-100 text-xs p-3 rounded mb-3 overflow-x-auto"><code>${code.replace(/`/g,'&#96;')}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g,'<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\s*[-*] (.*)$/gm,'<li>$1</li>');
  // Wrap list items with <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, match => `<ul class="list-disc list-inside space-y-1 mb-3">${match}</ul>`);
  // Paragraphs
  html = html.split(/\n{2,}/).map(p=>`<p class="mb-3 leading-relaxed">${p}</p>`).join('');
  return <div dangerouslySetInnerHTML={{__html: html}} />;
};

const ModernMinimal = ({ data }) => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">{data.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{data.title}</p>
          <p className="text-gray-700 max-w-2xl">{data.bio}</p>
        </div>
      </header>

      {/* Contact */}
      <section className="py-8 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6">
          {data.contact.email && (
            <a href={`mailto:${data.contact.email}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Mail size={16} />
              <span className="text-sm">{data.contact.email}</span>
            </a>
          )}
          {data.contact.phone && (
            <a href={`tel:${data.contact.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Phone size={16} />
              <span className="text-sm">{data.contact.phone}</span>
            </a>
          )}
          {data.contact.linkedin && (
            <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Linkedin size={16} />
              <span className="text-sm">LinkedIn</span>
            </a>
          )}
          {data.contact.github && (
            <a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Github size={16} />
              <span className="text-sm">GitHub</span>
            </a>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{exp.role}</h3>
                <p className="text-gray-600 mb-2">{exp.company} • {exp.duration}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-700 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution} • {edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Sections */}
      {Array.isArray(data.customSections) && data.customSections.length > 0 && (
        <section className="py-12 px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {data.customSections.map((sec, idx)=>(
              <div key={idx} className="border-t border-gray-200 pt-8">
                {sec.title && <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>}
                <div className="prose prose-sm max-w-none">
                  {renderMarkdown(sec.content || '')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernMinimal;
