import React, { useState, useEffect, useContext } from 'react';
import {
    MonitorOff,
    Building2,
    FileText,
    ExternalLink,
    BookOpen,
    Pencil,
    Trash2,
    Plus,
    X,
    Send,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Search,
    Eye,
    Link,
    AlertCircle
} from 'lucide-react';
import { Banner } from '../Banner/Banner';
import { ImageCarousel } from "../ImageCarousel/ImageCarousel";
import { QmsCornerContext } from '../../contexts/QmsContext';
import { AuthContext } from '../../contexts/AuthContext';

// Assets
import asset1 from "../../assets/assets1.jpeg";
import asset2 from "../../assets/assets2.jpeg";
import asset3 from "../../assets/assets3.jpeg";
import asset4 from "../../assets/assets4.jpeg";
import bannerVideo from "../../assets/banner.mp4";

const QmsCorner = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Get auth context for role
    const { role } = useContext(AuthContext);
    
    // Check if user is admin
    const isAdmin = role === "admin";
    
    // Get all needed functions and data from QmsCornerContext
    const { 
        qmsCorners,
        loading,
        error,
        totalCount,
        totalPages,
        currentPage,
        limit,
        searchTerm,
        AddQmsCorner,
        UpdateQmsCorner,
        DeleteQmsCorner,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        clearSearch,
        FetchQmsCorners
    } = useContext(QmsCornerContext);

    // --- LOCAL STATES FOR UI ---
    const [localSearchInput, setLocalSearchInput] = useState(searchTerm || "");
    const [isSearching, setIsSearching] = useState(false);

    console.log("qmsCorners", qmsCorners)

    // --- STATES PARA SA MODAL AT FORM ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);

    // State for managing subtitle entries (each has subtitle and googleLink)
    const [subtitleInputs, setSubtitleInputs] = useState([{ subtitle: "", googleLink: "" }]);

    // Form data for QMS
    const [formData, setFormData] = useState({
        title: "",
        subtitle: [] // This will store array of objects { subtitle, googleLink }
    });

    const carouselImages = [
        { id: 1, src: asset1, alt: "Image 1" },
        { id: 2, src: asset2, alt: "Image 2" },
        { id: 3, src: asset3, alt: "Image 3" },
        { id: 4, src: asset4, alt: "Image 4" },
    ];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselImages.length]);

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setIsSearching(true);
        handleSearch(localSearchInput);
    };

    // Clear search
    const handleClearSearch = () => {
        setLocalSearchInput("");
        setIsSearching(false);
        clearSearch();
    };

    // Handle subtitle input changes
    const handleSubtitleChange = (index, field, value) => {
        const newSubtitles = [...subtitleInputs];
        newSubtitles[index][field] = value;
        setSubtitleInputs(newSubtitles);
        
        // Filter out empty entries for formData
        const validSubtitles = newSubtitles.filter(item => item.subtitle.trim() !== "" && item.googleLink.trim() !== "");
        setFormData({ ...formData, subtitle: validSubtitles });
    };

    // Add new subtitle input field
    const addSubtitleField = () => {
        setSubtitleInputs([...subtitleInputs, { subtitle: "", googleLink: "" }]);
    };

    // Remove subtitle input field
    const removeSubtitleField = (index) => {
        const newSubtitles = subtitleInputs.filter((_, i) => i !== index);
        setSubtitleInputs(newSubtitles);
        const validSubtitles = newSubtitles.filter(item => item.subtitle.trim() !== "" && item.googleLink.trim() !== "");
        setFormData({ ...formData, subtitle: validSubtitles });
    };

    const openModalForAdd = () => {
        setEditingId(null);
        setSubtitleInputs([{ subtitle: "", googleLink: "" }]);
        setFormData({
            title: "",
            subtitle: []
        });
        setIsModalOpen(true);
    };

    const openModalForEdit = (item) => {
        setEditingId(item._id);
        // Convert existing subtitle array to the form format
        let subtitles = [];
        if (item.subtitle && item.subtitle.length > 0) {
            subtitles = [...item.subtitle];
        } else {
            subtitles = [{ subtitle: "", googleLink: "" }];
        }
        setSubtitleInputs(subtitles);
        setFormData({
            title: item.title,
            subtitle: [...subtitles]
        });
        setIsModalOpen(true);
    };

    // Handle Add using context
    const handleAdd = async (e) => {
        e.preventDefault();

        const validSubtitles = subtitleInputs.filter(item => item.subtitle.trim() !== "" && item.googleLink.trim() !== "");

        if (validSubtitles.length === 0) {
            setToastMsg("Please add at least one subtitle with document name and URL!");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        const payload = {
            title: formData.title.toUpperCase(),
            subtitle: validSubtitles
        };

        const result = await AddQmsCorner(payload);
        
        if (result.success) {
            setToastMsg("QMS Document added successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset form and close modal
            setFormData({ title: "", subtitle: [] });
            setSubtitleInputs([{ subtitle: "", googleLink: "" }]);
            setIsModalOpen(false);
        } else {
            setToastMsg(result.error || "Failed to add document");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // Handle Update using context
    const handleUpdate = async (e) => {
        e.preventDefault();

        const validSubtitles = subtitleInputs.filter(item => item.subtitle.trim() !== "" && item.googleLink.trim() !== "");

        if (validSubtitles.length === 0) {
            setToastMsg("Please add at least one subtitle with document name and URL!");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        const updatedItem = {
            title: formData.title.toUpperCase(),
            subtitle: validSubtitles
        };

        console.log('Update payload:', updatedItem);

        const result = await UpdateQmsCorner(editingId, updatedItem);
        
        if (result.success) {
            setToastMsg("QMS Document updated successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            setFormData({ title: "", subtitle: [] });
            setSubtitleInputs([{ subtitle: "", googleLink: "" }]);
            setIsModalOpen(false);
            setEditingId(null);
        } else {
            setToastMsg(result.error || "Failed to update document");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // Handle Delete using context
    const handleDelete = async () => {
        const result = await DeleteQmsCorner(announcementToDelete._id);
        
        if (result.success) {
            setToastMsg("QMS Document deleted successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            
            setShowDeleteConfirm(false);
            setAnnouncementToDelete(null);
        } else {
            setToastMsg(result.error || "Failed to delete document");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // Unified submit handler
    const handleSubmit = (e) => {
        if (editingId) {
            handleUpdate(e);
        } else {
            handleAdd(e);
        }
    };

    // Open delete confirmation modal
    const openDeleteConfirm = (item) => {
        setAnnouncementToDelete(item);
        setShowDeleteConfirm(true);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (isMobile) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center p-10 text-center font-sans">
                <div className="flex flex-col items-center">
                    <MonitorOff size={60} className="text-[#0038A8]" />
                    <h2 className="text-xl font-bold uppercase tracking-tighter">Desktop Optimized Only</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#f8fafc] font-sans pb-20 overflow-x-hidden">
            {/* --- TOAST NOTIFICATION --- */}
            {showToast && (
                <div className="fixed top-5 right-5 z-[200] animate-in slide-in-from-right duration-300">
                    <div className={`${toastType === "success" ? "bg-emerald-500 border-emerald-700" : "bg-red-500 border-red-700"} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-b-4`}>
                        <CheckCircle2 size={24} className="animate-bounce" />
                        <div>
                            <p className="font-black text-[10px] uppercase tracking-widest">{toastType === "success" ? "Success" : "Error"}</p>
                            <p className="text-sm font-medium">{toastMsg}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-4 hover:scale-110 transition-transform"><X size={18} /></button>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {showDeleteConfirm && announcementToDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="bg-red-600 p-5 flex justify-between items-center text-white border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Trash2 size={20} />
                                <h3 className="font-black uppercase tracking-tight text-sm">Delete Document</h3>
                            </div>
                            <button onClick={() => setShowDeleteConfirm(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="text-center space-y-3">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    <Trash2 size={32} className="text-red-600" />
                                </div>
                                <p className="text-slate-700">
                                    Are you sure you want to delete this document?
                                </p>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="font-bold text-[#0038A8]">{announcementToDelete.title}</p>
                                </div>
                                <p className="text-xs text-red-600 font-medium">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-200 text-slate-600 uppercase text-xs hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all uppercase text-xs flex items-center justify-center gap-2 tracking-widest"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="w-full p-6 md:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto">
                <section className="w-full rounded-3xl overflow-hidden shadow-sm">
                    <Banner videoSrc={bannerVideo} />
                </section>

                <section className="w-full bg-gradient-to-br from-[#0038A8] to-[#002b80] rounded-[2.5rem] py-16 px-8 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            <Building2 size={14} className="text-[#FCD116]" />
                            <span>Republic of the Philippines • PSA</span>
                        </div>
                        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-none mb-4 tracking-tighter uppercase">
                            QUALITY MANAGEMENT SYSTEM <span className="text-[#FCD116]">(QMS) CORNER</span>
                        </h1>
                        <p className="text-white/80 text-lg max-w-3xl mx-auto">
                            Access quality management documents, procedures, and guidelines
                        </p>
                    </div>
                </section>

                {/* QMS DOCUMENTS SECTION */}
                <section className="w-full space-y-8">
                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search Input */}
                            <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={localSearchInput}
                                        onChange={(e) => setLocalSearchInput(e.target.value)}
                                        placeholder="Search QMS documents by title..."
                                        className="w-full pl-11 pr-24 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                                        {localSearchInput && (
                                            <button
                                                type="button"
                                                onClick={handleClearSearch}
                                                className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-medium"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 py-1.5 rounded-lg bg-[#0038A8] text-white text-xs font-medium hover:bg-[#002b80] transition-colors"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Limit Selector */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-500">Show:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value={6}>6 per page</option>
                                    <option value={12}>12 per page</option>
                                    <option value={24}>24 per page</option>
                                    <option value={48}>48 per page</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Results Info */}
                        {searchTerm && (
                            <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                                <Eye size={14} />
                                <span>Showing results for: "<strong className="text-[#0038A8]">{searchTerm}</strong>"</span>
                                <span className="text-xs">({totalCount} total results)</span>
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12 px-4">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0038A8] mx-auto"></div>
                                <p className="mt-4 text-slate-600">Loading QMS documents...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-12 px-4">
                            <div className="bg-red-50 rounded-2xl p-8 shadow-sm border border-red-200">
                                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                                <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Documents</h3>
                                <p className="text-red-500">{error}</p>
                                <button
                                    onClick={() => FetchQmsCorners()}
                                    className="mt-4 px-4 py-2 bg-[#0038A8] text-white rounded-lg hover:bg-[#002b80] transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Data State */}
                    {!loading && !error && qmsCorners.length === 0 && (
                        <div className="text-center py-12 px-4">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
                                <h3 className="text-xl font-bold text-slate-600 mb-2">
                                    {searchTerm ? "No matching documents found" : "No QMS Documents Yet"}
                                </h3>
                                <p className="text-slate-500">
                                    {searchTerm
                                        ? "Try searching with different keywords or clear the search"
                                        : isAdmin ? "Click the + button to add your first QMS document." : "No QMS documents available at this time."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Documents List - Display subtitles as clickable links */}
                    {!loading && !error && qmsCorners.length > 0 && (
                        <>
                            <div className="space-y-4">
                                {qmsCorners.map((item) => (
                                    <div key={item._id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                {/* Left side - Title and subtitle links */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="mb-2">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                                                            QMS DOCUMENT
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-[#0038A8] group-hover:text-[#CE1126] transition-colors text-base md:text-lg leading-tight uppercase mb-4">
                                                        {item.title}
                                                    </h3>

                                                    {/* Display clickable subtitles with links */}
                                                    {item.subtitle && item.subtitle.length > 0 && (
                                                        <div className="space-y-3">
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents:</p>
                                                            <div className="space-y-2">
                                                                {item.subtitle.map((sub, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <ExternalLink size={16} className="text-[#0038A8] flex-shrink-0 mt-0.5" />
                                                                        <div className="flex-1">
                                                                            <a
                                                                                href={sub.googleLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-[#0038A8] hover:text-[#CE1126] font-medium hover:underline transition-colors"
                                                                            >
                                                                                {sub.subtitle}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <p className="text-xs text-slate-400 mt-3">
                                                        Added: {formatDate(item.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Right side - Action Buttons - Only show for admin */}
                                                {isAdmin && (
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            onClick={() => openModalForEdit(item)}
                                                            className="p-2 rounded-xl bg-blue-50 text-[#0038A8] hover:bg-[#0038A8] hover:text-white transition-all border border-blue-100"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteConfirm(item)}
                                                            className="p-2 rounded-xl bg-red-50 text-[#ce1126] hover:bg-[#ce1126] hover:text-white transition-all border border-red-100"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION CONTROLS */}
                            {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        {/* First Page */}
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold"
                                        >
                                            First
                                        </button>

                                        {/* Previous */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                if (pageNum > 0 && pageNum <= totalPages) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === pageNum
                                                                ? "bg-[#0038A8] text-white shadow-lg"
                                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>

                                        {/* Next */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>

                                        {/* Last Page */}
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold"
                                        >
                                            Last
                                        </button>
                                    </div>

                                    {/* Page Info */}
                                    <div className="text-sm text-slate-500">
                                        Page {currentPage} of {totalPages} •
                                        <span className="ml-1 font-medium text-[#0038A8]">{totalCount} total documents</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            {/* FLOATING ACTION BUTTON - Only show for admin */}
            {isAdmin && (
                <button
                    onClick={openModalForAdd}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-[#0038A8] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#CE1126] transition-all duration-300 z-50 group hover:scale-110 border-4 border-white"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* MODAL FOR ADD/EDIT - With subtitle and googleLink fields */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
                        <div className={`p-6 flex justify-between items-center text-white ${editingId ? 'bg-amber-600' : 'bg-[#0038A8]'}`}>
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-[#FCD116]" />
                                <h3 className="font-black uppercase tracking-tight text-sm">{editingId ? "Update QMS Document" : "Add New QMS Document"}</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <form className="p-8 space-y-5 max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Document Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none transition-all font-medium focus:ring-4 focus:ring-blue-100"
                                    placeholder="Enter document title"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Document Subtitles & Links *</label>
                                    <button
                                        type="button"
                                        onClick={addSubtitleField}
                                        className="inline-flex items-center gap-1 text-xs text-[#0038A8] hover:text-[#CE1126] font-medium"
                                    >
                                        <Plus size={14} /> Add Another Document
                                    </button>
                                </div>

                                {subtitleInputs.map((sub, index) => (
                                    <div key={index} className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-500">Document {index + 1}</span>
                                            {subtitleInputs.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSubtitleField(index)}
                                                    className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subtitle/Document Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={sub.subtitle}
                                                    onChange={(e) => handleSubtitleChange(index, 'subtitle', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white outline-none transition-all focus:ring-4 focus:ring-blue-100"
                                                    placeholder="e.g., QMS Manual 2024, ISO Certificate, etc."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Google Drive URL *</label>
                                                <div className="relative">
                                                    <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="url"
                                                        required
                                                        value={sub.googleLink}
                                                        onChange={(e) => handleSubtitleChange(index, 'googleLink', e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white outline-none transition-all focus:ring-4 focus:ring-blue-100"
                                                        placeholder="https://drive.google.com/file/d/.../view"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                                    <AlertCircle size={12} />
                                    Each document needs a subtitle/name and a valid Google Drive URL
                                </p>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 rounded-2xl font-black border border-slate-200 text-slate-500 uppercase text-[11px] hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className={`flex-1 px-4 py-4 rounded-2xl font-black text-white transition-all uppercase text-[11px] flex items-center justify-center gap-2 shadow-lg ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0038A8] hover:bg-[#CE1126]'}`}>
                                    <Send size={14} /> {editingId ? "Save Changes" : "Add Document"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QmsCorner;