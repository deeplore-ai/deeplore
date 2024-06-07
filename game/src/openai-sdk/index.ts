import {
  MessageStreamEvent,
  RunStreamEvent,
} from "openai/resources/beta/assistants.mjs";
import { getNpcAssistant } from "./utilities/getNpcAssistant";
import { getNpcThread } from "./utilities/getNpcThread";
import { CharacterName, characterNames } from "../models/Character";

export namespace openai {
  let API_KEY: string | undefined = undefined;

  export function setApiKey(key: string) {
    API_KEY = key;
    localStorage.setItem("openai-api-key", key);
  }

  export function getApiKey() {
    if (API_KEY) {
      return API_KEY;
    }
    const cachedApiKey = localStorage.getItem("openai-api-key");
    if (cachedApiKey) {
      API_KEY = cachedApiKey;
      return API_KEY;
    }

    console.error(`OpenAI API key not set!
Please open your inspector and run call 'localStorage.setItem("openai-api-key", "<your_api_key>")' before making any requests.
You can get an API key from https://platform.openai.com/account/api-keys
Since this code is running on the client, do not expose your API key`);
    throw new Error("OpenAI API key not set.");
  }

  export type StreamChunk =
    | {
        type: "event";
        value: (RunStreamEvent | MessageStreamEvent)["event"];
      }
    | {
        type: "data";
        value: (RunStreamEvent | MessageStreamEvent)["data"];
      };

  export type TalkInput = {
    content: string;
    npc: CharacterName;
    id: string;
    firstname: string;
    lastname: string;
    speaker: string;
    distance: string;
    noAnswerExpected: boolean;
  };

  const decoder = new TextDecoder();

  /**
   * Talk to an NPC and get a streamed response.
   */
  export async function* talk({
    listener,
    speaker,
    text,
    shouldAnswer,
  }: {
    listener: CharacterName;
    speaker: CharacterName;
    text: string;
    shouldAnswer?: boolean;
  }) {
    const thread = await getNpcThread(listener, speaker);
    const speakerFullName = speaker.replace(/_/g, " ");

    // add the message
    await openai.post(`threads/${thread.id}/messages`, {
      role: "user",
      content: text,
    });

    if (!shouldAnswer) {
      return;
    }

    // get the response
    const assistant = await getNpcAssistant(listener);

    const run = await post(`threads/${thread.id}/runs`, {
      assistant_id: assistant.id,
      stream: true,
      temperature: 1.3,
      tool_resources: assistant.tool_resources,
      additional_instructions: `Dialoguez avec ${speakerFullName}. Vous êtes tous les deux dans le village de Rezé-sur-Savoie, où un meurtre mystérieux vient d'avoir lieu.`,
    });

    const reader = run.body?.getReader();

    if (!reader) return;

    const chunks = new Array<StreamChunk>();
    let answer = "";

    do {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = parseMessage(value);
      chunks.push(...chunk);

      while (chunks.length >= 2) {
        const { value: event } = chunks.shift()!;
        const { value: data } = chunks.shift()!;
        const message = { event, data } as unknown as
          | RunStreamEvent
          | MessageStreamEvent;

        if (message.event == "thread.message.delta") {
          const content = message.data.delta.content?.[0];

          if (content?.type === "text") {
            const newText = content.text?.value ?? "";
            answer += newText;
            const space = answer.indexOf(" ", 1);
            if (space !== -1) {
              yield answer.slice(0, space + 1);
              answer = answer.slice(space + 1);
            }
          }
        }
      }
    } while (true);

    yield answer;
  }

  /**
   * Initialize a new NPC that can be interacted with.
   */
  export async function createAsssistant(npc: CharacterName) {
    console.log("Creating NPC assistant...", npc);
    await getNpcAssistant(npc);
    console.log(`NPC ${npc} ready!`);
  }

  /**
   * Initialize all NPCs that can be interacted with.
   * The request is not parallelized to avoid rate limiting.
   * This function should be called once at the start of the application.
   * It will create all NPCs that do not already exist.
   */
  export async function createAllAssistants(
    options: { includePaulMartinez?: boolean } = {}
  ) {
    for (const npc of characterNames) {
      if (options.includePaulMartinez || npc !== "Paul_Martinez") {
        await createAsssistant(npc);
      }
    }
  }

  /******************************* RAW API CALL HELPERS *******************************/

  export async function get(url: string): Promise<Response> {
    const response = await fetch(`https://api.openai.com/v1/${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "openai-Beta": "assistants=v2",
      },
    });

    return response;
  }

  export async function post(url: string, body: any): Promise<Response> {
    const response = await fetch(`https://api.openai.com/v1/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
        "openai-Beta": "assistants=v2",
      },
      body: JSON.stringify(body),
    });

    return response;
  }

  export async function remove(url: string): Promise<Response> {
    const response = await fetch(`https://api.openai.com/v1/${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
        "openai-Beta": "assistants=v2",
      },
    });

    return response;
  }

  /******************************* OTHER UTILITIES *******************************/

  export function parseMessage(message: Uint8Array): Array<StreamChunk> {
    const result = new Array<StreamChunk>();
    const text = decoder.decode(message);
    const lines = text.split("\n");

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        const value = line.slice("event: ".length) as any;
        result.push({ type: "event", value });
      } else if (line.startsWith("data: ")) {
        const value = line.slice("data: ".length).trim();
        const parsedValue = value === "[DONE]" ? value : JSON.parse(value);
        result.push({
          type: "data",
          value: parsedValue,
        });
      }
    }

    return result;
  }
}
