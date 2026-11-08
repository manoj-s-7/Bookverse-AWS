import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? (
      <div className="wrap py-24"><h1 className="font-display text-4xl">Something went wrong</h1><p className="mt-3 text-muted">Reload the page to continue. Your library is safe in this browser.</p><button className="btn-primary mt-6" onClick={() => location.assign("/")}>Reload BOOKVERSE</button></div>
    ) : this.props.children;
  }
}
