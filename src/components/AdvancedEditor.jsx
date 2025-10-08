import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Layers } from 'lucide-react';

// Utility list editors
const ListEditor = ({ label, items, onChange, placeholder = 'Add item', max = 50 }) => {
  const [value, setValue] = useState('');
  const add = () => {
    if (!value.trim()) return; if (items.length >= max) return; onChange([...items, value.trim()]); setValue('');
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="mb-4">
      <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">{label}</label>
      <div className="flex gap-2 mt-1">
        <input value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder={placeholder} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
        <button type="button" onClick={add} className="bg-purple-600 hover:bg-purple-500 text-white px-3 rounded text-sm"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((it,i)=>(
          <span key={i} className="bg-purple-600/30 text-purple-200 text-xs px-2 py-1 rounded flex items-center gap-1">
            {it}
            <button type="button" onClick={()=>remove(i)} className="hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
    </div>
  );
};

const SectionBlock = ({ section, index, updateSection, removeSection }) => {
  const updateField = (k,v)=> updateSection(index,{...section,[k]:v});
  return (
    <div className="border border-white/10 rounded-lg p-3 bg-white/5 backdrop-blur-sm relative">
      <button type="button" onClick={()=>removeSection(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
      <input value={section.title} onChange={e=>updateField('title', e.target.value)} placeholder="Section Title" className="w-full mb-2 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" />
      <textarea value={section.content} onChange={e=>updateField('content', e.target.value)} rows={4} placeholder="Content (Markdown supported)" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-mono" />
    </div>
  );
};

const AdvancedEditor = ({ data, onChange }) => {
  const [local, setLocal] = useState(()=>({
    ...data,
    customSections: data.customSections || []
  }));
  const commit = () => onChange(local);
  const update = (k,v)=> setLocal(prev=>({...prev,[k]:v}));

  const updateNestedList = (key, list)=> update(key, list);
  const addSection = () => update('customSections',[...local.customSections,{title:'New Section',content:''}]);
  const updateSection = (i,val)=> update('customSections', local.customSections.map((s,idx)=>idx===i?val:s));
  const removeSection = (i)=> update('customSections', local.customSections.filter((_,idx)=>idx!==i));

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Layers className="w-5 h-5" /> Advanced Editor</h3>
        <button onClick={commit} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"><Save className="w-4 h-4" /> Save Changes</button>
      </div>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Name</label>
          <input value={local.name} onChange={e=>update('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 mt-1" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Title</label>
            <input value={local.title} onChange={e=>update('title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 mt-1" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Bio</label>
          <textarea rows={3} value={local.bio} onChange={e=>update('bio', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 mt-1" />
        </div>
      </div>

      {/* Contact */}
      <div className="grid md:grid-cols-3 gap-4">
        {['email','phone','linkedin','github'].map(field=>(
          <div key={field}>
            <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">{field}</label>
            <input value={local.contact?.[field]||''} onChange={e=>update('contact',{...local.contact,[field]:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 mt-1" />
          </div>
        ))}
      </div>

      <ListEditor label="Skills" items={local.skills||[]} onChange={l=>updateNestedList('skills', l)} />

      {/* Projects */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Projects</label>
          <button onClick={()=>update('projects',[...(local.projects||[]),{name:'New Project',description:'',technologies:[],link:''}])} className="text-xs bg-purple-600/40 hover:bg-purple-600/60 text-purple-100 px-2 py-1 rounded flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="space-y-3">
          {(local.projects||[]).map((p,i)=>(
            <div key={i} className="border border-white/10 rounded-lg p-3 bg-white/5">
              <div className="flex gap-2 mb-2">
                <input value={p.name} onChange={e=>update('projects', local.projects.map((x,idx)=>idx===i?{...x,name:e.target.value}:x))} placeholder="Name" className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" />
                <input value={p.link||''} onChange={e=>update('projects', local.projects.map((x,idx)=>idx===i?{...x,link:e.target.value}:x))} placeholder="Link" className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" />
                <button onClick={()=>update('projects', local.projects.filter((_,idx)=>idx!==i))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
              </div>
              <textarea rows={2} value={p.description} onChange={e=>update('projects', local.projects.map((x,idx)=>idx===i?{...x,description:e.target.value}:x))} placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm mb-2" />
              <ListEditor label="Technologies" items={p.technologies||[]} onChange={l=>update('projects', local.projects.map((x,idx)=>idx===i?{...x,technologies:l}:x))} placeholder="Add tech" />
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Experience</label>
          <button onClick={()=>update('experience',[...(local.experience||[]),{role:'Role',company:'Company',duration:'YYYY - YYYY',description:''}])} className="text-xs bg-purple-600/40 hover:bg-purple-600/60 text-purple-100 px-2 py-1 rounded flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="space-y-3">
          {(local.experience||[]).map((e,i)=>(
            <div key={i} className="border border-white/10 rounded-lg p-3 bg-white/5 grid md:grid-cols-5 gap-2">
              <input value={e.role} onChange={ev=>update('experience', local.experience.map((x,idx)=>idx===i?{...x,role:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" placeholder="Role" />
              <input value={e.company} onChange={ev=>update('experience', local.experience.map((x,idx)=>idx===i?{...x,company:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" placeholder="Company" />
              <input value={e.duration} onChange={ev=>update('experience', local.experience.map((x,idx)=>idx===i?{...x,duration:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" placeholder="Duration" />
              <textarea value={e.description} onChange={ev=>update('experience', local.experience.map((x,idx)=>idx===i?{...x,description:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm md:col-span-2" rows={2} placeholder="Description" />
              <button onClick={()=>update('experience', local.experience.filter((_,idx)=>idx!==i))} className="text-red-400 hover:text-red-300 md:col-span-5 flex items-center gap-1 text-xs mt-1"><Trash2 className="w-3 h-3" /> Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Education</label>
          <button onClick={()=>update('education',[...(local.education||[]),{degree:'Degree',institution:'Institution',year:'Year'}])} className="text-xs bg-purple-600/40 hover:bg-purple-600/60 text-purple-100 px-2 py-1 rounded flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="space-y-3">
          {(local.education||[]).map((ed,i)=>(
            <div key={i} className="border border-white/10 rounded-lg p-3 bg-white/5 grid md:grid-cols-4 gap-2">
              <input value={ed.degree} onChange={ev=>update('education', local.education.map((x,idx)=>idx===i?{...x,degree:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" placeholder="Degree" />
              <input value={ed.institution} onChange={ev=>update('education', local.education.map((x,idx)=>idx===i?{...x,institution:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" placeholder="Institution" />
              <input value={ed.year} onChange={ev=>update('education', local.education.map((x,idx)=>idx===i?{...x,year:ev.target.value}:x))} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" placeholder="Year" />
              <button onClick={()=>update('education', local.education.filter((_,idx)=>idx!==i))} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Sections */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-purple-300 font-medium">Custom Sections</label>
          <button onClick={addSection} className="text-xs bg-purple-600/40 hover:bg-purple-600/60 text-purple-100 px-2 py-1 rounded flex items-center gap-1"><Plus className="w-3 h-3" /> Add Section</button>
        </div>
        <div className="space-y-3">
          {local.customSections.map((s,i)=>(
            <SectionBlock key={i} section={s} index={i} updateSection={updateSection} removeSection={removeSection} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedEditor;