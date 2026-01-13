import DefaultLoader from "@/components/skeletons/default-loader";
import { Button } from "@/components/ui/button";
import AddUnitForm from "@/components/units/add-unit-form";
import { getPropertyById } from "@/lib/dal/properties/get-property-by-id";
import { ArrowLeftIcon, Building, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

interface AddUnitsPageProps {
    params: Promise<{ propertyid: string, slug: string }>
}

const AddUnitsPage = async ({ params }: AddUnitsPageProps) => {
    const { propertyid, slug } = await params;

    // We await the property data. A loading.tsx in this directory would handle the loading state.
    const { property } = await getPropertyById(propertyid);

    if (!property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-4">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Property Not Found</h1>
                    <p className="text-muted-foreground max-w-[500px]">
                        The property you are looking for does not exist or you don't have permission to view it.
                    </p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                    <Link href={`/org/${slug}/properties`}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Properties
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                        <Link href={`/org/${slug}/properties/${propertyid}`}>
                            <ArrowLeftIcon className="w-4 h-4 mr-1" />
                            Back to Details
                        </Link>
                    </Button>
                </div>

                {/* Property Context Badge */}
                <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 border shadow-sm">
                    <Building className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Property:</span>
                    <span className="text-sm font-semibold text-foreground max-w-[150px] sm:max-w-xs truncate" title={property.name}>
                        {property.name}
                    </span>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Form Content */}
            <Suspense fallback={<div className="w-full h-[600px] flex items-center justify-center"><DefaultLoader /></div>}>
                <AddUnitForm propertyId={propertyid} slug={slug} />
            </Suspense>
        </div>
    );
};

export default AddUnitsPage;
