// Normalized location fields used by search suggestions and weather requests.
export type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};
