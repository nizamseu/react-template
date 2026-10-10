// DependentValidationForm

// DependentValidationForm · FormControl demo

// Description:
// Demonstrates form validation where one field depends on another (password and confirm password matching)
// using Zod refinement and react-hook-form Controller.

// Design:
// - Vertical stacked form layout (space-y-4)
// - Brand blue #2a85ff focus outlines and primary solid button
// - Validation error messages in red-500
// - Full dark mode support
// - Reset and Submit action buttons

// What it does:
// - Validates password is required
// - Validates confirmPassword matches password via z.refine()
// - Displays error feedback on invalid submission
// - Shows alert with submitted values on success

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import DependentValidationForm from '@/TestComponent/Forms/FormControl/DependentValidationForm';
//
// const MyComponent = () => {
//     return <DependentValidationForm />
// }
// ```

'use client'

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/design-system/lib/cn';

const validationSchema = z
    .object({
        password: z.string().min(1, { message: 'Password Required' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password Required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password does not match',
        path: ['confirmPassword'],
    })

export function DependentValidationForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [submitting, setSubmitting] = useState(false)

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            confirmPassword: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values) => {
        setSubmitting(true)
        setTimeout(() => {
            window.alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
            reset()
        }, 400)
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
                    Password
                </label>
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <input
                            autoComplete="off"
                            className={cn(
                                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                errors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff]',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            placeholder="Password"
                            type="password"
                            {...field}
                        />
                    )}
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Confirm Password
                </label>
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <input
                            autoComplete="off"
                            className={cn(
                                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                errors.confirmPassword
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff]',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            placeholder="Confirm Password"
                            type="password"
                            {...field}
                        />
                    )}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 pt-2">
                <button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                    disabled={disabled || loading || submitting}
                    type="reset"
                    onClick={() => reset()}
                >
                    Reset
                </button>
                <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#2a85ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                    disabled={disabled || loading || submitting}
                    type="submit"
                >
                    {submitting && (
                        <svg
                            className="h-4 w-4 animate-spin text-white"
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
                    )}
                    Submit
                </button>
            </div>
        </form>
    )
}

export default DependentValidationForm
