<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
	import { toast } from 'svelte-sonner';
    import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Link, Trash2 } from 'lucide-svelte';
    import { page } from '$app/state';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { goto } from '$app/navigation';

    let { data }: { data: PageData } = $props();

    let game = $derived(data.game);

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
    

    let pendingDeletePlayer: IBingoGamePlayer | undefined = $state();

    function tryDeletePlayer(playerId: IBingoGamePlayer['id'], skip: boolean) {
        if (skip) return deletePlayer(playerId);
        pendingDeletePlayer = game.players.find(player => player.id == playerId);
    }

    function deletePlayer(playerId: IBingoGamePlayer['id']) {
        pendingDeletePlayer = undefined;
        
        // TODO: Implement api call to delete player
        
        toast.success("Player deleted");
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

    <div class="flex">
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
                        <Table.Row class={page.url.hash == '#'+player.id ? "bg-muted/50" : "cursor-pointer"} tabindex={0} onclick={()=>window.location.href = `#${player.id}`}>
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