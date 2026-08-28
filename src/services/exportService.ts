import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AbsensiHarian, ProfilSekolah } from '../types';

export class ExportService {
  /**
   * Export attendance data to PDF with official school header
   */
  static exportAttendancePDF(
    data: AbsensiHarian[],
    profil: ProfilSekolah,
    periode: string,
    kelas: string
  ) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const printDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 1. School Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(profil.namaSekolah.toUpperCase(), 105, 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`NPSN: ${profil.npsn} | Telp: ${profil.telepon} | Email: ${profil.email}`, 105, 22, { align: 'center' });
    doc.text(profil.alamat, 105, 27, { align: 'center' });

    // Divider Line
    doc.setLineWidth(0.8);
    doc.line(14, 31, 196, 31);
    doc.setLineWidth(0.2);
    doc.line(14, 32, 196, 32);

    // 2. Report Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('LAPORAN KEHADIRAN SISWA', 105, 40, { align: 'center' });

    // Meta Info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Periode  : ${periode}`, 14, 48);
    doc.text(`Kelas    : ${kelas}`, 14, 53);
    doc.text(`Tanggal Cetak : ${printDate}`, 196, 48, { align: 'right' });
    doc.text(`Total Siswa   : ${data.length} Siswa`, 196, 53, { align: 'right' });

    // 3. Table Rows
    const tableBody = data.map((item, index) => [
      index + 1,
      item.nis,
      item.nama,
      item.kelas,
      item.scanDatang || '-',
      item.scanPulang || '-',
      item.status,
      item.keterangan || '-',
    ]);

    autoTable(doc, {
      startY: 58,
      head: [['No', 'NIS', 'Nama Siswa', 'Kelas', 'Datang', 'Pulang', 'Status', 'Keterangan']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // Slate 800
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 22 },
        2: { cellWidth: 45 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 18 },
        5: { halign: 'center', cellWidth: 18 },
        6: { halign: 'center', cellWidth: 26 },
        7: { cellWidth: 23 },
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'body' && hookData.column.index === 6) {
          const status = hookData.cell.raw;
          if (status === 'HADIR') {
            hookData.cell.styles.textColor = [22, 101, 52]; // Green
            hookData.cell.styles.fontStyle = 'bold';
          } else if (status === 'TERLAMBAT') {
            hookData.cell.styles.textColor = [161, 98, 7]; // Yellow/Amber
            hookData.cell.styles.fontStyle = 'bold';
          } else if (status === 'ALPA' || status === 'BOLOS') {
            hookData.cell.styles.textColor = [185, 28, 28]; // Red
            hookData.cell.styles.fontStyle = 'bold';
          } else if (status === 'LOMPAT PAGAR') {
            hookData.cell.styles.textColor = [109, 40, 217]; // Purple
            hookData.cell.styles.fontStyle = 'bold';
          } else if (status === 'MASIH DI SEKOLAH') {
            hookData.cell.styles.textColor = [29, 78, 216]; // Blue
          }
        }
      },
    });

    // 4. Signatures at the bottom
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY + 12;
    if (finalY < 250) {
      doc.setFontSize(9);
      doc.text('Mengetahui,', 150, finalY);
      doc.text('Kepala Sekolah', 150, finalY + 5);
      doc.text(profil.kepalaSekolah, 150, finalY + 26);
      doc.setLineWidth(0.2);
      doc.line(150, finalY + 27, 195, finalY + 27);
      doc.text(`NIP. 19700101 199503 1 001`, 150, finalY + 31);
    }

    doc.save(`Laporan_Kehadiran_${kelas.replace(/\s+/g, '_')}_${periode.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  }

  /**
   * Export to Microsoft Excel (.xlsx)
   */
  static exportAttendanceExcel(
    data: AbsensiHarian[],
    profil: ProfilSekolah,
    periode: string,
    kelas: string
  ) {
    const rows = [
      [profil.namaSekolah],
      ['LAPORAN KEHADIRAN SISWA'],
      [`Periode: ${periode}`, `Kelas: ${kelas}`],
      [`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`],
      [],
      ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Scan Datang', 'Scan Pulang', 'Status Kehadiran', 'Keterangan'],
    ];

    data.forEach((item, index) => {
      rows.push([
        String(index + 1),
        item.nis,
        item.nama,
        item.kelas,
        item.scanDatang || '-',
        item.scanPulang || '-',
        item.status,
        item.keterangan || '-',
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Kehadiran');

    // Auto column widths
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 28 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 30 },
    ];

    XLSX.writeFile(workbook, `Rekap_Kehadiran_${kelas.replace(/\s+/g, '_')}_${periode.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  }

  /**
   * Export to CSV
   */
  static exportAttendanceCSV(data: AbsensiHarian[], filename = 'rekap_kehadiran.csv') {
    const headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Scan Datang', 'Scan Pulang', 'Status', 'Keterangan'];
    const rows = data.map((d, i) => [
      i + 1,
      `"${d.nis}"`,
      `"${d.nama.replace(/"/g, '""')}"`,
      `"${d.kelas}"`,
      `"${d.scanDatang || ''}"`,
      `"${d.scanPulang || ''}"`,
      `"${d.status}"`,
      `"${(d.keterangan || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
