import Character, { CharacterName } from "../models/Character";
import { openai } from "../openai-sdk";
import settings from "../settings";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

interface DeepLoreCharacter {
  session_id: string;
  firstname: string;
  lastname: string;
}

export function speak({
  listener,
  speaker,
  text,
  shouldAnswer = true,
}: {
  listener: Character;
  speaker: Character;
  text: string;
  shouldAnswer?: boolean;
}): AsyncGenerator<string, void, unknown> | Promise<string>[] {
  if (settings.useOpenAiSdk) {
    return openai.talk({
      listener: listener.name,
      speaker: speaker.name,
      text,
      shouldAnswer,
    });
  } else {
    const speech = {content: text,
      target: {
        session_id: settings.gameId,
        firstname: listener.firstName,
        lastname: listener.lastName,
      },
      speaker: {
        session_id: settings.gameId,
        firstname: speaker.firstName,
        lastname: speaker.lastName,
      },
      distance: "0",
      noAnswerExpected: !shouldAnswer,
    }
    return [deepLoreApi.speak(speech)];
  }
}

export async function hear({
  listener,
  speaker,
  text,
  shouldAnswer = true,
}: {
  listener: Character;
  speaker: Character;
  text: string;
  shouldAnswer?: boolean;
}) {
  if (settings.useOpenAiSdk) {
    return;
  }
  const speech = {content: text,
    target: {
      session_id: settings.gameId,
      firstname: listener.firstName,
      lastname: listener.lastName,
    },
    speaker: {
      session_id: settings.gameId,
      firstname: speaker.firstName,
      lastname: speaker.lastName,
    },
    distance: "0",
    noAnswerExpected: !shouldAnswer,
  }
  await deepLoreApi.hear(speech);
}

interface Speech {
  content: string;
  target: DeepLoreCharacter;
  speaker: DeepLoreCharacter;
  distance: string;
  noAnswerExpected: boolean;
}


class DeepLoreApi {
  callApi(uri: string, payload: object) {
    return fetch(`${URL}/${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());
  }

  async hear(speech: Speech) {
    await this.callApi("hear", speech);
  }

  async speak(speech: Speech) {
    const response = await this.callApi("speak", speech) as {
      NPC: CharacterName;
      Speaker: CharacterName;
      Speech: string;
    };

    return response.Speech;
  }
}

export const deepLoreApi = new DeepLoreApi();