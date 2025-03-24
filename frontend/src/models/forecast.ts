import { JSX } from "react/jsx-runtime";

export interface ForecastPoint {
    map(arg0: (point: { ds: string | number | Date; yhat: number; yhat_lower: number; yhat_upper: number; }, index: React.Key | null | undefined) => JSX.Element): import("react").ReactNode;
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