import { HiCheckCircle } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="rounded-lg border border-[#dbe5df] bg-[#f4f7f4] p-5 text-[#111a22]">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#137d62]">
                YOUR DATA, YOUR RULES
            </p>
            <h3 className="mt-3 text-xl font-semibold">
                Security that scales with your team.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600">
                {[
                    'SOC 2 Type II',
                    'Single sign-on',
                    'Granular permissions',
                ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                        <HiCheckCircle className="text-[#137d62]" />
                        {item}
                    </li>
                ))}
            </ul>
        </article>
    )
}
