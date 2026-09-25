import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Download, Search, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function Participants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<any[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleDownloadTemplate = () => {
    toast.success('Downloading Excel template...');
    
    // Create Excel workbook and worksheet with standard headers
    const headers = [['Name', 'Email', 'Event Name', 'Department', 'Date', 'Venue']];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(headers);
    
    // Add sample row
    XLSX.utils.sheet_add_aoa(ws, [['Arun Kumar', 'arun@example.com', 'IDEAFEST 2026', 'Computer Science', '25th Sept 2026', 'Main Hall']], { origin: 'A2' });
    
    // Auto-size columns
    ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    
    // Trigger download
    XLSX.writeFile(wb, 'Certificate_Participants_Template.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const wb = XLSX.read(data, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const jsonData = XLSX.utils.sheet_to_json(ws);
          
          const parsedParticipants = jsonData.map((row: any, index: number) => {
            const name = row.Name || row.name || '';
            const email = row.Email || row.email || '';
            const event = row['Event Name'] || row['Event'] || row.event || '';
            
            let status = 'Valid';
            let error = '';
            
            if (!name) {
              status = 'Invalid';
              error = 'Name missing';
            } else if (!email) {
              status = 'Invalid';
              error = 'Email missing';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              status = 'Invalid';
              error = 'Invalid email format';
            }

            return {
              ...row,
              id: index + 1,
              sNo: index + 1,
              name,
              email,
              event,
              status,
              error
            };
          });

          setParticipants(parsedParticipants);
          setIsUploaded(true);
          localStorage.setItem(`participants_${id}`, JSON.stringify(parsedParticipants));
          
          try {
            const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
            const eventIndex = savedEvents.findIndex((e: any) => e.id === id);
            if (eventIndex >= 0) {
              savedEvents[eventIndex].participantsCount = parsedParticipants.length;
              localStorage.setItem('events', JSON.stringify(savedEvents));
            }
          } catch(e) {}
          
          toast.success('Excel uploaded successfully!');
        } catch (error) {
          console.error('Error parsing excel:', error);
          toast.error('Failed to parse Excel file');
        }
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsArrayBuffer(file);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(`/events/${id}/template`)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Participants</h2>
        </div>
        {isUploaded && (
          <button
            onClick={() => navigate(`/events/${id}/generate`)}
            className="flex items-center px-6 py-2 bg-brand-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Next Step <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>

      {!isUploaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <Download className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">1. Download Template</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              Download our standard Excel template, fill it with your participants' details, and save it.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Download Excel Template
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <Upload className="w-12 h-12 text-brand-accent mb-4" />
            <h3 className="text-lg font-semibold mb-2">2. Upload Filled Excel</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              Upload the completed Excel file here. We will validate the data automatically.
            </p>
            <label className="cursor-pointer px-6 py-3 bg-brand-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-accent/20">
              Upload Excel
              <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Rows</p>
                <p className="text-2xl font-bold text-white">{participants.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400/20" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Valid</p>
                <p className="text-2xl font-bold text-green-400">{participants.filter(p => p.status === 'Valid').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400/20" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Errors</p>
                <p className="text-2xl font-bold text-red-400">{participants.filter(p => p.status === 'Invalid').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400/20" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <label className="cursor-pointer text-sm text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg">
                Re-upload Excel
                <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">S.No</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Event</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {participants.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">{p.sNo}</td>
                      <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                      <td className="px-6 py-4 text-slate-300">{p.email || '-'}</td>
                      <td className="px-6 py-4 text-slate-300">{p.event}</td>
                      <td className="px-6 py-4">
                        {p.status === 'Valid' ? (
                          <span className="inline-flex items-center text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-400 text-xs font-medium bg-red-400/10 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3 mr-1" /> {p.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
