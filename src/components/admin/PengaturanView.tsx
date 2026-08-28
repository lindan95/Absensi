import React, { useState } from 'react';
import { Settings, Save, Clock, Calendar, Volume2, ShieldAlert, RotateCcw, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Pengaturan } from '../../types';

interface PengaturanViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({ onShowToast }) => {
  const [pengaturan, setPengaturan] = useState<Pengaturan>(storageService.getPengaturan());

  const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.savePengaturan(pengaturan);
    onShowToast('Pengaturan Disimpan', 'Parameter jam presensi dan integrasi berhasil diperbarui.', 'success');
  };

  const handleToggleDay = (day: string) => {
    const current = pengaturan.hariAktifSekolah || [];
    if (current.includes(day)) {
      setPengaturan({ ...pengaturan, hariAktifSekolah: current.filter((d) => d !== day) });
    } else {
      setPengaturan({ ...pengaturan, hariAktifSekolah: [...current, day] });
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset semua data kembali ke data contoh awal (Demo)? Semua data scan hari ini akan disegarkan.')) {
      storageService.resetToDemoData();
      onShowToast('Data Direset', 'Database lokal berhasil disegarkan dengan data contoh lengkap.', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Pengaturan Sistem & Waktu Presensi</h2>
            <p className="text-xs text-slate-700">
              Konfigurasi jam masuk, toleransi keterlambatan, jam pulang, dan endpoint Google Sheets
            </p>
          </div>
        </div>

        <button
          onClick={handleResetDemoData}
          className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold rounded-xl text-xs sm:text-sm border border-slate-200 flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Database Demo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Pengaturan Waktu & Jam Presensi */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-extrabold text-slate-900 text-base">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Konfigurasi Jam Presensi Sekolah</span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Jam Masuk */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">
                1. Jam Masuk Sekolah *
              </label>
              <p className="text-[11px] text-slate-700">Scan &le; jam ini berstatus HADIR</p>
              <input
                type="time"
                required
                value={pengaturan.jamMasuk}
                onChange={(e) => setPengaturan({ ...pengaturan, jamMasuk: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Batas Terlambat */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
              <label className="block text-xs font-extrabold text-amber-900 uppercase">
                2. Batas Terlambat *
              </label>
              <p className="text-[11px] text-amber-700">Toleransi waktu kedatangan siswa</p>
              <input
                type="time"
                required
                value={pengaturan.batasWaktuTerlambat}
                onChange={(e) => setPengaturan({ ...pengaturan, batasWaktuTerlambat: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-amber-300 rounded-xl font-mono font-bold bg-white focus:ring-2 focus:ring-amber-500 text-amber-900"
              />
            </div>

            {/* Jam Pulang */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">
                3. Jam Pulang Sekolah *
              </label>
              <p className="text-[11px] text-slate-700">Waktu dimulainya scan pulang</p>
              <input
                type="time"
                required
                value={pengaturan.jamPulang}
                onChange={(e) => setPengaturan({ ...pengaturan, jamPulang: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Batas Akhir Scan Pulang */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase">
                4. Batas Akhir Scan Pulang *
              </label>
              <p className="text-[11px] text-slate-700">Penutupan presensi harian</p>
              <input
                type="time"
                required
                value={pengaturan.batasAkhirScanPulang}
                onChange={(e) => setPengaturan({ ...pengaturan, batasAkhirScanPulang: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Hari Aktif Sekolah */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Hari Aktif Sekolah (KBM Berlangsung)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {daysList.map((day) => {
                const isActive = (pengaturan.hariAktifSekolah || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day} {isActive ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: Pengaturan Audio, Notifikasi & Status Sistem */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-extrabold text-slate-900 text-base">
            <Volume2 className="w-5 h-5 text-emerald-600" />
            <span>Notifikasi Audio & Status Operasional</span>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-sm text-slate-900">Suara / Audio Scanner (Web Audio)</div>
                <p className="text-xs text-slate-700 mt-0.5">
                  Mainkan nada konfirmasi beep berhasil / nada peringatan scan ganda / error
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pengaturan.notifikasiScanAudio}
                  onChange={(e) => setPengaturan({ ...pengaturan, notifikasiScanAudio: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-sm text-slate-900">Status Operasional Sistem</div>
                <p className="text-xs text-slate-700 mt-0.5">
                  Bila libur, proses kalkulasi alpa otomatis ditiadakan
                </p>
              </div>
              <select
                value={pengaturan.statusSistem}
                onChange={(e) => setPengaturan({ ...pengaturan, statusSistem: e.target.value as 'AKTIF' | 'LIBUR' })}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold"
              >
                <option value="AKTIF">AKTIF (KBM Normal)</option>
                <option value="LIBUR">LIBUR (Sekolah Libur)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Integrasi Google Apps Script (GAS) Endpoint */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-extrabold text-slate-900 text-base">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Integrasi Google Apps Script Web App (GAS URL)</span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                URL Google Apps Script Web App (Exec Endpoint)
              </label>
              <input
                type="text"
                value={pengaturan.gasWebAppUrl || ''}
                onChange={(e) => setPengaturan({ ...pengaturan, gasWebAppUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              />
              <p className="text-[11px] text-slate-700 mt-1">
                Dapatkan URL ini setelah deploy Google Apps Script dengan opsi <span className="font-semibold">"Who has access: Anyone"</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            Simpan Semua Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};
