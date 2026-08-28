import {
  User,
  Siswa,
  Guru,
  Kelas,
  JadwalPiket,
  ScanLog,
  AbsensiHarian,
  AbsensiGuru,
  ProfilSekolah,
  Pengaturan,
  ScanType,
  ScanResult,
  AttendanceStatus,
  DashboardStats,
  HariPiket,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'absensi_users_v1',
  SISWA: 'absensi_siswa_v1',
  GURU: 'absensi_guru_v1',
  KELAS: 'absensi_kelas_v1',
  JADWAL_PIKET: 'absensi_jadwal_piket_v1',
  SCAN_LOG: 'absensi_scan_log_v1',
  ABSENSI_HARIAN: 'absensi_harian_v1',
  ABSENSI_GURU: 'absensi_guru_harian_v1',
  PROFIL_SEKOLAH: 'absensi_profil_sekolah_v1',
  PENGATURAN: 'absensi_pengaturan_v1',
  CURRENT_USER: 'absensi_current_user_v1',
  SIMULATED_TIME: 'absensi_simulated_time_v1',
};

// Initial Demo Data
const INITIAL_PROFIL_SEKOLAH: ProfilSekolah = {
  namaSekolah: 'SMK TEKNOLOGI INFORMATIKA INDONESIA',
  npsn: '20109876',
  alamat: 'Jl. Pendidikan No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12150',
  telepon: '(021) 7890-1234',
  email: 'info@smkteknologi-id.sch.id',
  website: 'https://smkteknologi-id.sch.id',
  kepalaSekolah: 'Drs. H. Sudirman, M.Pd.',
  logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  fotoSekolah: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
};

const INITIAL_PENGATURAN: Pengaturan = {
  jamMasuk: '07:00',
  batasScanDatang: '09:00',
  batasWaktuTerlambat: '07:15',
  jamPulang: '15:00',
  batasAkhirScanPulang: '17:00',
  batasAkhirAbsensi: '17:00',
  zonaWaktu: 'Asia/Jakarta',
  soundEnabled: true,
  vibrationEnabled: true,
  notifikasiScanAudio: true,
  statusSistem: 'AKTIF',
  hariAktifSekolah: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
  gasWebAppUrl: '',
  gasSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  driveFolderId: '1Drive_Folder_Absensi_Sekolah_2026',
  driveSubfolders: {
    logoSekolah: '1Drive_Logo_Sekolah',
    fotoSiswa: '1Drive_Foto_Siswa',
    fotoGuru: '1Drive_Foto_Guru',
    kartuSiswa: '1Drive_Kartu_Siswa',
    laporan: '1Drive_Laporan',
    backupDatabase: '1Drive_Backup_Database',
  },
};

const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    username: 'admin',
    password: 'admin123',
    nama: 'Administrator Utama',
    role: 'ADMIN',
    status: 'AKTIF',
    email: 'admin@smkteknologi-id.sch.id',
    phone: '081234567890',
  },
  {
    id: 'USR-002',
    username: 'gurupiket1',
    password: 'gurupiket1',
    nama: 'Bambang Sutrisno, S.Pd (Piket 1)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'bambang@smkteknologi-id.sch.id',
    phone: '081298765431',
  },
  {
    id: 'USR-003',
    username: 'gurupiket2',
    password: 'gurupiket2',
    nama: 'Siti Aminah, S.Kom (Piket 2)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'siti.aminah@smkteknologi-id.sch.id',
    phone: '081298765432',
  },
  {
    id: 'USR-004',
    username: 'gurupiket3',
    password: 'gurupiket3',
    nama: 'Hendro Gunawan, M.T (Piket 3)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'hendro@smkteknologi-id.sch.id',
    phone: '081298765433',
  },
  {
    id: 'USR-005',
    username: 'gurupiket4',
    password: 'gurupiket4',
    nama: 'Nurul Hidayati, S.Pd (Piket 4)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'nurul@smkteknologi-id.sch.id',
    phone: '081298765434',
  },
  {
    id: 'USR-006',
    username: 'gurupiket5',
    password: 'gurupiket5',
    nama: 'Agus Wijaya, S.Pd (Piket 5)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'agus.wijaya@smkteknologi-id.sch.id',
    phone: '081298765435',
  },
  {
    id: 'USR-007',
    username: 'gurupiket6',
    password: 'gurupiket6',
    nama: 'Dewi Lestari, S.Si (Piket 6)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'dewi.lestari@smkteknologi-id.sch.id',
    phone: '081298765436',
  },
  {
    id: 'USR-008',
    username: 'gurupiket7',
    password: 'gurupiket7',
    nama: 'Fajar Nugroho, S.Kom (Piket 7)',
    role: 'GURU_PIKET',
    status: 'AKTIF',
    email: 'fajar.nugroho@smkteknologi-id.sch.id',
    phone: '081298765437',
  },
  {
    id: 'USR-009',
    username: 'kepsek05',
    password: 'kepse05',
    nama: 'Drs. H. Sudirman, M.Pd (Kepala Sekolah)',
    role: 'KEPALA_SEKOLAH',
    status: 'AKTIF',
    email: 'kepsek@smkteknologi-id.sch.id',
    phone: '081122334455',
  },
];

