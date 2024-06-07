import { getSimpleContents } from "$lib";
export const ssr = false;
/** @type {import('./$types').PageLoad} */
export async function load() {
	const context = (await getSimpleContents("context"))[0];
	return {
		context
	};
}

