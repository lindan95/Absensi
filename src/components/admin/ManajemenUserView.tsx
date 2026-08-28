import React, { useState } from 'react';
import { UserCog, Plus, Edit2, Trash2, Key, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { User, Role } from '../../types';
import { Modal } from '../common/Modal';

interface ManajemenUserViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const ManajemenUserView: React.FC<ManajemenUserViewProps> = ({ onShowToast }) => {
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    nama: '',
    role: 'GURU_PIKET',
    email: '',
    status: 'AKTIF',
    password: '',
  });

  const refreshData = () => {
    setUsers(storageService.getUsers());
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      id: `USR-${Date.now()}`,
      username: '',
      nama: '',
      role: 'GURU_PIKET',
      email: '',
      status: 'AKTIF',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ ...u, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (users.length <= 1) {
      onShowToast('Gagal', 'Tidak dapat menghapus user utama terakhir.', 'error');
      return;
    }
    if (window.confirm(`Hapus akun pengguna: ${nama}?`)) {
      storageService.deleteUser(id);
      refreshData();
      onShowToast('User Dihapus', `Akun ${nama} berhasil dihapus.`, 'warning');
    }
  };

  const handleResetPassword = (u: User) => {
    const newPass = prompt(`Masukkan password baru untuk pengguna ${u.nama}:`, '123456');
    if (newPass) {
      storageService.saveUser({ ...u, password: newPass });
      refreshData();
      onShowToast('Password Diperbarui', `Password untuk ${u.nama} berhasil direset.`, 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.nama) {
      onShowToast('Peringatan', 'Username dan Nama wajib diisi.', 'warning');
      return;
    }

    const userToSave: User = {
      id: editingUser ? editingUser.id : formData.id || `USR-${Date.now()}`,
      username: formData.username || '',
      nama: formData.nama || '',
      role: (formData.role as Role) || 'GURU_PIKET',
      email: formData.email || '',
      status: (formData.status as 'AKTIF' | 'NONAKTIF') || 'AKTIF',
      password: formData.password || (editingUser ? editingUser.password : '123456'),
    };

    storageService.saveUser(userToSave);
    refreshData();
    setIsModalOpen(false);
    onShowToast(
      'User Disimpan',
      `Akun ${userToSave.nama} (${userToSave.role}) berhasil disimpan.`,
      'success'
    );
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">Administrator</span>;
      case 'GURU_PIKET':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">Guru Piket</span>;
      case 'KEPALA_SEKOLAH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300">Kepala Sekolah</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Manajemen Pegawai & Akun Pengguna</h2>
            <p className="text-xs text-slate-700">
              Hak akses sistem presensi: Administrator, Guru Piket, dan Kepala Sekolah
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Akun Pengguna
        </button>
      </div>

      {/* Table Users */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Username Akun</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">Hak Akses (Role)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {users.map((u, idx) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-700">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 text-sm">{u.nama}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{u.username}</td>
                  <td className="py-3.5 px-4 text-slate-700">{u.email || '-'}</td>
                  <td className="py-3.5 px-4 text-center">{getRoleBadge(u.role)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'AKTIF'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleResetPassword(u)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.nama)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal User Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
        subtitle="Kelola username, password, dan hak akses aplikasi"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Pegawai *</label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
              placeholder="Dra. Siti Aminah"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username Login *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                placeholder="guru.piket"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {editingUser ? 'Password Baru (Opsional)' : 'Password Login *'}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                placeholder={editingUser ? 'Biarkan kosong jika tidak diubah' : '••••••'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hak Akses (Role) *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-bold text-blue-700"
              >
                <option value="GURU_PIKET">Guru Piket</option>
                <option value="ADMIN">Administrator</option>
                <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Akun</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="pegawai@sekolah.sch.id"
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
              Simpan Pengguna
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
