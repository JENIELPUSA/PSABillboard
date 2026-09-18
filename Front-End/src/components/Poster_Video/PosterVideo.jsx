import React, { useEffect, useState, useRef, useCallback } from "react";

// ==========================================
// GOOGLE DRIVE URL CONVERTER (Video)
// ==========================================
const convertGoogleDriveUrl = (url) => {
    if (!url) return url;

    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }

    return url;
};

// ==========================================
// GOOGLE DRIVE IMAGE URL CONVERTER
// ==========================================
const convertGoogleDriveImage = (url) => {
    if (!url) return url;

    let fileId = null;

    const ucMatch = url.match(/[?&]id=([^&]+)/);
    if (ucMatch && ucMatch[1]) fileId = ucMatch[1];

    if (!fileId) {
        const fileMatch = url.match(/\/file\/d\/([^/]+)/);
        if (fileMatch && fileMatch[1]) fileId = fileMatch[1];
    }

    if (!fileId) {
        const lh3Match = url.match(/googleusercontent\.com\/d\/([^/]+)/);
        if (lh3Match && lh3Match[1]) fileId = lh3Match[1];
    }

    if (fileId) {
        return `https://drive.google.com/thumbnail?sz=w1600&id=${fileId}`;
    }

    return url;
};

// ==========================================
// CONFIG
// ==========================================
const FIRST_DELAY_MS = 3000;
const VIDEO_BUFFER_MS = 2000;
const MIN_PLAY_TIME_MS = 5000;
const DEFAULT_REOPEN_MIN = 1;
const VIDEO_COUNTDOWN_SEC = 5;

// ==========================================
// MOCK MEDIA DATA
// ==========================================
const initialMediaItems = [
    {
        _id: "65a1b2c3d4e5f6789012345b",
        type: "Poster",
        title: "LABANAN ANG RED TAPE",
        mediaUrl:
            "https://drive.google.com/file/d/1b_avhQwgfgHwSyAsOUPnOYsSKwRYlIzG/view?usp=drive_link",
        thumb:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=300&auto=format&fit=crop",
        showDate: "2026-10-02T00:00:00.000Z",
        poster: { timeToShow: 8 },
        video: { showTime: "09:00", exitTime: "18:00", timeToShow: 30 },
        reopenAfterMin: 1,
        isActive: true,
        order: 1,
        description:
            "Ang paglaban sa red tape ay tumutukoy sa pagsisikap na bawasan ang hindi kinakailangang proseso, dokumento, pirma, at matagal na paghihintay upang maging mas mabilis, simple, malinaw, at episyente ang paghahatid ng serbisyo publiko.",
    },
    {
        _id: "65a1b2c3d4e5f6789012345d",
        type: "Poster",
        title: "BAWAL ANG RED TAPE",
        mediaUrl:
            "https://drive.google.com/uc?export=view&id=1y_HOKye39X7d9UmefRoGfQ0xm2bqEfqk",
        thumb:
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop",
        showDate: "2026-10-04T00:00:00.000Z",
        poster: { timeToShow: 12 },
        video: { showTime: "10:00", exitTime: "16:00", timeToShow: 30 },
        reopenAfterMin: 1,
        isActive: true,
        order: 2,
        description:
            "Red tape refers to excessive, unnecessary, or complicated rules, procedures, paperwork, and approval processes that cause delays in providing services or completing transactions.",
    },
    {
        _id: "65a1b2c3d4e5f6789012345c",
        type: "Video",
        title: "CRASM",
        mediaUrl:
            "https://drive.google.com/file/d/18JcX-99EGOXBfltXwTbNPWwkBccbQKru/view",
        thumb:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
        showDate: "2026-10-03T00:00:00.000Z",
        poster: { timeToShow: 5 },
        video: { showTime: "08:00", exitTime: "17:00", timeToShow: 177 },
        reopenAfterMin: 1,
        isActive: true,
        order: 3,
        description: "",
    },
];

