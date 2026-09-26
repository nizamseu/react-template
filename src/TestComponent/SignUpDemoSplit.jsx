const SignUpDemoSplit = () => (
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

export default SignUpDemoSplit