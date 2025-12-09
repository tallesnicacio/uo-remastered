export type MapName = "Felucca" | "Trammel" | "Ilshenar" | "Malas" | "Tokuno" | "TerMur" | "Custom";

export type Position = {
  x: number;
  y: number;
  z?: number;
  map: MapName | string;
  facing?: number;
};
