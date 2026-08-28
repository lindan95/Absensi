import React from 'react';
import {
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  CalendarCheck,
  Building2,
  History,
  ClipboardList,
  UserCog,
  Settings,
  FileCode,
  LogOut,
  Scan,
  UserCheck,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { Role } from '../../types';

export type AdminMenuKey =
  | 'dashboard'
  | 'profil_sekolah'
  | 'data_guru'
  | 'data_siswa'
  | 'jadwal_piket'
  | 'kelas'
  | 'riwayat_scan'
  | 'rekap_kehadiran'
  | 'manajemen_user'
  | 'pengaturan'
  | 'gas_integration';

export type GuruPiketMenuKey =
  | 'dashboard'
  | 'scan_datang'
  | 'scan_pulang'
  | 'riwayat_scan'
  | 'rekap_kehadiran'
  | 'profil_saya';

export type KepsekMenuKey =
  | 'dashboard'
  | 'riwayat_guru_piket'
  | 'rekap_siswa'
  | 'rekap_guru'
  | 'profil_sekolah';

interface SidebarProps {
  role: Role;
  activeMenu: string;
  onSelectMenu: (menuKey: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeMenu,
  onSelectMenu,
  isOpenMobile,
  onCloseMobile,
  onLogout,
}) => {
  const adminMenuItems: Array<{ key: AdminMenuKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'profil_sekolah', label: 'Profil Sekolah', icon: School },
    { key: 'data_guru', label: 'Data Guru', icon: Users },
    { key: 'data_siswa', label: 'Data Siswa', icon: GraduationCap },
    { key: 'jadwal_piket', label: 'Jadwal Piket', icon: CalendarCheck },
    { key: 'kelas', label: 'Data Kelas', icon: Building2 },
    { key: 'riwayat_scan', label: 'Riwayat Scan Siswa', icon: History },
    { key: 'rekap_kehadiran', label: 'Rekap Kehadiran', icon: ClipboardList },
    { key: 'manajemen_user', label: 'Manajemen Pegawai', icon: UserCog },
    { key: 'pengaturan', label: 'Pengaturan Sistem', icon: Settings },
    { key: 'gas_integration', label: 'Google Apps Script', icon: FileCode },
  ];

  const guruPiketMenuItems: Array<{ key: GuruPiketMenuKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'dashboard', label: 'Dashboard Piket', icon: LayoutDashboard },
    { key: 'scan_datang', label: 'Scan Absen Datang', icon: Scan },
    { key: 'scan_pulang', label: 'Scan Absen Pulang', icon: Scan },
    { key: 'riwayat_scan', label: 'Riwayat Scan Saya', icon: History },
    { key: 'rekap_kehadiran', label: 'Rekap Kehadiran Hari Ini', icon: ClipboardList },
    { key: 'profil_saya', label: 'Profil Saya', icon: UserCheck },
  ];

  const kepsekMenuItems: Array<{ key: KepsekMenuKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'dashboard', label: 'Dashboard Monitoring', icon: LayoutDashboard },
    { key: 'riwayat_guru_piket', label: 'Riwayat Guru Piket', icon: CalendarCheck },
    { key: 'rekap_siswa', label: 'Rekap Kehadiran Siswa', icon: ClipboardList },
    { key: 'rekap_guru', label: 'Rekap Kehadiran Guru', icon: Users },
    { key: 'profil_sekolah', label: 'Profil Sekolah', icon: School },
  ];

  const currentItems =
    role === 'ADMIN'
      ? adminMenuItems
      : role === 'GURU_PIKET'
      ? guruPiketMenuItems
      : kepsekMenuItems;

  const roleTitle =
    role === 'ADMIN'
      ? 'Panel Administrator'
      : role === 'GURU_PIKET'
      ? 'Panel Guru Piket'
      : 'Panel Kepala Sekolah';

  const roleThemeBadge =
    role === 'ADMIN'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      : role === 'GURU_PIKET'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden no-print"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 no-print ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  PRESENSI SISWA
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">QR Code & Google Sheets</p>
              </div>
            </div>

            <div className="mt-3">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleThemeBadge}`}>
                {roleTitle}
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {currentItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectMenu(item.key);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 translate-x-1'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout & Database info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="px-3 py-2 bg-slate-800/50 rounded-xl mb-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Database Status</span>
            <span className="inline-flex items-center text-emerald-400 font-bold gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Google Sheets OK
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar (Logout)
          </button>
        </div>
      </aside>
    </>
  );
};