export default function VideoPosterAds() {
    const [mediaItems] = useState(
        initialMediaItems
            .filter((item) => item.isActive)
            .sort((a, b) => a.order - b.order)
    );

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Countdown states
    const [videoCountdown, setVideoCountdown] = useState(VIDEO_COUNTDOWN_SEC);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const currentItem = mediaItems[currentIndex];
    const iframeRef = useRef(null);

    // ==========================================
    // CLOSE AD
    // ==========================================
    const closeAd = useCallback(() => {
        const reopenMin = currentItem?.reopenAfterMin ?? DEFAULT_REOPEN_MIN;
        const reopenDelayMs = reopenMin * 60 * 1000;

        console.log(
            `🔒 Popup closing → ${reopenMin} min (${reopenDelayMs / 1000}s) countdown starts`
        );

        setIsOpen(false);
        window.dispatchEvent(
            new CustomEvent("ad-closed", { detail: { delay: reopenDelayMs } })
        );
    }, [currentItem]);

    // ==========================================
    // POPUP SCHEDULER
    // ==========================================
    useEffect(() => {
        let timer;

        const scheduleNext = (delay) => {
            clearTimeout(timer);
            console.log(`⏰ Next popup in ${delay / 1000}s`);
            timer = setTimeout(() => {
                console.log("🚀 Popup opening now");
                setIsOpen(true);
                setCurrentIndex(0);
            }, delay);
        };

        scheduleNext(FIRST_DELAY_MS);

        const handleReopen = (e) => {
            const delay = e?.detail?.delay ?? DEFAULT_REOPEN_MIN * 60 * 1000;
            scheduleNext(delay);
        };
        window.addEventListener("ad-closed", handleReopen);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("ad-closed", handleReopen);
        };
    }, []);

    // ==========================================
    // GO TO NEXT AD
    // ==========================================
    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, [mediaItems.length]);

    // ==========================================
    // AUTO NEXT AD (POSTER ONLY)
    // ==========================================
    useEffect(() => {
        if (!isOpen || !currentItem) return;
        if (currentItem.type === "Video") return;

        const duration = currentItem.poster?.timeToShow || 10;
        console.log(`🖼️ Poster "${currentItem.title}" → next in ${duration}s`);

        const timer = setTimeout(() => goNext(), duration * 1000);
        return () => clearTimeout(timer);
    }, [isOpen, currentIndex, currentItem, goNext]);

    // ==========================================
    // VIDEO COUNTDOWN
    // ==========================================
    useEffect(() => {
        if (!isOpen || !currentItem || currentItem.type !== "Video") {
            setVideoCountdown(VIDEO_COUNTDOWN_SEC);
            setIsVideoReady(false);
            return;
        }

        console.log(
            `⏱️ Video countdown starts: ${VIDEO_COUNTDOWN_SEC}s bago mag-play`
        );

        setVideoCountdown(VIDEO_COUNTDOWN_SEC);
        setIsVideoReady(false);

        const countdownInterval = setInterval(() => {
            setVideoCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    console.log("✅ Countdown finished → mounting iframe with autoplay");
                    setIsVideoReady(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [isOpen, currentIndex, currentItem]);

    // ==========================================
    // 🎬 VIDEO CLOSE TIMER — pagkatapos ng countdown
    // ==========================================
    useEffect(() => {
        if (!isOpen || !currentItem || currentItem.type !== "Video") return;
        if (!isVideoReady) return;

        const videoDurationSec = currentItem.video?.timeToShow || 30;
        const closeAfterMs = videoDurationSec * 1000 + VIDEO_BUFFER_MS;

        console.log(
            `🎬 Video "${currentItem.title}" → closing in ${closeAfterMs / 1000}s`
        );

        const playStartTime = Date.now();

        const closeTimer = setTimeout(() => {
            console.log("⏰ Video duration reached → closing");
            closeAd();
        }, closeAfterMs);

        const handleMessage = (event) => {
            if (!event.origin || !event.origin.includes("drive.google.com")) return;

            let data = event.data;
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    return;
                }
            }
            if (!data || typeof data !== "object") return;

            const eventName = data.event || data.type;
            console.log("📩 Drive message:", eventName);

            if (eventName === "ended" || eventName === "finish") {
                const elapsed = Date.now() - playStartTime;

                if (elapsed < MIN_PLAY_TIME_MS) {
                    console.log(`⚠️ Ignored "ended" (only ${elapsed / 1000}s elapsed)`);
                    return;
                }

                console.log(`🏁 Video ended after ${elapsed / 1000}s → closing`);
                closeAd();
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearTimeout(closeTimer);
        };
    }, [isOpen, currentIndex, currentItem, closeAd, isVideoReady]);

    // ==========================================
    // MANUAL NEXT / PREVIOUS
    // ==========================================
    const nextAd = () => goNext();
    const previousAd = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
        );
    };

    if (!currentItem || !isOpen) {
        return null;
    }

    const isVideo = currentItem.type === "Video";
    const isPoster = currentItem.type === "Poster";

    const progressDuration = isPoster
        ? currentItem.poster?.timeToShow || 10
        : currentItem.video?.timeToShow || 30;

    return (
        <>
            <style>{`
        @keyframes adSlideIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes adFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes adProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes countdownPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.85; }
        }
        .ads-popup { animation: adSlideIn 0.5s ease-out; }
        .ads-image { animation: adFade 0.4s ease-in; }
        .countdown-pulse { animation: countdownPulse 1s ease-in-out infinite; }
      `}</style>

            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
                onClick={closeAd}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                <div
                    className={`pointer-events-auto w-full ads-popup transition-all duration-300 ${
                        isVideo
                            ? "max-w-2xl sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
                            : "max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
                    }`}
                >
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_70px_rgba(0,0,0,0.6)] border border-slate-200">
                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/20 px-2.5 py-1 rounded">
                                    Advertisement
                                </span>

                                {isVideo && (
                                    <span className="text-[11px] text-white/90 font-medium">
                                        ▶ Video
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={closeAd}
                                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer text-sm"
                                aria-label="Close advertisement"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Media Area */}
                        <div
                            className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
                                isVideo
                                    ? "h-[40vh] max-h-[400px] sm:h-[45vh] sm:max-h-[450px] md:h-[50vh] md:max-h-[500px] lg:h-[55vh] lg:max-h-[550px]"
                                    : "h-[70vh] max-h-[700px] min-h-[400px] sm:h-[75vh] sm:max-h-[780px] sm:min-h-[450px] md:h-[80vh] md:max-h-[850px] md:min-h-[500px] lg:h-[85vh] lg:max-h-[900px] lg:min-h-[550px]"
                            }`}
                        >
                            {isVideo ? (
                                <>
                                    {/* Countdown Overlay — nawawala pag ready na */}
                                    {!isVideoReady && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black">
                                            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                                                <svg
                                                    className="absolute inset-0 w-full h-full -rotate-90"
                                                    viewBox="0 0 100 100"
                                                >
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        fill="none"
                                                        stroke="rgba(255,255,255,0.15)"
                                                        strokeWidth="4"
                                                    />
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        fill="none"
                                                        stroke="#f43f5e"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeDasharray="283"
                                                        strokeDashoffset={
                                                            283 -
                                                            (283 * (VIDEO_COUNTDOWN_SEC - videoCountdown)) /
                                                                VIDEO_COUNTDOWN_SEC
                                                        }
                                                        style={{
                                                            transition: "stroke-dashoffset 1s linear",
                                                        }}
                                                    />
                                                </svg>

                                                <span className="countdown-pulse text-5xl sm:text-6xl font-bold text-white tabular-nums">
                                                    {videoCountdown}
                                                </span>
                                            </div>

                                            <p className="mt-6 text-sm sm:text-base text-white/70 font-medium tracking-wide uppercase">
                                                Video starting in...
                                            </p>

                                            <div className="mt-3 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* ============================================
                                        IFRAME — I-MOUNT LANG PAGKATAPOS NG COUNTDOWN
                                        Ito ang key fix: hindi natin i-mount agad,
                                        kaya pag-mount pa lang, autoplay na agad
                                        ============================================ */}
                                    {isVideoReady && (
                                        <iframe
                                            ref={iframeRef}
                                            key={`video-${currentItem._id}-${Date.now()}`}
                                            id={`gdrive-player-${currentItem._id}`}
                                            className="w-full h-full object-cover"
                                            src={`${convertGoogleDriveUrl(currentItem.mediaUrl)}?autoplay=1`}
                                            title={currentItem.title}
                                            frameBorder="0"
                                            allow="autoplay; encrypted-media; fullscreen"
                                            allowFullScreen
                                        />
                                    )}
                                </>
                            ) : (
                                <img
                                    key={currentItem._id}
                                    src={convertGoogleDriveImage(currentItem.mediaUrl)}
                                    alt={currentItem.title}
                                    className="ads-image w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log("❌ Image failed to load:", e.target.src);
                                        if (currentItem.thumb && e.target.src !== currentItem.thumb) {
                                            e.target.src = currentItem.thumb;
                                        }
                                    }}
                                    onLoad={() => {
                                        console.log("✅ Image loaded:", currentItem.title);
                                    }}
                                />
                            )}

                            {/* Prev Button */}
                            {mediaItems.length > 1 && (
                                <button
                                    onClick={previousAd}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer text-lg z-30"
                                >
                                    ❮
                                </button>
                            )}

                            {/* Next Button */}
                            {mediaItems.length > 1 && (
                                <button
                                    onClick={nextAd}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer text-lg z-30"
                                >
                                    ❯
                                </button>
                            )}
                        </div>

                        {/* Info Footer */}
                        <div className="px-5 py-4 bg-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-slate-900 truncate">
                                        {currentItem.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                                        {currentItem.description}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                                    {currentIndex + 1}/{mediaItems.length}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                {isPoster && (
                                    <div
                                        key={currentItem._id}
                                        className="h-full bg-rose-500 rounded-full"
                                        style={{
                                            animation: `adProgress ${progressDuration}s linear`,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}