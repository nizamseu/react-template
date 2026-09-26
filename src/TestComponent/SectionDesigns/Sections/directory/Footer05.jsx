import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="rounded-lg border border-[#d4ddd1] bg-white p-7 text-[#1a2826]">
            <div className="grid gap-7 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                        A useful local note
                    </p>
                    <h2 className="mt-2 text-3xl font-black">
                        Find the new place everyone is talking about.
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Neighborhood openings, community picks, and practical
                        local guides.
                    </p>
                </div>
                <nav className="grid grid-cols-2 gap-3 self-end text-xs">
                    <a href="#nearby">Nearby</a>
                    <a href="#guides">
                        Local guides <HiArrowRight className="inline" />
                    </a>
                    <a href="#events">Events</a>
                    <a href="#suggest">Suggest a listing</a>
                </nav>
            </div>
            <p className="mt-8 border-t border-[#e8ede7] pt-4 text-xs text-gray-500">
                © Good Neighbor Index 2026.
            </p>
        </footer>
    )
}
