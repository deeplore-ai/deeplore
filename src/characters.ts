import Character from "./models/Character";
import { k } from "./lib/ctx";
import { scaleFactor } from "./constants";

export const paul_martinez = new Character(
  "Paul_Martinez",
  k.vec2(990, 990),
  250,
  scaleFactor,
  k,
  "Paul",
  "Martinez"
);

export const emma_dubois = new Character(
  "Emma_Dubois",
  k.vec2(500, 1440),
  250,
  scaleFactor,
  k,
  "Emma",
  "Dubois"
);

export const matthieu_mancini = new Character(
  "Matthieu_Mancini",
  k.vec2(900, 1800),
  250,
  scaleFactor,
  k,
  "Matthieu",
  "Mancini"
);

export const dieter_hoffman = new Character(
  "Dieter_Hoffman",
  k.vec2(1899, 1800),
  250,
  scaleFactor,
  k,
  "Dieter",
  "Hoffman"
);

export const enzo_muller = new Character(
  "Enzo_Muller",
  k.vec2(1350, 1530),
  250,
  scaleFactor,
  k,
  "Enzo",
  "Muller"
);

export const farida_wang = new Character(
  "Farida_Wang",
  k.vec2(1620, 1080),
  250,
  scaleFactor,
  k,
  "Farida",
  "Wang"
);

export const ines_dubois = new Character(
  "Ines_Dubois",
  k.vec2(2100, 1310),
  250,
  scaleFactor,
  k,
  "Ines",
  "Dubois"
);

export const jonathan_chassang = new Character(
  "Jonathan_Chassang",
  k.vec2(720, 2070),
  250,
  scaleFactor,
  k,
  "Johnatan",
  "Chassang"
);

export const laurent_dubois = new Character(
  "Laurent_Dubois",
  k.vec2(1260, 455),
  250,
  scaleFactor,
  k,
  "Laurent",
  "Dubois"
);

export const characters = [
  paul_martinez,
  emma_dubois,
  matthieu_mancini,
  dieter_hoffman,
  enzo_muller,
  farida_wang,
  ines_dubois,
  jonathan_chassang,
  laurent_dubois,
];
