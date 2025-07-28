// src/components/CoachChat.svelte
<script lang="ts">
  import { CoachService } from '../lib/services/CoachService';
  import type { CoachResponse } from '../interfaces/coach';

  // État avec les runes Svelte 5
  let userInput = $state('');
  let conversation = $state<Array<{
    role: 'user' | 'assistant';
    content: string;
    suggestions?: string[];
    intent?: string;
  }>>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // Instance du service coach
  const coach = new CoachService();

  // Messages prédéfinis pour démarrer
  const quickStarts = [
    { text: "Je veux commencer la course à pied", intent: "collecte_donnees" },
    { text: "J'ai besoin d'un programme pour un 10K", intent: "programme_entrainement" },
    { text: "J'ai mal aux genoux après ma course", intent: "blessure_prevention" },
    { text: "Je ne trouve plus la motivation", intent: "motivation" }
  ];

  // Profil athlète réactif - mise à jour après chaque message
  let athleteProfile = $state(coach.getAthleteProfile());

  async function sendMessage(message?: string, intent?: string) {
    const messageToSend = message || userInput;
    if (!messageToSend.trim()) return;
    
    loading = true;
    error = null;

    try {
      // Ajouter le message utilisateur à la conversation
      conversation.push({ 
        role: 'user', 
        content: messageToSend 
      });

      const response: CoachResponse = await coach.sendMessage(messageToSend, intent);
      
      // Ajouter la réponse du coach
      conversation.push({ 
        role: 'assistant', 
        content: response.message,
        suggestions: response.suggestions,
        intent: response.intent
      });

      // Mettre à jour le profil affiché
      athleteProfile = coach.getAthleteProfile();
      
      if (!message) userInput = ''; // Clear input seulement si message tapé manuellement

    } catch (err: any) {
      error = `Erreur: ${err.message}`;
      console.error('Erreur sendMessage:', err);
    }
    
    loading = false;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !loading && userInput.trim()) {
      sendMessage();
    }
  }

  function useSuggestion(suggestion: string) {
    sendMessage(suggestion);
  }

  function quickStart(text: string, intent: string) {
    sendMessage(text, intent);
  }

  function clearChat() {
    conversation = [];
    coach.clearConversation();
    athleteProfile = {};
    error = null;
  }
</script>

