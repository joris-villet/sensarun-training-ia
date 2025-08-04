
<script lang="ts">
  import { storeMessage } from "../stores/messages.svelte";
  import { storeUser } from "../stores/users.svelte";

  interface Props {
    name: string;
    firstConnexion: string;
  }
  const { name } = $props() as Props;

  const firstConnexion = $derived(storeUser.first_connection)
  
</script>



<h2 class="italic text-center text-xl text-neutral-500 shadow-lime-400 shadow-md bg-white py-2">
  {#if !!firstConnexion}
    Bienvenue {name}
  {:else}
    Bonjour {name}
  {/if}
</h2>
<h3>first connexion from store {firstConnexion}</h3>
<p>store messages {storeMessage.messages.length}</p>

