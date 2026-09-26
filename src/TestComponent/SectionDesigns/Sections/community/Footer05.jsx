import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="rounded-lg border border-[#e7d4c8] bg-white p-7 text-[#27201d]">
            <div className="mx-auto max-w-xl text-center">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a34c38]">
                    The community calendar
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Save a seat for something good.
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Monthly meetups, new groups, and member-made things.
                </p>
                <a
                    href="#calendar"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#27201d] px-5 py-3 text-sm text-white"
                >
                    See upcoming events <HiArrowRight />
                </a>
            </div>
            <p className="mt-8 border-t border-[#eee4de] pt-4 text-center text-xs text-gray-500">
                © Commonroom · Made for people, not feeds.
            </p>
        </footer>
    )
}
