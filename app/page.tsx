"use client"

import { useState } from "react"
import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { HomeView } from "@/components/views/home-view"
import { ShopsView } from "@/components/views/shops-view"
import { RankingView } from "@/components/views/ranking-view"
import { CartView } from "@/components/views/cart-view"
import { RobotWorkshop } from "@/components/robot/robot-workshop"
import { Home, Store, TrendingUp, Hammer, ShoppingBag } from "lucide-react"

const TABS = [
  { key: "home", label: "ホーム", icon: Home },
  { key: "shops", label: "ショップ一覧", icon: Store },
  { key: "ranking", label: "ランキング", icon: TrendingUp },
  { key: "robot", label: "ロボット工房", icon: Hammer },
  { key: "cart", label: "カート", icon: ShoppingBag },
] as const

function BoltMark() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
      <polygon
        points="20,3 34,11 34,29 20,37 6,29 6,11"
        fill="var(--color-primary)"
      />
      <circle cx="20" cy="20" r="7" fill="var(--color-background)" />
      <circle cx="20" cy="20" r="3" fill="var(--color-primary)" />
    </svg>
  )
}

export default function Page() {
  const cart = useCart()
  const [tab, setTab] = useState<string>("home")

  function navigate(next: string) {
    setTab(next)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <button
            className="flex items-center gap-2"
            onClick={() => navigate("home")}
            aria-label="ホームへ"
          >
            <BoltMark />
            <span className="font-display text-xl font-black tracking-tight">
              マチノワ
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {TABS.filter((t) => t.key !== "cart").map((t) => (
              <Button
                key={t.key}
                variant="ghost"
                className={cn(
                  "rounded-full",
                  tab === t.key && "bg-muted text-foreground",
                )}
                onClick={() => navigate(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </nav>

          <Button
            variant={tab === "cart" ? "default" : "outline"}
            className="relative rounded-full"
            onClick={() => navigate("cart")}
          >
            <ShoppingBag data-icon="inline-start" />
            <span className="hidden sm:inline">カート</span>
            {cart.totalCount > 0 && (
              <Badge className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full p-0 tabular-nums">
                {cart.totalCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* メイン */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 md:pb-16">
        {tab === "home" && <HomeView cart={cart} onNavigate={navigate} />}
        {tab === "shops" && <ShopsView cart={cart} />}
        {tab === "ranking" && <RankingView cart={cart} />}
        {tab === "robot" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-3xl font-black">ロボット工房</h1>
              <p className="text-muted-foreground">
                てつ工房ボルタ監修。ボルタ＆ナッティ風の、あなただけの鉄の仲間をデザインしよう。
              </p>
            </div>
            <RobotWorkshop />
          </div>
        )}
        {tab === "cart" && <CartView cart={cart} onNavigate={navigate} />}
      </main>

      {/* フッター */}
      <footer className="hidden border-t md:block">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BoltMark />
            <span className="font-display text-base font-bold text-foreground">マチノワ</span>
          </div>
          <p>町とつながる体験型マーケット。※これはデモサイトです。</p>
        </div>
      </footer>

      {/* モバイル下部ナビ */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5">
          {TABS.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => navigate(t.key)}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[0.65rem] transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <t.icon className="size-5" />
                {t.key === "cart" && cart.totalCount > 0 && (
                  <span className="absolute right-[calc(50%-1.35rem)] top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-primary-foreground">
                    {cart.totalCount}
                  </span>
                )}
                <span className="leading-none text-pretty">{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
