import { HiArrowRight } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="rounded-lg bg-[#d9e5ff] p-6 text-[#111a22]">
            <p className="text-xs font-bold uppercase tracking-[.14em]">
                INTEGRATION SPOTLIGHT
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
                Your tools already know each other.
            </h3>
            <p className="mt-2 text-sm text-gray-600">
                Connect Slack, GitHub, and the apps your team uses every day.
            </p>
            <div className="mt-6 flex -space-x-2">
                {['#65e6b4', '#ffcc75', '#b9a5ff', '#ff9978'].map((color) => (
                    <span
                        key={color}
                        className="h-9 w-9 rounded-full border-2 border-[#d9e5ff]"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            <a
                href="#integrations"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            >
                Explore integrations <HiArrowRight />
            </a>
        </article>
    )
}
