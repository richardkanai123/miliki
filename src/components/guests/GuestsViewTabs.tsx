'use client'

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, TableIcon } from "lucide-react";

export type ViewType = "table" | "grid";

interface GuestsViewTabsProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
    tableContent: ReactNode;
    gridContent: ReactNode;
}

const GuestsViewTabs = ({
    currentView,
    onViewChange,
    tableContent,
    gridContent
}: GuestsViewTabsProps) => {
    return (
        <div className="space-y-4 mb-2">
            <Tabs value={currentView} onValueChange={(value: string) => onViewChange(value as ViewType)}>
                <div className="border-b border-border">
                    <TabsList className="grid w-full max-w-xs sm:max-w-md grid-cols-2 h-10 p-1 bg-muted/50 rounded-lg">
                        <TabsTrigger
                            value="table"
                            className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all"
                        >
                            <TableIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Table</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="grid"
                            className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all"
                        >
                            <Grid3X3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Grid</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="table" className="mt-4 space-y-4">
                    {tableContent}
                </TabsContent>

                <TabsContent value="grid" className="mt-4 space-y-4">
                    {gridContent}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GuestsViewTabs;
