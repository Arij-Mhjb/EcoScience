"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turtle from "./Turtle";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

interface Video {
  id: string;
  youtubeId?: string;
  titleAr: string;
  titleFr: string;
  duration: string;
  difficultyAr: string;
  difficultyFr: string;
  difficulty: "easy" | "medium" | "hard";
  color: string;
  icon: string;
  factAr?: string;
  factFr?: string;
}

const VIDEOS: Video[] = [
  { 
    id: "1", 
    youtubeId: "JneAz6FI05U", 
    titleAr: "🌍 لماذا تسخن الأرض؟", 
    titleFr: "🌍 Pourquoi la Terre chauffe ?", 
    duration: "3:00", 
    difficultyAr: "سهل", 
    difficultyFr: "Facile", 
    difficulty: "easy",
    color: "bg-orange-100 text-orange-700", 
    icon: "🌡️",
    factAr: "الاحتباس الحراري يجعل كوكبنا دافئاً جداً، وعلينا حمايته!",
    factFr: "Le réchauffement rend notre planète trop chaude, nous devons la protéger !"
  },
  { 
    id: "2", 
    youtubeId: "xDmvkZ__d-I", 
    titleAr: "💧 رحلة قطرة الماء", 
    titleFr: "💧 Voyage d'une goutte d'eau", 
    duration: "4:00", 
    difficultyAr: "سهل", 
    difficultyFr: "Facile", 
    difficulty: "easy",
    color: "bg-blue-100 text-blue-700", 
    icon: "🌊",
    factAr: "الماء يدور في الطبيعة ولا ينتهي أبداً إذا حافظنا عليه!",
    factFr: "L'eau circule dans la nature et ne finit jamais si nous la préservons !"
  },
  { 
    id: "4", 
    youtubeId: "HdPuhmIMYf8", 
    titleAr: "🌳 لماذا نحتاج الأشجار؟", 
    titleFr: "🌳 Pourquoi les arbres ?", 
    duration: "2:00", 
    difficultyAr: "سهل", 
    difficultyFr: "Facile", 
    difficulty: "easy",
    color: "bg-emerald-100 text-emerald-700", 
    icon: "🍃",
    factAr: "هل تعلم؟ الأشجار تمنحنا الأكسجين (O2) الضروري للتنفس وتنقي الهواء! 🌳💨",
    factFr: "Le savais-tu ? Les arbres nous donnent l'oxygène (O2) nécessaire pour respirer et purifient l'air ! 🌳💨"
  },
  { 
    id: "5", 
    youtubeId: "yubeT59vf-U",
    titleAr: "🐋 البحار في خطر", 
    titleFr: "🐋 Mers en danger", 
    duration: "4:00", 
    difficultyAr: "متوسط", 
    difficultyFr: "Moyen", 
    difficulty: "medium",
    color: "bg-indigo-100 text-indigo-700", 
    icon: "🐳",
    factAr: "المحيط يغطي 70% من الأرض وهو رئة الكوكب الحقيقية!",
    factFr: "L'océan couvre 70% de la Terre et est le vrai poumon de la planète !"
  },
  { 
    id: "6", 
    youtubeId: "cJ1lJafEPzw",
    titleAr: "☀️ الطاقة النظيفة", 
    titleFr: "☀️ Énergie propre", 
    duration: "3:00", 
    difficultyAr: "صعب", 
    difficultyFr: "Difficile", 
    difficulty: "hard",
    color: "bg-amber-100 text-amber-700", 
    icon: "⚡",
    factAr: "الطاقة النظيفة هي مفتاح المستقبل لحماية كوكبنا من التغير المناخي!",
    factFr: "L'énergie propre est la clé du futur pour protéger notre planète du changement climatique !"
  },
];

