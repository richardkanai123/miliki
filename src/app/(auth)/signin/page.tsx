import LoggedUserDialog from '@/components/authentication/LoggedUserDialog'
import SignInForm from '@/components/authentication/SignInForm'
import { checkAuth } from '@/lib/checkAuth'

const SignInPage = async () => {
    const session = await checkAuth()
    if (session) {
        const CurrentUserEmail = session.user.email
        const CurrentUserName = session.user.username || session.user.name

        return (
            <LoggedUserDialog CurrentUserEmail={CurrentUserEmail} CurrentUserName={CurrentUserName} />
        )
    }
    return (
        <SignInForm />
    )
}

export default SignInPage