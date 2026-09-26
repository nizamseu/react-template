import { HiArrowRight } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="rounded-lg bg-[#17232b] p-5 text-white">
            <div className="flex items-start justify-between">
                <span className="text-xs text-white/50">
                    WEEKLY ACTIVE TEAMS
                </span>
                <HiArrowRight className="text-[#65e6b4]" />
            </div>
            <p className="mt-7 text-4xl font-semibold">8,492</p>
            <p className="mt-1 text-xs text-[#65e6b4]">
                +12.8%{' '}
                <span className="text-white/45">compared with last month</span>
            </p>
            <div className="mt-6 flex h-12 items-end gap-1">
                {[30, 44, 37, 60, 48, 70, 57, 84, 62, 100, 74, 90].map(
                    (height, index) => (
                        <span
                            key={index}
                            className="flex-1 rounded-t-sm bg-[#65e6b4]/70"
                            style={{ height: `${height}%` }}
                        />
                    ),
                )}
            </div>
        </article>
    )
}
