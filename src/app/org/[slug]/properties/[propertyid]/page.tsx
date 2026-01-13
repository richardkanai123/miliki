import { PropertyTabsSection } from "@/components/property/property-tabs-section"
import PropertyDetails from "@/components/property/PropertyDetails"
import DefaultLoader from "@/components/skeletons/default-loader"

import { Suspense } from "react"
interface PageProps {
    params: Promise<{ slug: string; propertyid: string }>
}

const PropertyPage = async ({ params }: PageProps) => {
    const { slug, propertyid } = await params
    return (
        <Suspense fallback={<DefaultLoader />}>
            <PropertyDetails propertyid={propertyid} />
        </Suspense>
    )
}

export default PropertyPage
