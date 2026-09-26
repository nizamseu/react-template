import { useState } from 'react'

const ForgotPasswordDemoSplit = () => {
    const [emailSent, setEmailSent] = useState(false)

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

export default ForgotPasswordDemoSplit