import {
  MessageStreamEvent,
  RunStreamEvent,
} from "openai/resources/beta/assistants.mjs";
import { env } from "../env";

const decoder = new TextDecoder();

export type OpenAIStreamChunk =
  | {
      type: "event";
      value: (RunStreamEvent | MessageStreamEvent)["event"];
    }
  | {
      type: "data";
      value: (RunStreamEvent | MessageStreamEvent)["data"];
    };

/**
 * GET/POST helper requests to the OpenAI API.
 */
export const openai = {
  async get(url: string): Promise<Response> {
    const response = await fetch(`https://api.openai.com/v1/${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.OPENAI_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });

    return response;
  },

  async post(url: string, body: any): Promise<Response> {
    const response = await fetch(`https://api.openai.com/v1/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify(body),
    });

    return response;
  },

  async delete(url: string): Promise<Response> {
    const response = await fetch(`https://api.openai.com/v1/${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    });

    return response;
  },

  parseMessage(message: Uint8Array): Array<OpenAIStreamChunk> {
    const result = new Array<OpenAIStreamChunk>();
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
  },
};
