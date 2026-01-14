import { Suspense } from "react";
import UnitDetails from "@/components/units/unit-details";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";

interface UnitPageProps {
    params: Promise<{ unitid: string, slug: string, propertyid: string }>
}
const UnitPage = async ({ params }: UnitPageProps) => {
    const { unitid, slug, propertyid } = await params;
    return (
        <div className="space-y-2 p-2">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className=" text-muted-foreground hover:text-foreground">
                    <Link prefetch href={`/org/${slug}/properties/${propertyid}`}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Property
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link prefetch href={`/org/${slug}/properties/${propertyid}/units/${unitid}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Unit
                        </Link>
                    </Button>
                </div>
            </div>


            <Suspense fallback={<div>Loading...</div>}>
                <UnitDetails unitId={unitid} slug={slug} />
            </Suspense>
        </div>
    )
}

export default UnitPage