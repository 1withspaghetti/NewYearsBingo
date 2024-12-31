<script lang="ts">
	import seededRandom from "$lib/util/seededRandom";
    import type { IBingoBoard } from "$lib/types/bingoBoard";

    interface Props {
        board: IBingoBoard;
    };
    
    let { board }: Props = $props();

    let shuffledItems = $derived(seededRandom(board.seed).shuffle([...board.items]));
    let hasCenter = $derived(board.center !== undefined);
</script>

<div class="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(5,1fr)] border-2">
    {#each { length: 25 }, i}
        <div class="w-24 h-24 overflow-hidden flex items-center border-2 p-2 {i === 12 && hasCenter ? 'bg-zinc-100' : ''}">
            <span class="w-full text-center text-sm {i === 12 && hasCenter ? 'font-bold' : ''}">
                {i === 12 && hasCenter ? board.center : shuffledItems[i > 12 && hasCenter ? i-1 : i]}
            </span>
        </div>
    {/each}
</div>