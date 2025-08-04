<script lang="ts">
  import { storeUser } from "../stores/users.svelte";

  const { 
    picture = "",
    firstConnexion = false,
    } = $props();

    $effect(() => {
      storeUser.picture = picture;
      storeUser.first_connection = firstConnexion;
    })
</script>


