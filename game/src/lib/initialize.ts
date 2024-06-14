import Character from "../models/Character";
import settings from "../settings";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export async function initialize(characterList: Character[]) {
  const persons = {
    people: characterList.map(character => ({
      session_id: settings.gameId,
      firstname: character.firstName,
      lastname: character.lastName,
    })),
  };
  await fetch(`${URL}/initialize`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(persons),
  });
}

