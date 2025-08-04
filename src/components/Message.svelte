<script lang="ts">
  import VibeMessage from "./VibeMessage.svelte";
  import { storeMessage } from "../stores/messages.svelte";
  import Icon from "@iconify/svelte";
  import { storeUser } from "../stores/users.svelte";
  import { storeQuestion } from "../stores/questions.svelte";
  const BotPicture = '/img/bot.jpeg';

const { 
  role = "" ,
  content = "",
  isNewMessage = undefined,
  } = $props();

let loading = $derived(storeMessage.isLoading);
const userPicture = $derived(storeUser.picture)

function handleMessageDone(value: boolean) {
		// messageCompleted = value;
    storeQuestion.isDone = value;
		console.log('Message terminé !', value);
	}

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
          <VibeMessage 
            onMessageDone={handleMessageDone}
            content={content} 
          />
        </p>
      </div>
    </div>
{/if}
  


<style>
  .anim-enter {
    animation: animEnter .4s ease forwards;
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






