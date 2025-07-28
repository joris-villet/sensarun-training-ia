// interfaces/coach.ts

export interface AthleteProfile {
  // Informations personnelles
  name?: string;
  age?: number;
  gender?: 'homme' | 'femme' | 'autre';
  
  // Niveau et expérience
  experience?: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  anneesExperience?: number;
  
  // Objectifs
  objectifPrincipal?: 'forme' | '5k' | '10k' | 'semi' | 'marathon' | 'ultra' | 'competition';
  objectifSecondaires?: string[];
  dateObjectif?: string; // ISO date
  
  // Données physiologiques
  fcMax?: number;
  fcRepos?: number;
  vma?: number; // km/h
  poids?: number; // kg
  taille?: number; // cm
  
  // Historique d'entraînement
  kilometrageHebdo?: number;
  nbSortiesHebdo?: number;
  tempsMoyenSortie?: number; // minutes
  allureFacile?: string; // ex: "5:30/km"
  meilleuresPerfs?: {
    distance: string;
    temps: string;
    date?: string;
  }[];
  
  // Contraintes et préférences
  disponibilite?: number; // jours par semaine
  joursDisponibles?: ('lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche')[];
  heuresPreferees?: ('matin' | 'midi' | 'soir')[];
  terrainsPreferes?: ('route' | 'piste' | 'trail' | 'tapis')[];
  
  // Santé et blessures
  blessuresActuelles?: string[];
  historiquesBlessures?: {
    type: string;
    date: string;
    dureeArret?: number; // jours
  }[];
  limitationsPhysiques?: string[];
  prisesMedicaments?: boolean;
  
  // Matériel et environnement
  chaussures?: {
    marque: string;
    modele: string;
    kilometrage?: number;
  }[];
  accessoires?: ('cardio' | 'gps' | 'ceinture' | 'autre')[];
  climat?: string;
  altitudeEntrainement?: number;
}

export interface CoachRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
  }>;
  athleteProfile?: AthleteProfile;
  intentType?: IntentType;
  urgency?: 'low' | 'medium' | 'high';
  contextType?: 'first_contact' | 'follow_up' | 'emergency' | 'routine';
}

export type IntentType = 
  | 'collecte_donnees'
  | 'analyse_demande' 
  | 'programme_entrainement'
  | 'ajustement_programme'
  | 'conseil_technique'
  | 'motivation'
  | 'nutrition'
  | 'blessure_prevention'
  | 'competition_strategy'
  | 'equipment_advice';

export interface CoachResponse {
  message: string;
  intent: IntentType;
  config: {
    temperature: number;
    maxTokens: number;
  };
  suggestions?: string[];
  dataNeeded?: string[]; // Données manquantes importantes
  nextSteps?: string[];
  confidence?: number; // 0-1, confiance dans la réponse
}

export interface TrainingProgram {
  titre: string;
  duree: number; // semaines
  objectif: string;
  niveauRequis: string;
  
  phases: {
    nom: string;
    semaines: number[];
    objectifs: string;
    seances: TrainingSession[];
  }[];
}

export interface TrainingSession {
  jour: string;
  type: 'facile' | 'tempo' | 'fractionne' | 'long' | 'recuperation' | 'competition';
  duree?: number; // minutes
  distance?: number; // km
  description: string;
  allures?: {
    zone: string;
    fcCible?: string;
    allure?: string;
  };
  echauffement?: string;
  corpsSeance?: string;
  retourCalme?: string;
  materielSpecifique?: string[];
  conseils?: string[];
}