import React from 'react';
import { X, Send, PlusCircle, Trash, FileText } from 'lucide-react';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl sm:max-w-3xl rounded-3xl shadow-2xl border border-slate-200/50 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div
                    className={`relative p-5 sm:p-6 flex justify-between items-center text-white ${
                        isEditing
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                            : 'bg-gradient-to-r from-[#0038A8] to-[#002b80]'
                    }`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4"></div>
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <FileText size={24} className="text-[#FCD116]" />
                        </div>

                        <div>
                            <h3 className="font-black uppercase tracking-tight text-lg sm:text-xl">
                                {isEditing ? 'Update QMS Corner' : 'Post New QMS Corner'}
                            </h3>

                            <p className="text-white/80 text-xs font-medium mt-0.5">
                                {isEditing
                                    ? 'Edit the details below'
                                    : 'Fill in the details to create a new entry'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="relative z-10 hover:bg-white/20 p-2 rounded-full transition-all hover:scale-110"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form className="p-5 sm:p-6" onSubmit={onSubmit}>

                    {/* Title */}
                    <div className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#0038A8] rounded-full"></span>
                                Document Title
                            </label>

                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 outline-none transition-all font-medium text-sm focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
                                placeholder="Enter document title..."
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#0038A8] rounded-full"></span>
                                Summary / Description
                            </label>

                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 outline-none resize-none transition-all font-medium text-sm focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
                                placeholder="Enter description..."
                            />
                        </div>

                        {/* Links */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#0038A8] rounded-full"></span>
                                    Document Links
                                </label>

                                <button
                                    type="button"
                                    onClick={addLinkField}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0038A8] text-white rounded-lg text-xs font-bold hover:bg-[#CE1126] transition-all shadow-md active:scale-95"
                                >
                                    <PlusCircle size={15} />
                                    Add Link
                                </button>
                            </div>

                            {formData.links.map((link, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 items-start bg-slate-50/80 p-4 rounded-2xl border-2 border-slate-200 hover:border-[#0038A8]/30 transition-all"
                                >
                                    <div className="flex-1 space-y-3">

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <span className="text-[#0038A8]">
                                                    #{index + 1}
                                                </span>
                                                Link Title
                                            </label>

                                            <input
                                                type="text"
                                                required
                                                value={link.title}
                                                onChange={(e) =>
                                                    handleLinkChange(
                                                        index,
                                                        'title',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none transition-all text-xs font-medium focus:border-[#0038A8]"
                                                placeholder="e.g., View Document"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Google Drive URL
                                            </label>

                                            <input
                                                type="url"
                                                required
                                                value={link.url}
                                                onChange={(e) =>
                                                    handleLinkChange(
                                                        index,
                                                        'url',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white outline-none transition-all text-xs font-medium focus:border-[#0038A8]"
                                                placeholder="https://drive.google.com/file/d/..."
                                            />
                                        </div>
                                    </div>

                                    {formData.links.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeLinkField(index)
                                            }
                                            className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 hover:scale-105"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 mt-4 flex gap-3 border-t-2 border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl font-bold border-2 border-slate-200 text-slate-600 uppercase text-xs hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all uppercase text-xs flex items-center justify-center gap-2 shadow-lg ${
                                isEditing
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700'
                                    : 'bg-gradient-to-r from-[#0038A8] to-[#002b80] hover:from-[#CE1126]'
                            }`}
                        >
                            <Send size={16} />
                            {isEditing
                                ? 'Save Changes'
                                : 'Post Document'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupModal;