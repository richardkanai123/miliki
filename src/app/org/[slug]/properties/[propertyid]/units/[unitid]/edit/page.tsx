import { getUnit } from "@/lib/dal/units/get-unit"
import EditUnitForm from "@/components/units/edit-unit-form"
import DefaultErrorComponent from "@/components/error/default-error"
import { Suspense } from "react"

interface EditUnitPageProps {
    params: Promise<{
        unitid: string
        slug: string
        propertyid: string
    }>
}

const EditUnitPage = async ({ params }: EditUnitPageProps) => {
    const { unitid, slug } = await params
    const { success, unit, message } = await getUnit(unitid)

    if (!success || !unit) {
        return <DefaultErrorComponent reset={() => { }} message={message} label="Back to Unit Details" />
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditUnitForm unit={unit} slug={slug} />
        </Suspense>
    )
}

export default EditUnitPage
