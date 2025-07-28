<script lang="ts">
  import VibeMessage from "./VibeMessage.svelte";
  import { storeMessage } from "../stores/messages.svelte";
  import Icon from "@iconify/svelte";
  import { storeUser } from "../stores/users.svelte";
  const BotPicture = '/img/bot.jpeg';

const { 
  role = "" ,
  content = "",
  isNewMessage = undefined,
  } = $props();

let loading = $derived(storeMessage.isLoading);
const userPicture = $derived(storeUser.picture)

</script>

{#if role === "user"}
  <div class="flex flex-row px-4 py-4 sm:px-6">
    <img
      class="anim-enter-img mr-2 flex h-8 w-8 rounded-full sm:mr-4 shadow-sm border border-lime-200"
      src={userPicture}
      alt={`Photo de profil de ${storeUser.name}`}
    />

    <div class="flex max-w-3xl items-center border bg-lime-100/70 px-4 py-2 rounded-lg shadow-sm border-lime-200">
      <p class="anim-enter whitespace-pre-wrap text-neutral-600">{content}</p>
    </div>
  </div>
{/if}


{#if loading && isNewMessage}
  <div class="flex px-4 py-4 sm:px-6">
    <img
      class="anim-enter-img mr-2 flex h-8 w-8 rounded-full sm:mr-4 shadow-sm border-2 border-lime-200"
      src={BotPicture}
      alt="icon loading"
    />
  
    <div class="flex w-full flex-col items-start lg:flex-row lg:justify-between">
      <p class="anim-enter max-w-3xl">
        <Icon icon="svg-spinners:3-dots-bounce" width="24" height="24" />
      </p>
    </div>
  </div>
{/if}


{#if role === 'assistant'}

    <div class="flex px-4 py-2 sm:px-6">
      <img
        class="anim-enter-spinner mr-2 flex h-8 w-8 rounded-full sm:mr-4 shadow-sm border border-lime-200"
        src={BotPicture}
        alt="icon bot"
      />
      <div class="flex w-full flex-col items-start lg:flex-row lg:justify-between border-2 border-lime-200 bg-white/70 px-4 py-2 rounded-lg shadow-sm">
        <p class="anim-enter max-w-3xl text-neutral-600">
          <VibeMessage content={content} />
        </p>
      </div>
    </div>
{/if}
  


<style>
  .anim-enter {
    animation: animEnter .7s ease forwards;
  }

  .anim-enter-img {
    animation: animEnterImg .7s ease forwards;
  }

  .anim-enter-spinner {
    animation: animEnterSpinner .4s ease forwards;
  }

  @keyframes animEnter {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes animEnterImg {
    from {
      opacity: 0;
      transform: scale(0);

    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes animEnterSpinner {
    0% {
      transform: scale(1);

    }
    50% {
      transform: scale(0.7);
    }
    100% {
      transform: scale(1);
    }
  }
</style>






<!-- <script lang="ts">
  import VibeMessage from "./VibeMessage.svelte";
  import { storeMessage } from "../stores/messages.svelte";
  import Icon from "@iconify/svelte";

// Définition des types
type QuizContent = {
  type: string;
  question: string;
  choices: string[];
};

type MessageContent = string | QuizContent;

const { 
  role = "",
  content = "",
  isNewMessage = undefined
} = $props<{
  role?: string;
  content?: MessageContent;
  isNewMessage?: boolean;
}>();



const handleAnswer = (answer: string) => {
  // console.log("Selected answer:", answer);
  storeMessage.answerQuiz = answer;
};

let loading = $derived(storeMessage.isLoading);


function isQuizContent(content: MessageContent): content is QuizContent {
  return typeof content === 'object' && content !== null && 'type' in content && content.type === 'quiz';
}
</script>

{#if role === "user"}
  <div class="flex flex-row px-4 py-4 sm:px-6">
    <img
      class="anim-enter-img mr-2 flex h-8 w-8 rounded-full sm:mr-4 border border-amber-400"
      src="/photo-user.jpg"
      alt="Avatar"
    />

    <div class="flex max-w-3xl items-center border bg-amber-100 px-4 py-2 rounded-lg shadow-sm border-amber-400">
      <p class="anim-enter whitespace-pre-wrap">{content}</p>
    </div>
  </div>
{/if}

{#if loading && isNewMessage}
  <div class="flex px-4 py-4 sm:px-6">
    <img
      class="anim-enter-img mr-2 flex h-8 w-8 rounded-full sm:mr-4 border border-blue-400"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1FtoIs7pLGQzDJTbB33U9DaXZj3Pn-6c6uA&s"
      alt="Loading"
    />
  
    <div class="flex w-full flex-col items-start lg:flex-row lg:justify-between">
      <p class="anim-enter max-w-3xl">
        <Icon icon="svg-spinners:3-dots-bounce" width="24" height="24" />
      </p>
    </div>
  </div>
{/if}

{#if role === 'assistant'}
  <div class="flex px-4 py-2 sm:px-6">
    <img
      class="anim-enter-spinner mr-2 flex h-8 w-8 rounded-full sm:mr-4 border border-blue-400"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1FtoIs7pLGQzDJTbB33U9DaXZj3Pn-6c6uA&s"
      alt="Assistant"
    />
    <div class="flex w-full flex-col items-start lg:flex-row lg:justify-between border border-blue-400 bg-blue-100 px-4 py-2 rounded-lg shadow-sm">
      {#if isQuizContent(content)}

        <div class="anim-enter max-w-3xl quiz-container">
          <h3 class="font-bold text-lg mb-3">{content.question}</h3>
          
          <div class="flex flex-col space-y-2">
            {#each content.choices as choice, index}
              <button 
                class="py-2 px-4 bg-white hover:bg-blue-50 text-left rounded-md border border-blue-200 transition-colors"
                onclick={() => handleAnswer(choice)}
              >
                <span class="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-2 text-center">{index + 1}</span>
                {choice}
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <p class="anim-enter max-w-3xl">
          <VibeMessage content={content} />
        </p>
      {/if}
    </div>
  </div>
{/if}


<style>
  .anim-enter {
    animation: animEnter .7s ease forwards;
  }

  .anim-enter-img {
    animation: animEnterImg .7s ease forwards;
  }

  .anim-enter-spinner {
    animation: animEnterSpinner .4s ease forwards;
  }

  @keyframes animEnter {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes animEnterImg {
    from {
      opacity: 0;
      transform: scale(0);

    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes animEnterSpinner {
    0% {
      transform: scale(1);

    }
    50% {
      transform: scale(0.7);
    }
    100% {
      transform: scale(1);
    }
  }
</style>  -->