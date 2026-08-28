import React, { useState, useEffect } from 'react';
import {
  Clock,
  LogOut,
  Camera,
  Calendar,
  Menu,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { User, ProfilSekolah } from '../../types';

interface HeaderProps {
  user: User;
  profil: ProfilSekolah;
  onLogout: () => void;
  onOpenScanner: (type?: 'DATANG' | 'PULANG') => void;
  onToggleSidebar?: () => void;
  onOpenGASModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  profil,
  onLogout,
  onOpenScanner,
  onToggleSidebar,
  onOpenGASModal,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setDateString(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleLabel =
    user.role === 'ADMIN'
      ? 'Administrator'
      : user.role === 'GURU_PIKET'
      ? 'Guru Piket'
      : 'Kepala Sekolah';

  const roleColor =
    user.role === 'ADMIN'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : user.role === 'GURU_PIKET'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Toggle button & School Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-sm flex items-center justify-center shrink-0">
              {profil.logo ? (
                <img src={profil.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-white font-black text-sm">SMK</span>
              )}
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                {profil.namaSekolah}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Presensi QR Code • Google Sheets Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Date */}
        <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{dateString}</span>
          </div>
          <div className="h-3 w-px bg-slate-300"></div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-sm tracking-wider">{timeString} WIB</span>
          </div>
        </div>

        {/* Right Side: Quick Scanner, GAS Sync Chip, and Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Scanner Launch Button */}
          <button
            onClick={() => onOpenScanner('DATANG')}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Buka Scanner QR</span>
            <span className="sm:hidden">Scan</span>
          </button>

          {/* Google Sheets Sync Indicator */}
          {onOpenGASModal && (
            <button
              onClick={onOpenGASModal}
              title="Integrasi Google Apps Script & Google Sheets"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheets Sync</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </button>
          )}

          {/* User Profile and Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-none">{user.nama}</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleColor}`}>
                  {roleLabel}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Keluar dari Aplikasi"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
