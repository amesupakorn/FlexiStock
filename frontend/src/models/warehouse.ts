
export interface Warehouse {
    id: string;
    name: string;
    location: string;
    capacity: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lat: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lng: any;
  }
  

export interface NearestWarehouse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warehouse: Warehouse;
    distance_km: number;
    estimated_time_mins: number;
}
