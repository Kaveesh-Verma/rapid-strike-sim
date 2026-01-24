import { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion, calculateQuizScore } from "@/lib/quizData";
import { shuffleAllQuestions, ShuffledQuizQuestion, getOptionLabel } from "@/lib/quizUtils";
import { useLanguage } from "@/hooks/useLanguage";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  moduleTitle: string;
  onComplete: (passed: boolean, score: number) => void;
}

const QuizModal = ({ open, onClose, questions, moduleTitle, onComplete }: QuizModalProps) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);

  // Shuffle questions when quiz opens - memoize to prevent re-shuffle on re-renders
  const shuffledQuestions = useMemo<ShuffledQuizQuestion[]>(() => {
    return shuffleAllQuestions(questions);
  }, [questions]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setShowFeedback(false);
      setQuizComplete(false);
      setResult(null);
    }
  }, [open]);

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  const handleSelectOption = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedOption!];
    setAnswers(newAnswers);
    setShowFeedback(false);
    setSelectedOption(null);

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz complete - calculate score using shuffled questions
      const correctCount = newAnswers.reduce((acc, answer, idx) => {
        return acc + (answer === shuffledQuestions[idx].correctOptionIndex ? 1 : 0);
      }, 0);
      const percentage = Math.round((correctCount / shuffledQuestions.length) * 100);
      const quizResult = {
        score: correctCount,
        percentage,
        passed: percentage >= 70,
      };
      setResult(quizResult);
      setQuizComplete(true);
      onComplete(quizResult.passed, quizResult.score);
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setQuizComplete(false);
    setResult(null);
    onClose();
  };

  const isCorrect = selectedOption === currentQuestion?.correctOptionIndex;

  if (!currentQuestion && !quizComplete) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-cyber-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyber-green font-mono flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {t.training.quiz}: {moduleTitle}
          </DialogTitle>
        </DialogHeader>

        {!quizComplete ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-400">
                  {t.training.questionOf
                    .replace('{current}', String(currentIndex + 1))
                    .replace('{total}', String(shuffledQuestions.length))}
                </span>
                <span className="text-cyber-green">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-800" />
            </div>

            {/* Question */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-200 font-mono text-lg">{currentQuestion?.question}</p>
            </div>

            {/* Options - with randomized order and A/B/C/D labels */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                let optionStyles = "bg-gray-900/30 border-gray-700 hover:border-cyber-green/50";
                
                if (showFeedback) {
                  if (index === currentQuestion.correctOptionIndex) {
                    optionStyles = "bg-green-500/20 border-green-500";
                  } else if (index === selectedOption && !isCorrect) {
                    optionStyles = "bg-red-500/20 border-red-500";
                  }
                } else if (selectedOption === index) {
                  optionStyles = "bg-cyber-green/20 border-cyber-green";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border transition-all font-mono ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm text-gray-400">
                        {getOptionLabel(index)}
                      </span>
                      <span className="text-gray-200">{option}</span>
                      {showFeedback && index === currentQuestion.correctOptionIndex && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      )}
                      {showFeedback && index === selectedOption && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-mono font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? t.scenarios.correct : t.scenarios.incorrect}
                  </span>
                </div>
                <p className="text-gray-300 text-sm font-mono">{currentQuestion?.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="bg-cyber-green hover:bg-cyber-green/80 text-black font-mono"
                >
                  {t.common.submit}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-cyber-green hover:bg-cyber-green/80 text-black font-mono gap-2"
                >
                  {currentIndex < shuffledQuestions.length - 1 ? t.common.next : t.training.continueBtn}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Complete */
          <div className="text-center py-8 space-y-6">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              result?.passed ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'
            }`}>
              {result?.passed ? (
                <CheckCircle className="w-10 h-10 text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-400" />
              )}
            </div>

            <div>
              <h3 className={`text-2xl font-bold font-mono ${result?.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result?.passed ? t.training.quizPassed : t.training.quizFailed}
              </h3>
              <p className="text-gray-400 font-mono mt-2">
                {t.training.yourAnswer}: {result?.score} / {shuffledQuestions.length} ({result?.percentage}%)
              </p>
              <p className="text-gray-500 text-sm font-mono mt-1">
                {result?.passed ? t.training.moduleComplete : t.training.tryAgain}
              </p>
            </div>

            <Button
              onClick={handleClose}
              className={`${result?.passed ? 'bg-cyber-green hover:bg-cyber-green/80' : 'bg-gray-700 hover:bg-gray-600'} text-black font-mono`}
            >
              {t.training.continueBtn}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
