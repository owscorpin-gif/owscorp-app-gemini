import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // In a real application, you would log this to an error reporting service
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-white max-w-lg mx-auto my-20 rounded-lg shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
          <p className="text-gray-700 mb-6">We're sorry for the inconvenience. Our team has been notified of this issue.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-900 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
