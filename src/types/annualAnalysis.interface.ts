export interface IAnnualAnalysis {
  annual_analysis_uuid: string;
  month: number;
  year: number;
  delivered: number;
  total_production: number;
  not_delivered: number;
}
