import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  existingText?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptChange, existingText = '' }) => {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [fullText, setFullText] = useState(existingText);

  useEffect(() => {
    if (transcript) {
      const newText = existingText + ' ' + transcript;
      setFullText(newText);
      onTranscriptChange(newText);
    }
  }, [transcript, existingText, onTranscriptChange]);

  const handleStartStop = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReset = () => {
    resetTranscript();
    setFullText(existingText);
    onTranscriptChange(existingText);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          Votre navigateur ne supporte pas la reconnaissance vocale. 
          Veuillez utiliser Chrome, Edge ou Safari pour cette fonctionnalité.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Dictaphone</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartStop}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isListening ? (
              <>
                <Square className="h-4 w-4" />
                <span>Arrêter</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>Démarrer</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Effacer
          </button>
        </div>
      </div>

      {isListening && (
        <div className="flex items-center space-x-3 text-red-600">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Écoute en cours...</span>
        </div>
      )}

      {transcript && (
        <div className="bg-white border border-gray-300 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-2">Transcription en cours :</p>
          <p className="text-gray-900">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;