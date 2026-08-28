import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Upload,
  UserCheck,
  Mail,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { storageService } from '../../services/storageService';
import { Guru } from '../../types';
import { Modal } from '../common/Modal';

interface DataGuruViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const DataGuruView: React.FC<DataGuruViewProps> = ({ onShowToast }) => {
  const [guruList, setGuruList] = useState<Guru[]>(storageService.getGuru());
  const [search, setSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [formData, setFormData] = useState<Partial<Guru>>({
    nip: '',
    nama: '',
    jk: 'L',
    jabatan: 'Guru Pengajar',
    mapel: '',
    noHp: '',
    email: '',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: false,
  });

  const refreshData = () => {
    setGuruList(storageService.getGuru());
  };

  const handleOpenAdd = () => {
    setEditingGuru(null);
    setFormData({
      id: `GRU-${String(guruList.length + 1).padStart(3, '0')}`,
      nip: '',
      nama: '',
      jk: 'L',
      jabatan: 'Guru Pengajar',
      mapel: '',
      noHp: '',
      email: '',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'AKTIF',
      isPiket: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({ ...guru });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data guru: ${nama}?`)) {
      storageService.deleteGuru(id);
      refreshData();
      onShowToast('Data Dihapus', `Data guru ${nama} berhasil dihapus.`, 'warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nip) {
      onShowToast('Peringatan', 'Harap lengkapi NIP dan Nama Guru.', 'warning');
      return;
    }

    const guruToSave: Guru = {
      id: editingGuru ? editingGuru.id : formData.id || `GRU-${Date.now()}`,
      nip: formData.nip || '',
      nama: formData.nama || '',
      jk: (formData.jk as 'L' | 'P') || 'L',
      jabatan: formData.jabatan || 'Guru Pengajar',
      mapel: formData.mapel || '',
      noHp: formData.noHp || '',
      email: formData.email || '',
      foto: formData.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: (formData.status as 'AKTIF' | 'NONAKTIF') || 'AKTIF',
      isPiket: Boolean(formData.isPiket),
    };

    storageService.saveGuru(guruToSave);
    refreshData();
    setIsModalOpen(false);
    onShowToast(
      'Data Tersimpan',
      `Data guru ${guruToSave.nama} berhasil ${editingGuru ? 'diperbarui' : 'ditambahkan'}.`,
      'success'
    );
  };

  // Export to Excel
  const handleExportExcel = () => {
    const rows = guruList.map((g, i) => ({
      No: i + 1,
      ID: g.id,
      NIP: g.nip,
      'Nama Guru': g.nama,
      'Jenis Kelamin': g.jk === 'L' ? 'Laki-laki' : 'Perempuan',
      Jabatan: g.jabatan,
      'Mata Pelajaran': g.mapel,
      'No HP': g.noHp,
      Email: g.email,
      Status: g.status,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Guru');
    XLSX.writeFile(wb, `Data_Guru_${new Date().toISOString().slice(0, 10)}.xlsx`);
    onShowToast('Export Berhasil', 'Data guru berhasil diexport ke file Excel.', 'success');
  };

  // Filtered List
  const filteredGuru = guruList.filter((g) => {
    const matchSearch =
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      g.nip.includes(search) ||
      g.mapel.toLowerCase().includes(search.toLowerCase()) ||
      g.jabatan.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'ALL' || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Manajemen Data Guru & Pendidik</h2>
            <p className="text-xs text-slate-700">
              Total {guruList.length} guru & tenaga pendidik terdaftar di sistem presensi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs sm:text-sm border border-emerald-200 flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Guru Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, mapel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Aktif</option>
            <option value="NONAKTIF">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Foto</th>
                <th className="py-3.5 px-4">NIP & Nama Guru</th>
                <th className="py-3.5 px-4">JK</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredGuru.length > 0 ? (
                filteredGuru.map((guru, index) => (
                  <tr key={guru.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-700">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      <img
                        src={guru.foto}
                        alt={guru.nama}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-sm leading-tight">
                        {guru.nama}
                      </div>
                      <div className="text-[11px] font-mono text-slate-700 mt-0.5">
                        NIP: {guru.nip}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                        {guru.jk === 'L' ? 'L' : 'P'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{guru.jabatan}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold">
                        {guru.mapel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1 text-[11px] text-slate-700">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{guru.noHp || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-700">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{guru.email || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          guru.status === 'AKTIF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {guru.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(guru)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Guru"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(guru.id, guru.nama)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-700">
                    Tidak ada data guru yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah/Edit Guru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}
        subtitle="Kelola informasi pengajar dan penugasan piket sekolah"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIP Guru *</label>
              <input
                type="text"
                required
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                placeholder="198001012005011001"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Drs. Ahmad Fauzi, M.Pd"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan</label>
              <input
                type="text"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Guru Pengajar / Guru Piket"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={formData.mapel}
                onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Matematika / TKJ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="081234567890"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="guru@sekolah.sch.id"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Guru</label>
            <input
              type="text"
              value={formData.foto}
              onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.unsplash.com/..."
            />
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
              {editingGuru ? 'Simpan Perubahan' : 'Tambah Guru'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
