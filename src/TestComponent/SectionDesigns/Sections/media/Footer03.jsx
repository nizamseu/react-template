import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#f3eee5] p-7 text-[#28221e] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <p className="font-serif text-3xl">MARGIN</p>
                    <p className="mt-3 text-sm text-gray-600">
                        A publication for people who keep asking why.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#about">About us</a>
                    <a href="#writers">Writers</a>
                    <a href="#pitch">Pitch a story</a>
                    <a href="#membership">Membership</a>
                </div>
                <div className="text-sm">
                    <p>Independent since 2018</p>
                    <a
                        href="#instagram"
                        className="mt-3 inline-flex items-center gap-1 text-[#a84f34]"
                    >
                        Follow the margin <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#d7cec0] pt-4 text-xs text-gray-500">
                © Margin Journal · Terms · Privacy · Accessibility
            </p>
        </footer>
    )
}
