import UnAuthenticated from '@/components/authentication/Unauthenticated';
import ErrorAlert from '@/components/ErrorAlert';
import GuestCard from '@/components/guests/GuestCard';
import { Guest } from '@/generated/prisma';
import { getUserGuests } from '@/lib/actions/guests/GetUserGuests';
import { checkAuth } from '@/lib/checkAuth';
import { redirect } from 'next/navigation';
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

    if (!guests || guests.length === 0) {
        return <div>No guests found.</div>;
    }


    return (
        <div className="w-full p-2 grid grid-cols-auto md:grid-cols-2 lg:grid-cols-3  gap-4 ">
            {
                guests.map((guest) => (
                    <GuestCard key={guest.id} guest={guest} />
                ))
            }
        </div>
    )
}

export default GuestsPage