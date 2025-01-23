<script lang="ts">
    import "$lib/styles/calendar.css";
    let { data } = $props();

    let tasks = data.tasks;
    let dd = data.date;

    let dds = { y: dd.getFullYear(), m: dd.getMonth() + 1, d: dd.getDate(), day: dd.getDay() + 1 };

    let days = ["일", "월", "화", "수", "목", "금", "토"];

    class cur {
        y = $state(dd.getFullYear());
        m = $state(dd.getMonth() + 1);
        d = $state(dd.getDate());
        day = $state(dd.getDay());

        constructor(y: number, m: number, d: number, day: number) {
            this.y = y;
            this.m = m;
            this.d = d;
            this.day = day;
        }

        reset() {
            this.y = dd.getFullYear();
            this.m = dd.getMonth();
            this.d = dd.getDate();
            this.day = dd.getDay();
        }

        getDay(y: number, m: number, d: number) {
            return new Date(`${y}-${m}-${d}`).getDay();
        }

        getLeap(y: number) {
            let leap = false;
            if (y % 4 === 0) {
                if (y % 100 === 0 && !(y % 400 === 0)) {
                    return leap;
                } else {
                    return !leap;
                }
            } else {
                return !leap;
            }
        }

        changeM(add: number) {
            this.m += add;
            if (this.m > 12) {
                this.y += 1;
                this.m = 1;
            } else if (this.m < 1) {
                this.y -= 1;
                this.m = 12;
            }
            console.log(this.y, this.m, add);
        }
    }

    let c = new cur(dds.y, dds.m, dds.d, dds.day);
    let isLeap = c.getLeap(c.y);

    let curTask = $state(
        tasks.filter((t) => {
            let dt = t.when.split("-").map((ti: string) => parseInt(ti));
            return dt[0] === c.y && dt[1] === c.m && dt[2] === c.d;
        })
    );

    console.log(tasks);
</script>

<div>
    <div id="months">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            onclick={() => {
                c.changeM(-1);
            }}><i class="fa-solid fa-arrow-left"></i></button
        >
        <button id="current">{c.y}년 {c.m}월</button>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            onclick={() => {
                c.changeM(1);
            }}><i class="fa-solid fa-arrow-right"></i></button
        >
    </div>
    <div id="days">
        {#each days as d}
            <div class="day">{d}</div>
        {/each}
    </div>
    <div id="calendar">
        <!-- {#each { length: c.getDay(c.y, c.m, 1) } as _}
            <div class="b"></div>
        {/each}
        {#if c.m % 2 === 1 && c.m <= 7}
            {#each { length: 31 } as _, i}
                {#if c.d === i + 1}
                    <div class="d today">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 6}
                    <div class="d sat">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 0}
                    <div class="d sun">{i + 1}</div>
                {:else}
                    <div class="d">{i + 1}</div>
                {/if}
            {/each}
        {:else if c.m % 2 === 0 && c.m >= 8}
            {#each { length: 31 } as _, i}
                {#if c.d === i + 1}
                    <div class="d today">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 6}
                    <div class="d sat">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 0}
                    <div class="d sun">{i + 1}</div>
                {:else}
                    <div class="d">{i + 1}</div>
                {/if}
            {/each}
        {:else if c.m === 2 && !isLeap}
            {#each { length: 29 } as _, i}
                {#if c.d === i + 1}
                    <div class="d today">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 6}
                    <div class="d sat">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 0}
                    <div class="d sun">{i + 1}</div>
                {:else}
                    <div class="d">{i + 1}</div>
                {/if}
            {/each}
        {:else if c.m === 2 && isLeap}
            {#each { length: 28 } as _, i}
                {#if c.d === i + 1}
                    <div class="d today">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 6}
                    <div class="d sat">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 0}
                    <div class="d sun">{i + 1}</div>
                {:else}
                    <div class="d">{i + 1}</div>
                {/if}
            {/each}
        {:else}
            {#each { length: 30 } as _, i}
                {#if c.d === i + 1}
                    <div class="d today">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 6}
                    <div class="d sat">{i + 1}</div>
                {:else if c.getDay(c.y, c.m, i + 1) === 0}
                    <div class="d sun">{i + 1}</div>
                {:else}
                    <div class="d">{i + 1}</div>
                {/if}
            {/each}
        {/if} -->
    </div>
    <div id="tasks">
        <div class="tasksHead">
            <p class="tasksTitle">Tasks</p>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="newTaskBtn"><i class="fa-solid fa-plus"></i></button>
        </div>
        <ul class="taskList">
            {#each curTask as ct}
                <li class="taskItem">
                    <div class="task">
                        <h3>{ct.title}</h3>
                        <p>{ct.content}</p>
                    </div>
                    <div class="func">
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button><i class="fa-solid fa-pen-to-square"></i></button>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div>
