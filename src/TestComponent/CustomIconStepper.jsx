import {
    HiOutlineClipboardCheck,
    HiOutlineDocumentSearch,
    HiOutlineLogin,
} from 'react-icons/hi'

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']
const currentStep = 1

const CustomIconStepper = () => {
    return (
        <div className="flex items-center justify-between">
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

export default CustomIconStepper