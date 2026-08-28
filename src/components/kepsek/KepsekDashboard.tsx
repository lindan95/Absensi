import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  UserX,
  AlertOctagon,
  CalendarCheck,
  Building2,
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  Sparkles,
  School,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ExportService } from '../../services/exportService';
import { User } from '../../types';

interface KepsekDashboardProps {
  user: User;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const KepsekDashboard: React.FC<KepsekDashboardProps> = ({ user, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'rekap_siswa' | 'rekap_guru' | 'guru_piket' | 'profil'>('monitoring');
  const [periode, setPeriode] = useState<string>('harian');
  const [selectedKelas, setSelectedKelas] = useState<string>('ALL');

  const stats = storageService.getDashboardStats();
  const absensiList = storageService.getAbsensiHarian();
  const guruList = storageService.getGuru();
  const jadwalList = storageService.getJadwalPiket();
  const profil = storageService.getProfilSekolah();
  const kelases = storageService.getKelas();

  const handleExportPDF = () => {
    ExportService.exportAttendancePDF(
      absensiList,
      profil,
      `Laporan Eksekutif ${periode.toUpperCase()}`,
      selectedKelas === 'ALL' ? 'Semua Kelas' : selectedKelas
    );
    onShowToast('Export PDF Berhasil', 'Laporan kehadiran eksekutif berhasil diunduh.', 'success');
  };

  const handleExportExcel = () => {
    ExportService.exportAttendanceExcel(
      absensiList,
      profil,
      `Laporan Eksekutif ${periode.toUpperCase()}`,
      selectedKelas === 'ALL' ? 'Semua Kelas' : selectedKelas
    );
    onShowToast('Export Excel Berhasil', 'File Excel rekap presensi berhasil diunduh.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Executive */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Dashboard Monitoring Kepala Sekolah
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {profil.namaSekolah}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Selamat datang, <span className="font-bold text-white">{user.nama}</span>. Pantau rekapitulasi kehadiran peserta didik, kedisiplinan, serta keaktifan guru piket bertugas.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Download Laporan PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'monitoring', label: 'Ringkasan Monitoring Eksekutif' },
          { key: 'rekap_siswa', label: 'Rekap Kehadiran Siswa' },
          { key: 'guru_piket', label: 'Laporan Guru Piket Bertugas' },
          { key: 'rekap_guru', label: 'Data Kepegawaian Guru' },
          { key: 'profil', label: 'Profil Lembaga Sekolah' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Monitoring Dashboard */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* 4 Primary Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-700 uppercase">Tingkat Kehadiran Siswa</div>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {stats.persentaseKehadiran}%
              </div>
              <p className="text-[11px] text-slate-700 mt-1">
                {stats.hadirHariIni + stats.terlambatHariIni + stats.masihDiSekolah} dari {stats.totalSiswa} siswa hadir
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-700 uppercase">Kedisiplinan (Terlambat)</div>
              <div className="text-3xl font-black text-amber-600 mt-2">
                {stats.terlambatHariIni}
              </div>
              <p className="text-[11px] text-slate-700 mt-1">Siswa terlambat datang</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-700 uppercase">Pelanggaran (Alpa/Bolos)</div>
              <div className="text-3xl font-black text-rose-600 mt-2">
                {stats.alpaHariIni + stats.bolosHariIni + stats.lompatPagarHariIni}
              </div>
              <p className="text-[11px] text-slate-700 mt-1">Alpa, bolos, lompat pagar</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-700 uppercase">Guru Piket Aktif</div>
              <div className="text-3xl font-black text-blue-600 mt-2">
                {stats.guruPiketHariIniCount}
              </div>
              <p className="text-[11px] text-slate-700 mt-1">Guru bertugas memantau</p>
            </div>
          </div>

          {/* Section: Duty Teachers & Class Attendance Rates */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Guru Piket Bertugas Hari Ini</h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Aktif
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {stats.guruPiketHariIni.map((jadwal, i) => (
                  <div
                    key={jadwal.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{jadwal.namaGuru}</h4>
                        <p className="text-[11px] text-slate-700">
                          {jadwal.jamMulai} - {jadwal.jamSelesai} WIB • {jadwal.keterangan}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Standby
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Statistik Per Rombel Kelas</h3>
                <span className="text-xs text-slate-700">{kelases.length} Rombel</span>
              </div>

              <div className="mt-4 space-y-3">
                {kelases.map((k) => (
                  <div
                    key={k.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{k.namaKelas}</span>
                      <span className="text-slate-700 ml-2">Wali: {k.waliKelas}</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {k.jumlahSiswa} Siswa
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Rekap Kehadiran Siswa */}
      {activeTab === 'rekap_siswa' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Tabel Rekap Kehadiran Siswa</h3>
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 hover:bg-rose-100"
              >
                Cetak PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 hover:bg-emerald-100"
              >
                Cetak Excel
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">NIS</th>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3 text-center">Scan Datang</th>
                  <th className="py-3 px-3 text-center">Scan Pulang</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {absensiList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-700">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{item.nis}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.nama}</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">{item.kelas}</td>
                    <td className="py-3 px-3 text-center font-mono">{item.scanDatang || '-'}</td>
                    <td className="py-3 px-3 text-center font-mono">{item.scanPulang || '-'}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-extrabold px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Guru Piket Bertugas */}
      {activeTab === 'guru_piket' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
            Jadwal & Riwayat Tugas Guru Piket
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3">Hari</th>
                  <th className="py-3 px-3">Nama Guru</th>
                  <th className="py-3 px-3">Jam Tugas</th>
                  <th className="py-3 px-3">Pos Tugas</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {jadwalList.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{j.hari}</td>
                    <td className="py-3 px-3 font-bold text-blue-700">{j.namaGuru}</td>
                    <td className="py-3 px-3 font-mono">
                      {j.jamMulai} - {j.jamSelesai} WIB
                    </td>
                    <td className="py-3 px-3">{j.keterangan}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Data Guru */}
      {activeTab === 'rekap_guru' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
            Daftar Tenaga Pendidik & Guru ({guruList.length} Orang)
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">NIP & Nama</th>
                  <th className="py-3 px-3">Jabatan</th>
                  <th className="py-3 px-3">Mata Pelajaran</th>
                  <th className="py-3 px-3">No. HP</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {guruList.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-700">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{g.nama}</div>
                      <div className="text-[10px] font-mono text-slate-700">NIP: {g.nip}</div>
                    </td>
                    <td className="py-3 px-3">{g.jabatan}</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">{g.mapel}</td>
                    <td className="py-3 px-3 font-mono">{g.noHp || '-'}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Profil Sekolah */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <School className="w-6 h-6 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Identitas Resmi Sekolah</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-700 block">Nama Sekolah:</span>
              <span className="font-bold text-slate-900 text-sm">{profil.namaSekolah}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-700 block">NPSN:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{profil.npsn}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-700 block">Kepala Sekolah:</span>
              <span className="font-bold text-slate-900 text-sm">{profil.kepalaSekolah}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-700 block">Kontak & Email:</span>
              <span className="font-medium text-slate-900">{profil.telepon} • {profil.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
