const PropertiesPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params
    console.log(id)
    return (
        <div>PropertiesPage</div>
    )
}

export default PropertiesPage