import { getCharacters } from "$lib";
export const ssr = false;
/** @type {import('./$types').PageLoad} */
export async function load() {
	const characters = await getCharacters();
	return {
		characters
	};
}

