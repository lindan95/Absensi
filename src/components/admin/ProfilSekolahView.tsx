import React, { useState } from 'react';
import { School, Save, Building, Mail, Phone, Globe, UserCheck, HardDrive, Image as ImageIcon } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ProfilSekolah } from '../../types';

interface ProfilSekolahViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const ProfilSekolahView: React.FC<ProfilSekolahViewProps> = ({ onShowToast }) => {
  const [profil, setProfil] = useState<ProfilSekolah>(storageService.getProfilSekolah());
  const pengaturan = storageService.getPengaturan();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveProfilSekolah(profil);
    onShowToast('Berhasil Disimpan', 'Profil sekolah dan identitas berhasil diperbarui.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Profil & Identitas Sekolah</h2>
            <p className="text-xs text-slate-700">
              Informasi profil resmi sekolah yang dicetak pada kartu identitas siswa dan kop laporan presensi
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Nama Resmi Sekolah *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profil.namaSekolah}
                  onChange={(e) => setProfil({ ...profil, namaSekolah: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* NPSN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Nomor Pokok Sekolah Nasional (NPSN) *
              </label>
              <input
                type="text"
                required
                value={profil.npsn}
                onChange={(e) => setProfil({ ...profil, npsn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono font-medium"
              />
            </div>

            {/* Nama Kepala Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Nama Kepala Sekolah *
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profil.kepalaSekolah}
                  onChange={(e) => setProfil({ ...profil, kepalaSekolah: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Nomor Telepon / Kontak
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={profil.telepon}
                  onChange={(e) => setProfil({ ...profil, telepon: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Email Resmi Sekolah
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={profil.email}
                  onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Website Sekolah
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={profil.website}
                  onChange={(e) => setProfil({ ...profil, website: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Alamat Lengkap Sekolah *
            </label>
            <textarea
              rows={3}
              required
              value={profil.alamat}
              onChange={(e) => setProfil({ ...profil, alamat: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
            ></textarea>
          </div>

          {/* Media Links: Logo & Foto Gedung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                URL Logo Sekolah (Google Drive / CDN)
              </label>
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={profil.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80'}
                    alt="Logo Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  value={profil.logo}
                  onChange={(e) => setProfil({ ...profil, logo: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                URL Foto Gedung Sekolah
              </label>
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={profil.fotoSekolah || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'}
                    alt="Sekolah Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  value={profil.fotoSekolah}
                  onChange={(e) => setProfil({ ...profil, fotoSekolah: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Google Drive Storage Folders Status */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Penyimpanan Google Drive Terkonfigurasi</span>
            </div>
            <p className="text-slate-700 text-[11px]">
              Folder Utama: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">ABSENSI SEKOLAH</code> / <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">LOGO SEKOLAH</code>
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              Simpan Profil Sekolah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
