import { HiCheck, HiX } from 'react-icons/hi'

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']
const currentStep = 1

const ErrorStepper = () => {
    return (
        <div className="flex items-center justify-between">
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

export default ErrorStepper