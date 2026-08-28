import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Users, GraduationCap } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Kelas } from '../../types';
import { Modal } from '../common/Modal';

interface DataKelasViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const DataKelasView: React.FC<DataKelasViewProps> = ({ onShowToast }) => {
  const [kelasList, setKelasList] = useState<Kelas[]>(storageService.getKelas());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [formData, setFormData] = useState<Partial<Kelas>>({
    namaKelas: '',
    tingkat: 'X',
    jurusan: 'Rekayasa Perangkat Lunak',
    waliKelas: '',
    jumlahSiswa: 36,
  });

  const guruList = storageService.getGuru();
  const siswaList = storageService.getSiswa();

  const refreshData = () => {
    setKelasList(storageService.getKelas());
  };

  const handleOpenAdd = () => {
    setEditingKelas(null);
    setFormData({
      id: `KLS-${Date.now()}`,
      namaKelas: '',
      tingkat: 'X',
      jurusan: 'Rekayasa Perangkat Lunak',
      waliKelas: guruList[0]?.nama || '',
      jumlahSiswa: 36,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kelas: Kelas) => {
    setEditingKelas(kelas);
    setFormData({ ...kelas });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Hapus rombel kelas: ${nama}?`)) {
      storageService.deleteKelas(id);
      refreshData();
      onShowToast('Kelas Dihapus', `Rombel ${nama} berhasil dihapus.`, 'warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaKelas) {
      onShowToast('Peringatan', 'Nama kelas wajib diisi.', 'warning');
      return;
    }

    const kelasToSave: Kelas = {
      id: editingKelas ? editingKelas.id : formData.id || `KLS-${Date.now()}`,
      namaKelas: formData.namaKelas || '',
      tingkat: formData.tingkat || 'X',
      jurusan: formData.jurusan || '',
      waliKelas: formData.waliKelas || '',
      tahunAjaran: formData.tahunAjaran || '2025/2026',
      status: formData.status || 'AKTIF',
      jumlahSiswa: Number(formData.jumlahSiswa) || 36,
    };

    storageService.saveKelas(kelasToSave);
    refreshData();
    setIsModalOpen(false);
    onShowToast(
      'Berhasil Disimpan',
      `Data kelas ${kelasToSave.namaKelas} berhasil ${editingKelas ? 'diperbarui' : 'ditambahkan'}.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Manajemen Rombongan Belajar (Kelas)</h2>
            <p className="text-xs text-slate-700">
              Total {kelasList.length} kelas aktif terdaftar dalam database sekolah
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Kelas Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kelasList.map((k) => {
          const actualStudentCount = siswaList.filter((s) => s.kelas === k.namaKelas).length;
          return (
            <div
              key={k.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs">
                    Tingkat {k.tingkat}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(k)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(k.id, k.namaKelas)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mt-3">{k.namaKelas}</h3>
                <p className="text-xs text-slate-700 font-medium">{k.jurusan}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Wali Kelas:</span>
                    <span className="font-bold text-slate-800">{k.waliKelas || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah Siswa Terdaftar:</span>
                    <span className="font-bold text-blue-600">
                      {actualStudentCount} / {k.jumlahSiswa} Siswa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingKelas ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
        subtitle="Rombongan belajar siswa untuk presensi harian"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelas *</label>
            <input
              type="text"
              required
              value={formData.namaKelas}
              onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500"
              placeholder="X RPL 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat</label>
              <select
                value={formData.tingkat}
                onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="X">X (Kelas 10)</option>
                <option value="XI">XI (Kelas 11)</option>
                <option value="XII">XII (Kelas 12)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas Kursi</label>
              <input
                type="number"
                value={formData.jumlahSiswa}
                onChange={(e) => setFormData({ ...formData, jumlahSiswa: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kompetensi Keahlian / Jurusan</label>
            <input
              type="text"
              value={formData.jurusan}
              onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Rekayasa Perangkat Lunak"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Wali Kelas</label>
            <select
              value={formData.waliKelas}
              onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">-- Pilih Wali Kelas --</option>
              {guruList.map((g) => (
                <option key={g.id} value={g.nama}>
                  {g.nama} ({g.mapel})
                </option>
              ))}
            </select>
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
              Simpan Data Kelas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
