// OTPVerificationPageSideImageLayout

// OtpVerificationDemoSide · Authentication page demo (Side layout)

// Description:
// Full-page "OTP Verification" screen with the form on the left and a
// large rounded background image on the right. The form has six
// single-digit boxes, "Verify OTP" and "Resend OTP"; a complete code
// shows "OTP verified!" and hides the form.

// Design:
// - Full-screen flex row (min-h-screen, gap-6, p-6): form column on the
//   left (flex-1, centered, content max-w-[450px] px-8) and an image panel
//   on the right (flex-1, max-w-[720px], rounded-3xl, overflow-hidden)
//   showing /img/others/auth-side-bg.png with object-cover; no logo
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff Verify button and input focus border; gray-300 input
//   borders (dark:border-gray-600)
// - Six equal boxes (gap-2, flex-1, h-[58px], text-center text-xl); status
//   message emerald when verified, red otherwise, with dark variants
// - Responsive: the image panel is hidden below lg (hidden lg:block), so
//   small screens show only the form

// What it does:
// - State: otp (array of 6 strings), message, verified
// - updateDigit(index, value) keeps only the last character, strips
//   non-digits and clears the message; inputs use inputMode="numeric",
//   maxLength 1 and an aria-label per digit (no auto-advance of focus)
// - submit() prevents the default submit; any empty digit sets "Please
//   enter a valid OTP", otherwise verified is set to true (demo only)
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
//     key: 'authentication.otpVerificationSide',
//     path: `${AUTH_PREFIX_PATH}/otp-verification-side`,
//     component: lazy(() => import('@/TestComponent/OtpVerificationDemoSide')),
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

export function OTPVerificationPageSideImageLayout({
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
                'flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                className,
            )}
            {...props}
        >
            <section className="flex flex-1 flex-col items-center justify-center">
                <div className="w-full max-w-[450px] px-8">
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
                </div>
            </section>
            <aside className="relative hidden max-w-[720px] flex-1 overflow-hidden rounded-3xl lg:block">
                <img className="absolute inset-0 h-full w-full object-cover" src="/img/others/auth-side-bg.png" alt="" />
            </aside>
        </main>
    )
}

export default OTPVerificationPageSideImageLayout