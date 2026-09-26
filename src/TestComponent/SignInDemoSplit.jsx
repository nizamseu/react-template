import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

const SignInDemoSplit = () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <main className="grid min-h-screen bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100 lg:grid-cols-2">
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

export default SignInDemoSplit