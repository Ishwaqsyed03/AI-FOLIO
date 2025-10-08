import React from 'react';
import { Cpu, Code2, Zap } from 'lucide-react';

const TechFuturistic = ({ data }) => {
  return (
    <div className="bg-black text-cyan-300 min-h-screen font-mono">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Futuristic Header */}
        <header className="mb-16 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          <div className="pt-8 flex items-start justify-between">
            <div>
              <h1 className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {data.name}
              </h1>
              <p className="text-2xl text-blue-400 mb-4 flex items-center gap-2">
                <Cpu className="w-6 h-6" />
                {data.title}
              </p>
              <p className="text-cyan-100 max-w-2xl leading-relaxed">{data.bio}</p>
            </div>
            <Zap className="w-16 h-16 text-yellow-400 animate-pulse" />
          </div>
        </header>

        {/* Tech Grid - Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="w-8 h-8" />
            TECH_STACK.EXE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/50 p-4 text-center hover:border-cyan-400 transition-all group">
                <span className="text-cyan-300 group-hover:text-cyan-100">[{skill}]</span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">{'>'} PROJECTS_DEPLOYED</h2>
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={index} className="border border-cyan-500/30 rounded-lg p-6 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-cyan-400">{project.name}</h3>
                  <span className="text-green-400">[ACTIVE]</span>
                </div>
                <p className="text-cyan-100 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-900/50 text-blue-300 text-sm border border-blue-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">{'>'} EXPERIENCE_LOG</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-cyan-500">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-500 rotate-45"></div>
                <h3 className="text-xl font-bold text-cyan-400">{exp.role}</h3>
                <p className="text-blue-400">{exp.company}</p>
                <p className="text-sm text-cyan-600 mb-2">{exp.duration}</p>
                <p className="text-cyan-100">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-3xl font-bold mb-6">{'>'} EDUCATION_DATA</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold text-cyan-400">{edu.degree}</h3>
              <p className="text-cyan-100">{edu.institution}</p>
              <p className="text-cyan-600">{edu.year}</p>
            </div>
          ))}
        </section>

        {/* Contact */}
        <section className="mt-16 text-center border-t-2 border-cyan-500 pt-8">
          <div className="flex justify-center gap-8">
            {data.contact.email && <span className="text-cyan-400">{data.contact.email}</span>}
            {data.contact.github && <span className="text-blue-400">{data.contact.github}</span>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TechFuturistic;
