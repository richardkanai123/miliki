'use client'
import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Plus } from "lucide-react"

const SuccessPage = () => {
    const searchParams = useSearchParams()
    const params = useParams()
    const propertyId = searchParams.get('property')
    const slug = params?.slug as string

    return (
        <div className="flex flex-col items-center justify-center align-middle  h-screen p-4">
            <Card className="w-full max-w-md shadow-lg border-muted/20">
                <CardHeader className="items-center text-center space-y-2 pb-2">
                    <div className="rounded-full ">
                        <CheckCircle2 className="m-auto h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl font-bold bg-green-100 p-3 mb-2 dark:bg-green-900/20">Property Created Successfully</CardTitle>
                    <CardDescription>
                        Your new property has been added to the organization.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4 pt-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-dashed text-sm text-muted-foreground">
                        <p>Property ID Reference:</p>
                        <code className="font-mono text-foreground font-semibold mt-1 block">
                            {propertyId || "N/A"}
                        </code>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-2">
                    <Button asChild className="w-full" size="lg">
                        <Link href={`/org/${slug}/properties/${propertyId}`}>
                            View Property Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button variant="outline" asChild>
                            <Link href={`/org/${slug}/properties`}>
                                View All Properties
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/org/${slug}/properties/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Another
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SuccessPage
