// DynamicForm

// DynamicForm · FormControl demo

// Description:
// Demonstrates dynamic form array management using react-hook-form useFieldArray.
// Allows adding and removing dynamic user entries (name and email) with Zod validation.

// Design:
// - Modern form layout with dynamic repeated items
// - Minus icon button to delete an entry
// - Add user button and primary submit button
// - Full dark mode support

// What it does:
// - Validates groupName and dynamic users array using Zod schema
// - append() adds a new row, remove() deletes a row by index
// - Submits valid JSON data to alert modal

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import DynamicForm from '@/TestComponent/Forms/FormControl/DynamicForm';
//
// const MyComponent = () => {
//     return <DynamicForm />
// }
// ```

'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMinus } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const validationSchema = z.object({
    groupName: z.string().min(1, 'Group Name is required'),
    users: z.array(
        z.object({
            email: z
                .string()
                .min(1, 'Email required')
                .email('Enter valid email'),
            name: z.string().min(1, 'Name required'),
        }),
    ),
})

export function DynamicForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: {
            groupName: '',
            users: [
                {
                    email: 'leslie.james@themenate.com',
                    name: 'Leslie James',
                },
                {
                    email: 'kelly.lambert@themenate.com',
                    name: 'Kelly Lambert',
                },
            ],
        },
        resolver: zodResolver(validationSchema),
    })

    const { append, fields, remove } = useFieldArray({
        control,
        name: 'users',
    })

    const onSubmit = (values) => {
        window.alert(JSON.stringify(values, null, 2))
    }

    return (
        <form
            className={cn('w-full max-w-xl space-y-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            <div>
                <h5 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
                    User List
                </h5>
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Group
                    </label>
                    <Controller
                        control={control}
                        name="groupName"
                        render={({ field }) => (
                            <input
                                autoComplete="off"
                                className={cn(
                                    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                    errors.groupName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff]',
                                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                                )}
                                disabled={disabled || loading}
                                placeholder="Group Name"
                                type="text"
                                {...field}
                            />
                        )}
                    />
                    {errors.groupName && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.groupName.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {fields.map((userField, index) => (
                    <div
                        key={userField.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40"
                    >
                        <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                                User Name
                            </label>
                            <Controller
                                control={control}
                                name={`users.${index}.name`}
                                render={({ field }) => (
                                    <input
                                        autoComplete="off"
                                        className={cn(
                                            'w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition',
                                            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                            errors.users?.[index]?.name
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff]',
                                            (disabled || loading) && 'cursor-not-allowed opacity-50',
                                        )}
                                        disabled={disabled || loading}
                                        placeholder="Name"
                                        type="text"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.users?.[index]?.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.users[index].name.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                                Email
                            </label>
                            <Controller
                                control={control}
                                name={`users.${index}.email`}
                                render={({ field }) => (
                                    <input
                                        autoComplete="off"
                                        className={cn(
                                            'w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition',
                                            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                            errors.users?.[index]?.email
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff]',
                                            (disabled || loading) && 'cursor-not-allowed opacity-50',
                                        )}
                                        disabled={disabled || loading}
                                        placeholder="Email"
                                        type="email"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.users?.[index]?.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.users[index].email.message}
                                </p>
                            )}
                        </div>

                        <div className="flex sm:self-end pb-0.5">
                            <button
                                aria-label="Remove user"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-red-500 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-500 transition"
                                disabled={disabled || loading}
                                type="button"
                                onClick={() => remove(index)}
                            >
                                <HiMinus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                    disabled={disabled || loading}
                    type="button"
                    onClick={() => append({ email: '', name: '' })}
                >
                    Add a User
                </button>
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

export default DynamicForm
