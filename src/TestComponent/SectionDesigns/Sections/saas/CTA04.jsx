import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#137d62] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                START SMALL / SCALE WHEN READY
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
                The clearest next step is a free workspace.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/75">
                No card needed. Invite your team whenever it feels right.
            </p>
            <a
                href="#create"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-[#137d62]"
            >
                Create your workspace <HiArrowRight />
            </a>
        </section>
    )
}
