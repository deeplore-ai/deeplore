<script lang="ts">
    import {page} from '$app/stores'
</script>

<main>
    <img src="logo.png" alt="DeepLore">
</main>
<menu>
    <li><a href="/">🏠</a></li>
    <li class:selected={$page.url.pathname.includes("instructions")}><a href="/instructions">Instructions</a></li>
    <li class:selected={$page.url.pathname.includes("context")}><a href="/context">Context</a></li>
    <li class:selected={$page.url.pathname.includes("characters")}><a href="/characters">Characters</a></li>
</menu>

<section>
    <slot></slot>
</section>

<style>
    section {
        display: flex;
        height: calc(100vh - var(--ly-header-size) - 92px);
        overflow: hidden;
        width: 100%;
    }

    img {
        width: 400px;
    }
</style>

