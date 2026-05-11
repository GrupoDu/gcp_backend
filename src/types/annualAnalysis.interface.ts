export interface IAnnualAnalysis {
  annual_analysis_uuid: string;
  month: number;
  year: number;
  delivered: number;
  not_delivered: number;
}
