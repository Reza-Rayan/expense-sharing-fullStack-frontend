interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-2xl bg-white/10 ${className}`}
        />
    );
}