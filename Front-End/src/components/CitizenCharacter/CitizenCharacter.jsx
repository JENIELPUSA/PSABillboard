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
    Link2,
    Trash,
    PlusCircle,
    Calendar,
    File,
    EyeOff,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Banner } from '../Banner/Banner';
import { ImageCarousel } from "../ImageCarousel/ImageCarousel";
import { AuthContext } from '../../contexts/AuthContext';
import ISOFooter from '../ISOFooter/Isofooter';
import { QmsCornerContext } from '../../contexts/QmsContext';
import psa_logo from "../../assets/psa-logo.mp4"

// Assets
import asset1 from "../../assets/assets1.jpeg";
import asset2 from "../../assets/assets2.jpeg";
import asset3 from "../../assets/assets3.jpeg";
import asset4 from "../../assets/assets4.jpeg";
import bannerVideo from "../../assets/banner.mp4";

const CitizensCharter = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Get QMS Context
    const {
        qmsCorners,
        loading,
        error,
        AddQmsCorner,
        UpdateQmsCorner,
        DeleteQmsCorner,
        FetchQmsCorners,
        totalCount,
        totalPages: backendTotalPages,
        currentPage: backendCurrentPage,
        limit,
        setCurrentPage,
        setLimit,
        handleSearch,
        searchTerm
    } = useContext(QmsCornerContext);

    // Get auth context for role
    const { role } = useContext(AuthContext);

    // Check if user is admin
    const isAdmin = role === "admin";

    // --- LOCAL PAGINATION STATE (FOR DISPLAY ONLY) ---
    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    // --- STATES PARA SA MODAL AT FORM ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    // Delete confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [handbookToDelete, setHandbookToDelete] = useState(null);

    // Document viewer modal state
    const [showDocumentViewer, setShowDocumentViewer] = useState(false);
    const [viewingDocument, setViewingDocument] = useState(null);

    // ===== NEW: View/Hide Documents per Card =====
    const [hiddenDocuments, setHiddenDocuments] = useState(new Set()); // Stores hidden document links by index

    // Search input local state
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Limit options
    const limitOptions = [6, 12, 24, 48];

    // Initial form data template
    const initialFormData = {
        title: "",
        description: "",
        category: "Citizen Character",
        links: [{ title: "", url: "" }]
    };

    const [formData, setFormData] = useState(initialFormData);

    const carouselImages = [
        { id: 1, src: asset1, alt: "Image 1" },
        { id: 2, src: asset2, alt: "Image 2" },
        { id: 3, src: asset3, alt: "Image 3" },
        { id: 4, src: asset4, alt: "Image 4" },
    ];

    // =========================
    // CLEAN FORM FUNCTION
    // =========================
    const cleanFormData = () => {
        setFormData({
            title: "",
            description: "",
            category: "Citizen Character",
            links: [{ title: "", url: "" }]
        });
        setEditingId(null);
    };

    // =========================
    // FETCH ON COMPONENT MOUNT - EVERY DISPLAY
    // =========================
    useEffect(() => {
        FetchQmsCorners("Citizen Character");
    }, [FetchQmsCorners]);

    // =========================
    // OTHER EFFECTS
    // =========================
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
        setLimit(newLimit);
        setLocalCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setLocalCurrentPage(page);
        setCurrentPage(page);
    };

    // Handle link changes
    const handleLinkChange = (index, field, value) => {
        const updatedLinks = [...formData.links];
        updatedLinks[index][field] = value;
        setFormData({ ...formData, links: updatedLinks });
    };

    // Add new link field
    const addLinkField = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { title: "", url: "" }]
        });
    };

    // Remove link field
    const removeLinkField = (index) => {
        if (formData.links.length > 1) {
            const updatedLinks = formData.links.filter((_, i) => i !== index);
            setFormData({ ...formData, links: updatedLinks });
        }
    };

    // Extract Google Drive file ID from URL
    const extractFileId = (url) => {
        if (!url) return null;

        const patterns = [
            /\/file\/d\/([^/]+)/,
            /id=([^&]+)/,
            /\/d\/([^/]+)/,
            /drive\.google\.com\/open\?id=([^&]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    };

    // =========================
    // PARSE LINKS FUNCTION
    // =========================
    const parseLinks = (subtitle) => {
        if (!subtitle) return [];

        if (Array.isArray(subtitle)) {
            return subtitle.map(item => ({
                title: item.subtitle || "View Document",
                url: item.googleLink || item.url || "",
                fileId: extractFileId(item.googleLink || item.url || "")
            }));
        }

        if (typeof subtitle === 'string') {
            try {
                const parsed = JSON.parse(subtitle);
                if (Array.isArray(parsed)) {
                    return parsed.map(item => ({
                        title: item.subtitle || item.title || "View Document",
                        url: item.googleLink || item.url || "",
                        fileId: extractFileId(item.googleLink || item.url || "")
                    }));
                }
                return [{
                    title: "View Document",
                    url: subtitle,
                    fileId: extractFileId(subtitle)
                }];
            } catch {
                return [{
                    title: "View Document",
                    url: subtitle,
                    fileId: extractFileId(subtitle)
                }];
            }
        }

        return [{ title: "View Document", url: "", fileId: null }];
    };

    // =========================
    // MODAL OPEN/CLOSE FUNCTIONS
    // =========================
    const openModalForAdd = () => {
        cleanFormData();
        setIsModalOpen(true);
    };

    const openModalForEdit = (handbook) => {
        let links = [];

        if (handbook.subtitle && Array.isArray(handbook.subtitle)) {
            links = handbook.subtitle.map(item => ({
                title: item.subtitle || "View Document",
                url: item.googleLink || item.url || "",
                fileId: extractFileId(item.googleLink || item.url || "")
            }));
        }
        else if (typeof handbook.subtitle === 'string') {
            try {
                const parsed = JSON.parse(handbook.subtitle);
                if (Array.isArray(parsed)) {
                    links = parsed.map(item => ({
                        title: item.subtitle || item.title || "View Document",
                        url: item.googleLink || item.url || "",
                        fileId: extractFileId(item.googleLink || item.url || "")
                    }));
                } else {
                    links = [{
                        title: "View Document",
                        url: handbook.subtitle,
                        fileId: extractFileId(handbook.subtitle)
                    }];
                }
            } catch {
                links = [{
                    title: "View Document",
                    url: handbook.subtitle,
                    fileId: extractFileId(handbook.subtitle)
                }];
            }
        }
        else if (handbook.links) {
            if (typeof handbook.links === 'string') {
                try {
                    const parsed = JSON.parse(handbook.links);
                    links = Array.isArray(parsed) ? parsed : [{
                        title: "View Document",
                        url: parsed,
                        fileId: extractFileId(parsed)
                    }];
                } catch {
                    links = [{
                        title: "View Document",
                        url: handbook.links,
                        fileId: extractFileId(handbook.links)
                    }];
                }
            } else if (Array.isArray(handbook.links)) {
                links = handbook.links.map(link => ({
                    ...link,
                    fileId: extractFileId(link.url || "")
                }));
            }
        }

        if (!links || links.length === 0) {
            links = [{ title: "", url: "", fileId: null }];
        }

        setEditingId(handbook._id);
        setFormData({
            title: handbook.title || "",
            description: handbook.description || "",
            category: handbook.category || "Citizen Character",
            links: links.map(({ title, url }) => ({ title, url }))
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        cleanFormData();
        setIsModalOpen(false);
    };

    // Open document viewer
    const openDocumentViewer = (item, linkToView = null) => {
        const links = parseLinks(item.subtitle);
        if (linkToView) {
            setViewingDocument({
                ...item,
                links: [linkToView]
            });
        } else if (links.length > 0 && links[0].fileId) {
            setViewingDocument({
                ...item,
                links: [links[0]]
            });
        }
        setShowDocumentViewer(true);
    };

    // Close document viewer
    const closeDocumentViewer = () => {
        setShowDocumentViewer(false);
        setViewingDocument(null);
    };

    // ===== NEW: View/Hide Document Links Functions =====
    // Generate unique key for each document link
    const getDocumentKey = (cardId, linkIndex) => {
        return `${cardId}-${linkIndex}`;
    };

    // Toggle individual document visibility
    const toggleDocumentVisibility = (cardId, linkIndex) => {
        const key = getDocumentKey(cardId, linkIndex);
        const newHiddenSet = new Set(hiddenDocuments);
        if (newHiddenSet.has(key)) {
            newHiddenSet.delete(key);
        } else {
            newHiddenSet.add(key);
        }
        setHiddenDocuments(newHiddenSet);
    };

    // Toggle all documents in a specific card
    const toggleAllDocumentsInCard = (cardId, linkCount) => {
        const newHiddenSet = new Set(hiddenDocuments);
        let allHidden = true;
        
        // Check if all documents in this card are hidden
        for (let i = 0; i < linkCount; i++) {
            const key = getDocumentKey(cardId, i);
            if (!newHiddenSet.has(key)) {
                allHidden = false;
                break;
            }
        }
        
        if (allHidden) {
            // Show all documents in this card (remove from hidden set)
            for (let i = 0; i < linkCount; i++) {
                const key = getDocumentKey(cardId, i);
                newHiddenSet.delete(key);
            }
        } else {
            // Hide all documents in this card (add to hidden set)
            for (let i = 0; i < linkCount; i++) {
                const key = getDocumentKey(cardId, i);
                newHiddenSet.add(key);
            }
        }
        setHiddenDocuments(newHiddenSet);
    };

    // Check if a document is visible
    const isDocumentVisible = (cardId, linkIndex) => {
        const key = getDocumentKey(cardId, linkIndex);
        return !hiddenDocuments.has(key);
    };

    // Get visible documents for a specific card
    const getVisibleDocumentsForCard = (cardId, links) => {
        return links.filter((_, index) => isDocumentVisible(cardId, index));
    };

    // Get count of visible documents in a card
    const getVisibleCount = (cardId, links) => {
        return links.filter((_, index) => isDocumentVisible(cardId, index)).length;
    };

    // --- HANDLE DELETE FUNCTION ---
    const handleDelete = async (handbookId) => {
        try {
            const result = await DeleteQmsCorner(handbookId);

            if (result.success) {
                setToastMsg("QMS Corner deleted successfully!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                await FetchQmsCorners("Citizen Character");
            } else {
                setToastMsg(result.error || "Failed to delete QMS Corner");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error deleting QMS Corner:", error);
            setToastMsg("Server error. Please try again later.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setShowDeleteConfirm(false);
            setHandbookToDelete(null);
        }
    };

    // --- HANDLE UPDATE FUNCTION ---
    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title.toUpperCase(),
            description: formData.description,
            category: formData.category || "Citizen Character",
            subtitle: formData.links.map(link => ({
                subtitle: link.title || "View Document",
                googleLink: link.url
            }))
        };

        try {
            const result = await UpdateQmsCorner(editingId, payload);

            if (result.success) {
                setToastMsg("QMS Corner updated successfully!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                cleanFormData();
                setIsModalOpen(false);
                await FetchQmsCorners("Citizen Character");
            } else {
                setToastMsg(result.error || "Failed to update QMS Corner");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error updating QMS Corner:", error);
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
            category: formData.category || "Citizen Character",
            subtitle: formData.links.map(link => ({
                subtitle: link.title || "View Document",
                googleLink: link.url
            }))
        };

        try {
            const result = await AddQmsCorner(payload);

            if (result.success) {
                setToastMsg("QMS Corner posted successfully!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                cleanFormData();
                setIsModalOpen(false);
                await FetchQmsCorners("Citizen Character");
            } else {
                setToastMsg(result.error || "Failed to add QMS Corner");
                setToastType("error");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error adding QMS Corner:", error);
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
    const openDeleteConfirm = (handbook) => {
        setHandbookToDelete(handbook);
        setShowDeleteConfirm(true);
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            "Citizen Character": "bg-blue-100 text-blue-800",
            "5S": "bg-green-100 text-green-800",
            "QMS corner": "bg-purple-100 text-purple-800",
            "GAD Corner": "bg-pink-100 text-pink-800"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "2026-07-22";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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
                        <p className="text-slate-600 font-medium">Loading QMS Corners...</p>
                    </div>
                </div>
            )}

            {/* --- DOCUMENT VIEWER MODAL --- */}
            {showDocumentViewer && viewingDocument && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
                        <div className="bg-[#0038A8] p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-[#FCD116]" />
                                <h3 className="font-black uppercase tracking-tight text-sm">{viewingDocument.title}</h3>
                            </div>
                            <button
                                onClick={closeDocumentViewer}
                                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {viewingDocument.links && viewingDocument.links.length > 0 && viewingDocument.links[0].fileId ? (
                                <iframe
                                    src={`https://drive.google.com/file/d/${viewingDocument.links[0].fileId}/preview`}
                                    width="100%"
                                    height="600"
                                    allow="autoplay"
                                    className="rounded-xl border border-slate-200"
                                    title={viewingDocument.title}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-500">No document available to preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {showDeleteConfirm && handbookToDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="bg-red-600 p-5 flex justify-between items-center text-white border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Trash2 size={20} />
                                <h3 className="font-black uppercase tracking-tight text-sm">Delete QMS Corner</h3>
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
                                    Are you sure you want to delete this QMS Corner?
                                </p>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="font-bold text-[#0038A8]">{handbookToDelete.title}</p>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{handbookToDelete.description}</p>
                                    {handbookToDelete.category && (
                                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(handbookToDelete.category)}`}>
                                            {handbookToDelete.category}
                                        </span>
                                    )}
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
                                    onClick={() => handleDelete(handbookToDelete._id)}
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

                <section className="w-full bg-gradient-to-br from-[#0038A8] to-[#002b80] rounded-[2.5rem] py-16 px-8 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            <Building2 size={14} className="text-[#FCD116]" />
                            <span>Republic of the Philippines • PSA</span>
                        </div>
                        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-none mb-4 tracking-tighter uppercase">
                            CITIZEN <span className="text-[#FCD116]">CHARTER</span>
                        </h1>
                        <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
                            Quality Management System • 5S • Citizen Character • GAD Corner
                        </p>
                    </div>
                </section>

                {/* QMS CORNERS GRID SECTION */}
                <section className="w-full space-y-8">
                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={localSearchTerm}
                                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                                        placeholder="Search QMS Corners by title or description..."
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

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-500">Show:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100"
                                >
                                    {limitOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt} per page</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isSearching && searchTerm && (
                            <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                                <Eye size={14} />
                                <span>Showing results for: "<strong className="text-[#0038A8]">{searchTerm}</strong>"</span>
                                <span className="text-xs">({totalCount} total results)</span>
                            </div>
                        )}
                    </div>

                    {!loading && qmsCorners.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
                                <h3 className="text-xl font-bold text-slate-600 mb-2">
                                    {searchTerm ? "No matching QMS Corners found" : "No QMS Corners Yet"}
                                </h3>
                                <p className="text-slate-500">
                                    {searchTerm
                                        ? `Try searching with different keywords or clear the search`
                                        : isAdmin ? "Click the + button to post your first QMS Corner." : "No QMS Corners available at this time."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ============================================ */}
                            {/* GRIDVIEW DISPLAY FOR DOCUMENTS */}
                            {/* ============================================ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {qmsCorners.map((item) => {
                                    const links = parseLinks(item.subtitle);
                                    const hasLinks = links && links.length > 0;
                                    const visibleLinks = hasLinks ? getVisibleDocumentsForCard(item._id, links) : [];
                                    const visibleCount = hasLinks ? getVisibleCount(item._id, links) : 0;
                                    const totalLinks = hasLinks ? links.length : 0;
                                    const allHidden = visibleCount === 0 && totalLinks > 0;

                                    return (
                                        <div key={item._id} className="group relative flex flex-col overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                            {/* Category Badge - Top */}
                                            {item.category && item.category !== "QMS corner" && (
                                                <div className="mb-3">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Title - QMS DOCUMENT style */}
                                            <h3 className="text-[#0038A8] font-black text-xl leading-tight uppercase tracking-tight group-hover:text-[#002b80] transition-colors line-clamp-2 mb-1">
                                                {item.title}
                                            </h3>

                                            {/* Description - DOCUMENTS: style */}
                                            <div className="flex items-start gap-2 mb-3">
                                                <File size={16} className="text-[#0038A8] mt-0.5 flex-shrink-0" />
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2">
                                                    {item.description || "No description available"}
                                                </p>
                                            </div>

                                            {/* DOCUMENTS: Section - with View/Hide Controls */}
                                            {hasLinks && (
                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <FileText size={14} className="text-[#0038A8]" />
                                                            <span>DOCUMENTS:</span>
                                                            <span className="text-[10px] text-slate-400">
                                                                ({visibleCount}/{totalLinks} visible)
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Toggle all documents in this card */}
                                                        {isAdmin && totalLinks > 0 && (
                                                            <button
                                                                onClick={() => toggleAllDocumentsInCard(item._id, totalLinks)}
                                                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0038A8] transition-all"
                                                                title={allHidden ? "Show all documents" : "Hide all documents"}
                                                            >
                                                                {allHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-1.5">
                                                        {links.map((link, index) => {
                                                            const isVisible = isDocumentVisible(item._id, index);
                                                            
                                                            // Skip rendering if document is hidden
                                                            if (!isVisible) return null;
                                                            
                                                            return link.fileId ? (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => openDocumentViewer(item, link)}
                                                                    className="w-full text-left text-sm text-[#0038A8] hover:text-[#CE1126] hover:underline transition-colors font-medium truncate flex items-center justify-between group/link"
                                                                >
                                                                    <span>* {link.title || `Document ${index + 1}`}</span>
                                                                    
                                                                    {/* Individual hide button for each document */}
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleDocumentVisibility(item._id, index);
                                                                            }}
                                                                            className="p-1 rounded hover:bg-slate-100 text-slate-300 hover:text-amber-600 transition-all opacity-0 group-hover/link:opacity-100"
                                                                            title="Hide this document"
                                                                        >
                                                                            <EyeOff size={12} />
                                                                        </button>
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <a
                                                                    key={index}
                                                                    href={link.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block text-sm text-[#0038A8] hover:text-[#CE1126] hover:underline transition-colors font-medium truncate flex items-center justify-between group/link"
                                                                >
                                                                    <span>* {link.title || `Document ${index + 1}`}</span>
                                                                    
                                                                    {/* Individual hide button for each document */}
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                toggleDocumentVisibility(item._id, index);
                                                                            }}
                                                                            className="p-1 rounded hover:bg-slate-100 text-slate-300 hover:text-amber-600 transition-all opacity-0 group-hover/link:opacity-100"
                                                                            title="Hide this document"
                                                                        >
                                                                            <EyeOff size={12} />
                                                                        </button>
                                                                    )}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Show message if all documents are hidden */}
                                                    {visibleCount === 0 && (
                                                        <div className="text-sm text-slate-400 italic flex items-center gap-2 py-1">
                                                            <EyeOff size={14} />
                                                            <span>All documents are hidden</span>
                                                            {isAdmin && (
                                                                <button
                                                                    onClick={() => toggleAllDocumentsInCard(item._id, totalLinks)}
                                                                    className="text-xs text-[#0038A8] hover:underline font-medium"
                                                                >
                                                                    Show all
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Date Added */}
                                            <div className={`${hasLinks ? 'mt-4' : 'mt-auto pt-3'} border-t border-slate-100 flex items-center justify-between`}>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Calendar size={12} />
                                                    <span>Added: {formatDate(item.createdAt)}</span>
                                                </div>

                                                {/* Admin Actions */}
                                                {isAdmin && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => openModalForEdit(item)}
                                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0038A8] transition-all"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteConfirm(item)}
                                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* PAGINATION CONTROLS */}
                            {backendTotalPages > 1 && (
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={localCurrentPage === 1}
                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold"
                                        >
                                            First
                                        </button>

                                        <button
                                            onClick={() => handlePageChange(localCurrentPage - 1)}
                                            disabled={localCurrentPage === 1}
                                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex gap-2">
                                            {[...Array(Math.min(5, backendTotalPages))].map((_, i) => {
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
                                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${localCurrentPage === pageNum ? 'bg-[#0038A8] text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(localCurrentPage + 1)}
                                            disabled={localCurrentPage === backendTotalPages}
                                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>

                                        <button
                                            onClick={() => handlePageChange(backendTotalPages)}
                                            disabled={localCurrentPage === backendTotalPages}
                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-[#0038A8] hover:text-white disabled:opacity-30 transition-all shadow-sm text-xs font-bold"
                                        >
                                            Last
                                        </button>
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        Page {localCurrentPage} of {backendTotalPages} •
                                        <span className="ml-1 font-medium text-[#0038A8]">{totalCount} total QMS Corners</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            {/* FLOATING ACTION BUTTON */}
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
                        <div className={`p-6 flex justify-between items-center text-white ${editingId ? 'bg-amber-600' : 'bg-[#0038A8]'}`}>
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-[#FCD116]" />
                                <h3 className="font-black uppercase tracking-tight text-sm">{editingId ? "Update QMS Corner" : "Post New QMS Corner"}</h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form className="p-8 space-y-5 max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Document Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none transition-all font-medium focus:ring-4 focus:ring-blue-100"
                                    placeholder="Enter document title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Summary / Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none resize-none transition-all font-medium focus:ring-4 focus:ring-blue-100"
                                    placeholder="Enter description"
                                />
                            </div>

                            {/* Multiple Links Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Document Links</label>
                                    <button
                                        type="button"
                                        onClick={addLinkField}
                                        className="flex items-center gap-1 text-[#0038A8] hover:text-[#CE1126] text-xs font-bold transition-colors"
                                    >
                                        <PlusCircle size={16} /> Add Link
                                    </button>
                                </div>

                                {formData.links.map((link, index) => (
                                    <div key={index} className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Link Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={link.title}
                                                    onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none transition-all text-sm font-medium focus:ring-4 focus:ring-blue-100"
                                                    placeholder="e.g., View Document, Download PDF, etc."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Google Drive URL</label>
                                                <input
                                                    type="url"
                                                    required
                                                    value={link.url}
                                                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none transition-all text-sm font-medium focus:ring-4 focus:ring-blue-100"
                                                    placeholder="https://drive.google.com/file/d/..."
                                                />
                                                <p className="text-[10px] text-slate-400 mt-1">Paste the full Google Drive file URL</p>
                                            </div>
                                        </div>
                                        {formData.links.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLinkField(index)}
                                                className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-4 rounded-2xl font-black border border-slate-200 text-slate-500 uppercase text-[11px] hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 px-4 py-4 rounded-2xl font-black text-white transition-all uppercase text-[11px] flex items-center justify-center gap-2 shadow-lg ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0038A8] hover:bg-[#CE1126]'}`}
                                >
                                    <Send size={14} /> {editingId ? "Save Changes" : "Post Document"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ISO Footer */}
            <ISOFooter />
        </div>
    );
};

export default CitizensCharter;