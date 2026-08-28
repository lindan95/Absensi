export type Role = 'ADMIN' | 'GURU_PIKET' | 'KEPALA_SEKOLAH';

export type AttendanceStatus = 
  | 'HADIR'
  | 'TERLAMBAT'
  | 'ALPA'
  | 'BOLOS'
  | 'LOMPAT PAGAR'
  | 'MASIH DI SEKOLAH'
  | 'BELUM ABSEN';

export type TeacherAttendanceStatus =
  | 'HADIR'
  | 'TERLAMBAT'
  | 'TIDAK HADIR'
  | 'DINAS'
  | 'IZIN';

export type ScanType = 'DATANG' | 'PULANG';

export interface User {
  id: string;
  username: string;
  password?: string;
  nama: string;
  role: Role;
  status: 'AKTIF' | 'NONAKTIF';
  foto?: string;
  email?: string;
  phone?: string;
  lastLogin?: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  jk: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  kelas: string;
  jurusan?: string;
  wali: string;
  noHp: string;
  noHpWali?: string;
  alamat: string;
  foto: string;
  kodeKartu: string;
  status: 'AKTIF' | 'NONAKTIF' | 'LULUS' | 'PINDAH';
}

export interface Guru {
  id: string;
  nip: string;
  nama: string;
  jk: 'L' | 'P';
  jabatan: string;
  mapel: string;
  noHp: string;
  email: string;
  foto: string;
  status: 'AKTIF' | 'NONAKTIF';
  isPiket?: boolean;
}

export interface Kelas {
  id: string;
  namaKelas: string;
  tingkat: 'X' | 'XI' | 'XII';
  jurusan: string;
  waliKelas: string;
  tahunAjaran: string;
  status: 'AKTIF' | 'NONAKTIF';
  jumlahSiswa?: number;
}

export type HariPiket = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface JadwalPiket {
  id: string;
  hari: HariPiket;
  guruId: string;
  idGuru?: string;
  namaGuru: string;
  jamMulai: string;
  jamSelesai: string;
  status: 'AKTIF' | 'NONAKTIF';
  keterangan?: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  tanggal: string;
  jam: string;
  siswaId: string;
  nis: string;
  nama: string;
  kelas: string;
  foto?: string;
  kodeKartu: string;
  jenisScan: ScanType;
  guruPiket: string;
  perangkat: string;
  statusHasil: 'BERHASIL' | 'DUPLIKAT' | 'TIDAK_DITEMUKAN' | 'TIDAK_AKTIF' | 'ERROR';
  keterangan: string;
}

export interface AbsensiHarian {
  id: string;
  tanggal: string;
  siswaId: string;
  nis: string;
  nama: string;
  kelas: string;
  foto?: string;
  scanDatang: string | null;
  scanPulang: string | null;
  status: AttendanceStatus;
  keterangan: string;
}

export interface AbsensiGuru {
  id: string;
  tanggal: string;
  guruId: string;
  namaGuru: string;
  scanDatang: string | null;
  scanPulang: string | null;
  status: TeacherAttendanceStatus;
  keterangan: string;
}

export interface ProfilSekolah {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolah: string;
  logo: string;
  fotoSekolah: string;
}

export interface Pengaturan {
  jamMasuk: string;
  batasScanDatang?: string;
  batasWaktuTerlambat: string;
  jamPulang: string;
  batasAkhirScanPulang: string;
  batasAkhirAbsensi?: string;
  zonaWaktu?: string;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  notifikasiScanAudio?: boolean;
  statusSistem?: 'AKTIF' | 'LIBUR';
  hariAktifSekolah?: string[];
  gasWebAppUrl?: string;
  gasSheetId?: string;
  driveFolderId?: string;
  driveSubfolders?: {
    logoSekolah?: string;
    fotoSiswa?: string;
    fotoGuru?: string;
    kartuSiswa?: string;
    laporan?: string;
    backupDatabase?: string;
  };
}

export interface ScanResult {
  success: boolean;
  message: string;
  siswa?: Siswa;
  jenisScan: ScanType;
  waktu: string;
  statusKehadiran: AttendanceStatus | string;
  isDuplicate: boolean;
  scanLog?: ScanLog;
}

export interface DashboardStats {
  totalSiswa: number;
  hadirHariIni: number;
  terlambatHariIni: number;
  alpaHariIni: number;
  bolosHariIni: number;
  lompatPagarHariIni: number;
  masihDiSekolah: number;
  belumAbsen: number;
  totalGuru: number;
  guruPiketHariIniCount: number;
  guruPiketHariIni: JadwalPiket[];
  persentaseKehadiran: number;
}
