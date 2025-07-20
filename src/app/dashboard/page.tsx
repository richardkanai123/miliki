import UnAuthenticated from "@/components/authentication/Unauthenticated";
import PropertyLink from "@/components/property/PropertyLink";
import { getProperties } from "@/lib/actions/properties/getUserProperties"
import { checkAuth } from "@/lib/checkAuth";

export default async function MainDashboard() {
  const session = await checkAuth()

  if (!session) {
    return (
      <UnAuthenticated />
    )
  }
  const userId = session.user.id;
  const { properties, message, success } = await getProperties(userId);

  if (!success || properties?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold">No Properties Found</h1>
        <p className="mt-2 text-gray-600">{message || "You have no properties listed."}</p>
      </div>
    )
  }


  return (
    <div className="flex items-center gap-2 justify-center-safe min-h-screen flex-wrap p-4">
      {properties?.map((property) => (
        <PropertyLink key={property.id} property={property} />
      ))}
    </div>
  )
}
