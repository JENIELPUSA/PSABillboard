import React, { useState, useEffect } from 'react';
import { X, Send, PlusCircle, Trash, FileText, MonitorOff } from 'lucide-react';

const PopupModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingId,
    formData,
    setFormData,
    handleLinkChange,
    addLinkField,
    removeLinkField
}) => {
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isOpen) return null;

    const isEditing = !!editingId;

    // Mobile view
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 animate-in zoom-in-95 duration-200 p-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-[#0038A8]/10 p-4 rounded-full mb-4">
                            <MonitorOff size={48} className="text-[#0038A8]" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-[#0038A8]">Desktop Optimized Only</h2>
                        <p className="text-sm text-slate-500 mt-2">Please view on a larger screen to access this feature</p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-6 py-3 bg-[#0038A8] text-white rounded-xl font-bold hover:bg-[#CE1126] transition-all w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            {/* Container - Responsive height based on screen size and orientation */}
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 animate-in zoom-in-95 duration-200 flex flex-col
                h-[95vh]                    /* Default for mobile portrait */
                sm:h-[90vh]                 /* Small screens */
                md:h-[85vh]                 /* Medium screens */
                lg:h-[80vh]                 /* Large screens */
                xl:h-[75vh]                 /* Extra large screens */
                2xl:h-[70vh]                /* 2XL screens */
                landscape:h-[90vh]          /* Landscape orientation */
                sm:landscape:h-[85vh]       /* Small landscape */
                md:landscape:h-[80vh]       /* Medium landscape */
                lg:landscape:h-[75vh]       /* Large landscape */
                xl:landscape:h-[70vh]       /* XL landscape */
            ">
                
                {/* Header */}
                <div className={`relative p-4 sm:p-6 lg:p-8 flex justify-between items-center text-white shrink-0 ${isEditing ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-[#0038A8] to-[#002b80]'}`}>
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                            <FileText size={20} className="sm:size-28 text-[#FCD116]" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-tight text-base sm:text-lg lg:text-xl">
                                {isEditing ? "Update QMS Corner" : "Post New QMS Corner"}
                            </h3>
                            <p className="text-white/70 text-[10px] sm:text-xs lg:text-sm font-medium mt-0.5">
                                {isEditing ? "Edit the details below" : "Fill in the details to create a new entry"}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={onClose}
                        className="relative z-10 hover:bg-white/20 p-2 rounded-full transition-all hover:scale-110"
                    >
                        <X size={22} className="sm:size-26" />
                    </button>
                </div>

                {/* Form - Takes remaining space */}
                <form className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" onSubmit={onSubmit}>
                    
                    {/* Scrollable Fields Section */}
                    <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-6">
                        
                        {/* Title Field */}
                        <div className="space-y-1 sm:space-y-2">
                            <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#0038A8] rounded-full"></span>
                                Document Title
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-slate-50 outline-none transition-all font-medium text-sm sm:text-base lg:text-lg focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
                                placeholder="Enter document title..."
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-1 sm:space-y-2">
                            <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#0038A8] rounded-full"></span>
                                Summary / Description
                            </label>
                            <textarea
                                rows={window.innerHeight < 600 ? 2 : 3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-slate-50 outline-none resize-none transition-all font-medium text-sm sm:text-base focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
                                placeholder="Enter description..."
                            />
                        </div>

                        {/* Multiple Links Section */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2 sm:pb-3">
                                <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#0038A8] rounded-full"></span>
                                    Document Links
                                </label>
                                <button
                                    type="button"
                                    onClick={addLinkField}
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0038A8] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-[#CE1126] transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                >
                                    <PlusCircle size={14} className="sm:size-16" /> Add Link
                                </button>
                            </div>

                            {formData.links.map((link, index) => (
                                <div key={index} className="flex gap-3 sm:gap-4 items-start bg-gradient-to-br from-slate-50 to-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-[#0038A8]/30 transition-all">
                                    <div className="flex-1 space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <span className="text-[#0038A8]">#{index + 1}</span> Link Title
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={link.title}
                                                onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                                className="w-full px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white outline-none transition-all text-xs sm:text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8]"
                                                placeholder="e.g., View Document, Download PDF, etc."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Google Drive URL
                                            </label>
                                            <input
                                                type="url"
                                                required
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                className="w-full px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-slate-200 bg-white outline-none transition-all text-xs sm:text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8]"
                                                placeholder="https://drive.google.com/file/d/..."
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                Paste the full Google Drive file URL
                                            </p>
                                        </div>
                                    </div>
                                    {formData.links.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLinkField(index)}
                                            className="mt-1 p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all shrink-0 hover:scale-110"
                                        >
                                            <Trash size={16} className="sm:size-20" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons - Fixed at bottom */}
                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 flex gap-3 sm:gap-4 border-t-2 border-slate-100 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black border-2 border-slate-200 text-slate-500 uppercase text-[10px] sm:text-xs hover:bg-slate-50 transition-all hover:border-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black text-white transition-all uppercase text-[10px] sm:text-xs flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl ${
                                isEditing 
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' 
                                    : 'bg-gradient-to-r from-[#0038A8] to-[#002b80] hover:from-[#CE1126] hover:to-[#0038A8]'
                            }`}
                        >
                            <Send size={14} className="sm:size-18" /> 
                            {isEditing ? "Save Changes" : "Post Document"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupModal;