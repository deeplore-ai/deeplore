import Character from "../models/Character";
import { openai } from "../openai-sdk";

/**
 * Set to true to use the OpenAI client-side SDK instead of the server application.
 */
const useOpenAiSdk = false;

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
  if (useOpenAiSdk) {
    return openai.talk({
      from: speaker.name,
      to: listener.name,
      text,
      shouldAnswer,
    });
  } else {
    return fetch(`localhost:8080/hear/${settings.endpoint}`, {
      method: "POST",
      // no cors
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: text,
        npc: this.name,
        id: settings.gameId,
        firstname: this.firstName,
        lastname: this.lastName,
        speaker: speaker.firstName + " " + speaker.lastName,
        noAnswerExpected: !shouldAnswer,
      }),
    });
  }
}
