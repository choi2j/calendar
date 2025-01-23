import { supabase } from "$lib/supabaseClient";

let date = new Date();

export async function load() {
    const { data } = await supabase.from("tasks").select() // .eq('when', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    return {
        tasks: data ?? [],
    };
}
