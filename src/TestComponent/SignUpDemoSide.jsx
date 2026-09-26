const SignUpDemoSide = () => (
    <main className="flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <section className="flex flex-1 flex-col items-center justify-center">
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
                <p className="mt-6 text-center">Already have an account? <a className="font-bold" href="/auth/sign-in-side">Sign in</a></p>
            </div>
        </section>
        <aside className="relative hidden max-w-[720px] flex-1 overflow-hidden rounded-3xl lg:block">
            <img className="absolute inset-0 h-full w-full object-cover" src="/img/others/auth-side-bg.png" alt="" />
        </aside>
    </main>
)

export default SignUpDemoSide