import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("🔥 UI Crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-600">
          <p className="text-lg font-semibold">⚠️ Something went wrong</p>
          <p className="text-sm opacity-70">
            Please refresh or try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
