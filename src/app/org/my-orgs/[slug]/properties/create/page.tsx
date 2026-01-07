import { Suspense } from 'react'
import CreatePropertyForm from '@/components/property/create-property-form'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

const CreatePropertyPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params

  const { members, total } = await auth.api.listMembers({
    headers: await headers(),
    query: {
      organizationSlug: slug,
      filterField: 'role',
      filterValue: 'manager',
    }
  })

  const managers = members?.map((member: any) => ({
    id: member.id,
    name: member.user.name,
    image: member.user.image,
  }))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePropertyForm managers={managers} />
    </Suspense>
  )
}

export default CreatePropertyPage