import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import { Badge } from '../ui/badge'

const Notifications = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                    <Bell className="h-4 w-4" />
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                    >
                        3
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                    <h4 className="font-semibold">Notifications</h4>
                    <Badge variant="secondary">2</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <div className="font-medium">Check-in today</div>
                    <div className="text-sm text-muted-foreground">2 guests checking in at Property A</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <div className="font-medium">Maintenance due</div>
                    <div className="text-sm text-muted-foreground">Kitchen repair needed at Property B</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <div className="font-medium">Payment received</div>
                    <div className="text-sm text-muted-foreground">KES 25,000 via M-Pesa</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Notifications