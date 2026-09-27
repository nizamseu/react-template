// SignUpPageSimpleCenteredLayout

// SignUpDemoSimple · Authentication page demo (Simple layout)

// Description:
// Full-page registration screen with the Ecme logo, a "Sign Up" heading,
// a form with User name, Email, Password and Confirm Password fields, a
// Sign Up button and an "Already have an account? Sign in" link, all in
// one centered column.

// Design:
// - Full-screen main (min-h-screen, flex, centered, px-5 py-10) with one
//   column (w-full, min-w-[320px], max-w-[400px]); no side panel and no
//   card border or shadow
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff for the submit button and input focus border; inputs
//   have gray-300 borders (dark:border-gray-600)
// - 60px logo that swaps per theme (dark:hidden / dark:block); h1 text-2xl
//   bold, semibold gray subtitle, rounded-sm inputs and button
// - No responsive breakpoints; the column simply shrinks to 320px minimum

// What it does:
// - Stateless (arrow function with implicit JSX return, no hooks)
// - All four inputs are uncontrolled and required; form submit is
//   prevented (demo only, no API call, no password-match check)
// - Link (plain anchor, full page load): "Sign in" goes to
//   /auth/sign-in-simple
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
//     key: 'authentication.signUpSimple',
//     path: `${AUTH_PREFIX_PATH}/sign-up-simple`,
//     component: lazy(() => import('@/TestComponent/SignUpDemoSimple')),
//     authority: [ADMIN, USER],
//     meta: {
//         layout: 'blank',
//         pageContainerType: 'gutterless',
//         footer: false,
//     },
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SignUpPageSimpleCenteredLayout({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
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
                <header className="mb-8">
                    <h1 className="mb-1 text-2xl font-bold">Sign Up</h1>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">And lets get started with your free trial</p>
                </header>
                <form onSubmit={(event) => event.preventDefault()}>
                    <label className="mb-1 block font-semibold" htmlFor="userName">User name</label>
                    <input required id="userName" className="mb-4 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600" type="text" autoComplete="off" placeholder="User Name" />
                    <label className="mb-1 block font-semibold" htmlFor="email">Email</label>
                    <input required id="email" className="mb-4 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600" type="email" autoComplete="off" placeholder="Email" />
                    <label className="mb-1 block font-semibold" htmlFor="password">Password</label>
                    <input required id="password" className="mb-4 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600" type="password" autoComplete="off" placeholder="Password" />
                    <label className="mb-1 block font-semibold" htmlFor="confirmPassword">Confirm Password</label>
                    <input required id="confirmPassword" className="mb-5 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600" type="password" autoComplete="off" placeholder="Confirm Password" />
                    <button className="w-full rounded-sm bg-[#2a85ff] px-4 py-2 font-semibold text-white" type="submit">Sign Up</button>
                </form>
                <p className="mt-6 text-center">Already have an account? <a className="font-bold" href="/auth/sign-in-simple">Sign in</a></p>
            </section>
        </main>
    )
}

export default SignUpPageSimpleCenteredLayout