import React, { useState, useEffect } from 'react';

export default function App() {
  const [isPeekingOut, setIsPeekingOut] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [characterColor, setCharacterColor] = useState('bg-amber-400');
  const [expression, setExpression] = useState('happy'); // 'happy', 'excited', 'cool', 'thinking'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // User Icon & Profile States
  const [userName, setUserName] = useState("Citizen's Charter Guide");
  const [userRole, setUserRole] = useState('Public Assistance & Information');
  const [userStatus, setUserStatus] = useState('online'); // 'online', 'busy', 'away'

  const introText = "Hi! This is Our Citizen's Charter. Please Explore More! 👋";

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
    setIsPeekingOut(true);
    setIsWaving(true);
    playPopSound(580, 0.2);
    speakText(introText);

    setTimeout(() => {
      setIsWaving(false);
    }, 1800);
  };

  const togglePeek = () => {
    if (isPeekingOut) {
      setIsPeekingOut(false);
      setIsWaving(false);
      playPopSound(350, 0.12);
    } else {
      triggerPeekAndWave();
    }
  };

  // Auto peek animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPeekingOut(true);
      setIsWaving(true);
      playPopSound(600, 0.2);
      setTimeout(() => setIsWaving(false), 1600);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const statusColors = {
    online: 'bg-emerald-500 border-slate-900',
    busy: 'bg-rose-500 border-slate-900',
    away: 'bg-amber-400 border-slate-900',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 select-none font-sans overflow-hidden">
      {/* Main Peeking Interactive Stage */}
      <div className="relative my-8 flex flex-col items-center">
        
        {/* Dynamic Speech Bubble (Lalabas kapag sumisilip o kumakaway) */}
        <div 
          className={`absolute -top-28 left-1/2 -translate-x-1/2 bg-white text-slate-900 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] transition-all duration-500 z-40 w-72 text-center leading-snug ${
            isPeekingOut ? 'opacity-100 scale-100 -translate-y-2' : 'opacity-0 scale-50 translate-y-6 pointer-events-none'
          }`}
        >
          <div className="text-[10px] uppercase font-black tracking-widest text-amber-600 mb-0.5">
            🏛️ CITIZEN'S CHARTER
          </div>
          <div>{introText}</div>

          {/* Bubble Tail */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-slate-900" />
        </div>

        {/* Peeking Avatar Container with Barrier Wall */}
        <div 
          className="relative w-80 h-48 flex items-end justify-center cursor-pointer group"
          onClick={triggerPeekAndWave}
        >
          {/* Peeking Character (Nagtatago sa likod ng pader / sumisilip) */}
          <div 
            className={`absolute bottom-10 transition-all duration-500 ease-out z-10 flex flex-col items-center ${
              isPeekingOut 
                ? '-translate-y-12 rotate-0' 
                : 'translate-y-10 -rotate-12 group-hover:translate-y-4 group-hover:-rotate-6'
            }`}
          >
            {/* 3D Circular Avatar Head */}
            <div className={`w-32 h-32 ${characterColor} rounded-full border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative flex flex-col items-center justify-center overflow-visible`}>
              
              {/* Eyes */}
              <div className="flex gap-2.5 mb-1 z-10">
                <div className="w-7 h-9 bg-white rounded-full border-3 border-slate-900 relative flex items-center justify-center overflow-hidden">
                  {!isPeekingOut ? (
                    /* Peeking curious eyes looking up */
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
                    /* Peeking curious eyes looking up */
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
                className={`transition-all duration-300 border-slate-900 ${
                  !isPeekingOut
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
                className={`absolute -right-3 top-8 w-9 h-9 ${characterColor} border-3 border-slate-900 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] origin-bottom-left transition-all z-20 ${
                  isWaving ? 'animate-wave' : 'group-hover:rotate-12'
                }`}
              >
                <div className={`w-2.5 h-2.5 ${characterColor} border-2 border-slate-900 rounded-full absolute -top-1 left-0.5`} />
              </div>

              {/* Status Dot Badge */}
              <div 
                className={`absolute bottom-0 right-1 w-6 h-6 ${statusColors[userStatus]} border-3 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-30`}
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePeek();
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5"
            >
              {isPeekingOut ? '🙈 Magtago' : '👀 Sumilip!'}
            </button>
          </div>

        </div>

      </div>



      {/* CSS Wave Keyframe Animations */}
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(-28deg); }
          30% { transform: rotate(25deg); }
          45% { transform: rotate(-22deg); }
          60% { transform: rotate(18deg); }
          75% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 1.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
        }
      `}</style>

    </div>
  );
}