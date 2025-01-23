<script lang="ts">
    import "$lib/styles/app.css";
    import type { Snippet } from "svelte";
    import type { LayoutData } from "./$types";
    import { page } from "$app/state";

    let { data, children }: { data: LayoutData; children: Snippet } = $props();
    let d = data.date;
    let days = ["일", "월", "화", "수", "목", "금", "토"];
    let today = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
    let currentPage = page.url.pathname;
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<main>
    <nav>
        <button class="menu"><i class="fa-solid fa-bars"></i></button>
        <p class="today">{today}</p>
    </nav>
    {@render children()}
</main>
