import type { Thread } from "openai/resources/beta/index.mjs";
import { CharacterName } from "../../models/Character";
import { openai } from "..";

const threads = new Map<string, Thread>();

/**
 * Create a new thread between two characters.
 * Every conversation must exist within two distinct threads:
 * If A and B are talking together, there will be one thread where A is the main character and B is the secondary character, and another thread where B is the main character and A is the secondary character.
 */
export async function getNpcThread(
  mainCharacter: CharacterName,
  secondaryCharacter: CharacterName
): Promise<Thread> {
  const threadName = `${mainCharacter}__${secondaryCharacter}`;
  const existingThread = threads.get(threadName);

  if (existingThread) {
    return existingThread;
  }

  const mainCharacterFullName = mainCharacter.replace(/_/g, " ");

  const thread = (await (
    await openai.post(`threads`, {
      messages: [
        {
          role: "user",
          content: `Je suis ${mainCharacterFullName}, et ceci est le début de notre discussion dans le village de Rezé-sur-Savoie, où un meurtre mystérieux vient d'avoir lieu.`,
        },
      ],
    })
  ).json()) as Thread;

  threads.set(threadName, thread);

  return thread;
}
