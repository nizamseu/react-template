// VerticalStepperWithDescriptions

// DescriptionStepper · Steps demo

// Description:
// A static 4-step vertical stepper where every step shows a bold title and
// a smaller description line (e.g. "Login" / "Login to your account").
// Steps 1-2 are complete (check icon), step 3 ("In Review") is current and
// step 4 is pending. Display-only.

// Design:
// - Column layout (flex-col, items-start); each step is a circle with the
//   title + description stacked to its right (ms-3)
// - Vertical connector below each step except the last: w-0.5, min-h-14,
//   ms-4 so it sits under the circle centre; blue #2a85ff after a complete
//   step, otherwise gray-200 (dark:bg-gray-600)
// - Complete: filled #2a85ff circle with white HiCheck; current: 2px
//   #2a85ff border (dark:text-gray-100); pending: gray-300 border
//   (dark:border-gray-600)
// - Title bold gray-600 (dark:text-gray-300); description text-sm
//   gray-500 (dark:text-gray-400)
// - No responsive breakpoints

// What it does:
// - steps is a module-level array of { title, description } objects
// - currentStep is a hard-coded local constant (2), not state
// - No state, no event handlers
// - No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VerticalStepperWithDescriptions from '@/TestComponent/DescriptionStepper';

// const Description = () => {
//     return <VerticalStepperWithDescriptions />
// }
// ```

'use client'

import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = [
    { title: 'Login', description: 'Login to your account' },
    { title: 'Place Order', description: 'Start placing an order' },
    { title: 'In Review', description: 'We will review the order' },
    { title: 'Approved', description: 'Order approved' },
]

export function VerticalStepperWithDescriptions({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const currentStep = 2

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col items-start', className)}
            {...props}
        >
            {steps.map(({ title, description }, index) => {
                const isComplete = index < currentStep
                const isCurrent = index === currentStep

                return (
                    <div
                        key={title}
                        className="flex flex-col items-start"
                    >
                        <div className="flex items-start">
                            <div
                                className={`box-border flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-full text-lg font-semibold ${
                                    isComplete
                                        ? 'border-0 bg-[#2a85ff] text-white'
                                        : isCurrent
                                          ? 'border-2 border-[#2a85ff] text-[#2a85ff] dark:text-gray-100'
                                          : 'border-2 border-gray-300 dark:border-gray-600'
                                }`}
                            >
                                {isComplete ? <HiCheck /> : index + 1}
                            </div>
                            <div className="relative ms-3">
                                <span className="block whitespace-nowrap font-bold text-gray-600 dark:text-gray-300">
                                    {title}
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-gray-400">
                                    {description}
                                </span>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`ms-4 min-h-14 w-0.5 ${isComplete ? 'bg-[#2a85ff]' : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default VerticalStepperWithDescriptions