import { HiCheck } from 'react-icons/hi'

const BasicStepper = () => {
    const currentStep = 1
    const steps = [0, 1, 2, 3]

    return (
        <div className="flex items-center justify-between">
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

export default BasicStepper