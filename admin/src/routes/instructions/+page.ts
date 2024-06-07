import { getSimpleContents } from "$lib";
export const ssr = false;
/** @type {import('./$types').PageLoad} */
export async function load() {
	const instructions = (await getSimpleContents("instructions"))[0];
	return {
		instructions
	};
}

