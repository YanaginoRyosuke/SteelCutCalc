"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// 文字列の CutSpec とコンポーネント
import { CutSpec, CutSpecInput } from "@/features/CustSpecInput";
// 計算結果表示
import { CuttingPlanResult } from "@/features/CuttingPlanResult";

interface CutSpecNumber {
  length: number;
  quantity: number;
}

interface CuttingPlan {
  standardBarUsed: number;
  cuts: CutSpecNumber[];
  waste: number;
}

export default function SteelCuttingCalculator() {
  // 文字列で管理
  const [standardLength, setStandardLength] = useState<string>("");
  const [bladeThickness, setBladeThickness] = useState<string>("");

  // 切断仕様一覧（文字列型で管理）
  const [cutSpecs, setCutSpecs] = useState<CutSpec[]>([{ length: "", quantity: "" }]);

  // 計算結果
  const [result, setResult] = useState<CuttingPlan[]>([]);

  // 切断仕様を追加
  const addCutSpec = () => {
    setCutSpecs((prev) => [...prev, { length: "", quantity: "" }]);
  };

  // 切断仕様の値変更（文字列を受け取る）
  const updateCutSpec = (index: number, field: keyof CutSpec, value: string) => {
    setCutSpecs((prev) => {
      const newCutSpecs = [...prev];
      newCutSpecs[index][field] = value;
      return newCutSpecs;
    });
  };

  // ★ 切断仕様の行を削除する処理
  const removeCutSpec = (index: number) => {
    setCutSpecs((prev) => {
      const newCutSpecs = [...prev];
      newCutSpecs.splice(index, 1);
      return newCutSpecs;
    });
  };

  // 計算処理
  const calculateCuttingPlan = () => {
    // 入力された文字列を数値に変換（パースできなければ0）
    const stdLen = parseInt(standardLength, 10) || 0;
    const bladeThick = parseInt(bladeThickness, 10) || 0;

    // 切断仕様を数値として扱う配列に変換
    const numericCutSpecs: CutSpecNumber[] = cutSpecs.map((spec) => ({
      length: parseInt(spec.length, 10) || 0,
      quantity: parseInt(spec.quantity, 10) || 0,
    }));

    // 長さが長い順にソート
    const sortedCutSpecs = [...numericCutSpecs].sort((a, b) => b.length - a.length);
    const remainingCuts = sortedCutSpecs.map((spec) => ({ ...spec }));
    const cuttingPlan: CuttingPlan[] = [];

    // 切断本数が残っている限り繰り返す
    while (remainingCuts.some((cut) => cut.quantity > 0)) {
      const currentBar: CuttingPlan = {
        standardBarUsed: cuttingPlan.length + 1,
        cuts: [],
        waste: stdLen,
      };
      let barSpace = stdLen;

      // 長いものから順に入るだけ切っていく
      for (let i = 0; i < remainingCuts.length; i++) {
        while (remainingCuts[i].quantity > 0 && barSpace >= remainingCuts[i].length + bladeThick) {
          currentBar.cuts.push({
            length: remainingCuts[i].length,
            quantity: 1,
          });
          barSpace -= remainingCuts[i].length + bladeThick;
          remainingCuts[i].quantity--;
        }
      }
      currentBar.waste = barSpace;
      cuttingPlan.push(currentBar);
    }

    // 同じ長さの切断をまとめる
    const optimizedPlan = cuttingPlan.map((bar) => {
      const combinedCuts = bar.cuts.reduce((acc, cut) => {
        const existingCut = acc.find((c) => c.length === cut.length);
        if (existingCut) {
          existingCut.quantity += cut.quantity;
        } else {
          acc.push({ ...cut });
        }
        return acc;
      }, [] as CutSpecNumber[]);
      return { ...bar, cuts: combinedCuts };
    });

    setResult(optimizedPlan);
  };

  /**
   * 数値だけを受け付ける入力制限付きハンドラー
   */
  const handleNumericInput = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 空文字または0~9の数字のみを許容し、先頭に0がつくことは許容しない
    if (value === "" || (/^\d+$/.test(value) && value !== "0")) {
      setter(value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">鋼材切断自動計算</h1>
      <div className="grid gap-4">
        {/* 定尺・刃厚入力 */}
        <div>
          <Label htmlFor="standardLength">定尺の長さ (mm)</Label>
          <Input id="standardLength" type="text" value={standardLength} onChange={handleNumericInput(setStandardLength)} />
        </div>
        <div>
          <Label htmlFor="bladeThickness">切断の刃幅 (mm)</Label>
          <Input id="bladeThickness" type="text" value={bladeThickness} onChange={handleNumericInput(setBladeThickness)} />
        </div>

        <div>
          <p className="text-xl font-bold my-5">切断データ</p>
          <div className="flex gap-2 mb-5">
            <Button onClick={addCutSpec}>切断データを追加</Button>
            <Button className="bg-[#458af7] hover:bg-[#3365b5]" onClick={calculateCuttingPlan}>
              計算
            </Button>
          </div>
          {cutSpecs.map((spec, index) => (
            <CutSpecInput key={index} index={index} spec={spec} onChange={updateCutSpec} onDelete={removeCutSpec} />
          ))}
        </div>
      </div>

      <CuttingPlanResult result={result} standardLength={parseInt(standardLength, 10) || 0} />
    </div>
  );
}
