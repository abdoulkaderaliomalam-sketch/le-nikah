export type Gender = 'homme' | 'femme';

export type MaritalStatus = 
  | 'Celibataire'
  | 'Divorce'
  | 'Veuf'
  | 'Polygame_cherche_seconde';

export type ProfileStatus = 'en_attente' | 'valide' | 'rejete' | 'bloque';

export type NigerCity = 
  | 'Niamey'
  | 'Zinder'
  | 'Maradi'
  | 'Tahoua'
  | 'Agadez'
  | 'Tillabéri'
  | 'Dosso'
  | 'Diffa';

export interface UserProfile {
  id: string;
  code: string; // e.g. "NKH-2026-042" to protect privacy
  prenomPseudo: string;
  age: number;
  ville: NigerCity;
  quartier?: string;
  sexe: Gender;
  situationMatrimoniale: MaritalStatus;
  rechercheSexe: Gender;
  profession: string;
  niveauEtude?: string;
  taille?: string;
  pratiqueReligieuse?: string;
  enfants?: number;
  presentation: string;
  criteresRecherche: string;
  // 2 mandatory photos
  photo1: string;
  photo2: string;
  // Private contact details (never shown publicly)
  telephonePrive: string;
  nomCompletWali?: string; // Tuteur pour la femme selon la Sunnah
  telephoneWali?: string;
  status: ProfileStatus;
  createdAt: string;
  validationNote?: string;
}

export type PaymentMethod = 'MyNita' | 'Amanata' | 'Airtel Money';

export type ContactRequestStatus = 'en_verification' | 'autorisee' | 'refusee';

export interface ContactRequest {
  id: string;
  targetProfileId: string;
  targetProfileCode: string;
  targetProfileName: string;
  demandeurNom: string;
  demandeurTelephone: string;
  demandeurVille: NigerCity;
  demandeurMessage: string;
  paymentMethod: PaymentMethod;
  paymentReference: string; // Numéro de transaction ou preuve
  montantFrais: number; // in FCFA (e.g. 3000 FCFA)
  status: ContactRequestStatus;
  createdAt: string;
  adminNote?: string;
}
