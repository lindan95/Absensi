import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  Zap,
  Volume2,
  VolumeX,
  Keyboard,
  CreditCard,
  Search,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import { ScanType, ScanResult, Siswa } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScanType?: ScanType;
  guruPiketNama?: string;
  onScanComplete?: (result: ScanResult) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  defaultScanType = 'DATANG',
  guruPiketNama = 'Guru Piket Bertugas',
  onScanComplete,
}) => {
  const [scanType, setScanType] = useState<ScanType>(defaultScanType);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showDemoCards, setShowDemoCards] = useState<boolean>(false);
  const [demoSearch, setDemoSearch] = useState<string>('');
  const [autoResumeSeconds, setAutoResumeSeconds] = useState<number>(0);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-target-container';
  const autoResumeTimerRef = useRef<number | null>(null);

  const allSiswa = storageService.getSiswa();

  useEffect(() => {
    setScanType(defaultScanType);
  }, [defaultScanType]);

  // Main Scan Processing Logic
  const handleProcessScanCode = useCallback(async (code: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const deviceName = navigator.userAgent.includes('Mobile')
      ? 'Kamera HP Siswa (Web App)'
      : 'Kamera Scanner Komputer (Web App)';

    const result = await storageService.scanKartu(
      code,
      scanType,
      guruPiketNama,
      deviceName
    );

    setLastResult(result);

    // Audio and Visual Feedback
    if (result.success) {
      if (soundEnabled) audioService.playSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch {
        // ignore
      }
    } else if (result.isDuplicate) {
      if (soundEnabled) audioService.playWarning();
    } else {
      if (soundEnabled) audioService.playError();
    }

    if (onScanComplete) {
      onScanComplete(result);
    }

    setIsProcessing(false);

    // Auto resume scanner popup countdown (ready for next card in 3s)
    setAutoResumeSeconds(3);
    if (autoResumeTimerRef.current) clearInterval(autoResumeTimerRef.current);
    
    let count = 3;
    autoResumeTimerRef.current = window.setInterval(() => {
      count -= 1;
      setAutoResumeSeconds(count);
      if (count <= 0) {
        if (autoResumeTimerRef.current) clearInterval(autoResumeTimerRef.current);
        setLastResult(null);
      }
    }, 1000);
  }, [guruPiketNama, isProcessing, onScanComplete, scanType, soundEnabled]);

  // Start Camera with html5-qrcode
  const startScanner = useCallback(async (cameraId?: string) => {
    setCameraError(null);
    try {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch {
          // ignore
        }
      }

      const qrScanner = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = qrScanner;

      // Get cameras
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setAvailableCameras(devices);
        const camToUse = cameraId || (devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'))?.id || devices[0].id);
        setSelectedCameraId(camToUse);

        await qrScanner.start(
          camToUse,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            handleProcessScanCode(decodedText);
          },
          () => {
            // scan failure callback (silent)
          }
        );
        setIsCameraActive(true);
      } else {
        setCameraError('Tidak ada kamera yang terdeteksi pada perangkat ini.');
      }
    } catch (err: unknown) {
      console.error('Camera init error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Permission') || errMsg.includes('NotAllowedError')) {
        setCameraError('Izin akses kamera ditolak. Silakan izinkan akses kamera pada browser atau gunakan mode input manual / kartu demo.');
      } else {
        setCameraError(`Gagal membuka kamera: ${errMsg}. Anda tetap bisa menggunakan input kode manual atau kartu demo di bawah.`);
      }
      setIsCameraActive(false);
    }
  }, [handleProcessScanCode]);

  // Stop camera
  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLastResult(null);
      setCameraError(null);
      // Short delay to ensure DOM container is rendered
      const timeout = setTimeout(() => {
        startScanner();
      }, 300);
      return () => {
        clearTimeout(timeout);
        stopScanner();
        if (autoResumeTimerRef.current) clearInterval(autoResumeTimerRef.current);
      };
    } else {
      stopScanner();
      if (autoResumeTimerRef.current) clearInterval(autoResumeTimerRef.current);
    }
  }, [isOpen, startScanner, stopScanner]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessScanCode(manualCode.trim());
    setManualCode('');
  };

  const handleSelectDemoStudent = (siswa: Siswa) => {
    handleProcessScanCode(siswa.kodeKartu);
  };

  if (!isOpen) return null;

  const filteredDemoSiswa = allSiswa.filter(
    (s) =>
      s.nama.toLowerCase().includes(demoSearch.toLowerCase()) ||
      s.nis.includes(demoSearch) ||
      s.kelas.toLowerCase().includes(demoSearch.toLowerCase()) ||
      s.kodeKartu.toLowerCase().includes(demoSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm no-print animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg leading-tight">Scanner Kartu Presensi Siswa</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Kamera Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Piket: <span className="text-slate-200 font-medium">{guruPiketNama}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scan Type Toggle (DATANG vs PULANG) */}
        <div className="p-3 sm:px-6 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/70">
            <button
              onClick={() => setScanType('DATANG')}
              className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                scanType === 'DATANG'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              SCAN DATANG (MASUK)
            </button>
            <button
              onClick={() => setScanType('PULANG')}
              className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                scanType === 'PULANG'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              SCAN PULANG (SELESAI KBM)
            </button>
          </div>

          {availableCameras.length > 1 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-700 font-medium">Kamera:</span>
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  setSelectedCameraId(e.target.value);
                  startScanner(e.target.value);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
              >
                {availableCameras.map((cam, idx) => (
                  <option key={cam.id} value={cam.id}>
                    {cam.label || `Kamera ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Camera Viewport */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full relative bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 aspect-square max-w-[380px] sm:max-w-[420px] flex items-center justify-center">
              {/* HTML5 QR target DOM element */}
              <div id={scannerContainerId} className="w-full h-full object-cover"></div>

              {/* Viewfinder Overlay Frame */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="w-56 h-56 border-2 border-dashed border-blue-400/80 rounded-2xl relative animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-md"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-md"></div>

                  {/* Laser Scan Line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 transform -translate-y-1/2 animate-bounce"></div>
                </div>
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 text-white p-5 flex flex-col items-center justify-center text-center gap-3">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs">{cameraError}</p>
                  <button
                    onClick={() => startScanner()}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-700 mt-2 text-center flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Arahkan QR Code Kartu Siswa ke kotak scanner di atas
            </p>

            {/* Manual input & Barcode Scanner hardware compatibility */}
            <form onSubmit={handleManualSubmit} className="w-full mt-4 flex gap-2">
              <div className="relative flex-1">
                <Keyboard className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Atau ketik NIS / Kode Kartu (contoh: SISWA-2026-0001)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0"
              >
                Scan Manual
              </button>
            </form>
          </div>

          {/* Right Column: Scan Result Popup & Instant Verification */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {lastResult ? (
              <div
                className={`p-5 rounded-2xl border transition-all animate-in zoom-in-95 duration-200 ${
                  lastResult.success
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-lg shadow-emerald-100'
                    : lastResult.isDuplicate
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-lg shadow-amber-100'
                    : 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-lg shadow-rose-100'
                }`}
              >
                {/* Result Status Header */}
                <div className="flex items-start justify-between gap-2 border-b pb-3 border-black/10">
                  <div className="flex items-center gap-2.5">
                    {lastResult.success ? (
                      <div className="p-2 bg-emerald-600 rounded-xl text-white">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    ) : lastResult.isDuplicate ? (
                      <div className="p-2 bg-amber-600 rounded-xl text-white">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-2 bg-rose-600 rounded-xl text-white">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                        {lastResult.success ? 'PRESENSI DITERIMA' : lastResult.isDuplicate ? 'PERINGATAN SCAN GANDA' : 'SCAN GAGAL'}
                      </span>
                      <h4 className="text-base font-extrabold leading-tight">
                        {lastResult.message}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono bg-black/10 px-2.5 py-1 rounded-lg font-bold">
                    {lastResult.waktu}
                  </span>
                </div>

                {/* Student Info Card (Popup) */}
                {lastResult.siswa ? (
                  <div className="mt-4 flex gap-3.5 items-center bg-white/80 p-3.5 rounded-xl border border-black/5 shadow-xs">
                    <img
                      src={lastResult.siswa.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={lastResult.siswa.nama}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-700 font-mono">
                        NIS: {lastResult.siswa.nis}
                      </div>
                      <h5 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                        {lastResult.siswa.nama}
                      </h5>
                      <div className="text-xs font-medium text-slate-700 mt-0.5">
                        Kelas: <span className="font-bold text-blue-600">{lastResult.siswa.kelas}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                            lastResult.jenisScan === 'DATANG'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          SCAN {lastResult.jenisScan}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-white">
                          Status: {lastResult.statusKehadiran}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-xs opacity-80 leading-relaxed">
                    Data siswa tidak ditemukan di database. Pastikan QR code terdaftar di menu Data Siswa.
                  </div>
                )}

                {/* Auto Resume countdown notice */}
                <div className="mt-3 flex items-center justify-between text-xs opacity-75">
                  <span>Siap membaca kartu berikutnya...</span>
                  {autoResumeSeconds > 0 && (
                    <span className="font-bold">({autoResumeSeconds}s)</span>
                  )}
                </div>
              </div>
            ) : (
              /* Idle Standby State */
              <div className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Menunggu Kartu Siswa</h4>
                <p className="text-xs text-slate-700 mt-1 max-w-xs leading-relaxed">
                  Informasi siswa, foto, jam scan server, dan status kehadiran akan langsung tampil otomatis di sini.
                </p>
              </div>
            )}

            {/* Quick Demo Student Picker Drawer for instant browser testing */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setShowDemoCards(!showDemoCards)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  {showDemoCards ? 'Tutup Daftar Kartu Demo' : 'Tes Langsung: Pilih Kartu Siswa Demo (Klik untuk Scan)'}
                </button>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                  {allSiswa.length} Siswa
                </span>
              </div>

              {showDemoCards && (
                <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari siswa demo..."
                      value={demoSearch}
                      onChange={(e) => setDemoSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {filteredDemoSiswa.map((siswa) => (
                      <div
                        key={siswa.id}
                        onClick={() => handleSelectDemoStudent(siswa)}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={siswa.foto}
                            alt={siswa.nama}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{siswa.nama}</p>
                            <p className="text-[10px] text-slate-700 font-mono">
                              {siswa.nis} • {siswa.kelas} • <span className="font-semibold text-blue-600">{siswa.kodeKartu}</span>
                            </p>
                          </div>
                        </div>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold shrink-0 hover:bg-blue-700">
                          Scan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
