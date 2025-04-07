"use client"
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import CurrentMonth from "./CurrentMonth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartConfig = {
  Employé: {
    label: "Employé",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function PrévisionsTotal() {

// Define the type for the API response item
interface RoleDataItem {
  count: number; // Employee count
  etat: string; // State or status
}
const [chartData, setChartData] = React.useState<{ browser: string; Employé: number; fill: string }[]>([]);

  // دالة ترجع لون لكل فئة
  const getColor = (category: string) => {
    switch (category) {
      case "prévision":
        return "var(--color-chrome)";
      case "notifié":
        return "var(--color-safari)";
      default:
        return "#ccc";
    }
  };

// تحميل البيانات من Laravel API
React.useEffect(() => {
  fetch("http://localhost:8000/api/PrévisionsTotal") // رابط API
    .then((res) => {
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      return res.json();
    })
    .then((res) => {
      let data = res.data; // <-- هنا نأخذ الـ data من داخل الـ response
      const transformed = data.map((item:RoleDataItem) => ({
        etat: item.etat,                // اسم الفئة
        Employé: item.count,              // عدد الموظفين
        fill: getColor(item.etat),         // لون الفئة
      }));
      setChartData(transformed);
    })
    .catch((err) => console.error("خطأ أثناء جلب البيانات:", err));
  }, []);
  
  
  const totalEmployé = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.Employé,0)
  }, [chartData])
    return (

        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Les Statistiques Des Prévisions Total </CardTitle>
                <CardDescription> <CurrentMonth /> </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
            {chartData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                لا توجد بيانات لعرضها.
              </div>
              ) : (
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
                            data={chartData}
                            dataKey="Employé"
                            nameKey="etat"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalEmployé.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Employé
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Pie Chart <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">

                </div>
            </CardFooter>
        </Card>
    );
}
