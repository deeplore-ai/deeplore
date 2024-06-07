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
  listener: CharacterName,
  speaker: CharacterName
): Promise<Thread> {
  const threadName = `${listener}__${speaker}`;
  const existingThread = threads.get(threadName);

  if (existingThread) {
    return existingThread;
  }

  const thread = (await (await openai.post(`threads`, {})).json()) as Thread;

  threads.set(threadName, thread);

  return thread;
}
