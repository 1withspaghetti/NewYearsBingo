<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
    import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Link, Printer, Trash2 } from 'lucide-svelte';
    import { page } from '$app/state';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import BingoPreview from '$lib/components/BingoPreview.svelte';
	import BingoDocumentGenerator from '$lib/components/BingoDocumentGenerator.svelte';
	import AddNewPlayerButton from './AddNewPlayerButton.svelte';
	import apiRequest from '$lib/util/apiClient';
	import { goto, invalidate } from '$app/navigation';

    let { data }: { data: PageData } = $props();

    let game = $derived(data.game);
    function refreshData() {
        invalidate("custom:game");
    }

    let { board, player } = $derived.by(()=>{
        const player = game.players.find(player => player.id == page.url.searchParams.get('player'));
        if (!player) return { board: {center: game.center, items: game.items, seed: ''}, player };
        return { board: {center: game.center, items: game.items, seed: player.seed}, player };
    });
    let hasBoard = $derived(!!player);

    function setCurrentPlayer(playerId: string) {
        page.url.searchParams.set('player', playerId);
        goto(page.url.toString());
    }

    async function copyLink() {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
    }

    function cloneSettingsToNewGame() {
        const settings: IBingoGameSettings = {
            title: game.title,
            center: game.center,
            items: game.items,
        }
        window.open(`/?gameSettings=${encodeURIComponent(JSON.stringify(settings))}`, '_blank');
    }


    function addPlayer(player: {name: string, seed?: string}) {
        apiRequest('POST', `/game/${game.id}/players`, player)
            .then(() => {
                toast.success(`Player "${player.name}" added`);
            }).catch(e => {
                console.error(e);
                toast.error("Failed to add player ("+e.message+")");
            }).finally(() => {
                refreshData();
            });
    }

    let pendingDeletePlayer: IBingoGamePlayer | undefined = $state();

    function tryDeletePlayer(playerId: IBingoGamePlayer['id'], skip: boolean) {
        if (skip) return deletePlayer(playerId);
        pendingDeletePlayer = game.players.find(player => player.id == playerId);
    }

    function deletePlayer(playerId: IBingoGamePlayer['id']) {
        pendingDeletePlayer = undefined;
        
        apiRequest('DELETE', `/game/${game.id}/players/${playerId}`)
            .catch(e => {
                console.error(e);
                toast.error("Failed to delete player ("+e.message+")");
            }).then(() => {
                toast.success(`Player deleted`);
            }).finally(() => {
                refreshData();
            });
    }
</script>

<div class="flex flex-col items-center py-8">
    <div class="font-bold flex items-center gap-4 mb-2">
        <h1 class="text-2xl sm:text-4xl">{game.title}</h1>
        <Button variant="outline" size="sm" onclick={copyLink}><Link /></Button>
    </div>
    <h3 class="">
        <a href="/" class="text-blue-500 underline">Create your own bingo game</a>
    </h3>
    <Separator class="my-8" />

    <div class="flex flex-col items-center lg:flex-row lg:items-start gap-16">
        <div class="flex flex-col max-w-md">
            <div class="flex gap-4">
                <h2 class="text-xl font-bold mb-2">Bingo Items</h2>
                <button onclick={cloneSettingsToNewGame} class="text-blue-500 underline text-sm">Clone game settings</button>
            </div>
            <div class="flex flex-wrap">
                {#each game.items as item}
                    <div class="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg p-2 m-1">{item}</div>
                {/each}
            </div>
            <Separator class="my-8" />
            <h2 class="text-xl font-bold mb-2">Players</h2>
            <Table.Root>
                <Table.Header>
                    <Table.Row class="!bg-muted/0">
                        <Table.Head class="w-full">Name</Table.Head>
                        <Table.Head>Seed</Table.Head>
                        <Table.Head>Actions</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each game.players as player}
                        <Table.Row class={page.url.searchParams.get('player') == player.id ? "bg-muted/50" : "cursor-pointer"} tabindex={0} onclick={()=>setCurrentPlayer(player.id)}>
                            <Table.Cell>{player.name}</Table.Cell>
                            <Table.Cell>{player.seed}</Table.Cell>
                            <Table.Cell>
                                <Tooltip.Provider>
                                    <Tooltip.Root>
                                        <Tooltip.Trigger 
                                            onclick={(e) => tryDeletePlayer(player.id, e.shiftKey)}
                                            class={buttonVariants({variant: "outline", size: "sm"})}
                                        >
                                            <Trash2 />
                                        </Tooltip.Trigger>
                                        <Tooltip.Content>
                                            <p>Delete Player (SHIFT to skip dialogue)</p>
                                        </Tooltip.Content>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
            <div class="flex justify-center gap-4 mt-4">
                <AddNewPlayerButton submit={addPlayer} />
                <Button variant="secondary" onclick={copyLink}>Invite Others</Button>
            </div>
        </div>
        <div class="flex flex-col">
            <h2 class="text-xl font-bold mb-2">{hasBoard ? `${player?.name}'s Game` : 'Preview'}</h2>

            <div class="relative scale-75 sm:scale-100 mb-4">
                <BingoPreview {board} />
                {#if !hasBoard}
                    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm text-white text-xl font-bold">
                        <p class="text-center">{game.players.length > 0 ? 'No player selected' : 'Add a player first'}</p>
                    </div>
                {/if}
            </div>
            
            <div class="flex justify-center gap-4">
                <BingoDocumentGenerator title={game.title} playerName={player?.name || 'Player'} board={board} filename="{encodeURIComponent(player?.name||'player')}-bingo-sheet.pdf">
                    {#snippet button(generate)}
                        <Button variant="default" disabled={!hasBoard} onclick={generate}>
                            <Printer class="mr-2 size-4" />
                            Download PDF
                        </Button>
                    {/snippet}
                </BingoDocumentGenerator>
            </div>
        </div>
    </div>
</div>

<AlertDialog.Root open={!!pendingDeletePlayer} controlledOpen={false} onOpenChange={(open) => {if (!open) pendingDeletePlayer = undefined}}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
                This will remove the player information for {pendingDeletePlayer?.name} from the game. This action cannot be undone.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action 
                onclick={() => deletePlayer(pendingDeletePlayer!.id)}
                class={buttonVariants({variant: "destructive"})}
            >
                Continue
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>