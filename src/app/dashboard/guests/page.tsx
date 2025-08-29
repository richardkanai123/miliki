import UnAuthenticated from '@/components/authentication/Unauthenticated';
import ErrorAlert from '@/components/ErrorAlert';
import GuestsLister from '@/components/guests/GuestsLister';
import { getUserGuests } from '@/lib/actions/guests/GetUserGuests';
import { checkAuth } from '@/lib/checkAuth';
import React from 'react'

const GuestsPage = async () => {
    const session = await checkAuth();
    if (!session) {
        return (
            <UnAuthenticated />
        );
    }

    const userId = session.user.id;

    const { message, success, guests } = await getUserGuests(userId);
    if (!success) {
        return <ErrorAlert errorMessage={message} />;
    }

    return (
        <GuestsLister guests={guests || []} />
    )
}

export default GuestsPage