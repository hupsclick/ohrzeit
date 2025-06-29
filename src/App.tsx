import React, { useState, useEffect } from 'react';
import { Play, Pause, Moon, Sun, FileText, Shield, Mic, MicOff, AlertCircle } from 'lucide-react';
import Button from './components/Button';
import VolumeControl from './components/VolumeControl';
import Equalizer from './components/Equalizer';
import Modal from './components/Modal';
import { useAudio } from './hooks/useAudio';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [equalizerValues, setEqualizerValues] = useState<{ [key: string]: number }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('equalizerValues');
      return saved ? JSON.parse(saved) : {
        '250': 0,
        '500': 6,
        '1000': 0,
        '2000': 6,
        '4000': 0,
        '8000': 6,
      };
    }
    return {
      '250': 0,
      '500': 6,
      '1000': 0,
      '2000': 6,
      '4000': 0,
      '8000': 6,
    };
  });

  const [showImpressum, setShowImpressum] = useState('false');
  const [showDatenschutz, setShowDatenschutz] = useState('false');

  const { isActive, volume, error, start, stop, setVolume, setEqualizerValue } = useAudio(equalizerValues);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('equalizerValues', JSON.stringify(equalizerValues));
  }, [equalizerValues]);

  const handleEqualizerChange = (frequency: string, value: number) => {
    setEqualizerValues(prev => ({ ...prev, [frequency]: value }));
    setEqualizerValue(frequency, value);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleToggleAudio = async () => {
    if (isActive) {
      stop();
    } else {
      await start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Ohrzeit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Professionelle Hörhilfe für besseres Verstehen
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Main Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8 transition-all duration-300">
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              onClick={handleToggleAudio}
              variant={isActive ? 'danger' : 'success'}
              size="lg"
              icon={isActive ? MicOff : Mic}
              className="min-w-[160px]"
              aria-label={isActive ? 'Hörhilfe stoppen' : 'Hörhilfe starten'}
            >
              {isActive ? 'Hörhilfe stoppen' : 'Hörhilfe starten'}
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              {isActive ? 'Aktiv - Mikrofon wird übertragen' : 'Inaktiv'}
            </div>
          </div>

          {/* Volume Control */}
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>

        {/* Equalizer */}
        <div className="mb-8">
          <Equalizer
            values={equalizerValues}
            onValueChange={handleEqualizerChange}
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Anleitung zur Verwendung
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
            <li>•❗Schließen Sie unbedingt Kopfhörer an Ihr Gerät an, um Rückkopplungen zu vermeiden</li>
            <li>• Klicken Sie auf "Hörhilfe starten" und erlauben Sie den Mikrofon-Zugriff</li>
            <li>• Passen Sie die Lautstärke nach Ihren Bedürfnissen an</li>
            <li>• Stellen Sie sicher, dass die Medienlautstärke Ihres Geräts (insbesondere auf Smartphones) auf Maximum eingestellt ist, um die bestmögliche Hörqualität zu erzielen</li>
            <li>• Nutzen Sie den Equalizer zur Feinabstimmung der Frequenzen</li>
            <li>• Die App überträgt alle Umgebungsgeräusche in Echtzeit zu Ihren Kopfhörern</li>
          </ul>
        </div>

        {/* Footer Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="secondary"
              icon={darkMode ? Sun : Moon}
              aria-label={darkMode ? 'Heller Modus' : 'Dunkler Modus'}
            >
              {darkMode ? 'Heller Modus' : 'Dunkler Modus'}
            </Button>
            
            <Button
              onClick={() => setShowImpressum(true)}
              variant="secondary"
              icon={FileText}
              aria-label="Impressum anzeigen"
            >
              Impressum
            </Button>
            
            <Button
              onClick={() => setShowDatenschutz(true)}
              variant="secondary"
              icon={Shield}
              aria-label="Datenschutzerklärung anzeigen"
            >
              Datenschutz
            </Button>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={showImpressum}
          onClose={() => setShowImpressum(false)}
          title="Impressum"
        >
          <div className="space-y-4">
            <p>Entwickelt für Menschen mit Hörproblemen</p>
            <p><strong>Angaben gemäß § 5 TMG:</strong></p>
            <p>
              Manfred Häcker<br />
              Feldstraße 6<br />
              17153 Stavenhagen<br />
              Deutschland
            </p>
            <p>
              <strong>Kontakt:</strong><br />
              E-Mail: regiemail@gmx.de
            </p>
            <p>
              <strong>Haftungsausschluss:</strong><br />
              Diese App ersetzt keine professionelle medizinische Beratung. 
              Bei anhaltenden Hörproblemen konsultieren Sie bitte einen HNO-Arzt.
            </p>
          </div>
        </Modal>

        <Modal
          isOpen={showDatenschutz}
          onClose={() => setShowDatenschutz(false)}
          title="Datenschutzerklärung"
        >
          <div className="space-y-4">
            <p><strong>1. Datenschutz auf einen Blick</strong></p>
            <p>
              Diese Hörhilfe-App verarbeitet Audio-Daten ausschließlich lokal auf Ihrem Gerät. 
              Es werden keine Daten gespeichert oder an externe Server übertragen.
            </p>
            <p><strong>2. Mikrofon-Zugriff</strong></p>
            <p>
              Die App benötigt Zugriff auf Ihr Mikrofon, um Umgebungsgeräusche zu erfassen 
              und in Echtzeit zu Ihren Kopfhörern zu übertragen. Diese Audio-Daten verlassen 
              niemals Ihr Gerät.
            </p>
            <p><strong>3. Lokale Speicherung</strong></p>
            <p>
              Nur Ihre Einstellungen (Lautstärke, Equal Equalizer, Dark Mode) werden lokal 
              in Ihrem Browser gespeichert.
            </p>
            <p><strong>4. Keine Cookies oder Tracking</strong></p>
            <p>
              Diese App verwendet keine Cookies oder Tracking-Technologien.
            </p>
            <p><strong>5. Medizinischer Hinweis</strong></p>
            <p>
              Diese App ist eine Hörhilfe und ersetzt keine professionelle medizinische 
              Behandlung. Bei anhaltenden Hörproblemen konsultieren Sie einen Facharzt.
            </p>
            <p>
              Diese App wird kostenlos zur Verfügung gestellt.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;