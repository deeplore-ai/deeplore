<script lang="ts">
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';
	import Character from '$lib/models/Character';
    import { upsertCharacter } from "$lib/database";

    /** @type {import('./$types').PageData} */
	export let data: {characters: Character[]};

    let selectedCharacter: Character | null = null;

    function selectCharacter(character: Character) {
        selectedCharacter = character;
    }

    async function saveCharacter(character: Character) {
        const savedCharacter = await upsertCharacter(character);
        selectCharacter(savedCharacter);
        data.characters = [...data.characters.filter((c) => c.id !== savedCharacter.id), savedCharacter];
    }
</script>

<ul>
{#each data.characters.sort((a, b) => a.firstname.localeCompare(b.firstname)) as character}
    <li><button onclick={() => selectCharacter(character)}>{character.firstname} {character.lastname}</button></li>
{/each}
<li><button class="variant" onclick={() => selectCharacter(new Character())}>Ajouter un personnage</button></li>
</ul>

{#if selectedCharacter}
    {#key selectedCharacter.getKey()}
        <CharacterSheet character={selectedCharacter} onsave={saveCharacter}/>
    {/key}
{/if}

<style>
    ul {
        list-style-type: none;
    }
</style>

