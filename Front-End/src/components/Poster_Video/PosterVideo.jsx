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
// YOUTUBE URL CONVERTER (Video)
// ==========================================
const convertYouTubeUrl = (url, muted = true) => {
    if (!url) return url;

    let videoId = null;

    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch && watchMatch[1]) videoId = watchMatch[1];

    if (!videoId) {
        const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch && shortMatch[1]) videoId = shortMatch[1];
    }

    if (!videoId) {
        const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
        if (embedMatch && embedMatch[1]) videoId = embedMatch[1];
    }

    if (!videoId) {
        const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
        if (shortsMatch && shortsMatch[1]) videoId = shortsMatch[1];
    }

    if (videoId) {
        const muteParam = muted ? 1 : 0;
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muteParam}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
    }

    return url;
};

// ==========================================
// UNIVERSAL VIDEO URL CONVERTER
// ==========================================
const convertVideoUrl = (url, options = {}) => {
    if (!url) return url;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        return convertYouTubeUrl(url, options.muted !== false);
    }

    if (url.includes("drive.google.com")) {
        const base = convertGoogleDriveUrl(url);
        const autoplay = options.autoplay ? "?autoplay=1" : "";
        return `${base}${autoplay}`;
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
const VIDEO_COUNTDOWN_SEC = 10;

// ==========================================
// 🎬 AUTOPLAY + UNMUTE CONFIG
// ==========================================
// Ilang segundo bago i-unmute pagkatapos mag-play
const UNMUTE_AFTER_SEC = 2;

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
    {
        _id: "65a1b2c3d4e5f6789012345e",
        type: "Video",
        title: "YOUTUBE SAMPLE",
        mediaUrl: "https://youtu.be/KH3YsXh3D3I",
        thumb:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
        showDate: "2026-10-05T00:00:00.000Z",
        poster: { timeToShow: 5 },
        video: { showTime: "08:00", exitTime: "17:00", timeToShow: 60 },
        reopenAfterMin: 1,
        isActive: true,
        order: 4,
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

    // 🎬 Mute-then-unmute state
    const [isUnmuted, setIsUnmuted] = useState(false);

    const currentItem = mediaItems[currentIndex];
    const iframeRef = useRef(null);
    const unmuteTimerRef = useRef(null);

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
            setIsUnmuted(false);
            return;
        }

        console.log(
            `⏱️ Video countdown starts: ${VIDEO_COUNTDOWN_SEC}s bago mag-play`
        );

        setVideoCountdown(VIDEO_COUNTDOWN_SEC);
        setIsVideoReady(false);
        setIsUnmuted(false);

        const countdownInterval = setInterval(() => {
            setVideoCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    console.log("✅ Countdown finished → playing video (muted muna)");
                    setIsVideoReady(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [isOpen, currentIndex, currentItem]);

    // ==========================================
    // 🎬 UNMUTE AFTER N SECONDS
    // ==========================================
    useEffect(() => {
        if (!isVideoReady || !currentItem || currentItem.type !== "Video") return;

        console.log(`🔇 Video playing muted → unmuting in ${UNMUTE_AFTER_SEC}s`);

        unmuteTimerRef.current = setTimeout(() => {
            console.log("🔊 Unmuting video now");
            setIsUnmuted(true);
        }, UNMUTE_AFTER_SEC * 1000);

        return () => {
            if (unmuteTimerRef.current) {
                clearTimeout(unmuteTimerRef.current);
            }
        };
    }, [isVideoReady, currentItem]);

    // ==========================================
    // 🎬 SEND UNMUTE COMMAND SA IFRAME
    // ==========================================
    useEffect(() => {
        if (!isUnmuted || !iframeRef.current) return;
        if (!currentItem || currentItem.type !== "Video") return;

        const iframe = iframeRef.current;
        const url = currentItem.mediaUrl || "";
        const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

        if (isYouTube) {
            // YouTube: send unMute command
            try {
                iframe.contentWindow?.postMessage(
                    JSON.stringify({
                        event: "command",
                        func: "unMute",
                        args: [],
                    }),
                    "*"
                );
                iframe.contentWindow?.postMessage(
                    JSON.stringify({
                        event: "command",
                        func: "setVolume",
                        args: [100],
                    }),
                    "*"
                );
                console.log("🔊 YouTube unMute command sent");
            } catch (err) {
                console.warn("⚠️ YouTube unMute failed:", err);
            }
        } else {
            // Google Drive: walang direct API, kaya i-reload ang iframe
            // na may autoplay=1 (walang mute) para mag-play with sound
            console.log("🔊 Google Drive — reloading iframe with sound");
            const baseUrl = convertGoogleDriveUrl(url);
            iframe.src = `${baseUrl}?autoplay=1`;
        }
    }, [isUnmuted, currentItem]);

    // ==========================================
    // 🎬 VIDEO CLOSE TIMER
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
            if (!event.origin) return;
            const isDrive = event.origin.includes("drive.google.com");
            const isYouTube = event.origin.includes("youtube.com");
            if (!isDrive && !isYouTube) return;

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
            console.log("📩 Media message:", eventName);

            if (
                eventName === "ended" ||
                eventName === "finish" ||
                eventName === "onStateChange"
            ) {
                if (eventName === "onStateChange" && data.info !== 0) return;

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

    // ==========================================
    // VIDEO SRC — preload (muted, walang autoplay)
    // ==========================================
    const videoSrcPreload = convertVideoUrl(currentItem.mediaUrl, {
        autoplay: false,
        muted: true,
    });

    // ==========================================
    // VIDEO SRC — autoplay MUTED muna
    // ==========================================
    const videoSrcAutoplayMuted = convertVideoUrl(currentItem.mediaUrl, {
        autoplay: true,
        muted: true,
    });

    // ==========================================
    // VIDEO SRC — autoplay WITH SOUND (pagkatapos ng unmute)
    // ==========================================
    const videoSrcAutoplaySound = convertVideoUrl(currentItem.mediaUrl, {
        autoplay: true,
        muted: false,
    });

    // ==========================================
    // PILIIN ANG SRC BATAY SA STATE
    // ==========================================
    const currentVideoSrc = !isVideoReady
        ? videoSrcPreload
        : isUnmuted
        ? videoSrcAutoplaySound
        : videoSrcAutoplayMuted;

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
                            ? "max-w-3xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
                            : "max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
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
                                        ▶ Video {isUnmuted ? "🔊" : "🔇"}
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

                        {/* Media Area — MAS MATAAS NA HEIGHT */}
                        <div
                            className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
                                isVideo
                                    ? "h-[55vh] max-h-[600px] sm:h-[60vh] sm:max-h-[650px] md:h-[65vh] md:max-h-[700px] lg:h-[70vh] lg:max-h-[800px] xl:h-[75vh] xl:max-h-[900px]"
                                    : "h-[80vh] max-h-[850px] min-h-[500px] sm:h-[85vh] sm:max-h-[900px] sm:min-h-[550px] md:h-[90vh] md:max-h-[1000px] md:min-h-[600px] lg:h-[92vh] lg:max-h-[1100px] lg:min-h-[650px]"
                            }`}
                        >
                            {isVideo ? (
                                <>
                                    {/* Iframe — nag-re-remount kapag nagbago ang src
                                        (muted → unmuted) */}
                                    <iframe
                                        ref={iframeRef}
                                        key={`video-${currentItem._id}-${
                                            isVideoReady ? "play" : "preload"
                                        }-${isUnmuted ? "sound" : "muted"}`}
                                        id={`media-player-${currentItem._id}`}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                                            isVideoReady
                                                ? "opacity-100 z-10"
                                                : "opacity-0 z-0 pointer-events-none"
                                        }`}
                                        src={currentVideoSrc}
                                        title={currentItem.title}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    />

                                    {/* Countdown Overlay */}
                                    {!isVideoReady && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black">
                                            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
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

                                                <span className="countdown-pulse text-5xl sm:text-6xl md:text-7xl font-bold text-white tabular-nums">
                                                    {videoCountdown}
                                                </span>
                                            </div>

                                            <p className="mt-6 text-sm sm:text-base md:text-lg text-white/70 font-medium tracking-wide uppercase">
                                                Video starting in...
                                            </p>

                                            <div className="mt-3 flex items-center gap-1.5">
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce"
                                                    style={{ animationDelay: "0ms" }}
                                                />
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce"
                                                    style={{ animationDelay: "150ms" }}
                                                />
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce"
                                                    style={{ animationDelay: "300ms" }}
                                                />
                                            </div>
                                        </div>
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