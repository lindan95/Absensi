/**
 * Google Apps Script Source Code Repository
 * Contains complete, copy-pasteable and deployable Google Apps Script (.gs) backend files
 * structured exactly as specified in the technical requirements.
 */

export interface GasFile {
  name: string;
  type: 'gs' | 'html';
  description: string;
  code: string;
}

export const GAS_FILES: GasFile[] = [
  {
    name: 'Code.gs',
    type: 'gs',
    description: 'Entry point Google Apps Script Web App (doGet, doPost, API router)',
    code: `/**
 * ==============================================================================
 * SISTEM MONITORING KEHADIRAN SISWA - GOOGLE APPS SCRIPT BACKEND
 * ==============================================================================
 * Entry Point: doGet(e) & doPost(e)
 */

function doGet(e) {
  // Support both Web App HTML rendering & JSON API mode
  if (e && e.parameter && e.parameter.action) {
    return handleApiRequest(e.parameter.action, e.parameter);
  }
  
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Sistem Monitoring Kehadiran Siswa - Presensi QR Code')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var payload = contents.payload || {};
    return handleApiRequest(action, payload);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Invalid POST payload: ' + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiRequest(action, params) {
  var result = { success: false, message: 'Action not recognized' };
  
  try {
    switch (action) {
      case 'login':
        result = loginUser(params.username, params.password);
        break;
      case 'scanKartu':
        result = scanKartuSiswa(params.kodeKartu, params.jenisScan, params.guruPiket, params.perangkat);
        break;
      case 'getDashboardAdmin':
        result = getDashboardAdminData(params.tanggal);
        break;
      case 'getDashboardGuruPiket':
        result = getDashboardGuruPiketData(params.guruPiketNama);
        break;
      case 'getDashboardKepalaSekolah':
        result = getDashboardKepsekData(params.tanggal);
        break;
      case 'getSiswa':
        result = getAllSiswa();
        break;
      case 'saveSiswa':
        result = saveSiswaRecord(params.siswa);
        break;
      case 'deleteSiswa':
        result = deleteSiswaRecord(params.id);
        break;
      case 'getGuru':
        result = getAllGuru();
        break;
      case 'saveGuru':
        result = saveGuruRecord(params.guru);
        break;
      case 'deleteGuru':
        result = deleteGuruRecord(params.id);
        break;
      case 'getKelas':
        result = getAllKelas();
        break;
      case 'saveKelas':
        result = saveKelasRecord(params.kelas);
        break;
      case 'deleteKelas':
        result = deleteKelasRecord(params.id);
        break;
      case 'getJadwalPiket':
        result = getAllJadwalPiket();
        break;
      case 'saveJadwalPiket':
        result = saveJadwalPiketRecord(params.jadwal);
        break;
      case 'getRiwayatScan':
        result = getRiwayatScanData(params.filter);
        break;
      case 'getRekapKehadiran':
        result = getRekapKehadiranData(params.tanggal, params.kelas);
        break;
      case 'prosesStatusKehadiran':
        result = prosesStatusKehadiranTrigger();
        break;
      case 'getProfilSekolah':
        result = getProfilSekolahData();
        break;
      case 'updateProfilSekolah':
        result = saveProfilSekolahData(params.profil);
        break;
      case 'getPengaturan':
        result = getPengaturanData();
        break;
      case 'updatePengaturan':
        result = savePengaturanData(params.pengaturan);
        break;
      default:
        result = { success: false, message: 'Unknown action: ' + action };
    }
  } catch (error) {
    result = { success: false, message: 'Server error: ' + error.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
`,
  },
  {
    name: 'Config.gs',
    type: 'gs',
    description: 'Konfigurasi Google Spreadsheet ID, Folder Google Drive, & Sheet Names',
    code: `/**
 * Config.gs
 * Pengaturan Spreadsheet ID, Drive Folders, dan Konstanta Database
 */

var CONFIG = {
  // Ganti dengan ID Spreadsheet Google Anda jika terpisah
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet() ? SpreadsheetApp.getActiveSpreadsheet().getId() : '',
  
  SHEET_NAMES: {
    USERS: 'USERS',
    SISWA: 'SISWA',
    GURU: 'GURU',
    KELAS: 'KELAS',
    JADWAL_PIKET: 'JADWAL_PIKET',
    SCAN_LOG: 'SCAN_LOG',
    ABSENSI_HARIAN: 'ABSENSI_HARIAN',
    ABSENSI_GURU: 'ABSENSI_GURU',
    SEKOLAH: 'SEKOLAH',
    PENGATURAN: 'PENGATURAN'
  },
  
  DRIVE_FOLDERS: {
    ROOT: 'ABSENSI SEKOLAH',
    LOGO: 'LOGO SEKOLAH',
    FOTO_SISWA: 'FOTO SISWA',
    FOTO_GURU: 'FOTO GURU',
    KARTU_SISWA: 'KARTU SISWA',
    LAPORAN: 'LAPORAN',
    BACKUP: 'BACKUP DATABASE'
  },
  
  DEFAULTS: {
    JAM_MASUK: '07:00',
    BATAS_SCAN_DATANG: '09:00',
    JAM_PULANG: '15:00',
    BATAS_AKHIR_ABSENSI: '17:00',
    TIMEZONE: 'Asia/Jakarta'
  }
};

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}
`,
  },
  {
    name: 'Database.gs',
    type: 'gs',
    description: 'Inisialisasi sheet otomatis dan fungsi utilitas CRUD Google Sheets',
    code: `/**
 * Database.gs
 * Fungsi Setup Tabel, Baca & Tulis Data ke Google Sheets
 */

function setupDatabaseSheets() {
  var ss = getSpreadsheet();
  
  var schemas = {
    'USERS': ['UserID', 'Username', 'Password', 'Nama', 'Role', 'Status', 'Email', 'Phone'],
    'SISWA': ['ID', 'NIS', 'NISN', 'Nama', 'JK', 'TempatLahir', 'TanggalLahir', 'Kelas', 'Wali', 'NoHP', 'Alamat', 'Foto', 'KodeKartu', 'Status'],
    'GURU': ['ID', 'NIP', 'Nama', 'JK', 'Jabatan', 'Mapel', 'NoHP', 'Email', 'Foto', 'Status'],
    'KELAS': ['ID', 'Kelas', 'Tingkat', 'Jurusan', 'WaliKelas', 'TahunAjaran', 'Status'],
    'JADWAL_PIKET': ['ID', 'Hari', 'GuruID', 'NamaGuru', 'JamMulai', 'JamSelesai', 'Status'],
    'SCAN_LOG': ['ID', 'Timestamp', 'Tanggal', 'Jam', 'SiswaID', 'NIS', 'Nama', 'Kelas', 'KodeKartu', 'JenisScan', 'GuruPiket', 'Perangkat', 'StatusHasil', 'Keterangan'],
    'ABSENSI_HARIAN': ['ID', 'Tanggal', 'SiswaID', 'NIS', 'Nama', 'Kelas', 'ScanDatang', 'ScanPulang', 'Status', 'Keterangan'],
    'ABSENSI_GURU': ['ID', 'Tanggal', 'GuruID', 'NamaGuru', 'ScanDatang', 'ScanPulang', 'Status', 'Keterangan'],
    'SEKOLAH': ['Parameter', 'Nilai'],
    'PENGATURAN': ['Parameter', 'Nilai']
  };
  
  for (var name in schemas) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(schemas[name]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, schemas[name].length).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    }
  }
  
  Logger.log('Setup Database Sheet Selesai');
}

function getSheetDataAsObjects(sheetName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var results = [];
  
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var key = headers[c];
      obj[key] = row[c];
    }
    results.push(obj);
  }
  return results;
}

function appendSheetRow(sheetName, rowArray) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName(sheetName);
  }
  sheet.appendRow(rowArray);
}
`,
  },
  {
    name: 'Auth.gs',
    type: 'gs',
    description: 'Sistem Autentikasi Pengguna & Role Based Access Control',
    code: `/**
 * Auth.gs
 * Autentikasi User (ADMIN, GURU_PIKET, KEPALA_SEKOLAH)
 */

function loginUser(username, password) {
  var users = getSheetDataAsObjects(CONFIG.SHEET_NAMES.USERS);
  
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    if (String(u.Username).toLowerCase() === String(username).toLowerCase().trim() && 
        String(u.Password) === String(password).trim() && 
        String(u.Status).toUpperCase() === 'AKTIF') {
      
      return {
        success: true,
        user: {
          id: u.UserID,
          username: u.Username,
          nama: u.Nama,
          role: u.Role,
          status: u.Status,
          email: u.Email,
          phone: u.Phone
        },
        message: 'Login berhasil sebagai ' + u.Role
      };
    }
  }
  
  return {
    success: false,
    message: 'Username atau password salah, atau akun dinonaktifkan.'
  };
}
`,
  },
  {
    name: 'Attendance.gs',
    type: 'gs',
    description: 'Logika Scan Kartu, Anti-Double Scan, LockService, & Auto Status Kehadiran',
    code: `/**
 * Attendance.gs
 * Core Logic: scanKartuSiswa, prosesStatusKehadiran, Anti Double Scan & LockService
 */

function scanKartuSiswa(kodeKartu, jenisScan, guruPiketNama, perangkatNama) {
  var lock = LockService.getScriptLock();
  try {
    // Mencegah race condition ketika multiple device scan bersamaan
    lock.waitLock(10000);
  } catch (e) {
    return { success: false, message: 'Server sibuk, silakan coba scan kembali dalam 1 detik.' };
  }
  
  try {
    var today = Utilities.formatDate(new Date(), CONFIG.DEFAULTS.TIMEZONE, 'yyyy-MM-dd');
    var nowTime = Utilities.formatDate(new Date(), CONFIG.DEFAULTS.TIMEZONE, 'HH:mm:ss');
    
    // 1. Cari Siswa berdasarkan QR Code atau NIS
    var allSiswa = getSheetDataAsObjects(CONFIG.SHEET_NAMES.SISWA);
    var siswa = null;
    for (var i = 0; i < allSiswa.length; i++) {
      var s = allSiswa[i];
      if (String(s.KodeKartu).trim().toLowerCase() === String(kodeKartu).trim().toLowerCase() ||
          String(s.NIS).trim() === String(kodeKartu).trim()) {
        siswa = s;
        break;
      }
    }
    
    if (!siswa) {
      logScanActivity(today, nowTime, 'UNKNOWN', kodeKartu, 'Tidak Dikenal', '-', kodeKartu, jenisScan, guruPiketNama, perangkatNama, 'TIDAK_DITEMUKAN', 'KARTU TIDAK TERDAFTAR');
      return { success: false, message: 'KARTU TIDAK TERDAFTAR', waktu: nowTime, statusKehadiran: 'ERROR' };
    }
    
    if (String(siswa.Status).toUpperCase() !== 'AKTIF') {
      logScanActivity(today, nowTime, siswa.ID, siswa.NIS, siswa.Nama, siswa.Kelas, siswa.KodeKartu, jenisScan, guruPiketNama, perangkatNama, 'TIDAK_AKTIF', 'SISWA TIDAK AKTIF');
      return { success: false, message: 'SISWA TIDAK AKTIF', siswa: siswa, waktu: nowTime, statusKehadiran: 'TIDAK_AKTIF' };
    }
    
    // 2. Cek Anti-Double Scan Hari Ini
    var ss = getSpreadsheet();
    var harianSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.ABSENSI_HARIAN);
    var harianValues = harianSheet.getDataRange().getValues();
    var rowIndex = -1;
    var existingRecord = null;
    
    for (var r = 1; r < harianValues.length; r++) {
      if (String(harianValues[r][1]) === today && String(harianValues[r][2]) === String(siswa.ID)) {
        rowIndex = r + 1; // 1-indexed for sheet
        existingRecord = {
          scanDatang: harianValues[r][6],
          scanPulang: harianValues[r][7],
          status: harianValues[r][8]
        };
        break;
      }
    }
    
    if (existingRecord) {
      if (jenisScan === 'DATANG' && existingRecord.scanDatang) {
        logScanActivity(today, nowTime, siswa.ID, siswa.NIS, siswa.Nama, siswa.Kelas, siswa.KodeKartu, 'DATANG', guruPiketNama, perangkatNama, 'DUPLIKAT', 'Kartu sudah melakukan scan DATANG pada ' + existingRecord.scanDatang);
        return {
          success: false,
          isDuplicate: true,
          message: 'Kartu sudah melakukan scan DATANG pada ' + existingRecord.scanDatang,
          siswa: siswa,
          waktu: nowTime,
          statusKehadiran: existingRecord.status
        };
      }
      
      if (jenisScan === 'PULANG' && existingRecord.scanPulang) {
        logScanActivity(today, nowTime, siswa.ID, siswa.NIS, siswa.Nama, siswa.Kelas, siswa.KodeKartu, 'PULANG', guruPiketNama, perangkatNama, 'DUPLIKAT', 'Kartu sudah melakukan scan PULANG pada ' + existingRecord.scanPulang);
        return {
          success: false,
          isDuplicate: true,
          message: 'Kartu sudah melakukan scan PULANG pada ' + existingRecord.scanPulang,
          siswa: siswa,
          waktu: nowTime,
          statusKehadiran: existingRecord.status
        };
      }
    }
    
    // 3. Tulis Record Absensi
    var calculatedStatus = 'MASIH DI SEKOLAH';
    if (rowIndex > 0) {
      if (jenisScan === 'DATANG') {
        harianSheet.getRange(rowIndex, 7).setValue(nowTime); // Col 7 = ScanDatang
      } else {
        harianSheet.getRange(rowIndex, 8).setValue(nowTime); // Col 8 = ScanPulang
      }
    } else {
      var newId = 'ABS-' + today + '-' + siswa.ID;
      var scanDatangVal = (jenisScan === 'DATANG') ? nowTime : '';
      var scanPulangVal = (jenisScan === 'PULANG') ? nowTime : '';
      harianSheet.appendRow([newId, today, siswa.ID, siswa.NIS, siswa.Nama, siswa.Kelas, scanDatangVal, scanPulangVal, 'MASIH DI SEKOLAH', '']);
    }
    
    // 4. Hitung Ulang Status
    prosesStatusKehadiranTrigger(today);
    
    logScanActivity(today, nowTime, siswa.ID, siswa.NIS, siswa.Nama, siswa.Kelas, siswa.KodeKartu, jenisScan, guruPiketNama, perangkatNama, 'BERHASIL', 'Scan ' + jenisScan + ' Berhasil');
    
    return {
      success: true,
      message: 'Scan ' + jenisScan + ' Berhasil!',
      siswa: siswa,
      jenisScan: jenisScan,
      waktu: nowTime,
      statusKehadiran: calculatedStatus,
      isDuplicate: false
    };
    
  } finally {
    lock.releaseLock();
  }
}

function prosesStatusKehadiranTrigger(targetDate) {
  var today = targetDate || Utilities.formatDate(new Date(), CONFIG.DEFAULTS.TIMEZONE, 'yyyy-MM-dd');
  var nowTime = Utilities.formatDate(new Date(), CONFIG.DEFAULTS.TIMEZONE, 'HH:mm:ss');
  
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.ABSENSI_HARIAN);
  if (!sheet) return { success: true };
  
  var values = sheet.getDataRange().getValues();
  var jamMasuk = CONFIG.DEFAULTS.JAM_MASUK;
  var jamPulang = CONFIG.DEFAULTS.JAM_PULANG;
  var batasAkhir = CONFIG.DEFAULTS.BATAS_AKHIR_ABSENSI;
  
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][1]) === today) {
      var scanDatang = values[r][6];
      var scanPulang = values[r][7];
      var finalStatus = 'BELUM ABSEN';
      var ket = values[r][9] || '';
      
      if (scanDatang && scanPulang) {
        if (scanDatang <= jamMasuk) {
          finalStatus = 'HADIR';
          ket = 'Hadir Tepat Waktu';
        } else {
          finalStatus = 'TERLAMBAT';
          ket = 'Terlambat Masuk';
        }
      } else if (scanDatang && !scanPulang) {
        if (nowTime < jamPulang) {
          finalStatus = 'MASIH DI SEKOLAH';
        } else {
          finalStatus = 'BOLOS';
          ket = 'Tidak scan pulang setelah ' + jamPulang;
        }
      } else if (!scanDatang && scanPulang) {
        finalStatus = 'LOMPAT PAGAR';
        ket = 'Scan pulang tanpa scan datang';
      } else {
        if (nowTime < batasAkhir) {
          finalStatus = 'BELUM ABSEN';
        } else {
          finalStatus = 'ALPA';
          ket = 'Tidak Hadir / Alpa';
        }
      }
      
      sheet.getRange(r + 1, 9).setValue(finalStatus);
      sheet.getRange(r + 1, 10).setValue(ket);
    }
  }
  
  return { success: true, message: 'Status kehadiran berhasil dikalkulasi otomatis.' };
}

function logScanActivity(today, time, siswaId, nis, nama, kelas, kodeKartu, jenisScan, guruPiket, perangkat, statusHasil, ket) {
  var id = 'LOG-' + Date.now();
  appendSheetRow(CONFIG.SHEET_NAMES.SCAN_LOG, [
    id, today + 'T' + time, today, time, siswaId, nis, nama, kelas, kodeKartu, jenisScan, guruPiket, perangkat, statusHasil, ket
  ]);
}
`,
  },
  {
    name: 'Schedule.gs',
    type: 'gs',
    description: 'Manajemen Jadwal Guru Piket & Pengambilan Piket Hari Ini',
    code: `/**
 * Schedule.gs
 * Manajemen Jadwal Guru Piket (Senin - Sabtu)
 */

function getAllJadwalPiket() {
  var list = getSheetDataAsObjects(CONFIG.SHEET_NAMES.JADWAL_PIKET);
  return { success: true, data: list };
}

function getGuruPiketHariIniGAS() {
  var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var todayIndex = new Date().getDay();
  var todayHari = days[todayIndex];
  
  var list = getSheetDataAsObjects(CONFIG.SHEET_NAMES.JADWAL_PIKET);
  var filtered = list.filter(function(j) {
    return j.Hari === todayHari && String(j.Status).toUpperCase() === 'AKTIF';
  });
  
  return { success: true, hari: todayHari, guruPiket: filtered };
}
`,
  },
  {
    name: 'Student.gs',
    type: 'gs',
    description: 'CRUD Siswa & Pembuatan Kode QR Unik',
    code: `/**
 * Student.gs
 * Manajemen Data Siswa & Generate QR Code
 */

function getAllSiswa() {
  var list = getSheetDataAsObjects(CONFIG.SHEET_NAMES.SISWA);
  return { success: true, data: list };
}

function saveSiswaRecord(siswa) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SISWA);
  var values = sheet.getDataRange().getValues();
  var foundRow = -1;
  
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][0]) === String(siswa.id)) {
      foundRow = r + 1;
      break;
    }
  }
  
  var rowData = [
    siswa.id, siswa.nis, siswa.nisn, siswa.nama, siswa.jk, siswa.tempatLahir,
    siswa.tanggalLahir, siswa.kelas, siswa.wali, siswa.noHp, siswa.alamat,
    siswa.foto, siswa.kodeKartu, siswa.status
  ];
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return { success: true, message: 'Data siswa berhasil disimpan.' };
}

function deleteSiswaRecord(id) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SISWA);
  var values = sheet.getDataRange().getValues();
  
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][0]) === String(id)) {
      sheet.deleteRow(r + 1);
      return { success: true, message: 'Data siswa berhasil dihapus.' };
    }
  }
  return { success: false, message: 'Data siswa tidak ditemukan.' };
}
`,
  },
  {
    name: 'Report.gs',
    type: 'gs',
    description: 'Rekap Kehadiran, Statistik Dashboard, & Export Laporan',
    code: `/**
 * Report.gs
 * Rekap Kehadiran Siswa & Guru, serta Dashboard Summary
 */

function getDashboardAdminData(targetDate) {
  var today = targetDate || Utilities.formatDate(new Date(), CONFIG.DEFAULTS.TIMEZONE, 'yyyy-MM-dd');
  var harian = getSheetDataAsObjects(CONFIG.SHEET_NAMES.ABSENSI_HARIAN);
  var todayRecs = harian.filter(function(h) { return h.Tanggal === today; });
  
  var totalSiswa = getSheetDataAsObjects(CONFIG.SHEET_NAMES.SISWA).length;
  var totalGuru = getSheetDataAsObjects(CONFIG.SHEET_NAMES.GURU).length;
  
  var hadir = 0, terlambat = 0, alpa = 0, bolos = 0, lompatPagar = 0, masih = 0;
  
  todayRecs.forEach(function(r) {
    if (r.Status === 'HADIR') hadir++;
    else if (r.Status === 'TERLAMBAT') terlambat++;
    else if (r.Status === 'ALPA') alpa++;
    else if (r.Status === 'BOLOS') bolos++;
    else if (r.Status === 'LOMPAT PAGAR') lompatPagar++;
    else if (r.Status === 'MASIH DI SEKOLAH') masih++;
  });
  
  return {
    success: true,
    stats: {
      totalSiswa: totalSiswa,
      hadirHariIni: hadir,
      terlambatHariIni: terlambat,
      alpaHariIni: alpa,
      bolosHariIni: bolos,
      lompatPagarHariIni: lompatPagar,
      masihDiSekolah: masih,
      totalGuru: totalGuru
    }
  };
}
`,
  },
  {
    name: 'Utils.gs',
    type: 'gs',
    description: 'Trigger Otomatisasi (Time-driven Triggers) & Google Drive Backup',
    code: `/**
 * Utils.gs
 * Google Apps Script Triggers & Backup Google Drive
 */

function setupAutomatedTriggers() {
  // Hapus trigger lama jika ada
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Buat trigger setiap 5 menit untuk update status kehadiran siswa
  ScriptApp.newTrigger('prosesStatusKehadiranTrigger')
    .timeBased()
    .everyMinutes(5)
    .create();
    
  Logger.log('Trigger Otomatisasi Kehadiran Aktif!');
}

function backupDatabaseToDrive() {
  var ss = getSpreadsheet();
  var today = Utilities.formatDate(new Date(), CONFIG.DEFAULTS.TIMEZONE, 'yyyy-MM-dd_HH-mm');
  var backupName = 'BACKUP_ABSENSI_' + today;
  
  var file = DriveApp.getFileById(ss.getId());
  var folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDERS.BACKUP);
  
  if (folders.hasNext()) {
    var folder = folders.next();
    file.makeCopy(backupName, folder);
    Logger.log('Backup berhasil disimpan di Google Drive: ' + backupName);
  }
}
`,
  }
];

export const GAS_BACKEND_FILES: Record<string, string> = GAS_FILES.reduce((acc, f) => {
  acc[f.name] = f.code;
  return acc;
}, {} as Record<string, string>);
