import { Suspense } from "react"
import PropertyDetails from "@/components/property/PropertyDetails"
import DefaultLoader from "@/components/skeletons/default-loader"
import { getUserRoleInOrganization } from "@/lib/auth-check";
import Unauthorised from "@/components/auth/unauthorised";



interface PageProps {
    params: Promise<{ slug: string; propertyid: string }>
}

const PropertyPage = async ({ params }: PageProps) => {
    const { propertyid, slug } = await params

    const userRole = await getUserRoleInOrganization(slug)
    const canManageProperty = userRole === "owner" || userRole === "manager" || userRole === "admin"

    return (
        <Suspense fallback={<DefaultLoader />}>
            {canManageProperty ? (
                <PropertyDetails propertyid={propertyid} />
            ) : (
                <Unauthorised link={`/org/${slug}`} message="You are not authorized to access this property information" solution="Please contact the property owner/manager to get access" linkText="Go to organization page" />
            )}
        </Suspense>
    );
};

export default PropertyPage;
