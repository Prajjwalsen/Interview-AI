import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)

        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data
        } catch (err) {
            console.error("Login failed:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)

        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data
        } catch (err) {
            console.error("Registration failed:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)

        try {
            await logout()

            // Correct: clear the current logged-in user.
            setUser(null)
        } catch (err) {
            console.error("Logout failed:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            setLoading(true)

            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                console.log(err)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [setLoading, setUser])

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout
    }
}