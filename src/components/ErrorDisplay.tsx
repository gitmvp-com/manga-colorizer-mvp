'use client';

import { useState } from 'react';
import { ErrorState } from '@/types';

interface ErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  dismissible = true,
  showDetails = false,
  className = ''
}: ErrorDisplayProps) {
  const [showExpandedDetails, setShowExpandedDetails] = useState(false);

  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'INVALID_API_KEY':
      case 'INSUFFICIENT_CREDITS':
        return (
          <svg
            className="w-6 h-6 text-red-400"
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
        );
      case 'RATE_LIMIT_EXCEEDED':
        return (
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'MODEL_UNAVAILABLE':
        return (
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-red-400"
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
        );
    }
  };

  const getErrorCategory = (code: string) => {
    switch (code) {
      case 'INVALID_API_KEY':
      case 'INSUFFICIENT_CREDITS':
        return 'Configuration Error';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Rate Limit Error';
      case 'MODEL_UNAVAILABLE':
        return 'Service Error';
      case 'VALIDATION_ERROR':
        return 'Validation Error';
      case 'NETWORK_ERROR':
        return 'Network Error';
      default:
        return 'Processing Error';
    }
  };

  const getSuggestedActions = (code: string) => {
    switch (code) {
      case 'INVALID_API_KEY':
        return 'Please check your OpenRouter API key configuration.';
      case 'INSUFFICIENT_CREDITS':
        return 'Please add credits to your OpenRouter account.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Please wait a few minutes before trying again.';
      case 'MODEL_UNAVAILABLE':
        return 'The AI service is temporarily unavailable. Please try again later.';
      case 'NETWORK_ERROR':
        return 'Please check your internet connection and try again.';
      default:
        return 'Please try again. If the problem persists, contact support.';
    }
  };

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 ${className}`} role="alert">
      {/* Header */}
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon(error.code)}
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                {getErrorCategory(error.code)}
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error.message}
              </p>
            </div>
            
            {dismissible && onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
                aria-label="Dismiss error"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Suggested Actions */}
          <div className="mt-3">
            <p className="text-sm text-red-600 dark:text-red-400">
              <span className="font-medium">Suggestion:</span> {getSuggestedActions(error.code)}
            </p>
          </div>

          {/* Error Details - Expandable */}
          {showDetails && (
            <div className="mt-4">
              <button
                onClick={() => setShowExpandedDetails(!showExpandedDetails)}
                className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                aria-expanded={showExpandedDetails}
              >
                <svg
                  className={`w-4 h-4 mr-1 transition-transform ${
                    showExpandedDetails ? 'transform rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {showExpandedDetails ? 'Hide' : 'Show'} technical details
              </button>
              
              {showExpandedDetails && (
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800">
                  <dl className="text-sm space-y-2">
                    <div>
                      <dt className="font-medium text-red-800 dark:text-red-200">Error Code:</dt>
                      <dd className="text-red-700 dark:text-red-300 font-mono">{error.code}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-red-800 dark:text-red-200">Status Code:</dt>
                      <dd className="text-red-700 dark:text-red-300 font-mono">{error.status}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-red-800 dark:text-red-200">Timestamp:</dt>
                      <dd className="text-red-700 dark:text-red-300 font-mono">
                        {error.timestamp.toLocaleString()}
                      </dd>
                    </div>
                    {error.details && (
                      <div>
                        <dt className="font-medium text-red-800 dark:text-red-200">Details:</dt>
                        <dd className="text-red-700 dark:text-red-300 break-words">{error.details}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            {error.isRetryable && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
