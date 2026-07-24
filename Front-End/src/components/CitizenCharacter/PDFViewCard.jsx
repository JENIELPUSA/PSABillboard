// PDFViewCard.jsx
import React from 'react';
import { X, FileText, ExternalLink } from 'lucide-react';

const PDFViewCard = ({ document, onClose }) => {
  if (!document) return null;

  const fileId = document.links?.[0]?.fileId;
  const hasValidFileId = fileId && fileId.trim() !== '';

  if (!hasValidFileId) {
    return (
      <div className="col-span-1 md:col-span-2 xl:col-span-3">
        <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-[#0038A8] overflow-hidden max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 z-10 relative p-5 sm:p-6 flex justify-between items-center text-white bg-gradient-to-r from-[#0038A8] to-[#002b80]">
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FileText size={24} className="text-[#FCD116]" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-lg sm:text-xl line-clamp-1">
                  {document.title || 'Document Viewer'}
                </h3>
              </div>
            </div>
            <button onClick={onClose} className="relative z-10 hover:bg-white/20 p-2 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>
          <div className="text-center py-12 px-4">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-red-500" />
            </div>
            <h4 className="font-bold text-slate-700 text-lg mb-2">No Preview Available</h4>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              The document could not be loaded. Please check if the Google Drive link is valid.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#0038A8] text-white rounded-xl font-medium hover:bg-[#002b80] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-2 xl:col-span-3">
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-[#0038A8] overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 relative p-5 sm:p-6 flex justify-between items-center text-white bg-gradient-to-r from-[#0038A8] to-[#002b80]">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <FileText size={24} className="text-[#FCD116]" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-lg sm:text-xl line-clamp-1">
                {document.title || 'Document Viewer'}
              </h3>
              <p className="text-white/80 text-xs font-medium mt-0.5">PDF Document Preview</p>
            </div>
          </div>

          <button onClick={onClose} className="relative z-10 hover:bg-white/20 p-2 rounded-full transition-all hover:scale-110">
            <X size={24} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="p-5 sm:p-6 bg-white">
          <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            <div className="relative w-full" style={{ paddingBottom: '141.4%' }}>
              <iframe
                src={`https://drive.google.com/file/d/${fileId}/preview`}
                width="100%"
                height="100%"
                allow="autoplay; fullscreen"
                className="absolute top-0 left-0 w-full h-full"
                title={document.title || 'Document Preview'}
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                  {document.title || 'Document'}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">A4 Size</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://drive.google.com/file/d/${fileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0038A8] hover:text-[#CE1126] font-bold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} /> Open in new tab
                </a>
                <a
                  href={`https://drive.google.com/uc?export=download&id=${fileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#0038A8] text-white px-3 py-1.5 rounded-lg hover:bg-[#002b80] transition-colors shadow-sm"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewCard;