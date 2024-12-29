<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen">
	{@render children()}
</div>
<div class="w-full text-center p-4 bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
	Made by <a href="https://1withspaghetti.com" target="_blank" class="text-blue-500">1withspaghetti</a> | 
	<a href="https://github.com/1withspaghetti/NewYearsBingo" target="_blank" class="text-blue-500">GitHub</a>
</div>

