import { FileStack } from "lucide-react";
import PdfMerger from "./tools/pdf-merger/PdfMerger";

export default function App() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 flex items-center justify-center p-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl px-6 py-8 md:px-12 md:py-12 flex flex-col items-center">
        {/* Logo/icon */}
        <div className="flex justify-center mb-4">
          <FileStack size={48} className="text-blue-700" />
        </div>
        {/* Brand name */}
        <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center tracking-tight">
          DocuBuds
        </h1>
        {/* Tagline for the suite */}
        <p className="mb-2 text-gray-600 text-center text-base font-medium">
          Friendly document toolkit
        </p>
        {/* Browser privacy badge */}
        <div className="inline-flex items-center mb-4 px-3 py-1 bg-green-50 rounded-full text-green-700 font-semibold text-xs shadow-sm">
          <svg width="14" height="14" fill="none" className="mr-1" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" fill="#bbf7d0" />
            <path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          100% in your browser — your files never leave your device
        </div>

        {/* PDF merger "feature name" and description, left-aligned */}
        <PdfMerger />
        
        {/* New Footer */}
        <div className="text-xs text-gray-400 mt-8 text-center leading-relaxed">
          &copy; {year} DocuBuds. All rights reserved.<br />
          <span className="block mt-1 text-gray-500">
            DocuBuds is a free online tool to merge PDFs. No installation, no registration, 100% secure.
          </span>
        </div>
      </div>
    </div>
  );
}
