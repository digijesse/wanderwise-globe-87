
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface TravelDestination {
  name: string;
  lat: number;
  lng: number;
  description: string;
  days: number;
}

export interface TravelItinerary {
  destinations: TravelDestination[];
  title: string;
  subtitle: string;
  summary: string;
}