<div class="coach-container">
  <!-- Header avec actions -->
  <div class="coach-header">
    <h2>🏃‍♂️ Coach Running</h2>
    {#if conversation.length > 0}
      <button class="clear-btn" on:click={clearChat}>
        🗑️ Nouveau chat
      </button>
    {/if}
  </div>

  <!-- Profil athlète -->
  {#if Object.keys(athleteProfile).length > 0}
    <div class="athlete-profile">
      <h4>📊 Ton profil</h4>
      <div class="profile-items">
        {#if athleteProfile.age}
          <span class="profile-tag">🎂 {athleteProfile.age} ans</span>
        {/if}
        {#if athleteProfile.experience}
          <span class="profile-tag">🏃‍♂️ {athleteProfile.experience}</span>
        {/if}
        {#if athleteProfile.objectifPrincipal}
          <span class="profile-tag">🎯 {athleteProfile.objectifPrincipal}</span>
        {/if}
        {#if athleteProfile.kilometrageHebdo}
          <span class="profile-tag">📏 {athleteProfile.kilometrageHebdo}km/sem</span>
        {/if}
        {#if athleteProfile.nbSortiesHebdo}
          <span class="profile-tag">📅 {athleteProfile.nbSortiesHebdo}x/sem</span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Messages de démarrage rapide -->
  {#if conversation.length === 0}
    <div class="welcome">
      <h3>Salut ! Je suis ton coach personnel 💪</h3>
      <p>Je vais t'aider à structurer tes entraînements, éviter les blessures et atteindre tes objectifs en course à pied.</p>
      
      <div class="quick-starts">
        <p class="quick-title">Comment puis-je t'aider ?</p>
        {#each quickStarts as { text, intent }}
          <button 
            class="quick-start-btn" 
            on:click={() => quickStart(text, intent)}
          >
            {text}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Conversation -->
  <div class="conversation" class:has-messages={conversation.length > 0}>
    {#each conversation as msg, index}
      <div class="message {msg.role}">
        <div class="message-content">
          <div class="message-text">{msg.content}</div>
          
          {#if msg.intent}
            <div class="intent-badge">
              Intent: {msg.intent}
            </div>
          {/if}
        </div>
        
        {#if msg.suggestions && msg.suggestions.length > 0}
          <div class="suggestions">
            <p class="suggestions-title">💡 Tu peux aussi me demander :</p>
            <div class="suggestions-grid">
              {#each msg.suggestions as suggestion}
                <button 
                  class="suggestion-btn"
                  on:click={() => useSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}

    {#if loading}
      <div class="message assistant">
        <div class="message-content loading">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Erreurs -->
  {#if error}
    <div class="error-message">
      ⚠️ {error}
      <button on:click={() => error = null}>✕</button>
    </div>
  {/if}

  <!-- Zone de saisie -->
  <div class="input-area">
    <div class="input-wrapper">
      <input 
        bind:value={userInput}
        placeholder="Pose ta question au coach..."
        on:keypress={handleKeyPress}
        disabled={loading}
        class="message-input"
      />
      <button 
        on:click={() => sendMessage()}
        disabled={loading || !userInput.trim()}
        class="send-btn"
      >
        {#if loading}
          ⏳
        {:else}
          🏃‍♂️
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .coach-container {
    max-width: 800px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .coach-header {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .coach-header h2 {
    margin: 0;
    font-size: 24px;
  }

  .clear-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .clear-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .athlete-profile {
    background: #f0f9ff;
    padding: 15px 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .athlete-profile h4 {
    margin: 0 0 10px 0;
    color: #1e40af;
    font-size: 16px;
  }

  .profile-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .profile-tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 13px;
    font-weight: 500;
  }

  .welcome {
    padding: 40px 20px;
    text-align: center;
  }

  .welcome h3 {
    color: #1e40af;
    margin: 0 0 10px 0;
    font-size: 22px;
  }

  .welcome p {
    color: #64748b;
    margin: 0 0 30px 0;
    line-height: 1.6;
  }

  .quick-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 15px;
  }

  .quick-starts {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 500px;
    margin: 0 auto;
  }

  .quick-start-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    text-align: left;
    transition: all 0.2s;
  }

  .quick-start-btn:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .conversation {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
  }

  .conversation.has-messages {
    padding-top: 20px;
  }

  .message {
    margin: 20px 0;
  }

  .message.user {
    display: flex;
    justify-content: flex-end;
  }

  .message.assistant {
    display: flex;
    justify-content: flex-start;
  }

  .message-content {
    max-width: 80%;
    padding: 15px 20px;
    border-radius: 18px;
    position: relative;
  }

  .message.user .message-content {
    background: #3b82f6;
    color: white;
  }

  .message.assistant .message-content {
    background: #f1f5f9;
    color: #1e293b;
  }

  .message.assistant .message-content.loading {
    background: #f1f5f9;
    padding: 20px;
  }

  .message-text {
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .intent-badge {
    margin-top: 8px;
    font-size: 12px;
    opacity: 0.7;
    font-style: italic;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #64748b;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .suggestions {
    margin-top: 15px;
  }

  .suggestions-title {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 10px 0;
    font-weight: 500;
  }

  .suggestions-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .suggestion-btn {
    background: #e2e8f0;
    border: none;
    padding: 8px 15px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    color: #374151;
  }

  .suggestion-btn:hover {
    background: #cbd5e1;
    transform: translateY(-1px);
  }

  .error-message {
    background: #fef2f2;
    color: #dc2626;
    padding: 15px 20px;
    margin: 10px 20px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #fca5a5;
  }

  .error-message button {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-size: 16px;
    padding: 0 5px;
  }

  .input-area {
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    background: #fafafa;
  }

  .input-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .message-input {
    flex: 1;
    padding: 15px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 25px;
    outline: none;
    font-size: 16px;
    background: white;
    transition: border-color 0.2s;
  }

  .message-input:focus {
    border-color: #3b82f6;
  }

  .message-input:disabled {
    background: #f8fafc;
    opacity: 0.6;
  }

  .send-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 15px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .send-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: scale(1.05);
  }

  .send-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .coach-container {
      height: 100vh;
      border-radius: 0;
    }

    .message-content {
      max-width: 90%;
    }

    .quick-starts {
      max-width: none;
    }

    .suggestions-grid {
      flex-direction: column;
    }

    .suggestion-btn {
      text-align: center;
    }
  }
</style>