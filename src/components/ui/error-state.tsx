import {RefreshCw, TriangleAlert} from 'lucide-react';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export function ErrorState({message, onRetry, isRetrying = false}: ErrorStateProps) {
    return (
        <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-6 py-10 text-center"
        >
            <TriangleAlert className="size-8 text-rose-300" aria-hidden="true"/>
            <p className="text-sm text-rose-100">{message}</p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium
                    text-white ring-1 ring-white/20 transition hover:bg-white/20 focus-visible:outline-2
                     focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 disabled:opacity-60"
                >
                    <RefreshCw
                        className={`size-4 ${isRetrying ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                    />
                    تلاش دوباره
                </button>
            )}
        </div>
    );
}