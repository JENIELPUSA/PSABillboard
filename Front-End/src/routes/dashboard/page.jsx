import React, { useState, useEffect, useContext } from "react";
import {
    ShieldCheck,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    Send,
    FileText,
    CheckCircle2,
    Trash2,
    Edit2,
    Search,
    Eye
} from "lucide-react";

// Layout & Components
import { Footer } from "@/layouts/footer";
import { Banner } from "../../components/Banner/Banner";
import { ImageCarousel } from "../../components/ImageCarousel/ImageCarousel";
import { MemoCard } from "../../components/MemoCard/MemoCard";
import { AnnouncementContext } from "../../contexts/AnnouncementContext"
import { AuthContext } from "../../contexts/AuthContext";

// Assets
import bannerVideo from "../../assets/banner.mp4";
import isoLogo from "../../assets/ISO 9001.png";
import pledge2024 from "../../assets/PLEDGE OF COMMITMENT 2024.jpg";
import pledge2025 from "../../assets/PLEDGE OF COMMITMENT 2025.jpg";
import asset1 from "../../assets/assets1.jpeg";
import asset2 from "../../assets/assets2.jpeg";
import asset3 from "../../assets/assets3.jpeg";
import asset4 from "../../assets/assets4.jpeg";


const DashboardPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get all needed functions and data from context
    const {
        AddAnnouncement,
        memorandum,
        DeleteAnnouncement,
        UpdateAnnouncement,
        memototalCount,
        memototalPages: backendTotalPages,
        memocurrentPage: backendCurrentPage,
        memolimit,
        loading,
        setmemoCurrentPage,
        setmemoLimit,
        handleSearch,
        searchTerm,
        FetchAnnouncementData, FetchAnnounceMemorandum
    } = useContext(AnnouncementContext);
    const { role } = useContext(AuthContext)

    // Check if user is Admin
    const isAdmin = role === "admin";

    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    // --- STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [formData, setFormData] = useState({ title: "", description: "", url: "" });
    const [editFormData, setEditFormData] = useState({ id: "", title: "", description: "", url: "" });

    // Search input local state
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Delete confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [memoToDelete, setMemoToDelete] = useState(null);

    // Limit options
    const limitOptions = [6, 12, 24, 48];

    // Filter only memorandum category announcements (already paginated from backend)
    const memoAnnouncements = memorandum;

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

    // --- CAROUSEL AUTO-PLAY ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [carouselImages.length]);

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
        setmemoLimit(newLimit);
        setLocalCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setLocalCurrentPage(page);
        setmemoCurrentPage(page);
    };

    // --- HANDLE DELETE FUNCTION ---
    const handleDelete = async (memoId) => {
        try {
            const result = await DeleteAnnouncement(memoId);

            if (result.success === true) {
                setToastMessage("Memorandum deleted successfully!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);


                // Refresh data from backend to update pagination
                await FetchAnnouncementData();
            } else {
                setToastMessage(result.error || "Failed to delete announcement");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
            setToastMessage("Server error. Please try again later.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setShowDeleteConfirm(false);
            setMemoToDelete(null);
        }
    };

    // --- HANDLE UPDATE FUNCTION ---
    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            title: editFormData.title.toUpperCase(),
            description: editFormData.description,
            category: "memorandum",
            googleLink: editFormData.url
        };

        try {
            const result = await UpdateAnnouncement(editFormData.id, payload);

            if (result.success === true) {
                setToastMessage("Memorandum updated successfully!");
                setToastType("success");
                setEditFormData({ id: "", title: "", description: "", url: "" });
                setIsEditModalOpen(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setToastMessage(result.error || "Failed to update announcement");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error updating announcement:", error);
            setToastMessage("Server error. Please try again later.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // Open edit modal with memo data
    const openEditModal = (memo) => {
        setEditFormData({
            id: memo._id,
            title: memo.title,
            description: memo.description,
            url: memo.googleLink
        });
        setIsEditModalOpen(true);
    };

    // Open delete confirmation modal
    const openDeleteConfirm = (memo) => {
        setMemoToDelete(memo);
        setShowDeleteConfirm(true);
    };

    const handleAddMemo = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title.toUpperCase(),
            description: formData.description,
            category: "memorandum",
            googleLink: formData.url
        };

        try {
            const result = await AddAnnouncement(payload);

            if (result.success === true) {
                FetchAnnounceMemorandum();
                setToastMessage("Memorandum posted successfully!");
                setToastType("success");
                setFormData({ title: "", description: "", url: "" });
                setIsModalOpen(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setToastMessage(result.error || "Failed to add announcement");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error adding announcement:", error);
            setToastMessage("Server error. Please try again later.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="relative flex flex-col gap-y-10 p-0 md:p-4 min-h-screen pb-32 bg-slate-50 dark:bg-slate-950 overflow-x-hidden">

            {/* --- TOAST NOTIFICATION --- */}
            {showToast && (
                <div className="fixed top-5 right-5 z-[200] animate-in slide-in-from-right duration-300">
                    <div className={`${toastType === "success" ? "bg-emerald-500 border-emerald-700" : "bg-red-500 border-red-700"} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-b-4`}>
                        <CheckCircle2 size={24} className="animate-bounce" />
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest">{toastType === "success" ? "Success" : "Error"}</p>
                            <p className="text-sm font-medium">{toastMessage}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-4 hover:scale-110 transition-transform">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* --- LOADING INDICATOR --- */}
            {loading && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#0038A8] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading memorandums...</p>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {showDeleteConfirm && memoToDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="bg-red-600 p-5 flex justify-between items-center text-white border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Trash2 size={20} />
                                <h3 className="font-black uppercase tracking-tight text-sm">Delete Memorandum</h3>
                            </div>
                            <button onClick={() => setShowDeleteConfirm(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="text-center space-y-3">
                                <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    <Trash2 size={32} className="text-red-600 dark:text-red-400" />
                                </div>
                                <p className="text-slate-700 dark:text-slate-300">
                                    Are you sure you want to delete this memorandum?
                                </p>
                                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                                    <p className="font-bold text-[#0038A8] dark:text-blue-400">{memoToDelete.title}</p>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{memoToDelete.description}</p>
                                </div>
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-200 text-slate-600 dark:text-slate-300 uppercase text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(memoToDelete._id)}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all uppercase text-xs flex items-center justify-center gap-2 tracking-widest"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="w-full rounded-3xl overflow-hidden shadow-sm">
                <Banner videoSrc={bannerVideo} />
            </section>

            <section className="w-full bg-white rounded-[2.5rem] shadow-lg p-6 border border-slate-200 flex flex-col">
                <div className="mb-6 px-4">
                    <h3 className="text-2xl font-black text-[#0038A8] uppercase tracking-tight">Visual Guides</h3>
                    <p className="text-[10px] font-black text-[#ce1126] uppercase tracking-[0.2em]">Procedural Walkthrough</p>
                </div>
                <div className="w-full rounded-2xl overflow-hidden border border-slate-100">
                    <ImageCarousel images={carouselImages} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
                </div>
            </section>

            {/* --- MEMO SECTION --- */}
            <section className="space-y-6 md:space-y-8">
                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-3 sm:p-4 mx-3 sm:mx-6 md:mx-10">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={localSearchTerm}
                                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                                    placeholder="Search memorandums..."
                                    className="w-full pl-9 sm:pl-11 pr-28 sm:pr-32 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#0038A8] transition-all text-sm sm:text-base"
                                />
                                <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex gap-1.5 sm:gap-2">
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors whitespace-nowrap"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-[#0038A8] text-white text-xs font-medium hover:bg-[#002b80] transition-colors whitespace-nowrap"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Limit Selector */}
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                            <span className="text-xs font-medium text-slate-500">Show:</span>
                            <select
                                value={memolimit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                                className="flex-1 sm:flex-initial px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
                            >
                                {limitOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt} per page</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search Results Info */}
                    {isSearching && searchTerm && (
                        <div className="mt-3 text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
                            <Eye size={14} className="flex-shrink-0" />
                            <span>Showing results for: "<strong className="text-[#0038A8] break-all">{searchTerm}</strong>"</span>
                            <span className="text-xs whitespace-nowrap">({memototalCount} total results)</span>
                        </div>
                    )}
                </div>

                {!loading && memoAnnouncements.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 px-3 sm:px-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 mx-3 sm:mx-6 md:mx-10">
                            <FileText size={40} className="mx-auto text-slate-400 mb-3 sm:mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                                {searchTerm ? "No matching memorandums found" : "No Memorandums Yet"}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-500 px-2">
                                {searchTerm
                                    ? "Try searching with different keywords"
                                    : isAdmin
                                        ? "Click the + button to post your first memorandum."
                                        : "No memorandums available at this time."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Memo Cards Grid - Responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-3 sm:px-6 md:px-10">
                            {memoAnnouncements.map((memo) => (
                                <MemoCard
                                    key={memo._id}
                                    title={memo.title}
                                    description={memo.description}
                                    url={memo.googleLink}
                                    onDelete={isAdmin ? () => openDeleteConfirm(memo) : undefined}
                                    onEdit={isAdmin ? () => openEditModal(memo) : undefined}
                                />
                            ))}
                        </div>

                        {/* PAGINATION CONTROLS - Responsive */}
                        {backendTotalPages > 1 && (
                            <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                                {/* Pagination Buttons */}
                                <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap px-2">
                                    {/* First Page - Hide on very small screens */}
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={localCurrentPage === 1}
                                        className="hidden sm:flex px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold items-center"
                                    >
                                        First
                                    </button>

                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(localCurrentPage - 1)}
                                        disabled={localCurrentPage === 1}
                                        className="p-2 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                                    </button>

                                    {/* Page Numbers - Responsive display */}
                                    <div className="flex gap-1 sm:gap-2">
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
                                                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-all ${localCurrentPage === pageNum
                                                                ? "bg-[#0038A8] text-white shadow-lg scale-105"
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

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(localCurrentPage + 1)}
                                        disabled={localCurrentPage === backendTotalPages}
                                        className="p-2 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                                    </button>

                                    {/* Last Page - Hide on very small screens */}
                                    <button
                                        onClick={() => handlePageChange(backendTotalPages)}
                                        disabled={localCurrentPage === backendTotalPages}
                                        className="hidden sm:flex px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold items-center"
                                    >
                                        Last
                                    </button>
                                </div>

                                {/* Page Info - Responsive text size */}
                                <div className="text-xs sm:text-sm text-slate-500 text-center px-3">
                                    Page {localCurrentPage} of {backendTotalPages} •
                                    <span className="ml-1 font-medium text-[#0038A8]">{memototalCount} total memorandums</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Pledge Section */}
            <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mx-4 md:mx-10">
                <h2 className="text-center text-3xl md:text-4xl font-black text-[#0038A8] mb-12 flex items-center justify-center gap-4 italic uppercase">
                    <ShieldCheck size={44} className="text-[#FCD116]" /> Pledge of Commitment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[{ year: "2024", img: pledge2024 }, { year: "2025", img: pledge2025 }].map((p) => (
                        <div key={p.year} className="text-center space-y-6">
                            <span className="inline-block px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-black text-slate-600 uppercase">Year {p.year}</span>
                            <div className="overflow-hidden rounded-2xl border-[10px] border-slate-50 dark:border-slate-800 shadow-2xl">
                                <img src={p.img} alt={`Pledge ${p.year}`} className="w-full h-auto object-fill" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Calendar Section */}
            <section className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mx-4 md:mx-10">
                <h2 className="text-2xl font-bold text-[#0038A8] mb-8 flex items-center gap-3">
                    <Calendar className="text-[#FCD116]" size={28} /> ORD Calendar of Activities
                </h2>
                <div className="relative w-full overflow-hidden pb-[75%] md:pb-[50%] h-0 rounded-2xl border-4 border-slate-50 dark:border-slate-800 shadow-inner">
                    <iframe src="https://www.google.com/calendar/embed?src=rsso08@psa.gov.ph" className="absolute top-0 left-0 w-full h-full border-0 bg-white" title="PSA Calendar" />
                </div>
            </section>

            {/* ISO Footer */}
            <div className="flex flex-col items-center gap-8 py-20 border-t-4 border-[#0038A8] bg-slate-50 dark:bg-[#0b1120] mx-0 px-4 md:px-20 text-center">
                <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-[#CE1126]">
                    <img src={isoLogo} alt="ISO 9001 Certified" className="h-28 md:h-36 object-contain" />
                </div>
                <div className="space-y-3">
                    <p className="text-[#0038A8] dark:text-blue-400 text-xl md:text-2xl font-black uppercase tracking-wider">Philippine Statistics Authority</p>
                    <div className="flex justify-center items-center gap-1 my-4">
                        <div className="w-10 h-1.5 bg-[#0038A8]"></div>
                        <div className="w-10 h-1.5 bg-[#CE1126]"></div>
                        <div className="w-10 h-1.5 bg-[#FCD116]"></div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">System Design & Development</p>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">Michael Angelo M. Calleza <span className="text-[#CE1126]">&</span> JENIEL A. PUSA</p>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />

            {/* --- FLOATING ACTION BUTTON - Only show for Admin --- */}
            {isAdmin && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-[#0038A8] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#CE1126] transition-all duration-300 z-50 group hover:scale-110 border-4 border-white dark:border-slate-900"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* --- ADD MEMO MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="bg-[#0038A8] p-5 flex justify-between items-center text-white border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-[#FCD116]" />
                                <h3 className="font-black uppercase tracking-tight text-sm">Post New Memorandum</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
                        </div>

                        <form className="p-6 space-y-5" onSubmit={handleAddMemo}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Memo Category / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. IT UPDATES - FEB 2026"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0038A8] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief summary..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0038A8] outline-none resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Google Drive Link</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0038A8] outline-none"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-200 text-slate-600 dark:text-slate-300 uppercase text-xs">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold bg-[#0038A8] text-white hover:bg-[#CE1126] transition-all uppercase text-xs flex items-center justify-center gap-2 tracking-widest">
                                    <Send size={14} /> Post Memo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDIT MEMO MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="bg-[#0038A8] p-5 flex justify-between items-center text-white border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Edit2 size={20} className="text-[#FCD116]" />
                                <h3 className="font-black uppercase tracking-tight text-sm">Edit Memorandum</h3>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
                        </div>

                        <form className="p-6 space-y-5" onSubmit={handleUpdate}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Memo Category / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    placeholder="e.g. IT UPDATES - FEB 2026"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0038A8] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Description</label>
                                <textarea
                                    rows="3"

                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    placeholder="Brief summary..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0038A8] outline-none resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Google Drive Link</label>
                                <input
                                    type="url"
                                    required
                                    value={editFormData.url}
                                    onChange={(e) => setEditFormData({ ...editFormData, url: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0038A8] outline-none"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold border border-slate-200 text-slate-600 dark:text-slate-300 uppercase text-xs">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold bg-[#0038A8] text-white hover:bg-[#CE1126] transition-all uppercase text-xs flex items-center justify-center gap-2 tracking-widest">
                                    <Edit2 size={14} /> Update Memo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;