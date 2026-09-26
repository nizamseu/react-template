import { useState } from 'react'
import { HiCheck } from 'react-icons/hi'

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']

const ClickableStepper = () => {
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <div className="flex items-center justify-between">
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

export default ClickableStepper