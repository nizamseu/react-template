import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#dce5dc] bg-white p-7 text-[#102d36] sm:p-9">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                        THE FIELDNOTE LETTER
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        One useful idea for your week.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        New classes, thoughtful mentors, and small sparks.
                    </p>
                </div>
                <a
                    href="#letter"
                    className="inline-flex items-center gap-2 rounded-md bg-[#102d36] px-5 py-3 text-sm text-white"
                >
                    Get the letter <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
