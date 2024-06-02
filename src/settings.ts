const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

export default {
  endpoint: urlParams.get("endpoint") || "hear",
  gameId: generateShortGuid()
};

function generateShortGuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


