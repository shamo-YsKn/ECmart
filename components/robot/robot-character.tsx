"use client"

import type { RobotConfig, RobotItem, RobotPose } from "@/lib/types"

/** ポーズごとの腕の角度（度）。0 = 真下、正の値で前方向へ */
const POSE_ANGLES: Record<RobotPose, { left: number; right: number }> = {
  stand: { left: 18, right: -18 },
  wave: { left: 20, right: -150 },
  cheer: { left: 150, right: -150 },
  point: { left: 15, right: -95 },
}

function darken(hex: string, amount = 0.16) {
  const c = hex.replace("#", "")
  const num = Number.parseInt(
    c.length === 3
      ? c
          .split("")
          .map((x) => x + x)
          .join("")
      : c,
    16,
  )
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  r = Math.max(0, Math.round(r * (1 - amount)))
  g = Math.max(0, Math.round(g * (1 - amount)))
  b = Math.max(0, Math.round(b * (1 - amount)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function HeldItem({ item, accent }: { item: RobotItem; accent: string }) {
  if (item === "none") return null
  switch (item) {
    case "wrench":
      return (
        <g transform="rotate(35)">
          <rect x={-4} y={-2} width={8} height={34} rx={4} fill="#9aa0a6" />
          <path
            d="M -9 -14 a 10 10 0 1 0 18 0 l -4 6 h -10 l -4 -6 z"
            fill="#b8bdc2"
            stroke="#7d8288"
            strokeWidth={1.5}
          />
        </g>
      )
    case "gear":
      return (
        <g>
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={-3}
              y={-20}
              width={6}
              height={9}
              rx={1.5}
              fill="#9aa0a6"
              transform={`rotate(${i * 45})`}
            />
          ))}
          <circle r={13} fill="#b8bdc2" stroke="#7d8288" strokeWidth={1.5} />
          <circle r={5} fill="#6d7278" />
        </g>
      )
    case "flower":
      return (
        <g>
          <rect x={-1.5} y={0} width={3} height={26} rx={1.5} fill="#5b8c5b" />
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={i}
              cx={0}
              cy={-11}
              rx={5}
              ry={9}
              fill={accent}
              transform={`rotate(${i * 60})`}
            />
          ))}
          <circle r={5} fill="#ffd34d" />
        </g>
      )
    case "heart":
      return (
        <path
          d="M0 8 C -12 -6 -20 4 0 18 C 20 4 12 -6 0 8 Z"
          transform="translate(0 -6) scale(0.9)"
          fill={accent}
          stroke={darken(accent, 0.2)}
          strokeWidth={1.5}
        />
      )
    default:
      return null
  }
}

function Arm({
  side,
  angle,
  bodyColor,
  item,
  accent,
}: {
  side: "left" | "right"
  angle: number
  bodyColor: string
  item: RobotItem
  accent: string
}) {
  const dark = darken(bodyColor, 0.14)
  const pivotX = side === "left" ? 44 : 156
  const pivotY = 138
  return (
    <g transform={`translate(${pivotX} ${pivotY}) rotate(${angle})`}>
      {/* 腕 */}
      <rect x={-9} y={-6} width={18} height={54} rx={9} fill={bodyColor} stroke={dark} strokeWidth={2} />
      <rect x={-9} y={-6} width={18} height={10} rx={5} fill={dark} opacity={0.4} />
      {/* 手（ナット風） */}
      <g transform="translate(0 54)">
        <circle r={12} fill="#c6cbd0" stroke="#8b9096" strokeWidth={2} />
        <circle r={5} fill="#6d7278" />
        {side === "right" && (
          <g transform="translate(0 6)">
            <HeldItem item={item} accent={accent} />
          </g>
        )}
      </g>
    </g>
  )
}

