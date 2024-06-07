import {
  Assistant,
  AssistantsPage,
} from "openai/resources/beta/assistants.mjs";
import { version } from "../version";
import { getVersionedName } from "./getVersionedName";
import { getNpcVectorStore } from "./getNpcVectorStore";
import { openai } from "..";
import { CharacterName } from "../../models/Character";

let assistantList: Array<Assistant> | undefined;

async function listAssistants(): Promise<Array<Assistant>> {
  if (!assistantList) {
    assistantList = [];
    const response = await openai.get(`assistants`);
    if (!response.ok) return [];
    const assistants = (await response.json()) as AssistantsPage;

    console.log("Existing assistants", assistants.data);

    for (const assistant of assistants.data) {
      if (assistant.name?.startsWith(`v${version}`)) {
        assistantList.push(assistant);
      } else {
        openai.remove(`assistants/${assistant.id}`);
      }
    }
  }

  return assistantList;
}

/**
 * Create an NPC assistant that can be interacted with - if it does not already exist.
 */
export async function getNpcAssistant(npc: CharacterName): Promise<Assistant> {
  const assistants = await listAssistants();
  const assistantName = getVersionedName(npc);
  const npcVectorStore = await getNpcVectorStore(npc);

  const existingAssistant = assistants.find(
    (assistant) => assistant.name === assistantName
  );

  if (existingAssistant) {
    return existingAssistant;
  }

  console.log("Creating assistant for", npc, "...");

  const fullName = npc.replace(/_/g, " ");

  const assistant = (await (
    await openai.post(`assistants`, {
      name: assistantName,
      model: "gpt-4o",
      instructions: `Tu es ${fullName}, un habitant du village alpin de Rezé-sur-Savoie dans lequel un meurtre mystérieux vient d'avoir lieu.`,
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: { vector_store_ids: [npcVectorStore.id] },
      },
    })
  ).json()) as Assistant;

  console.log("Created assistant for:", npc);

  assistants.push(assistant);

  return assistant;
}