export default function VideoZone({ onComplete, difficulty }: { onComplete: () => void, difficulty: "easy" | "medium" | "hard" }) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const filteredVideos = VIDEOS.filter(v => v.difficulty === difficulty);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("watched_videos");
    if (saved) setWatchedIds(JSON.parse(saved));
  }, []);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setProgress(0);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Simulate watching
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          markWatched(selectedVideo!.id);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const markWatched = (id: string) => {
    if (watchedIds.includes(id)) return;
    const newWatched = [...watchedIds, id];
    setWatchedIds(newWatched);
    localStorage.setItem("watched_videos", JSON.stringify(newWatched));
  };

  const allWatched = watchedIds.length === VIDEOS.length;

  return (
    <div className="w-full max-w-5xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black text-primary-800">
          {isAr ? (difficulty === "easy" ? "🎬 فيديوهات أساسية" : difficulty === "medium" ? "🎬 فيديو البحار" : "🎬 فيديو الطاقة") : (difficulty === "easy" ? "🎬 Vidéos de base" : difficulty === "medium" ? "🎬 Vidéo des mers" : "🎬 Vidéo de l'énergie")}
        </h2>
        <div className="bg-white px-4 py-1.5 rounded-full shadow-sm font-bold text-primary">
          {watchedIds.filter(id => filteredVideos.some(v => v.id === id)).length}/{filteredVideos.length} ⭐
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -5 }}
            onClick={() => handleVideoClick(video)}
            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer border-4 border-transparent hover:border-primary/20 transition-all group"
          >
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {video.icon}
              </div>
              <div className="absolute top-3 right-3 z-10">
                {watchedIds.includes(video.id) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl filter drop-shadow-sm">⭐</motion.span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            <div className="p-5">
              <h3 className="font-black text-xl text-primary-900 mb-3 leading-tight">
                {isAr ? video.titleAr : video.titleFr}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 font-bold text-gray-500">
                  ⏱️ {video.duration}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold ${video.color}`}>
                  {isAr ? video.difficultyAr : video.difficultyFr}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center text-2xl font-black transition-colors"
              >
                ✕
              </button>

              <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                {!isPlaying ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Thumbnail/Icon placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                       <span className="text-9xl mb-4">{selectedVideo.icon}</span>
                       <h5 className="text-white/40 font-bold">{isAr ? selectedVideo.titleAr : selectedVideo.titleFr}</h5>
                    </div>
                    <button 
                      onClick={handlePlay}
                      className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl shadow-2xl hover:scale-110 transition-transform z-10"
                    >
                      ▶️
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {selectedVideo.youtubeId ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => {
                          // Auto-mark as watched after 10s for YouTube
                          setTimeout(() => markWatched(selectedVideo.id), 10000);
                          setProgress(100);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-9xl mb-8">
                          {selectedVideo.icon}
                        </motion.div>
                        <p className="text-white/60 font-bold animate-pulse">
                          {isAr ? "جاري العرض..." : "Lecture en cours..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Simulated Player UI (only for non-youtube or as overlay) */}
                {!selectedVideo.youtubeId && isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-4 text-white mb-4">
                      <span className="font-bold">{isAr ? selectedVideo.titleAr : selectedVideo.titleFr}</span>
                    </div>
                    <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-4 flex justify-between text-white/50 text-sm font-bold">
                      <span>0:00</span>
                      <span>{selectedVideo.duration}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-primary-50/50">
                <div className="text-center sm:text-right flex-1">
                  <h4 className="text-2xl font-black text-primary-900 mb-2">
                    {isAr ? "معلومة مفيدة 💡" : "Le savais-tu ? 💡"}
                  </h4>
                  <p className="text-primary-700 font-bold text-lg leading-relaxed">
                    {isAr ? selectedVideo.factAr : selectedVideo.factFr}
                  </p>
                </div>
                {progress >= 100 && (
                  <div className="flex gap-4">
                    <button onClick={() => setProgress(0)} className="btn-secondary px-6 py-3 rounded-full font-bold">
                      {isAr ? "شاهد مرة أخرى 🔄" : "Voir encore 🔄"}
                    </button>
                    <button onClick={() => setSelectedVideo(null)} className="btn-primary px-8 py-3 rounded-full font-bold">
                      {isAr ? "تم! ⭐" : "Fini ! ⭐"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {allWatched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
          <button onClick={onComplete} className="btn-primary text-2xl px-12 py-5 shadow-xl hover:-translate-y-1 transition-all">
            {isAr ? "أنهيت كل الفيديوهات! 🐢✨" : "J'ai tout fini ! 🐢✨"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
