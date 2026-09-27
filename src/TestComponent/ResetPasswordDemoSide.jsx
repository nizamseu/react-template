// ResetPasswordPageSideImageLayout

// ResetPasswordDemoSide · Authentication page demo (Side layout)

// Description:
// Full-page "Set new password" screen with the form on the left and a
// large rounded background image on the right. The form has Password and
// Confirm Password fields (each with a show / hide toggle) and Submit; on
// a match it switches to "Reset done" with a Continue button.

// Design:
// - Full-screen flex row (min-h-screen, gap-6, p-6): form column on the
//   left (flex-1, centered, content max-w-[450px] px-8) and an image panel
//   on the right (flex-1, max-w-[720px], rounded-3xl, overflow-hidden)
//   showing /img/others/auth-side-bg.png with object-cover; no logo
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff for Submit / Continue and input focus border; gray-300
//   input borders (dark:border-gray-600); error text text-sm text-red-500
// - h1 text-2xl bold; rounded-sm controls; eye icons inside the inputs
// - Responsive: the image panel is hidden below lg (hidden lg:block), so
//   small screens show only the form

// What it does:
// - State: complete, error, showPassword, showConfirmation, password,
//   confirmation (both inputs are controlled)
// - Eye / eye-off buttons toggle each input between "password" and "text"
// - submit() prevents the default submit; if the two values differ it sets
//   "Your passwords do not match" (role="alert"), otherwise it clears the
//   error and sets complete to true (demo only, no API call)
// - Links (plain anchors, full page load): "Continue" and "Sign in" both
//   go to /auth/sign-in-side
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
//     key: 'authentication.resetPasswordSide',
//     path: `${AUTH_PREFIX_PATH}/reset-password-side`,
//     component: lazy(() => import('@/TestComponent/ResetPasswordDemoSide')),
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

export function ResetPasswordPageSideImageLayout({
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
                'flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                className,
            )}
            {...props}
        >
            <section className="flex flex-1 flex-col items-center justify-center">
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
                        <a className="block rounded-sm bg-[#2a85ff] px-4 py-2 text-center font-semibold text-white" href="/auth/sign-in-side">Continue</a>
                    )}
                    <p className="mt-4 text-center">Back to <a className="font-bold" href="/auth/sign-in-side">Sign in</a></p>
                </div>
            </section>
            <aside className="relative hidden max-w-[720px] flex-1 overflow-hidden rounded-3xl lg:block">
                <img className="absolute inset-0 h-full w-full object-cover" src="/img/others/auth-side-bg.png" alt="" />
            </aside>
        </main>
    )
}

export default ResetPasswordPageSideImageLayout