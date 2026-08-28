import React, { useState } from 'react';
import { History, Search, Filter, Download, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { storageService } from '../../services/storageService';
import { ScanLog } from '../../types';

interface RiwayatScanViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const RiwayatScanView: React.FC<RiwayatScanViewProps> = ({ onShowToast }) => {
  const [scanLogs, setScanLogs] = useState<ScanLog[]>(storageService.getScanLogs());
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterKelas, setFilterKelas] = useState<string>('ALL');

  const kelases = storageService.getKelas();

  const refreshData = () => {
    setScanLogs(storageService.getScanLogs());
    onShowToast('Diperbarui', 'Log riwayat scan berhasil disinkronkan.', 'info');
  };

  const handleExportExcel = () => {
    const rows = filteredLogs.map((log, i) => ({
      No: i + 1,
      'ID Scan': log.id,
      Tanggal: log.tanggal,
      'Waktu Scan': log.jam,
      NIS: log.nis,
      'Nama Siswa': log.nama,
      Kelas: log.kelas,
      'Jenis Scan': log.jenisScan,
      'Status Scan': log.statusHasil,
      'Guru Piket': log.guruPiket,
      Perangkat: log.perangkat,
      Keterangan: log.keterangan || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Scan');
    XLSX.writeFile(wb, `Riwayat_Scan_${new Date().toISOString().slice(0, 10)}.xlsx`);
    onShowToast('Export Berhasil', 'Riwayat log scan berhasil diexport ke Excel.', 'success');
  };

  const filteredLogs = scanLogs.filter((log) => {
    const matchSearch =
      log.nama.toLowerCase().includes(search.toLowerCase()) ||
      log.nis.includes(search) ||
      log.guruPiket.toLowerCase().includes(search.toLowerCase()) ||
      (log.keterangan && log.keterangan.toLowerCase().includes(search.toLowerCase()));

    const matchType = filterType === 'ALL' || log.jenisScan === filterType;
    const matchStatus = filterStatus === 'ALL' || log.statusHasil === filterStatus;
    const matchKelas = filterKelas === 'ALL' || log.kelas === filterKelas;

    return matchSearch && matchType && matchStatus && matchKelas;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Riwayat & Log Scan Siswa</h2>
            <p className="text-xs text-slate-700">
              Audit trail transaksi scan QR kartu presensi dengan rekaman guru piket dan perangkat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Log Excel
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari siswa, NIS, atau nama piket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Jenis Scan Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">Semua Jenis Scan</option>
            <option value="DATANG">Scan Datang</option>
            <option value="PULANG">Scan Pulang</option>
          </select>

          {/* Status Hasil */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">Semua Status</option>
            <option value="BERHASIL">Berhasil</option>
            <option value="DUPLIKAT">Duplikat</option>
            <option value="GAGAL">Gagal</option>
          </select>

          {/* Kelas */}
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
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
      </div>

      {/* Table Log */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">NIS & Kelas</th>
                <th className="py-3.5 px-4 text-center">Jenis Scan</th>
                <th className="py-3.5 px-4 text-center">Hasil Scan</th>
                <th className="py-3.5 px-4">Guru Piket Bertugas</th>
                <th className="py-3.5 px-4">Perangkat</th>
                <th className="py-3.5 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{log.jam} WIB</div>
                      <div className="text-[10px] text-slate-700">{log.tanggal}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.nama}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700">{log.nis}</div>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded text-[10px]">
                        {log.kelas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                          log.jenisScan === 'DATANG'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.jenisScan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.statusHasil === 'BERHASIL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.statusHasil === 'DUPLIKAT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.statusHasil}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">{log.guruPiket}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-700">{log.perangkat}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-700">{log.keterangan || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-700">
                    Tidak ada catatan riwayat scan yang cocok.
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
