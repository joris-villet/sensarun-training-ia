<!-- <script lang="ts">
  import Message from "./Message.svelte";
  import { storeMessage } from "../stores/messages.svelte";
  import type { IMessage } from "../interfaces";
  import { storeUser } from "../stores/users.svelte";
  import { storeQuestion } from "../stores/questions.svelte";

  // let index = $state(0);
  // let questions: { question: string; field_key: string }[] = $state([]);

  // let containerRef: HTMLDivElement;
  let containerRef: HTMLDivElement;

  let messages = $state<IMessage[]>([]);
  // let counterMessages = $derived(storeMessage.messages.length);

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

  // Fetch from DB or API
  async function loadQuestions() {
    const res = await fetch("/api/questions");
    const data = await res.json();
    storeQuestion.questions = data;
    askNextQuestion();
  }


  function askNextQuestion() {

    const q = storeQuestion.questions[storeQuestion.questionsIndex];

    storeMessage.messages.push({
      role: "assistant",
      content: q.question,
      isNewMessage: true,
    });
  }

  $effect(() => {
    containerRef.focus();

    if (storeUser.first_connection && storeMessage.messages.length === 0) {
      loadQuestions();
    }
    console.log("question is done ?", storeQuestion.isDone, storeQuestion.required)

    if (!!storeQuestion.isDone && !storeQuestion.required) storeQuestion.questionsIndex++;

    messages = storeMessage.messages;
    $inspect("messages => ", messages);

    setTimeout(scrollToBottom, 10);

    //console.log('message model => ', messages)
    //console.log("counterMessages => ", counterMessages);

    // if (counterMessages > 10) {
    //   alert('10 messages now');
    // }

    // Utiliser setTimeout pour s'assurer que le DOM est mis à jour avant de défiler
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
</div> -->



<script lang="ts">
  import Message from "./Message.svelte";
  import { storeMessage } from "../stores/messages.svelte";
  import type { IMessage } from "../interfaces";
  import { storeUser } from "../stores/users.svelte";
  import { storeQuestion } from "../stores/questions.svelte";

  let containerRef: HTMLDivElement;
  let messages = $state<IMessage[]>([]);

  // Fonction pour défiler vers le bas
  function scrollToBottom() {
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  }

  // Gérer l'événement de défilement
  function handleScroll(evt: Event) {
    console.log("Scroll event detected");
  }

  // Fetch from DB or API
  async function loadQuestions() {
    const res = await fetch("/api/questions");
    const data = await res.json();
    storeQuestion.questions = data;
    askNextQuestion();
  }

  function askNextQuestion() {
    const q = storeQuestion.questions[storeQuestion.questionsIndex];
    storeMessage.messages.push({
      role: "assistant",
      content: q.question,
      isNewMessage: true,
    });
  }

  let hasInitialized = false;

  $effect(() => {
    if (containerRef && !hasInitialized) {
      containerRef.focus();
      hasInitialized = true;
      
      if (storeUser.first_connection && storeMessage.messages.length === 0) {
        loadQuestions();
      }
    }
  });

  // Effect séparé pour surveiller isDone
  let lastIsDone = false;
  $effect(() => {
    const currentIsDone = storeQuestion.isDone;
    
    if (currentIsDone && !storeQuestion.required && !lastIsDone) {
      setTimeout(() => {
        storeQuestion.questionsIndex++;
        askNextQuestion();
      }, 0);
    }
    
    lastIsDone = currentIsDone;
  });

  // Effect pour synchroniser les messages
  $effect(() => {
    messages = storeMessage.messages;
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