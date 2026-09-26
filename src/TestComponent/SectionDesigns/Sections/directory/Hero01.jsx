import {
    HiArrowRight,
    HiOutlineLocationMarker,
    HiOutlineSearch,
} from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#d9f064] text-[#1a2826]">
            <div className="grid min-h-[390px] md:grid-cols-[1fr_.8fr]">
                <div className="flex flex-col justify-between p-7 sm:p-11">
                    <p className="text-xs font-bold uppercase tracking-[.16em]">
                        GOOD NEIGHBOR / LOCAL INDEX
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-xl text-5xl font-black leading-[.92] sm:text-7xl">
                            Find good work nearby.
                        </h2>
                        <p className="mt-4 max-w-sm text-sm">
                            A useful directory of independent businesses and
                            people worth knowing.
                        </p>
                        <div className="mt-6 flex flex-col gap-2 rounded-lg bg-white p-2 sm:flex-row">
                            <label className="flex min-w-0 flex-1 items-center gap-2 px-3">
                                <HiOutlineSearch />
                                <input
                                    aria-label="Search services"
                                    placeholder="What do you need?"
                                    className="min-w-0 flex-1 py-2 text-sm outline-none"
                                />
                            </label>
                            <button className="flex items-center gap-2 border-l px-3 text-xs">
                                <HiOutlineLocationMarker /> Your area
                            </button>
                            <a
                                href="#search"
                                className="flex items-center justify-center gap-2 rounded-md bg-[#1a2826] px-4 py-3 text-sm text-white"
                            >
                                Search <HiArrowRight />
                            </a>
                        </div>
                    </div>
                    <p className="text-xs">
                        Verified listings · Local recommendations
                    </p>
                </div>
                <div className="relative hidden min-h-64 md:block">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85"
                        alt="Independent neighborhood shop"
                    />
                </div>
            </div>
        </section>
    )
}
