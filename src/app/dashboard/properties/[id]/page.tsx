import ErrorAlert from '@/components/ErrorAlert'
import PropertyFeatures from '@/components/property/PropertyFeatures'
import { GetPropertyById } from '@/lib/actions/properties/getSpecificProperty'
import {
    MapPin,
    Calendar,
    Home,
    Building2,
    Bed,
    Bath,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    Star
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Edit, Settings } from 'lucide-react'

const PropertyDetailsPage = async (params: { params: Promise<{ id: string }> }) => {
    const { id } = await params.params

    const { message, property, success } = await GetPropertyById(id)
    if (!success) {
        return <ErrorAlert errorMessage={message} />
    }

    if (!property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-center space-y-4">
                    <Home className="w-16 h-16 text-gray-400 mx-auto" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Property Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">{message || "The requested property does not exist."}</p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const {
        title,
        description,
        location,
        status,
        createdAt,
        bedrooms,
        bathrooms,
        cleaningFee,
        serviceFee,
        internetFee,
        securityDeposit
    } = property

    const statusColors = {
        AVAILABLE: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        BOOKED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        UNAVAILABLE: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            {/* Status and Location Banner */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-blue-900 dark:text-blue-100 font-medium">{location}</span>
                            </div>
                            <Badge
                                variant="outline"
                                className={`text-sm font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.AVAILABLE}`}
                            >
                                {status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Created {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                About This Property
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
                        </CardContent>
                    </Card>

                    {/* Key Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                Key Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Bed className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bedrooms}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Bath className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bathrooms}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">4</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Max Guests</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">85%</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                Amenities & Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PropertyFeatures property={property} variant='detailed' maxFeatures={20} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Pricing Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                Pricing & Fees
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cleaning Fee</span>
                                    <span className="font-medium">{formatCurrency(cleaningFee)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Service Fee</span>
                                    <span className="font-medium">{formatCurrency(serviceFee)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Internet Fee</span>
                                    <span className="font-medium">{formatCurrency(internetFee)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Security Deposit</span>
                                    <span className="font-medium">{formatCurrency(securityDeposit)}</span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">Total Fees</span>
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(cleaningFee + serviceFee + internetFee + securityDeposit)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Property
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Users className="w-4 h-4 mr-2" />
                                Manage Bookings
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <DollarSign className="w-4 h-4 mr-2" />
                                View Analytics
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Settings className="w-4 h-4 mr-2" />
                                Property Settings
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Property Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                Property Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                                    <div className="text-xs text-green-700 dark:text-green-300">Total Bookings</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">KES 45K</div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">Monthly Revenue</div>
                                </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</div>
                                <div className="text-xs text-purple-700 dark:text-purple-300">Guest Rating</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PropertyDetailsPage