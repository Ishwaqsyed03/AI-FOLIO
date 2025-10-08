import React from 'react';

const BoldColorful = ({ data }) => {
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'];
  
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black mb-4">{data.name}</h1>
          <p className="text-3xl font-bold mb-6">{data.title}</p>
          <p className="text-xl">{data.bio}</p>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 px-8">
        <h2 className="text-4xl font-black text-center mb-12">SKILLS</h2>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
          {data.skills.map((skill, index) => (
            <span key={index} className={`${colors[index % colors.length]} text-white px-6 py-3 text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 transition-transform`}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 px-8 bg-gray-50">
        <h2 className="text-4xl font-black text-center mb-12">PROJECTS</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {data.projects.map((project, index) => (
            <div key={index} className={`${colors[index % colors.length]} text-white rounded-2xl p-8 shadow-xl`}>
              <h3 className="text-2xl font-black mb-3">{project.name}</h3>
              <p className="mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-white/30 rounded-lg text-sm font-bold">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 px-8">
        <h2 className="text-4xl font-black text-center mb-12">EXPERIENCE</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {data.experience.map((exp, index) => (
            <div key={index} className="border-l-8 border-yellow-500 pl-8 py-4">
              <h3 className="text-2xl font-black">{exp.role}</h3>
              <p className="text-xl font-bold text-blue-600">{exp.company}</p>
              <p className="text-gray-600 font-bold">{exp.duration}</p>
              <p className="mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
        <h2 className="text-4xl font-black mb-8">GET IN TOUCH</h2>
        <div className="flex flex-wrap justify-center gap-6 text-lg font-bold">
          {data.contact.email && <a href={`mailto:${data.contact.email}`} className="hover:underline">{data.contact.email}</a>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
        </div>
      </section>
    </div>
  );
};

export default BoldColorful;
