import { generateShortGuid } from "./utils";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export default {
  endpoint: urlParams.get("endpoint") || "LangChain",
  gameId: generateShortGuid()
};
