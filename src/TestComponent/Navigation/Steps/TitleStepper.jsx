// HorizontalStepperWithTitles

// TitleStepper · Steps demo

// Description:
// A static 4-step horizontal stepper where each numbered circle has a
// title next to it (Login, Order Placed, In Review, Approved). Step 1 is
// complete (check icon), step 2 is current and steps 3-4 are pending.
// Display-only.

// Design:
// - Row layout (flex, justify-between); every step except the last takes
//   basis-1/3 and draws a connector line (ms-2.5), the last is max-w-[25%]
// - Complete: filled brand blue #2a85ff circle with white HiCheck;
//   current: 2px #2a85ff border (dark:text-gray-100); pending: gray-300
//   border (dark:border-gray-600)
// - Title is bold, whitespace-nowrap, gray-600 (dark:text-gray-300), ms-3
//   from the circle; connector h-0.5, blue after complete steps, otherwise
//   gray-200 (dark:bg-gray-600)
// - No responsive breakpoints; long titles do not wrap

// What it does:
// - currentStep is a hard-coded local constant (1), not state
// - isComplete / isCurrent are derived per step from its index
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
// import HorizontalStepperWithTitles from '@/TestComponent/TitleStepper';

// const Title = () => {
//     return <HorizontalStepperWithTitles />
// }
// ```

'use client'

import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']

export function HorizontalStepperWithTitles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const currentStep = 1

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex items-center justify-between', className)}
            {...props}
        >
            {steps.map((title, index) => {
                const isComplete = index < currentStep
                const isCurrent = index === currentStep

                return (
                    <div
                        key={title}
                        className={`flex items-center ${index < steps.length - 1 ? 'basis-1/3' : 'max-w-[25%]'}`}
                    >
                        <div className="flex items-center">
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
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`h-0.5 w-full ms-2.5 ${isComplete ? 'bg-[#2a85ff]' : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default HorizontalStepperWithTitles