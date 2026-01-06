import CreatePropertyForm from '@/components/property/create-property-form'
import { Suspense } from 'react'

const CreatePropertyPage = () => {

  const dummyOrgs = [
    {
      id: '1',
      name: 'Org 1',
    },
    {
      id: '2',
      name: 'Org 2',
    },
  ]

  const dummyManagers = [
    {
      id: '1',
      name: 'Manager 1',
    },
    {
      id: '2',
      name: 'Manager 2',
    },
  ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePropertyForm organizations={dummyOrgs} managers={dummyManagers} />
    </Suspense>
  )
}

export default CreatePropertyPage