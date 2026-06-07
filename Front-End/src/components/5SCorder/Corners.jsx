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
    Eye
} from 'lucide-react';
import { Banner } from '../Banner/Banner';
import { ImageCarousel } from "../ImageCarousel/ImageCarousel";
import { AnnouncementContext } from '../../contexts/AnnouncementContext';
import { AuthContext } from '../../contexts/AuthContext';

// Assets
import asset1 from "../../assets/assets1.jpeg";
import asset2 from "../../assets/assets2.jpeg";
import asset3 from "../../assets/assets3.jpeg";
import asset4 from "../../assets/assets4.jpeg";
import bannerVideo from "../../assets/banner.mp4";

const SCorner = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get auth context for role
    const { role } = useContext(AuthContext);

    // Check if user is admin
    const isAdmin = role === "admin";

    // Get all needed functions and data from context
    const { 
        FetchAnnounceScorner,
        AddAnnouncement,
        scorner,
        DeleteAnnouncement,
        UpdateAnnouncement,
        scornerTotalCount,
        scornerTotalPages: backendTotalPages,
        scornerCurrentPage: backendCurrentPage,
        scornerlimit,
        loading,
        setscornerCurrentPage,
        setscornerLimit,
        handleSearch,
        searchTerm
    } = useContext(AnnouncementContext);

    // --- LOCAL PAGINATION STATE ---
    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    // --- STATES PARA SA MODAL AT FORM ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    // Search input local state
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Delete confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);

    // Limit options
    const limitOptions = [6, 12, 24, 48];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: ""
    });

    // Filter only 5s-corner category announcements
    const handbookAnnouncements = scorner;

    const carouselImages = [
        { id: 1, src: asset1, alt: "Image 1" },
        { id: 2, src: asset2, alt: "Image 2" },
        { id: 3, src: asset3, alt: "Image 3" },
        { id: 4, src: asset4, alt: "Image 4" },
    ];

    // Sync local page with backend page
    useEffect(() => {
        setLocalCurrentPage(backendCurrentPage);
    }, [backendCurrentPage]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselImages.length]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(localSearchTerm);
        setIsSearching(true);
    };

    // Clear search
    const clearSearch = () => {
        setLocalSearchTerm("");
        handleSearch("");
        setIsSearching(false);
    };

    // Handle limit change
    const handleLimitChange = (newLimit) => {
        setscornerLimit(newLimit);
        setLocalCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setLocalCurrentPage(page);
        setscornerCurrentPage(page);
    };

    const openModalForAdd = () => {
        setEditingId(null);
        setFormData({ title: "", description: "", url: "" });
        setIsModalOpen(true);
    };

    const openModalForEdit = (announcement) => {
        setEditingId(announcement._id);
        setFormData({
            title: announcement.title,
            description: announcement.description,
            url: announcement.googleLink
        });
        setIsModalOpen(true);
    };

    // --- HANDLE DELETE FUNCTION ---
    const handleDelete = async (announcementId) => {
        try {
            const result = await DeleteAnnouncement(announcementId);

            if (result.success === true) {
                setToastMsg("Announcement deleted successfully!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);

                // Refresh data from backend to update pagination
                await FetchAnnounceScorner();
            } else {
                setToastMsg(result.error || "Failed to delete announcement");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
            setToastMsg("Server error. Please try again later.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setShowDeleteConfirm(false);
            setAnnouncementToDelete(null);
        }
    };

    // --- HANDLE UPDATE FUNCTION ---
    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title.toUpperCase(),
            description: formData.description,
            category: "5s-corner",
            googleLink: formData.url
        };

        try {
            const result = await UpdateAnnouncement(editingId, payload);

            if (result.success === true) {
                setToastMsg("Announcement updated successfully!");
                setToastType("success");
                setFormData({ title: "", description: "", url: "" });
                setIsModalOpen(false);
                setEditingId(null);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setToastMsg(result.error || "Failed to update announcement");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error updating announcement:", error);
            setToastMsg("Server error. Please try again later.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // --- HANDLE ADD FUNCTION ---
    const handleAdd = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title.toUpperCase(),
            description: formData.description,
            category: "5s-corner",
            googleLink: formData.url
        };

        try {
            const result = await AddAnnouncement(payload);

            if (result.success === true) {
                await FetchAnnounceScorner();
                setToastMsg("Announcement posted successfully!");
                setToastType("success");
                setFormData({ title: "", description: "", url: "" });
                setIsModalOpen(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setToastMsg(result.error || "Failed to add announcement");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error adding announcement:", error);
            setToastMsg("Server error. Please try again later.");
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
    const openDeleteConfirm = (announcement) => {
        setAnnouncementToDelete(announcement);
        setShowDeleteConfirm(true);
    };

    if (isMobile) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center p-10 text-center font-sans">
                <div className="flex flex-col items-center">
                    <MonitorOff size={60} className="mb-4 text-[#0038A8]" />
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

            {/* --- LOADING INDICATOR --- */}
            {loading && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#0038A8] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 font-medium">Loading announcements...</p>
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
                                <h3 className="font-black uppercase tracking-tight text-sm">Delete Announcement</h3>
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
                                    Are you sure you want to delete this announcement?
                                </p>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="font-bold text-[#0038A8]">{announcementToDelete.title}</p>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{announcementToDelete.description}</p>
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
                                    onClick={() => handleDelete(announcementToDelete._id)}
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
                            <span>Republic of the Philippines • PSO</span>
                        </div>
                        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-none mb-4 tracking-tighter uppercase">
                            5'S <span className="text-[#FCD116]">CORNER</span>
                        </h1>
                    </div>
                </section>

                {/* ANNOUNCEMENTS CARD SECTION - ONE COLUMN LIST */}
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
                                        value={localSearchTerm}
                                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                                        placeholder="Search announcements by title or description..."
                                        className="w-full pl-11 pr-24 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
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
                                    value={scornerlimit}
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100"
                                >
                                    {limitOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt} per page</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search Results Info */}
                        {isSearching && searchTerm && (
                            <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                                <Eye size={14} />
                                <span>Showing results for: "<strong className="text-[#0038A8]">{searchTerm}</strong>"</span>
                                <span className="text-xs">({scornerTotalCount} total results)</span>
                            </div>
                        )}
                    </div>

                    {!loading && handbookAnnouncements.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
                                <h3 className="text-xl font-bold text-slate-600 mb-2">
                                    {searchTerm ? "No matching announcements found" : "No Announcements Yet"}
                                </h3>
                                <p className="text-slate-500">
                                    {searchTerm
                                        ? `Try searching with different keywords or ${!searchTerm ? "click the + button to post your first announcement." : "clear the search"}`
                                        : isAdmin ? "Click the + button to post your first announcement." : "No announcements available at this time."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {handbookAnnouncements.map((item) => (
                                    <div key={item._id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                        {/* Card Content */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                                {/* Left side - Category and Title */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="mb-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.category === "memorandum"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                            }`}>
                                                            {item.category === "5s-corner" ? "5'S CORNER" : item.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-[#0038A8] group-hover:text-[#CE1126] transition-colors text-base md:text-lg leading-tight uppercase line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                </div>

                                                {/* Right side - Action Buttons - Only show for admin */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <a
                                                        href={item.googleLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 bg-[#0038A8] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#002b80] transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        Open <ExternalLink size={14} />
                                                    </a>
                                                    {isAdmin && (
                                                        <>
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
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINATION CONTROLS - SAME LOGIC AS DashboardPage */}
                            {backendTotalPages > 1 && (
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        {/* First Page */}
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={localCurrentPage === 1}
                                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold"
                                        >
                                            First
                                        </button>

                                        {/* Previous */}
                                        <button
                                            onClick={() => handlePageChange(localCurrentPage - 1)}
                                            disabled={localCurrentPage === 1}
                                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex gap-2">
                                            {Array.from({ length: Math.min(5, backendTotalPages) }, (_, i) => {
                                                let pageNum;
                                                if (backendTotalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (localCurrentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (localCurrentPage >= backendTotalPages - 2) {
                                                    pageNum = backendTotalPages - 4 + i;
                                                } else {
                                                    pageNum = localCurrentPage - 2 + i;
                                                }

                                                if (pageNum > 0 && pageNum <= backendTotalPages) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                                                                localCurrentPage === pageNum
                                                                    ? "bg-[#0038A8] text-white shadow-lg"
                                                                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                                            onClick={() => handlePageChange(localCurrentPage + 1)}
                                            disabled={localCurrentPage === backendTotalPages}
                                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>

                                        {/* Last Page */}
                                        <button
                                            onClick={() => handlePageChange(backendTotalPages)}
                                            disabled={localCurrentPage === backendTotalPages}
                                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold"
                                        >
                                            Last
                                        </button>
                                    </div>

                                    {/* Page Info */}
                                    <div className="text-sm text-slate-500">
                                        Page {localCurrentPage} of {backendTotalPages} • 
                                        <span className="ml-1 font-medium text-[#0038A8]">{scornerTotalCount} total announcements</span>
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

            {/* UNIFIED MODAL FOR ADD/EDIT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className={`p-6 flex justify-between items-center text-white ${editingId ? 'bg-amber-600' : 'bg-[#0038A8]'}`}>
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-[#FCD116]" />
                                <h3 className="font-black uppercase tracking-tight text-sm">{editingId ? "Update Announcement" : "Post New Announcement"}</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Document Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none transition-all font-medium focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Summary / Description</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none resize-none transition-all font-medium focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Link</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none transition-all font-medium focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 rounded-2xl font-black border border-slate-200 text-slate-500 uppercase text-[11px]">Cancel</button>
                                <button type="submit" className={`flex-1 px-4 py-4 rounded-2xl font-black text-white transition-all uppercase text-[11px] flex items-center justify-center gap-2 shadow-lg ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0038A8] hover:bg-[#CE1126]'}`}>
                                    <Send size={14} /> {editingId ? "Save Changes" : "Post Document"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SCorner;