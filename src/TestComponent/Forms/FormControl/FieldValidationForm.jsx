// FieldValidationForm

// FieldValidationForm · FormControl demo

// Description:
// Demonstrates custom field-level validation rules in react-hook-form.
// User Name rejects empty input and "admin", while Email validates RFC regex.

// Design:
// - Vertical stacked form layout with 16px field spacing
// - Clear label styling and accessible inline red error text
// - Brand blue #2a85ff focus outlines
// - Full dark mode support

// What it does:
// - Uses Controller with field-level rules.validate callbacks
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import FieldValidationForm from '@/TestComponent/Forms/FormControl/FieldValidationForm';
//
// const MyComponent = () => {
//     return <FieldValidationForm />
// }
// ```

'use client'

import { useForm, Controller } from 'react-hook-form';
import { cn } from '@/design-system/lib/cn';

export function FieldValidationForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
        },
    })

    const onSubmit = (values) => {
        window.alert(JSON.stringify(values, null, 2))
    }

    return (
        <form
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('space-y-4 max-w-xl text-gray-900 dark:text-gray-100', className)}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                    User Name
                </label>
                <Controller
                    name="userName"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="User Name"
                            disabled={disabled || loading}
                            className={cn(
                                'w-full rounded-lg border bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1',
                                errors.userName
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-[#2a85ff] focus:ring-[#2a85ff]',
                            )}
                            {...field}
                        />
                    )}
                    rules={{
                        validate: {
                            required: (value) => {
                                if (!value) return 'Required'
                                if (value === 'admin') return 'Nice try!'
                                return true
                            },
                        },
                    }}
                />
                {errors.userName && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.userName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                    Email
                </label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="email"
                            autoComplete="off"
                            placeholder="Email"
                            disabled={disabled || loading}
                            className={cn(
                                'w-full rounded-lg border bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1',
                                errors.email
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-[#2a85ff] focus:ring-[#2a85ff]',
                            )}
                            {...field}
                        />
                    )}
                    rules={{
                        validate: {
                            required: (value) => {
                                if (!value) return 'Required'
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                                    return 'Invalid email address'
                                }
                                return true
                            },
                        },
                    }}
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>
                )}
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={disabled || loading}
                    className="rounded-lg font-medium px-4 py-2 text-sm bg-[#2a85ff] hover:bg-[#2075e8] text-white transition-colors disabled:opacity-50 shadow-sm"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default FieldValidationForm
