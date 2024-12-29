<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Separator } from "$lib/components/ui/separator";
	import * as Table from "$lib/components/ui/table/index.js";

    let items = [""];

</script>
<div class="flex flex-col items-center py-8">
    <h1 class="text-4xl font-bold">⭐ New Year's Bingo 📔</h1>
    <Separator class="my-8" />
    <div class="flex">
        <div class="flex flex-col">
            <Label class="mb-2">Bingo Items</Label>
            {#each items as item, i}
                <div>
                    <input bind:value={items[i]} 
                        oninput={()=>{
                            if(i === items.length - 1) {
                                items = [...items, ""]; // Expand list if last item
                            }
                        }}
                        onblur={()=>{
                            if(items[i] === "" && items.length > 1) {
                                items = items.filter((_, index) => index !== i); // remove item if empty
                            }
                        }}
                        class="max-w-xs p-1 border-input bg-zinc-50 outline-none border-t"
                    />
                </div>
            {/each}
        </div>
    </div>
</div>
