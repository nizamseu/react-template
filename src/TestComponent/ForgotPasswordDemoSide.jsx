import { useState } from 'react'

const ForgotPasswordDemoSide = () => {
    const [emailSent, setEmailSent] = useState(false)

    return (
        <main className="flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
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

export default ForgotPasswordDemoSide