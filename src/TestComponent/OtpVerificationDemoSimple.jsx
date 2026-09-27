// OTPVerificationPageSimpleCenteredLayout

// OtpVerificationDemoSimple · Authentication page demo (Simple layout)

// Description:
// Full-page "OTP Verification" screen in one centered column with six
// single-digit input boxes, a "Verify OTP" button and a "Resend OTP"
// button. Submitting with all six digits shows "OTP verified!" and hides
// the form; an incomplete code shows "Please enter a valid OTP".

// Design:
// - Full-screen main (min-h-screen, flex, centered, px-5 py-10) with one
//   column (w-full, min-w-[320px], max-w-[400px]); no logo, no side panel,
//   no card border or shadow
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff Verify button and input focus border; gray-300 input
//   borders (dark:border-gray-600)
// - Six equal boxes in a flex row (gap-2, flex-1, min-w-0, h-[58px],
//   text-center text-xl, rounded-sm)
// - Status message box: emerald when verified, red otherwise, each with
//   dark-mode variants (dark:bg-emerald-900/30, dark:bg-red-900/30)
// - No responsive breakpoints; the boxes shrink with the column

// What it does:
// - State: otp (array of 6 strings), message, verified
// - updateDigit(index, value) keeps only the last character, strips
//   non-digits and clears the message; inputs use inputMode="numeric",
//   maxLength 1 and an aria-label per digit (no auto-advance of focus)
// - submit() prevents the default submit; any empty digit sets an error
//   message, otherwise verified is set to true (demo only, no API call)
// - "Resend OTP" only sets the message "We have sent you One Time
//   Password." (shown with the red style while not verified)
// - No links to other routes
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
//     key: 'authentication.otpVerificationSimple',
//     path: `${AUTH_PREFIX_PATH}/otp-verification-simple`,
//     component: lazy(() => import('@/TestComponent/OtpVerificationDemoSimple')),
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
import { cn } from '@/design-system/lib/cn';

export function OTPVerificationPageSimpleCenteredLayout({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [message, setMessage] = useState('')
    const [verified, setVerified] = useState(false)

    const updateDigit = (index, value) => {
        setOtp((current) => current.map((digit, digitIndex) => digitIndex === index ? value.slice(-1).replace(/\D/g, '') : digit))
        setMessage('')
    }

    const submit = (event) => {
        event.preventDefault()
        if (otp.some((digit) => !digit)) {
            setMessage('Please enter a valid OTP')
            return
        }
        setVerified(true)
        setMessage('OTP verified!')
    }

    return (
        <main
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'flex min-h-screen items-center justify-center bg-white px-5 py-10 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                className,
            )}
            {...props}
        >
            <section className="w-full min-w-[320px] max-w-[400px]">
                <header className="mb-8">
                    <h1 className="mb-2 text-2xl font-bold">OTP Verification</h1>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">We have sent you One Time Password to your email.</p>
                </header>
                {message && <p className={`mb-4 rounded-sm px-3 py-2 text-sm ${verified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`} role="status">{message}</p>}
                {!verified && (
                    <form onSubmit={submit}>
                        <div className="mb-5 flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input key={index} aria-label={`OTP digit ${index + 1}`} className="h-[58px] min-w-0 flex-1 rounded-sm border border-gray-300 bg-transparent text-center text-xl outline-none focus:border-[#2a85ff] dark:border-gray-600" type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(event) => updateDigit(index, event.target.value)} />
                            ))}
                        </div>
                        <button className="w-full rounded-sm bg-[#2a85ff] px-4 py-2 font-semibold text-white" type="submit">Verify OTP</button>
                    </form>
                )}
                <div className="mt-4 text-center">
                    <span className="font-semibold">Didn&apos;t receive OTP? </span>
                    <button className="font-bold underline" type="button" onClick={() => setMessage('We have sent you One Time Password.')}>Resend OTP</button>
                </div>
            </section>
        </main>
    )
}

export default OTPVerificationPageSimpleCenteredLayout