<script lang="ts">
  import { storeUser } from "../stores/users.svelte";

  const { 
    picture = "",
    } = $props();

    $effect(() => {
      storeUser.picture = picture;
    })
</script>


