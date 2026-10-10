// MixedForm

// MixedForm · FormControl demo

// Description:
// Comprehensive form showcasing a complete suite of form controls: text input,
// single select, multi select, date, time, single checkbox, checkbox group,
// radio group, toggle switcher, file upload with size/type validation, and segment selection.

// Design:
// - Cohesive vertical stacked layout with section grouping
// - Brand blue #2a85ff accents on active controls, radios, checkboxes, and buttons
// - Interactive segment cards with selection badges
// - Full dark mode support and responsive design

// What it does:
// - Comprehensive Zod validation across 11 diverse field types
// - React-hook-form Controller bindings for all inputs
// - Client-side file validation for upload
// - Reset and submit with loading state

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import MixedForm from '@/TestComponent/Forms/FormControl/MixedForm';
//
// const MyComponent = () => {
//     return <MixedForm />
// }
// ```

'use client'

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiCheckCircle, HiOutlineUpload, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const options = [
    { label: 'Foo', value: 'foo' },
    { label: 'Bar', value: 'bar' },
    { label: 'Baz', value: 'baz' },
]

const segmentSelections = [
    { desc: 'The plan for personal use.', value: 'Personal' },
    { desc: 'The plan for team collaboration.', value: 'Team' },
    { desc: 'Custom plan tailored for business.', value: 'Business' },
]

const MAX_UPLOAD = 2
const MAX_FILE_SIZE = 500000 // 500KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

const validationSchema = z.object({
    date: z.string().min(1, 'Date is required!'),
    input: z
        .string()
        .min(1, 'Please input user name!')
        .min(3, 'Too Short!')
        .max(12, 'Too Long!'),
    multipleCheckbox: z
        .array(z.string())
        .nonempty('Select at least one checkbox!'),
    multipleSelect: z.array(z.string()).nonempty('At least one is selected!'),
    radio: z.string().min(1, 'Please select one payment method!'),
    segment: z.array(z.string()).nonempty('Select at least one segment!'),
    select: z.string().min(1, 'Please select an option!'),
    singleCheckbox: z.boolean().refine((val) => val === true, {
        message: 'You must tick this!',
    }),
    switcher: z.boolean().refine((val) => val === true, {
        message: 'You must turn this on!',
    }),
    time: z.string().min(1, 'Time is required!'),
    upload: z.array(z.any()).nonempty('At least one file uploaded!'),
})

