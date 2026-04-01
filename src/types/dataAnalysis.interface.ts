export interface IProductionAnalysis {
  deliveredRegisterQuantity: number;
  notDeliveredRegisterQuantity: number;
  pendingRegisterQuantity: number;
  actualMonth: Date;
  nextMonth: Date;
}

/**
 * @extends {IProductionAnalysis}
 * @see {IProductionAnalysis}
 */
export interface IProductProductionAnalysis extends IProductionAnalysis {
  productName: string;
}

/**
 * @extends {IProductionAnalysis}
 * @see {IProductionAnalysis}
 * @Omit pendingRegisterQuantity
 */
export interface IEmployeeProductionAnalysis extends Omit<
  IProductionAnalysis,
  "pendingRegisterQuantity"
> {
  employeeName: string;
}
