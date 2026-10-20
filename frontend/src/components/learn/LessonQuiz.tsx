import { type FC } from 'react';
import { HelpCircle, Check } from 'lucide-react';
import type { QuizQuestion } from '../../data/floodSchoolData';

interface LessonQuizProps {
  lessonId: number;
  quiz: QuizQuestion[];
  quizAnswers: Record<string, number>;
  onSelectAnswer: (key: string, optionIdx: number) => void;
  onCompleteLesson: (lessonId: number) => void;
}

export const LessonQuiz: FC<LessonQuizProps> = ({
  lessonId,
  quiz,
  quizAnswers,
  onSelectAnswer,
  onCompleteLesson,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-border-light dark:border-border-dark">
      <div className="flex items-center gap-2 text-ink dark:text-cream font-bold text-xs uppercase font-mono">
        <HelpCircle className="w-4 h-4 text-sage-700 dark:text-sage-300" />
        <span>Self-Check Verification ({quiz.length} Questions)</span>
      </div>

      <div className="space-y-4">
        {quiz.map((q, qIdx) => {
          const key = `${lessonId}-${qIdx}`;
          const selectedOpt = quizAnswers[key];
          const isAnswered = selectedOpt !== undefined;
          const isCorrect = selectedOpt === q.correctIndex;

          return (
            <div
              key={qIdx}
              className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark space-y-3 text-xs"
            >
              <p className="font-bold text-ink dark:text-cream font-sans">
                {qIdx + 1}. {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  const isChosen = selectedOpt === oIdx;
                  let btnCls = 'border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark text-ink dark:text-cream';
                  if (isAnswered) {
                    if (oIdx === q.correctIndex) {
                      btnCls = 'border-sage-700 dark:border-sage-300 bg-sage-300/40 text-ink dark:text-cream font-bold';
                    } else if (isChosen) {
                      btnCls = 'border-critical bg-critical/10 text-critical font-bold';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => onSelectAnswer(key, oIdx)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnCls}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && oIdx === q.correctIndex && (
                        <Check className="w-4 h-4 text-sage-700 dark:text-sage-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`p-2.5 rounded-md text-[11px] leading-relaxed border ${
                    isCorrect
                      ? 'bg-sage-300/20 border-sage-500/40 text-ink dark:text-cream'
                      : 'bg-critical/10 border-critical/30 text-critical dark:text-critical'
                  }`}
                >
                  <span className="font-bold">{isCorrect ? 'Correct. ' : 'Incorrect. '}</span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onCompleteLesson(lessonId)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sage-500 hover:bg-sage-700 text-ink hover:text-cream font-bold text-xs border-2 border-ink shadow-tactile-sm transition-all active:translate-x-[2px] active:translate-y-[2px]"
        >
          <span>Issue Completion Stamp</span>
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
