// SignInPageSplitScreenLayout

// SignInDemoSplit · Authentication page demo (Split layout)

// Description:
// Full-page sign-in screen split into two halves: a blue brand panel with
// an illustration and marketing text on the left, and the sign-in form on
// the right (Ecme logo, "Welcome back!", pre-filled email + password,
// "Forgot password", Sign In, Google / Github buttons, "Sign up" link).

// Design:
// - Full-screen grid (min-h-screen, p-6) with two equal columns from lg
//   (lg:grid-cols-2): left brand panel, right form column (centered,
//   max-w-[450px] px-8)
// - Brand panel: rounded-3xl, bg brand blue #2a85ff, white text, px-16,
//   /img/others/auth-split-img.png (max-w-[450px], 2xl:max-w-[700px]),
//   headline "The easiest way to build your admin app" (text-3xl bold)
//   and a short Ecme blurb at opacity-80
// - Page bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100;
//   #2a85ff primary button and input focus border; gray-300 input borders
//   (dark:border-gray-600); 60px logo that swaps per theme
// - Responsive: the brand panel is hidden below lg (hidden lg:flex), so
//   small screens show a single form column

// What it does:
// - useState(showPassword) toggles the password input between "password"
//   and "text" via an eye / eye-off icon button with an aria-label
// - Inputs are uncontrolled (defaultValue "admin-01@ecme.com" / "123Qwe")
//   and required; form submit is prevented (demo only, no API call)
// - Google / Github buttons have no click handler
// - Links (plain anchors, full page load): "Forgot password" goes to
//   /auth/forgot-password-split, "Sign up" goes to /auth/sign-up-split
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
//     key: 'authentication.signInSplit',
//     path: `${AUTH_PREFIX_PATH}/sign-in-split`,
//     component: lazy(() => import('@/TestComponent/SignInDemoSplit')),
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

export function SignInPageSplitScreenLayout({
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
                    <header className="mb-10">
                        <h1 className="mb-2 text-2xl font-bold">Welcome back!</h1>
                        <p className="font-semibold text-gray-600 dark:text-gray-300">Please enter your credentials to sign in!</p>
                    </header>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <label className="mb-1 block font-semibold" htmlFor="email">Email</label>
                        <input required id="email" className="mb-5 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#2a85ff] dark:border-gray-600" type="email" autoComplete="off" defaultValue="admin-01@ecme.com" placeholder="Email" />
                        <label className="mb-1 block font-semibold" htmlFor="password">Password</label>
                        <div className="relative">
                            <input required id="password" className="w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 pr-10 outline-none focus:border-[#2a85ff] dark:border-gray-600" type={showPassword ? 'text' : 'password'} autoComplete="off" defaultValue="123Qwe" placeholder="Password" />
                            <button className="absolute inset-y-0 right-3 text-gray-500" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>
                        <div className="mb-7 mt-2 text-right"><a className="font-semibold underline" href="/auth/forgot-password-split">Forgot password</a></div>
                        <button className="w-full rounded-sm bg-[#2a85ff] px-4 py-2 font-semibold text-white" type="submit">Sign In</button>
                    </form>
                    <div className="mt-8">
                        <div className="mb-6 flex items-center gap-2">
                            <span className="mt-px flex-1 border-t border-gray-200 dark:border-gray-700" />
                            <p className="font-semibold text-gray-600 dark:text-gray-300">or countinue with</p>
                            <span className="mt-px flex-1 border-t border-gray-200 dark:border-gray-700" />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 px-3 py-2 dark:border-gray-600" type="button"><img className="h-[25px] w-[25px]" src="/img/others/google.png" alt="" />Google</button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 px-3 py-2 dark:border-gray-600" type="button"><img className="h-[25px] w-[25px]" src="/img/others/github.png" alt="" />Github</button>
                        </div>
                    </div>
                    <p className="mt-6 text-center">Don&apos;t have an account yet? <a className="font-bold" href="/auth/sign-up-split">Sign up</a></p>
                </div>
            </section>
        </main>
    )
}

export default SignInPageSplitScreenLayout