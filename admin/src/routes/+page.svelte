
<script lang="ts">
    import CharacterSheet from '$lib/components/CharacterSheet.svelte';
	import Character from '$lib/models/Character';
    /** @type {import('./$types').PageData} */
	export let data;

    let selectedCharacter: Character | null = null;

    function selectCharacter(character: Character) {
        selectedCharacter = character;
    }
</script>

<section>
<ul>
{#each data.characters as character}
    <li><button onclick={() => selectCharacter(character)}>{character.firstname} {character.lastname}</button></li>
{/each}
<button onclick={() => selectCharacter(new Character())}>Ajouter un personnage</button>
</ul>

{#if selectedCharacter}
    <CharacterSheet character={selectedCharacter} />
{/if}
</section>

<style>
    section {
        display: flex;
        height: calc(100vh - var(--ly-header-size));
        overflow: hidden;
    }
</style>

