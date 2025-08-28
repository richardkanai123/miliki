"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Dummy revenue data for the last 6 months
const revenueData = [
    { month: "Jul", revenue: 38500, bookings: 22 },
    { month: "Aug", revenue: 41200, bookings: 25 },
    { month: "Sep", revenue: 39800, bookings: 24 },
    { month: "Oct", revenue: 43600, bookings: 28 },
    { month: "Nov", revenue: 40900, bookings: 26 },
    { month: "Dec", revenue: 45750, bookings: 30 },
];

const chartConfig = {
    revenue: {
        label: "Revenue (KSh)",
        color: "hsl(var(--chart-1))",
    },
    bookings: {
        label: "Bookings",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function RevenueChart() {
    const currentMonth = revenueData[revenueData.length - 1];
    const previousMonth = revenueData[revenueData.length - 2];
    const growthPercentage = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                    Monthly revenue over the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={revenueData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [
                                name === "revenue" ? `KSh ${value.toLocaleString()}` : value,
                                chartConfig[name as keyof typeof chartConfig]?.label || name,
                            ]}
                        />
                        <Line
                            dataKey="revenue"
                            type="monotone"
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-revenue)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">This Month</p>
                        <p className="font-semibold">KSh {currentMonth.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Growth</p>
                        <p className="font-semibold text-green-600">+{growthPercentage}%</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Bookings</p>
                        <p className="font-semibold">{currentMonth.bookings}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
