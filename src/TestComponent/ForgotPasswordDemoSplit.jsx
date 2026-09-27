// ForgotPasswordPageSplitScreenLayout

// ForgotPasswordDemoSplit · Authentication page demo (Split layout)

// Description:
// Full-page "Forgot Password" screen split into a blue brand panel (left)
// and the form (right). The user enters an email and presses Submit, then
// sees a "Check your email" confirmation with a Continue button. A "Back
// to Sign in" link is always shown.

// Design:
// - Full-screen grid (min-h-screen, p-6) with two equal columns from lg
//   (lg:grid-cols-2): left brand panel, right form column (centered,
//   max-w-[450px] px-8); no logo
// - Brand panel: rounded-3xl, bg brand blue #2a85ff, white text, px-16,
//   /img/others/auth-split-img.png (max-w-[450px], 2xl:max-w-[700px]),
//   headline "The easiest way to build your admin app" and a short Ecme
//   blurb at opacity-80
// - Page bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100;
//   #2a85ff Submit / Continue buttons and input focus border; gray-300
//   input border (dark:border-gray-600); h1 text-2xl bold
// - Responsive: the brand panel is hidden below lg (hidden lg:flex), so
//   small screens show a single form column

// What it does:
// - useState(emailSent), initially false
// - Form submit is prevented and sets emailSent to true (demo only, no
//   API call); heading / subtitle text change and the form is replaced by
//   a "Continue" link
// - Links (plain anchors, full page load): "Continue" and "Sign in" both
//   go to /auth/sign-in-side
// - No content props.

// Note: the "Continue" and "Back to Sign in" links point to
// /auth/sign-in-side instead of the matching /auth/sign-in-split route.

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
//     key: 'authentication.forgotPasswordSplit',
//     path: `${AUTH_PREFIX_PATH}/forgot-password-split`,
//     component: lazy(() => import('@/TestComponent/ForgotPasswordDemoSplit')),
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

export function ForgotPasswordPageSplitScreenLayout({
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
        </main>
    )
}

export default ForgotPasswordPageSplitScreenLayout