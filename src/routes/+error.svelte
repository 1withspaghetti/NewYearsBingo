<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="container flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl sm:text-4xl font-bold">Uh oh... an error occurred 🥺</h1>
    <p><b>Error code</b>: <code>{page.status}</code></p>
    <p><b>Message</b>: {page.error?.message}</p>

</div>
