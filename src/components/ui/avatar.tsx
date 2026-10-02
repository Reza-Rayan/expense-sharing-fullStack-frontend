const PALETTE: ReadonlyArray<readonly [string, string]> = [
    ['#e879f9', '#8b5cf6'],
    ['#22d3ee', '#3b82f6'],
    ['#fbbf24', '#f43f5e'],
    ['#34d399', '#14b8a6'],
    ['#f472b6', '#fb923c'],
    ['#818cf8', '#a855f7'],
];

const SIZES = {
    sm: 'size-8 text-sm',
    md: 'size-11 text-lg',
} as const;

function hashName(name: string): number {
    let hash = 0;
    for (const char of name) {
        hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
    }
    return hash;
}

interface AvatarProps {
    name: string;
    size?: keyof typeof SIZES;
    className?: string;
}

export function Avatar({name, size = 'md', className = ''}: AvatarProps) {
    const [from, to] = PALETTE[hashName(name) % PALETTE.length];
    const initial = Array.from(name.trim())[0] ?? '?';

    return (
        <span
            aria-hidden="true"
            className={`inline-grid shrink-0 place-items-center rounded-full font-bold text-white shadow-lg ${SIZES[size]} ${className}`}
            style={{backgroundImage: `linear-gradient(135deg, ${from}, ${to})`}}
        >
      {initial}
    </span>
    );
}