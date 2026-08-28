import React, { useState } from 'react';
import {
  Camera,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  CalendarCheck,
  UserCheck,
  Zap,
  ClipboardList,
  Sparkles,
  Search,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { User, ScanType, ScanLog, AttendanceStatus } from '../../types';

interface GuruPiketDashboardProps {
  user: User;
  activeSubMenu: string;
  onOpenScanner: (type?: ScanType) => void;
  onNavigate: (menuKey: string) => void;
}

export const GuruPiketDashboard: React.FC<GuruPiketDashboardProps> = ({
  user,
  activeSubMenu,
  onOpenScanner,
  onNavigate,
}) => {
  const [search, setSearch] = useState<string>('');
  const stats = storageService.getDashboardStats();
  const absensiList = storageService.getAbsensiHarian();
  const allLogs = storageService.getScanLogs();
  const jadwalList = storageService.getJadwalPiket();

  // Filter logs handled by this teacher or recent scans
  const myScanLogs = allLogs.filter(
    (l) => l.guruPiket.toLowerCase().includes(user.nama.toLowerCase()) || l.guruPiket === 'Guru Piket Bertugas' || l.guruPiket === user.nama
  );

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'HADIR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">Hadir</span>;
      case 'TERLAMBAT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">Terlambat</span>;
      case 'ALPA':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">Alpa</span>;
      case 'BOLOS':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-950 text-red-100 border border-red-800">Bolos</span>;
      case 'LOMPAT PAGAR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-300">Lompat Pagar</span>;
      case 'MASIH DI SEKOLAH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">Masih di Sekolah</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Belum Absen</span>;
    }
  };

  const filteredAbsensi = absensiList.filter(
    (a) => a.nama.toLowerCase().includes(search.toLowerCase()) || a.nis.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Scanner Launchers */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Pos Penugasan Guru Piket Aktif
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Selamat Bertugas, {user.nama}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Silakan aktifkan kamera scanner untuk membaca kartu presensi QR Code siswa pada saat kedatangan pagi atau kepulangan siswa.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onOpenScanner('DATANG')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2.5 transition-all transform active:scale-95"
            >
              <Zap className="w-5 h-5" />
              SCAN ABSEN DATANG
            </button>
            <button
              onClick={() => onOpenScanner('PULANG')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-blue-500/30 flex items-center gap-2.5 transition-all transform active:scale-95"
            >
              <Clock className="w-5 h-5" />
              SCAN ABSEN PULANG
            </button>
          </div>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 uppercase">Hadir Tepat Waktu</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {stats.hadirHariIni}
          </div>
          <div className="text-[11px] text-slate-700 mt-1">Siswa telah scan datang</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 uppercase">Terlambat Hari Ini</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
            {stats.terlambatHariIni}
          </div>
          <div className="text-[11px] text-slate-700 mt-1">Datang melebihi jam masuk</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 uppercase">Masih di Sekolah</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
            {stats.masihDiSekolah}
          </div>
          <div className="text-[11px] text-slate-700 mt-1">Menunggu waktu kepulangan</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-700 uppercase">Total Siswa</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.totalSiswa}
          </div>
          <div className="text-[11px] text-slate-700 mt-1">Rombel aktif hari ini</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rekap Kehadiran Realtime */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Monitoring Presensi Hari Ini</h3>
              <p className="text-xs text-slate-700">Daftar siswa & rekaman jam scan masuk/pulang</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa atau NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3 text-center">Datang</th>
                  <th className="py-3 px-3 text-center">Pulang</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredAbsensi.slice(0, 10).map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-700">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {row.nama}
                      <div className="text-[10px] text-slate-700 font-mono font-normal">NIS: {row.nis}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {row.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      {row.scanDatang ? (
                        <span className="text-emerald-700 font-bold">{row.scanDatang}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      {row.scanPulang ? (
                        <span className="text-blue-700 font-bold">{row.scanPulang}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Riwayat Scan Piket */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Riwayat Scan Saya</h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {myScanLogs.length} Scan
              </span>
            </div>

            <div className="mt-4 space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {myScanLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{log.nama}</div>
                    <div className="text-[11px] text-slate-700">
                      {log.kelas} • <span className="font-mono">{log.jam} WIB</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      log.jenisScan === 'DATANG'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {log.jenisScan}
                  </span>
                </div>
              ))}

              {myScanLogs.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-700">
                  Belum ada catatan scan yang tercatat. Buka scanner untuk mulai presensi.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenScanner('DATANG')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Buka Kamera Scanner Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
