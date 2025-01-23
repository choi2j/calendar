<script lang="ts">
    import "$lib/styles/calendar.css";
    let { data } = $props();

    let tasks = data.tasks; // supabase tasks data
    let dd = $state(data.date); // supabase 기준 오늘자 date

    let dds = { y: dd.getFullYear(), m: dd.getMonth() + 1, d: dd.getDate(), day: dd.getDay() + 1 }; // 오늘 자 date

    let days = ["일", "월", "화", "수", "목", "금", "토"]; // 요일

    class cur { // 해당 날짜 class
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

        getDay(y: number, m: number, d: number) { // year, month, date 넣고 해당 요일 구하기
            return new Date(`${y}-${m}-${d}`).getDay();
        }

        getLeap(y: number) { // 윤년 구하기
            if (y % 4 === 0) {
                if (y % 100 === 0 && !(y % 400 === 0)) {
                    return false; // isNotLeap
                } else {
                    return true; // isLeap
                }
            } else {
                return false; // isNotLeap
            }
        }

        changeM(add: number) { // month + -
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

        getMonthDays(y: number, m: number, isLeap: boolean) { // 한 달 길이 구하기
            if (m % 2 === 1 && m <= 7) {
                return 31;
            } else if (m % 2 === 0 && m >= 8) {
                return 31;
            } else if (m === 2 && isLeap) {
                return 29;
            } else if (m === 2 && !isLeap) {
                return 28;
            } else {
                return 30;
            }
        }
    }

    let c = new cur(dds.y, dds.m, dds.d, dds.day); // 새 날짜 객체
    let monthLength = $state(c.getMonthDays(c.y, c.m, c.getLeap(c.y))); // 첫 로딩 시 날짜 객체

    let curTask = $state(
        tasks.filter((t) => {
            let dt = t.when.split("-").map((ti: string) => parseInt(ti));
            return dt[0] === c.y && dt[1] === c.m;
        })
    ); // 첫 로딩 시 달에 해당하는 tasks 필터링
</script>

<div>
    <div id="months">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            onclick={() => {
                c.changeM(-1); // 한 달 전
                monthLength = c.getMonthDays(c.y, c.m, c.getLeap(c.y)); // 리로딩
                curTask = tasks.filter((t) => {
                    let dt = t.when.split("-").map((ti: string) => parseInt(ti));
                    return dt[0] === c.y && dt[1] === c.m;
                }); // 리로딩
            }}><i class="fa-solid fa-arrow-left"></i></button
        >
        <button id="current">{c.y}년 {c.m}월</button>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            onclick={() => {
                c.changeM(1); // 한 달 후
                monthLength = c.getMonthDays(c.y, c.m, c.getLeap(c.y)); // 리로딩딩
                curTask = tasks.filter((t) => {
                    let dt = t.when.split("-").map((ti: string) => parseInt(ti));
                    return dt[0] === c.y && dt[1] === c.m;
                }); // 리로딩
            }}><i class="fa-solid fa-arrow-right"></i></button
        >
    </div>
    <div id="days">
        {#each days as d} 
            <div class="day">{d}</div> <!--요일-->
        {/each}
    </div>
    <div id="calendar">
        {#each { length: c.getDay(c.y, c.m, 1) } as _}
            <div class="b">-</div> <!--월 시작일 까지 빈칸 표시-->
        {/each}
        {#each { length: monthLength } as _, i}
            {#if curTask.find((e) => {
                let dt = e.when.split("-").map((ti: string) => parseInt(ti));
                return dt[0] === c.y && dt[1] === c.m && dt[2] === i + 1;
            })}
                <div class="d withTask">{i + 1}</div> <!--할 일 표시-->
            {:else if c.m === dds.m && c.d === i + 1}
                <div class="d today">{i + 1}</div> <!--오늘 표시시-->
            {:else if c.getDay(c.y, c.m, i + 1) === 6}
                <div class="d sat">{i + 1}</div> <!--토요일 표시-->
            {:else if c.getDay(c.y, c.m, i + 1) === 0}
                <div class="d sun">{i + 1}</div> <!--일요일 표시-->
            {:else}
                <div class="d">{i + 1}</div> <!--그외 날짜 표시-->
            {/if}
        {/each}
        {#each { length: 42 - c.getDay(c.y, c.m, 1) - monthLength } as _}
            <div class="b">-</div> <!--나머지 빈칸 표시-->
        {/each}
    </div>
    <div id="tasks">
        <div class="tasksHead">
            <p class="tasksTitle">Tasks</p>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="newTaskBtn"><i class="fa-solid fa-plus"></i></button>
        </div>
        <ul class="taskList">
            {#each curTask as ct} <!--이번 달에 해당하는 tasks list-->
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
