import { type ChangeEvent, type FC } from 'react';

export interface SliderTick {
  value: number;
  label: string;
}

export interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  ticks?: SliderTick[];
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const Slider: FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  ticks,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`w-full space-y-2 select-none ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-[#24302A] dark:text-[#FEFAF3]">
            {label}
          </label>
        )}
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-[4px] bg-[#FEFAF3] dark:bg-[#1C2620] border border-[#24302A] text-[#24302A] dark:text-[#FEFAF3] shadow-[1px_1px_0px_#24302A]">
          {value} {unit}
        </span>
      </div>

      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          aria-label={label || 'Slider control'}
          className="w-full h-2.5 bg-[#B8CFB3] dark:bg-[#3A4A40] border border-[#24302A] dark:border-[#3A4A40] rounded-md appearance-none cursor-pointer accent-[#2F4A38] dark:accent-[#84A282] focus:outline-none focus:ring-2 focus:ring-[#4F6B52]"
        />
        {ticks && ticks.length > 0 && (
          <div className="flex justify-between items-center mt-1 px-1">
            {ticks.map(tick => (
              <button
                key={tick.value}
                type="button"
                onClick={() => !disabled && onChange(tick.value)}
                className={`text-[10px] font-mono transition-colors cursor-pointer ${
                  value === tick.value
                    ? 'font-bold text-[#24302A] dark:text-[#FEFAF3]'
                    : 'text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A]'
                }`}
              >
                {tick.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
