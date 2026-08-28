import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Upload,
  Printer,
  QrCode,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Filter,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { storageService } from '../../services/storageService';
import { Siswa } from '../../types';
import { Modal } from '../common/Modal';

interface DataSiswaViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
  onOpenCardPrint: (students: Siswa[]) => void;
}

export const DataSiswaView: React.FC<DataSiswaViewProps> = ({
  onShowToast,
  onOpenCardPrint,
}) => {
  const [siswaList, setSiswaList] = useState<Siswa[]>(storageService.getSiswa());
  const [search, setSearch] = useState<string>('');
  const [filterKelas, setFilterKelas] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [formData, setFormData] = useState<Partial<Siswa>>({
    nis: '',
    nisn: '',
    nama: '',
    jk: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2008-01-01',
    kelas: 'X RPL 1',
    jurusan: 'Rekayasa Perangkat Lunak',
    noHpWali: '08123456789',
    wali: '',
    alamat: 'Jl. Merdeka No. 1',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kodeKartu: '',
    status: 'AKTIF',
  });

  const kelases = storageService.getKelas();

  const refreshData = () => {
    setSiswaList(storageService.getSiswa());
  };

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    const nextNis = `2026${String(siswaList.length + 1).padStart(4, '0')}`;
    setFormData({
      id: `SIS-${Date.now()}`,
      nis: nextNis,
      nisn: `00${nextNis}`,
      nama: '',
      jk: 'L',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2008-05-15',
      kelas: kelases.length > 0 ? kelases[0].namaKelas : 'X RPL 1',
      jurusan: 'Rekayasa Perangkat Lunak',
      noHpWali: '081234567890',
      wali: 'Orang Tua Siswa',
      alamat: 'Jl. Pendidikan No. 10',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      kodeKartu: `SISWA-${nextNis}`,
      status: 'AKTIF',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setFormData({ ...siswa });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Hapus data siswa: ${nama}?`)) {
      storageService.deleteSiswa(id);
      refreshData();
      onShowToast('Data Dihapus', `Data siswa ${nama} berhasil dihapus.`, 'warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nis) {
      onShowToast('Peringatan', 'Harap isi NIS dan Nama Siswa.', 'warning');
      return;
    }

    const siswaToSave: Siswa = {
      id: editingSiswa ? editingSiswa.id : formData.id || `SIS-${Date.now()}`,
      nis: formData.nis || '',
      nisn: formData.nisn || '',
      nama: formData.nama || '',
      jk: (formData.jk as 'L' | 'P') || 'L',
      tempatLahir: formData.tempatLahir || '',
      tanggalLahir: formData.tanggalLahir || '',
      kelas: formData.kelas || 'X RPL 1',
      jurusan: formData.jurusan || 'RPL',
      noHp: formData.noHpWali || formData.noHp || '',
      noHpWali: formData.noHpWali || '',
      wali: formData.wali || '',
      alamat: formData.alamat || '',
      foto: formData.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      kodeKartu: formData.kodeKartu || `SISWA-${formData.nis}`,
      status: (formData.status as 'AKTIF' | 'NONAKTIF') || 'AKTIF',
    };

    storageService.saveSiswa(siswaToSave);
    refreshData();
    setIsModalOpen(false);
    onShowToast(
      'Data Tersimpan',
      `Data siswa ${siswaToSave.nama} & Kode Kartu ${siswaToSave.kodeKartu} berhasil disimpan.`,
      'success'
    );
  };

  // Checkbox Selection for batch printing
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredSiswa.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSiswa.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Print Batch
  const handlePrintBatch = () => {
    const targetStudents =
      selectedIds.length > 0
        ? siswaList.filter((s) => selectedIds.includes(s.id))
        : filteredSiswa;

    if (targetStudents.length === 0) {
      onShowToast('Peringatan', 'Tidak ada siswa yang dipilih untuk dicetak.', 'warning');
      return;
    }
    onOpenCardPrint(targetStudents);
  };

  // Export Excel
  const handleExportExcel = () => {
    const rows = siswaList.map((s, i) => ({
      No: i + 1,
      NIS: s.nis,
      NISN: s.nisn,
      'Nama Siswa': s.nama,
      JK: s.jk === 'L' ? 'Laki-laki' : 'Perempuan',
      Kelas: s.kelas,
      Jurusan: s.jurusan,
      'Tempat Lahir': s.tempatLahir,
      'Tanggal Lahir': s.tanggalLahir,
      'Nama Wali': s.wali,
      'No HP Wali': s.noHpWali,
      Alamat: s.alamat,
      'Kode Kartu QR': s.kodeKartu,
      Status: s.status,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
    XLSX.writeFile(wb, `Data_Siswa_${new Date().toISOString().slice(0, 10)}.xlsx`);
    onShowToast('Export Berhasil', 'Data siswa berhasil diexport ke Excel.', 'success');
  };

  // Filtered list
  const filteredSiswa = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.kodeKartu.toLowerCase().includes(search.toLowerCase()) ||
      (s.wali && s.wali.toLowerCase().includes(search.toLowerCase()));

    const matchKelas = filterKelas === 'ALL' || s.kelas === filterKelas;
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;

    return matchSearch && matchKelas && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Manajemen Data Siswa</h2>
            <p className="text-xs text-slate-700">
              Total {siswaList.length} siswa terdaftar • Dilengkapi generator QR Code & Kartu Presensi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs sm:text-sm border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Excel
          </button>
          <button
            onClick={handlePrintBatch}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu Siswa ({selectedIds.length > 0 ? selectedIds.length : filteredSiswa.length})
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NIS, kode kartu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-700">Kelas:</span>
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

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value="ALL">Semua Status</option>
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Data Siswa */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredSiswa.length && filteredSiswa.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3.5 px-3">No</th>
                <th className="py-3.5 px-3">Foto</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">NIS / NISN</th>
                <th className="py-3.5 px-4">Kelas & Jurusan</th>
                <th className="py-3.5 px-4">Kode Kartu QR</th>
                <th className="py-3.5 px-4">Wali / Kontak</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSiswa.length > 0 ? (
                filteredSiswa.map((siswa, idx) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(siswa.id)}
                        onChange={() => handleToggleSelect(siswa.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <img
                        src={siswa.foto}
                        alt={siswa.nama}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 text-sm leading-tight">
                        {siswa.nama}
                      </div>
                      <div className="text-[11px] text-slate-700 mt-0.5">
                        {siswa.jk === 'L' ? 'Laki-laki' : 'Perempuan'} • {siswa.tempatLahir}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-800">{siswa.nis}</div>
                      <div className="text-[10px] text-slate-700">NISN: {siswa.nisn || '-'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {siswa.kelas}
                      </span>
                      <div className="text-[10px] text-slate-700 mt-0.5">{siswa.jurusan}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                        <QrCode className="w-3 h-3 text-blue-600" />
                        {siswa.kodeKartu}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{siswa.wali || '-'}</div>
                      <div className="text-[10px] text-slate-700 font-mono">{siswa.noHpWali || '-'}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          siswa.status === 'AKTIF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {siswa.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenCardPrint([siswa])}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Cetak Kartu Siswa Ini"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(siswa)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(siswa.id, siswa.nama)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-700">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit Siswa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        subtitle="Data siswa akan langsung terdaftar di Google Sheets & siap dibuatkan QR Code"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Induk Siswa (NIS) *</label>
              <input
                type="text"
                required
                value={formData.nis}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    nis: val,
                    kodeKartu: formData.kodeKartu || `SISWA-${val}`,
                  });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                placeholder="20260001"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NISN</label>
              <input
                type="text"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                placeholder="0012345678"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                placeholder="Ahmad Fauzan Rabbani"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={formData.jk}
                onChange={(e) => setFormData({ ...formData, jk: e.target.value as 'L' | 'P' })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas *</label>
              <select
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-bold text-blue-700"
              >
                {kelases.map((k) => (
                  <option key={k.id} value={k.namaKelas}>
                    {k.namaKelas} ({k.jurusan})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan / Peminatan</label>
              <input
                type="text"
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Rekayasa Perangkat Lunak"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kode Kartu QR Code *</label>
              <input
                type="text"
                required
                value={formData.kodeKartu}
                onChange={(e) => setFormData({ ...formData, kodeKartu: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono font-bold bg-slate-50 focus:ring-2 focus:ring-blue-500"
                placeholder="SISWA-2026-0001"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Jakarta"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={formData.wali}
                onChange={(e) => setFormData({ ...formData, wali: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Bapak / Ibu"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor HP / WhatsApp Wali</label>
              <input
                type="text"
                value={formData.noHpWali}
                onChange={(e) => setFormData({ ...formData, noHpWali: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="081234567890"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
            <textarea
              rows={2}
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Siswa</label>
              <input
                type="text"
                value={formData.foto}
                onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Keaktifan</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'AKTIF' | 'NONAKTIF' })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="AKTIF">AKTIF</option>
                <option value="NONAKTIF">NONAKTIF</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
            >
              {editingSiswa ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
