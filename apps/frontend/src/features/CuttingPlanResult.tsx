// CuttingPlanResult.tsx
"use client";

import { HorizontalBar } from "@/components/parts/HorizontalBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CuttingPlanResultProps } from "@/type/type";
import { createCutItems } from "@/utils/createCutItems";

export function CuttingPlanResult({ result, standardLength }: CuttingPlanResultProps) {
  if (!result.length) return null;

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">計算結果</CardTitle>
        <CardDescription className="text-lg font-bold text-red-600">必要な定尺の本数: {result.length}本</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {result.map((plan, index) => {
          // cuts と waste からテキスト/グラフ両用のデータを作成
          const cutItems = createCutItems(plan.cuts, plan.waste);

          return (
            <div key={index} className="p-4 border rounded-md shadow-sm bg-gray-50">
              <h3 className="font-bold mb-4 text-lg text-gray-800">
                定尺 {plan.standardBarUsed}本目 / 残材 {plan.waste}mm
              </h3>

              {/* 横棒グラフ */}
              <HorizontalBar cutItems={cutItems} standardLength={standardLength} />

              {/* テキスト一覧(色付きバレットを表示) */}
              <ul className="mb-2 mt-4 space-y-1 text-sm text-gray-700">
                {cutItems
                  // waste 以外だけ表示
                  .filter((item) => !item.isWaste)
                  .map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {/* 色付き丸 */}
                      <div className="inline-block w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: item.color }} />
                      {/* 長さ(mm) x 本数 */}
                      <span>
                        {item.length}mm × {item.quantity}本
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
