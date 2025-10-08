import React from 'react';

const renderMarkdown = (text='') => {
  if (!text) return null; let html=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  html=html
    .replace(/```([\s\S]*?)```/g,(m,code)=>`<pre class=\"bg-purple-900/60 text-white text-xs p-3 rounded mb-3 overflow-x-auto\"><code>${code.replace(/`/g,'&#96;')}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code class=\"bg-fuchsia-200/60 px-1 rounded text-xs\">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g,'<a href=\"$2\" class=\"underline text-fuchsia-600\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>')
    .replace(/^\s*[-*] (.*)$/gm,'<li>$1</li>');
  html=html.replace(/(<li>.*<\/li>)/gs, m=>`<ul class=\"list-disc list-inside space-y-1 mb-3\">${m}</ul>`);
  html=html.split(/\n{2,}/).map(p=>`<p class=\"mb-3 leading-relaxed\">${p}</p>`).join('');
  return <div dangerouslySetInnerHTML={{__html: html}} />;
};
import { Smile, Heart, Star } from 'lucide-react';

const DesignerCreative = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 min-h-screen">
      {/* Creative Hero */}
      <section className="relative py-24 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-fuchsia-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Smile className="w-20 h-20 mx-auto mb-6 text-fuchsia-600" />
          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {data.name}
          </h1>
          <p className="text-3xl font-bold text-purple-700 mb-6">{data.title}</p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">{data.bio}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 pb-16">
        {/* Design Skills */}
        <section className="mb-20">
          <h2 className="text-5xl font-black text-center mb-12 text-purple-900">Design Arsenal</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {data.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform"
              >
                <Star className="w-8 h-8 mx-auto mb-3 text-fuchsia-500" />
                <h3 className="text-lg font-bold text-purple-900">{skill}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="mb-20">
          <h2 className="text-5xl font-black text-center mb-12 text-purple-900 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-fuchsia-500" />
            Portfolio Pieces
          </h2>
          <div className="space-y-12">
            {data.projects.map((project, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 bg-gradient-to-br from-fuchsia-200 to-purple-200 rounded-3xl aspect-video shadow-2xl flex items-center justify-center">
                  <div className="text-white text-4xl font-black opacity-50">{project.name}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black mb-4 text-purple-900">{project.name}</h3>
                  <p className="text-gray-700 text-lg mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white rounded-full font-medium shadow-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Journey */}
        <section className="mb-20">
          <h2 className="text-5xl font-black text-center mb-12 text-purple-900">My Design Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-500 via-purple-500 to-indigo-500 transform -translate-x-1/2"></div>
            <div className="space-y-12">
              {data.experience.map((exp, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white rounded-3xl p-8 shadow-xl inline-block">
                      <h3 className="text-2xl font-black text-purple-900 mb-2">{exp.role}</h3>
                      <p className="text-xl font-bold text-fuchsia-600 mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-600 mb-3">{exp.duration}</p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-fuchsia-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-20">
          <h2 className="text-5xl font-black text-center mb-12 text-purple-900">Education</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl text-center">
                <h3 className="text-2xl font-black mb-2">{edu.degree}</h3>
                <p className="text-xl mb-2">{edu.institution}</p>
                <p className="text-lg opacity-90">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white rounded-3xl p-16 shadow-2xl">
          <h2 className="text-5xl font-black mb-6">Let's Create Magic Together!</h2>
          <p className="text-xl mb-8">Ready to bring your ideas to life?</p>
          <div className="flex flex-wrap justify-center gap-6 text-lg font-bold">
            {data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                📧 {data.contact.email}
              </a>
            )}
          </div>
        </section>

        {/* Custom Sections */}
        {Array.isArray(data.customSections) && data.customSections.length>0 && (
          <section className="mt-20">
            <h2 className="text-5xl font-black text-center mb-12 text-purple-900">More Magic</h2>
            <div className="space-y-16">
              {data.customSections.map((sec,i)=>(
                <div key={i} className="bg-white rounded-3xl p-10 shadow-xl">
                  {sec.title && <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{sec.title}</h3>}
                  <div className="prose max-w-none">{renderMarkdown(sec.content||'')}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DesignerCreative;
