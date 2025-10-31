'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImageUpload, ResultDisplay, ErrorDisplay, LoadingDisplay } from '@/components';
import { 
  UploadedImage, 
  GenerationState, 
  ColorizedResult, 
  ErrorState, 
  DownloadOptions 
} from '@/types';
import {
  callColorizeMangaAPI,
  convertApiResponseToResult,
  convertApiErrorToErrorState,
  downloadImage,
  generateFilename
} from '@/lib/utils';

export default function Home() {
  // Upload state
  const [mangaImage, setMangaImage] = useState<UploadedImage | null>(null);

  // Generation state management
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [colorizedResult, setColorizedResult] = useState<ColorizedResult | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [loadingStage, setLoadingStage] = useState<'preparing' | 'uploading' | 'processing' | 'generating' | 'finishing'>('preparing');

  // Handle image upload
  const handleMangaImageSelect = useCallback((image: UploadedImage | null) => {
    setMangaImage(image);
    // Reset state when changing images
    if (generationState !== 'idle') {
      setGenerationState('idle');
      setColorizedResult(null);
      setError(null);
    }
  }, [generationState]);

  // Validation
  const canColorize = mangaImage && generationState !== 'loading';

  // Handle AI manga colorization
  const handleColorizeManga = useCallback(async () => {
    if (!mangaImage) {
      setError({
        message: 'Please upload a manga image before colorizing.',
        code: 'VALIDATION_ERROR',
        status: 400,
        isRetryable: false,
        timestamp: new Date()
      });
      return;
    }

    try {
      // Reset previous states
      setError(null);
      setColorizedResult(null);
      setGenerationState('loading');
      setLoadingStage('preparing');

      // Simulate loading stages with delays for better UX
      setTimeout(() => setLoadingStage('uploading'), 1000);
      setTimeout(() => setLoadingStage('processing'), 2000);
      setTimeout(() => setLoadingStage('generating'), 8000);
      setTimeout(() => setLoadingStage('finishing'), 15000);

      // Call the API
      const response = await callColorizeMangaAPI(mangaImage);

      if (response.success) {
        // Success - convert to result format
        const result = convertApiResponseToResult(response, mangaImage);
        setColorizedResult(result);
        setGenerationState('success');
      } else {
        // Error - convert to error state
        const errorState = convertApiErrorToErrorState(response);
        setError(errorState);
        setGenerationState('error');
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Colorization error:', error);
      setError({
        message: 'An unexpected error occurred while colorizing your manga. Please try again.',
        code: 'UNEXPECTED_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error',
        isRetryable: true,
        timestamp: new Date()
      });
      setGenerationState('error');
    }
  }, [mangaImage]);

  // Handle download
  const handleDownload = useCallback(async (options: DownloadOptions) => {
    if (!colorizedResult) return;

    try {
      const imageUrl = colorizedResult.imageUrl || 
        `data:image/png;base64,${colorizedResult.imageBase64}`;
      
      const downloadOptions: DownloadOptions = {
        ...options,
        filename: options.filename || generateFilename('manga-colorized', options.format)
      };

      await downloadImage(imageUrl, downloadOptions);
    } catch (error) {
      console.error('Download error:', error);
      setError({
        message: 'Failed to download the image. Please try again.',
        code: 'DOWNLOAD_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown download error',
        isRetryable: true,
        timestamp: new Date()
      });
    }
  }, [colorizedResult]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    setGenerationState('idle');
    handleColorizeManga();
  }, [handleColorizeManga]);

  // Handle colorize another
  const handleColorizeAnother = useCallback(() => {
    setGenerationState('idle');
    setColorizedResult(null);
    setError(null);
    // Keep the uploaded image for convenience
  }, []);

  // Handle error dismissal
  const handleErrorDismiss = useCallback(() => {
    setError(null);
    setGenerationState('idle');
  }, []);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mangaImage?.previewUrl) {
        URL.revokeObjectURL(mangaImage.previewUrl);
      }
    };
  }, [mangaImage?.previewUrl]);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Manga Colorizer
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                  ✨ AI-Powered
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium">
                  🎨 Instant
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  🔒 Free
                </span>
              </div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Transform your black and white manga images into vibrant, colorful artwork using advanced AI technology.
              Upload a manga page and watch it come to life in stunning colors!
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Upload Section - Always visible for easy access */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
              <div className="max-w-2xl mx-auto">
                {/* Manga Image Upload */}
                <ImageUpload
                  label="Upload Manga Image"
                  onImageSelect={handleMangaImageSelect}
                  className="space-y-4"
                />
              </div>

              {/* Colorize Button */}
              {generationState === 'idle' && (
                <div className="text-center mt-8">
                  <button
                    type="button"
                    onClick={handleColorizeManga}
                    className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105"
                    disabled={!canColorize}
                    aria-describedby={!canColorize ? 'upload-instructions' : undefined}
                  >
                    <span className="flex items-center justify-center gap-2">
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
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      Colorize Manga
                    </span>
                  </button>
                  
                  {!canColorize && (
                    <p id="upload-instructions" className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Please upload a manga image to start colorizing
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {generationState === 'loading' && (
              <LoadingDisplay
                stage={loadingStage}
                estimatedTime={45}
                onCancel={() => {
                  setGenerationState('idle');
                  setError(null);
                }}
                showCancel={true}
                className="max-w-2xl mx-auto"
              />
            )}

            {/* Error State */}
            {generationState === 'error' && error && (
              <ErrorDisplay
                error={error}
                onRetry={error.isRetryable ? handleRetry : undefined}
                onDismiss={handleErrorDismiss}
                dismissible={true}
                showDetails={true}
                className="max-w-2xl mx-auto"
              />
            )}

            {/* Success State - Result Display */}
            {generationState === 'success' && colorizedResult && (
              <ResultDisplay
                result={colorizedResult}
                onDownload={handleDownload}
                onColorizeAnother={handleColorizeAnother}
                className="max-w-4xl mx-auto"
              />
            )}
          </div>

          {/* Footer Information */}
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">1. Upload Image</h3>
                  <p>Upload a black and white manga panel or page in JPG, PNG, or WebP format.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">2. AI Colorization</h3>
                  <p>Our advanced AI analyzes the manga and applies natural, vibrant colors automatically.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">3. Download & Share</h3>
                  <p>Download your colorized manga in high quality or share it with friends instantly.</p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  💡 Pro Tips for Best Results
                </h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left max-w-2xl mx-auto">
                  <li>• Use high-resolution images for better color detail</li>
                  <li>• Clear line art produces more accurate colorization</li>
                  <li>• The AI works best with standard manga art styles</li>
                  <li>• Processing takes 30-60 seconds depending on image complexity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}