// ResetPasswordPageSplitScreenLayout

// ResetPasswordDemoSplit · Authentication page demo (Split layout)

// Description:
// Full-page "Set new password" screen split into a blue brand panel (left)
// and the form (right). The form has Password and Confirm Password fields
// (each with a show / hide toggle) and Submit; on a match it switches to
// "Reset done" with a Continue button, otherwise an inline error shows.

// Design:
// - Full-screen grid (min-h-screen, p-6) with two equal columns from lg
//   (lg:grid-cols-2): left brand panel, right form column (centered,
//   max-w-[450px] px-8); no logo
// - Brand panel: rounded-3xl, bg brand blue #2a85ff, white text, px-16,
//   /img/others/auth-split-img.png (max-w-[450px], 2xl:max-w-[700px]),
//   headline "The easiest way to build your admin app" and a short Ecme
//   blurb at opacity-80
// - Page bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100;
//   #2a85ff Submit / Continue and input focus border; gray-300 input
//   borders (dark:border-gray-600); error text text-sm text-red-500
// - Responsive: the brand panel is hidden below lg (hidden lg:flex), so
//   small screens show a single form column

// What it does:
// - State: complete, error, showPassword, showConfirmation, password,
//   confirmation (both inputs are controlled)
// - Eye / eye-off buttons toggle each input between "password" and "text"
// - submit() prevents the default submit; if the two values differ it sets
//   "Your passwords do not match" (role="alert"), otherwise it clears the
//   error and sets complete to true (demo only, no API call)
// - Links (plain anchors, full page load): "Continue" and "Sign in" both
//   go to /auth/sign-in-split
// - No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <main> with cn()
// - ...props: spread onto the root <main> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// // src/configs/routes.config/authDemoRoute.js
// {
//     key: 'authentication.resetPasswordSplit',
//     path: `${AUTH_PREFIX_PATH}/reset-password-split`,
//     component: lazy(() => import('@/TestComponent/ResetPasswordDemoSplit')),
//     authority: [ADMIN, USER],
//     meta: {
//         layout: 'blank',
//         pageContainerType: 'gutterless',
//         footer: false,
//     },
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ResetPasswordPageSplitScreenLayout({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [complete, setComplete] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')

    const submit = (event) => {
        event.preventDefault()
        if (password !== confirmation) {
            setError('Your passwords do not match')
            return
        }
        setError('')
        setComplete(true)
    }

    return (
        <main
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'grid min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100 lg:grid-cols-2',
                className,
            )}
            {...props}
        >
            <aside className="hidden flex-col items-center justify-center rounded-3xl bg-[#2a85ff] px-16 py-6 text-white lg:flex">
                <div className="flex flex-col items-center gap-12">
                    <img className="max-w-[450px] 2xl:max-w-[700px]" src="/img/others/auth-split-img.png" alt="" />
                    <div className="max-w-[550px] text-center">
                        <h2 className="text-3xl font-bold">The easiest way to build your admin app</h2>
                        <p className="mx-auto mt-8 font-semibold opacity-80">Experience seamless project management with Ecme. Simplify your workflow, and achieve your goals efficiently with our powerful and intuitive tools.</p>
                    </div>
                </div>
            </aside>
            <section className="flex flex-col items-center justify-center">
                <div className="w-full max-w-[450px] px-8">
                    <header className="mb-6">
                        <h1 className="mb-1 text-2xl font-bold">{complete ? 'Reset done' : 'Set new password'}</h1>
                        <p className="font-semibold text-gray-600 dark:text-gray-300">{complete ? 'Your password has been successfully reset' : 'Your new password must different to previos password'}</p>
                    </header>
                    {!complete ? (
                        <form onSubmit={submit}>
                            {error && <p className="mb-4 text-sm text-red-500" role="alert">{error}</p>}
                            <label className="mb-1 block font-semibold" htmlFor="newPassword">Password</label>
                            <div className="relative mb-4">
                                <input required id="newPassword" className="w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 pr-10 outline-none focus:border-[#2a85ff] dark:border-gray-600" type={showPassword ? 'text' : 'password'} placeholder="••••••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
                                <button className="absolute inset-y-0 right-3 text-gray-500" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</button>
                            </div>
                            <label className="mb-1 block font-semibold" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative mb-5">
                                <input required id="confirmPassword" className="w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 pr-10 outline-none focus:border-[#2a85ff] dark:border-gray-600" type={showConfirmation ? 'text' : 'password'} placeholder="Confirm Password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
                                <button className="absolute inset-y-0 right-3 text-gray-500" type="button" aria-label={showConfirmation ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmation(!showConfirmation)}>{showConfirmation ? <HiOutlineEyeOff /> : <HiOutlineEye />}</button>
                            </div>
                            <button className="w-full rounded-sm bg-[#2a85ff] px-4 py-2 font-semibold text-white" type="submit">Submit</button>
                        </form>
                    ) : (
                        <a className="block rounded-sm bg-[#2a85ff] px-4 py-2 text-center font-semibold text-white" href="/auth/sign-in-split">Continue</a>
                    )}
                    <p className="mt-4 text-center">Back to <a className="font-bold" href="/auth/sign-in-split">Sign in</a></p>
                </div>
            </section>
        </main>
    )
}

export default ResetPasswordPageSplitScreenLayout