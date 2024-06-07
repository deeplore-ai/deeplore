import { FileObject, FileObjectsPage } from "openai/resources/files.mjs";
import { version } from "../version";
import { getVersionedName } from "./getVersionedName";
import { openai } from "..";
import { CharacterName } from "../../models/Character";

let fileList: Array<FileObject> | undefined;

async function listFiles(): Promise<Array<FileObject>> {
  if (!fileList) {
    fileList = [];
    const response = await openai.get(`files`);
    if (!response.ok) return [];
    const files = (await response.json()) as FileObjectsPage;
    for (const file of files.data) {
      if (file.filename.startsWith(`v${version}`)) {
        fileList.push(file);
      } else {
        openai.remove(`files/${file.id}`);
      }
    }
  }

  return fileList;
}

/**
 * Upload an NPC file to OpenAI, that can be reused to create a NPC assistant.
 */
export async function getNpcFile(npc: CharacterName): Promise<FileObject> {
  const files = await listFiles();
  const fileName = getVersionedName(npc) + ".txt";
  const existingFile = files.find((file) => file.filename === fileName);

  if (existingFile) {
    return existingFile;
  }

  const npcFileResponse = await fetch(`/npc/npc_${npc}.txt`);
  const npcData = await npcFileResponse.text();

  const file = new File([npcData], fileName, { type: "text/plain" });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", "assistants");

  const fileUpload = (await (
    await fetch(`https://api.openai.com/v1/files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${openai.getApiKey()}` },
      body: formData,
    })
  ).json()) as FileObject;

  files.push(fileUpload);

  return fileUpload;
}
