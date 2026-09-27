// HorizontalStepperWithErrorState

// ErrorStepper · Steps demo

// Description:
// A static 4-step horizontal stepper with titles in which the current step
// ("Order Placed") is shown in an error state: a red outlined circle with
// an X icon and a red title. Step 1 is complete (check icon) and steps
// 3-4 are pending. Display-only.

// Design:
// - Row layout (flex, justify-between); every step except the last takes
//   basis-1/3 and draws a connector line (ms-2.5), the last is max-w-[25%]
// - Error: border-2 border-red-500, text-red-500, font-normal, HiX icon,
//   title in text-red-500
// - Complete: filled brand blue #2a85ff circle with white HiCheck;
//   pending: gray-300 border (dark:border-gray-600) with the step number
// - Connector is h-0.5, blue after a complete step, otherwise gray-200
//   (dark:bg-gray-600); other titles gray-600 (dark:text-gray-300)
// - No responsive breakpoints

// What it does:
// - currentStep is a module-level constant (1), not state
// - isError = index === currentStep, isComplete = index < currentStep
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
// import HorizontalStepperWithErrorState from '@/TestComponent/ErrorStepper';

// const Error = () => {
//     return <HorizontalStepperWithErrorState />
// }
// ```

'use client'

import { HiCheck, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']
const currentStep = 1

export function HorizontalStepperWithErrorState({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex items-center justify-between', className)}
            {...props}
        >
            {steps.map((title, index) => {
                const isError = index === currentStep
                const isComplete = index < currentStep

                return (
                    <div
                        key={title}
                        className={`flex items-center ${index < steps.length - 1 ? 'basis-1/3' : 'max-w-[25%]'}`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`box-border flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-full text-lg ${
                                    isError
                                        ? 'border-2 border-red-500 font-normal text-red-500'
                                        : isComplete
                                          ? 'border-0 bg-[#2a85ff] font-semibold text-white'
                                          : 'border-2 border-gray-300 font-semibold dark:border-gray-600'
                                }`}
                            >
                                {isError ? <HiX /> : isComplete ? <HiCheck /> : index + 1}
                            </div>
                            <div className="relative ms-3">
                                <span
                                    className={`block whitespace-nowrap font-bold ${isError ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
                                >
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

export default HorizontalStepperWithErrorState