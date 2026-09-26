import { useState } from 'react'
import { HiCheck } from 'react-icons/hi'

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']

const ControlledStepper = () => {
    const [currentStep, setCurrentStep] = useState(0)

    const changeStep = (nextStep) => {
        setCurrentStep(Math.max(0, Math.min(steps.length - 1, nextStep)))
    }

    return (
        <div>
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

export default ControlledStepper