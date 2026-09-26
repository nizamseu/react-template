import { HiArrowRight, HiChatAlt2 } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="rounded-lg border border-[#e7d4c8] bg-white p-5 text-[#27201d]">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a34c38]">
                TODAY&apos;S QUESTION
            </p>
            <h3 className="mt-3 text-xl font-bold">
                What tiny thing made your week better?
            </h3>
            <div className="mt-5 flex items-center justify-between border-t border-[#eee4de] pt-4">
                <span className="flex items-center gap-2 text-xs text-gray-500">
                    <HiChatAlt2 /> 48 kind answers
                </span>
                <a
                    href="#discussion"
                    aria-label="Join this conversation"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffccad]"
                >
                    <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
