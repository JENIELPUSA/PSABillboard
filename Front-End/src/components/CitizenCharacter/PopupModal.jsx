// PopupModal.jsx
import React, { useState } from 'react';
import { X, Send, PlusCircle, Trash, FileText, Image } from 'lucide-react';

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
    if (!isOpen) return null;

    const isEditing = !!editingId;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            {/* Billboard Container - Taller and Wider */}
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 animate-in zoom-in-95 duration-200 my-4">
                
                {/* Billboard Style Header - More prominent */}
                <div className={`relative p-8 flex justify-between items-center text-white ${isEditing ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-[#0038A8] to-[#002b80]'}`}>
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <FileText size={28} className="text-[#FCD116]" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-tight text-xl">
                                {isEditing ? "Update QMS Corner" : "Post New QMS Corner"}
                            </h3>
                            <p className="text-white/70 text-sm font-medium mt-0.5">
                                {isEditing ? "Edit the details below" : "Fill in the details to create a new entry"}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="relative z-10 hover:bg-white/20 p-2.5 rounded-full transition-all hover:scale-110"
                    >
                        <X size={26} />
                    </button>
                </div>

                {/* Form Content - Taller with more padding */}
                <form className="p-8 space-y-6 max-h-[65vh] overflow-y-auto" onSubmit={onSubmit}>
                    
                    {/* Title Field - Larger */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#0038A8] rounded-full"></span>
                            Document Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-slate-50 outline-none transition-all font-medium text-lg focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
                            placeholder="Enter document title..."
                        />
                    </div>

                    {/* Description Field - Taller */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#0038A8] rounded-full"></span>
                            Summary / Description
                        </label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-slate-50 outline-none resize-none transition-all font-medium focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
                            placeholder="Enter description..."
                        />
                    </div>

                    {/* Multiple Links Section - Enhanced */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#0038A8] rounded-full"></span>
                                Document Links
                            </label>
                            <button
                                type="button"
                                onClick={addLinkField}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0038A8] text-white rounded-xl text-xs font-bold hover:bg-[#CE1126] transition-all shadow-md hover:shadow-lg"
                            >
                                <PlusCircle size={16} /> Add Link
                            </button>
                        </div>

                        {formData.links.map((link, index) => (
                            <div key={index} className="flex gap-4 items-start bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border-2 border-slate-200 hover:border-[#0038A8]/30 transition-all">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <span className="text-[#0038A8]">#{index + 1}</span> Link Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={link.title}
                                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white outline-none transition-all text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8]"
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
                                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white outline-none transition-all text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8]"
                                            placeholder="https://drive.google.com/file/d/..."
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            Paste the full Google Drive file URL
                                        </p>
                                    </div>
                                </div>
                                {formData.links.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLinkField(index)}
                                        className="mt-1 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 hover:scale-110"
                                    >
                                        <Trash size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons - Larger and more prominent */}
                    <div className="pt-6 flex gap-4 border-t-2 border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-5 rounded-2xl font-black border-2 border-slate-200 text-slate-500 uppercase text-xs hover:bg-slate-50 transition-all hover:border-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-6 py-5 rounded-2xl font-black text-white transition-all uppercase text-xs flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${isEditing ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' : 'bg-gradient-to-r from-[#0038A8] to-[#002b80] hover:from-[#CE1126] hover:to-[#0038A8]'
                                }`}
                        >
                            <Send size={18} /> {isEditing ? "Save Changes" : "Post Document"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupModal;