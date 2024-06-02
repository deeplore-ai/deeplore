import Character from "./models/Character";
import { k } from "./lib/ctx";
import { scaleFactor } from "./constants";

export const paul_martinez = new Character(
  "Player",
  k.vec2(990, 990),
  250,
  scaleFactor,
  k,
  "Paul",
  "Martinez"
);

export const emma_dubois = new Character(
  "Fille",
  k.vec2(500, 1440),
  250,
  scaleFactor,
  k,
  "Emma",
  "Dubois"
);

export const matthieu_mancini = new Character(
  "Priest",
  k.vec2(900, 1800),
  250,
  scaleFactor,
  k,
  "Matthieu",
  "Mancini"
);

export const dieter_hoffman = new Character(
  "Prof",
  k.vec2(1899, 1800),
  250,
  scaleFactor,
  k,
  "Dieter",
  "Hoffman"
);

export const enzo_muller = new Character(
  "PetitAmi",
  k.vec2(1350, 1530),
  250,
  scaleFactor,
  k,
  "Enzo",
  "Muller"
);

export const farida_wang = new Character(
  "Maire",
  k.vec2(1620, 1080),
  250,
  scaleFactor,
  k,
  "Farida",
  "Wang"
);

export const ines_dubois = new Character(
  "Mere",
  k.vec2(2100, 1310),
  250,
  scaleFactor,
  k,
  "Ines",
  "Dubois"
);

export const jonathan_chassang = new Character(
  "Jaloux",
  k.vec2(720, 2070),
  250,
  scaleFactor,
  k,
  "Jonathan",
  "Chassang"
);

export const laurent_dubois = new Character(
  "Pere",
  k.vec2(1260, 455),
  250,
  scaleFactor,
  k,
  "Laurent",
  "Dubois"
);
