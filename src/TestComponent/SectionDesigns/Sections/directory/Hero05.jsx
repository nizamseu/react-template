import { HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#edf1e6] text-[#1a2826] md:grid-cols-[.8fr_1.2fr]">
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                    START WITH YOUR STREET
                </p>
                <h2 className="mt-4 text-5xl font-black leading-[.92]">
                    The right place is closer than you think.
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    Search independent shops and services, filtered by what
                    matters to you.
                </p>
                <a
                    href="#location"
                    className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    <HiOutlineLocationMarker /> Use my location <HiArrowRight />
                </a>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
                {['Repair', 'Eat well', 'Get outside', 'Make things'].map(
                    (name, index) => (
                        <a
                            key={name}
                            href="#category"
                            className={`flex min-h-28 items-end rounded-lg p-4 text-sm font-bold ${index % 2 ? 'bg-[#d9f064]' : 'bg-[#c9d6c1]'}`}
                        >
                            {name}
                        </a>
                    ),
                )}
            </div>
        </section>
    )
}
