// SignInPageSimpleCenteredLayout

// SignInDemoSimple · Authentication page demo (Simple layout)

// Description:
// Full-page sign-in screen with the Ecme logo, a "Welcome back!" heading,
// an email + password form pre-filled with demo credentials, a "Forgot
// password" link, a Sign In button, Google / Github social buttons and a
// "Sign up" link, all in one centered column.

// Design:
// - Full-screen main (min-h-screen, flex, centered, px-5 py-10) with one
//   column (w-full, min-w-[320px], max-w-[400px]); no side panel and no
//   card border or shadow
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff for the primary button and input focus border; inputs
//   have gray-300 borders (dark:border-gray-600) and transparent background
// - 60px logo that swaps per theme (logo-dark-streamline.png in light
//   mode, logo-light-streamline.png in dark mode via dark:hidden /
//   dark:block); h1 text-2xl bold, semibold gray subtitle, rounded-sm
//   inputs and buttons, "or countinue with" divider between two lines
// - No responsive breakpoints; the column simply shrinks to 320px minimum

// What it does:
// - useState(showPassword) toggles the password input between "password"
//   and "text" via an eye / eye-off icon button with an aria-label
// - Inputs are uncontrolled (defaultValue "admin-01@ecme.com" / "123Qwe")
//   and required; form submit is prevented (demo only, no API call)
// - Google / Github buttons have no click handler
// - Links (plain anchors, full page load): "Forgot password" goes to
//   /auth/forgot-password-simple, "Sign up" goes to /auth/sign-up-simple
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
//     key: 'authentication.signInSimple',
//     path: `${AUTH_PREFIX_PATH}/sign-in-simple`,
//     component: lazy(() => import('@/TestComponent/SignInDemoSimple')),
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

export function SignInPageSimpleCenteredLayout({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false)

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
                <div className="mb-8 flex justify-center">
                    <img className="h-[60px] dark:hidden" src="/img/logo/logo-dark-streamline.png" alt="Ecme" />
                    <img className="hidden h-[60px] dark:block" src="/img/logo/logo-light-streamline.png" alt="Ecme" />
                </div>
                <header className="mb-10">
                    <h1 className="mb-2 text-2xl font-bold">Welcome back!</h1>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        Please enter your credentials to sign in!
                    </p>
                </header>
                <form onSubmit={(event) => event.preventDefault()}>
                    <label className="mb-1 block font-semibold" htmlFor="email">Email</label>
                    <input
                        required
                        id="email"
                        className="mb-5 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600"
                        type="email"
                        autoComplete="off"
                        defaultValue="admin-01@ecme.com"
                        placeholder="Email"
                    />
                    <label className="mb-1 block font-semibold" htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            required
                            id="password"
                            className="w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 pr-10 outline-none focus:border-[#2a85ff] dark:border-gray-600"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="off"
                            defaultValue="123Qwe"
                            placeholder="Password"
                        />
                        <button
                            className="absolute inset-y-0 right-3 text-gray-500"
                            type="button"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                        </button>
                    </div>
                    <div className="mb-7 mt-2 text-right">
                        <a className="font-semibold underline" href="/auth/forgot-password-simple">Forgot password</a>
                    </div>
                    <button className="w-full rounded-sm bg-[#2a85ff] px-4 py-2 font-semibold text-white" type="submit">Sign In</button>
                </form>
                <div className="mt-8">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="mt-px flex-1 border-t border-gray-200 dark:border-gray-700" />
                        <p className="font-semibold text-gray-600 dark:text-gray-300">or countinue with</p>
                        <span className="mt-px flex-1 border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 px-3 py-2 dark:border-gray-600" type="button">
                            <img className="h-[25px] w-[25px]" src="/img/others/google.png" alt="" />Google
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 px-3 py-2 dark:border-gray-600" type="button">
                            <img className="h-[25px] w-[25px]" src="/img/others/github.png" alt="" />Github
                        </button>
                    </div>
                </div>
                <p className="mt-6 text-center">
                    Don&apos;t have an account yet? <a className="font-bold" href="/auth/sign-up-simple">Sign up</a>
                </p>
            </section>
        </main>
    )
}

export default SignInPageSimpleCenteredLayout