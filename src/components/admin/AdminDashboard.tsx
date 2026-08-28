import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  UserX,
  AlertOctagon,
  LogOut,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Camera,
  Printer,
  ChevronRight,
  Filter,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AttendanceStatus, AbsensiHarian } from '../../types';

interface AdminDashboardProps {
  onOpenScanner: (type?: 'DATANG' | 'PULANG') => void;
  onNavigate: (menuKey: string) => void;
  onOpenCardPrint: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenScanner,
  onNavigate,
  onOpenCardPrint,
}) => {
  const [chartFilter, setChartFilter] = useState<'hari' | 'minggu' | 'bulan' | 'semester' | 'tahun'>('hari');
  const stats = storageService.getDashboardStats();
  const absensiList = storageService.getAbsensiHarian();
  const scanLogs = storageService.getScanLogs().slice(0, 8);
  const profilSekolah = storageService.getProfilSekolah();

  // Status color badges
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'HADIR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">Hadir</span>;
      case 'TERLAMBAT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">Terlambat</span>;
      case 'ALPA':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">Alpa</span>;
      case 'BOLOS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-950 text-red-100 border border-red-800">Bolos</span>;
      case 'LOMPAT PAGAR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-300">Lompat Pagar</span>;
      case 'MASIH DI SEKOLAH':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">Masih di Sekolah</span>;
      case 'BELUM ABSEN':
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300">Belum Absen</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Presensi Real-Time Terintegrasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Dashboard Administrator
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pantau arus kehadiran siswa, guru piket bertugas, dan aktivitas scanner kartu QR secara real-time dengan sinkronisasi Google Sheets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onOpenScanner('DATANG')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              Scan Datang
            </button>
            <button
              onClick={() => onOpenScanner('PULANG')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Clock className="w-4 h-4" />
              Scan Pulang
            </button>
            <button
              onClick={onOpenCardPrint}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              Cetak Kartu Siswa
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div
          onClick={() => onNavigate('data_siswa')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Siswa</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalSiswa}</span>
            <span className="text-xs text-slate-700 font-medium">Siswa Terdaftar</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>Kelola Siswa</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Hadir Hari Ini */}
        <div
          onClick={() => onNavigate('rekap_kehadiran')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hadir Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.hadirHariIni}</span>
            <span className="text-xs text-emerald-700 font-bold">
              {stats.totalSiswa > 0 ? Math.round((stats.hadirHariIni / stats.totalSiswa) * 100) : 0}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold">Tepat waktu & tertib</div>
        </div>

        {/* Terlambat */}
        <div
          onClick={() => onNavigate('rekap_kehadiran')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Terlambat</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.terlambatHariIni}</span>
            <span className="text-xs text-slate-700 font-medium">Siswa</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold">Scan datang &gt; 07:00</div>
        </div>

        {/* Alpa */}
        <div
          onClick={() => onNavigate('rekap_kehadiran')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alpa / Tidak Hadir</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{stats.alpaHariIni}</span>
            <span className="text-xs text-slate-700 font-medium">Siswa</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-semibold">Tanpa keterangan</div>
        </div>

        {/* Bolos */}
        <div
          onClick={() => onNavigate('rekap_kehadiran')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bolos</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-red-950">{stats.bolosHariIni}</span>
            <span className="text-xs text-slate-700 font-medium">Siswa</span>
          </div>
          <div className="mt-2 text-[11px] text-red-800 font-semibold">Ada datang, tidak pulang</div>
        </div>

        {/* Lompat Pagar */}
        <div
          onClick={() => onNavigate('rekap_kehadiran')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lompat Pagar</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">{stats.lompatPagarHariIni}</span>
            <span className="text-xs text-slate-700 font-medium">Siswa</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-700 font-semibold">Scan pulang tanpa datang</div>
        </div>

        {/* Total Guru */}
        <div
          onClick={() => onNavigate('data_guru')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Guru</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalGuru}</span>
            <span className="text-xs text-slate-700 font-medium">Pendidik</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>Kelola Guru</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Guru Piket Hari Ini */}
        <div
          onClick={() => onNavigate('jadwal_piket')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Guru Piket Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.guruPiketHariIniCount}</span>
            <span className="text-xs text-emerald-700 font-bold">Bertugas Aktif</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>Lihat Jadwal Piket</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Middle Section: Attendance Breakdown & Duty Piket Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Graphic Attendance Bar Visualization & Filter */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Grafik Kehadiran Siswa</h3>
                  <p className="text-xs text-slate-700">Distribusi status presensi siswa secara menyeluruh</p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                {(['hari', 'minggu', 'bulan', 'semester', 'tahun'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setChartFilter(filter)}
                    className={`px-2.5 py-1.5 rounded-lg capitalize transition-all ${
                      chartFilter === filter
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendance Rate Big Progress Meter */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase">Tingkat Kehadiran Keseluruhan</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {stats.persentaseKehadiran}%
                  <span className="text-xs font-normal text-slate-700 ml-2">
                    ({stats.hadirHariIni + stats.terlambatHariIni + stats.masihDiSekolah} dari {stats.totalSiswa} siswa hadir)
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-64">
                <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(stats.hadirHariIni / (stats.totalSiswa || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Hadir"></div>
                  <div style={{ width: `${(stats.terlambatHariIni / (stats.totalSiswa || 1)) * 100}%` }} className="bg-amber-400 h-full" title="Terlambat"></div>
                  <div style={{ width: `${(stats.masihDiSekolah / (stats.totalSiswa || 1)) * 100}%` }} className="bg-blue-500 h-full" title="Masih di Sekolah"></div>
                  <div style={{ width: `${(stats.lompatPagarHariIni / (stats.totalSiswa || 1)) * 100}%` }} className="bg-purple-500 h-full" title="Lompat Pagar"></div>
                  <div style={{ width: `${(stats.bolosHariIni / (stats.totalSiswa || 1)) * 100}%` }} className="bg-red-950 h-full" title="Bolos"></div>
                  <div style={{ width: `${(stats.alpaHariIni / (stats.totalSiswa || 1)) * 100}%` }} className="bg-rose-500 h-full" title="Alpa"></div>
                </div>
              </div>
            </div>

            {/* Visual Status Breakdown Bars */}
            <div className="mt-5 space-y-3">
              {[
                { label: 'Hadir Tepat Waktu', count: stats.hadirHariIni, color: 'bg-emerald-500', text: 'text-emerald-700' },
                { label: 'Terlambat', count: stats.terlambatHariIni, color: 'bg-amber-400', text: 'text-amber-700' },
                { label: 'Masih di Sekolah (Menunggu Pulang)', count: stats.masihDiSekolah, color: 'bg-blue-500', text: 'text-blue-700' },
                { label: 'Lompat Pagar (Scan Pulang Tanpa Datang)', count: stats.lompatPagarHariIni, color: 'bg-purple-500', text: 'text-purple-700' },
                { label: 'Bolos (Tidak Absen Pulang)', count: stats.bolosHariIni, color: 'bg-red-950', text: 'text-red-950' },
                { label: 'Alpa (Tidak Hadir)', count: stats.alpaHariIni, color: 'bg-rose-500', text: 'text-rose-700' },
              ].map((item, idx) => {
                const max = Math.max(stats.totalSiswa, 1);
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className={`font-bold ${item.text}`}>{item.count} Siswa ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <span>Logika otomatis dieksekusi server GAS</span>
            <button
              onClick={() => onNavigate('rekap_kehadiran')}
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1"
            >
              Lihat Rekap Lengkap &rarr;
            </button>
          </div>
        </div>

        {/* Right: Guru Piket Bertugas Hari Ini Box */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Guru Piket Hari Ini</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                Hari {stats.guruPiketHariIni.length > 0 ? stats.guruPiketHariIni[0].hari : 'Ini'}
              </span>
            </div>

            <p className="text-xs text-slate-700 mt-2">
              Daftar guru yang bertugas memantau scanner di gerbang & pos kehadiran:
            </p>

            <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {stats.guruPiketHariIni.length > 0 ? (
                stats.guruPiketHariIni.map((jadwal, i) => (
                  <div
                    key={jadwal.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {jadwal.namaGuru}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          {jadwal.jamMulai} - {jadwal.jamSelesai} WIB
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                      Bertugas
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-700 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Tidak ada guru piket terjadwal hari ini.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('jadwal_piket')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Kelola Jadwal Piket Mingguan
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Table: Absensi Terbaru & Aktivitas Scan Siswa */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Absensi & Riwayat Scan Terbaru</h3>
            <p className="text-xs text-slate-700">Data presensi hari ini hasil verifikasi QR Code</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('riwayat_scan')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Lihat Riwayat Scan
            </button>
            <button
              onClick={() => onNavigate('rekap_kehadiran')}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
            >
              Buka Rekap Kehadiran
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Foto</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3">NIS</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3 text-center">Jam Datang</th>
                <th className="py-3 px-3 text-center">Jam Pulang</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {absensiList.slice(0, 10).map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-slate-700 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <img
                      src={row.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={row.nama}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{row.nama}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{row.nis}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {row.kelas}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">
                    {row.scanDatang ? (
                      <span className="text-emerald-700">{row.scanDatang}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">
                    {row.scanPulang ? (
                      <span className="text-blue-700">{row.scanPulang}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
