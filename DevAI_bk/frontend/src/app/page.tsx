'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'anything123') {
      const role = email === 'guide@123' ? 'guide' : 'student';
      login(email, role);
      router.replace(`/dashboard/${role}`);
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
        <div className="flex justify-center mb-6"><Terminal className="text-[#ffde22]" size={40} /></div>
        <h2 className="text-3xl font-black italic text-center mb-8 font-satoshi">DevAI LOGIN</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Squad ID" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#ffde22]" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Passcode" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#ffde22]" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full py-4 bg-[#ffde22] text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,222,34,0.3)]">INITIALIZE SESSION</button>
        </div>
      </form>
    </div>
  );
}