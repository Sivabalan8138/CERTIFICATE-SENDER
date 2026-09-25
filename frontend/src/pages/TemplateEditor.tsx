import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import { Settings, Save, ArrowLeft, Upload, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateField {
  id: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  align: 'left' | 'center' | 'right';
  transform: 'none' | 'uppercase' | 'lowercase';
  excelColumn: string;
}

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<string | null>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const availableFields = [
    'Name', 'Event Name', 'Date', 'Venue', 'Department', 'Year', 'Certificate Type', 'College Name'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addField = (fieldName: string) => {
    const newField: TemplateField = {
      id: Math.random().toString(36).substr(2, 9),
      name: fieldName,
      x: 50,
      y: 50,
      width: 300,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      align: 'center',
      transform: 'none',
      excelColumn: fieldName
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const updateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedField === id) setSelectedField(null);
  };

  const handleSave = () => {
    if (template) {
      try {
        localStorage.setItem(`template_${id}`, template);
        localStorage.setItem(`fields_${id}`, JSON.stringify(fields));
      } catch (e) {
        console.error(e);
        toast.error('Image too large. Try a smaller template for testing.');
      }
    }
    toast.success('Template saved successfully!');
    navigate(`/events/${id}/participants`);
  };

  const activeField = fields.find(f => f.id === selectedField);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/events')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Template Editor</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2 bg-brand-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <Save className="w-4 h-4 mr-2" /> Save Template
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Sidebar - Available Fields */}
        <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col overflow-y-auto">
          <h3 className="font-semibold text-slate-300 mb-4">FIELDS</h3>
          <div className="space-y-2">
            {availableFields.map(field => (
              <button
                key={field}
                onClick={() => addField(field)}
                className="w-full text-left px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                + {field}
              </button>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center overflow-auto relative">
          {!template ? (
            <div className="text-center">
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-600 transition-colors">
                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                <span className="font-medium">Upload Certificate Template</span>
                <span className="text-sm text-slate-400 mt-1">PNG, JPG, PDF (1st page)</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div 
              ref={editorRef}
              className="relative shadow-2xl bg-white shrink-0"
              style={{ width: '800px', height: '566px' }} // Strict dimensions to ensure precise coordinate mapping
            >
              <img src={template} alt="Template" className="w-full h-full object-contain absolute inset-0 pointer-events-none" />
              
              {fields.map(field => (
                <Rnd
                  key={field.id}
                  position={{ x: field.x, y: field.y }}
                  size={{ width: field.width || 300, height: 'auto' }}
                  onDragStop={(_, d) => updateField(field.id, { x: d.x, y: d.y })}
                  onResizeStop={(_e, _dir, ref, _delta, position) => {
                    updateField(field.id, {
                      width: parseInt(ref.style.width, 10),
                      x: position.x,
                      y: position.y
                    });
                  }}
                  enableResizing={{ top: false, bottom: false, left: true, right: true, topLeft: false, topRight: false, bottomLeft: false, bottomRight: false }}
                  bounds="parent"
                  onClick={() => setSelectedField(field.id)}
                  className={`border-2 ${selectedField === field.id ? 'border-brand-accent border-dashed' : 'border-transparent hover:border-slate-300 hover:border-dashed'}`}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 'auto',
                      fontSize: `${field.fontSize}px`,
                      fontFamily: field.fontFamily,
                      fontWeight: field.fontWeight,
                      color: field.color,
                      textAlign: field.align,
                      textTransform: field.transform === 'none' ? undefined : field.transform,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {'{' + field.name + '}'}
                  </div>
                </Rnd>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col overflow-y-auto">
          <h3 className="font-semibold text-slate-300 mb-4 flex items-center">
            <Settings className="w-4 h-4 mr-2" /> Properties
          </h3>
          
          {!activeField ? (
            <p className="text-sm text-slate-500 text-center py-8">Select a field to edit its properties</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Field Name</label>
                <input
                  type="text"
                  value={activeField.name}
                  onChange={e => updateField(activeField.id, { name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Excel Column Map</label>
                <input
                  type="text"
                  value={activeField.excelColumn}
                  onChange={e => updateField(activeField.id, { excelColumn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Font Size (px)</label>
                  <input
                    type="number"
                    value={activeField.fontSize}
                    onChange={e => updateField(activeField.id, { fontSize: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Color</label>
                  <input
                    type="color"
                    value={activeField.color}
                    onChange={e => updateField(activeField.id, { color: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded h-9 px-1 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Font Weight</label>
                <select
                  value={activeField.fontWeight}
                  onChange={e => updateField(activeField.id, { fontWeight: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="500">Medium</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Alignment</label>
                <div className="flex bg-slate-950 border border-slate-800 rounded p-1">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateField(activeField.id, { align: align as any })}
                      className={`flex-1 py-1 text-sm rounded capitalize ${activeField.align === align ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Transform</label>
                <select
                  value={activeField.transform}
                  onChange={e => updateField(activeField.id, { transform: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                >
                  <option value="none">None</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="lowercase">Lowercase</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex space-x-2">
                <button
                  onClick={() => {
                    const dup = { ...activeField, id: Math.random().toString(36).substr(2, 9), y: activeField.y + 20 };
                    setFields([...fields, dup]);
                    setSelectedField(dup.id);
                  }}
                  className="flex-1 flex items-center justify-center bg-slate-800 hover:bg-slate-700 py-2 rounded text-sm transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" /> Duplicate
                </button>
                <button
                  onClick={() => deleteField(activeField.id)}
                  className="flex-1 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-2 rounded text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
