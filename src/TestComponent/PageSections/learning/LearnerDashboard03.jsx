// PopQuizLearnerDashboard

// LearnerDashboard03 · Learning Management Systems › Interactive Dashboard

// Description:
// A loud, playful live-quiz panel for the fictional quiz platform QuizNest. Under "Three
// questions. No pressure." a Biology 101 pop quiz walks the learner through three questions
// with four options each, instant "Correct!" / "Not quite" feedback, a running score and a
// "Next question" button, then a results screen with a recap and "Retry quiz". Use it inside
// a course page or learner dashboard as a quick knowledge check.

// Design:
// - Neo-brutalist: yellow #ffe066 section, pure black #000 3px borders, white cards and hard
//   offset shadows (shadow-[8px_8px_0_#000]); no other colours
// - Feedback stays in palette and never relies on colour alone: the right answer turns black
//   with yellow text and a check, a wrong pick gets a diagonal hatch, an X and line-through
// - Heavy sans type (font-black, tight tracking, uppercase eyebrows), letter badges A–D in
//   black squares, a three-segment progress track, rounded-[28px] cards
// - Question cards slide in from the right and out to the left, options press down 3px on
//   click (AnimatePresence + motion); transforms are removed for reduced motion
// - Responsive: options 1 → sm:2 columns; the black scoreboard sits under the quiz on
//   mobile and becomes a 300px right column on lg

// What it does:
// - State: index (current question), picked (chosen option or null), answers (per-question
//   result) and finished; score and the current correct-answer streak derive from answers
// - Picking an option locks the question (aria-disabled), shows feedback in an aria-live
//   region and enables Next; Next moves focus to the new question heading
// - After question 3, "See results" shows the score and a recap; "Retry quiz" resets all
//   state; "Back to lesson" links to #lesson-cell-structure

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PopQuizLearnerDashboard from '@/TestComponent/PageSections/learning/LearnerDashboard03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <PopQuizLearnerDashboard />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowPath, HiArrowRight, HiCheck, HiXMark } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const questions = [
    {
        id: 'q1',
        prompt: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Ribosome', 'Mitochondrion', 'Golgi apparatus', 'Nucleus'],
        answer: 1,
        why: 'Mitochondria make most of the cell’s ATP through cellular respiration.',
    },
    {
        id: 'q2',
        prompt: 'What is the cell membrane mainly made of?',
        options: ['A phospholipid bilayer', 'Cellulose fibres', 'Keratin', 'Chitin'],
        answer: 0,
        why: 'Two layers of phospholipids, studded with proteins, decide what gets in and out.',
    },
    {
        id: 'q3',
        prompt: 'Where does photosynthesis happen in a plant cell?',
        options: ['Central vacuole', 'Lysosome', 'Chloroplast', 'Cell wall'],
        answer: 2,
        why: 'Chloroplasts hold chlorophyll, which captures light energy to build glucose.',
    },
]

const letters = ['A', 'B', 'C', 'D']
const hatch = 'bg-[repeating-linear-gradient(135deg,#000_0_2px,transparent_2px_9px)]'

const verdicts = [
    'Warm-up done. Re-watch lesson 3.2 and try again.',
    'One down. The cell diagram in 3.2 will help.',
    'Nearly there. One more pass and it’s yours.',
    'Perfect score. You’ve earned the Cell Scholar badge.',
]

