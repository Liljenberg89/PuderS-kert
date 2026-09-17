export type Country = "SE" | "NO" | "AT" | "FR";

export interface Resort {
  id: string;
  name: string;
  country: Country;
  latitude: number;
  longitude: number;
}

export const resorts: Resort[] = [
  { id: "salen", name: "Sälen", country: "SE", latitude: 61.1594, longitude: 13.2636 },
  { id: "are", name: "Åre", country: "SE", latitude: 63.3998, longitude: 13.0803 },
  { id: "idre-fjall", name: "Idre Fjäll", country: "SE", latitude: 61.8817, longitude: 12.8385 },
  { id: "vemdalen", name: "Vemdalen", country: "SE", latitude: 62.4508, longitude: 13.9463 },

  { id: "trysil", name: "Trysil", country: "NO", latitude: 61.3103, longitude: 12.2657 },
  { id: "hemsedal", name: "Hemsedal", country: "NO", latitude: 60.8465, longitude: 8.5560 },
  { id: "geilo", name: "Geilo", country: "NO", latitude: 60.5322, longitude: 8.2036 },
  { id: "hafjell", name: "Hafjell", country: "NO", latitude: 61.2331, longitude: 10.4370 },

  { id: "st-anton", name: "St. Anton am Arlberg", country: "AT", latitude: 47.13, longitude: 10.26 },
  { id: "soelden", name: "Sölden", country: "AT", latitude: 46.9685, longitude: 10.9974 },
  { id: "kitzbuehel", name: "Kitzbühel", country: "AT", latitude: 47.4467, longitude: 12.3925 },
  { id: "ischgl", name: "Ischgl", country: "AT", latitude: 46.9926, longitude: 10.2985 },

  { id: "chamonix", name: "Chamonix", country: "FR", latitude: 45.9237, longitude: 6.8694 },
  { id: "val-thorens", name: "Val Thorens", country: "FR", latitude: 45.2977, longitude: 6.58 },
  { id: "les-deux-alpes", name: "Les Deux Alpes", country: "FR", latitude: 45.0122, longitude: 6.1244 },
  { id: "tignes", name: "Tignes", country: "FR", latitude: 45.4692, longitude: 6.9061 },
];

export function findResortById(id: string): Resort | undefined {
  return resorts.find((resort) => resort.id === id);
}
