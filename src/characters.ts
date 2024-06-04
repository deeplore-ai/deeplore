import Character from "./models/Character";
import { k } from "./lib/ctx";
import { scaleFactor } from "./constants";
import { Player } from "./models/Player";

export const paul_martinez = new Player({
  firstName: "Paul",
  lastName: "Martinez",
  name: "Player",
  initialPosition: k.vec2(990, 990),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: null,
});

export const emma_dubois = new Character({
  firstName: "Emma",
  lastName: "Dubois",
  name: "Fille",
  initialPosition: k.vec2(500, 1440),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const matthieu_mancini = new Character({
  firstName: "Matthieu",
  lastName: "Mancini",
  name: "Priest",
  initialPosition: k.vec2(900, 1800),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const dieter_hoffman = new Character({
  firstName: "Dieter",
  lastName: "Hoffman",
  name: "Prof",
  initialPosition: k.vec2(1899, 1800),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const enzo_muller = new Character({
  firstName: "Enzo",
  lastName: "Muller",
  name: "PetitAmi",
  initialPosition: k.vec2(1350, 1530),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const farida_wang = new Character({
  firstName: "Farida",
  lastName: "Wang",
  name: "Maire",
  initialPosition: k.vec2(1620, 1080),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const ines_dubois = new Character({
  firstName: "Ines",
  lastName: "Dubois",
  name: "Mere",
  initialPosition: k.vec2(2100, 1310),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const jonathan_chassang = new Character({
  firstName: "Jonathan",
  lastName: "Chassang",
  name: "Jaloux",
  initialPosition: k.vec2(720, 2070),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});

export const laurent_dubois = new Character({
  firstName: "Laurent",
  lastName: "Dubois",
  name: "Pere",
  initialPosition: k.vec2(1260, 455),
  speed: 250,
  scaleFactor: scaleFactor,
  k: k,
  player: paul_martinez,
});
