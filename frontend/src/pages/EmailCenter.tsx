import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, AlertTriangle, Send, RefreshCw, Settings, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

export default function EmailCenter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [participants, setParticipants] = useState<any[]>([]);
  const [emailStatus, setEmailStatus] = useState<Record<string, { status: 'sent' | 'failed', time: string }>>({});
  const [eventName, setEventName] = useState('IDEAFEST 2026');
  const [subject, setSubject] = useState('Your Certificate – {Event}');
  const [body, setBody] = useState('Dear {Name},\n\nThank you for participating in {Event} organized by the Electrical Club.\n\nPlease find your certificate attached to this email.\n\nRegards,\nElectrical Club\nVSB Engineering College');
  
  const sentCount = Object.values(emailStatus).filter(s => s.status === 'sent').length;
  const failedCount = Object.values(emailStatus).filter(s => s.status === 'failed').length;

  // For rendering logic
  const [template, setTemplate] = useState<string | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [currentParticipant, setCurrentParticipant] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`participants_${id}`);
    if (saved) {
      setParticipants(JSON.parse(saved).filter((p: any) => p.status === 'Valid'));
    }
    const savedTemplate = localStorage.getItem(`template_${id}`);
    const savedFields = localStorage.getItem(`fields_${id}`);
    const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const event = savedEvents.find((e: any) => e.id === id);
    if (event) {
      setEventName(event.name);
      setSubject(`Your Certificate – ${event.name}`);
      setBody(`Dear {Name},\n\nThank you for participating in ${event.name} organized by the Electrical Club.\n\nPlease find your certificate attached to this email.\n\nRegards,\nElectrical Club\nVSB Engineering College`);
    }
    if (savedTemplate) setTemplate(savedTemplate);
    if (savedFields) setFields(JSON.parse(savedFields));
  }, [id]);

  const totalCertificates = participants.length;
  
  const handleSendAll = async () => {
    if (totalCertificates === 0) {
      toast.error('No valid participants found.');
      return;
    }
    if (!template) {
      toast.error('No template found. Please create one first.');
      return;
    }
    
    if (!confirm(`Are you sure you want to send certificates to ${totalCertificates - sentCount} remaining participants? This will take a few minutes.`)) {
      return;
    }

    setIsSending(true);
    const statuses = { ...emailStatus };
    
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      
      // Skip if already sent successfully
      if (statuses[p.id]?.status === 'sent') {
        setProgress(Math.floor(((i + 1) / totalCertificates) * 100));
        continue;
      }

      // Update state so the hidden DOM updates with this participant's data
      setCurrentParticipant(p);
      setProgress(Math.floor((i / totalCertificates) * 100));
      
      // Wait for React to render the DOM quickly
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (!certificateRef.current) continue;

      try {
        // Generate image
        const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
        const imageData = canvas.toDataURL('image/png');

        // Send to backend
        const res = await fetch('http://localhost:5000/api/events/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: p.email,
            name: p.name,
            subject: subject.replace(/{Event}/g, eventName),
            body: body.replace(/{Name}/g, p.name).replace(/{Event}/g, eventName),
            imageData
          })
        });

        if (res.ok) {
          statuses[p.id] = { status: 'sent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        console.error(err);
        statuses[p.id] = { status: 'failed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }

      setEmailStatus({ ...statuses });
    }
    
    setProgress(100);
    setIsSending(false);
    toast.success('Finished sending emails!');

    // Update event stats in localStorage and save emailStatus for reports
    try {
      localStorage.setItem(`emailStatus_${id}`, JSON.stringify(statuses));
      const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const eventIndex = savedEvents.findIndex((e: any) => e.id === id);
      if (eventIndex >= 0) {
        savedEvents[eventIndex].participantsCount = totalCertificates;
        savedEvents[eventIndex].certificatesCount = totalCertificates;
        savedEvents[eventIndex].emailsSent = Object.values(statuses).filter((s: any) => s.status === 'sent').length;
        savedEvents[eventIndex].status = 'Completed';
        localStorage.setItem('events', JSON.stringify(savedEvents));
      }
    } catch (e) {
      console.error('Could not save to history', e);
    }
  };

  const handleTestEmail = () => {
    const email = prompt('Enter test email address:');
    if (email) {
      toast.success('Test email functionality should be added!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Hidden Certificate Container for Rendering */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div 
          ref={certificateRef}
          className="bg-white relative shrink-0"
          style={{
            width: '800px',
            height: '566px',
            backgroundImage: template ? `url(${template})` : 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
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
              {currentParticipant 
                ? currentParticipant[field.excelColumn] || currentParticipant[field.name] || field.name
                : field.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Mail className="w-6 h-6 mr-3 text-brand-accent" />
          Email Center
        </h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleTestEmail}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Send Test Email
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Settings className="w-4 h-4 mr-2" /> Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Total Certificates</p>
          <p className="text-2xl font-bold text-white">{totalCertificates}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Ready to Send</p>
          <p className="text-2xl font-bold text-blue-400">{totalCertificates - sentCount - failedCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Sent</p>
          <p className="text-2xl font-bold text-green-400">{sentCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-400">{failedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4 border-b border-slate-800 pb-2">Email Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Body</label>
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="text-xs text-slate-500">
                Variables: {'{Name}'}, {'{Event}'}, {'{Date}'}, {'{College}'}, {'{Club}'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            {isSending ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Sending emails... Please do not close this window.</p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-medium">{sentCount + failedCount} / {totalCertificates}</p>
              </div>
            ) : (
              <button
                onClick={handleSendAll}
                className="w-full flex items-center justify-center px-6 py-4 bg-brand-accent hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-accent/20"
              >
                <Send className="w-5 h-5 mr-2" /> SEND ALL CERTIFICATES
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
            <h3 className="font-semibold text-white">Email Status</h3>
            <div className="flex space-x-2">
              <div className="relative w-48">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm"
                />
              </div>
              {failedCount > 0 && (
                <button 
                  onClick={handleSendAll}
                  className="flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry Failed
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {Object.keys(emailStatus).length > 0 ? (
                  participants.map(p => {
                    const statusData = emailStatus[p.id];
                    if (!statusData) return null;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                        <td className="px-4 py-3 text-slate-400">{p.email}</td>
                        <td className="px-4 py-3">
                          {statusData.status === 'sent' ? (
                            <span className="inline-flex items-center text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-400 bg-red-400/10 px-2 py-1 rounded-full text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{statusData.time}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No emails sent yet. Click "Send All Certificates" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
