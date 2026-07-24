// CitizensCharter.jsx - Floating Avatar sa Right Side na may Timer Loop (Original Style)
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
    Calendar,
    File,
    EyeOff,
    PlusCircle,
    Grid,
    List,
    Menu,
    Clock
} from 'lucide-react';
import PDFIcon from '../../assets/PDFIcon.webp';
import { AuthContext } from '../../contexts/AuthContext';
import ISOFooter from '../ISOFooter/Isofooter';
import { QmsCornerContext } from '../../contexts/QmsContext';
import PDFViewCard from './PDFViewCard';


// Assets
import asset1 from "../../assets/assets1.jpeg";
import asset2 from "../../assets/assets2.jpeg";
import asset3 from "../../assets/assets3.jpeg";
import asset4 from "../../assets/assets4.jpeg";

// ============================================================
// FLOATING AVATAR SA RIGHT SIDE - ORIGINAL STYLE WITH TIMER LOOP
// ============================================================
const FloatingAvatar = ({
    userName = "Citizen's Charter Guide",
    userRole = "Public Assistance & Information",
    userStatus = "online",
    introTexts = [
        "Hi! Welcome to Our Citizen's Charter! 👋",
        "Explore our services and documents! 📋",
        "Need assistance? We're here to help! 💙",
        "Check out our QMS Corners! 📚",
        "Have a great day! 🌟",
        "Your feedback matters to us! 💬",
        "Transparency and accountability! 🏛️",
        "We serve with excellence! ⭐"
    ]
}) => {
    const [isPeekingOut, setIsPeekingOut] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [characterColor, setCharacterColor] = useState('bg-amber-400');
    const [expression, setExpression] = useState('happy');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [countdown, setCountdown] = useState(8);

    const playPopSound = (freq = 520, duration = 0.15) => {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    };

    const speakText = (text) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.lang = 'tl-PH';
        window.speechSynthesis.speak(utterance);
    };

    const triggerPeekAndWave = () => {
        // Random expression
        const expressions = ['happy', 'excited', 'cool', 'thinking'];
        setExpression(expressions[Math.floor(Math.random() * expressions.length)]);

        // Random text
        const randomIndex = Math.floor(Math.random() * introTexts.length);
        setCurrentTextIndex(randomIndex);

        setIsPeekingOut(true);
        setIsWaving(true);
        playPopSound(580 + Math.random() * 100, 0.2);
        speakText(introTexts[randomIndex]);

        setTimeout(() => {
            setIsWaving(false);
        }, 1800);

        // Hide after 4 seconds
        setTimeout(() => {
            setIsPeekingOut(false);
        }, 4000);
    };

    // Timer Loop - every 8 seconds
    useEffect(() => {
        const initialTimer = setTimeout(() => {
            triggerPeekAndWave();
            setCountdown(8);
        }, 1000);

        const intervalId = setInterval(() => {
            triggerPeekAndWave();
            setCountdown(8);
        }, 8000);

        const countdownIntervalId = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) return 8;
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalId);
            clearInterval(countdownIntervalId);
        };
    }, []);

    const togglePeek = () => {
        if (isPeekingOut) {
            setIsPeekingOut(false);
            setIsWaving(false);
            playPopSound(350, 0.12);
        } else {
            triggerPeekAndWave();
        }
    };

    const statusColors = {
        online: 'bg-emerald-500 border-slate-900',
        busy: 'bg-rose-500 border-slate-900',
        away: 'bg-amber-400 border-slate-900',
    };

    return (
        <div className="fixed right-6 bottom-8 z-[100] flex flex-col items-end">
            {/* ORIGINAL AVATAR STYLE - With Barrier Wall / Desk */}
            <div className="relative flex flex-col items-center">
                {/* Dynamic Speech Bubble */}
                <div
                    className={`absolute -top-24 right-1/2 translate-x-1/2 bg-white text-slate-900 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] transition-all duration-500 z-40 w-72 text-center leading-snug ${isPeekingOut ? 'opacity-100 scale-100 -translate-y-2' : 'opacity-0 scale-50 translate-y-6 pointer-events-none'
                        }`}
                >
                    <div className="text-[10px] uppercase font-black tracking-widest text-amber-600 mb-0.5 flex items-center justify-center gap-2">
                        <span>🏛️ CITIZEN'S CHARTER</span>
                        <span className="text-[8px] text-slate-400 animate-pulse">● LIVE</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span>{introTexts[currentTextIndex]}</span>
                    </div>

                    {/* Bubble Tail */}
                    <div className="absolute -bottom-3 right-1/2 translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-slate-900" />
                </div>

                {/* Peeking Avatar Container with Barrier Wall */}
                <div
                    className="relative w-80 h-48 flex items-end justify-center cursor-pointer group"
                    onClick={triggerPeekAndWave}
                >
                    {/* Peeking Character (Nagtatago sa likod ng pader / sumisilip) */}
                    <div
                        className={`absolute bottom-10 transition-all duration-500 ease-out z-10 flex flex-col items-center ${isPeekingOut
                                ? '-translate-y-12 rotate-0'
                                : 'translate-y-10 rotate-12 group-hover:translate-y-4 group-hover:rotate-6'
                            }`}
                    >
                        {/* 3D Circular Avatar Head */}
                        <div className={`w-32 h-32 ${characterColor} rounded-full border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative flex flex-col items-center justify-center overflow-visible`}>

                            {/* Eyes */}
                            <div className="flex gap-2.5 mb-1 z-10">
                                <div className="w-7 h-9 bg-white rounded-full border-3 border-slate-900 relative flex items-center justify-center overflow-hidden">
                                    {!isPeekingOut ? (
                                        <div className="w-3 h-3 bg-slate-900 rounded-full absolute top-1 left-2" />
                                    ) : expression === 'cool' ? (
                                        <div className="w-full h-4 bg-slate-900 absolute top-2" />
                                    ) : expression === 'thinking' ? (
                                        <div className="w-3 h-3 bg-slate-900 rounded-full absolute top-1 left-2" />
                                    ) : (
                                        <>
                                            <div className={`w-3 h-3 bg-slate-900 rounded-full absolute ${isWaving ? 'top-1 left-2 scale-110' : 'top-2 left-1'}`} />
                                            <div className="w-1 h-1 bg-white rounded-full absolute top-2 left-1.5" />
                                        </>
                                    )}
                                </div>

                                <div className="w-7 h-9 bg-white rounded-full border-3 border-slate-900 relative flex items-center justify-center overflow-hidden">
                                    {!isPeekingOut ? (
                                        <div className="w-3 h-3 bg-slate-900 rounded-full absolute top-1 left-1" />
                                    ) : expression === 'cool' ? (
                                        <div className="w-full h-4 bg-slate-900 absolute top-2" />
                                    ) : expression === 'thinking' ? (
                                        <div className="w-3 h-3 bg-slate-900 rounded-full absolute top-1 left-1" />
                                    ) : (
                                        <>
                                            <div className={`w-3 h-3 bg-slate-900 rounded-full absolute ${isWaving ? 'top-1 left-2 scale-110' : 'top-2 left-1'}`} />
                                            <div className="w-1 h-1 bg-white rounded-full absolute top-2 left-1.5" />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Mouth */}
                            <div
                                className={`transition-all duration-300 border-slate-900 ${!isPeekingOut
                                        ? 'w-4 h-2 border-b-3 rounded-b-full bg-slate-900'
                                        : isWaving
                                            ? 'w-6 h-4 bg-rose-500 border-3 rounded-b-xl relative overflow-hidden'
                                            : expression === 'excited'
                                                ? 'w-6 h-4 bg-rose-500 border-3 rounded-b-full'
                                                : 'w-5 h-2.5 border-b-3 rounded-b-full'
                                    }`}
                            />

                            {/* Waving Hand Pop-out */}
                            <div
                                className={`absolute -left-3 top-8 w-9 h-9 ${characterColor} border-3 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] origin-bottom-right transition-all z-20 ${isWaving ? 'animate-wave-right' : 'group-hover:-rotate-12'
                                    }`}
                            >
                                <div className={`w-2.5 h-2.5 ${characterColor} border-2 border-slate-900 rounded-full absolute -top-1 right-0.5`} />
                            </div>

                            {/* Status Dot Badge */}
                            <div
                                className={`absolute bottom-0 left-1 w-6 h-6 ${statusColors[userStatus]} border-3 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-30`}
                                title={`Status: ${userStatus}`}
                            />
                        </div>
                    </div>

                    {/* Peeking Barrier Wall / Desk (Pader kung saan sumisilip ang avatar) */}
                    <div className="w-full bg-amber-300 border-4 border-slate-900 rounded-2xl py-3 px-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] z-20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🏛️</span>
                            <div>
                                <h3 className="font-black text-sm text-slate-900 leading-none">{userName}</h3>
                                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mt-0.5">{userRole}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Timer Badge */}
                            <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg border border-slate-200">
                                <Clock size={12} className="text-[#0038A8]" />
                                <span className="text-[10px] font-bold text-[#0038A8]">{countdown}s</span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePeek();
                                }}
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all"
                            >
                                {isPeekingOut ? '🙈 Magtago' : '👀 Sumilip!'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Wave Keyframe Animations */}
            <style>{`
                @keyframes wave {
                    0% { transform: rotate(0deg); }
                    15% { transform: rotate(28deg); }
                    30% { transform: rotate(-25deg); }
                    45% { transform: rotate(22deg); }
                    60% { transform: rotate(-18deg); }
                    75% { transform: rotate(10deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes wave-right {
                    0% { transform: rotate(0deg); }
                    15% { transform: rotate(28deg); }
                    30% { transform: rotate(-25deg); }
                    45% { transform: rotate(22deg); }
                    60% { transform: rotate(-18deg); }
                    75% { transform: rotate(10deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-wave-right {
                    animation: wave-right 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
                }
            `}</style>
        </div>
    );
};