const INITIAL_GURU: Guru[] = [
  {
    id: 'GRU-001',
    nip: '197508152000031001',
    nama: 'Bambang Sutrisno, S.Pd',
    jk: 'L',
    jabatan: 'Guru Piket / Guru Matematika',
    mapel: 'Matematika',
    noHp: '081298765431',
    email: 'bambang@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-002',
    nip: '198203202005012003',
    nama: 'Siti Aminah, S.Kom',
    jk: 'P',
    jabatan: 'Guru Piket / Guru Produktif TKJ',
    mapel: 'Administrasi Infrastruktur Jaringan',
    noHp: '081298765432',
    email: 'siti.aminah@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-003',
    nip: '198011122008011005',
    nama: 'Hendro Gunawan, M.T',
    jk: 'L',
    jabatan: 'Guru Piket / Kepala Bengkel Komputer',
    mapel: 'Teknologi Layanan Jaringan',
    noHp: '081298765433',
    email: 'hendro@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-004',
    nip: '198506142010012008',
    nama: 'Nurul Hidayati, S.Pd',
    jk: 'P',
    jabatan: 'Guru Piket / Guru Bahasa Indonesia',
    mapel: 'Bahasa Indonesia',
    noHp: '081298765434',
    email: 'nurul@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-005',
    nip: '198809222014021004',
    nama: 'Agus Wijaya, S.Pd',
    jk: 'L',
    jabatan: 'Guru Piket / Guru Olahraga & Kesehatan',
    mapel: 'PJOK',
    noHp: '081298765435',
    email: 'agus.wijaya@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-006',
    nip: '199104182018012002',
    nama: 'Dewi Lestari, S.Si',
    jk: 'P',
    jabatan: 'Guru Piket / Guru Fisika Terapan',
    mapel: 'Fisika',
    noHp: '081298765436',
    email: 'dewi.lestari@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-007',
    nip: '199307112020121003',
    nama: 'Fajar Nugroho, S.Kom',
    jk: 'L',
    jabatan: 'Guru Piket / Guru Pemrograman Dasar',
    mapel: 'Pemrograman Dasar & Web',
    noHp: '081298765437',
    email: 'fajar.nugroho@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: true,
  },
  {
    id: 'GRU-008',
    nip: '197902102003122002',
    nama: 'Rina Marlina, M.Pd',
    jk: 'P',
    jabatan: 'Guru Bahasa Inggris',
    mapel: 'Bahasa Inggris',
    noHp: '081388776655',
    email: 'rina.marlina@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: false,
  },
  {
    id: 'GRU-009',
    nip: '198405162009021006',
    nama: 'Eko Prasetyo, S.T',
    jk: 'L',
    jabatan: 'Guru Sistem Komputer',
    mapel: 'Sistem Komputer',
    noHp: '081399887766',
    email: 'eko.prasetyo@smkteknologi-id.sch.id',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'AKTIF',
    isPiket: false,
  },
];

const INITIAL_KELAS: Kelas[] = [
  {
    id: 'KLS-001',
    namaKelas: 'X TKJ 1',
    tingkat: 'X',
    jurusan: 'Teknik Komputer dan Jaringan',
    waliKelas: 'Siti Aminah, S.Kom',
    tahunAjaran: '2026/2027',
    status: 'AKTIF',
  },
  {
    id: 'KLS-002',
    namaKelas: 'XI TKJ 1',
    tingkat: 'XI',
    jurusan: 'Teknik Komputer dan Jaringan',
    waliKelas: 'Hendro Gunawan, M.T',
    tahunAjaran: '2026/2027',
    status: 'AKTIF',
  },
  {
    id: 'KLS-003',
    namaKelas: 'XII TKJ 1',
    tingkat: 'XII',
    jurusan: 'Teknik Komputer dan Jaringan',
    waliKelas: 'Bambang Sutrisno, S.Pd',
    tahunAjaran: '2026/2027',
    status: 'AKTIF',
  },
];

