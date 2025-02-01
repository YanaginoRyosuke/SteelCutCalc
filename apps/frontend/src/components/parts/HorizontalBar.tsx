// HorizontalBar.tsx
"use client";

import { CutItem } from "@/type/type";

interface HorizontalBarProps {
  cutItems: CutItem[];
  standardLength: number;
}

/**
 * 横棒グラフを描画するコンポーネント
 * - createCutItems() で得た cutItems をもとに、セグメントの幅 (%) を計算
 * - 最後のセグメントで「残り幅を全て使う」方式で誤差を吸収
 */
export function HorizontalBar({ cutItems, standardLength }: HorizontalBarProps) {
  if (standardLength <= 0) return null;

  // セグメント配列: quantity > 1 なら複数セグメントに分割
  type Segment = {
    length: number; // mm
    color: string;
    isWaste: boolean;
    widthPct?: number; // 後で計算
  };

  const segments: Segment[] = [];
  for (const item of cutItems) {
    for (let i = 0; i < item.quantity; i++) {
      segments.push({
        length: item.length,
        color: item.color,
        isWaste: item.isWaste,
      });
    }
  }

  // 先に「最後のセグメント」を除いた合計幅を計算してから、最後のセグメントだけ残り幅を使い切る
  let totalPctSoFar = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    const ratio = segments[i].length / standardLength;
    const widthPct = ratio * 100;
    segments[i].widthPct = widthPct;
    totalPctSoFar += widthPct;
  }
  if (segments.length > 0) {
    const lastIdx = segments.length - 1;
    const remainder = 100 - totalPctSoFar;
    segments[lastIdx].widthPct = remainder < 0 ? 0 : remainder;
  }

  return (
    <div className="w-full h-6 flex border border-gray-300 rounded overflow-hidden">
      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const borderStyle = isLast ? "" : "1px solid #fff"; // 最後のセグメントに区切り線を付けない

        return (
          <div
            key={idx}
            className="relative h-full"
            style={{
              width: `${seg.widthPct ?? 0}%`,
              backgroundColor: seg.color,
              borderRight: borderStyle,
            }}
          >
            {/* セグメントの中央に長さ(mm)を表示。残材は「残材 xxxmm」などにしてもOK */}
            {(seg.widthPct ?? 0) > 0 && (
              <span
                className="absolute left-1/2 top-1/2 text-xs font-bold whitespace-nowrap"
                style={{
                  transform: "translate(-50%, -50%)",
                  color: seg.isWaste ? "#333" : "#fff",
                }}
              >
                {!seg.isWaste ? `${seg.length}mm` : null}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
