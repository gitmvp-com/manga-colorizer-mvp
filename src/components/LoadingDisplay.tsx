'use client';

import { useEffect, useState } from 'react';

interface LoadingDisplayProps {
  progress?: number; // 0-100
  stage?: 'preparing' | 'uploading' | 'processing' | 'generating' | 'finishing';
  estimatedTime?: number; // in seconds
  onCancel?: () => void;
  customMessage?: string;
  showCancel?: boolean;
  className?: string;
const STAGE_MESSAGES = {
  preparing: 'Preparing manga image for AI colorization...',
  uploading: 'Uploading image to the AI service...',
  processing: 'AI is analyzing your manga artwork...',
  generating: 'Creating vibrant colors for your manga...',
  finishing: 'Finalizing your colorized manga...'
};
  finishing: 'Finalizing your generated image...'
const STAGE_DESCRIPTIONS = {
  preparing: 'Validating and optimizing your manga image',
  uploading: 'Securely transmitting image to our AI servers',
  processing: 'Advanced AI algorithms are analyzing your manga artwork',
  generating: 'Applying vibrant colors and artistic enhancement',
  finishing: 'Adding final touches and preparing the colorized result'
};
  finishing: 'Adding final touches and preparing the result'
};

export function LoadingDisplay({
  progress = 0,
  stage = 'processing',
  estimatedTime,
  onCancel,
  customMessage,
  showCancel = true,
  className = ''
}: LoadingDisplayProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(dotsTimer);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getRemainingTime = () => {
    if (!estimatedTime) return null;
    const remaining = Math.max(0, estimatedTime - elapsedTime);
    return remaining;
  };

  const getProgressPercentage = () => {
    if (progress > 0) return progress;
    
    // Estimate progress based on stage
    switch (stage) {
      case 'preparing':
        return 10;
      case 'uploading':
        return 25;
      case 'processing':
        return 50;
      case 'generating':
        return 80;
      case 'finishing':
        return 95;
      default:
        return 0;
    }
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Colorizing Your Manga
        </h2>
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative mx-auto w-16 h-16 mb-4">
          {/* Spinning outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
          
          {/* Pulsing inner circle */}
          <div className="absolute inset-2 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Generating Your AI Outfit
        </h2>
        
        <div className="text-lg text-blue-600 dark:text-blue-400 font-semibold" aria-live="polite">
          {customMessage || STAGE_MESSAGES[stage]}{dots}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {STAGE_DESCRIPTIONS[stage]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="capitalize font-medium">{stage} Stage</span>
          <span>{getProgressPercentage()}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${getProgressPercentage()}%` }}
          >
            {/* Animated shine effect */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          💡 While you wait...
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• High-resolution manga images produce better colorization results</li>
          <li>• The AI analyzes line art, characters, and scene context for optimal colors</li>
          <li>• Processing typically takes 30-60 seconds</li>
          <li>• Your images are processed securely and not stored permanently</li>
        </ul>
          <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">Elapsed Time</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatTime(elapsedTime)}
          </div>
        </div>
        
        {estimatedTime && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">Est. Remaining</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {getRemainingTime() ? formatTime(getRemainingTime()!) : '0s'}
            </div>
          </div>
        )}
      </div>

      {/* Processing Stats */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="text-blue-800 dark:text-blue-200">
            <span className="font-medium">AI Model:</span> Gemini 2.5 Flash
          </div>
          <div className="flex items-center text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            Processing...
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          💡 While you wait...
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• High-quality images produce better results</li>
          <li>• The AI considers lighting, pose, and fabric texture</li>
          <li>• Processing typically takes 30-60 seconds</li>
          <li>• Your images are processed securely and not stored</li>
        </ul>
      </div>

      {/* Cancel Button */}
      {showCancel && onCancel && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel Generation
          </button>
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`AI outfit generation in progress. ${stage} stage. ${getProgressPercentage()}% complete. ${
          elapsedTime > 0 ? `Elapsed time: ${formatTime(elapsedTime)}.` : ''
        }`}
      </div>
    </div>
  );
}
