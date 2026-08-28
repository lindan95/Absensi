import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  FileSpreadsheet,
  HardDrive,
  ShieldCheck,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { GAS_BACKEND_FILES } from '../../services/gasCodeGenerator';
import { storageService } from '../../services/storageService';

interface GASIntegrationViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const GASIntegrationView: React.FC<GASIntegrationViewProps> = ({ onShowToast }) => {
  const [selectedFile, setSelectedFile] = useState<string>('Code.gs');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [testUrl, setTestUrl] = useState<string>(
    storageService.getPengaturan().gasWebAppUrl || ''
  );
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fileKeys = Object.keys(GAS_BACKEND_FILES);

  const handleCopyCode = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    onShowToast('Kode Disalin', `Kode file ${filename} berhasil disalin ke clipboard.`, 'success');
    setTimeout(() => {
      setCopiedFile(null);
    }, 2000);
  };

  const handleTestConnection = async () => {
    if (!testUrl.trim()) {
      onShowToast('Peringatan', 'Masukkan URL Google Apps Script Web App terlebih dahulu.', 'warning');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      // Save URL to local settings
      const p = storageService.getPengaturan();
      p.gasWebAppUrl = testUrl.trim();
      storageService.savePengaturan(p);

      // Attempt ping
      const res = await fetch(`${testUrl.trim()}?action=ping`, {
        method: 'GET',
        mode: 'no-cors',
      });

      setTestResult('Koneksi Web App terjangkau! Mode Google Apps Script aktif.');
      onShowToast('Koneksi Berhasil', 'Google Apps Script Web App merespons dengan baik.', 'success');
    } catch (err) {
      setTestResult('Gagal menghubungi Web App. Pastikan URL benar dan izin deployment diatur ke "Anyone".');
      onShowToast('Koneksi Gagal', 'Periksa kembali URL dan hak akses deploy.', 'error');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Backend Google Apps Script & Google Sheets
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Panduan Integrasi Google Apps Script (GAS)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Semua kode backend Google Apps Script siap pakai telah digenerate. Salin file-file di bawah ke editor Apps Script spreadsheet Anda untuk mengaktifkan database Google Sheets dan Google Drive 100% gratis tanpa server berbayar.
            </p>
          </div>

          <a
            href="https://script.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            Buka Google Apps Script Editor
          </a>
        </div>
      </div>

      {/* Step by Step Setup Guide */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          5 Langkah Mudah Menghubungkan Google Sheets & Drive
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {[
            {
              step: '1',
              title: 'Buat Google Spreadsheet',
              desc: 'Buka sheets.new, beri nama spreadsheet "Database Presensi Siswa".',
            },
            {
              step: '2',
              title: 'Buka Apps Script',
              desc: 'Klik menu Extensions > Apps Script (Ekstensi > Apps Script).',
            },
            {
              step: '3',
              title: 'Salin Kode File',
              desc: 'Buat file-file script sesuai daftar di bawah dan tempelkan isinya.',
            },
            {
              step: '4',
              title: 'Jalankan setupInitialDatabase()',
              desc: 'Pilih fungsi setupInitialDatabase lalu klik Run untuk inisialisasi sheet otomatis.',
            },
            {
              step: '5',
              title: 'Deploy Web App',
              desc: 'Klik Deploy > New Deployment > Web App. Set Who has access: Anyone.',
            },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                  {item.step}
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{item.title}</h4>
                <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Test Endpoint Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-emerald-600" />
          Uji Sambungan Web App URL (GAS Test Ping)
        </h3>
        <p className="text-xs text-slate-700 mt-1">
          Tempelkan URL Deployment Web App Anda di sini untuk mengaktifkan sinkronisasi live
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleTestConnection}
            disabled={testLoading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {testLoading ? 'Menguji...' : 'Uji Koneksi (Test)'}
          </button>
        </div>

        {testResult && (
          <div className="mt-3 p-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}
      </div>

      {/* Source Code Viewer with Tabs */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
        {/* Code Tabs Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {fileKeys.map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedFile === filename
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {filename}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopyCode(selectedFile, GAS_BACKEND_FILES[selectedFile as keyof typeof GAS_BACKEND_FILES])}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {copiedFile === selectedFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin File {selectedFile}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block Container */}
        <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-900/90">
          <pre>
            <code>{GAS_BACKEND_FILES[selectedFile as keyof typeof GAS_BACKEND_FILES]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
