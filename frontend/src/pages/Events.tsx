import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Award, Mail, Edit, Trash2 } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      const defaultEvent = {
        id: '1',
        name: 'IDEAFEST 2026',
        date: '2026-09-25',
        venue: 'EEE Block',
        createdAt: '2026-09-01',
        participantsCount: 150,
        certificatesCount: 150,
        emailsSent: 145,
        status: 'Completed'
      };
      setEvents([defaultEvent]);
      localStorage.setItem('events', JSON.stringify([defaultEvent]));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter((e: any) => e.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      toast.success('Event deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <Link
          to="/events/create"
          className="bg-brand-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
          <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No events created yet.</h3>
          <p className="text-slate-500 mb-6">Get started by creating your first event.</p>
          <Link
            to="/events/create"
            className="bg-brand-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            + Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{event.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{event.date} • {event.venue}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${event.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {event.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center"><Users className="w-4 h-4 mr-2" /> Participants</span>
                    <span className="font-medium text-white">{event.participantsCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center"><Award className="w-4 h-4 mr-2" /> Certificates</span>
                    <span className="font-medium text-white">{event.certificatesCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center"><Mail className="w-4 h-4 mr-2" /> Emails Sent</span>
                    <span className="font-medium text-white">{event.emailsSent}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigate(`/events/${event.id}/template`)}
                    className="flex-1 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-white px-4 py-2 rounded-lg font-medium transition-colors text-center text-sm"
                  >
                    Open
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
