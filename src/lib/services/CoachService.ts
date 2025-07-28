// src/services/CoachService.ts
import type { AthleteProfile, CoachRequest, CoachResponse } from '../../interfaces/coach';

export class CoachService {
  private athleteProfile: AthleteProfile = {};
  private conversationHistory: Array<{ role: string; content: string }> = [];

  async sendMessage(userMessage: string, intentType?: string): Promise<CoachResponse> {
    // Ajouter le message à l'historique
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: CoachResponse = await response.json();

      // Ajouter la réponse du coach à l'historique
      this.conversationHistory.push({
        role: 'assistant',
        content: data.message
      });

      // Extraire automatiquement les données utilisateur
      this.updateAthleteProfile(userMessage);

      return data;

    } catch (error) {
      console.error('Erreur Coach Service:', error);
      throw error;
    }
  }

  private updateAthleteProfile(userMessage: string) {
    const message = userMessage.toLowerCase();

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
    } else if (message.includes('avancé') || message.includes('expérimenté')) {
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

    // Kilométrage hebdomadaire
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

  private detectUrgency(message: string): 'low' | 'medium' | 'high' {
    const urgentWords = ['urgent', 'douleur', 'mal', 'blessé', 'course demain'];
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

  getAthleteProfile(): AthleteProfile {
    return { ...this.athleteProfile };
  }

  updateProfileManually(updates: Partial<AthleteProfile>) {
    this.athleteProfile = { ...this.athleteProfile, ...updates };
  }

  clearConversation() {
    this.conversationHistory = [];
  }

  getConversationLength(): number {
    return this.conversationHistory.length;
  }
}

