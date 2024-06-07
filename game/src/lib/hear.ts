import Character, { CharacterName } from "../models/Character";
import { openai } from "../openai-sdk";
import settings from "../settings";

export function hear({
  listener,
  speaker,
  text,
  shouldAnswer = true,
}: {
  listener: Character;
  speaker: Character;
  text: string;
  shouldAnswer?: boolean;
}): AsyncGenerator<string, void, unknown> {
  if (settings.useOpenAiSdk) {
    return openai.talk({
      listener: listener.name,
      speaker: speaker.name,
      text,
      shouldAnswer,
    });
  } else {
    return callDeepLoreApi({
      content: text,
      npc: listener.name,
      id: settings.gameId,
      firstname: listener.firstName,
      lastname: listener.lastName,
      speaker: speaker.firstName + " " + speaker.lastName,
      distance: "0",
      noAnswerExpected: !shouldAnswer,
    });
  }
}

async function* callDeepLoreApi(input: {
  content: string;
  npc: CharacterName;
  id: string;
  firstname: string;
  lastname: string;
  speaker: string;
  distance: string;
  noAnswerExpected: boolean;
}) {
  const response = await fetch(
    `http://localhost:8080/hear/${settings.endpoint}`,
    {
      method: "POST",
      // no cors
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  const data = (await response.json()) as {
    NPC: CharacterName;
    Speaker: CharacterName;
    Speech: string;
  };

  yield data.Speech;
}
