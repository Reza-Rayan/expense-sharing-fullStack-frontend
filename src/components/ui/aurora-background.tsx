export function AuroraBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
            <div className="aurora-orb absolute -top-40 -end-40 size-[28rem] rounded-full bg-fuchsia-600/40 blur-3xl"/>
            <div
                className="aurora-orb absolute top-1/3 -start-40 size-[26rem] rounded-full bg-cyan-500/30 blur-3xl"
                style={{animationDelay: '-6s'}}
            />
            <div
                className="aurora-orb absolute -bottom-40 end-1/4 size-[30rem] rounded-full bg-violet-600/40 blur-3xl"
                style={{animationDelay: '-12s'}}
            />
        </div>
    );
}