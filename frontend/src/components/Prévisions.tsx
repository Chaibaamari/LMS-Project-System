"use client"
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import CurrentMonth from "./CurrentMonth"
import { SelectDemo } from "../components/filtering"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ✅ تحديد لون حسب etat ونوع التداخل
const getColorByEtatAndCategory = (etat: string, category: string) => {
  if (etat === "prévision") {
    if (category === "start-end") return "#3b82f6"
    if (category === "end-only") return "#60a5fa"
    if (category === "start-only") return "#93c5fd"
  } else if (etat === "notifié") {
    if (category === "start-end") return "#10b981"
    if (category === "end-only") return "#34d399"
    if (category === "start-only") return "#6ee7b7"
  }
  return "#ccc"
}

// ✅ الحصول على الشهر الحالي بصيغة yyyy-mm
const getCurrentMonth = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const year = now.getFullYear()
  return `${year}-${month}`
}

export default function Prévisions() {
  const [chartData, setChartData] = React.useState<
    { label: string; Employé: number; fill: string }[]
  >([])
  const [selectedMonth, setSelectedMonth] = React.useState<string>(getCurrentMonth())

  interface RoleDataItem {
    count: number
    etat: string
    Date_Deb: string
    Date_fin: string
  }

  // ✅ تحميل البيانات
  React.useEffect(() => {
    fetch(`http://localhost:8000/api/Prévisions?month=${selectedMonth}`)
      .then((res) => res.json())
      .then((res) => {
        const data = res.data
        const [year, month] = selectedMonth.split("-")
        const monthIndex = parseInt(month) - 1

        const startOfMonth = new Date(parseInt(year), monthIndex, 1)
        const endOfMonth = new Date(parseInt(year), monthIndex + 1, 0)

        // ✅ تصنيف كل عنصر حسب نوع التداخل
        const categorized = data.map((item: RoleDataItem) => {
          const deb = new Date(item.Date_Deb)
          const fin = new Date(item.Date_fin)

          let category = ""
          if (deb >= startOfMonth && fin <= endOfMonth) category = "start-end"
          else if (deb <= startOfMonth && fin >= startOfMonth && fin <= endOfMonth) category = "end-only"
          else if (deb >= startOfMonth && deb <= endOfMonth && fin > endOfMonth) category = "start-only"

          return {
            label: `${item.etat} - ${category}`,
            Employé: item.count,
            fill: getColorByEtatAndCategory(item.etat, category),
          }
        })

        // ✅ دمج العناصر المتشابهة (نفس التسمية)
        const merged: { [key: string]: { Employé: number; fill: string } } = {}
        for (const item of categorized) {
          if (!item.label) continue
          if (merged[item.label]) {
            merged[item.label].Employé += item.Employé
          } else {
            merged[item.label] = { Employé: item.Employé, fill: item.fill }
          }
        }

        const finalData = Object.entries(merged).map(([label, data]) => ({
          label,
          ...data,
        }))

        setChartData(finalData)
      })
      .catch((err) => console.error("خطأ أثناء جلب البيانات:", err))
  }, [selectedMonth])

  const totalEmployé = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.Employé, 0)
  }, [chartData])

  return (
    <>
      <SelectDemo value={selectedMonth} onChange={setSelectedMonth} />
      <br />
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Les Statistiques Des Prévisions </CardTitle>
          <CardDescription>
            <CurrentMonth />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {chartData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
              لا توجد بيانات لعرضها.
            </div>
          ) : (
            <ChartContainer
              className="mx-auto aspect-square max-h-[250px]"
              config={{
                pie: {
                  label: "Pie Chart",
                  color: "#3b82f6",
                },
              }}
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="Employé" nameKey="label" innerRadius={60} strokeWidth={5}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
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
                              Prévisions
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
        </CardFooter>
      </Card>
    </>
  )
}
