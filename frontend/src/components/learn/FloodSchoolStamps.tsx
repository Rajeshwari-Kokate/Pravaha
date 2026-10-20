import { type FC } from 'react';
import { Check, Award } from 'lucide-react';
import { LESSONS } from '../../data/floodSchoolData';

interface FloodSchoolStampsProps {
  completedIds: number[];
  onSelectLesson: (id: number) => void;
  activeId: number;
}

export const FloodSchoolStamps: FC<FloodSchoolStampsProps> = ({
  completedIds,
  onSelectLesson,
  activeId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-sage-700 dark:text-sage-300" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink dark:text-cream">
            Curriculum Completion Stamps
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-ink/20 dark:border-border-dark bg-cream dark:bg-surface-dark text-ink-muted dark:text-muted-dark">
          {completedIds.length} of {LESSONS.length} Verified
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {LESSONS.map(lesson => {
          const isDone = completedIds.includes(lesson.id);
          const isActive = lesson.id === activeId;

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onSelectLesson(lesson.id)}
              className={`text-left p-2.5 rounded-sm border-2 transition-all flex flex-col justify-between h-24 ${
                isDone
                  ? 'border-sage-500 bg-sage-300/25 dark:bg-sage-500/15 text-ink dark:text-cream'
                  : 'border-dashed border-ink/25 dark:border-border-dark bg-surface dark:bg-surface-dark text-ink-muted dark:text-muted-dark opacity-80'
              } ${isActive ? 'ring-2 ring-sage-700 dark:ring-sage-300 shadow-tactile-sm' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  0{lesson.id}
                </span>
                {isDone ? (
                  <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded border border-sage-700 dark:border-sage-300 bg-sage-300 text-ink text-[9px] font-mono font-bold uppercase">
                    <Check className="w-2.5 h-2.5" /> STAMP
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-ink-muted dark:text-muted-dark">
                    OPEN
                  </span>
                )}
              </div>

              <div className="mt-1">
                <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                  {lesson.title}
                </span>
              </div>

              <div className="text-[9px] font-mono text-ink-muted dark:text-muted-dark truncate mt-auto pt-1 border-t border-ink/10 dark:border-border-dark">
                {isDone ? 'COMPLETED' : 'INCOMPLETE'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
