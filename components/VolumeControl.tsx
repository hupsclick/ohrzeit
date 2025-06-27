import React from 'react';
import { Volume2 } from 'lucide-react';
import Slider from './Slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Lautstärke
        </h3>
        <span className="ml-auto text-lg font-bold text-blue-600 dark:text-blue-400">
          {volume}%
        </span>
      </div>
      
      <Slider
        value={volume}
        onChange={onVolumeChange}
        min={0}
        max={100}
        unit="%"
        showValue={true}
        className="mt-2"
      />
    </div>
  );
};

export default VolumeControl;