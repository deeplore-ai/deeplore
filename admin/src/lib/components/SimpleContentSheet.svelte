<script lang="ts">
	import { SimpleContent } from "$lib/models/SimpleContent";

    let {simpleContent, onsave, name} = $props<{simpleContent: SimpleContent, onsave: (simpleContent: SimpleContent) => void, name: string}>();

    const draftSimpleContent = $state(simpleContent.toDTO());

    function onContentChange(content: string) {
        draftSimpleContent.content = content;
    }

    function save() {
        onsave(SimpleContent.fromDTO(draftSimpleContent));
    }

    function onRender(_element: HTMLElement) {
        const content = document.querySelector('.content');
        if (content) {
            content.innerHTML = draftSimpleContent.content.replaceAll('\n', '<br>');
        }
    }
</script>

<article use:onRender>
    <div>
        <h1># {name}</h1>
        <div contenteditable class="content"
            oninput={(e: Event) => onContentChange((e.target as HTMLDivElement).innerText)}
        ></div>
    </div>
    <footer>
        <button onclick={save}>Enregistrer</button>
    </footer>
</article>

<style>
    article {
        max-height: calc(100% - 4rem);
        overflow-y: auto;
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
    }

    article > footer {
        position: sticky;
        bottom: 0;
        background-color: white;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
</style>