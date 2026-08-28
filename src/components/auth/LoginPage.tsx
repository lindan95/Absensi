import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  LogIn,
  School,
  Sparkles,
  ShieldCheck,
  Zap,
  KeyRound,
  FileSpreadsheet,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { User, ProfilSekolah } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  profil: ProfilSekolah;
  onOpenQuickScan?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  profil,
  onOpenQuickScan,
}) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const user = storageService.login(username.trim(), password.trim());
      if (user) {
        onLoginSuccess(user);
      } else {
        setErrorMsg('Username atau password salah. Silakan periksa kembali akun Anda.');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const user = storageService.login(u, p);
      if (user) {
        onLoginSuccess(user);
      }
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Header Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl p-1 shadow-lg flex items-center justify-center mb-3">
            {profil.logo ? (
              <img src={profil.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <School className="w-9 h-9 text-white" />
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-amber-300">
            {profil.namaSekolah}
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Sistem Monitoring Kehadiran Siswa & Guru Piket
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>NPSN: {profil.npsn} • Google Sheets Engine</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                Username / Akun Pegawai
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Login Demo Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase text-center flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Akses Cepat Akun Demo (Klik untuk Masuk):</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', '123456')}
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-center transition-all group"
              >
                <div className="text-xs font-black">Admin</div>
                <div className="text-[10px] text-rose-600 font-mono">admin</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('piket', '123456')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-center transition-all group"
              >
                <div className="text-xs font-black">Guru Piket</div>
                <div className="text-[10px] text-emerald-600 font-mono">piket</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kepsek', '123456')}
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-center transition-all group"
              >
                <div className="text-xs font-black">Kepala Sek.</div>
                <div className="text-[10px] text-indigo-600 font-mono">kepsek</div>
              </button>
            </div>
          </div>

          {/* Quick Scanner Shortcut directly from login page */}
          {onOpenQuickScan && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onOpenQuickScan}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1.5 mx-auto py-1"
              >
                <Camera className="w-4 h-4" />
                <span>Langsung Buka Scanner Kartu (Mode Gerbang)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-6 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Presensi QR Code Siswa • Google Apps Script & Sheets
      </div>
    </div>
  );
};
