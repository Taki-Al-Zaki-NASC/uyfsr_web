import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[UYFSR SYSTEM EXCEPTION]', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100svh] bg-[#f7f7f5] text-[#111111] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-full max-w-lg bg-white border border-[#ecece9] p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="inline-block px-2.5 py-0.5 bg-[#ecece9] text-[11px] font-mono uppercase tracking-wider text-[#555552] mb-3">
              Application Runtime Safe Mode
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#111111] mb-2">
              An Unexpected Application Error Occurred
            </h1>

            <p className="text-xs sm:text-sm text-[#555552] leading-relaxed mb-6">
              A temporary interface exception occurred in this browser session. The application state has been safely isolated.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-[#f7f7f5] border border-[#ecece9] text-left text-xs font-mono text-[#883333] overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-[#0c7866] hover:bg-[#095f51] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleHome}
                className="px-5 py-2.5 bg-[#ecece9] hover:bg-[#deded9] text-[#111111] text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#888884]">
            United Youth Forum of Science and Research · Central Secretariat
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