function Head({
  config,
  showFace,
}: {
  config: RobotConfig
  showFace: boolean
}) {
  const { base, accentColor } = config
  const metal = "#c6cbd0"
  const metalDark = "#8b9096"

  return (
   <g>
      {/* アンテナ（頭のボルトを少し細かく） */}
      <rect x={94} y={20} width={12} height={10} rx={2} fill={metalDark} />
      <circle cx={100} cy={20} r={4} fill={metal} stroke={metalDark} strokeWidth={2} />

      {base === "volta" ? (
        // ボルタ：六角ボルトの頭
        <polygon
          points="100,44 143,68 143,116 100,140 57,116 57,68"
          fill={metal}
          stroke={metalDark}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ) : (
        // ナッティ：皿ねじの丸い頭
        <>
          <circle cx={100} cy={92} r={46} fill={metal} stroke={metalDark} strokeWidth={3} />
          {/* ナッティ特有の十字の溝（画像より） */}
          <line x1={70} y1={62} x2={130} y2={122} stroke={metalDark} strokeWidth={6} strokeLinecap="round" />
          <line x1={130} y1={62} x2={70} y2={122} stroke={metalDark} strokeWidth={6} strokeLinecap="round" />
        </>
      )}

      {showFace && (
        <g>
          {/* ほっぺ（画像に合わせて少し位置を調整） */}
          <circle cx={75} cy={100} r={6} fill={accentColor} opacity={0.4} />
          <circle cx={125} cy={100} r={6} fill={accentColor} opacity={0.4} />
          
          {/* 目（皿ネジの十字溝を表現するため、中心に小さな点を追加） */}
          <circle cx={84} cy={90} r={8} fill="#3a3f45" />
          <circle cx={116} cy={90} r={8} fill="#3a3f45" />
          <line x1={80} y1={90} x2={88} y2={90} stroke="#555" strokeWidth={2} />
          <line x1={84} y1={86} x2={84} y2={94} stroke="#555" strokeWidth={2} />
          <line x1={112} y1={90} x2={120} y2={90} stroke="#555" strokeWidth={2} />
          <line x1={116} y1={86} x2={116} y2={94} stroke="#555" strokeWidth={2} />

          {/* 口（ワイヤーを曲げたようなライン） */}
          <path d="M90 110 Q100 120 110 110" fill="none" stroke="#3a3f45" strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}

export function RobotCharacter({
  config,
  className,
}: {
  config: RobotConfig
  className?: string
}) {
  const { bodyColor, accentColor, pose, item, view, size } = config
  const angles = POSE_ANGLES[pose]
  const dark = darken(bodyColor, 0.14)
  const showFace = view !== "back"

  const rotateY = view === "front" ? 0 : view === "side" ? -52 : 180
  const scale = 0.62 + ((size - 20) / 70) * 0.55

  return (
    <div
      className={className}
      style={{ perspective: "900px" }}
      aria-label="ロボットのプレビュー"
      role="img"
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotateY}deg) scale(${scale})`,
          transition: "transform 500ms cubic-bezier(0.34, 1.4, 0.4, 1)",
        }}
      >
        <svg viewBox="0 0 200 260" className="h-full w-full overflow-visible">
          {/* 影 */}
          <ellipse cx={100} cy={248} rx={54} ry={10} fill="#000" opacity={0.12} />

          {/* 奥の腕（背面時は反転で自然に見える） */}
          <Arm side="left" angle={angles.left} bodyColor={bodyColor} item="none" accent={accentColor} />

          {/* 脚 */}
          <g>
            <rect x={72} y={196} width={18} height={40} rx={9} fill={dark} />
            <rect x={110} y={196} width={18} height={40} rx={9} fill={dark} />
            <ellipse cx={81} cy={240} rx={16} ry={8} fill="#6d7278" />
            <ellipse cx={119} cy={240} rx={16} ry={8} fill="#6d7278" />
          </g>

          {/* 胴体 */}
          <g>
            <rect x={54} y={128} width={92} height={80} rx={22} fill={bodyColor} stroke={dark} strokeWidth={3} />
            {/* リベット */}
            {[
              [66, 140],
              [134, 140],
              [66, 196],
              [134, 196],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={3.5} fill={dark} />
            ))}
            {/* ネームプレート */}
            <rect x={72} y={158} width={56} height={26} rx={7} fill="#f4efe6" stroke={dark} strokeWidth={2} />
            <text
              x={100}
              y={176}
              textAnchor="middle"
              fontSize={showFace ? 12 : 0}
              fontWeight={700}
              fill={darken(bodyColor, 0.3)}
              style={{ fontFamily: "var(--font-heading), sans-serif" }}
            >
              {config.name ? config.name.slice(0, 4) : "★"}
            </text>
          </g>

          {/* 頭 */}
          <Head config={config} showFace={showFace} />

          {/* 手前の腕（持ち物つき） */}
          <Arm side="right" angle={angles.right} bodyColor={bodyColor} item={item} accent={accentColor} />
        </svg>
      </div>
    </div>
  )
}
