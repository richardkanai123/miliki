interface UnitsPageProps {
    params: Promise<{ propertyid: string }>
}
const UnitsPage = async ({ params }: UnitsPageProps) => {
    const { propertyid } = await params

    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold tracking-tight">
                Units for {propertyid}
            </h1>
        </div>
    )
}

export default UnitsPage