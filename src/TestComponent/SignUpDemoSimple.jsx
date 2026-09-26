const SignUpDemoSimple = () => (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-10 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
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

export default SignUpDemoSimple