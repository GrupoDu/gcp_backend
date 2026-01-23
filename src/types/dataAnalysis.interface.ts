export interface IProductionAnalysis {
  deliveredRegisterQuantity: number;
  notDeliveredRegisterQuantity: number;
  actualMonth: Date;
  nextMonth: Date;
}

export interface IProductProductionAnalysis extends IProductionAnalysis {
  productName: string;
}

export interface IEmployeeProductionAnalysis extends IProductionAnalysis {
  employeeName: string;
}
