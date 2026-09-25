import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Eye, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Generate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [template, setTemplate] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const savedTemplate = localStorage.getItem(`template_${id}`);
    const savedFields = localStorage.getItem(`fields_${id}`);
    const savedParticipants = localStorage.getItem(`participants_${id}`);
    if (savedTemplate) setTemplate(savedTemplate);
    if (savedFields) setFields(JSON.parse(savedFields));
    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
  }, [id]);

  const previewParticipant = participants.find(p => p.status === 'Valid') || null;
  const totalParticipants = participants.filter(p => p.status === 'Valid').length || 250;

  const handlePreview = () => {
    toast.loading('Generating preview...', { duration: 1000 });
    setTimeout(() => {
      setIsPreviewGenerated(true);
      toast.success('Preview generated!');
    }, 1000);
  };

  const handleGenerateAll = () => {
    setIsGenerating(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setIsGenerated(true);
        
        try {
          const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
          const eventIndex = savedEvents.findIndex((e: any) => e.id === id);
          if (eventIndex >= 0) {
            savedEvents[eventIndex].certificatesCount = totalParticipants;
            localStorage.setItem('events', JSON.stringify(savedEvents));
          }
        } catch(e) {}
        
        toast.success(`${totalParticipants} certificates generated successfully!`);
      }
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generate Certificates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Selected Event</p>
          <p className="text-lg font-semibold text-white">IDEAFEST 2026</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Template</p>
          <p className="text-lg font-semibold text-white">Participation Certificate</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Valid Participants</p>
          <p className="text-lg font-semibold text-white">{totalParticipants}</p>
        </div>
      </div>

      {!isGenerated ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-8">
          <div className="flex justify-center space-x-6">
            <button
              onClick={handlePreview}
              className="flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <Eye className="w-5 h-5 mr-2" /> Generate Preview
            </button>
            <button
              onClick={handleGenerateAll}
              disabled={!isPreviewGenerated || isGenerating}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                !isPreviewGenerated || isGenerating
                  ? 'bg-brand-accent/50 text-white/50 cursor-not-allowed'
                  : 'bg-brand-accent hover:bg-blue-600 text-white shadow-lg shadow-brand-accent/20'
              }`}
            >
              <Play className="w-5 h-5 mr-2" /> Generate All Certificates
            </button>
          </div>

          {isGenerating && (
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Generating certificates...</span>
                <span className="text-brand-accent font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{Math.floor((progress / 100) * totalParticipants)} / {totalParticipants} completed</p>
            </div>
          )}

          {isPreviewGenerated && !isGenerating && !isGenerated && (
            <div className="pt-8 border-t border-slate-800">
              <h3 className="text-lg font-semibold mb-4 text-left">Preview Certificate</h3>
              <div className="overflow-auto max-w-full flex justify-center pb-4">
                <div 
                  className="bg-white rounded shadow-2xl relative shrink-0"
                  style={{
                    width: '800px',
                    height: '566px',
                    backgroundImage: template ? `url(${template})` : 'none',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {!template && (
                    <div className="absolute inset-4 border-2 border-slate-200 p-8 text-center flex flex-col justify-center">
                      <h1 className="text-3xl font-serif text-slate-800 mb-8">CERTIFICATE OF PARTICIPATION</h1>
                      <h2 className="text-4xl font-bold text-slate-900 mb-4">ARUN KUMAR</h2>
                      <h3 className="text-2xl font-bold text-brand-accent mb-8">IDEAFEST 2026</h3>
                    </div>
                  )}
                  {template && fields.map((field) => (
                    <div
                      key={field.id}
                      className="absolute whitespace-nowrap"
                      style={{
                        left: `${field.x}px`,
                        top: `${field.y}px`,
                        width: `${field.width || 300}px`,
                        height: 'auto',
                        fontSize: `${field.fontSize}px`,
                        fontFamily: field.fontFamily,
                        fontWeight: field.fontWeight,
                        color: field.color,
                        textAlign: field.align,
                        textTransform: field.transform !== 'none' ? field.transform as any : undefined,
                      }}
                  >
                    {previewParticipant 
                      ? previewParticipant[field.excelColumn] || previewParticipant[field.name] || field.name
                      : field.name}
                  </div>
                ))}
                </div>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button onClick={() => navigate(`/events/${id}/template`)} className="text-sm text-slate-400 hover:text-white">
                  Edit Template
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Generation Complete!</h3>
          <p className="text-slate-400">Successfully generated {totalParticipants} certificates.</p>
          
          <div className="flex justify-center space-x-4 pt-6">
            <button 
              onClick={() => setIsGenerated(false)}
              className="flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
              <FileText className="w-5 h-5 mr-2" /> View Certificates
            </button>
            <button 
              onClick={() => navigate(`/events/${id}/email`)}
              className="flex items-center px-6 py-3 bg-brand-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-accent/20"
            >
              Go to Email Center <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
