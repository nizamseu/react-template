import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

const ResetPasswordDemoSide = () => {
    const [complete, setComplete] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')

    const submit = (event) => {
        event.preventDefault()
        if (password !== confirmation) {
            setError('Your passwords do not match')
            return
        }
        setError('')
        setComplete(true)
    }

    return (
        <main className="flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <section className="flex flex-1 flex-col items-center justify-center">
                <div className="w-full max-w-[450px] px-8">
                    <header className="mb-6">
                        <h1 className="mb-1 text-2xl font-bold">{complete ? 'Reset done' : 'Set new password'}</h1>
                        <p className="font-semibold text-gray-600 dark:text-gray-300">{complete ? 'Your password has been successfully reset' : 'Your new password must different to previos password'}</p>
                    </header>
                    {!complete ? (
                        <form onSubmit={submit}>
                            {error && <p className="mb-4 text-sm text-red-500" role="alert">{error}</p>}
                            <label className="mb-1 block font-semibold" htmlFor="newPassword">Password</label>
                            <div className="relative mb-4">
                                <input required id="newPassword" className="w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 pr-10 outline-none focus:border-[#2a85ff] dark:border-gray-600" type={showPassword ? 'text' : 'password'} placeholder="••••••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
                                <button className="absolute inset-y-0 right-3 text-gray-500" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</button>
                            </div>
                            <label className="mb-1 block font-semibold" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative mb-5">
                                <input required id="confirmPassword" className="w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 pr-10 outline-none focus:border-[#2a85ff] dark:border-gray-600" type={showConfirmation ? 'text' : 'password'} placeholder="Confirm Password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
                                <button className="absolute inset-y-0 right-3 text-gray-500" type="button" aria-label={showConfirmation ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmation(!showConfirmation)}>{showConfirmation ? <HiOutlineEyeOff /> : <HiOutlineEye />}</button>
                            </div>
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

export default ResetPasswordDemoSide