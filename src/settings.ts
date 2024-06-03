import { generateShortGuid } from "./utils";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export default {
  endpoint: urlParams.get("endpoint") || "hear",
  gameId: generateShortGuid(),
};
