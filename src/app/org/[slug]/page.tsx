import { Suspense } from 'react'
import OrgDetail from '@/components/org/org-detail'
import { OrgDetailSkeleton } from '@/components/skeletons/org-skeletons'

interface PageProps {
    params: Promise<{ slug: string }>
}

const OrgDetailsPage = async (props: PageProps) => {
    return (
        <Suspense fallback={<OrgDetailSkeleton />}>
            <   OrgDetail params={props.params} />
        </Suspense >
    )
}

export default OrgDetailsPage
