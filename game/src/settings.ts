import { generateShortGuid } from "./utils";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export default {
  endpoint: urlParams.get("endpoint") || "openai",
  gameId: generateShortGuid(),

  /**
   * Set to true to use the OpenAI client-side SDK instead of the server application.
   */
  useOpenAiSdk: urlParams.get("sdk") === "true",
};
