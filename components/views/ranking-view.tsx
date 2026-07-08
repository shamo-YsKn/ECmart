"use client"

import { useMemo, useState } from "react"
import type { CartApi } from "@/lib/use-cart"
import { getShop, formatYen, products } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuantityStepper } from "@/components/product-card"
import { Plus, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const RANGES = [
  { key: "all", label: "総合" },
  { key: "食品", label: "食品" },
  { key: "工芸", label: "工芸" },
  { key: "喫茶", label: "喫茶" },
] as const

const MEDALS = ["#e8842f", "#b0b4ba", "#c9955b"]

export function RankingView({ cart }: { cart: CartApi }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("all")

  const ranked = useMemo(() => {
    const list = products
      .filter((p) => {
        if (range === "all") return true
        return getShop(p.shopId)?.category === range
      })
      .slice()
      .sort((a, b) => b.soldCount - a.soldCount)
    return list.slice(0, 10)
  }, [range])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display flex items-center gap-2 text-3xl font-black">
          <TrendingUp className="size-7 text-primary" />
          ランキング
        </h1>
        <p className="text-muted-foreground">町のみんなが選んだ、人気の品をチェック。</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <Button
            key={r.key}
            size="sm"
            variant={range === r.key ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setRange(r.key)}
          >
            {r.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {ranked.map((p, i) => {
          const shop = getShop(p.shopId)
          const qty = cart.quantityOf(p.id)
          return (
            <Card key={p.id} className="overflow-hidden border-2">
              <CardContent className="flex items-center gap-4 p-3 sm:p-4">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-black",
                    i < 3 ? "text-white" : "bg-muted text-muted-foreground",
                  )}
                  style={i < 3 ? { backgroundColor: MEDALS[i] } : undefined}
                >
                  {i + 1}
                </div>
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ backgroundColor: `${shop?.color}1a` }}
                >
                  {p.emoji}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-xs text-muted-foreground">
                    {shop?.emoji} {shop?.name}
                  </span>
                  <h3 className="font-display truncate font-bold">{p.name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold">{formatYen(p.price)}</span>
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {p.soldCount.toLocaleString("ja-JP")} 個販売
                    </Badge>
                  </div>
                </div>
                <div className="shrink-0">
                  {qty > 0 ? (
                    <QuantityStepper quantity={qty} onChange={(q) => cart.setQuantity(p.id, q)} />
                  ) : (
                    <Button size="sm" className="rounded-full" onClick={() => cart.addItem(p.id)}>
                      <Plus data-icon="inline-start" />
                      <span className="hidden sm:inline">カゴに入れる</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
