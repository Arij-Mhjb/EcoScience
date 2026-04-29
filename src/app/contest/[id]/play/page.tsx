"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import OpeningAnimation from "@/components/OpeningAnimation";
import FlashQuestion from "@/components/FlashQuestion";
import ContestQuiz from "@/components/ContestQuiz";
import { getQuestions } from "@/data/questions";
import DragDropChallenge from "@/components/DragDropChallenge";
import MatchingChallenge from "@/components/MatchingChallenge";
import SpotTheErrorChallenge from "@/components/SpotTheErrorChallenge";
import ContestResults from "@/components/ContestResults";
import Turtle from "@/components/Turtle";
import { useLanguage } from "@/context/LanguageContext";

interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correct: boolean;
  points: number;
  questionText?: string;
}

type ContestStep =
  | "animation"
  | "flash"
  | "quiz"
  | "challenge1"
  | "challenge2"
  | "challenge3"
  | "results";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const TIMER_STEPS: ContestStep[] = ["quiz", "challenge1", "challenge2", "challenge3"];

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -60 : 60 }),
};

const fadeVariants = {
  enter: { opacity: 0, scale: 0.97 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

export default function PlayPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  const contestId = params.id as string;
  const contestQuestions = getQuestions(contestId, locale);

  const [step, setStep] = useState<ContestStep>("animation");

  const [globalTimer, setGlobalTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [quizScore, setQuizScore] = useState(0);
  const [quizErrors, setQuizErrors] = useState(0);
  const [challenge1Score, setChallenge1Score] = useState(0);
  const [challenge1Errors, setChallenge1Errors] = useState(0);
  const [challenge2Score, setChallenge2Score] = useState(0);
  const [challenge2Errors, setChallenge2Errors] = useState(0);
  const [challenge3Score, setChallenge3Score] = useState(0);
  const [challenge3Errors, setChallenge3Errors] = useState(0);

  const [initialQuizAnswers, setInitialQuizAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setGlobalTimer((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && contestId) {
      fetch(`/api/contest-progress?contestId=${contestId}`)
        .then((r) => r.json())
        .then((data) => {
          try {
            if (data.progress) {
              const p = data.progress;
              if (p.status === "completed") {
                setQuizScore(p.score);
                setQuizErrors(p.errors);
                setGlobalTimer(p.timeSpent);
                setStep("results");
              } else if (p.status === "in_progress") {
                setGlobalTimer(p.timeSpent || 0);
                
                if (p.score !== undefined) setQuizScore(p.score);
                if (p.errors !== undefined) setQuizErrors(p.errors);

                const qAns = p.quizAnswers || {};
                let reconstructed: QuizAnswer[] = [];
                
                if (Array.isArray(qAns)) {
                  reconstructed = qAns;
                } else if (typeof qAns === 'object' && qAns !== null) {
                  Object.entries(qAns).forEach(([qIdx, val]) => {
                    const idx = parseInt(qIdx, 10);
                    const q = contestQuestions[idx];
                    if (q) {
                      const ansIdx = (typeof val === 'object' && val !== null) ? (val as any).answer : val;
                      const correct = (q.answer === ansIdx);
                      reconstructed.push({
                        questionIndex: idx,
                        selectedAnswer: ansIdx as number,
                        correct,
                        points: correct ? q.points : 0,
                        questionText: (typeof val === 'object' && val !== null) ? (val as any).questionText : q.text,
                      });
                    }
                  });
                  reconstructed.sort((a, b) => a.questionIndex - b.questionIndex);
                }
                setInitialQuizAnswers(reconstructed);

                if (p.lastStep) {
                  let restoredStep = p.lastStep as ContestStep;
                  if (restoredStep === "quiz" && reconstructed.length >= contestQuestions.length) {
                    restoredStep = "challenge1";
                  }
                  setStep(restoredStep);
                  if (TIMER_STEPS.includes(restoredStep)) {
                    setTimerActive(true);
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error restoring progress:", err);
          } finally {
            setInitLoading(false);
          }
        })
        .catch((err) => {
          console.error("Fetch progress error:", err);
          setInitLoading(false);
        });
    } else if (status !== "loading") {
      setInitLoading(false);
    }
  }, [status, contestId]);

  const handleQuizProgress = useCallback((answers: QuizAnswer[], currentScore: number, currentErrors: number) => {
    const lastAnswer = answers[answers.length - 1];
    if (!lastAnswer) return;

    fetch(`/api/contest/${contestId}/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: lastAnswer.questionIndex,
        answer: lastAnswer.selectedAnswer,
        questionText: lastAnswer.questionText,
        timeSpent: globalTimer,
        score: currentScore,
        errors: currentErrors,
        lastStep: "quiz",
      }),
    }).catch(console.error);
  }, [contestId, globalTimer]);

  const totalScoreNow = quizScore + challenge1Score + challenge2Score + challenge3Score;
  const totalErrorsNow = quizErrors + challenge1Errors + challenge2Errors + challenge3Errors;

  useEffect(() => {
    if (step === "animation" || step === "results" || initLoading) return;
    
    const challengeData: any = {};
    if (step === "challenge1") {
      challengeData.questionId = 101;
      challengeData.questionText = locale === 'ar' ? "تحدي 1" : "Défi 1";
    } else if (step === "challenge2") {
      challengeData.questionId = 102;
      challengeData.questionText = locale === 'ar' ? "تحدي 2" : "Défi 2";
    } else if (step === "challenge3") {
      challengeData.questionId = 103;
      challengeData.questionText = locale === 'ar' ? "تحدي 3" : "Défi 3";
    }

    fetch(`/api/contest/${contestId}/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastStep: step,
        timeSpent: globalTimer,
        ...challengeData,
        score: totalScoreNow,
        errors: totalErrorsNow,
      }),
    }).catch(console.error);
  }, [step, contestId, initLoading]);

  useEffect(() => {
    if (!timerActive || step === "results" || initLoading) return;
    
    const interval = setInterval(() => {
      fetch(`/api/contest/${contestId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSpent: globalTimer,
        }),
      }).catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }, [timerActive, step, contestId, initLoading, globalTimer]);

  const showTimer = TIMER_STEPS.includes(step);

  const getStepLabel = (step: ContestStep): string | null => {
    const isAr = locale === 'ar';
    const total = contestId === '69e51153482488070228f2ce' ? 5 : 4;
    const stepTxt = isAr ? 'الخطوة' : 'Étape';
    const ofTxt = isAr ? 'من' : 'sur';
    
    switch (step) {
      case "animation":
      case "flash":
        return `${stepTxt} 1 ${ofTxt} ${total}`;
      case "quiz":
        return `${stepTxt} 2 ${ofTxt} ${total}`;
      case "challenge1":
        return `${stepTxt} 3 ${ofTxt} ${total}`;
      case "challenge2":
        return `${stepTxt} 4 ${ofTxt} ${total}`;
      case "challenge3":
        return `${stepTxt} 5 ${ofTxt} 5`;
      case "results":
        return null;
    }
  };

  const stepLabel = getStepLabel(step);

  if (status === "loading" || initLoading) {
    return (
      <main className="min-h-screen bg-ocean-gradient flex items-center justify-center">
        <Turtle mood="thinking" size="lg" message={t('quiz_loading')} />
      </main>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-success-50/30 flex flex-col" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {step !== "results" && (
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-primary-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <motion.button
              onClick={() => router.push(`/contest/${contestId}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 text-primary-600 hover:text-primary font-bold text-sm transition-colors select-none"
            >
              <span className="text-base leading-none">{locale === 'ar' ? '→' : '←'}</span>
              <span>{t('back')}</span>
            </motion.button>

            <div className="flex-shrink-0">
              <Image
                src="/images/ecoscience-text-logo.png"
                alt="EcoScience"
                width={96}
                height={38}
                className="object-contain"
                priority
              />
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showTimer && (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-kid tabular-nums"
                  >
                    <span>⏱️</span>
                    <span className="font-mono">{formatTime(globalTimer)}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {stepLabel !== null ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22 }}
                    className="bg-primary-50 text-primary-700 border border-primary-200 px-3 py-0.5 rounded-full text-xs font-bold select-none whitespace-nowrap"
                  >
                    {stepLabel}
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="bg-success text-white px-3 py-0.5 rounded-full text-xs font-bold select-none"
                  >
                    ✓ {t('status_completed')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 relative">
        <AnimatePresence mode="wait" custom={locale === 'ar' ? 1 : -1}>
          {step === "animation" && (
            <motion.div key="animation" variants={fadeVariants} initial="enter" animate="center" exit="exit" className="w-full">
              <OpeningAnimation contestId={contestId} onComplete={() => setStep("flash")} />
            </motion.div>
          )}

          {step === "flash" && (
            <motion.div key="flash" variants={slideVariants} custom={isAr ? 1 : -1} initial="enter" animate="center" exit="exit" className="w-full">
              <FlashQuestion contestId={contestId} onComplete={() => { setTimerActive(true); setStep("quiz"); }} />
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div key="quiz" variants={slideVariants} custom={isAr ? 1 : -1} initial="enter" animate="center" exit="exit" className="w-full">
              <ContestQuiz
                timeSpent={globalTimer}
                questions={contestQuestions}
                initialAnswers={initialQuizAnswers}
                onProgress={handleQuizProgress}
                onComplete={(result) => {
                  setQuizScore(result.score);
                  setQuizErrors(result.errors);
                  setStep("challenge1");
                }}
              />
            </motion.div>
          )}

          {step === "challenge1" && (
            <motion.div key="challenge1" variants={slideVariants} custom={isAr ? 1 : -1} initial="enter" animate="center" exit="exit" className="w-full">
              <DragDropChallenge
                contestId={contestId}
                onComplete={(r) => {
                  setChallenge1Score(r.score);
                  setChallenge1Errors(r.errors);
                  setStep("challenge2");
                }}
              />
            </motion.div>
          )}

          {step === "challenge2" && (
            <motion.div key="challenge2" variants={slideVariants} custom={isAr ? 1 : -1} initial="enter" animate="center" exit="exit" className="w-full">
              <MatchingChallenge
                contestId={contestId}
                onComplete={(r) => {
                  setChallenge2Score(r.score);
                  setChallenge2Errors(r.errors);
                  if (contestId === '69e51153482488070228f2ce') {
                    setStep("challenge3");
                  } else {
                    setTimerActive(false);
                    setStep("results");
                  }
                }}
              />
            </motion.div>
          )}

          {step === "challenge3" && (
            <motion.div key="challenge3" variants={slideVariants} custom={isAr ? 1 : -1} initial="enter" animate="center" exit="exit" className="w-full">
              <SpotTheErrorChallenge
                onComplete={(r) => {
                  setChallenge3Score(r.score);
                  setChallenge3Errors(r.errors);
                  setTimerActive(false);
                  setStep("results");
                }}
              />
            </motion.div>
          )}

          {step === "results" && (
            <div className="fixed inset-0 z-[100] overflow-y-auto bg-ocean-gradient">
              <ContestResults
                contestId={contestId}
                totalScore={Math.min(100, Math.round(quizScore + challenge1Score + challenge2Score + challenge3Score))}
                timeSpent={globalTimer}
                totalErrors={quizErrors + challenge1Errors + challenge2Errors + challenge3Errors}
              />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
