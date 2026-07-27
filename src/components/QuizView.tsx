import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  Sparkles,
  Trophy,
  Flame,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Quiz, QuizQuestion, UserProgress } from '../types';
import { QUIZZES_DATA } from '../data/quizzes';
import { recordQuizScore } from '../lib/storage';

interface QuizViewProps {
  userProgress: UserProgress;
  onProgressUpdate: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ userProgress, onProgressUpdate }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedQuiz && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedQuiz, isFinished, timeLeft]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setTimeLeft(quiz.timeLimitSeconds);
    setIsFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || !selectedQuiz) return;
    setIsSubmitted(true);
    setUserAnswers([...userAnswers, selectedOptionIndex]);
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (!selectedQuiz) return;
    setIsFinished(true);

    // Calculate score
    let score = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    const maxScore = selectedQuiz.questions.length;
    const timeTaken = selectedQuiz.timeLimitSeconds - timeLeft;

    recordQuizScore(
      selectedQuiz.id,
      score,
      maxScore,
      timeTaken,
      selectedQuiz.badgeToUnlock
    );

    onProgressUpdate();

    // Trigger confetti celebration if score is high
    if (score / maxScore >= 0.6) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback
      }
    }
  };

  // If no quiz selected, show list
  if (!selectedQuiz) {
    return (
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
              <span>Gamified Seerah Quiz Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Test your knowledge, earn XP, unlock scholar badges, and master historical milestones
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Leaderboard Rank: #3 Scholar</span>
          </div>
        </div>

        {/* Quiz Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUIZZES_DATA.map((quiz) => {
            const pastResult = userProgress.quizScores[quiz.id];

            return (
              <div
                key={quiz.id}
                className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      {quiz.era}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      quiz.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                      quiz.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    {quiz.title}
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{quiz.questions.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{quiz.timeLimitSeconds}s Limit</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{quiz.xpReward} XP</span>
                    </div>
                  </div>

                  {pastResult && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>Best Score: {pastResult.score}/{pastResult.maxScore}</span>
                      <span>{Math.round((pastResult.score / pastResult.maxScore) * 100)}% Accuracy</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>{pastResult ? 'Retake Quiz' : 'Start Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Simulation */}
        <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Community Seerah Leaderboard</span>
          </h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-extrabold text-amber-600">🥇 1</span>
                <span>Zayd Al-Ansari</span>
              </div>
              <span>1,250 XP • 7 Badges</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-extrabold text-slate-400">🥈 2</span>
                <span>Sumayyah M.</span>
              </div>
              <span>980 XP • 5 Badges</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-extrabold text-emerald-600">🥉 3</span>
                <span>You (Active Scholar)</span>
              </div>
              <span>{userProgress.xp} XP • {userProgress.unlockedBadgeIds.length} Badges</span>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Active Quiz View or Finished Result View
  const currentQ = selectedQuiz.questions[currentQuestionIndex];

  if (isFinished) {
    let correctCount = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) correctCount += 1;
    });

    const percent = Math.round((correctCount / selectedQuiz.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl font-extrabold shadow-sm">
            {percent >= 70 ? '🎉' : '📖'}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">
              Quiz Completed!
            </h1>
            <p className="text-xs text-slate-400">
              {selectedQuiz.title}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <p className="text-3xl font-extrabold text-amber-400">
              {correctCount} / {selectedQuiz.questions.length} Correct ({percent}%)
            </p>
            <p className="text-xs text-slate-300">
              Earned +{Math.round((correctCount / selectedQuiz.questions.length) * selectedQuiz.xpReward)} XP for your knowledge!
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleStartQuiz(selectedQuiz)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={() => setSelectedQuiz(null)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              Back to Quiz Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
          </span>
          <h2 className="text-sm font-bold text-white">
            {selectedQuiz.title}
          </h2>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{timeLeft}s remaining</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-6">
        <h1 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {currentQ.question}
        </h1>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let btnStyle = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10';

            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
              }
            } else if (isSelected) {
              btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between backdrop-blur-md ${btnStyle}`}
              >
                <span>{opt}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation Banner */}
        {isSubmitted && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md space-y-2">
            <h3 className="text-xs font-bold uppercase text-amber-400">
              Explanation & References
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.hadithReference && (
              <p className="text-[11px] font-bold text-amber-400 pt-1">
                — {currentQ.hadithReference}
              </p>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOptionIndex === null}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
            >
              <span>{currentQuestionIndex + 1 < selectedQuiz.questions.length ? 'Next Question' : 'Complete Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
