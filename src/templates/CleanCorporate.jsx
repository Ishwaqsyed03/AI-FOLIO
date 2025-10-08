import React from 'react';
import { Briefcase, GraduationCap, Mail, Phone } from 'lucide-react';

const CleanCorporate = ({ data }) => {
  return (
    <div className="bg-blue-50 text-gray-900 min-h-screen">
      {/* Header Bar */}
      <div className="bg-blue-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{data.name}</h1>
            <p className="text-xl text-blue-200">{data.title}</p>
          </div>
          <div className="text-right text-sm">
            {data.contact.email && <div className="flex items-center gap-2 justify-end"><Mail size={16} /> {data.contact.email}</div>}
            {data.contact.phone && <div className="flex items-center gap-2 justify-end mt-1"><Phone size={16} /> {data.contact.phone}</div>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Professional Summary */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.bio}</p>
        </section>

        {/* Core Competencies */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Core Competencies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Professional Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-lg text-blue-700">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">{exp.duration}</span>
                </div>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Projects */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Key Projects</h2>
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CleanCorporate;
