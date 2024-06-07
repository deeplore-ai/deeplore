<script lang="ts">
    import SimpleContentSheet from '$lib/components/SimpleContentSheet.svelte';
    import { upsertSimpleContent } from "$lib/database";
	import type { SimpleContent } from '$lib/models/SimpleContent';

    /** @type {import('./$types').PageData} */
	export let data: {instructions: SimpleContent};

    async function saveContent(content: SimpleContent) {
        await upsertSimpleContent("instructions", content);
    }
</script>

{#key data.instructions.getKey()}
    <SimpleContentSheet simpleContent={data.instructions} onsave={saveContent} name="Instructions"/>
{/key}
