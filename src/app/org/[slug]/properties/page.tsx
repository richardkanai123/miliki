import DefaultLoader from "@/components/skeletons/default-loader"
import { getPropertiesByOrg } from "@/lib/dal/properties/get-properties-by-orgid"
import { Suspense } from "react"

async function PropertiesContent({ slug }: { slug: string }) {
    const { properties, message, success } = await getPropertiesByOrg({ slug })
    console.log(properties, message, success)
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 p-6">
            <h1 className="text-2xl font-bold">Properties List for {slug}</h1>
            {/* Render properties here */}
        </div>
    )
}

const PropertiesPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    return (
        <Suspense fallback={<DefaultLoader />}>
            <PropertiesContent slug={slug} />
        </Suspense>
    )
}

export default PropertiesPage
