<script lang="ts">
  // import sounds from '../audio/woosh-effect.mp3'

  //let { content } = $props();
	const props: {
        onMessageDone(value: boolean): void;
        content: string;
    } = $props();
  let index = $state(0);
	let messageLength = $derived(props.content.length);
  let vibeMessage = $derived(props.content.substring(0, index));
  
  $effect(() => {
    let timer = setInterval(() => {
      index++;
      if (index === messageLength) {
					props.onMessageDone(true);
					clearInterval(timer);
				}
    },25)
  });

  // const audio = new Audio(sounds); 
  // audio.play();

</script>

<!-- <span class="whitespace-pre-line font-mono leading-none">{vibeMessage}</span> -->
<span>{vibeMessage}</span>





 