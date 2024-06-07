<script lang="ts">
	import Category from "$lib/models/Category";
	import Character from "$lib/models/Character";

    let {character, onsave} = $props<{character: Character, onsave: (character: Character) => void}>();

    const draftCharacter = $state(character.toDTO());

    function onNameChange(attr: "firstname" | "lastname", value: string) {
        draftCharacter[attr] = value;
    }

    function onCategoryChange(index: number, value: string) {
        draftCharacter.categories[index].content = value;
    }

    function onCategoryNameChange(index: number, value: string) {
        draftCharacter.categories[index].name = value;
    }

    function addCategory() {
        draftCharacter.categories = [...draftCharacter.categories, new Category()];
    }

    function save() {
        onsave(Character.fromDTO(draftCharacter));
    }

    function onRender(_element: HTMLElement) {
        document.querySelectorAll('.category').forEach((category: Element) => {
            category.innerHTML = draftCharacter.categories[Number(category.getAttribute('data-index'))].content.replaceAll('\n', '<br>');
        });
        document.querySelectorAll('.category-name').forEach((category: Element) => {
            category.innerHTML = draftCharacter.categories[Number(category.getAttribute('data-index'))].name;
        });
        const firstname = document.querySelector('.firstname');
        const lastname = document.querySelector('.lastname');
        if (firstname) {
            firstname.innerHTML = draftCharacter.firstname;
        }
        if (lastname) {
            lastname.innerHTML = draftCharacter.lastname;
        }
    }
</script>

<article use:onRender>
    <div>
        <h1>#
            <span contenteditable class="firstname" oninput={(e: Event) => onNameChange('firstname', (e.target as HTMLSpanElement).innerText)}></span>
            <span contenteditable class="lastname" oninput={(e: Event) => onNameChange('lastname', (e.target as HTMLSpanElement).innerText)}></span>
        </h1>
        <div>
        {#each draftCharacter.categories as category, i}
            <details>
                <summary>
                    <span contenteditable class="category-name" data-index={i}
                        oninput={(e: Event) => onCategoryNameChange(i, (e.target as HTMLSpanElement).innerText)}
                    ></span>
                </summary>
                <div contenteditable class="category" data-index={i}
                    oninput={(e: Event) => onCategoryChange(i, (e.target as HTMLDivElement).innerText)}
                ></div>
            </details>
        {/each}
        </div>
        <footer>
            <button onclick={addCategory}>Ajouter une catégorie</button>
            <button onclick={save}>Enregistrer</button>
        </footer>
    </div>
</article>

<style>
    article {
        max-height: calc(100% - 4rem);
        overflow-y: auto;
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
    }

    h1 > span {
        display: inline-block;
        min-width: 50px;
    }

    article > div {
        height: fit-content;
        padding: 0 1rem;
    }

    .category-name {
        min-width: 50px;
        display: inline-block;
        height: 24px;
    }

    article > div > footer {
        position: sticky;
        bottom: 0;
        background-color: white;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
</style>

