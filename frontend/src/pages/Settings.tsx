import { Settings as SettingsIcon, Save, Key, Server } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-brand-accent" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-slate-800 pb-2 flex items-center">
              <Server className="w-5 h-5 mr-2 text-slate-400" />
              SMTP Email Configuration
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Configure the mail server used to send certificates to participants.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Port</label>
                <input
                  type="text"
                  defaultValue="465"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Username</label>
                <input
                  type="text"
                  defaultValue="admin@electricalclub.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">SMTP Password</label>
                <input
                  type="password"
                  defaultValue="********"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sender Name</label>
                <input
                  type="text"
                  defaultValue="Electrical Club VSBEC"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sender Email</label>
                <input
                  type="email"
                  defaultValue="admin@electricalclub.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold border-b border-slate-800 pb-2 flex items-center">
              <Key className="w-5 h-5 mr-2 text-slate-400" />
              Security
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-800">
            <button
              type="submit"
              className="flex items-center px-8 py-3 bg-brand-accent hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-accent/20"
            >
              <Save className="w-5 h-5 mr-2" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
