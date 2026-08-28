import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Printer,
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ExportService } from '../../services/exportService';
import { AbsensiHarian, AttendanceStatus } from '../../types';

interface RekapKehadiranViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const RekapKehadiranView: React.FC<RekapKehadiranViewProps> = ({ onShowToast }) => {
  const [periode, setPeriode] = useState<'harian' | 'mingguan' | 'bulanan' | 'semester' | 'tahunan'>('harian');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedKelas, setSelectedKelas] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const absensiList = storageService.getAbsensiHarian();
  const kelases = storageService.getKelas();
  const profil = storageService.getProfilSekolah();

  // Export handlers
  const handleExportPDF = () => {
    ExportService.exportAttendancePDF(
      filteredData,
      profil,
      `${periode.toUpperCase()} (${selectedDate})`,
      selectedKelas === 'ALL' ? 'Semua Kelas' : selectedKelas
    );
    onShowToast('Export PDF Berhasil', 'Laporan kehadiran resmi PDF berhasil diunduh.', 'success');
  };

  const handleExportExcel = () => {
    ExportService.exportAttendanceExcel(
      filteredData,
      profil,
      `${periode.toUpperCase()} (${selectedDate})`,
      selectedKelas === 'ALL' ? 'Semua Kelas' : selectedKelas
    );
    onShowToast('Export Excel Berhasil', 'File rekap kehadiran Excel (.xlsx) berhasil diunduh.', 'success');
  };

  const handleExportCSV = () => {
    ExportService.exportAttendanceCSV(
      filteredData,
      `Rekap_Kehadiran_${selectedKelas}_${selectedDate}.csv`
    );
    onShowToast('Export CSV Berhasil', 'File CSV berhasil diunduh.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Status Badge Helper
  const renderStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'HADIR':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Hadir
          </span>
        );
      case 'TERLAMBAT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            Terlambat
          </span>
        );
      case 'ALPA':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
            Alpa
          </span>
        );
      case 'BOLOS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-950 text-red-100 border border-red-800">
            Bolos
          </span>
        );
      case 'LOMPAT PAGAR':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300">
            Lompat Pagar
          </span>
        );
      case 'MASIH DI SEKOLAH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
            Masih di Sekolah
          </span>
        );
      case 'BELUM ABSEN':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Belum Absen
          </span>
        );
    }
  };

  // Filter Data
  const filteredData = absensiList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nis.includes(search);

    const matchKelas = selectedKelas === 'ALL' || item.kelas === selectedKelas;
    const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchSearch && matchKelas && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Printable School Header (Only appears on window.print()) */}
      <div className="hidden print:block text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-xl font-black uppercase">{profil.namaSekolah}</h1>
        <p className="text-xs">
          NPSN: {profil.npsn} | Telp: {profil.telepon} | Email: {profil.email}
        </p>
        <p className="text-xs">{profil.alamat}</p>
        <div className="mt-3 font-bold text-sm border-t pt-2">
          LAPORAN REKAPITULASI KEHADIRAN SISWA ({periode.toUpperCase()})
        </div>
        <div className="text-xs flex justify-between mt-1">
          <span>Kelas: {selectedKelas === 'ALL' ? 'Semua Kelas' : selectedKelas}</span>
          <span>Tanggal: {selectedDate}</span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Rekap Kehadiran Siswa</h2>
            <p className="text-xs text-slate-700">
              Laporan kehadiran harian, mingguan, bulanan, semester, dan tahunan sesuai kalkulasi sistem
            </p>
          </div>
        </div>

        {/* Action Buttons for Exporting */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs sm:text-sm border border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            PDF Kop Resmi
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs sm:text-sm border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Excel (.xlsx)
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Periode Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 no-print">
        {/* Periode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['harian', 'mingguan', 'bulanan', 'semester', 'tahunan'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  periode === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Rekap {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-700 font-bold">Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold"
            />
          </div>
        </div>

        {/* Search and Dropdowns */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Filter Kelas */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-700">Kelas:</span>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value="ALL">Semua Kelas</option>
                {kelases.map((k) => (
                  <option key={k.id} value={k.namaKelas}>
                    {k.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-700">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value="ALL">Semua Status</option>
                <option value="HADIR">Hadir</option>
                <option value="TERLAMBAT">Terlambat</option>
                <option value="MASIH DI SEKOLAH">Masih di Sekolah</option>
                <option value="LOMPAT PAGAR">Lompat Pagar</option>
                <option value="BOLOS">Bolos</option>
                <option value="ALPA">Alpa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider print:bg-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center">No</th>
                <th className="py-3.5 px-4">NIS</th>
                <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                <th className="py-3.5 px-4 text-center">Kelas</th>
                <th className="py-3.5 px-4 text-center">Scan Datang</th>
                <th className="py-3.5 px-4 text-center">Scan Pulang</th>
                <th className="py-3.5 px-4 text-center">Status Kehadiran</th>
                <th className="py-3.5 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{item.nis}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.nama}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                        {item.kelas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">
                      {item.scanDatang ? (
                        <span className="text-emerald-700 font-bold">{item.scanDatang}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">
                      {item.scanPulang ? (
                        <span className="text-blue-700 font-bold">{item.scanPulang}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">{renderStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-slate-700">{item.keterangan || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-700">
                    Tidak ada data rekap presensi sesuai filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