const CitizensCharter = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [viewMode, setViewMode] = useState('list');

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
    const isAdmin = role === "admin";

    // --- LOCAL PAGINATION STATE ---
    const [localCurrentPage, setLocalCurrentPage] = useState(1);

    // --- STATES PARA SA FLIP CARD FORM ---
    const [flippedCardId, setFlippedCardId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    // Delete confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [handbookToDelete, setHandbookToDelete] = useState(null);

    // Flip Card for Document Viewing
    const [flippedDocumentCard, setFlippedDocumentCard] = useState(null);
    const [viewingDocument, setViewingDocument] = useState(null);

    // View/Hide Documents per Card
    const [hiddenDocuments, setHiddenDocuments] = useState(new Set());

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
        setFlippedCardId(null);
    };

    // =========================
    // FETCH ON COMPONENT MOUNT
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
    // FLIP CARD FUNCTIONS
    // =========================
    const openCardForAdd = () => {
        cleanFormData();
        setFlippedCardId('new');
    };

    const openCardForEdit = (handbook) => {
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
        setFlippedCardId(handbook._id);
    };

    const closeFlippedCard = () => {
        cleanFormData();
    };

    // ===== Flip Document Card Functions (uses PDFViewCard) =====
    const flipDocumentCard = (item, linkToView = null) => {
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
        setFlippedDocumentCard(item._id);
    };

    const closeFlippedDocumentCard = () => {
        setFlippedDocumentCard(null);
        setViewingDocument(null);
    };

    // ===== View/Hide Document Links Functions =====
    const getDocumentKey = (cardId, linkIndex) => {
        return `${cardId}-${linkIndex}`;
    };

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

    const toggleAllDocumentsInCard = (cardId, linkCount) => {
        const newHiddenSet = new Set(hiddenDocuments);
        let allHidden = true;

        for (let i = 0; i < linkCount; i++) {
            const key = getDocumentKey(cardId, i);
            if (!newHiddenSet.has(key)) {
                allHidden = false;
                break;
            }
        }

        if (allHidden) {
            for (let i = 0; i < linkCount; i++) {
                const key = getDocumentKey(cardId, i);
                newHiddenSet.delete(key);
            }
        } else {
            for (let i = 0; i < linkCount; i++) {
                const key = getDocumentKey(cardId, i);
                newHiddenSet.add(key);
            }
        }
        setHiddenDocuments(newHiddenSet);
    };

    const isDocumentVisible = (cardId, linkIndex) => {
        const key = getDocumentKey(cardId, linkIndex);
        return !hiddenDocuments.has(key);
    };

    const getVisibleDocumentsForCard = (cardId, links) => {
        return links.filter((_, index) => isDocumentVisible(cardId, index));
    };

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

    // Render the flip card form
    const renderFlipCardForm = () => {
        const isNewCard = flippedCardId === 'new';
        const isEditing = !!editingId && !isNewCard;
        const isFlipped = flippedCardId !== null;

        if (!isFlipped) return null;

        return (
            <div className="col-span-1 md:col-span-2 xl:col-span-3">
                <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-[#0038A8] overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[95vh] overflow-y-auto">
                    {/* Header */}
                    <div
                        className={`sticky top-0 z-10 relative p-5 sm:p-6 flex justify-between items-center text-white ${isEditing || isNewCard && editingId
                                ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                                : 'bg-gradient-to-r from-[#0038A8] to-[#002b80]'
                            }`}
                    >
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
                                    {isEditing ? 'Edit the details below' : 'Fill in the details to create a new entry'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={closeFlippedCard}
                            className="relative z-10 hover:bg-white/20 p-2 rounded-full transition-all hover:scale-110"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form className="p-5 sm:p-6 bg-white" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Title */}
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
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 outline-none transition-all font-medium text-sm focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30"
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
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 outline-none resize-y transition-all font-medium text-sm focus:ring-4 focus:ring-blue-100 focus:border-[#0038A8] hover:border-[#0038A8]/30 min-h-[120px]"
                                    placeholder="Enter description..."
                                />
                            </div>

                            {/* Links */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#0038A8] rounded-full"></span>
                                        Document Links
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addLinkField}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#0038A8] text-white rounded-lg text-xs font-bold hover:bg-[#CE1126] transition-all shadow-md active:scale-95"
                                    >
                                        <PlusCircle size={15} />
                                        Add Link
                                    </button>
                                </div>

                                {formData.links.map((link, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 items-start bg-slate-50/80 p-5 rounded-2xl border-2 border-slate-200 hover:border-[#0038A8]/30 transition-all"
                                    >
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                    <span className="text-[#0038A8]">#{index + 1}</span>
                                                    Link Title
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={link.title}
                                                    onChange={(e) =>
                                                        handleLinkChange(index, 'title', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white outline-none transition-all text-sm font-medium focus:border-[#0038A8]"
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
                                                        handleLinkChange(index, 'url', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white outline-none transition-all text-sm font-medium focus:border-[#0038A8]"
                                                    placeholder="https://drive.google.com/file/d/..."
                                                />
                                            </div>
                                        </div>

                                        {formData.links.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLinkField(index)}
                                                className="mt-1 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 hover:scale-105"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white pt-6 mt-6 flex gap-3 border-t-2 border-slate-100 pb-1">
                            <button
                                type="button"
                                onClick={closeFlippedCard}
                                className="flex-1 px-4 py-3.5 rounded-xl font-bold border-2 border-slate-200 text-slate-600 uppercase text-xs hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 px-4 py-3.5 rounded-xl font-bold text-white transition-all uppercase text-xs flex items-center justify-center gap-2 shadow-lg ${isEditing || isNewCard && editingId
                                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700'
                                        : 'bg-gradient-to-r from-[#0038A8] to-[#002b80] hover:from-[#CE1126]'
                                    }`}
                            >
                                <Send size={16} />
                                {isEditing || isNewCard && editingId ? 'Save Changes' : 'Post Document'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
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
            {/* --- FLOATING AVATAR - Right Side with Timer Loop (Original Style) --- */}
            <FloatingAvatar
                userName="Citizen's Charter Guide"
                userRole="Public Assistance & Information"
                userStatus="online"
                introTexts={[
                    "Hi! Welcome to Our Citizen's Charter! 👋",
                    "Explore our services and documents! 📋",
                    "Need assistance? We're here to help! 💙",
                    "Check out our QMS Corners! 📚",
                    "Have a great day! 🌟",
                    "Your feedback matters to us! 💬",
                    "Transparency and accountability! 🏛️",
                    "We serve with excellence! ⭐"
                ]}
            />

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
                        <p className="text-slate-600 font-medium">Loading Citizen's Charter...</p>
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
                                <p className="text-slate-700">Are you sure you want to delete this QMS Corner?</p>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="font-bold text-[#0038A8]">{handbookToDelete.title}</p>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{handbookToDelete.description}</p>
                                    {handbookToDelete.category && (
                                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(handbookToDelete.category)}`}>
                                            {handbookToDelete.category}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-red-600 font-medium">This action cannot be undone.</p>
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
                            CITIZEN'S<span className="text-[#FCD116]"> CHARTER</span>
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
                            {viewMode === 'grid' ? (
                                // GRID VIEW
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {/* Render Flip Card Form if any card is flipped */}
                                    {renderFlipCardForm()}

                                    {/* Render Flipped Document Card using PDFViewCard component */}
                                    {flippedDocumentCard && viewingDocument && (
                                        <PDFViewCard
                                            document={viewingDocument}
                                            onClose={closeFlippedDocumentCard}
                                        />
                                    )}

                                    {/* Render QMS Cards */}
                                    {qmsCorners.map((item) => {
                                        if (flippedCardId === item._id || flippedDocumentCard === item._id) return null;

                                        const links = parseLinks(item.subtitle);
                                        const hasLinks = links && links.length > 0;
                                        const visibleLinks = hasLinks ? getVisibleDocumentsForCard(item._id, links) : [];
                                        const visibleCount = hasLinks ? getVisibleCount(item._id, links) : 0;
                                        const totalLinks = hasLinks ? links.length : 0;
                                        const allHidden = visibleCount === 0 && totalLinks > 0;

                                        return (
                                            <div key={item._id} className="group relative flex flex-col overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                                {item.category && item.category !== "QMS corner" && (
                                                    <div className="mb-3">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                )}

                                                <h3 className="text-[#0038A8] font-black text-xl leading-tight uppercase tracking-tight group-hover:text-[#002b80] transition-colors line-clamp-2 mb-1">
                                                    {item.title}
                                                </h3>

                                                <div className="flex items-start gap-2 mb-3">
                                                    <File size={16} className="text-[#0038A8] mt-0.5 flex-shrink-0" />
                                                    <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2">
                                                        {item.description || "No description available"}
                                                    </p>
                                                </div>

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

                                                        {/* Document Grid with PDFIcon - 3 columns */}
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {links.map((link, index) => {
                                                                const isVisible = isDocumentVisible(item._id, index);

                                                                if (!isVisible) return null;

                                                                const docTitle = link.title || `Document ${index + 1}`;

                                                                return link.fileId ? (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => flipDocumentCard(item, link)}
                                                                        className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-center group/link border border-blue-200 hover:border-[#0038A8] flex flex-col items-center gap-1.5"
                                                                    >
                                                                        <img
                                                                            src={PDFIcon}
                                                                            alt="PDF"
                                                                            className="w-8 h-8 object-contain"
                                                                        />
                                                                        <span className="text-[10px] font-medium text-slate-700 line-clamp-2 leading-tight">
                                                                            {docTitle}
                                                                        </span>

                                                                        {isAdmin && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    toggleDocumentVisibility(item._id, index);
                                                                                }}
                                                                                className="mt-1 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-amber-600 transition-all opacity-0 group-hover/link:opacity-100"
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
                                                                        className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-center group/link border border-blue-200 hover:border-[#0038A8] flex flex-col items-center gap-1.5"
                                                                    >
                                                                        <ExternalLink size={20} className="text-[#0038A8] group-hover/link:text-[#CE1126]" />
                                                                        <span className="text-[10px] font-medium text-slate-700 line-clamp-2 leading-tight">
                                                                            {docTitle}
                                                                        </span>

                                                                        {isAdmin && (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    toggleDocumentVisibility(item._id, index);
                                                                                }}
                                                                                className="mt-1 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-amber-600 transition-all opacity-0 group-hover/link:opacity-100"
                                                                                title="Hide this document"
                                                                            >
                                                                                <EyeOff size={12} />
                                                                            </button>
                                                                        )}
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>

                                                        {visibleCount === 0 && (
                                                            <div className="text-sm text-slate-400 italic flex items-center gap-2 py-2 justify-center">
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

                                                <div className={`${hasLinks ? 'mt-4' : 'mt-auto pt-3'} border-t border-slate-100 flex items-center justify-between`}>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Calendar size={12} />
                                                        <span>Added: {formatDate(item.createdAt)}</span>
                                                    </div>

                                                    {isAdmin && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => openCardForEdit(item)}
                                                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0038A8] transition-all"
                                                                title="Edit this QMS Corner"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteConfirm(item)}
                                                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-all"
                                                                title="Delete this QMS Corner"
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
                            ) : (
                                // LIST VIEW
                                <div className="space-y-4">
                                    {/* Render Flip Card Form if any card is flipped */}
                                    {renderFlipCardForm()}

                                    {/* Render Flipped Document Card using PDFViewCard component */}
                                    {flippedDocumentCard && viewingDocument && (
                                        <PDFViewCard
                                            document={viewingDocument}
                                            onClose={closeFlippedDocumentCard}
                                        />
                                    )}

                                    {/* Render QMS Cards in List View */}
                                    {qmsCorners.map((item) => {
                                        if (flippedCardId === item._id || flippedDocumentCard === item._id) return null;

                                        const links = parseLinks(item.subtitle);
                                        const hasLinks = links && links.length > 0;
                                        const visibleLinks = hasLinks ? getVisibleDocumentsForCard(item._id, links) : [];
                                        const visibleCount = hasLinks ? getVisibleCount(item._id, links) : 0;
                                        const totalLinks = hasLinks ? links.length : 0;
                                        const allHidden = visibleCount === 0 && totalLinks > 0;

                                        return (
                                            <div key={item._id} className="group relative flex flex-row overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                                                {/* LEFT SIDE - Category and Documents */}
                                                <div className="flex-1 min-w-0 pr-6 border-r border-slate-200">
                                                    {hasLinks && (
                                                        <div>
                                                            {/* Header section with status & admin toggle */}
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
                                                                <FileText size={14} className="text-[#0038A8]" />
                                                                <span>DOCUMENTS:</span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    ({visibleCount}/{totalLinks} visible)
                                                                </span>

                                                                {isAdmin && totalLinks > 0 && (
                                                                    <button
                                                                        onClick={() => toggleAllDocumentsInCard(item._id, totalLinks)}
                                                                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0038A8] transition-all ml-auto"
                                                                        title={allHidden ? "Show all documents" : "Hide all documents"}
                                                                    >
                                                                        {allHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Document Grid - 3 columns */}
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {links.map((link, index) => {
                                                                    const isVisible = isDocumentVisible(item._id, index);

                                                                    if (!isVisible) return null;

                                                                    const docTitle = link.title || `Document ${index + 1}`;

                                                                    return link.fileId ? (
                                                                        /* PDF File Button */
                                                                        <button
                                                                            key={index}
                                                                            onClick={() => flipDocumentCard(item, link)}
                                                                            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-center group/link border border-blue-200 hover:border-[#0038A8] flex flex-col items-center gap-1.5"
                                                                        >
                                                                            <img
                                                                                src={PDFIcon}
                                                                                alt="PDF"
                                                                                className="w-24 h-20 object-contain"
                                                                            />
                                                                            {/* Walang line-clamp - Ipapakita ang buong pamagat */}
                                                                            <span className="text-[12px] font-medium text-slate-700 break-words w-full leading-tight">
                                                                                {docTitle}
                                                                            </span>

                                                                            {isAdmin && (
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        toggleDocumentVisibility(item._id, index);
                                                                                    }}
                                                                                    className="mt-1 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-amber-600 transition-all opacity-0 group-hover/link:opacity-100"
                                                                                    title="Hide this document"
                                                                                >
                                                                                    <EyeOff size={12} />
                                                                                </button>
                                                                            )}
                                                                        </button>
                                                                    ) : (
                                                                        /* External URL Link */
                                                                        <a
                                                                            key={index}
                                                                            href={link.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-center group/link border border-blue-200 hover:border-[#0038A8] flex flex-col items-center gap-1.5"
                                                                        >
                                                                            <ExternalLink size={20} className="text-[#0038A8] group-hover/link:text-[#CE1126]" />
                                                                            {/* Walang line-clamp - Ipapakita ang buong pamagat */}
                                                                            <span className="text-[10px] font-medium text-slate-700 break-words w-full leading-tight">
                                                                                {docTitle}
                                                                            </span>

                                                                            {isAdmin && (
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        toggleDocumentVisibility(item._id, index);
                                                                                    }}
                                                                                    className="mt-1 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-amber-600 transition-all opacity-0 group-hover/link:opacity-100"
                                                                                    title="Hide this document"
                                                                                >
                                                                                    <EyeOff size={12} />
                                                                                </button>
                                                                            )}
                                                                        </a>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Kapag nakatago ang lahat ng documents */}
                                                            {visibleCount === 0 && (
                                                                <div className="text-sm text-slate-400 italic flex items-center gap-2 py-2 justify-center">
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

                                                    {/* Kapag walang kahit anong documents */}
                                                    {!hasLinks && (
                                                        <div className="text-sm text-slate-400 italic py-4">
                                                            No documents available
                                                        </div>
                                                    )}
                                                </div>

                                                {/* RIGHT SIDE - Title, Description, Edit/Delete */}
                                                <div className="w-[45%] lg:w-[40%] pl-6 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-[#0038A8] font-black text-xl leading-tight uppercase tracking-tight group-hover:text-[#002b80] transition-colors mb-2">
                                                            {item.title}
                                                        </h3>

                                                        <div className="flex items-start gap-2">
                                                            <File size={16} className="text-[#0038A8] mt-0.5 flex-shrink-0" />
                                                            <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3">
                                                                {item.description || "No description available"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <Calendar size={12} />
                                                            <span>Added: {formatDate(item.createdAt)}</span>
                                                        </div>

                                                        {isAdmin && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openCardForEdit(item)}
                                                                    className="px-3 py-1.5 rounded-lg bg-[#0038A8] text-white text-xs font-bold hover:bg-[#002b80] transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                                                                    title="Edit this QMS Corner"
                                                                >
                                                                    <Pencil size={12} />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteConfirm(item)}
                                                                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                                                                    title="Delete this QMS Corner"
                                                                >
                                                                    <Trash2 size={12} />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

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
                    onClick={openCardForAdd}
                    className="fixed bottom-32 right-8 w-14 h-14 bg-[#0038A8] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#CE1126] transition-all duration-300 z-50 group hover:scale-110 border-4 border-white"
                >
                    <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* ISO Footer */}
            <ISOFooter />
        </div>
    );
};

export default CitizensCharter;