import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import DeleteOrgDialog from './delete-org-dialog'
import { Button } from '@/components/ui/button'
import ActivateOrg from './activate-org'
import Link from 'next/link'
import type { Organization } from '@/lib/auth'
import { Badge } from '../ui/badge'
import { Building2, Calendar, Users } from 'lucide-react'

const OrgCard = ({ org, activeOrg }: { org: Organization, activeOrg: string }) => {
    const isActive = activeOrg === org.id

    return (
        <Card key={org.id} className={`flex flex-col h-full transition-all hover:shadow-md ${isActive ? 'border-primary/50 bg-primary/5' : ''}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        {org.name}
                        {isActive && <Badge variant="default" className="text-[10px] h-5">Active</Badge>}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                        <Building2 className="h-3 w-3" />
                        {org.slug || 'No slug'}
                    </CardDescription>
                </div>
                <DeleteOrgDialog organizationId={org.id} organizationName={org.name} />
            </CardHeader>
            <CardContent className="flex-1 py-2">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(org.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Placeholder for member count if available in future */}
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Members</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-4">
                <Suspense fallback={<Button variant="outline" disabled className="w-full">Loading...</Button>}>
                    {isActive ? (
                        <Button asChild variant="secondary" className="w-full">
                            <Link href={`/org/my-orgs/${org.id}`}>Manage Organization</Link>
                        </Button>
                    ) : (
                        <div className="flex w-full gap-2">
                            <ActivateOrg organizationId={org.id} />
                            <Button asChild variant="outline" className="flex-1">
                                <Link href={`/org/my-orgs/${org.id}`}>Details</Link>
                            </Button>
                        </div>
                    )}
                </Suspense>
            </CardFooter>
        </Card>
    )
}

export default OrgCard