export function MixedForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [uploadError, setUploadError] = useState('')

    const {
        control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            date: '',
            input: '',
            multipleCheckbox: [],
            multipleSelect: [],
            radio: '',
            segment: [],
            select: '',
            singleCheckbox: false,
            switcher: false,
            time: '',
            upload: [],
        },
        resolver: zodResolver(validationSchema),
    })

    const handleFileUpload = (e, onChange, currentFiles) => {
        setUploadError('')
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        if (currentFiles.length + files.length > MAX_UPLOAD) {
            setUploadError(`You can only upload up to ${MAX_UPLOAD} files`)
            return
        }

        for (const f of files) {
            if (!ALLOWED_TYPES.includes(f.type)) {
                setUploadError('Please upload a .jpeg or .png file!')
                return
            }
            if (f.size > MAX_FILE_SIZE) {
                setUploadError('Upload image cannot be more than 500KB!')
                return
            }
        }

        onChange([...currentFiles, ...files])
    }

    const removeFile = (index, onChange, currentFiles) => {
        const next = [...currentFiles]
        next.splice(index, 1)
        onChange(next)
    }

    const onSubmit = (values) => {
        setTimeout(() => {
            window.alert(
                JSON.stringify(
                    {
                        ...values,
                        upload: values.upload.map((f) => f.name || 'File'),
                    },
                    null,
                    2,
                ),
            )
        }, 300)
    }

    return (
        <form
            className={cn('w-full max-w-2xl space-y-6', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            {/* Text Input */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Input <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="input"
                    render={({ field }) => (
                        <input
                            autoComplete="off"
                            className={cn(
                                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                errors.input
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff] focus:ring-1 focus:ring-[#2a85ff]',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            placeholder="Input name"
                            type="text"
                            {...field}
                        />
                    )}
                />
                {errors.input && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.input.message}
                    </p>
                )}
            </div>

            {/* Select */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Select <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="select"
                    render={({ field }) => (
                        <select
                            className={cn(
                                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                errors.select
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff]',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            {...field}
                        >
                            <option value="">Select an option</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors.select && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.select.message}
                    </p>
                )}
            </div>

            {/* Multiple Select */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Multiple Select <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="multipleSelect"
                    render={({ field }) => {
                        const toggleOption = (val) => {
                            const cur = field.value || []
                            field.onChange(
                                cur.includes(val)
                                    ? cur.filter((item) => item !== val)
                                    : [...cur, val],
                            )
                        }

                        return (
                            <div className="flex flex-wrap gap-2">
                                {options.map((opt) => {
                                    const selected = (field.value || []).includes(
                                        opt.value,
                                    )
                                    return (
                                        <button
                                            key={opt.value}
                                            className={cn(
                                                'rounded-full px-3 py-1 text-xs font-semibold border transition',
                                                selected
                                                    ? 'bg-[#2a85ff] text-white border-[#2a85ff]'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-[#2a85ff]',
                                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                                            )}
                                            disabled={disabled || loading}
                                            type="button"
                                            onClick={() => toggleOption(opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    )
                                })}
                            </div>
                        )
                    }}
                />
                {errors.multipleSelect && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.multipleSelect.message}
                    </p>
                )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <input
                                className={cn(
                                    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                    errors.date
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff]',
                                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                                )}
                                disabled={disabled || loading}
                                type="date"
                                {...field}
                            />
                        )}
                    />
                    {errors.date && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.date.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Time <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        control={control}
                        name="time"
                        render={({ field }) => (
                            <input
                                className={cn(
                                    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                    errors.time
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 dark:border-gray-700 focus:border-[#2a85ff]',
                                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                                )}
                                disabled={disabled || loading}
                                type="time"
                                {...field}
                            />
                        )}
                    />
                    {errors.time && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.time.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Single Checkbox */}
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <Controller
                        control={control}
                        name="singleCheckbox"
                        render={({ field }) => (
                            <input
                                checked={field.value}
                                className="h-4 w-4 rounded border-gray-300 text-[#2a85ff] focus:ring-[#2a85ff] accent-[#2a85ff]"
                                disabled={disabled || loading}
                                type="checkbox"
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        I agree to terms and conditions <span className="text-red-500">*</span>
                    </span>
                </label>
                {errors.singleCheckbox && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.singleCheckbox.message}
                    </p>
                )}
            </div>

            {/* Multiple Checkbox */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Multiple Checkbox <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="multipleCheckbox"
                    render={({ field }) => {
                        const items = ['Apple', 'Banana', 'Lemon']
                        const toggle = (fruit) => {
                            const cur = field.value || []
                            field.onChange(
                                cur.includes(fruit)
                                    ? cur.filter((i) => i !== fruit)
                                    : [...cur, fruit],
                            )
                        }

                        return (
                            <div className="flex gap-4">
                                {items.map((fruit) => (
                                    <label
                                        key={fruit}
                                        className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <input
                                            checked={(field.value || []).includes(
                                                fruit,
                                            )}
                                            className="h-4 w-4 rounded border-gray-300 text-[#2a85ff] accent-[#2a85ff]"
                                            disabled={disabled || loading}
                                            type="checkbox"
                                            onChange={() => toggle(fruit)}
                                        />
                                        <span>{fruit}</span>
                                    </label>
                                ))}
                            </div>
                        )
                    }}
                />
                {errors.multipleCheckbox && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.multipleCheckbox.message}
                    </p>
                )}
            </div>

            {/* Radio Group */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Radio Payment Method <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="radio"
                    render={({ field }) => (
                        <div className="flex gap-6">
                            {[
                                { id: '1', label: 'Paypal' },
                                { id: '2', label: 'Stripe' },
                            ].map((r) => (
                                <label
                                    key={r.id}
                                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                                >
                                    <input
                                        checked={field.value === r.id}
                                        className="h-4 w-4 border-gray-300 text-[#2a85ff] accent-[#2a85ff]"
                                        disabled={disabled || loading}
                                        name="radioPayment"
                                        type="radio"
                                        value={r.id}
                                        onChange={() => field.onChange(r.id)}
                                    />
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                />
                {errors.radio && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.radio.message}
                    </p>
                )}
            </div>

            {/* Switcher */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Switcher <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="switcher"
                    render={({ field }) => (
                        <button
                            aria-checked={field.value}
                            className={cn(
                                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                                field.value
                                    ? 'bg-[#2a85ff]'
                                    : 'bg-gray-300 dark:bg-gray-700',
                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled || loading}
                            role="switch"
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                        >
                            <span
                                className={cn(
                                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                                    field.value ? 'translate-x-6' : 'translate-x-1',
                                )}
                            />
                        </button>
                    )}
                />
                {errors.switcher && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.switcher.message}
                    </p>
                )}
            </div>

            {/* Upload */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Upload (Max 2 files, &lt; 500KB) <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="upload"
                    render={({ field }) => (
                        <div className="space-y-2">
                            <label
                                className={cn(
                                    'flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition',
                                    'border-gray-300 dark:border-gray-700 hover:border-[#2a85ff] bg-gray-50/50 dark:bg-gray-800/40',
                                    (disabled || loading) && 'cursor-not-allowed opacity-50',
                                )}
                            >
                                <HiOutlineUpload className="h-6 w-6 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                    Click to browse files (JPEG/PNG)
                                </span>
                                <input
                                    multiple
                                    accept="image/png,image/jpeg"
                                    className="hidden"
                                    disabled={disabled || loading}
                                    type="file"
                                    onChange={(e) =>
                                        handleFileUpload(e, field.onChange, field.value || [])
                                    }
                                />
                            </label>

                            {/* Uploaded File List */}
                            {(field.value || []).length > 0 && (
                                <ul className="space-y-1">
                                    {field.value.map((f, i) => (
                                        <li
                                            key={f.name || i}
                                            className="flex items-center justify-between text-xs py-1 px-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        >
                                            <span className="truncate">{f.name}</span>
                                            <button
                                                className="text-red-500 hover:text-red-700 p-0.5"
                                                type="button"
                                                onClick={() =>
                                                    removeFile(i, field.onChange, field.value)
                                                }
                                            >
                                                <HiX className="h-3.5 w-3.5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                />
                {uploadError && (
                    <p className="mt-1 text-xs text-red-500">{uploadError}</p>
                )}
                {errors.upload && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.upload.message}
                    </p>
                )}
            </div>

            {/* Segment */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Segment Plans <span className="text-red-500">*</span>
                </label>
                <Controller
                    control={control}
                    name="segment"
                    render={({ field }) => {
                        const toggleSeg = (val) => {
                            const cur = field.value || []
                            field.onChange(
                                cur.includes(val)
                                    ? cur.filter((i) => i !== val)
                                    : [...cur, val],
                            )
                        }

                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {segmentSelections.map((seg) => {
                                    const selected = (field.value || []).includes(
                                        seg.value,
                                    )
                                    return (
                                        <div
                                            key={seg.value}
                                            className={cn(
                                                'relative p-3 rounded-lg border cursor-pointer transition text-left select-none',
                                                selected
                                                    ? 'border-[#2a85ff] bg-blue-50/50 dark:bg-blue-950/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800',
                                                (disabled || loading) && 'cursor-not-allowed opacity-50',
                                            )}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleSeg(seg.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    toggleSeg(seg.value)
                                                }
                                            }}
                                        >
                                            {selected && (
                                                <HiCheckCircle className="absolute top-2 right-2 text-[#2a85ff] text-lg" />
                                            )}
                                            <div className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-0.5">
                                                {seg.value}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {seg.desc}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }}
                />
                {errors.segment && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.segment.message}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                    disabled={disabled || loading || isSubmitting}
                    type="reset"
                    onClick={() => {
                        reset()
                        setUploadError('')
                    }}
                >
                    Reset
                </button>
                <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#2a85ff] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#2072db] disabled:opacity-50 transition"
                    disabled={disabled || loading || isSubmitting}
                    type="submit"
                >
                    {isSubmitting && (
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

export default MixedForm
