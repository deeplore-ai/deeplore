import { VectorStore } from "openai/resources/beta/index.mjs";
import { NPC } from "../npc";
import { openai } from "./openai";
import { VectorStoresPage } from "openai/src/resources/beta/index.js";
import { version } from "../version";
import { getVersionedName } from "./getVersionedName";
import { getNpcFile } from "./getNpcFile";

let vectorStoreList: Array<VectorStore> | undefined;

async function listVectorStores(): Promise<Array<VectorStore>> {
  if (!vectorStoreList) {
    vectorStoreList = [];
    const response = await openai.get(`vector_stores`);
    if (!response.ok) return [];
    const vectorStores = (await response.json()) as VectorStoresPage;

    console.log("Existing vector stores", vectorStores.data);

    for (const vectorStore of vectorStores.data) {
      if (vectorStore.name.startsWith(`v${version}`)) {
        vectorStoreList.push(vectorStore);
      } else {
        openai.delete(`vector_stores/${vectorStore.id}`);
      }
    }
  }

  return vectorStoreList;
}

export async function getNpcVectorStore(npc: NPC.Name): Promise<VectorStore> {
  const vectorStoreName = getVersionedName(npc);
  const vectorStores = await listVectorStores();

  const existingVectorStore = vectorStores.find(
    (vectorStore) => vectorStore.name === vectorStoreName
  );

  if (existingVectorStore) {
    return existingVectorStore;
  }

  const vectorStore = (await (
    await openai.post(`vector_stores`, {
      name: vectorStoreName,
    })
  ).json()) as VectorStore;

  console.log("Vector store", vectorStore);

  const npcFile = await getNpcFile(npc);

  await openai.post(`vector_stores/${vectorStore.id}/files`, {
    file_id: npcFile.id,
  });

  vectorStores.push(vectorStore);

  console.log("Created vector store", vectorStore);

  return vectorStore;
}
