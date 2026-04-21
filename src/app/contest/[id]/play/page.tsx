"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import OpeningAnimation from "@/components/OpeningAnimation";
import FlashQuestion from "@/components/FlashQuestion";
import ContestQuiz, { QUESTIONS } from "@/components/ContestQuiz";
import DragDropChallenge from "@/components/DragDropChallenge";
import MatchingChallenge from "@/components/MatchingChallenge";
import ContestResults from "@/components/ContestResults";
import Turtle from "@/components/Turtle";

interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correct: boolean;
  points: number;
}

type ContestStep =
  | "animation"
  | "flash"
  | "quiz"
  | "challenge1"
  | "challenge2"
  | "results";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getStepLabel(step: ContestStep): string | null {
  switch (step) {
    case "animation":
    case "flash":
      return "الخطوة 1 من 4";
    case "quiz":
      return "الخطوة 2 من 4";
    case "challenge1":
      return "الخطوة 3 من 4";
    case "challenge2":
      return "الخطوة 4 من 4";
    case "results":
      return null;
  }
}

const TIMER_STEPS: ContestStep[] = ["quiz", "challenge1", "challenge2"];

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
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
  const contestId = params.id as string;

  const [step, setStep] = useState<ContestStep>("animation");

  const [globalTimer, setGlobalTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [quizScore, setQuizScore] = useState(0);
  const [quizErrors, setQuizErrors] = useState(0);
  const [challenge1Score, setChallenge1Score] = useState(0);
  const [challenge1Errors, setChallenge1Errors] = useState(0);
  const [challenge2Score, setChallenge2Score] = useState(0);
  const [challenge2Errors, setChallenge2Errors] = useState(0);

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
          if (data.progress) {
            const p = data.progress;
            if (p.status === "completed") {
              setQuizScore(p.score);
              setQuizErrors(p.errors);
              setGlobalTimer(p.timeSpent);
              setStep("results");
              } else if (p.status === "in_progress") {
              setGlobalTimer(p.timeSpent || 0);
              const qAns = p.quizAnswers || {};
              let reconstructed: QuizAnswer[] = [];
              if (Array.isArray(qAns)) {
                 reconstructed = qAns;
              } else if (typeof qAns === 'object') {
                 Object.entries(qAns).forEach(([qIdx, ansIdx]) => {
                    const q = QUESTIONS[parseInt(qIdx, 10)];
                    if (q) {
                       const correct = (q.answer === ansIdx);
                       const pts = correct ? q.points : 0;
                       reconstructed.push({
                          questionIndex: parseInt(qIdx, 10),
                          selectedAnswer: ansIdx as number,
                          correct,
                          points: pts
                       });
                    }
                 });
                 reconstructed.sort((a, b) => a.questionIndex - b.questionIndex);
              }

              if (reconstructed.length > 0 && reconstructed.length < QUESTIONS.length) {
                 setInitialQuizAnswers(reconstructed);
                 setQuizScore(reconstructed.reduce((acc, ans) => acc + ans.points, 0));
                 setQuizErrors(reconstructed.reduce((acc, ans) => acc + (ans.correct ? 0 : 1), 0));
                 setStep("quiz");
                 setTimerActive(true);
              }
            }
          }
          setInitLoading(false);
        })
        .catch(() => setInitLoading(false));
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
        timeSpent: globalTimer,
      }),
    }).catch(console.error);
  }, [contestId, globalTimer]);

  const totalScore = quizScore + challenge1Score + challenge2Score;
  const totalErrors = quizErrors + challenge1Errors + challenge2Errors;
  const showTimer = TIMER_STEPS.includes(step);
  const stepLabel = getStepLabel(step);

  if (status === "loading" || initLoading) {
    return (
      <main className="min-h-screen bg-ocean-gradient flex items-center justify-center">
        <Turtle mood="thinking" size="lg" message="جاري التحضير... ⏳" />
      </main>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-success-50/30 flex flex-col">
      {step !== "results" && (
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-primary-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <motion.button
              onClick={() => router.push(`/contest/${contestId}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 text-primary-600 hover:text-primary font-bold text-sm transition-colors select-none"
            >
              <span className="text-base leading-none">→</span>
              <span>العودة</span>
            </motion.button>

            <div className="flex-shrink-0">
              <Image
                src="/images/ecoscience-text-logo.png"
                alt="InNOScEnce"
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
                    ✓ مكتمل
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {step === "animation" && (
            <motion.div
              key="animation"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeInOut" }}
              className="w-full"
            >
              <OpeningAnimation onComplete={() => setStep("flash")} />
            </motion.div>
          )}

          {step === "flash" && (
            <motion.div
              key="flash"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="w-full"
            >
              <FlashQuestion
                onComplete={() => {
                  setTimerActive(true);
                  setStep("quiz");
                }}
              />
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key="quiz"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="w-full"
            >
              <ContestQuiz
                timeSpent={globalTimer}
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
            <motion.div
              key="challenge1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="w-full"
            >
              <DragDropChallenge
                onComplete={(r) => {
                  setChallenge1Score(r.score);
                  setChallenge1Errors(r.errors);
                  setStep("challenge2");
                }}
              />
            </motion.div>
          )}

          {step === "challenge2" && (
            <motion.div
              key="challenge2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="w-full"
            >
              <MatchingChallenge
                onComplete={(r) => {
                  setChallenge2Score(r.score);
                  setChallenge2Errors(r.errors);
                  setTimerActive(false);
                  setStep("results");
                }}
              />
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <ContestResults
                totalScore={totalScore}
                timeSpent={globalTimer}
                totalErrors={totalErrors}
                contestId={contestId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
