import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Building2, User } from 'lucide-react';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    college: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      ...formData,
      participantsCount: 0,
      certificatesCount: 0,
      emailsSent: 0,
      status: 'Upcoming'
    };
    
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    localStorage.setItem('events', JSON.stringify([...existingEvents, newEvent]));
    
    toast.success('Event created successfully!');
    navigate('/events');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create Event</h2>
        <p className="text-slate-400 mt-1">Fill in the details to create a new event.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-slate-800 pb-2">Basic Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="e.g. IDEAFEST 2026"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="e.g. EEE Block Seminar Hall"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold border-b border-slate-800 pb-2">Organization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-slate-400" />
                  Organizer / Club Name
                </label>
                <input
                  type="text"
                  name="organizer"
                  required
                  value={formData.organizer}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="e.g. Electrical Club"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                  College Name
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="e.g. VSB Engineering College"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="Brief description of the event..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-brand-accent hover:bg-blue-600 text-white font-medium transition-colors shadow-lg shadow-brand-accent/20"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
