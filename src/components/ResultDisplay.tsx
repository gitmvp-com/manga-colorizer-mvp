'use client';

import { useState } from 'react';
import { ColorizedResult, DownloadOptions } from '@/types';
import { formatProcessingTime } from '@/lib/utils';

interface ResultDisplayProps {
  result: ColorizedResult;
  onDownload: (options: DownloadOptions) => void;
  onColorizeAnother: () => void;
  className?: string;
}

export function ResultDisplay({
  result,
  onDownload,
  onColorizeAnother,
  className = ''
}: ResultDisplayProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const handleDownload = (format: 'png' | 'jpeg') => {
    const options: DownloadOptions = {
      format,
      filename: `colorized-manga-${Date.now()}`,
      quality: format === 'jpeg' ? 0.9 : undefined,
    };
    onDownload(options);
    setShowDownloadOptions(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share && result.imageUrl) {
        await navigator.share({
          title: 'Colorized Manga',
          text: result.description || 'Check out this AI-colorized manga!',
          url: result.imageUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(result.imageUrl);
        alert('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Colorized Manga Result
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Colorized on {result.colorizedAt.toLocaleDateString()} at{' '}
          {result.colorizedAt.toLocaleTimeString()}
        </p>
      </div>

      {/* Image Display */}
      <div className="relative bg-gray-50 dark:bg-gray-900">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-96 rounded-lg"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-lg font-medium">Failed to load image</p>
            <p className="text-sm">Please try colorizing again</p>
          </div>
        ) : (
          <img
            src={result.imageUrl || `data:image/png;base64,${result.imageBase64}`}
            alt={result.description || 'AI-colorized manga image'}
            className={`w-full max-w-3xl mx-auto h-auto max-h-[700px] object-contain transition-opacity duration-300 p-4 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>

      {/* Metadata */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        {result.description && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {result.description}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Processing Time:
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {formatProcessingTime(result.processingTime)}
            </span>
          </div>
          
          {result.metadata && (
            <>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  AI Model:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {result.metadata.modelUsed}
                </span>
              </div>
              
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Original Image:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {result.metadata.originalImage.imageName}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Download Button with Options */}
          <div className="relative flex-1">
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              aria-expanded={showDownloadOptions}
              aria-haspopup="menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download
            </button>
            
            {showDownloadOptions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10">
                <button
                  onClick={() => handleDownload('png')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl transition-colors text-gray-900 dark:text-white"
                >
                  Download as PNG (High Quality)
                </button>
                <button
                  onClick={() => handleDownload('jpeg')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl transition-colors border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  Download as JPEG (Smaller Size)
                </button>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Share
          </button>

          {/* Colorize Another Button */}
          <button
            onClick={onColorizeAnother}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Colorize Another
          </button>
        </div>
      </div>
    </div>
  );
}