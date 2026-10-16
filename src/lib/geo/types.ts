export type Airport = {
  kind: "airport";
  iata: string;
  icao?: string | undefined;
  name: string;
  city: string;
  countryCode: string;
  country: string;
  region: string;
  /** OurAirports scheduled_service flag: true = regular commercial service reported. */
  scheduled: boolean;
};

export type City = {
  kind: "city";
  id: number;
  name: string;
  countryCode: string;
  country: string;
  region: string;
  population: number;
};

export type ManualPlace = { kind: "manual"; text: string };

export type AirportValue = Airport | ManualPlace | null;
export type CityValue = City | ManualPlace | null;
