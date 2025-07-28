
import type { IMessage } from "../interfaces";


interface IStoreMessage {
  messages: IMessage[];
  isLoading: boolean;
  maxTokens: number;
  userTokens: number;
  tokenUsed: number;
}


export const storeMessage = $state<IStoreMessage>({
  messages: [],
  isLoading: false,
  maxTokens: 20000,
  userTokens: 20000,
  tokenUsed: 0,
});

// export const counterMessages = () => $derived(storeMessage.messages.length);
// console.log("counterMessages", counterMessages);


