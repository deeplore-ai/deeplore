<script lang="ts">
    import SimpleContentSheet from '$lib/components/SimpleContentSheet.svelte';
    import { upsertSimpleContent } from "$lib/database";
	import type { SimpleContent } from '$lib/models/SimpleContent';

    /** @type {import('./$types').PageData} */
	export let data: {context: SimpleContent};

    async function saveContent(content: SimpleContent) {
        await upsertSimpleContent("context", content);
    }
</script>

{#key data.context.getKey()}
    <SimpleContentSheet simpleContent={data.context} onsave={saveContent} name="Context"/>
{/key}
