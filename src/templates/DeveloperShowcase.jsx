import React from 'react';
import { Code, Terminal, GitBranch, Database } from 'lucide-react';

const DeveloperShowcase = ({ data }) => {
  return (
    <div className="bg-gray-950 text-green-400 min-h-screen font-mono">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Terminal Header */}
        <header className="bg-gray-900 rounded-lg border border-green-500/30 mb-12">
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 rounded-t-lg border-b border-green-500/30">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-sm text-gray-400">portfolio.sh</span>
          </div>
          <div className="p-8">
            <p className="text-gray-500 mb-2">$ cat developer.profile</p>
            <h1 className="text-4xl font-bold mb-2 text-green-400">{data.name}</h1>
            <p className="text-xl text-green-300 mb-4">Role: {data.title}</p>
            <p className="text-gray-300">{data.bio}</p>
            <p className="mt-4 text-gray-500">$ _</p>
          </div>
        </header>

        {/* Tech Stack */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">$ ls ./tech_stack/</h2>
          </div>
          <div className="bg-gray-900 rounded-lg border border-green-500/30 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-500" />
                  <span className="text-green-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Git Log - Experience */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">$ git log --experience</h2>
          </div>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-gray-900 rounded-lg border border-green-500/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="text-yellow-500 text-sm">commit {Math.random().toString(36).substr(2, 7)}</div>
                </div>
                <div className="mt-2 pl-4 border-l-2 border-green-500">
                  <h3 className="text-xl font-bold text-green-400">{exp.role}</h3>
                  <p className="text-green-300">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">Date: {exp.duration}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Repository */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">$ cat ./projects/README.md</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {data.projects.map((project, index) => (
              <div key={index} className="bg-gray-900 rounded-lg border border-green-500/30 p-6 hover:border-green-400 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-green-400">{project.name}</h3>
                </div>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-green-950 text-green-400 text-xs border border-green-500/30 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} className="text-green-500 hover:text-green-300 text-sm">
                    → View repository
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">$ cat ./education.json</h2>
          <div className="bg-gray-900 rounded-lg border border-green-500/30 p-6">
            <pre className="text-green-300">
              {JSON.stringify(data.education, null, 2)}
            </pre>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-6">$ ./contact.sh --show</h2>
          <div className="bg-gray-900 rounded-lg border border-green-500/30 p-6">
            <div className="space-y-2">
              {data.contact.email && <p className="text-green-300">📧 Email: {data.contact.email}</p>}
              {data.contact.github && <p className="text-green-300">🐙 GitHub: {data.contact.github}</p>}
              {data.contact.linkedin && <p className="text-green-300">💼 LinkedIn: {data.contact.linkedin}</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeveloperShowcase;
