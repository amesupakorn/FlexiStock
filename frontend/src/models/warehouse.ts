
export interface Warehouse {
    id: string;
    name: string;
    location: string;
    capacity: number;
    lat: any;
    lng: any;
  }
  

export interface NearestWarehouse {
    warehouse: any;
    distance_km: number;
    estimated_time_mins: number;
}
