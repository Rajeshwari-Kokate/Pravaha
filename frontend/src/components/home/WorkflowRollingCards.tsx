import { type FC } from 'react';
import { Sliders, MapPin, GitBranch, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkflowItem {
  icon: typeof Sliders;
  title: string;
  sentence: string;
  link: string;
  actionText: string;
  tag: string;
}

const WORKFLOW_ITEMS: WorkflowItem[] = [
  {
    icon: Sliders,
    title: 'Analyse scenarios',
    sentence: 'Simulate rainfall and drainage conditions for your area of interest.',
    link: '/scenarios',
    actionText: 'Open scenario lab',
    tag: 'Step 1',
  },
  {
    icon: MapPin,
    title: 'Identify risk areas',
    sentence: 'Locate potential accumulation hotspots and affected infrastructure.',
    link: '/workspace',
    actionText: 'Inspect risk map',
    tag: 'Step 2',
  },
  {
    icon: GitBranch,
    title: 'Plan informed actions',
    sentence: 'Compare interventions and understand their potential impact.',
    link: '/bottleneck',
    actionText: 'View bottleneck priorities',
    tag: 'Step 3',
  },
];

export const WorkflowRollingCards: FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F6B52] dark:text-[#B8CFB3]">
          Investigation Workflow
        </span>
        <span className="text-xs text-[#55655B] dark:text-[#B9C7BD]">
          Three-phase engineering screening
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {WORKFLOW_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-white dark:bg-[#25312A] shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#24302A] dark:hover:shadow-[4px_4px_0px_#0E1410] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl border border-[#24302A] bg-[#FEFAF3] dark:bg-[#1C2620] text-[#24302A] dark:text-[#FEFAF3] shadow-[1px_1px_0px_#24302A]">
                    <Icon className="w-5 h-5 text-[#4F6B52] dark:text-[#B8CFB3]" />
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-[4px] border border-[#24302A] bg-[#F6E2E9] text-[#24302A]">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-heading text-[#24302A] dark:text-[#FEFAF3]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#55655B] dark:text-[#B9C7BD] leading-relaxed">
                    {item.sentence}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24302A] dark:text-[#FEFAF3] hover:text-[#4F6B52] dark:hover:text-[#B8CFB3] hover:underline transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
