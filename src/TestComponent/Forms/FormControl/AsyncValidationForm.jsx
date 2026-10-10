// AsyncValidationForm

// AsyncValidationForm · FormControl demo

// Description:
// Demonstrates asynchronous field validation using react-hook-form rules.validate.
// Validates whether the username is available with a simulated 1s delay and spinner feedback.

// Design:
// - Stacked layout with inline spinner feedback in the input suffix
// - Brand blue #2a85ff focus outlines and primary solid button
// - Validation error messages in red-500
// - Full dark mode support

// What it does:
// - Simulates async API check for username uniqueness
// - Displays animated spinner while validating
// - Shows error when username is taken (only 'Adam' allowed)
// - Submits with alert dialog on success

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import AsyncValidationForm from '@/TestComponent/Forms/FormControl/AsyncValidationForm';
//
// const MyComponent = () => {
//     return <AsyncValidationForm />
// }
// ```

'use client'

import { useForm, Controller } from 'react-hook-form';
import { cn } from '@/design-system/lib/cn';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function AsyncValidationForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const {
        control,
        formState: { errors, isValidating },
        handleSubmit,
        reset,
        trigger,
    } = useForm({
        defaultValues: {
            userName: 'Adam',
        },
    })

    const validateAsync = async (value) => {
        await sleep(1000)
        if (value === 'Adam') {
            return true
        }
        return `This User name has been taken (only 'Adam' allowed)`
    }

    const onSubmit = (values) => {
        setTimeout(() => {
            window.alert(JSON.stringify(values, null, 2))
            reset()
        }, 200)
    }

    return (
        <form
            className={cn('w-full max-w-md space-y-4', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Check valid username
                </label>
                <div className="relative">
                    <Controller
                        control={control}
                        name="userName"
                        render={({ field }) => (
                            <input
                                autoComplete="off"
                                className={cn(
                                    'w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition',
                                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                    errors.userName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff]',
                                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                                )}
                                disabled={disabled || loading}
                                placeholder="User Name"
                                type="text"
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e)
                                    trigger(['userName'])
                                }}
                            />
                        )}
                        rules={{
                            validate: validateAsync,
                        }}
                    />
                    {isValidating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg
                                className="h-4 w-4 animate-spin text-[#2a85ff]"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                    )}
                </div>
                {errors.userName && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.userName.message}
                    </p>
                )}
            </div>

            <div>
                <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                    disabled={disabled || loading}
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default AsyncValidationForm
