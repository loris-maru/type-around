"use client";

import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ) {
    console.error(
      "ErrorBoundary caught an error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="max-w-2xl rounded-lg border border-red-300 bg-red-50 p-6">
            <h2 className="mb-4 font-bold text-2xl text-red-800">
              Something went wrong
            </h2>
            <div className="mb-4">
              <p className="font-medium text-red-700">
                Error:
              </p>
              <pre className="mt-2 overflow-auto rounded bg-red-100 p-3 font-mono text-sm text-red-900">
                {this.state.error?.message}
              </pre>
            </div>
            {this.state.error?.stack && (
              <div>
                <p className="font-medium text-red-700">
                  Stack trace:
                </p>
                <pre className="mt-2 max-h-64 overflow-auto rounded bg-red-100 p-3 font-mono text-xs text-red-900">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
            <button
              onClick={() =>
                this.setState({
                  hasError: false,
                  error: null,
                })
              }
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
