import { Navigate, Outlet } from 'react-router'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'

const { authenticatedEntryPath } = appConfig

const PublicRoute = ({ allowAuthenticated = false }) => {
    const { authenticated } = useAuth()

    return authenticated && !allowAuthenticated ? (
        <Navigate to={authenticatedEntryPath} />
    ) : (
        <Outlet />
    )
}

export default PublicRoute
