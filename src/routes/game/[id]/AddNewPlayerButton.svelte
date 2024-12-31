<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import bingoGamePlayerValidator from "$lib/validation/bingoGamePlayerValidator";
	import { toast } from "svelte-sonner";
	import { ZodError } from "zod";

    interface Props {
        submit: ({name, seed}: {name: string, seed?: string}) => void;
    }

    let { submit: submitProp }: Props = $props();

    let open = $state(false);

    let nameValue: string = $state("");
    let seedValue: string = $state("");

    function submit() {
        const player = {name: nameValue, seed: seedValue || undefined};
        try {
            const validatedPlayer = bingoGamePlayerValidator.parse(player);
            submitProp(validatedPlayer);
            open = false;
            nameValue = "";
            seedValue = "";
        } catch(e) {
            console.error(e);
            if (e instanceof ZodError) toast.error(e.errors[0].message);
        }
    }

</script>

<Dialog.Root bind:open>
    <Dialog.Trigger class={buttonVariants({ variant: "secondary" })}
      >Add New Player</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Add New Player</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Name</Label>
                <Input bind:value={nameValue} id="name" placeholder="John Doe" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="seed" class="text-right">Seed</Label>
                <Input bind:value={seedValue} id="seed" placeholder="Leave blank for random" class="col-span-3" />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit" onclick={submit}>Create</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>