import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CreatePropertyInput, PropertySizesEnum, PropertyStatusEnum } from '@/lib/schemas/NewPropertySchema'
import { getPropertyIcon, IconWrapper } from '@/lib/Icons'
import { UseFormReturn } from 'react-hook-form'

interface BasicInformationStepProps {
    form: UseFormReturn<Partial<CreatePropertyInput>>
}




const BasicInformationStep = ({ form }: BasicInformationStepProps) => (
    <div className="w-full flex-1 flex flex-col gap-4 ">
        <div className="">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Title *</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Modern 2BR Apartment in Westlands" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="">
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe your property in detail..."
                                className="min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4 justify-between ">
            <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                    <FormItem className="">
                        <FormLabel>Property Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {PropertySizesEnum.options.map((size) => (
                                    <SelectItem key={size} value={size}>
                                        {size.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {PropertyStatusEnum.options.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center align-middle gap-2">
                            <IconWrapper className="h-4 w-4 mr-2" variant="muted">
                                {React.createElement(getPropertyIcon('bedrooms'))}
                            </IconWrapper>
                            Beds *
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={0}
                                max={20}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center align-middle  gap-2">
                            <IconWrapper className="h-4 w-4 mr-2" variant="muted">
                                {React.createElement(getPropertyIcon('bathrooms'))}
                            </IconWrapper>
                            Bathrooms *
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    </div>
)

export default BasicInformationStep