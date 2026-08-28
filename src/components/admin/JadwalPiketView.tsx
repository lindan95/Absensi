import React, { useState } from 'react';
import { CalendarCheck, Plus, Edit2, Trash2, Clock, Users, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { JadwalPiket } from '../../types';
import { Modal } from '../common/Modal';

interface JadwalPiketViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const JadwalPiketView: React.FC<JadwalPiketViewProps> = ({ onShowToast }) => {
  const [jadwalList, setJadwalList] = useState<JadwalPiket[]>(storageService.getJadwalPiket());
  const [activeDay, setActiveDay] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalPiket | null>(null);

  const guruList = storageService.getGuru();
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const [formData, setFormData] = useState<Partial<JadwalPiket>>({
    hari: 'Senin',
    idGuru: guruList[0]?.id || '',
    namaGuru: guruList[0]?.nama || '',
    jamMulai: '06:30',
    jamSelesai: '15:30',
    keterangan: 'Piket Gerbang & Presensi QR Siswa',
    status: 'AKTIF',
  });

  const refreshData = () => {
    setJadwalList(storageService.getJadwalPiket());
  };

  const handleOpenAdd = () => {
    setEditingJadwal(null);
    setFormData({
      id: `PKT-${Date.now()}`,
      hari: activeDay === 'ALL' ? 'Senin' : activeDay,
      idGuru: guruList[0]?.id || '',
      namaGuru: guruList[0]?.nama || '',
      jamMulai: '06:30',
      jamSelesai: '15:30',
      keterangan: 'Piket Gerbang & Presensi QR Siswa',
      status: 'AKTIF',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (jadwal: JadwalPiket) => {
    setEditingJadwal(jadwal);
    setFormData({ ...jadwal });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, namaGuru: string, hari: string) => {
    if (window.confirm(`Hapus jadwal piket hari ${hari} untuk ${namaGuru}?`)) {
      storageService.deleteJadwalPiket(id);
      refreshData();
      onShowToast('Jadwal Dihapus', `Jadwal piket ${namaGuru} berhasil dihapus.`, 'warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGuru = guruList.find((g) => g.id === formData.idGuru);
    const namaGuru = selectedGuru ? selectedGuru.nama : formData.namaGuru || '';

    const jadwalToSave: JadwalPiket = {
      id: editingJadwal ? editingJadwal.id : formData.id || `PKT-${Date.now()}`,
      hari: formData.hari || 'Senin',
      guruId: formData.idGuru || (formData as any).guruId || 'GRU-001',
      idGuru: formData.idGuru || '',
      namaGuru: namaGuru,
      jamMulai: formData.jamMulai || '06:30',
      jamSelesai: formData.jamSelesai || '15:30',
      keterangan: formData.keterangan || 'Piket Sekolah',
      status: (formData.status as 'AKTIF' | 'NONAKTIF') || 'AKTIF',
    };

    storageService.saveJadwalPiket(jadwalToSave);
    refreshData();
    setIsModalOpen(false);
    onShowToast(
      'Jadwal Disimpan',
      `Jadwal piket ${namaGuru} pada hari ${jadwalToSave.hari} berhasil disimpan.`,
      'success'
    );
  };

  const filteredJadwal = jadwalList.filter(
    (j) => activeDay === 'ALL' || j.hari.toLowerCase() === activeDay.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Jadwal Guru Piket Mingguan</h2>
            <p className="text-xs text-slate-700">
              Penugasan guru piket harian untuk monitoring dan verifikasi presensi scanner kartu
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Jadwal Piket
        </button>
      </div>

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveDay('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeDay === 'ALL'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Hari ({jadwalList.length})
        </button>
        {days.map((day) => {
          const count = jadwalList.filter((j) => j.hari.toLowerCase() === day.toLowerCase()).length;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeDay === day
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{day}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Jadwal */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Hari Bertugas</th>
                <th className="py-3.5 px-4">Nama Guru Piket</th>
                <th className="py-3.5 px-4">Jam Tugas Piket</th>
                <th className="py-3.5 px-4">Keterangan Penugasan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredJadwal.length > 0 ? (
                filteredJadwal.map((jadwal, idx) => (
                  <tr key={jadwal.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-700">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        {jadwal.hari}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {jadwal.namaGuru}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {jadwal.jamMulai} - {jadwal.jamSelesai} WIB
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{jadwal.keterangan || '-'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          jadwal.status === 'AKTIF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {jadwal.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(jadwal)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(jadwal.id, jadwal.namaGuru, jadwal.hari)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-700">
                    Belum ada jadwal piket untuk hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Jadwal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJadwal ? 'Edit Jadwal Piket' : 'Tambah Jadwal Guru Piket'}
        subtitle="Atur hari tugas piket dan jam pemantauan presensi"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hari Bertugas *</label>
              <select
                value={formData.hari}
                onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-bold"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Keaktifan</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'AKTIF' | 'NONAKTIF' })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="AKTIF">AKTIF</option>
                <option value="NONAKTIF">NONAKTIF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Guru Bertugas *</label>
            <select
              value={formData.idGuru}
              onChange={(e) => {
                const gId = e.target.value;
                const g = guruList.find((item) => item.id === gId);
                setFormData({
                  ...formData,
                  idGuru: gId,
                  namaGuru: g ? g.nama : '',
                });
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {guruList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama} ({g.mapel})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai Tugas</label>
              <input
                type="time"
                value={formData.jamMulai}
                onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai Tugas</label>
              <input
                type="time"
                value={formData.jamSelesai}
                onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Pos Tugas</label>
            <input
              type="text"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              placeholder="Pos Gerbang Utama / Pos Gedung Barat"
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
            >
              Simpan Jadwal Piket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
