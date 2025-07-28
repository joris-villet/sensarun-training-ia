

<script lang="ts">
  import Message from "./Message.svelte";
  import { storeMessage } from "../stores/messages.svelte";
  import type { IMessage } from "../interfaces";

  let index = $state(0);
  // Référence au conteneur de messages
  let containerRef: HTMLDivElement;

  function typeText(text: string) {
    setInterval(() => {
      index++;
      text.substring(0, index);
    }, 100);
  }

  // function removeThinkSection(text: string): string {
  //   const lastThinkEnd = text.lastIndexOf("</think>");
  //   if (lastThinkEnd !== -1) {
  //     return text.slice(lastThinkEnd + "</think>".length).trim();
  //   }
  //   return text;
  // }

  let messages = $state<IMessage[]>([]);
  let counterMessages = $derived(storeMessage.messages.length);

  // Fonction pour défiler vers le bas
  function scrollToBottom() {
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  }

  // Gérer l'événement de défilement
  function handleScroll(evt: Event) {
    console.log("Scroll event detected");
    // Vous pouvez ajouter d'autres logiques liées au défilement ici si nécessaire
  }

  $effect(() => {
    messages = storeMessage.messages;
    $inspect("messages => ", messages)
    //console.log('message model => ', messages)
    //console.log("counterMessages => ", counterMessages);

    // if (counterMessages > 10) {
    //   alert('10 messages now');
    // }
    
    // Utiliser setTimeout pour s'assurer que le DOM est mis à jour avant de défiler
    setTimeout(scrollToBottom, 10);
  });

  // Initialiser le défilement au montage du composant
  $effect.root(() => {
    // Cette fonction s'exécute une seule fois après le rendu initial
    setTimeout(scrollToBottom, 10);
  });
</script>

<div 
  bind:this={containerRef}
  onscroll={handleScroll} 
  class="overflow-y-auto text-neutral-400 text-sm py-[6rem]"
>
  {#each messages as message}
    <Message
      role={message.role}
      content={message.content}
      isNewMessage={message.isNewMessage}
    />
  {/each}
</div>