export function PopQuizLearnerDashboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [index, setIndex] = useState(0)
    const [picked, setPicked] = useState(null)
    const [answers, setAnswers] = useState([])
    const [finished, setFinished] = useState(false)
    const focusNext = useRef(false)

    const q = questions[index]
    const answered = picked !== null
    const score = answers.filter((a) => a.correct).length
    let streak = 0
    for (let i = answers.length - 1; i >= 0 && answers[i].correct; i--) streak++

    const choose = (optionIndex) => {
        if (answered || finished) return
        setPicked(optionIndex)
        setAnswers((prev) => [...prev, { id: q.id, picked: optionIndex, correct: optionIndex === q.answer }])
    }

    const next = () => {
        focusNext.current = true
        if (index === questions.length - 1) {
            setFinished(true)
            return
        }
        setIndex((i) => i + 1)
        setPicked(null)
    }

    const retry = () => {
        focusNext.current = true
        setIndex(0)
        setPicked(null)
        setAnswers([])
        setFinished(false)
    }

    const focusOnMount = (el) => {
        if (el && focusNext.current) {
            focusNext.current = false
            el.focus()
        }
    }

    const slide = reduce
        ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -40 },
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
          }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ffe066] px-4 py-16 text-base font-normal text-black antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em]">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                <path d="M3 13 Q12 22 21 13" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
                                <path d="M4 15 L20 15" stroke="#000" strokeWidth="1.6" strokeDasharray="2 2" />
                                <ellipse cx="12" cy="9.5" rx="4" ry="5" fill="#ffe066" stroke="#000" strokeWidth="2" />
                            </svg>
                            QuizNest · Biology 101 · Week 3
                        </p>
                        <h2 className="mt-5 max-w-2xl text-5xl font-black uppercase leading-[0.9] tracking-tight text-black sm:text-6xl lg:text-7xl">
                            Three questions. No pressure.
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm font-medium leading-relaxed text-black/75">
                        A two-minute check on cell structure before Thursday’s lab. Your score never
                        counts toward the final grade.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
                    <div className="overflow-hidden rounded-[28px] border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
                        <AnimatePresence mode="wait" initial={false}>
                            {!finished ? (
                                <motion.div key={q.id} className="p-5 sm:p-8" {...slide}>
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-xs font-black uppercase tracking-[0.18em]">
                                            Question {index + 1} / {questions.length}
                                        </p>
                                        <div className="flex flex-1 justify-end gap-1.5" aria-hidden="true">
                                            {questions.map((item, i) => (
                                                <span
                                                    key={item.id}
                                                    className={cn(
                                                        'h-3 w-full max-w-14 rounded-full border-2 border-black',
                                                        i < index || (i === index && answered) ? 'bg-black' : i === index ? 'bg-[#ffe066]' : 'bg-white',
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <h3
                                        ref={focusOnMount}
                                        tabIndex={-1}
                                        id="qn-question"
                                        className="mt-6 text-2xl font-black leading-tight tracking-tight text-black outline-none sm:text-3xl"
                                    >
                                        {q.prompt}
                                    </h3>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-labelledby="qn-question">
                                        {q.options.map((opt, i) => {
                                            const isAnswer = i === q.answer
                                            const isPicked = i === picked
                                            const showRight = answered && isAnswer
                                            const showWrong = answered && isPicked && !isAnswer
                                            return (
                                                <motion.button
                                                    key={opt}
                                                    type="button"
                                                    aria-pressed={isPicked}
                                                    aria-disabled={answered}
                                                    aria-describedby={answered ? 'qn-feedback' : undefined}
                                                    whileTap={answered || reduce ? undefined : { y: 3 }}
                                                    className={cn(
                                                        'relative flex min-h-16 items-center gap-3 rounded-2xl border-[3px] border-black px-3 py-3 text-left text-base font-bold transition-[box-shadow,opacity,translate] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black',
                                                        !answered && 'bg-white shadow-[4px_4px_0_#000] hover:-translate-y-0.5 hover:bg-[#fff7cc] hover:shadow-[6px_6px_0_#000] motion-reduce:hover:translate-y-0',
                                                        showRight && 'bg-black text-[#ffe066] shadow-[4px_4px_0_#000]',
                                                        showWrong && cn('bg-white', hatch),
                                                        answered && !isAnswer && !isPicked && 'bg-white opacity-45',
                                                        answered && 'cursor-default',
                                                    )}
                                                    onClick={() => choose(i)}
                                                >
                                                    <span
                                                        className={cn(
                                                            'grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black',
                                                            showRight ? 'bg-[#ffe066] text-black' : 'bg-black text-white',
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        {showRight ? <HiCheck className="h-5 w-5" /> : showWrong ? <HiXMark className="h-5 w-5" /> : letters[i]}
                                                    </span>
                                                    <span className={cn('min-w-0', showWrong && 'bg-white px-1 line-through decoration-[3px]')}>{opt}</span>
                                                    {showRight && <span className="sr-only">(correct answer)</span>}
                                                    {showWrong && <span className="sr-only">(your answer, incorrect)</span>}
                                                </motion.button>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-6 flex min-h-12 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div id="qn-feedback" aria-live="polite" className="min-w-0">
                                            {answered && (
                                                <>
                                                    <p className="text-lg font-black uppercase tracking-tight">
                                                        {picked === q.answer ? 'Correct! +1' : `Not quite — it’s ${q.options[q.answer]}.`}
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-black/70">{q.why}</p>
                                                </>
                                            )}
                                            {!answered && <p className="text-sm font-medium text-black/60">Pick one answer to lock it in.</p>}
                                        </div>
                                        <button
                                            type="button"
                                            disabled={!answered}
                                            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-[#ffe066] px-6 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:bg-white disabled:text-black/40 disabled:shadow-none motion-reduce:transition-none"
                                            onClick={next}
                                        >
                                            {index === questions.length - 1 ? 'See results' : 'Next question'}
                                            <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="results" className="p-5 sm:p-8" {...slide}>
                                    <p className="text-xs font-black uppercase tracking-[0.18em]">Results</p>
                                    <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
                                        <h3 ref={focusOnMount} tabIndex={-1} className="text-8xl font-black leading-none tracking-tighter text-black outline-none sm:text-9xl">
                                            {score}
                                            <span className="text-black/30">/{questions.length}</span>
                                            <span className="sr-only"> correct</span>
                                        </h3>
                                        <p className="max-w-xs pb-3 text-base font-bold leading-snug">{verdicts[score]}</p>
                                    </div>
                                    <ol className="mt-8 divide-y-[3px] divide-black rounded-2xl border-[3px] border-black">
                                        {questions.map((item, i) => {
                                            const a = answers[i]
                                            return (
                                                <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                                                    <span
                                                        className={cn(
                                                            'grid h-9 w-9 shrink-0 place-items-center rounded-lg border-[3px] border-black',
                                                            a?.correct ? 'bg-black text-[#ffe066]' : cn('bg-white', hatch),
                                                        )}
                                                    >
                                                        {a?.correct ? <HiCheck className="h-4 w-4" aria-hidden="true" /> : <HiXMark className="h-4 w-4 bg-white" aria-hidden="true" />}
                                                        <span className="sr-only">{a?.correct ? 'Correct' : 'Incorrect'}</span>
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold leading-snug">{item.prompt}</p>
                                                        <p className="text-xs font-medium text-black/60">Answer: {item.options[item.answer]}</p>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ol>
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-black px-6 text-sm font-black uppercase tracking-wide text-[#ffe066] shadow-[4px_4px_0_#ffe066,7px_7px_0_#000] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black motion-reduce:transition-none"
                                            onClick={retry}
                                        >
                                            <HiArrowPath className="h-4 w-4" aria-hidden="true" />
                                            Retry quiz
                                        </button>
                                        <a
                                            href="#lesson-cell-structure"
                                            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-[3px] border-black bg-white px-6 text-sm font-black uppercase tracking-wide focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
                                        >
                                            Back to lesson
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <aside className="rounded-[28px] border-[3px] border-black bg-black p-6 text-white shadow-[8px_8px_0_#fff]" aria-label="Scoreboard">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffe066]">Scoreboard</p>
                        <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1">
                            <div className="rounded-2xl border-2 border-white/20 p-4">
                                <dt className="text-xs font-bold uppercase tracking-wider text-white/60">Score</dt>
                                <dd className="mt-1 text-4xl font-black tabular-nums text-[#ffe066]">
                                    <motion.span key={score} initial={reduce ? false : { scale: 1.4 }} animate={{ scale: 1 }} className="inline-block">
                                        {score}
                                    </motion.span>
                                    <span className="text-white/40">/{questions.length}</span>
                                </dd>
                            </div>
                            <div className="rounded-2xl border-2 border-white/20 p-4">
                                <dt className="text-xs font-bold uppercase tracking-wider text-white/60">Streak</dt>
                                <dd className="mt-1 text-4xl font-black tabular-nums">
                                    {streak}
                                    <span className="ml-1 text-base text-white/40">in a row</span>
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-5 space-y-2 text-sm font-medium text-white/70">
                            <p className="flex justify-between gap-3">
                                <span>Class average</span>
                                <span className="font-black tabular-nums text-white">2.1 / 3</span>
                            </p>
                            <p className="flex justify-between gap-3">
                                <span>Taken by</span>
                                <span className="font-black tabular-nums text-white">184 classmates</span>
                            </p>
                            <p className="flex justify-between gap-3">
                                <span>Lab starts</span>
                                <span className="font-black text-white">Thu 1 Oct · 10:00</span>
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default PopQuizLearnerDashboard
