import { lazy } from 'react'
import { AUTH_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'

const authDemoRoute = [
    {
        key: 'authentication.signInSimple',
        path: `${AUTH_PREFIX_PATH}/sign-in-simple`,
        component: lazy(() => import('@/TestComponent/SignInDemoSimple')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signInSide',
        path: `${AUTH_PREFIX_PATH}/sign-in-side`,
        component: lazy(() => import('@/TestComponent/SignInDemoSide')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signInSplit',
        path: `${AUTH_PREFIX_PATH}/sign-in-split`,
        component: lazy(() => import('@/TestComponent/SignInDemoSplit')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSimple',
        path: `${AUTH_PREFIX_PATH}/sign-up-simple`,
        component: lazy(() => import('@/TestComponent/SignUpDemoSimple')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSide',
        path: `${AUTH_PREFIX_PATH}/sign-up-side`,
        component: lazy(() => import('@/TestComponent/SignUpDemoSide')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSplit',
        path: `${AUTH_PREFIX_PATH}/sign-up-split`,
        component: lazy(() => import('@/TestComponent/SignUpDemoSplit')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.resetPasswordSimple',
        path: `${AUTH_PREFIX_PATH}/reset-password-simple`,
        component: lazy(() => import('@/TestComponent/ResetPasswordDemoSimple')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.resetPasswordSide',
        path: `${AUTH_PREFIX_PATH}/reset-password-side`,
        component: lazy(() => import('@/TestComponent/ResetPasswordDemoSide')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.resetPasswordSplit',
        path: `${AUTH_PREFIX_PATH}/reset-password-split`,
        component: lazy(() => import('@/TestComponent/ResetPasswordDemoSplit')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.forgotPasswordSimple',
        path: `${AUTH_PREFIX_PATH}/forgot-password-simple`,
        component: lazy(() => import('@/TestComponent/ForgotPasswordDemoSimple')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.forgotPasswordSide',
        path: `${AUTH_PREFIX_PATH}/forgot-password-side`,
        component: lazy(() => import('@/TestComponent/ForgotPasswordDemoSide')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.forgotPasswordSplit',
        path: `${AUTH_PREFIX_PATH}/forgot-password-split`,
        component: lazy(() => import('@/TestComponent/ForgotPasswordDemoSplit')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.otpVerificationSplit',
        path: `${AUTH_PREFIX_PATH}/otp-verification-split`,
        component: lazy(() => import('@/TestComponent/OtpVerificationDemoSplit')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.otpVerificationSide',
        path: `${AUTH_PREFIX_PATH}/otp-verification-side`,
        component: lazy(() => import('@/TestComponent/OtpVerificationDemoSide')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.otpVerificationSimple',
        path: `${AUTH_PREFIX_PATH}/otp-verification-simple`,
        component: lazy(() => import('@/TestComponent/OtpVerificationDemoSimple')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default authDemoRoute
