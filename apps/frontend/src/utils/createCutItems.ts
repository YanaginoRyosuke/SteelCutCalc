// createCutItems.ts
import { CutSpecNumber, CutItem } from "@/type/type";

/**
 * 指定された cuts と waste から、
 *  - テキスト一覧表示用: { length, quantity, color, isWaste: false } のリスト
 *  - 横棒グラフ用: 単一本ごとのセグメント [{ length, color, isWaste }, ...]
 * の両方で使えるデータ構造を生成
 */
export function createCutItems(cuts: CutSpecNumber[], waste: number): CutItem[] {
  // カラーパレット（必要に応じて追加/変更）
  const colors = [
    "#60a5fa", // Blue-400
    "#fbbf24", // Amber-400
    "#34d399", // Green-400
    "#f87171", // Red-400
    "#a78bfa", // Purple-400
    "#f472b6", // Pink-400
    "#fb923c", // Orange-400
  ];

  let colorIndex = 0;
  const cutItems: CutItem[] = [];

  // cuts を順番に回し、各 cut に 1 色を割り当てる
  for (const cut of cuts) {
    // 同じ cut(length) の塊には 1 色
    const color = colors[colorIndex % colors.length];
    colorIndex++;

    cutItems.push({
      length: cut.length,
      quantity: cut.quantity,
      color,
      isWaste: false,
    });
  }

  // waste を追加（あれば）
  if (waste > 0) {
    cutItems.push({
      length: waste,
      quantity: 1, // 残材は1セグメント扱い
      color: "#e5e7eb", // gray-200
      isWaste: true,
    });
  }

  return cutItems;
}
