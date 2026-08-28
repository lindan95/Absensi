import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { User, ProfilSekolah, Siswa, ScanType, ScanResult } from './types';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { QRScannerModal } from './components/scanner/QRScannerModal';
import { StudentCardPrint } from './components/cards/StudentCardPrint';
import { LoginPage } from './components/auth/LoginPage';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfilSekolahView } from './components/admin/ProfilSekolahView';
import { DataGuruView } from './components/admin/DataGuruView';
import { DataSiswaView } from './components/admin/DataSiswaView';
import { DataKelasView } from './components/admin/DataKelasView';
import { JadwalPiketView } from './components/admin/JadwalPiketView';
import { RiwayatScanView } from './components/admin/RiwayatScanView';
import { RekapKehadiranView } from './components/admin/RekapKehadiranView';
import { ManajemenUserView } from './components/admin/ManajemenUserView';
import { PengaturanView } from './components/admin/PengaturanView';
import { GASIntegrationView } from './components/admin/GASIntegrationView';

// Guru Piket & Kepsek Views
import { GuruPiketDashboard } from './components/gurupiket/GuruPiketDashboard';
import { KepsekDashboard } from './components/kepsek/KepsekDashboard';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(storageService.getCurrentUser());
  const [profilSekolah, setProfilSekolah] = useState<ProfilSekolah>(storageService.getProfilSekolah());
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerType, setScannerType] = useState<ScanType>('DATANG');

  // Student Card Print Modal State
  const [isCardPrintOpen, setIsCardPrintOpen] = useState<boolean>(false);
  const [printStudents, setPrintStudents] = useState<Siswa[]>([]);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveMenu('dashboard');
    showToast('Selamat Datang', `Berhasil masuk sebagai ${user.nama} (${user.role}).`, 'success');
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setActiveMenu('dashboard');
    showToast('Logout Berhasil', 'Anda telah keluar dari aplikasi.', 'info');
  };

  const handleOpenScanner = (type: ScanType = 'DATANG') => {
    setScannerType(type);
    setIsScannerOpen(true);
  };

  const handleOpenCardPrint = (students?: Siswa[]) => {
    const listToPrint = students && students.length > 0 ? students : storageService.getSiswa();
    setPrintStudents(listToPrint);
    setIsCardPrintOpen(true);
  };

  const handleScanComplete = (result: ScanResult) => {
    if (result.success) {
      showToast(
        'Presensi Berhasil',
        `${result.siswa?.nama} (${result.siswa?.kelas}) - ${result.jenisScan} berhasil dicatat.`,
        'success'
      );
    } else if (result.isDuplicate) {
      showToast('Peringatan Scan Ganda', result.message, 'warning');
    } else {
      showToast('Scan Gagal', result.message, 'error');
    }
  };

  // If user is not authenticated, show Login Screen
  if (!currentUser) {
    return (
      <>
        <LoginPage
          profil={profilSekolah}
          onLoginSuccess={handleLoginSuccess}
          onOpenQuickScan={() => handleOpenScanner('DATANG')}
        />

        {/* Standalone Quick Scanner (Mode Gerbang) */}
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          defaultScanType={scannerType}
          guruPiketNama="Petugas Gerbang Utama"
          onScanComplete={handleScanComplete}
        />

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // Render view depending on role & active menu
  const renderMainContent = () => {
    // 1. Role ADMIN
    if (currentUser.role === 'ADMIN') {
      switch (activeMenu) {
        case 'dashboard':
          return (
            <AdminDashboard
              onOpenScanner={handleOpenScanner}
              onNavigate={(menu) => setActiveMenu(menu)}
              onOpenCardPrint={() => handleOpenCardPrint()}
            />
          );
        case 'profil_sekolah':
          return <ProfilSekolahView onShowToast={showToast} />;
        case 'data_guru':
          return <DataGuruView onShowToast={showToast} />;
        case 'data_siswa':
          return (
            <DataSiswaView
              onShowToast={showToast}
              onOpenCardPrint={(students) => handleOpenCardPrint(students)}
            />
          );
        case 'jadwal_piket':
          return <JadwalPiketView onShowToast={showToast} />;
        case 'kelas':
          return <DataKelasView onShowToast={showToast} />;
        case 'riwayat_scan':
          return <RiwayatScanView onShowToast={showToast} />;
        case 'rekap_kehadiran':
          return <RekapKehadiranView onShowToast={showToast} />;
        case 'manajemen_user':
          return <ManajemenUserView onShowToast={showToast} />;
        case 'pengaturan':
          return <PengaturanView onShowToast={showToast} />;
        case 'gas_integration':
          return <GASIntegrationView onShowToast={showToast} />;
        default:
          return (
            <AdminDashboard
              onOpenScanner={handleOpenScanner}
              onNavigate={(menu) => setActiveMenu(menu)}
              onOpenCardPrint={() => handleOpenCardPrint()}
            />
          );
      }
    }

    // 2. Role GURU_PIKET
    if (currentUser.role === 'GURU_PIKET') {
      if (activeMenu === 'scan_datang') {
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Scanner Absensi Datang Siswa</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Gunakan kamera atau barcode scanner untuk membaca QR Code pada kartu siswa saat kedatangan.
              </p>
              <button
                onClick={() => handleOpenScanner('DATANG')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30"
              >
                Buka Kamera Scanner Sekarang
              </button>
            </div>
            <GuruPiketDashboard
              user={currentUser}
              activeSubMenu={activeMenu}
              onOpenScanner={handleOpenScanner}
              onNavigate={(menu) => setActiveMenu(menu)}
            />
          </div>
        );
      }
      if (activeMenu === 'scan_pulang') {
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Scanner Absensi Pulang Siswa</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Pastikan siswa melakukan scan kartu pada saat jam kepulangan setelah KBM berakhir.
              </p>
              <button
                onClick={() => handleOpenScanner('PULANG')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30"
              >
                Buka Kamera Scanner Pulang
              </button>
            </div>
            <GuruPiketDashboard
              user={currentUser}
              activeSubMenu={activeMenu}
              onOpenScanner={handleOpenScanner}
              onNavigate={(menu) => setActiveMenu(menu)}
            />
          </div>
        );
      }
      if (activeMenu === 'riwayat_scan') {
        return <RiwayatScanView onShowToast={showToast} />;
      }
      if (activeMenu === 'rekap_kehadiran') {
        return <RekapKehadiranView onShowToast={showToast} />;
      }
      return (
        <GuruPiketDashboard
          user={currentUser}
          activeSubMenu={activeMenu}
          onOpenScanner={handleOpenScanner}
          onNavigate={(menu) => setActiveMenu(menu)}
        />
      );
    }

    // 3. Role KEPALA_SEKOLAH
    if (currentUser.role === 'KEPALA_SEKOLAH') {
      if (activeMenu === 'rekap_siswa') {
        return <RekapKehadiranView onShowToast={showToast} />;
      }
      if (activeMenu === 'profil_sekolah') {
        return <ProfilSekolahView onShowToast={showToast} />;
      }
      return <KepsekDashboard user={currentUser} onShowToast={showToast} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <Header
        user={currentUser}
        profil={profilSekolah}
        onLogout={handleLogout}
        onOpenScanner={handleOpenScanner}
        onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenGASModal={
          currentUser.role === 'ADMIN' ? () => setActiveMenu('gas_integration') : undefined
        }
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          role={currentUser.role}
          activeMenu={activeMenu}
          onSelectMenu={(menuKey) => setActiveMenu(menuKey)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          {renderMainContent()}
        </main>
      </div>

      {/* Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        defaultScanType={scannerType}
        guruPiketNama={currentUser.nama}
        onScanComplete={handleScanComplete}
      />

      {/* Printable ID Card Batch Sheet */}
      {isCardPrintOpen && (
        <StudentCardPrint
          students={printStudents}
          profil={profilSekolah}
          onClose={() => setIsCardPrintOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
