import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for now
    if (email && password) {
      localStorage.setItem('token', 'fake-token');
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Please enter email and password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-accent/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-brand-accent/20 rounded-2xl flex items-center justify-center mb-4 border border-brand-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Zap className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ELECTRICAL CLUB</h1>
          <p className="text-slate-400 mt-2">Certificate Automation System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email / Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors"
              placeholder="admin@electricalclub.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-slate-400">
              <input type="checkbox" className="rounded bg-slate-950 border-slate-800 text-brand-accent focus:ring-brand-accent" />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-accent hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