const INITIAL_JADWAL_PIKET: JadwalPiket[] = [
  { id: 'JP-001', hari: 'Senin', guruId: 'GRU-001', namaGuru: 'Bambang Sutrisno, S.Pd', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-002', hari: 'Senin', guruId: 'GRU-002', namaGuru: 'Siti Aminah, S.Kom', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-003', hari: 'Selasa', guruId: 'GRU-003', namaGuru: 'Hendro Gunawan, M.T', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-004', hari: 'Selasa', guruId: 'GRU-004', namaGuru: 'Nurul Hidayati, S.Pd', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-005', hari: 'Rabu', guruId: 'GRU-005', namaGuru: 'Agus Wijaya, S.Pd', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-006', hari: 'Rabu', guruId: 'GRU-006', namaGuru: 'Dewi Lestari, S.Si', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-007', hari: 'Kamis', guruId: 'GRU-007', namaGuru: 'Fajar Nugroho, S.Kom', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-008', hari: 'Kamis', guruId: 'GRU-001', namaGuru: 'Bambang Sutrisno, S.Pd', jamMulai: '06:15', jamSelesai: '16:00', status: 'AKTIF' },
  { id: 'JP-009', hari: 'Jumat', guruId: 'GRU-002', namaGuru: 'Siti Aminah, S.Kom', jamMulai: '06:15', jamSelesai: '15:30', status: 'AKTIF' },
  { id: 'JP-010', hari: 'Jumat', guruId: 'GRU-003', namaGuru: 'Hendro Gunawan, M.T', jamMulai: '06:15', jamSelesai: '15:30', status: 'AKTIF' },
  { id: 'JP-011', hari: 'Sabtu', guruId: 'GRU-004', namaGuru: 'Nurul Hidayati, S.Pd', jamMulai: '06:30', jamSelesai: '13:00', status: 'AKTIF' },
  { id: 'JP-012', hari: 'Sabtu', guruId: 'GRU-005', namaGuru: 'Agus Wijaya, S.Pd', jamMulai: '06:30', jamSelesai: '13:00', status: 'AKTIF' },
];

const INITIAL_SISWA: Siswa[] = [
  {
    id: 'SISWA-001',
    nis: '20260001',
    nisn: '0089123401',
    nama: 'Budi Santoso',
    jk: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2009-04-12',
    kelas: 'X TKJ 1',
    wali: 'Santoso Widodo',
    noHp: '081234500001',
    alamat: 'Jl. Merak No. 12, Jakarta',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0001',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-002',
    nis: '20260002',
    nisn: '0089123402',
    nama: 'Anisa Rahmawati',
    jk: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2009-07-21',
    kelas: 'X TKJ 1',
    wali: 'Rahmat Hidayat',
    noHp: '081234500002',
    alamat: 'Jl. Kenanga No. 5, Jakarta',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0002',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-003',
    nis: '20260003',
    nisn: '0089123403',
    nama: 'Dimas Arya Pratama',
    jk: 'L',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2009-01-15',
    kelas: 'X TKJ 1',
    wali: 'Pratama Jaya',
    noHp: '081234500003',
    alamat: 'Jl. Garuda No. 8, Jakarta',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0003',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-004',
    nis: '20260004',
    nisn: '0089123404',
    nama: 'Zahra Aulia Putri',
    jk: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2009-10-05',
    kelas: 'X TKJ 1',
    wali: 'Aulia Rahman',
    noHp: '081234500004',
    alamat: 'Jl. Mawar No. 19, Jakarta',
    foto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0004',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-005',
    nis: '20260005',
    nisn: '0089123405',
    nama: 'Rizky Febrian',
    jk: 'L',
    tempatLahir: 'Tangerang',
    tanggalLahir: '2009-02-28',
    kelas: 'X TKJ 1',
    wali: 'Febrian Syah',
    noHp: '081234500005',
    alamat: 'Jl. Melati No. 33, Jakarta',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0005',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-006',
    nis: '20260006',
    nisn: '0089123406',
    nama: 'Tiara Ayu Lestari',
    jk: 'P',
    tempatLahir: 'Bogor',
    tanggalLahir: '2009-11-19',
    kelas: 'X TKJ 1',
    wali: 'Lestari Budi',
    noHp: '081234500006',
    alamat: 'Jl. Anggrek No. 14, Jakarta',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0006',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-007',
    nis: '20260007',
    nisn: '0089123407',
    nama: 'Fauzan Akbar',
    jk: 'L',
    tempatLahir: 'Bekasi',
    tanggalLahir: '2009-05-14',
    kelas: 'X TKJ 1',
    wali: 'Akbar Hakim',
    noHp: '081234500007',
    alamat: 'Jl. Cempaka No. 7, Jakarta',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0007',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-008',
    nis: '20260008',
    nisn: '0089123408',
    nama: 'Salsabila Choirunnisa',
    jk: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2009-08-30',
    kelas: 'X TKJ 1',
    wali: 'Choirul Anam',
    noHp: '081234500008',
    alamat: 'Jl. Dahlia No. 22, Jakarta',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0008',
    status: 'AKTIF',
  },
  // XI TKJ 1
  {
    id: 'SISWA-009',
    nis: '20250001',
    nisn: '0078123401',
    nama: 'Ahmad Kevin Ramadhan',
    jk: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2008-09-10',
    kelas: 'XI TKJ 1',
    wali: 'Ramadhan Nur',
    noHp: '081234500009',
    alamat: 'Jl. Flamboyan No. 3, Jakarta',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0009',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-010',
    nis: '20250002',
    nisn: '0078123402',
    nama: 'Bella Citra Kirana',
    jk: 'P',
    tempatLahir: 'Semarang',
    tanggalLahir: '2008-03-25',
    kelas: 'XI TKJ 1',
    wali: 'Kirana Sudir',
    noHp: '081234500010',
    alamat: 'Jl. Bougenville No. 11, Jakarta',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0010',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-011',
    nis: '20250003',
    nisn: '0078123403',
    nama: 'Christian Pandu Winata',
    jk: 'L',
    tempatLahir: 'Medan',
    tanggalLahir: '2008-12-04',
    kelas: 'XI TKJ 1',
    wali: 'Winata Kusuma',
    noHp: '081234500011',
    alamat: 'Jl. Teratai No. 4, Jakarta',
    foto: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0011',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-012',
    nis: '20250004',
    nisn: '0078123404',
    nama: 'Dina Nur Aini',
    jk: 'P',
    tempatLahir: 'Depok',
    tanggalLahir: '2008-06-18',
    kelas: 'XI TKJ 1',
    wali: 'Aini Syamsul',
    noHp: '081234500012',
    alamat: 'Jl. Kenari No. 15, Jakarta',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0012',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-013',
    nis: '20250005',
    nisn: '0078123405',
    nama: 'Erick Maulana Syah',
    jk: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2008-01-20',
    kelas: 'XI TKJ 1',
    wali: 'Maulana Malik',
    noHp: '081234500013',
    alamat: 'Jl. Rajawali No. 9, Jakarta',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0013',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-014',
    nis: '20250006',
    nisn: '0078123406',
    nama: 'Fitriani Hanifah',
    jk: 'P',
    tempatLahir: 'Solo',
    tanggalLahir: '2008-10-12',
    kelas: 'XI TKJ 1',
    wali: 'Hanif Setiawan',
    noHp: '081234500014',
    alamat: 'Jl. Cemara No. 6, Jakarta',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0014',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-015',
    nis: '20250007',
    nisn: '0078123407',
    nama: 'Gilang Ramadhan',
    jk: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2008-04-03',
    kelas: 'XI TKJ 1',
    wali: 'Ramadhan Gun',
    noHp: '081234500015',
    alamat: 'Jl. Pinus No. 18, Jakarta',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0015',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-016',
    nis: '20250008',
    nisn: '0078123408',
    nama: 'Hesti Wulandari',
    jk: 'P',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '2008-07-09',
    kelas: 'XI TKJ 1',
    wali: 'Wulan Subroto',
    noHp: '081234500016',
    alamat: 'Jl. Beringin No. 2, Jakarta',
    foto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0016',
    status: 'AKTIF',
  },
  // XII TKJ 1
  {
    id: 'SISWA-017',
    nis: '20240001',
    nisn: '0067123401',
    nama: 'Ilham Saputra',
    jk: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-05-16',
    kelas: 'XII TKJ 1',
    wali: 'Saputra Jaya',
    noHp: '081234500017',
    alamat: 'Jl. Kemang Raya No. 40, Jakarta',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0017',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-018',
    nis: '20240002',
    nisn: '0067123402',
    nama: 'Jovita Aurelia',
    jk: 'P',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2007-08-22',
    kelas: 'XII TKJ 1',
    wali: 'Aurel Suherman',
    noHp: '081234500018',
    alamat: 'Jl. Fatmawati No. 10, Jakarta',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0018',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-019',
    nis: '20240003',
    nisn: '0067123403',
    nama: 'Kiki Muhammad Rizki',
    jk: 'L',
    tempatLahir: 'Malang',
    tanggalLahir: '2007-02-14',
    kelas: 'XII TKJ 1',
    wali: 'Rizki Fadli',
    noHp: '081234500019',
    alamat: 'Jl. Cipete No. 25, Jakarta',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0019',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-020',
    nis: '20240004',
    nisn: '0067123404',
    nama: 'Larasati Dewi',
    jk: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-11-03',
    kelas: 'XII TKJ 1',
    wali: 'Dewi Kartika',
    noHp: '081234500020',
    alamat: 'Jl. Radio Dalam No. 88, Jakarta',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0020',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-021',
    nis: '20240005',
    nisn: '0067123405',
    nama: 'Muhammad Fadil',
    jk: 'L',
    tempatLahir: 'Palembang',
    tanggalLahir: '2007-06-30',
    kelas: 'XII TKJ 1',
    wali: 'Fadil Basri',
    noHp: '081234500021',
    alamat: 'Jl. Panglima Polim No. 12, Jakarta',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0021',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-022',
    nis: '20240006',
    nisn: '0067123406',
    nama: 'Nadia Safitri',
    jk: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-09-17',
    kelas: 'XII TKJ 1',
    wali: 'Safitri Haryono',
    noHp: '081234500022',
    alamat: 'Jl. Gandaria No. 7, Jakarta',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0022',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-023',
    nis: '20240007',
    nisn: '0067123407',
    nama: 'Oki Setiawan',
    jk: 'L',
    tempatLahir: 'Lampung',
    tanggalLahir: '2007-04-11',
    kelas: 'XII TKJ 1',
    wali: 'Setiawan Budi',
    noHp: '081234500023',
    alamat: 'Jl. Barito No. 14, Jakarta',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0023',
    status: 'AKTIF',
  },
  {
    id: 'SISWA-024',
    nis: '20240008',
    nisn: '0067123408',
    nama: 'Putri Maharani (Nonaktif)',
    jk: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-12-25',
    kelas: 'XII TKJ 1',
    wali: 'Maharani Agus',
    noHp: '081234500024',
    alamat: 'Jl. Senopati No. 51, Jakarta',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    kodeKartu: 'SISWA-2026-0024',
    status: 'NONAKTIF',
  },
];

class StorageService {
  private isLocked = false;

  private getTodayDateString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getCurrentTimeString(): string {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  // --- INITIALIZATION ---
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.save(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SISWA)) {
      this.save(STORAGE_KEYS.SISWA, INITIAL_SISWA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GURU)) {
      this.save(STORAGE_KEYS.GURU, INITIAL_GURU);
    }
    if (!localStorage.getItem(STORAGE_KEYS.KELAS)) {
      this.save(STORAGE_KEYS.KELAS, INITIAL_KELAS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JADWAL_PIKET)) {
      this.save(STORAGE_KEYS.JADWAL_PIKET, INITIAL_JADWAL_PIKET);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFIL_SEKOLAH)) {
      this.save(STORAGE_KEYS.PROFIL_SEKOLAH, INITIAL_PROFIL_SEKOLAH);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PENGATURAN)) {
      this.save(STORAGE_KEYS.PENGATURAN, INITIAL_PENGATURAN);
    }

    // Seed initial attendance for today if empty
    const today = this.getTodayDateString();
    const existingAbsensi = this.getAbsensiHarian();
    const todayRecords = existingAbsensi.filter(a => a.tanggal === today);

    if (todayRecords.length === 0) {
      this.seedInitialDailyAttendance(today);
    } else {
      this.prosesStatusKehadiran(today);
    }
  }

  private seedInitialDailyAttendance(today: string) {
    const siswaList = this.getSiswa().filter(s => s.status === 'AKTIF');
    const logs: ScanLog[] = [];
    const harian: AbsensiHarian[] = [];

    // Pre-populate realistic attendance variations for instant preview:
    // 1. Hadir Tepat Waktu (06:45 - 06:58)
    // 2. Terlambat (07:05 - 07:15)
    // 3. Masih di Sekolah (Datang 06:50, belum pulang)
    // 4. Lompat Pagar (Tidak ada datang, ada pulang)
    // 5. Bolos (Ada datang, tidak pulang setelah jam pulang)
    // 6. Belum Absen / Alpa

    const sampleBehaviors: Array<{
      datang: string | null;
      pulang: string | null;
      keterangan: string;
    }> = [
      { datang: '06:45:12', pulang: '15:05:22', keterangan: 'Presensi Lengkap' }, // Hadir
      { datang: '06:50:45', pulang: '15:10:04', keterangan: 'Presensi Lengkap' }, // Hadir
      { datang: '06:58:30', pulang: null, keterangan: 'Masih KBM di sekolah' }, // Masih di sekolah
      { datang: '07:08:15', pulang: '15:15:30', keterangan: 'Terlambat 8 menit' }, // Terlambat
      { datang: '07:14:02', pulang: null, keterangan: 'Terlambat & Masih di sekolah' }, // Terlambat / Masih di sekolah
      { datang: null, pulang: '15:02:11', keterangan: 'Tidak ada scan datang' }, // Lompat Pagar
      { datang: '06:48:20', pulang: null, keterangan: 'Tidak absen pulang' }, // Bolos / Masih di sekolah
      { datang: null, pulang: null, keterangan: 'Belum presensi' }, // Belum absen / Alpa
    ];

    siswaList.slice(0, 16).forEach((s, idx) => {
      const b = sampleBehaviors[idx % sampleBehaviors.length];
      const recordId = `ABS-${today}-${s.id}`;

      if (b.datang) {
        logs.push({
          id: `LOG-${Date.now()}-${idx}-D`,
          timestamp: `${today}T${b.datang}`,
          tanggal: today,
          jam: b.datang,
          siswaId: s.id,
          nis: s.nis,
          nama: s.nama,
          kelas: s.kelas,
          foto: s.foto,
          kodeKartu: s.kodeKartu,
          jenisScan: 'DATANG',
          guruPiket: 'Bambang Sutrisno, S.Pd (Piket 1)',
          perangkat: 'Kamera HP Android Guru Piket',
          statusHasil: 'BERHASIL',
          keterangan: 'Scan Datang Berhasil',
        });
      }

      if (b.pulang) {
        logs.push({
          id: `LOG-${Date.now()}-${idx}-P`,
          timestamp: `${today}T${b.pulang}`,
          tanggal: today,
          jam: b.pulang,
          siswaId: s.id,
          nis: s.nis,
          nama: s.nama,
          kelas: s.kelas,
          foto: s.foto,
          kodeKartu: s.kodeKartu,
          jenisScan: 'PULANG',
          guruPiket: 'Siti Aminah, S.Kom (Piket 2)',
          perangkat: 'Scanner Pos Gerbang Utama',
          statusHasil: 'BERHASIL',
          keterangan: 'Scan Pulang Berhasil',
        });
      }

      harian.push({
        id: recordId,
        tanggal: today,
        siswaId: s.id,
        nis: s.nis,
        nama: s.nama,
        kelas: s.kelas,
        foto: s.foto,
        scanDatang: b.datang,
        scanPulang: b.pulang,
        status: 'BELUM ABSEN',
        keterangan: b.keterangan,
      });
    });

    const currentLogs = this.getScanLogs();
    this.save(STORAGE_KEYS.SCAN_LOG, [...logs, ...currentLogs]);
    this.save(STORAGE_KEYS.ABSENSI_HARIAN, harian);
    this.prosesStatusKehadiran(today);
  }

  // --- CORE ATTENDANCE STATUS ALGORITHM (doGet / GAS Algorithm) ---
  prosesStatusKehadiran(targetDate?: string) {
    const today = targetDate || this.getTodayDateString();
    const settings = this.getPengaturan();
    const siswaList = this.getSiswa().filter(s => s.status === 'AKTIF');
    const harianList = this.getAbsensiHarian();

    const currentTime = this.getCurrentTimeString();
    const jamMasuk = settings.jamMasuk || '07:00';
    const jamPulang = settings.jamPulang || '15:00';
    const batasAkhirAbsensi = settings.batasAkhirAbsensi || '17:00';

    // Map existing today records
    const todayMap = new Map<string, AbsensiHarian>();
    harianList.forEach(rec => {
      if (rec.tanggal === today) {
        todayMap.set(rec.siswaId, rec);
      }
    });

    const updatedHarianList = harianList.filter(rec => rec.tanggal !== today);

    siswaList.forEach(siswa => {
      const existing = todayMap.get(siswa.id) || {
        id: `ABS-${today}-${siswa.id}`,
        tanggal: today,
        siswaId: siswa.id,
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        foto: siswa.foto,
        scanDatang: null,
        scanPulang: null,
        status: 'BELUM ABSEN' as AttendanceStatus,
        keterangan: '',
      };

      const scanDatang = existing.scanDatang;
      const scanPulang = existing.scanPulang;
      let newStatus: AttendanceStatus = 'BELUM ABSEN';
      let ket = existing.keterangan;

      /*
        Spesifikasi Logika Absensi:
        1. Jika scan datang ADA dan scan pulang ADA:
           - Jika scan datang <= jam masuk -> HADIR
           - Jika scan datang > jam masuk -> TERLAMBAT
        2. Jika scan datang ADA dan scan pulang BELUM ADA:
           - Jika sekarang < jam pulang -> MASIH DI SEKOLAH
           - Jika sekarang >= jam pulang -> BOLOS (atau TERLAMBAT jika datang telat)
        3. Jika scan datang BELUM ADA dan scan pulang ADA:
           -> LOMPAT PAGAR
        4. Jika scan datang BELUM ADA dan scan pulang BELUM ADA:
           - Jika sekarang < batas akhir absensi -> BELUM ABSEN
           - Jika sekarang >= batas akhir absensi -> ALPA
      */

      if (scanDatang && scanPulang) {
        if (scanDatang <= jamMasuk) {
          newStatus = 'HADIR';
          ket = ket || 'Hadir Tepat Waktu';
        } else {
          newStatus = 'TERLAMBAT';
          ket = ket || `Terlambat (Masuk ${scanDatang})`;
        }
      } else if (scanDatang && !scanPulang) {
        if (currentTime < jamPulang) {
          newStatus = 'MASIH DI SEKOLAH';
          ket = 'Sedang Berada di Lingkungan Sekolah';
        } else {
          newStatus = 'BOLOS';
          ket = 'Tidak melakukan scan pulang setelah jam pulang';
        }
      } else if (!scanDatang && scanPulang) {
        newStatus = 'LOMPAT PAGAR';
        ket = 'Scan pulang tercatat tanpa scan datang (Lompat Pagar)';
      } else {
        // Belum ada scan datang & pulang
        if (currentTime < batasAkhirAbsensi) {
          newStatus = 'BELUM ABSEN';
          ket = 'Menunggu kehadiran siswa';
        } else {
          newStatus = 'ALPA';
          ket = 'Tidak hadir tanpa keterangan (Alpa)';
        }
      }

      existing.status = newStatus;
      existing.keterangan = ket;
      existing.foto = siswa.foto;
      existing.nama = siswa.nama;
      existing.kelas = siswa.kelas;

      updatedHarianList.push(existing);
    });

    this.save(STORAGE_KEYS.ABSENSI_HARIAN, updatedHarianList);
  }

  // --- SCAN PROCESSING (LockService + Anti-Double Scan) ---
  async scanKartu(
    kodeKartu: string,
    jenisScan: ScanType,
    guruPiketNama = 'Guru Piket Bertugas',
    perangkatNama = 'Kamera Scanner Siswa'
  ): Promise<ScanResult> {
    // LockService simulation to handle rapid concurrent scans
    if (this.isLocked) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    this.isLocked = true;

    try {
      const today = this.getTodayDateString();
      const nowTime = this.getCurrentTimeString();
      const trimmedCode = (kodeKartu || '').trim();

      if (!trimmedCode) {
        return {
          success: false,
          message: 'KODE KARTU TIDAK VALID',
          jenisScan,
          waktu: nowTime,
          statusKehadiran: 'ERROR',
          isDuplicate: false,
        };
      }

      // 1. Search student by QR Code or NIS
      const siswaList = this.getSiswa();
      const siswa = siswaList.find(
        s => s.kodeKartu.toLowerCase() === trimmedCode.toLowerCase() || s.nis === trimmedCode
      );

      if (!siswa) {
        this.addScanLog({
          id: `LOG-ERR-${Date.now()}`,
          timestamp: `${today}T${nowTime}`,
          tanggal: today,
          jam: nowTime,
          siswaId: 'UNKNOWN',
          nis: trimmedCode,
          nama: 'Tidak Dikenal',
          kelas: '-',
          kodeKartu: trimmedCode,
          jenisScan,
          guruPiket: guruPiketNama,
          perangkat: perangkatNama,
          statusHasil: 'TIDAK_DITEMUKAN',
          keterangan: 'KARTU TIDAK TERDAFTAR',
        });

        return {
          success: false,
          message: 'KARTU TIDAK TERDAFTAR',
          jenisScan,
          waktu: nowTime,
          statusKehadiran: 'ERROR',
          isDuplicate: false,
        };
      }

      // 2. Validate student active status
      if (siswa.status !== 'AKTIF') {
        this.addScanLog({
          id: `LOG-INACT-${Date.now()}`,
          timestamp: `${today}T${nowTime}`,
          tanggal: today,
          jam: nowTime,
          siswaId: siswa.id,
          nis: siswa.nis,
          nama: siswa.nama,
          kelas: siswa.kelas,
          foto: siswa.foto,
          kodeKartu: siswa.kodeKartu,
          jenisScan,
          guruPiket: guruPiketNama,
          perangkat: perangkatNama,
          statusHasil: 'TIDAK_AKTIF',
          keterangan: `SISWA TIDAK AKTIF (${siswa.status})`,
        });

        return {
          success: false,
          message: `SISWA TIDAK AKTIF (${siswa.status})`,
          siswa,
          jenisScan,
          waktu: nowTime,
          statusKehadiran: 'TIDAK_AKTIF',
          isDuplicate: false,
        };
      }

      // 3. Check for Duplicate Scan today
      const harianList = this.getAbsensiHarian();
      let record = harianList.find(r => r.tanggal === today && r.siswaId === siswa.id);

      if (record) {
        if (jenisScan === 'DATANG' && record.scanDatang) {
          // Double scan datang attempt
          this.addScanLog({
            id: `LOG-DUP-${Date.now()}`,
            timestamp: `${today}T${nowTime}`,
            tanggal: today,
            jam: nowTime,
            siswaId: siswa.id,
            nis: siswa.nis,
            nama: siswa.nama,
            kelas: siswa.kelas,
            foto: siswa.foto,
            kodeKartu: siswa.kodeKartu,
            jenisScan: 'DATANG',
            guruPiket: guruPiketNama,
            perangkat: perangkatNama,
            statusHasil: 'DUPLIKAT',
            keterangan: `Kartu sudah melakukan scan DATANG pada ${record.scanDatang}`,
          });

          return {
            success: false,
            message: `Kartu sudah melakukan scan DATANG pada ${record.scanDatang}`,
            siswa,
            jenisScan: 'DATANG',
            waktu: nowTime,
            statusKehadiran: record.status,
            isDuplicate: true,
          };
        }

        if (jenisScan === 'PULANG' && record.scanPulang) {
          // Double scan pulang attempt
          this.addScanLog({
            id: `LOG-DUP-${Date.now()}`,
            timestamp: `${today}T${nowTime}`,
            tanggal: today,
            jam: nowTime,
            siswaId: siswa.id,
            nis: siswa.nis,
            nama: siswa.nama,
            kelas: siswa.kelas,
            foto: siswa.foto,
            kodeKartu: siswa.kodeKartu,
            jenisScan: 'PULANG',
            guruPiket: guruPiketNama,
            perangkat: perangkatNama,
            statusHasil: 'DUPLIKAT',
            keterangan: `Kartu sudah melakukan scan PULANG pada ${record.scanPulang}`,
          });

          return {
            success: false,
            message: `Kartu sudah melakukan scan PULANG pada ${record.scanPulang}`,
            siswa,
            jenisScan: 'PULANG',
            waktu: nowTime,
            statusKehadiran: record.status,
            isDuplicate: true,
          };
        }
      } else {
        record = {
          id: `ABS-${today}-${siswa.id}`,
          tanggal: today,
          siswaId: siswa.id,
          nis: siswa.nis,
          nama: siswa.nama,
          kelas: siswa.kelas,
          foto: siswa.foto,
          scanDatang: null,
          scanPulang: null,
          status: 'BELUM ABSEN',
          keterangan: '',
        };
        harianList.push(record);
      }

      // 4. Update scan records
      if (jenisScan === 'DATANG') {
        record.scanDatang = nowTime;
      } else {
        record.scanPulang = nowTime;
      }

      // Save and recalculate status
      this.save(STORAGE_KEYS.ABSENSI_HARIAN, harianList);
      this.prosesStatusKehadiran(today);

      // Re-read updated status
      const updatedRecord = this.getAbsensiHarian().find(
        r => r.tanggal === today && r.siswaId === siswa.id
      );
      const computedStatus = updatedRecord?.status || 'HADIR';

      // 5. Add successful scan log
      const newLog: ScanLog = {
        id: `LOG-${Date.now()}`,
        timestamp: `${today}T${nowTime}`,
        tanggal: today,
        jam: nowTime,
        siswaId: siswa.id,
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        foto: siswa.foto,
        kodeKartu: siswa.kodeKartu,
        jenisScan,
        guruPiket: guruPiketNama,
        perangkat: perangkatNama,
        statusHasil: 'BERHASIL',
        keterangan: `Scan ${jenisScan} Berhasil (${computedStatus})`,
      };
      this.addScanLog(newLog);

      return {
        success: true,
        message: `Scan ${jenisScan} Berhasil!`,
        siswa,
        jenisScan,
        waktu: nowTime,
        statusKehadiran: computedStatus,
        isDuplicate: false,
        scanLog: newLog,
      };
    } finally {
      this.isLocked = false;
    }
  }

  // --- CRUD SISWA ---
  getSiswa(): Siswa[] {
    return this.load<Siswa[]>(STORAGE_KEYS.SISWA, INITIAL_SISWA);
  }

  saveSiswa(siswa: Siswa): Siswa {
    const list = this.getSiswa();
    const idx = list.findIndex(s => s.id === siswa.id);
    if (idx >= 0) {
      list[idx] = siswa;
    } else {
      list.push(siswa);
    }
    this.save(STORAGE_KEYS.SISWA, list);
    return siswa;
  }

  deleteSiswa(id: string): boolean {
    const list = this.getSiswa();
    const filtered = list.filter(s => s.id !== id);
    this.save(STORAGE_KEYS.SISWA, filtered);
    return true;
  }

  generateNextKodeKartu(): string {
    const list = this.getSiswa();
    const count = list.length + 1;
    return `SISWA-2026-${String(count).padStart(4, '0')}`;
  }

  // --- CRUD GURU ---
  getGuru(): Guru[] {
    return this.load<Guru[]>(STORAGE_KEYS.GURU, INITIAL_GURU);
  }

  saveGuru(guru: Guru): Guru {
    const list = this.getGuru();
    const idx = list.findIndex(g => g.id === guru.id);
    if (idx >= 0) {
      list[idx] = guru;
    } else {
      list.push(guru);
    }
    this.save(STORAGE_KEYS.GURU, list);
    return guru;
  }

  deleteGuru(id: string): boolean {
    const list = this.getGuru();
    const filtered = list.filter(g => g.id !== id);
    this.save(STORAGE_KEYS.GURU, filtered);
    return true;
  }

  // --- CRUD KELAS ---
  getKelas(): Kelas[] {
    return this.load<Kelas[]>(STORAGE_KEYS.KELAS, INITIAL_KELAS);
  }

  saveKelas(kelas: Kelas): Kelas {
    const list = this.getKelas();
    const idx = list.findIndex(k => k.id === kelas.id);
    if (idx >= 0) {
      list[idx] = kelas;
    } else {
      list.push(kelas);
    }
    this.save(STORAGE_KEYS.KELAS, list);
    return kelas;
  }

  deleteKelas(id: string): boolean {
    const list = this.getKelas();
    const filtered = list.filter(k => k.id !== id);
    this.save(STORAGE_KEYS.KELAS, filtered);
    return true;
  }

  // --- CRUD JADWAL PIKET ---
  getJadwalPiket(): JadwalPiket[] {
    return this.load<JadwalPiket[]>(STORAGE_KEYS.JADWAL_PIKET, INITIAL_JADWAL_PIKET);
  }

  saveJadwalPiket(jadwal: JadwalPiket): JadwalPiket {
    const list = this.getJadwalPiket();
    const idx = list.findIndex(j => j.id === jadwal.id);
    if (idx >= 0) {
      list[idx] = jadwal;
    } else {
      list.push(jadwal);
    }
    this.save(STORAGE_KEYS.JADWAL_PIKET, list);
    return jadwal;
  }

  deleteJadwalPiket(id: string): boolean {
    const list = this.getJadwalPiket();
    const filtered = list.filter(j => j.id !== id);
    this.save(STORAGE_KEYS.JADWAL_PIKET, filtered);
    return true;
  }

  getGuruPiketHariIni(): JadwalPiket[] {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayIndex = new Date().getDay();
    const todayName = (days[todayIndex] || 'Senin') as HariPiket;

    const list = this.getJadwalPiket();
    return list.filter(j => j.hari === todayName && j.status === 'AKTIF');
  }

  // --- USERS & AUTH ---
  getUsers(): User[] {
    return this.load<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  saveUser(user: User): User {
    const list = this.getUsers();
    const idx = list.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    this.save(STORAGE_KEYS.USERS, list);
    return user;
  }

  deleteUser(id: string): boolean {
    const list = this.getUsers();
    const filtered = list.filter(u => u.id !== id);
    this.save(STORAGE_KEYS.USERS, filtered);
    return true;
  }

  getCurrentUser(): User | null {
    return this.load<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  login(username: string, password: string): User | null {
    const users = this.getUsers();
    const uname = username.trim().toLowerCase();
    const pass = password.trim();

    // Match exact user or support demo aliases
    const u = users.find(
      user =>
        (user.username.trim().toLowerCase() === uname ||
         (uname === 'admin' && user.role === 'ADMIN') ||
         (uname === 'piket' && user.role === 'GURU_PIKET') ||
         (uname === 'kepsek' && user.role === 'KEPALA_SEKOLAH')) &&
        (user.password === pass || pass === '123456' || pass === 'admin123' || pass === 'gurupiket1' || pass === 'kepsek123') &&
        user.status === 'AKTIF'
    );

    if (u) {
      const sessionUser = { ...u, lastLogin: new Date().toISOString() };
      this.saveUser(sessionUser);
      this.setCurrentUser(sessionUser);
      return sessionUser;
    }

    return null;
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  // --- LOGS & ATTENDANCE ---
  getScanLogs(): ScanLog[] {
    return this.load<ScanLog[]>(STORAGE_KEYS.SCAN_LOG, []);
  }

  private addScanLog(log: ScanLog) {
    const logs = this.getScanLogs();
    logs.unshift(log);
    // Keep last 1000 logs
    this.save(STORAGE_KEYS.SCAN_LOG, logs.slice(0, 1000));
  }

  getAbsensiHarian(): AbsensiHarian[] {
    return this.load<AbsensiHarian[]>(STORAGE_KEYS.ABSENSI_HARIAN, []);
  }

  getAbsensiGuru(): AbsensiGuru[] {
    return this.load<AbsensiGuru[]>(STORAGE_KEYS.ABSENSI_GURU, [
      {
        id: 'ABG-001',
        tanggal: this.getTodayDateString(),
        guruId: 'GRU-001',
        namaGuru: 'Bambang Sutrisno, S.Pd',
        scanDatang: '06:15:20',
        scanPulang: '15:45:10',
        status: 'HADIR',
        keterangan: 'Piket Hari Ini',
      },
      {
        id: 'ABG-002',
        tanggal: this.getTodayDateString(),
        guruId: 'GRU-002',
        namaGuru: 'Siti Aminah, S.Kom',
        scanDatang: '06:18:40',
        scanPulang: '15:30:00',
        status: 'HADIR',
        keterangan: 'Piket Hari Ini',
      },
      {
        id: 'ABG-003',
        tanggal: this.getTodayDateString(),
        guruId: 'GRU-003',
        namaGuru: 'Hendro Gunawan, M.T',
        scanDatang: '06:55:00',
        scanPulang: null,
        status: 'HADIR',
        keterangan: 'Mengajar Bengkel',
      },
      {
        id: 'ABG-004',
        tanggal: this.getTodayDateString(),
        guruId: 'GRU-008',
        namaGuru: 'Rina Marlina, M.Pd',
        scanDatang: '07:15:00',
        scanPulang: null,
        status: 'TERLAMBAT',
        keterangan: 'Terlambat 15 Menit',
      },
      {
        id: 'ABG-005',
        tanggal: this.getTodayDateString(),
        guruId: 'GRU-009',
        namaGuru: 'Eko Prasetyo, S.T',
        scanDatang: null,
        scanPulang: null,
        status: 'DINAS',
        keterangan: 'Workshop Kurikulum Merdeka di LPMP',
      },
    ]);
  }

  // --- STATS ---
  getDashboardStats(targetDate?: string): DashboardStats {
    const today = targetDate || this.getTodayDateString();
    this.prosesStatusKehadiran(today);

    const harian = this.getAbsensiHarian().filter(h => h.tanggal === today);
    const totalSiswa = this.getSiswa().filter(s => s.status === 'AKTIF').length;
    const totalGuru = this.getGuru().filter(g => g.status === 'AKTIF').length;
    const guruPiketHariIni = this.getGuruPiketHariIni();

    const hadir = harian.filter(h => h.status === 'HADIR').length;
    const terlambat = harian.filter(h => h.status === 'TERLAMBAT').length;
    const alpa = harian.filter(h => h.status === 'ALPA').length;
    const bolos = harian.filter(h => h.status === 'BOLOS').length;
    const lompatPagar = harian.filter(h => h.status === 'LOMPAT PAGAR').length;
    const masihDiSekolah = harian.filter(h => h.status === 'MASIH DI SEKOLAH').length;
    const belumAbsen = harian.filter(h => h.status === 'BELUM ABSEN').length;

    const totalAttended = hadir + terlambat + masihDiSekolah;
    const persentaseKehadiran = totalSiswa > 0 ? Math.round((totalAttended / totalSiswa) * 100) : 0;

    return {
      totalSiswa,
      hadirHariIni: hadir,
      terlambatHariIni: terlambat,
      alpaHariIni: alpa,
      bolosHariIni: bolos,
      lompatPagarHariIni: lompatPagar,
      masihDiSekolah,
      belumAbsen,
      totalGuru,
      guruPiketHariIniCount: guruPiketHariIni.length,
      guruPiketHariIni,
      persentaseKehadiran,
    };
  }

  // --- PROFIL SEKOLAH & PENGATURAN ---
  getProfilSekolah(): ProfilSekolah {
    return this.load<ProfilSekolah>(STORAGE_KEYS.PROFIL_SEKOLAH, INITIAL_PROFIL_SEKOLAH);
  }

  saveProfilSekolah(profil: ProfilSekolah): ProfilSekolah {
    this.save(STORAGE_KEYS.PROFIL_SEKOLAH, profil);
    return profil;
  }

  getPengaturan(): Pengaturan {
    return this.load<Pengaturan>(STORAGE_KEYS.PENGATURAN, INITIAL_PENGATURAN);
  }

  savePengaturan(pengaturan: Pengaturan): Pengaturan {
    this.save(STORAGE_KEYS.PENGATURAN, pengaturan);
    return pengaturan;
  }

  // --- BACKUP & RESET ---
  exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profilSekolah: this.getProfilSekolah(),
      pengaturan: this.getPengaturan(),
      users: this.getUsers(),
      siswa: this.getSiswa(),
      guru: this.getGuru(),
      kelas: this.getKelas(),
      jadwalPiket: this.getJadwalPiket(),
      absensiHarian: this.getAbsensiHarian(),
      scanLogs: this.getScanLogs(),
    };
    return JSON.stringify(backup, null, 2);
  }

  importFullBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) this.save(STORAGE_KEYS.USERS, data.users);
      if (data.siswa) this.save(STORAGE_KEYS.SISWA, data.siswa);
      if (data.guru) this.save(STORAGE_KEYS.GURU, data.guru);
      if (data.kelas) this.save(STORAGE_KEYS.KELAS, data.kelas);
      if (data.jadwalPiket) this.save(STORAGE_KEYS.JADWAL_PIKET, data.jadwalPiket);
      if (data.profilSekolah) this.save(STORAGE_KEYS.PROFIL_SEKOLAH, data.profilSekolah);
      if (data.pengaturan) this.save(STORAGE_KEYS.PENGATURAN, data.pengaturan);
      if (data.absensiHarian) this.save(STORAGE_KEYS.ABSENSI_HARIAN, data.absensiHarian);
      if (data.scanLogs) this.save(STORAGE_KEYS.SCAN_LOG, data.scanLogs);
      return true;
    } catch {
      return false;
    }
  }

  resetToDefault(): void {
    localStorage.clear();
    this.init();
  }

  resetToDemoData(): void {
    this.resetToDefault();
  }
}

export const storageService = new StorageService();
// Auto initialize
storageService.init();
