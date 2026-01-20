
const TenancyPage = async ({ params }: { params: Promise<{ tenancyId: string }> }) => {
    const { tenancyId } = await params
    return (
        <div>
            {tenancyId}
        </div>
    )
}

export default TenancyPage