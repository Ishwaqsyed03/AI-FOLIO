import React from 'react';

const ElegantClassic = ({ data }) => {
  return (
    <div className="bg-amber-50 text-gray-900 min-h-screen font-serif">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16 border-b-2 border-amber-800 pb-12">
          <h1 className="text-5xl font-bold mb-3 text-amber-900">{data.name}</h1>
          <p className="text-2xl italic text-amber-700 mb-6">{data.title}</p>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-700">{data.bio}</p>
        </header>

        {/* Contact */}
        <section className="text-center mb-16">
          <div className="flex justify-center gap-8 text-sm">
            {data.contact.email && <span className="text-amber-800">{data.contact.email}</span>}
            {data.contact.phone && <span className="text-amber-800">{data.contact.phone}</span>}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-amber-900">Expertise</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-5 py-2 border-2 border-amber-800 text-amber-900 rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-amber-900">Professional Experience</h2>
          <div className="space-y-10">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-amber-800 pl-6">
                <h3 className="text-2xl font-bold text-amber-900">{exp.role}</h3>
                <p className="text-xl italic text-amber-700 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-3">{exp.duration}</p>
                <p className="leading-relaxed text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-amber-900">Selected Works</h2>
          <div className="space-y-8">
            {data.projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-amber-200">
                <h3 className="text-2xl font-bold mb-2 text-amber-900">{project.name}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-amber-900">Education</h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl font-bold text-amber-900">{edu.degree}</h3>
                <p className="text-xl italic text-amber-700">{edu.institution}</p>
                <p className="text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ElegantClassic;
