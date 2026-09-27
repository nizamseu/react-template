// BasicHorizontalStepper

// BasicStepper · Steps demo

// Description:
// A static 4-step horizontal progress indicator made only of numbered
// circles joined by connector lines (no titles). Step 1 is shown as
// complete (check icon), step 2 is the current step and steps 3-4 are
// pending. It is display-only; the user cannot interact with it.

// Design:
// - Row layout (flex, justify-between); every step except the last takes
//   basis-1/3 and draws a connector line, the last step is max-w-[25%]
// - Complete: filled brand blue #2a85ff circle with a white HiCheck icon;
//   current: 2px #2a85ff border with blue number (dark:text-gray-100);
//   pending: gray-300 border (dark:border-gray-600)
// - Connector is h-0.5 and blue after a complete step, otherwise gray-200
//   (dark:bg-gray-600)
// - Circles are 36px (h-9 w-9), rounded-full, text-lg font-semibold
// - No responsive breakpoints; the row always stays horizontal

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
// import BasicHorizontalStepper from '@/TestComponent/BasicStepper';

// const Basic = () => {
//     return <BasicHorizontalStepper />
// }
// ```

'use client'

import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicHorizontalStepper({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const currentStep = 1
    const steps = [0, 1, 2, 3]

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex items-center justify-between', className)}
            {...props}
        >
            {steps.map((step, index) => {
                const isComplete = index < currentStep
                const isCurrent = index === currentStep

                return (
                    <div
                        key={step}
                        className={`flex items-center ${index < steps.length - 1 ? 'basis-1/3' : 'max-w-[25%]'}`}
                    >
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
                        {index < steps.length - 1 && (
                            <div
                                className={`h-0.5 w-full ${isComplete ? 'bg-[#2a85ff]' : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default BasicHorizontalStepper