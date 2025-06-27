import React from 'react';
import { Music } from 'lucide-react';
import Slider from './Slider';

interface EqualizerProps {
  values: { [key: string]: number };
  onValueChange: (frequency: string, value: number) => void;
}

const frequencies = [
  { key: '250', label: '250Hz' },
  { key: '500', label: '500Hz' },
  { key: '1000', label: '1kHz' },
  { key: '2000', label: '2kHz' },
  { key: '4000', label: '4kHz' },
  { key: '8000', label: '8kHz' },
];

const Equalizer: React.FC<EqualizerProps> = ({ values, onValueChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="flex items-center mb-6">
        <Music className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Equalizer
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {frequencies.map((freq) => (
          <div key={freq.key} className="text-center">
            <Slider
              value={values[freq.key] || 0}
              onChange={(value) => onValueChange(freq.key, value)}
              min={-12}
              max={12}
              step={1}
              label={freq.label}
              unit="dB"
              showValue={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equalizer;