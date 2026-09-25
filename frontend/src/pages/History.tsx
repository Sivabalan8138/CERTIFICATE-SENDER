import { useState, useEffect } from 'react';
import { History as HistoryIcon, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    // Load events from localStorage and map them to history format
    const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const mapped = savedEvents.map((event: any) => {
      // Calculate failed/sent if missing based on total and sent
      const generated = event.certificatesCount || 0;
      const sent = event.emailsSent || 0;
      const participants = event.participantsCount || 0;
      
      // Look up specific email status if available
      const statusDataStr = localStorage.getItem(`emailStatus_${event.id}`);
      let failed = 0;
      let actualSent = sent;
      
      if (statusDataStr) {
        const statusData = JSON.parse(statusDataStr);
        failed = Object.values(statusData).filter((s: any) => s.status === 'failed').length;
        actualSent = Object.values(statusData).filter((s: any) => s.status === 'sent').length;
      } else {
        failed = generated - sent > 0 ? generated - sent : 0;
      }

      return {
        id: event.id,
        event: event.name,
        date: event.date,
        participants: participants,
        generated: generated,
        sent: actualSent,
        failed: failed,
        status: event.status || 'Upcoming'
      };
    });
    setHistoryData(mapped.reverse()); // Show newest first
  }, []);

  const handleDownloadReport = (eventId: string, eventName: string) => {
    const participantsStr = localStorage.getItem(`participants_${eventId}`);
    const statusDataStr = localStorage.getItem(`emailStatus_${eventId}`);
    
    if (!participantsStr) {
      toast.error('No participant data found for this event.');
      return;
    }
    
    const participants = JSON.parse(participantsStr);
    const statusData = statusDataStr ? JSON.parse(statusDataStr) : {};
    
    // Generate CSV
    let csvContent = "S.No,Name,Email,Department,Certificate Status,Email Status,Time\n";
    
    participants.forEach((p: any, index: number) => {
      const emailStatusInfo = statusData[p.id];
      const emailStatus = emailStatusInfo ? emailStatusInfo.status : 'Pending';
      const time = emailStatusInfo ? emailStatusInfo.time : 'N/A';
      
      const row = [
        p.sNo || index + 1,
        `"${p.name || ''}"`,
        `"${p.email || ''}"`,
        `"${p.department || ''}"`,
        p.status === 'Valid' ? 'Generated' : 'Skipped',
        emailStatus,
        time
      ].join(',');
      
      csvContent += row + "\n";
    });
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${eventName.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <HistoryIcon className="w-6 h-6 mr-3 text-brand-accent" />
          Generation History
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Participants</th>
                <th className="px-6 py-4 font-medium">Generated</th>
                <th className="px-6 py-4 font-medium">Sent / Failed</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {historyData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No history available yet.
                  </td>
                </tr>
              ) : (
                historyData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.event}</td>
                    <td className="px-6 py-4 text-slate-400">{item.date}</td>
                    <td className="px-6 py-4 text-slate-300">{item.participants}</td>
                    <td className="px-6 py-4 text-blue-400">{item.generated}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-400">{item.sent}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-red-400">{item.failed}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Completed' ? 'text-green-400 bg-green-400/10' : 'text-blue-400 bg-blue-400/10'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDownloadReport(item.id, item.event)}
                        className="flex items-center text-brand-accent hover:text-blue-400 text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" /> Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
