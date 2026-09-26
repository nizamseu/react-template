import { HiCheck } from 'react-icons/hi'

const steps = [
    { title: 'Login', description: 'Login to your account' },
    { title: 'Place Order', description: 'Start placing an order' },
    { title: 'In Review', description: 'We will review the order' },
    { title: 'Approved', description: 'Order approved' },
]

const DescriptionStepper = () => {
    const currentStep = 2

    return (
        <div className="flex flex-col items-start">
            {steps.map(({ title, description }, index) => {
                const isComplete = index < currentStep
                const isCurrent = index === currentStep

                return (
                    <div
                        key={title}
                        className="flex flex-col items-start"
                    >
                        <div className="flex items-start">
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
                                <span className="block text-sm text-gray-500 dark:text-gray-400">
                                    {description}
                                </span>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`ms-4 min-h-14 w-0.5 ${isComplete ? 'bg-[#2a85ff]' : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default DescriptionStepper