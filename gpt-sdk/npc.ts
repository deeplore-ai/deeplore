import {
  MessageStreamEvent,
  RunStreamEvent,
} from "openai/resources/beta/assistants.mjs";
import { getNpcAssistant } from "./utilities/getNpcAssistant";
import { getNpcThread } from "./utilities/getNpcThread";
import { OpenAIStreamChunk, openai } from "./utilities/openai";

export namespace NPC {
  export type TalkInput = {
    content: string;
    npc: Name;
    id: string;
    firstname: string;
    lastname: string;
    speaker: string;
    distance: string;
    noAnswerExpected: boolean;
  };

  export type Name = (typeof allNames)[number];

  export const allNames = [
    "Dieter_Hoffman",
    "Emma_Dubois",
    "Enzo_Muller",
    "Farida_Wang",
    "Ines_Dubois",
    "Jeanne_Costa",
    "Jonathan_Chassang",
    "Laurent_Dubois",
    "Matthieu_Mancini",
    "Paul_Martinez",
  ] as const;

  /**
   * Talk to an NPC and get a streamed response.
   */
  export async function* talk({
    from,
    to,
    text,
    shouldAnswer,
  }: {
    from: NPC.Name;
    to: NPC.Name;
    text: string;
    shouldAnswer?: boolean;
  }) {
    const thread = await getNpcThread(to, from);
    const secondaryCharacterFullName = from.replace(/_/g, " ");

    // add the message
    await openai.post(`threads/${thread.id}/messages`, {
      role: "user",
      content: text,
    });

    // if (!shouldAnswer) {
    //   return;
    // }

    // get the response
    const assistant = await getNpcAssistant(to);

    const run = await openai.post(`threads/${thread.id}/runs`, {
      assistant_id: assistant.id,
      stream: true,
      temperature: 1.3,
      tool_resources: assistant.tool_resources,
      additional_instructions: `Dialoguez avec ${secondaryCharacterFullName}. Vous êtes tous les deux dans le village de Rezé-sur-Savoie, où un meurtre mystérieux vient d'avoir lieu.`,
    });

    const reader = run.body?.getReader();

    if (!reader) return;

    const chunks = new Array<OpenAIStreamChunk>();
    let answer = "";

    do {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = openai.parseMessage(value);
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
  export async function createAsssistant(npc: Name) {
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
    for (const npc of allNames) {
      if (options.includePaulMartinez || npc !== "Paul_Martinez") {
        await createAsssistant(npc);
      }
    }
  }
}
