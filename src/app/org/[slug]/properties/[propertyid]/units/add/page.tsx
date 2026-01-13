import DefaultLoader from "@/components/skeletons/default-loader";
import { Button } from "@/components/ui/button";
import AddUnitForm from "@/components/units/add-unit-form";
import { getPropertyById } from "@/lib/dal/properties/get-property-by-id";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface AddUnitsPageProps {
    params: Promise<{ propertyid: string, slug: string }>
}
const AddUnitsPage = async ({ params }: AddUnitsPageProps) => {
    const { propertyid, slug } = await params;
    const { property } = await getPropertyById(propertyid);

    return (
        <Suspense fallback={<DefaultLoader />}>

            {
                property ? (
                    <div className="space-y-2 p-2 w-full ">
                        <div className="flex items-center justify-between gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/org/${slug}/properties/${propertyid}`}>
                                    <ArrowLeftIcon className="size-4 mr-1" />
                                    <span className="text-sm hidden md:block">Back to Properties</span>
                                </Link>
                            </Button>
                            <h1 className="text-xl ">Property: {property.name}</h1>
                        </div>
                        <Suspense fallback={<div>Loading...</div>}>
                            <AddUnitForm propertyId={propertyid} slug={slug} />
                        </Suspense>
                    </div>
                ) : (
                    <div className="space-y-2 p-2">
                        <h1 className="text-2xl ">Property not found</h1>
                        <p className="text-sm text-muted-foreground">The property you are looking for does not exist.</p>
                        <Button variant="outline" asChild>
                            <Link href={`/org/${slug}/properties`}>
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to properties
                            </Link>
                        </Button>
                    </div>
                )
            }
        </Suspense>
    );
};
export default AddUnitsPage;    