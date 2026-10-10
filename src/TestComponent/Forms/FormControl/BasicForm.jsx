// BasicForm

// BasicForm · FormControl demo

// Description:
// A clean, standalone form with client-side validation using react-hook-form
// and Zod. Includes Email, Username, Password, and a "Remember me" checkbox,
// along with Reset and Submit action buttons. Form fields display inline
// error messages upon validation failures.

// Design:
// - Vertical form layout with 16px vertical spacing (space-y-4)
// - Brand blue #2a85ff accents on focus rings, checkbox checked state, and primary submit button
// - Dark mode support with dark:bg-gray-800, dark:border-gray-600, dark:text-gray-100
// - Clean rounded-lg inputs with subtle borders and smooth transitions

// What it does:
// - Uses react-hook-form useForm hook with zodResolver
// - Validates email format, username length (3-12 chars), password requirements
// - Handles submission with window.alert feedback and form reset functionality
// - Completely self-contained single component with no external UI component dependencies

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" | "sm" | "lg" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import BasicForm from '@/TestComponent/Forms/FormControl/BasicForm';
//
// const MyPage = () => {
//     return <BasicForm />
// }
// ```

'use client'

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/design-system/lib/cn';

const validationSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email Required' })
        .email({ message: 'Invalid email' }),
    userName: z.string().min(3, 'Too Short!').max(12, 'Too Long!'),
    password: z
        .string()
        .min(1, { message: 'Password Required' })
        .min(8, { message: 'Too Short!' })
        .refine(
            (value) => /^[A-Za-z0-9_-]*$/.test(value),
            'Only Letters & Numbers Allowed',
        ),
    rememberMe: z.boolean(),
})

export function BasicForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            email: '',
            userName: '',
            password: '',
            rememberMe: false,
        },
        resolver: zodResolver(validationSchema),
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
                />
                {errors.userName && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.userName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                    Password
                </label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="password"
                            autoComplete="off"
                            placeholder="Password"
                            disabled={disabled || loading}
                            className={cn(
                                'w-full rounded-lg border bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1',
                                errors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-[#2a85ff] focus:ring-[#2a85ff]',
                            )}
                            {...field}
                        />
                    )}
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center">
                <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={field.value}
                                disabled={disabled || loading}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff]"
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Remember me
                            </span>
                        </label>
                    )}
                />
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="button"
                    disabled={disabled || loading}
                    className="rounded-lg font-medium px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    onClick={() => reset()}
                >
                    Reset
                </button>
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

export default BasicForm
