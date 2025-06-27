import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = '',
  showValue = true,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 200;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {showValue && (
            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {value > 0 ? '+' : ''}{value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 slider"
        />
        <style>{`
          .slider {
            background: linear-gradient(to right, 
              #3b82f6 0%, 
              #3b82f6 ${percentage}%, 
              #e5e7eb ${percentage}%, 
              #e5e7eb 100%
            );
          }
          .dark .slider {
            background: linear-gradient(to right, 
              #3b82f6 0%, 
              #3b82f6 ${percentage}%, 
              #374151 ${percentage}%, 
              #374151 100%
            );
          }
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
          }
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          }
          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
          }
          .slider::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Slider;
