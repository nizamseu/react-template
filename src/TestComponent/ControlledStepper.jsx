// ControlledStepperWithPreviousNextButtons

// ControlledStepper · Steps demo

// Description:
// A 4-step horizontal stepper with titles (Login, Order Placed, In Review,
// Approved), a placeholder content panel ("Step N content") and
// Previous / Next buttons. The user moves through the steps with the
// buttons; it starts on step 1.

// Design:
// - Stepper row (flex, justify-between; basis-1/3 per step, last step
//   max-w-[25%]) above a content panel and a right-aligned button bar
// - Complete: filled brand blue #2a85ff circle with white HiCheck;
//   current: 2px #2a85ff border (dark:text-gray-100); pending: gray-300
//   border (dark:border-gray-600); connector blue after complete steps,
//   otherwise gray-200 (dark:bg-gray-600)
// - Content panel: mt-6, h-40, rounded-sm, bg-gray-50 (dark:bg-gray-700)
//   with a centered h6
// - Previous: outlined gray-300 border (dark:border-gray-600); Next:
//   filled #2a85ff with white text; disabled buttons use opacity-50 and
//   cursor-not-allowed
// - No responsive breakpoints

// What it does:
// - useState(currentStep), initial value 0
// - changeStep(nextStep) clamps the value to the range 0..steps.length - 1
// - Previous is disabled on the first step; Next is disabled on the last
//   step and its label changes from "Next" to "Completed"
// - No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ControlledStepperWithPreviousNextButtons from '@/TestComponent/ControlledStepper';

// const Controlled = () => {
//     return <ControlledStepperWithPreviousNextButtons />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']

export function ControlledStepperWithPreviousNextButtons({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [currentStep, setCurrentStep] = useState(0)

    const changeStep = (nextStep) => {
        setCurrentStep(Math.max(0, Math.min(steps.length - 1, nextStep)))
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(className)}
            {...props}
        >
            <div className="flex items-center justify-between">
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
            <div className="mt-6 flex h-40 items-center justify-center rounded-sm bg-gray-50 dark:bg-gray-700">
                <h6>Step {currentStep + 1} content</h6>
            </div>
            <div className="mt-4 text-right">
                <button
                    className="mx-2 rounded-sm border border-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                    disabled={currentStep === 0}
                    onClick={() => changeStep(currentStep - 1)}
                >
                    Previous
                </button>
                <button
                    className="rounded-sm bg-[#2a85ff] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={currentStep === steps.length - 1}
                    onClick={() => changeStep(currentStep + 1)}
                >
                    {currentStep === steps.length - 1 ? 'Completed' : 'Next'}
                </button>
            </div>
        </div>
    )
}

export default ControlledStepperWithPreviousNextButtons