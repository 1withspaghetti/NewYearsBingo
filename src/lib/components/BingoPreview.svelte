<script lang="ts">
	import seededRandom from "$lib/util/seededRandom";
    import type { IBingoBoard } from "$lib/types/bingoBoard";
	import { Check } from "lucide-svelte";

    interface Props {
        board: IBingoBoard;
        checks?: number[];
        onChecksUpdate?: (newChecks: number[])=>void;
    };
    
    let { board, checks: checksProp = [], onChecksUpdate }: Props = $props();

    let shuffledItems = $derived(seededRandom(board.seed).shuffle([...board.items]));
    let hasCenter = $derived(board.center !== undefined);


    let checks = $state(checksProp);
    $effect(()=>{
        checks = checksProp;
    });

    function toggleCheck(index: number) {
        if (checks.includes(index)) checks.splice(checks.indexOf(index), 1);
        else checks.push(index);
        onChecksUpdate?.(checks);
        checks = checks; // Force update
    }
</script>

<div class="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(5,1fr)] border-2">
    {#each { length: 25 }, i}
        <div class="relative w-24 h-24 overflow-hidden flex items-center border-2 p-2 {i === 12 && hasCenter ? 'bg-zinc-100' : ''}">
            <span class="w-full text-center text-sm {i === 12 && hasCenter ? 'font-bold' : ''}">
                {i === 12 && hasCenter ? board.center : shuffledItems[i > 12 && hasCenter ? i-1 : i]}
            </span>
            {#if checks}
                {#if onChecksUpdate !== undefined}
                    <button onclick={()=>toggleCheck(i)} class="absolute group top-0 left-0 w-full h-full flex items-center justify-center p-2">
                        <Check strokeWidth={5} class={"w-full h-full text-green-400 " + (checks.includes(i) ? 'opacity-50' : 'opacity-0 group-hover:opacity-20')} />
                    </button>
                {:else}
                    <div class="absolute group top-0 left-0 w-full h-full flex items-center justify-center p-2">
                        <Check strokeWidth={5} class={"w-full h-full text-green-400 " + (checks.includes(i) ? 'opacity-50' : 'opacity-0')} />
                    </div>
                {/if}
            {/if}
        </div>
    {/each}
</div>