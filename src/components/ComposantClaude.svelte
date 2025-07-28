// Exemple d'utilisation dans un composant Svelte
import type { AthleteProfile, CoachRequest, CoachResponse } from '../interfaces/coach';

export class CoachService {
  private athleteProfile: AthleteProfile = {};
  private conversationHistory: Array<{ role: string; content: string }> = [];

  // Méthode principale pour envoyer un message au coach
  async sendMessage(userMessage: string, intentType?: string): Promise<CoachResponse> {
    // Ajouter le message à l'historique
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });

    const request: CoachRequest = {
      messages: this.conversationHistory,
      athleteProfile: this.athleteProfile,
      intentType: intentType as any,
      urgency: this.detectUrgency(userMessage),
      contextType: this.conversationHistory.length === 1 ? 'first_contact' : 'follow_up'
    };

    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const data: CoachResponse = await response.json();

      // Ajouter la réponse du coach à l'historique
      this.conversationHistory.push({
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      });

      // Extraire automatiquement les données utilisateur de la conversation
      this.updateAthleteProfile(userMessage, data);

      return data;

    } catch (error) {
      console.error('Erreur Coach Service:', error);
      throw error;
    }
  }

  // Mise à jour automatique du profil athlète
  private updateAthleteProfile(userMessage: string, coachResponse: CoachResponse) {
    const message = userMessage.toLowerCase();

    // Extraction automatique de données courantes
    
    // Âge
    const ageMatch = message.match(/(\d+)\s*ans?/);
    if (ageMatch) {
      this.athleteProfile.age = parseInt(ageMatch[1]);
    }

    // Expérience
    if (message.includes('débutant') || message.includes('commence')) {
      this.athleteProfile.experience = 'debutant';
    } else if (message.includes('quelques années') || message.includes('intermédiaire')) {
      this.athleteProfile.experience = 'intermediaire';
    } else if (message.includes('expérimenté') || message.includes('avancé')) {
      this.athleteProfile.experience = 'avance';
    }

    // Objectifs
    if (message.includes('marathon')) {
      this.athleteProfile.objectifPrincipal = 'marathon';
    } else if (message.includes('10k') || message.includes('10 km')) {
      this.athleteProfile.objectifPrincipal = '10k';
    } else if (message.includes('5k') || message.includes('5 km')) {
      this.athleteProfile.objectifPrincipal = '5k';
    } else if (message.includes('semi')) {
      this.athleteProfile.objectifPrincipal = 'semi';
    }

    // Kilométrage
    const kmMatch = message.match(/(\d+)\s*km.*semaine/);
    if (kmMatch) {
      this.athleteProfile.kilometrageHebdo = parseInt(kmMatch[1]);
    }

    // Fréquence d'entraînement
    const freqMatch = message.match(/(\d+)\s*(fois|x).*semaine/);
    if (freqMatch) {
      this.athleteProfile.nbSortiesHebdo = parseInt(freqMatch[1]);
    }

    console.log('Profil mis à jour:', this.athleteProfile);
  }

  // Détection de l'urgence du message
  private detectUrgency(message: string): 'low' | 'medium' | 'high' {
    const urgentWords = ['urgent', 'douleur', 'mal', 'blessé', 'course demain', 'rapidement'];
    const mediumWords = ['bientôt', 'prochaine course', 'dans quelques jours'];
    
    const lowerMessage = message.toLowerCase();
    
    if (urgentWords.some(word => lowerMessage.includes(word))) {
      return 'high';
    }
    
    if (mediumWords.some(word => lowerMessage.includes(word))) {
      return 'medium';
    }
    
    return 'low';
  }

  // Méthodes utilitaires
  getAthleteProfile(): AthleteProfile {
    return { ...this.athleteProfile };
  }

  updateProfileManually(updates: Partial<AthleteProfile>) {
    this.athleteProfile = { ...this.athleteProfile, ...updates };
  }

  clearConversation() {
    this.conversationHistory = [];
  }

  exportData() {
    return {
      profile: this.athleteProfile,
      conversation: this.conversationHistory,
      exportDate: new Date().toISOString()
    };
  }
}

// Exemples d'utilisation dans un composant Svelte

/*
<script lang="ts">
  import { CoachService } from './CoachService';
  
  const coach = new CoachService();
  let userInput = '';
  let conversation = [];
  let loading = false;

  async function sendMessage() {
    if (!userInput.trim()) return;
    
    loading = true;
    try {
      const response = await coach.sendMessage(userInput);
      
      conversation = [...conversation, 
        { role: 'user', content: userInput },
        { 
          role: 'assistant', 
          content: response.message,
          suggestions: response.suggestions,
          intent: response.intent
        }
      ];
      
      userInput = '';
    } catch (error) {
      console.error('Erreur:', error);
    }
    loading = false;
  }

  // Messages prédéfinis pour démarrer
  const quickStarts = [
    { text: "Je veux commencer la course à pied", intent: "collecte_donnees" },
    { text: "J'ai besoin d'un programme pour un 10K", intent: "programme_entrainement" },
    { text: "J'ai mal aux genoux après ma course", intent: "blessure_prevention" },
    { text: "Je ne trouve plus la motivation", intent: "motivation" }
  ];

  async function quickStart(message: string, intent: string) {
    userInput = message;
    await sendMessage();
  }
</script>

<div class="coach-interface">
  <!-- Quick starts pour nouveaux utilisateurs -->
  {#if conversation.length === 0}
    <div class="quick-starts">
      <h3>Comment puis-je t'aider ?</h3>
      {#each quickStarts as { text, intent }}
        <button on:click={() => quickStart(text, intent)}>
          {text}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Conversation -->
  <div class="conversation">
    {#each conversation as msg}
      <div class="message {msg.role}">
        <p>{msg.content}</p>
        {#if msg.suggestions}
          <div class="suggestions">
            {#each msg.suggestions as suggestion}
              <button on:click={() => { userInput = suggestion; sendMessage(); }}>
                {suggestion}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Input -->
  <div class="input-area">
    <input 
      bind:value={userInput} 
      placeholder="Pose ta question au coach..."
      on:keypress={(e) => e.key === 'Enter' && sendMessage()}
    />
    <button on:click={sendMessage} disabled={loading}>
      {loading ? 'Envoi...' : 'Envoyer'}
    </button>
  </div>
</div>
*/