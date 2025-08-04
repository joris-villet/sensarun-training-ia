<script lang="ts">
  import { storeMessage } from "../stores/messages.svelte";
  import type { IResponseTeacher } from "../interfaces";
  import { storeUser } from "../stores/users.svelte";
  import type { IMessage } from "../interfaces";
  import ky from "ky";
  import { storeQuestion } from "../stores/questions.svelte";

  type ParsedResponse = {
    value: string | number;
    text?: string;
    valid?: boolean;
    field?: string;
    confidence?: "low" | "medium" | "high";
  };

  let input = $state("");
  // let answerQuiz = $state("");
  let updatedMessages = $derived(storeMessage.messages);

  const sendMessage = async (evt: any) => {
  evt.preventDefault();
  if (!input) return;

  let userMessage = input.trim();
  input = "";

  if (!!storeUser.first_connection) {
    console.log("user message => ", userMessage);

    storeMessage.messages = storeMessage.messages.map((message) => ({
      ...message,
      isNewMessage: false,
    }));

    storeMessage.messages = storeMessage.messages.concat({
      role: "user",
      content: userMessage,
      isNewMessage: true,
    });

    console.log('question is required ? => ', storeQuestion.required)

    const currentSpeech = storeMessage.messages.slice(-4);
    console.log("currentSpeech => ", currentSpeech)

    try {
      // Maintenant l'API retourne directement l'objet parsé
      type ResponseModel = {
        field: string;
        value: any;
        text: string;
        valid: boolean;
      }

      const responseModel: ResponseModel = await ky.post('/api/agent', {
        json: currentSpeech
      }).json();
      
      if (responseModel) {
        console.log("response résumé => ", responseModel);
        
        // Si valid est false, on affiche le message d'erreur et on reste sur la même question
        if (!responseModel.valid) {
          storeMessage.messages = storeMessage.messages.concat({
            role: "assistant",
            content: responseModel.text,
            isNewMessage: true,
          });
          // Important : on sort de la fonction ici pour ne pas incrémenter l'index
          return;
        } else {
          // Si la réponse est valide, on sauvegarde et on passe à la question suivante
          console.log('save answer in db, and fetch next question');
          
          // Sauvegarder la réponse ici
          // await fetch("/api/answer", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({
          //     questionId: currentQuestion.id,
          //     value: responseModel.value, // Utiliser la valeur parsée
          //   }),
          // });
          
          // Incrémenter l'index seulement si la réponse est valide
          if (!storeQuestion.required) storeQuestion.questionsIndex++;
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
      // Afficher un message d'erreur à l'utilisateur
      storeMessage.messages = storeMessage.messages.concat({
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Pouvez-vous réessayer ?",
        isNewMessage: true,
      });
      return;
    }

    // Vérifier si on a terminé toutes les questions
    if (storeQuestion.questions.length === storeQuestion.questionsIndex) {
      storeUser.first_connection = false;
      return;
    }

    // Afficher la prochaine question
    setTimeout(() => {
      storeMessage.messages = storeMessage.messages.concat({
        role: "assistant",
        content: storeQuestion.questions[storeQuestion.questionsIndex].question,
        isNewMessage: true,
      });
    }, 1000);

    return;
  }

    // reset isNewMessage to cancel animate
    storeMessage.messages = storeMessage.messages.map((message) => ({
      ...message,
      isNewMessage: false,
    }));

    setTimeout(() => {
      storeMessage.isLoading = true;
    }, 400);

    storeMessage.messages = storeMessage.messages.concat({
      role: "user",
      content: userMessage,
      isNewMessage: true,
    });

    try {
      console.log("update messages => ", updatedMessages);

      const responseTeacher = await ky
        .post<IResponseTeacher>("/api/groq", {
          json: updatedMessages,
        })
        .json();

      if (responseTeacher) {
        console.log("response coach => ", responseTeacher);

        storeMessage.isLoading = false;

        setTimeout(() => {
          storeMessage.messages = storeMessage.messages.concat({
            role: "assistant",
            content: responseTeacher.message,
            isNewMessage: true,
          });
        }, 300);
      }
    } catch (err: any) {
      console.log("err frontend => ", err);
      return err;
    }
  };
</script>

<section>
  <form class="flex items-center rounded-md px-4 py-4">
    <label for="prompt" class="sr-only">Enter your prompt</label>
    <input
      bind:value={input}
      id="prompt"
      class="mx-2 flex-1 rounded-lg px-2 py-4 text-base text-neutral-600 bg-white/80 border-2 border-lime-400 shadow-2xs shadow-neutral-300 focus:border-4 focus:outline-none"
      placeholder="Enter your prompt"
      autocomplete="off"
    />
    <button
      onclick={sendMessage}
      class="flex justify-center items-center hover:border-8 text-neutral-600 bg-white border-2 border-lime-400 w-16 h-16 rounded-full sm:p-2"
      type="submit"
      aria-label="Send message"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        aria-hidden="true"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="black"
        fill="white"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 14l11 -11"></path>
        <path
          d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
        ></path>
      </svg>
    </button>
  </form>
</section>
