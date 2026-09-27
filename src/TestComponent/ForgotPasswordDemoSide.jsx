// ForgotPasswordPageSideImageLayout

// ForgotPasswordDemoSide · Authentication page demo (Side layout)

// Description:
// Full-page "Forgot Password" screen with the form on the left and a
// large rounded background image on the right. The user enters an email
// and presses Submit, then sees a "Check your email" confirmation with a
// Continue button. A "Back to Sign in" link is always shown.

// Design:
// - Full-screen flex row (min-h-screen, gap-6, p-6): form column on the
//   left (flex-1, centered, content max-w-[450px] px-8) and an image panel
//   on the right (flex-1, max-w-[720px], rounded-3xl, overflow-hidden)
//   showing /img/others/auth-side-bg.png with object-cover; no logo
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff for the Submit / Continue buttons and input focus border;
//   gray-300 input border (dark:border-gray-600)
// - h1 text-2xl bold with a semibold gray subtitle; rounded-sm controls
// - Responsive: the image panel is hidden below lg (hidden lg:block), so
//   small screens show only the form

// What it does:
// - useState(emailSent), initially false
// - Form submit is prevented and sets emailSent to true (demo only, no
//   API call); heading / subtitle text change and the form is replaced by
//   a "Continue" link
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
//     key: 'authentication.forgotPasswordSide',
//     path: `${AUTH_PREFIX_PATH}/forgot-password-side`,
//     component: lazy(() => import('@/TestComponent/ForgotPasswordDemoSide')),
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

export function ForgotPasswordPageSideImageLayout({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [emailSent, setEmailSent] = useState(false)

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
                        <h1 className="mb-2 text-2xl font-bold">{emailSent ? 'Check your email' : 'Forgot Password'}</h1>
                        <p className="font-semibold text-gray-600 dark:text-gray-300">
                            {emailSent ? 'We have sent a password recovery to your email' : 'Please enter your email to receive a verification code'}
                        </p>
                    </header>
                    {!emailSent ? (
                        <form onSubmit={(event) => { event.preventDefault(); setEmailSent(true) }}>
                            <label className="mb-1 block font-semibold" htmlFor="email">Email</label>
                            <input required id="email" className="mb-5 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600" type="email" placeholder="Email" autoComplete="off" />
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

export default ForgotPasswordPageSideImageLayout