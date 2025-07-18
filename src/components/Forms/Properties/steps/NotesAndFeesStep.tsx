import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { UseFormReturn } from 'react-hook-form'
import { CreatePropertyInput } from '@/lib/schemas/NewPropertySchema'

interface NotesAndFeesStepProps {
    form: UseFormReturn<Partial<CreatePropertyInput>>
}


const NotesAndFeesStep = ({ form }: NotesAndFeesStepProps) => (
    <div className="space-y-6">
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Any additional information about the property..."
                            className="min-h-[100px]"
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Optional additional information, house rules, or special instructions
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <Separator />

        <div>
            <h3 className="text-lg font-semibold mb-4">Fees & Deposits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="cleaningFee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cleaning Fee (KES)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="serviceFee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Fee (KES)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="internetFee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Internet Fee (KES)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Security Deposit (KES)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    </div>
)

export default NotesAndFeesStep