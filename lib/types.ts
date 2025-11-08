export type Context = {
  timeOfDay: string;
  dayType: string;
  season: string;
  location: string;
  weather: string;
  social: string;
  mood: string;
};

export type DatasetRow = {
  userId: string;
  itemId: string;
  rating: number;
  timeOfDay: string;
  dayType: string;
  season: string;
  location: string;
  weather: string;
  social: string;
  mood: string;
  genre: string;
};

export type ContextOptions = {
  timeOfDay: string[];
  dayType: string[];
  season: string[];
  location: string[];
  weather: string[];
  social: string[];
  mood: string[];
};
