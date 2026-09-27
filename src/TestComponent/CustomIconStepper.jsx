// HorizontalStepperWithCustomIcons

// CustomIconStepper · Steps demo

// Description:
// A static 4-step horizontal stepper with titles where each circle shows
// an icon instead of a number: a login icon (Login), a spinning loader
// (Order Placed, the current step), a document-search icon (In Review)
// and a clipboard-check icon (Approved). Display-only.

// Design:
// - Row layout (flex, justify-between); every step except the last takes
//   basis-1/3 and draws a connector line (ms-2.5), the last is max-w-[25%]
// - All circles are 2px outlined (never filled): the current step uses
//   brand blue #2a85ff border/text (dark:text-gray-100), the others use
//   gray-300 border and gray-600 text (dark: gray-600 border, gray-300 text)
// - Loader is a 20px (h-5 w-5) border-2 ring with a transparent top and
//   animate-spin; icons come from react-icons/hi (outline set)
// - Connectors are always gray-200 (dark:bg-gray-600); titles are bold,
//   whitespace-nowrap, gray-600 (dark:text-gray-300)
// - No responsive breakpoints

// What it does:
// - currentStep is a module-level constant (1), not state
// - The icon is picked by step index with a nested ternary
// - There is no "complete" styling, so the Login step before the current
//   one is not shown as done
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
// import HorizontalStepperWithCustomIcons from '@/TestComponent/CustomIconStepper';

// const CustomIcon = () => {
//     return <HorizontalStepperWithCustomIcons />
// }
// ```

'use client'

import {
    HiOutlineClipboardCheck,
    HiOutlineDocumentSearch,
    HiOutlineLogin,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']
const currentStep = 1

export function HorizontalStepperWithCustomIcons({
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
            {steps.map((title, index) => (
                <div
                    key={title}
                    className={`flex items-center ${index < steps.length - 1 ? 'basis-1/3' : 'max-w-[25%]'}`}
                >
                    <div className="flex items-center">
                        <div
                            className={`box-border flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-full border-2 text-lg font-semibold ${
                                index === currentStep
                                    ? 'border-[#2a85ff] text-[#2a85ff] dark:text-gray-100'
                                    : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {index === 0 ? (
                                <HiOutlineLogin />
                            ) : index === 1 ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : index === 2 ? (
                                <HiOutlineDocumentSearch />
                            ) : (
                                <HiOutlineClipboardCheck />
                            )}
                        </div>
                        <div className="relative ms-3">
                            <span className="block whitespace-nowrap font-bold text-gray-600 dark:text-gray-300">
                                {title}
                            </span>
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div className="h-0.5 w-full ms-2.5 bg-gray-200 dark:bg-gray-600" />
                    )}
                </div>
            ))}
        </div>
    )
}

export default HorizontalStepperWithCustomIcons