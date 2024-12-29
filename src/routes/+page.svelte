<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import { Separator } from "$lib/components/ui/separator";
	import { slide } from "svelte/transition";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import BingoPreview from "$lib/components/BingoPreview.svelte";
	import { Button } from "$lib/components/ui/button";
    import Shuffle from "lucide-svelte/icons/Shuffle";
	import BingoDocumentGenerator from "$lib/components/BingoDocumentGenerator.svelte";

    let centerItemChecked = $state(false);
    let centerItemText = $state("");

    let nextId = 1;
    let items: {id: number, text: string}[] = $state([{id: nextId++, text: ""}]);
    let inputRefs: HTMLInputElement[] = $state([]);

    let previewSeed = $state(Math.floor(Math.random()*4294967296));
    function shuffleItems() {
        previewSeed = Math.floor(Math.random()*4294967296);
    }

    let board = $derived({center: centerItemChecked ? centerItemText : undefined, items: items.map(item=>item.text).filter(text=>text), seed: previewSeed});
</script>
<div class="flex flex-col items-center py-8">
    <h1 class="text-2xl sm:text-4xl font-bold">⭐ New Year's Bingo 📔</h1>
    <Separator class="my-8" />
    <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex flex-col w-full max-w-sm">
            <Label class="mb-6 text-center text-lg">Settings</Label>

            <div class="flex items-top space-x-2 mb-4">
                <Checkbox id="center-item-checkbox" bind:checked={centerItemChecked} aria-labelledby="center-item-label" />
                <div class="grid gap-1.5 leading-none">
                    <Label
                        id="center-item-label"
                        for="center-item-checkbox"
                        class="text-sm font-medium leading-none"
                    >
                        Bonus Box
                    </Label>
                    <p class="text-muted-foreground text-sm">
                        A box that will always be in the center of the board
                    </p>
                </div>
            </div>
            {#if centerItemChecked}
                <div transition:slide class="pl-4">
                    <input 
                        id="center-item"
                        bind:value={centerItemText}
                        placeholder="Enter bonus box text here"
                        class="w-full p-1 border-input outline-none bg-zinc-100"
                    />
                </div>
            {/if}

            <Separator class="my-6" />

            <Label class="mb-4">Bingo Items <span class="text-zinc-500">({items.filter(item=>item.text).length}/{centerItemChecked ? 24 : 25})</span></Label>
            <div class="flex flex-col">
                {#each items as {id, text}, i (id)}
                    <input 
                        id="bingo-item-{id}"
                        bind:value={items[i].text} 
                        bind:this={inputRefs[i]}
                        transition:slide
                        placeholder={i === 0 ? "Start your list here" : (i === items.length - 1 ? "Enter another item" : "")}
                        oninput={()=>{
                            if(i === items.length - 1) {
                                items = [...items, {id: nextId++, text: ""}]; // Expand list if last item
                                shuffleItems();
                            }
                        }}
                        onblur={()=>{
                            if(text === "" && items.length > 1 && i !== items.length - 1) {
                                items = items.filter((item) => item.id !== id); // remove item if empty
                            }
                        }}
                        onkeydown={(e)=>{
                            if(e.key === "Backspace" && text === "" && items.length > 1 && i !== items.length - 1) {
                                e.preventDefault();
                                items = items.filter((item) => item.id !== id); // remove item if empty
                                inputRefs[i - 1]?.focus(); // Focus previous input on backspace
                                shuffleItems();
                            }
                            if (e.key === "ArrowUp") {
                                e.preventDefault();
                                inputRefs[i - 1]?.focus(); // Focus previous input on arrow up
                            }
                            if(e.key === "Enter" || e.key === "ArrowDown") {
                                e.preventDefault();
                                inputRefs[i + 1]?.focus(); // Focus next input on enter
                            }
                        }}
                        class="w-full p-1 border-input outline-none border-t first:border-t-0 bg-gradient-to-b from-zinc-100 to-zinc-100 last:to-white focus:!to-zinc-100 first:!to-zinc-100"
                    />
                {/each}
            </div>
        </div>
        <div class="flex flex-col">
            <Label class="mb-6 text-center text-lg">Preview</Label>

            <div class="scale-75 sm:scale-100 mb-4">
                <BingoPreview {...board} />
            </div>
            
            <div class="flex justify-center gap-4">
                <Button variant="outline" onclick={shuffleItems}>
                    <Shuffle class="mr-2 size-4" />
                    Shuffle
                </Button>
                <BingoDocumentGenerator board={board} filename="preview-bingo-sheet.pdf">
                    {#snippet button(generate)}
                        <Button variant="secondary" onclick={generate}>
                            Generate Preview PDF
                        </Button>
                    {/snippet}
                </BingoDocumentGenerator>
            </div>
        </div>
    </div>
</div>
