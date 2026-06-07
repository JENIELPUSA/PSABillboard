import React from "react";
import { ExternalLink, FileText, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

export const MemoCard = ({ title, description, url, onEdit, onDelete }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border-l-8 border-l-[#0038A8] border border-slate-200 dark:border-slate-800 hover:border-[#FCD116] transition-all hover:-translate-y-1 hover:shadow-2xl h-full">
      
      {/* Subtle Background Icon Pattern */}
      <div className="absolute -top-4 -right-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-500">
        <FileText size={160} />
      </div>

      {/* Header: Title and Action Buttons */}
      <div className="flex items-start justify-between relative z-10 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ce1126] dark:text-red-500">
            Official Memorandum
          </span>
          <h3 className="text-[#0038A8] dark:text-blue-400 font-black text-xl leading-tight uppercase tracking-tight group-hover:text-[#002b80] dark:group-hover:text-blue-300 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
        
        {/* Action Buttons - Only show if onEdit and onDelete props are provided */}
        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-2">
            {/* Edit Button - Only show if onEdit prop is provided */}
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onEdit();
                }}
                className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#0038A8] dark:text-blue-400 hover:bg-[#0038A8] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all border border-blue-100 dark:border-blue-800/50 shadow-sm"
                title="Edit Memorandum"
              >
                <Pencil size={18} />
              </button>
            )}
            
            {/* Delete Button - Only show if onDelete prop is provided */}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-[#ce1126] dark:text-red-400 hover:bg-[#ce1126] hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all border border-red-100 dark:border-red-800/50 shadow-sm"
                title="Delete Memorandum"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-[2px] w-12 bg-[#FCD116] mt-4 mb-4 shrink-0" />

      {/* Description Body */}
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium line-clamp-3">
        {description || "This document is issued by the Philippine Statistics Authority. Click the button below to access the official content."}
      </p>

      {/* Footer: View Button and Tag */}
      <div className="flex items-center justify-between mt-auto pt-4 relative z-10">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#0038A8] text-white px-8 py-3.5 rounded-xl text-[13px] font-black uppercase tracking-wider hover:bg-[#002b80] hover:shadow-[0_10px_20px_-10px_rgba(0,56,168,0.5)] transition-all active:scale-95 w-full justify-center md:w-auto"
        >
          View Document <ExternalLink size={16} className="text-[#FCD116]" />
        </a>
        
        <span className="hidden md:block text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-tighter">
          PSA-RSSO-VII
        </span>
      </div>
    </div>
  );
};