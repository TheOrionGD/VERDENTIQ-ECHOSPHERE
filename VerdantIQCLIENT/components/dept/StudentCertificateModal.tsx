'use client';

import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, Download, Printer, CheckCircle, ShieldCheck, Sparkles, X } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  studentEmail: string;
  department: string;
  subCohort: string;
  ecoPoints: number;
  co2OffsetKg: number;
  rank: number;
  periodText: string; // e.g. "Year 2026", "November 2026"
  sdgGoal?: {
    number: number;
    name: string;
    icon: string;
  };
  issueDate?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentCertificateModal: React.FC<CertificateProps> = ({
  studentName,
  studentEmail,
  department,
  subCohort,
  ecoPoints,
  co2OffsetKg,
  rank,
  periodText,
  sdgGoal = { number: 7, name: 'Affordable and Clean Energy', icon: '⚡' },
  issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  isOpen,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VerdantIQ_Eco_Certificate_${studentName.replace(/\s+/g, '_')}_${periodText.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `VIQ-CERT-${Math.abs(studentName.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16).toUpperCase()}-${periodText.replace(/[^0-9]/g, '') || '2026'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold font-editorial">Official Student Sustainability Certificate</h2>
            <Badge variant="amber">Rank #{rank} Distinction</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="bg-emerald-900/60 border-emerald-500 text-emerald-200 hover:bg-emerald-800 text-xs font-bold gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Render Target (Rendered in Landscape A4 Proportions) */}
        <div className="p-8 bg-stone-100 flex justify-center">
          <div
            ref={certificateRef}
            className="w-full max-w-[800px] aspect-[1.414/1] bg-white p-8 relative rounded-2xl shadow-lg border-[10px] border-[#064E3B] flex flex-col justify-between text-stone-900 font-sans select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(6, 78, 59, 0.03) 0%, rgba(255, 255, 255, 1) 70%)',
            }}
          >
            {/* Outer Decorative Guilloché Border Line */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-600/40 rounded-xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center space-y-1 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[#064E3B]">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="font-mono text-[10px] font-extrabold tracking-widest uppercase text-stone-500">
                  VerdantIQ Campus Sustainability Alliance
                </span>
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#064E3B] font-editorial uppercase">
                Certificate of Environmental Excellence
              </h1>
              <p className="text-xs font-medium text-stone-500 tracking-wide uppercase">
                United Nations SDG Sustainability Distinction Award
              </p>
            </div>

            {/* Recipient Details */}
            <div className="text-center space-y-3 my-auto relative z-10">
              <p className="text-xs text-stone-600 italic">This distinction is officially conferred upon</p>
              <div className="text-3xl font-black text-stone-900 font-editorial border-b-2 border-stone-300 pb-2 inline-block px-8 min-w-[320px]">
                {studentName}
              </div>
              <div className="text-xs text-stone-600 font-mono">
                {studentEmail} &bull; {department} &bull; <span className="font-semibold text-stone-800">{subCohort}</span>
              </div>
              <p className="text-xs text-stone-700 max-w-lg mx-auto leading-relaxed pt-1">
                For demonstrating outstanding environmental leadership, verifiable energy setback practices, and climate action during{' '}
                <span className="font-bold text-[#064E3B]">{periodText}</span>, achieving top-tier academic rank #{rank}.
              </p>
            </div>

            {/* Achievement Badges & Metrics Row */}
            <div className="grid grid-cols-3 gap-3 bg-stone-50/80 p-3 rounded-xl border border-stone-200/80 text-center relative z-10">
              <div className="border-r border-stone-200 pr-2">
                <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">EcoPoints Scored</span>
                <span className="text-xl font-black text-emerald-800 font-mono">{ecoPoints.toLocaleString()}</span>
                <span className="text-[9px] text-stone-500 block">Verified Activities</span>
              </div>
              <div className="border-r border-stone-200 pr-2">
                <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">Verified Carbon Offset</span>
                <span className="text-xl font-black text-[#064E3B] font-mono">{co2OffsetKg} kg</span>
                <span className="text-[9px] text-stone-500 block">Net GHG Avoided</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">Primary UN SDG</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-base">{sdgGoal.icon}</span>
                  <span className="text-xs font-bold text-stone-800 truncate max-w-[140px]">
                    SDG {sdgGoal.number}: {sdgGoal.name}
                  </span>
                </div>
                <span className="text-[9px] text-stone-500 block">UN Target Impact</span>
              </div>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="flex items-end justify-between pt-4 border-t border-stone-200 text-xs relative z-10">
              <div className="text-left space-y-1">
                <div className="font-serif italic text-base text-stone-800">Dr. Alistair Vance, Ph.D.</div>
                <div className="text-[10px] text-stone-500 uppercase font-mono tracking-wider">
                  Chair, Campus ESG Governance Board
                </div>
              </div>

              {/* Verified Digital Seal */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-600 bg-amber-50 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="h-7 w-7 text-amber-700" />
                </div>
                <span className="text-[9px] font-mono font-bold text-amber-800 mt-1 uppercase">Cryptographically Verified</span>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono text-xs font-bold text-stone-800">{issueDate}</div>
                <div className="text-[10px] text-stone-500 uppercase font-mono tracking-wider">Date of Conferment</div>
                <div className="text-[9px] font-mono text-stone-400">{certificateId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

