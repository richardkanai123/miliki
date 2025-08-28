"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Dummy occupancy data
const occupancyData = [
    { name: "Occupied", value: 18, fill: "hsl(var(--chart-1))" },
    { name: "Available", value: 6, fill: "hsl(var(--chart-2))" },
];

const chartConfig = {
    occupied: {
        label: "Occupied",
        color: "hsl(var(--chart-1))",
    },
    available: {
        label: "Available",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function OccupancyChart() {
    const occupancyRate = (occupancyData[0].value / (occupancyData[0].value + occupancyData[1].value)) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Occupancy Overview</CardTitle>
                <CardDescription>
                    Current property occupancy status
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={occupancyData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {occupancyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-chart-1"></div>
                        <span className="text-sm">Occupied: {occupancyData[0].value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-chart-2"></div>
                        <span className="text-sm">Available: {occupancyData[1].value}</span>
                    </div>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-sm text-muted-foreground">
                        {occupancyRate.toFixed(1)}% occupancy rate
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
