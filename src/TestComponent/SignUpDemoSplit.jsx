// SignUpPageSplitScreenLayout

// SignUpDemoSplit · Authentication page demo (Split layout)

// Description:
// Full-page registration screen split into two halves: a blue brand panel
// with an illustration and marketing text on the left, and the sign-up
// form on the right (Ecme logo, "Sign Up" heading, User name, Email,
// Password, Confirm Password, Sign Up button, "Sign in" link).

// Design:
// - Full-screen grid (min-h-screen, p-6) with two equal columns from lg
//   (lg:grid-cols-2): left brand panel, right form column (centered,
//   max-w-[450px] px-8)
// - Brand panel: rounded-3xl, bg brand blue #2a85ff, white text, px-16,
//   /img/others/auth-split-img.png (max-w-[450px], 2xl:max-w-[700px]),
//   headline "The easiest way to build your admin app" (text-3xl bold)
//   and a short Ecme blurb at opacity-80
// - Page bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100;
//   #2a85ff submit button and input focus border; gray-300 input borders
//   (dark:border-gray-600); 60px logo that swaps per theme
// - Responsive: the brand panel is hidden below lg (hidden lg:flex), so
//   small screens show a single form column

// What it does:
// - Stateless (arrow function with implicit JSX return, no hooks)
// - All four inputs are uncontrolled and required; form submit is
//   prevented (demo only, no API call, no password-match check)
// - Link (plain anchor, full page load): "Sign in" goes to
//   /auth/sign-in-split
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
//     key: 'authentication.signUpSplit',
//     path: `${AUTH_PREFIX_PATH}/sign-up-split`,
//     component: lazy(() => import('@/TestComponent/SignUpDemoSplit')),
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

export function SignUpPageSplitScreenLayout({
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
                    <p className="mt-6 text-center">Already have an account? <a className="font-bold" href="/auth/sign-in-split">Sign in</a></p>
                </div>
            </section>
        </main>
    )
}

export default SignUpPageSplitScreenLayout