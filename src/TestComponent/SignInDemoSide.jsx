// SignInPageSideImageLayout

// SignInDemoSide · Authentication page demo (Side layout)

// Description:
// Full-page sign-in screen with the form on the left and a large rounded
// background image on the right. The form shows the Ecme logo, "Welcome
// back!" heading, pre-filled email + password, a "Forgot password" link,
// a Sign In button, Google / Github buttons and a "Sign up" link.

// Design:
// - Full-screen flex row (min-h-screen, gap-6, p-6): form column on the
//   left (flex-1, centered, content max-w-[450px] px-8) and an image panel
//   on the right (flex-1, max-w-[720px], rounded-3xl, overflow-hidden)
//   showing /img/others/auth-side-bg.png with object-cover
// - bg-white / dark:bg-gray-800, text-gray-900 / dark:text-gray-100; brand
//   blue #2a85ff for the primary button and input focus border; inputs
//   have gray-300 borders (dark:border-gray-600)
// - 60px logo that swaps per theme (dark:hidden / dark:block); h1 text-2xl
//   bold, rounded-sm inputs and buttons, "or countinue with" divider
// - Responsive: the image panel is hidden below lg (hidden lg:block), so
//   small screens show only the form

// What it does:
// - useState(showPassword) toggles the password input between "password"
//   and "text" via an eye / eye-off icon button with an aria-label
// - Inputs are uncontrolled (defaultValue "admin-01@ecme.com" / "123Qwe")
//   and required; form submit is prevented (demo only, no API call)
// - Google / Github buttons have no click handler
// - Links (plain anchors, full page load): "Forgot password" goes to
//   /auth/forgot-password-side, "Sign up" goes to /auth/sign-up-side
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
//     key: 'authentication.signInSide',
//     path: `${AUTH_PREFIX_PATH}/sign-in-side`,
//     component: lazy(() => import('@/TestComponent/SignInDemoSide')),
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

export function SignInPageSideImageLayout({
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
                'flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                className,
            )}
            {...props}
        >
            <section className="flex flex-1 flex-col items-center justify-center">
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
                        <div className="mb-7 mt-2 text-right">
                            <a className="font-semibold underline" href="/auth/forgot-password-side">Forgot password</a>
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
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 px-3 py-2 dark:border-gray-600" type="button"><img className="h-[25px] w-[25px]" src="/img/others/google.png" alt="" />Google</button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 px-3 py-2 dark:border-gray-600" type="button"><img className="h-[25px] w-[25px]" src="/img/others/github.png" alt="" />Github</button>
                        </div>
                    </div>
                    <p className="mt-6 text-center">Don&apos;t have an account yet? <a className="font-bold" href="/auth/sign-up-side">Sign up</a></p>
                </div>
            </section>
            <aside className="relative hidden max-w-[720px] flex-1 overflow-hidden rounded-3xl lg:block">
                <img className="absolute inset-0 h-full w-full object-cover" src="/img/others/auth-side-bg.png" alt="" />
            </aside>
        </main>
    )
}

export default SignInPageSideImageLayout