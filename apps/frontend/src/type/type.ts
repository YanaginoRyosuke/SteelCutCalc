export interface CutSpecNumber {
  length: number;
  quantity: number;
}

export interface CuttingPlan {
  standardBarUsed: number;
  cuts: CutSpecNumber[];
  waste: number;
}

export interface CuttingPlanResultProps {
  result: CuttingPlan[];
  standardLength: number;
}

export interface CutItem {
  length: number;
  quantity: number;
  color: string;
  isWaste: boolean;
}
