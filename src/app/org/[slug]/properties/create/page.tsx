import { Suspense } from 'react'
import CreatePropertyForm from '@/components/property/create-property-form'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import DefaultLoader from '@/components/skeletons/default-loader'

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
    <div className="w-full mx-auto flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-bold">Create Property for {slug}</h1>
      <Suspense fallback={<DefaultLoader />}>
        <CreatePropertyForm managers={managers} />
      </Suspense>
    </div>
  )
}

export default CreatePropertyPage