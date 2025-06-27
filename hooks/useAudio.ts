import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioReturn {
  isActive: boolean;
  volume: number;
  isInitialized: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (volume: number) => void;
  setEqualizerValue: (frequency: string, value: number) => void;
}

export const useAudio = (): UseAudioReturn => {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolumeState] = useState(75);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filtersRef = useRef<{ [key: string]: BiquadFilterNode }>({});
  const streamRef = useRef<MediaStream | null>(null);

  const initializeAudioContext = useCallback(async () => {
    try {
      setError(null);
      
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioContextRef.current.currentTime);
      
      // Initialize equalizer filters
      const frequencies = [
        { key: '250', freq: 250 },
        { key: '500', freq: 500 },
        { key: '1000', freq: 1000 },
        { key: '2000', freq: 2000 },
        { key: '4000', freq: 4000 },
        { key: '8000', freq: 8000 }
      ];
      
      frequencies.forEach(({ key, freq }) => {
        const filter = audioContextRef.current!.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
        filter.Q.setValueAtTime(1, audioContextRef.current!.currentTime);
        filter.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
        filtersRef.current[key] = filter;
      });
      
      // Chain the audio nodes: microphone -> filters -> gain -> destination
      let currentNode: AudioNode = gainNodeRef.current;
      
      // Connect filters in reverse order (last filter connects to gain node)
      const filterKeys = Object.keys(filtersRef.current).reverse();
      filterKeys.forEach((key) => {
        filtersRef.current[key].connect(currentNode);
        currentNode = filtersRef.current[key];
      });
      
      setIsInitialized(true);
    } catch (err) {
      console.error('Audio context initialization failed:', err);
      setError('Audio-System konnte nicht initialisiert werden');
    }
  }, [volume]);

  const start = useCallback(async () => {
    try {
      setError(null);
      
      if (!isInitialized) {
        await initializeAudioContext();
      }
      
      if (!audioContextRef.current) {
        throw new Error('Audio context not available');
      }
      
      // Request microphone access with high quality settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 2
        }
      });
      
      streamRef.current = stream;
      
      // Create microphone source
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      // Connect microphone to the filter chain
      const firstFilterKey = Object.keys(filtersRef.current)[0];
      if (firstFilterKey) {
        microphoneRef.current.connect(filtersRef.current[firstFilterKey]);
      } else {
        microphoneRef.current.connect(gainNodeRef.current!);
      }
      
      // Connect gain node to speakers/headphones
      gainNodeRef.current!.connect(audioContextRef.current.destination);
      
      setIsActive(true);
    } catch (err) {
      console.error('Failed to start audio:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Mikrofon-Zugriff wurde verweigert. Bitte erlauben Sie den Zugriff.');
        } else if (err.name === 'NotFoundError') {
          setError('Kein Mikrofon gefunden. Bitte schließen Sie ein Mikrofon an.');
        } else {
          setError('Audio konnte nicht gestartet werden: ' + err.message);
        }
      } else {
        setError('Unbekannter Fehler beim Starten des Audios');
      }
    }
  }, [isInitialized, initializeAudioContext]);

  const stop = useCallback(() => {
    try {
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
        microphoneRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      
      setIsActive(false);
      setError(null);
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (gainNodeRef.current && audioContextRef.current) {
      const gainBoostFactor = 2; // Maximalwert bei Lautstärkeregler 100 % ist 2.0
      const volumeValue = Math.max(0, Math.min(1, newVolume / 100)) * gainBoostFactor;
      gainNodeRef.current.gain.setValueAtTime(volumeValue, audioContextRef.current.currentTime);

    }
  }, []);

  const setEqualizerValue = useCallback((frequency: string, value: number) => {
    if (filtersRef.current[frequency] && audioContextRef.current) {
      const gainValue = Math.max(-12, Math.min(12, value));
      filtersRef.current[frequency].gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return {
    isActive,
    volume,
    isInitialized,
    error,
    start,
    stop,
    setVolume,
    setEqualizerValue,
  };
};