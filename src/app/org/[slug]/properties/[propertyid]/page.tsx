import DefaultLoader from "@/components/skeletons/default-loader"
import { getPropertyById } from "@/lib/dal/properties/get-property-by-id"
import { Suspense } from "react"

interface PageProps {
    params: Promise<{ propertyid: string }>
}

async function PropertyContent({ propertyid }: { propertyid: string }) {
    const { message, success, property } = await getPropertyById(propertyid)
    if (!success) {
        return <div>{message}</div>
    }
    if (!property) {
        return <div>Property not found</div>
    }
    return <div>PropertyPage {propertyid}</div>
}

const PropertyPage = async (props: PageProps) => {
    const { propertyid } = await props.params
    return (
        <Suspense fallback={<DefaultLoader />}>
            <PropertyContent propertyid={propertyid} />
        </Suspense>
    )
}

export default PropertyPage
