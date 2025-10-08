import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

const ArtisticPortfolio = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 min-h-screen">
      {/* Artistic Header */}
      <header className="relative py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Palette className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {data.name}
          </h1>
          <p className="text-3xl text-purple-700 mb-6">{data.title}</p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">{data.bio}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 pb-16">
        {/* Skills Cloud */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-purple-900">Creative Skills</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full text-lg font-medium text-purple-900 shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  transform: `rotate(${Math.random() * 4 - 2}deg)`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Featured Works */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-purple-900 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            Featured Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.projects.map((project, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                style={{
                  transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                }}
              >
                <h3 className="text-2xl font-bold mb-3 text-purple-900">{project.name}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-200 text-purple-800 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-purple-900">My Journey</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-900">{exp.role}</h3>
                <p className="text-xl text-pink-600 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-3">{exp.duration}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-10 text-purple-900">Learning Path</h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
                <h3 className="text-2xl font-bold text-purple-900">{edu.degree}</h3>
                <p className="text-lg text-pink-600">{edu.institution}</p>
                <p className="text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 text-center bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 text-purple-900">Let's Create Together</h2>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {data.contact.email && <a href={`mailto:${data.contact.email}`} className="text-purple-600 hover:text-purple-800">{data.contact.email}</a>}
            {data.contact.phone && <span className="text-gray-700">{data.contact.phone}</span>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtisticPortfolio;
