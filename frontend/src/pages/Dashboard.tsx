import { useState, useEffect } from 'react';
import { Users, Calendar, Award, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    certificatesGenerated: 0,
    emailsSent: 0,
    emailsFailed: 0,
    recentActivity: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate stats from local storage data
    const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    let totalParticipants = 0;
    let certificatesGenerated = 0;
    let emailsSent = 0;
    let emailsFailed = 0;
    
    savedEvents.forEach((event: any) => {
      const generated = event.certificatesCount || 0;
      const sent = event.emailsSent || 0;
      totalParticipants += event.participantsCount || 0;
      certificatesGenerated += generated;
      emailsSent += sent;
      
      const statusDataStr = localStorage.getItem(`emailStatus_${event.id}`);
      if (statusDataStr) {
        const statusData = JSON.parse(statusDataStr);
        emailsFailed += Object.values(statusData).filter((s: any) => s.status === 'failed').length;
      } else {
        emailsFailed += (generated - sent > 0) ? (generated - sent) : 0;
      }
    });

    const recentActivity = [];
    if (certificatesGenerated > 0) recentActivity.push({ text: `${certificatesGenerated} certificates generated`, type: 'success', time: 'Recently' });
    if (emailsSent > 0) recentActivity.push({ text: `${emailsSent} emails sent`, type: 'success', time: 'Recently' });
    if (emailsFailed > 0) recentActivity.push({ text: `${emailsFailed} emails failed`, type: 'error', time: 'Recently' });
    if (savedEvents.length > 0) recentActivity.push({ text: `Created event: ${savedEvents[savedEvents.length - 1].name}`, type: 'info', time: 'Recently' });

    setStats({
      totalEvents: savedEvents.length,
      totalParticipants,
      certificatesGenerated,
      emailsSent,
      emailsFailed,
      recentActivity
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Loading Dashboard...</div>;
  }
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Events', value: stats.totalEvents.toString(), icon: Calendar, color: 'text-blue-400' },
          { label: 'Participants', value: stats.totalParticipants.toString(), icon: Users, color: 'text-indigo-400' },
          { label: 'Certificates Generated', value: stats.certificatesGenerated.toString(), icon: Award, color: 'text-purple-400' },
          { label: 'Emails Sent', value: stats.emailsSent.toString(), icon: Mail, color: 'text-green-400' },
          { label: 'Emails Failed', value: stats.emailsFailed.toString(), icon: AlertTriangle, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-slate-950 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/events/create" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-colors group">
              <span className="font-medium">+ Create Event</span>
            </Link>
            <Link to="/events" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-colors group">
              <span className="font-medium">Upload Certificate Template</span>
            </Link>
            <Link to="/events" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-colors group">
              <span className="font-medium">Upload Excel</span>
            </Link>
            <Link to="/events" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-colors group">
              <span className="font-medium">Generate Certificates</span>
            </Link>
            <Link to="/events" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-colors group">
              <span className="font-medium">Send Emails</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  {activity.type === 'info' && <Calendar className="w-5 h-5 text-blue-400" />}
                  {activity.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  <span className="text-slate-200">{activity.text}</span>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            )) : <p className="text-slate-400 text-sm">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
