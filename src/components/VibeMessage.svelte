<script lang="ts">
  // import sounds from '../audio/woosh-effect.mp3'

  let { content } = $props();
  let index = $state(0);
  
  let vibeMessage = $derived(content.substring(0, index));
  
  $effect(() => {
    setInterval(() => {
      index++;
    }, 10)
  });

  // const audio = new Audio(sounds); 
  // audio.play();

</script>

<!-- <span class="whitespace-pre-line font-mono leading-none">{vibeMessage}</span> -->
<span>{vibeMessage}</span>





 <!-- <script lang="ts">
  type QuizContent = {
    type: string;
    question: string;
    choices: string[];
  };

  type MessageContent = string | QuizContent;

  const { content = "" } = $props<{
    content?: MessageContent;
  }>();


  function isQuizContent(content: MessageContent): content is QuizContent {
    return typeof content === 'object' && content !== null && 'type' in content && content.type === 'quiz';
  }

  let selectedAnswer =$state("");
</script>

{#if isQuizContent(content)}

  <div class="quiz-container w-full">
    <h3 class="font-bold text-lg mb-3">{content.question}</h3>
    
    <div class="relative">

      <select 
        bind:value={selectedAnswer}
        class="w-full p-3 pr-10 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 appearance-none"
      >
        <option value="" disabled selected>Choisissez une réponse...</option>
        {#each content.choices as choice}
          <option value={choice}>{choice}</option>
        {/each}
      </select>
      

      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    

    {#if selectedAnswer}
      <button 
        class="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onclick={() => {
          console.log(`Réponse sélectionnée: ${selectedAnswer}`);
  
        }}
      >
        Valider
      </button>
    {/if}
  </div>
{:else}
  <span class="whitespace-pre-wrap">{content}</span>
{/if} -->