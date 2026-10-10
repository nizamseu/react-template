// SchemaValidationForm

// SchemaValidationForm · FormControl demo

// Description:
// Demonstrates form validation driven by a Zod schema via @hookform/resolvers/zod.
// Validates Email and Username with asynchronous submission loading feedback.

// Design:
// - Modern vertical form layout (space-y-4)
// - Brand blue #2a85ff focus outlines and submit button
// - Animated SVG spinner on submit button
// - Full dark mode support

// What it does:
// - Uses Zod schema declaration to enforce constraints
// - Integrates zodResolver with react-hook-form
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import SchemaValidationForm from '@/TestComponent/Forms/FormControl/SchemaValidationForm';
//
// const MyComponent = () => {
//     return <SchemaValidationForm />
// }
// ```

'use client'

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/design-system/lib/cn';

const validationSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Required' })
        .email({ message: 'Invalid email' }),
    userName: z
        .string()
        .min(1, { message: 'Required' })
        .min(3, 'Too Short!')
        .max(12, 'Too Long!'),
})

export function SchemaValidationForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [submitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            email: '',
            userName: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values) => {
        setSubmitting(true)
        setTimeout(() => {
            window.alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
        }, 400)
    }

    const isBusy = submitting || loading

    return (
        <form
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || isBusy}
            className={cn('space-y-4 max-w-xl text-gray-900 dark:text-gray-100', className)}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
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
                            disabled={disabled || isBusy}
                            className={cn(
                                'w-full rounded-lg border bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1',
                                errors.email
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-[#2a85ff] focus:ring-[#2a85ff]',
                            )}
                            {...field}
                        />
                    )}
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>
                )}
            </div>

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
                            disabled={disabled || isBusy}
                            className={cn(
                                'w-full rounded-lg border bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1',
                                errors.userName
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-[#2a85ff] focus:ring-[#2a85ff]',
                            )}
                            {...field}
                        />
                    )}
                />
                {errors.userName && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.userName.message}</p>
                )}
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={disabled || isBusy}
                    className="inline-flex items-center gap-2 rounded-lg font-medium px-4 py-2 text-sm bg-[#2a85ff] hover:bg-[#2075e8] text-white transition-colors disabled:opacity-50 shadow-sm"
                >
                    {isBusy && (
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    )}
                    {isBusy ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    )
}

export default SchemaValidationForm
