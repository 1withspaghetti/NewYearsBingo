<script lang="ts">
	import type { IBingoBoard } from "$lib/types/bingoBoard";
	import { tick, type Snippet } from "svelte";
	import BingoPreview from "./BingoPreview.svelte";

    interface Props {
        board: IBingoBoard;
        button: Snippet<[()=>void]>
        filename?: string;
    }

    let { board, button, filename }: Props = $props();

    let showDocument = $state(false);
    let documentRef: HTMLDivElement|null = $state(null);

    async function generateDocument() {
        showDocument = true;
        await tick(); // Wait for the DOM to update

        const jsPDF = (await import("jspdf")).default; // Lazy load the library to reduce bundle size (~1MB)
        const doc = new jsPDF({
            orientation: "portrait",
            format: "letter",
            unit: "pt",
        });

        if (documentRef === null) throw new Error("Document reference is null");
        doc.html(documentRef, {
            width: 612, // https://github.com/parallax/jsPDF/blob/f60dcfad962dd73fd1a4192b726833a9d70b3fbc/docs/modules_html.js.html#L923
            windowWidth: 612,
            html2canvas: {
                windowWidth: 612,
                windowHeight: 792,
            },
            callback: () => {
                doc.output("dataurlnewwindow", { filename: filename || "bingo-sheet.pdf" });
                showDocument = false;
            },
        });
        
    }
</script>

{@render button(generateDocument)}

<div class="hidden">
    {#if showDocument}
        <div bind:this={documentRef}><!-- All the content in here will be rendered to the PDF -->
            <div class="w-full h-full bg-white p-4">
                <div class="w-full flex flex-col items-center">
                    <BingoPreview {...board} />
                </div>
            </div>
        </div>
    {/if}
</div>