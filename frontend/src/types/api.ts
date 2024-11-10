export interface Vehicle {
  model: string;
  organization: number;
  licence_plate: string;
  slug: string;
  is_at_workshop: boolean;
}

export interface Workshop {
  name: string;
}

export interface ResponsableTeam {
  name: string;
  type: string;
}

export interface User {
  name: string;
}

export interface VehicleEntryRegistry {
  vehicle: Vehicle;
  vehicle_km: number;
  workshop: Workshop;
  problem_reported: string;
  responsable_team: ResponsableTeam;
  author: User;
  created_at: Date;
}
