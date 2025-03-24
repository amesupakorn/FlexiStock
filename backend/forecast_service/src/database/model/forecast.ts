
export interface ForecastPoint {
    ds: string;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
    product_id: string;
    warehouse_id: string;
  }
  
export interface ForecastResponse {
    [key: string]: ForecastPoint[];  }


export interface ForecastData {
  [warehouse_id: string]: {
    [product_id: string]: ForecastPoint[];
  };
}
  export const forecast: ForecastData = {};