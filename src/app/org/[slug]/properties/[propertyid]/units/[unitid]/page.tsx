import React from 'react'

interface UnitPageProps {
    params: Promise<{ unitid: string }>
}
const UnitPage = async ({ params }: UnitPageProps) => {
    const { unitid } = await params;
    return (
        <div className="space-y-2 p-2">
            <h1 className="text-2xl ">Unit {unitid}</h1>
        </div>
    )
}

export default UnitPage