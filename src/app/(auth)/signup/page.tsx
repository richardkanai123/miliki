import LoggedUserDialog from '@/components/authentication/LoggedUserDialog'
import SignUpForm from '@/components/authentication/signUpform'
import { checkAuth } from '@/lib/checkAuth'


const SignUpPage = async () => {
    const session = await checkAuth()
    if (session) {
        const CurrentUserEmail = session.user.email
        const CurrentUserName = session.user.username || session.user.name

        return (
            <LoggedUserDialog CurrentUserEmail={CurrentUserEmail} CurrentUserName={CurrentUserName} />
        )
    }
    return (
        <SignUpForm />
    )
}

export default SignUpPage