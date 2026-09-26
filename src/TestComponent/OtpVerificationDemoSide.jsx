import { useState } from 'react'

const OtpVerificationDemoSide = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [message, setMessage] = useState('')
    const [verified, setVerified] = useState(false)

    const updateDigit = (index, value) => {
        setOtp((current) => current.map((digit, digitIndex) => digitIndex === index ? value.slice(-1).replace(/\D/g, '') : digit))
        setMessage('')
    }

    const submit = (event) => {
        event.preventDefault()
        if (otp.some((digit) => !digit)) {
            setMessage('Please enter a valid OTP')
            return
        }
        setVerified(true)
        setMessage('OTP verified!')
    }

    return (
        <main className="flex min-h-screen gap-6 bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <section className="flex flex-1 flex-col items-center justify-center">
                <div className="w-full max-w-[450px] px-8">
                    <header className="mb-8">
                        <h1 className="mb-2 text-2xl font-bold">OTP Verification</h1>
                        <p className="font-semibold text-gray-600 dark:text-gray-300">We have sent you One Time Password to your email.</p>
                    </header>
                    {message && <p className={`mb-4 rounded-sm px-3 py-2 text-sm ${verified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`} role="status">{message}</p>}
                    {!verified && (
                        <form onSubmit={submit}>
                            <div className="mb-5 flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input key={index} aria-label={`OTP digit ${index + 1}`} className="h-[58px] min-w-0 flex-1 rounded-sm border border-gray-300 bg-transparent text-center text-xl outline-none focus:border-[#2a85ff] dark:border-gray-600" type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(event) => updateDigit(index, event.target.value)} />
                                ))}
                            </div>
                            <button className="w-full rounded-sm bg-[#2a85ff] px-4 py-2 font-semibold text-white" type="submit">Verify OTP</button>
                        </form>
                    )}
                    <div className="mt-4 text-center">
                        <span className="font-semibold">Didn&apos;t receive OTP? </span>
                        <button className="font-bold underline" type="button" onClick={() => setMessage('We have sent you One Time Password.')}>Resend OTP</button>
                    </div>
                </div>
            </section>
            <aside className="relative hidden max-w-[720px] flex-1 overflow-hidden rounded-3xl lg:block">
                <img className="absolute inset-0 h-full w-full object-cover" src="/img/others/auth-side-bg.png" alt="" />
            </aside>
        </main>
    )
}

export default OtpVerificationDemoSide