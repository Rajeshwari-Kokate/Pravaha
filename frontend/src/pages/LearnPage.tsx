import { useState, useEffect, type FC } from 'react';
import { Check, HelpCircle, ShieldAlert, Search } from 'lucide-react';
import { LESSONS, GLOSSARY_ENTRIES } from '../data/floodSchoolData';
import { FloodSchoolStamps } from '../components/learn/FloodSchoolStamps';
import { LessonInteractive } from '../components/learn/LessonInteractive';

export const LearnPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary'>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [glossarySearch, setGlossarySearch] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pravaha-completed-lessons');
      if (stored) setCompletedLessons(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const markLessonComplete = (lid: number) => {
    if (!completedLessons.includes(lid)) {
      const updated = [...completedLessons, lid];
      setCompletedLessons(updated);
      localStorage.setItem('pravaha-completed-lessons', JSON.stringify(updated));
    }
  };

  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

  const filteredGlossary = GLOSSARY_ENTRIES.filter(
    e =>
      e.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      e.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      e.category.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">
          Educational Curriculum
        </span>
        <h1 className="text-3xl font-bold text-ink dark:text-cream mt-1 font-sans">
          Flood School & Engineering Glossary
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-muted-dark mt-1 leading-relaxed">
          Master physical drainage principles, hydraulic equations, and empirical screening caveats.
        </p>
      </div>

      {/* Completion Stamps Banner */}
      <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark shadow-tactile-sm">
        <FloodSchoolStamps
          completedIds={completedLessons}
          onSelectLesson={setSelectedLessonId}
          activeId={selectedLessonId}
        />
      </div>

      {/* Safety Advisory Banner */}
      <div className="p-4 rounded-xl border border-amber/40 bg-amber/10 text-ink dark:text-cream flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold uppercase tracking-wide font-mono text-[11px] text-amber">Active Advisory</p>
          <p className="leading-relaxed">
            PRAVAHA is an educational and screening platform. If flash flooding is occurring now, contact local emergency services immediately (112 or municipal disaster control).
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-light dark:border-border-dark text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('lessons')}
          className={`px-5 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'lessons'
              ? 'border-sage-700 text-sage-900 dark:border-sage-300 dark:text-cream'
              : 'border-transparent text-ink-muted hover:text-ink dark:text-muted-dark dark:hover:text-cream'
          }`}
        >
          Interactive Lessons (6)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('glossary')}
          className={`px-5 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'glossary'
              ? 'border-sage-700 text-sage-900 dark:border-sage-300 dark:text-cream'
              : 'border-transparent text-ink-muted hover:text-ink dark:text-muted-dark dark:hover:text-cream'
          }`}
        >
          Engineering Glossary ({GLOSSARY_ENTRIES.length})
        </button>
      </div>

      {/* Tab 1: Interactive Lessons */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted dark:text-muted-dark font-bold block mb-2">
              Curriculum Lessons
            </span>
            {LESSONS.map(lesson => {
              const isSelected = lesson.id === selectedLessonId;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-ink dark:border-border-dark bg-pink dark:bg-surface-dark text-ink dark:text-cream shadow-tactile-sm'
                      : 'border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark text-ink-muted dark:text-muted-dark hover:bg-cream dark:hover:bg-bg-dark'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-sage-700 dark:text-sage-300 block font-bold">
                      LESSON 0{lesson.id}
                    </span>
                    <span className="font-bold text-ink dark:text-cream block font-sans">{lesson.title}</span>
                    <span className="text-[11px] text-ink-muted dark:text-muted-dark line-clamp-1">{lesson.subtitle}</span>
                  </div>
                  {isDone ? (
                    <span className="px-1.5 py-0.5 rounded border border-sage-700 dark:border-sage-300 bg-sage-300 text-ink text-[10px] font-mono font-bold">
                      PASS
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-border-light dark:bg-border-dark shrink-0 mt-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Lesson Main View */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-tactile space-y-6">
              <div className="border-b border-border-light dark:border-border-dark pb-4">
                <span className="text-xs font-mono font-bold text-sage-700 dark:text-sage-300 uppercase">
                  Lesson 0{selectedLesson.id}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-ink dark:text-cream mt-1 font-sans">
                  {selectedLesson.title}
                </h2>
                <p className="text-xs font-mono text-ink-muted dark:text-muted-dark mt-0.5">{selectedLesson.subtitle}</p>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-muted-dark mt-3 leading-relaxed">
                  {selectedLesson.summary}
                </p>
              </div>

              {/* Interactive Widget */}
              <LessonInteractive lesson={selectedLesson} />

              {/* Self-Check Quiz */}
              <div className="space-y-4 pt-4 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2 text-ink dark:text-cream font-bold text-xs uppercase font-mono">
                  <HelpCircle className="w-4 h-4 text-sage-700 dark:text-sage-300" />
                  <span>Self-Check Verification ({selectedLesson.quiz.length} Questions)</span>
                </div>

                <div className="space-y-4">
                  {selectedLesson.quiz.map((q, qIdx) => {
                    const key = `${selectedLesson.id}-${qIdx}`;
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
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [key]: oIdx }))}
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
                          <div className={`p-2.5 rounded-md text-[11px] leading-relaxed border ${
                            isCorrect ? 'bg-sage-300/20 border-sage-500/40 text-ink dark:text-cream' : 'bg-critical/10 border-critical/30 text-critical dark:text-critical'
                          }`}>
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
                    onClick={() => markLessonComplete(selectedLesson.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sage-500 hover:bg-sage-700 text-ink hover:text-cream font-bold text-xs border-2 border-ink shadow-tactile-sm transition-all active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <span>Issue Completion Stamp</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Technical Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-ink-muted dark:text-muted-dark" />
            <input
              type="text"
              value={glossarySearch}
              onChange={e => setGlossarySearch(e.target.value)}
              placeholder="Search equations, definitions, keywords..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-ink dark:text-cream font-mono focus:outline-none focus:ring-2 focus:ring-sage-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((entry, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark shadow-tactile-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink dark:text-cream text-sm font-sans">
                    {entry.term}
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cream dark:bg-bg-dark text-sage-900 dark:text-sage-300 border border-border-light dark:border-border-dark">
                    {entry.category}
                  </span>
                </div>
                <p className="text-xs text-ink-muted dark:text-muted-dark leading-relaxed font-sans">
                  {entry.definition}
                </p>
                {entry.formula && (
                  <div className="p-2 rounded bg-cream dark:bg-bg-dark border border-border-light dark:border-border-dark font-mono text-[11px] text-water font-bold">
                    {entry.formula}
                  </div>
                )}
                <p className="text-[11px] text-ink-muted dark:text-muted-dark leading-relaxed font-mono">
                  Context: {entry.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
