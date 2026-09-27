// ClickableHorizontalStepper

// ClickableStepper · Steps demo

// Description:
// A 4-step horizontal stepper with titles (Login, Order Placed, In Review,
// Approved). Clicking any step makes it the current step: all earlier
// steps turn complete (check icon) and all later steps become pending.
// It starts with step 2 ("Order Placed") as the current step.

// Design:
// - Row layout (flex, justify-between); every step except the last takes
//   basis-1/3 and draws a connector line (ms-2.5), the last is max-w-[25%]
// - Complete: filled brand blue #2a85ff circle with a white HiCheck icon;
//   current: 2px #2a85ff border with blue number (dark:text-gray-100);
//   pending: gray-300 border (dark:border-gray-600)
// - Title is bold, whitespace-nowrap, gray-600 (dark:text-gray-300) and
//   turns #2a85ff on hover (group-hover); circle + title show a pointer
// - Connector is h-0.5, blue after a complete step, otherwise gray-200
//   (dark:bg-gray-600)
// - No responsive breakpoints; the row always stays horizontal

// What it does:
// - useState(currentStep), initial value 1
// - onClick on each step wrapper calls setCurrentStep(index), so clicking
//   the connector line also selects that step
// - Wrapper has role="presentation"; there is no keyboard handling
// - No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClickableHorizontalStepper from '@/TestComponent/ClickableStepper';

// const TestDashboard = () => {
//     return (
//         <div>
//             <h4 className="mb-4">Test Dashboard</h4>
//             <ClickableHorizontalStepper />
//         </div>
//     )
// }
// ```

'use client'

import { useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']

export function ClickableHorizontalStepper({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [currentStep, setCurrentStep] = useState(1)

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
                        role="presentation"
                        onClick={() => setCurrentStep(index)}
                    >
                        <div className="group flex cursor-pointer items-center">
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
                                <span className="block whitespace-nowrap font-bold text-gray-600 group-hover:text-[#2a85ff] dark:text-gray-300">
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

export default ClickableHorizontalStepper