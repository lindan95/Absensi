import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, X, Download, School, ShieldCheck } from 'lucide-react';
import { Siswa, ProfilSekolah } from '../../types';

interface StudentCardPrintProps {
  students: Siswa[];
  profil: ProfilSekolah;
  onClose: () => void;
}

export const StudentCardPrint: React.FC<StudentCardPrintProps> = ({
  students,
  profil,
  onClose,
}) => {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate QR codes for all provided students
    const generateAllQrs = async () => {
      const qrs: Record<string, string> = {};
      for (const s of students) {
        try {
          const url = await QRCode.toDataURL(s.kodeKartu, {
            width: 200,
            margin: 1,
            color: {
              dark: '#0f172a',
              light: '#ffffff',
            },
          });
          qrs[s.id] = url;
        } catch (err) {
          console.error('Failed to generate QR for', s.id, err);
        }
      }
      setQrCodes(qrs);
    };

    generateAllQrs();
  }, [students]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 flex flex-col items-center">
      {/* Control Bar (Hidden on Print) */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-4 mb-6 flex items-center justify-between no-print border border-slate-200">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Cetak Kartu Siswa & QR Code</h3>
          <p className="text-xs text-slate-700">
            Total {students.length} kartu siap dicetak dalam format standar ID Card
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu Sekarang (Print)
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-100 rounded-2xl print:bg-white print:p-0 print:m-0 print:max-w-none print:grid-cols-2">
        {students.map((siswa) => (
          <div
            key={siswa.id}
            className="relative w-full max-w-[430px] mx-auto bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-slate-800 flex flex-col justify-between print:shadow-none print:break-inside-avoid print:mb-6"
            style={{ minHeight: '260px' }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  {profil.logo ? (
                    <img src={profil.logo} alt="Logo" className="w-full h-full object-cover rounded" />
                  ) : (
                    <School className="w-6 h-6 text-slate-900" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-tight leading-none text-amber-300">
                    {profil.namaSekolah}
                  </h4>
                  <p className="text-[9px] text-slate-300 font-semibold tracking-wider uppercase mt-0.5">
                    KARTU IDENTITAS SISWA & PRESENSI
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            </div>

            {/* Card Main Body */}
            <div className="p-3.5 flex gap-3.5 items-center flex-1 bg-gradient-to-b from-white to-slate-50">
              {/* Photo & NIS */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-100">
                  <img
                    src={siswa.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={siswa.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-800 font-mono mt-1">
                  NIS: {siswa.nis}
                </span>
              </div>

              {/* Student Metadata Details */}
              <div className="flex-1 min-w-0 text-left">
                <h5 className="font-extrabold text-sm text-slate-900 leading-tight uppercase line-clamp-1">
                  {siswa.nama}
                </h5>

                <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-700">
                  <div className="flex">
                    <span className="w-14 text-slate-700 font-medium">Kelas</span>
                    <span className="font-bold text-blue-900">: {siswa.kelas}</span>
                  </div>
                  <div className="flex">
                    <span className="w-14 text-slate-700 font-medium">NISN</span>
                    <span className="font-mono">: {siswa.nisn || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-14 text-slate-700 font-medium">JK / TTL</span>
                    <span>
                      : {siswa.jk === 'L' ? 'Laki-laki' : 'Perempuan'}, {siswa.tempatLahir}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-14 text-slate-700 font-medium">Wali</span>
                    <span className="truncate">: {siswa.wali || '-'}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center shrink-0 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
                {qrCodes[siswa.id] ? (
                  <img
                    src={qrCodes[siswa.id]}
                    alt={`QR ${siswa.kodeKartu}`}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 animate-pulse">
                    QR Code...
                  </div>
                )}
                <span className="text-[8px] font-mono font-bold text-slate-700 mt-0.5">
                  {siswa.kodeKartu}
                </span>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="bg-slate-100 px-3.5 py-1.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-700 font-medium">
              <span>Kartu resmi absensi sekolah</span>
              <span>Berlaku s.d: 2027/2028</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
