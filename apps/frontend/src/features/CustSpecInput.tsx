"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";

export interface CutSpec {
  length: string;
  quantity: string;
}

interface CutSpecInputProps {
  index: number;
  spec: CutSpec;
  onChange: (index: number, field: keyof CutSpec, value: string) => void;
  onDelete: (index: number) => void; // ★ 削除用コールバック
}

/**
 * 数値だけを受け付けるためのハンドラー
 */
function handleNumericInput(e: ChangeEvent<HTMLInputElement>, callback: (value: string) => void) {
  const { value } = e.target;
  // 空文字または0~9の数字のみを許容し、先頭に0がつくことは許容しない
  if (value === "" || (/^\d+$/.test(value) && value !== "0")) {
    callback(value);
  }
}

export function CutSpecInput({ index, spec, onChange, onDelete }: CutSpecInputProps) {
  return (
    <div className="flex w-1/2 gap-5 items-end my-2">
      <div>
        <Label htmlFor={`length-${index}`}>切断する長さ (mm)</Label>
        <Input id={`length-${index}`} type="text" value={spec.length} onChange={(e) => handleNumericInput(e, (val) => onChange(index, "length", val))} />
      </div>
      <div>
        <Label htmlFor={`quantity-${index}`}>必要本数</Label>
        <Input id={`quantity-${index}`} type="text" value={spec.quantity} onChange={(e) => handleNumericInput(e, (val) => onChange(index, "quantity", val))} />
      </div>
      <div className="flex justify-end">
        <Button variant="destructive" onClick={() => onDelete(index)}>
          削除
        </Button>
      </div>
    </div>
  );
}
