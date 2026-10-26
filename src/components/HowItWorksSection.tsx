import React from 'react';
import { OFFICIAL_WHATSAPP, FRAIS_MISE_EN_CONTACT_FCFA } from '../data/initialData';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onRegisterClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onRegisterClick }) => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
            <span>Processus Éthique & Sunnah</span>
            <span aria-hidden="true">·</span>
            <span>Niger</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            Comment fonctionne « Le Chemin pour le Nikah » ?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Une organisation transparente et rigoureuse conçue pour protéger l'honneur des familles nigériennes, éviter les profils suspects et concrétiser le mariage légitime.
          </p>
        </div>

        {/* 4 Clean Editorial Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-emerald-800 font-mono text-sm font-bold mb-3">
                01. Inscription & 2 Photos
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Dépôt d'annonce pudique
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Renseignez votre profil (âge, ville au Niger, situation, critères). Vous devez obligatoirement fournir <strong>2 photos nettes et décentes</strong>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              Profil en attente d'approbation.
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-emerald-800 font-mono text-sm font-bold mb-3">
                02. Contrôle de l'Admin
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Filtrage rigoureux
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                L'administrateur vérifie chaque profil et chaque photo. Les fausses annonces, plaisantins ou profils suspects sont immédiatement supprimés.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              Coordonnées privées masquées.
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-emerald-800 font-mono text-sm font-bold mb-3">
                03. Règlement MyNita / Amanata
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Frais de mise en contact
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                La personne intéressée par un profil s'acquitte des frais fixes de <strong>{FRAIS_MISE_EN_CONTACT_FCFA.toLocaleString()} FCFA</strong> par MyNita ou Amanata pour attester de son sérieux.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              Preuve sur WhatsApp Business.
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-emerald-800 font-mono text-sm font-bold mb-3">
                04. Mise en Relation Sunnah
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Autorisation & Wali
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Après confirmation du reçu, l'administrateur autorise la démarche et met en lien les parties (avec le tuteur légal pour la sœur) dans le plus grand respect.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              Accompagnement bienveillant.
            </div>
          </div>

        </div>

        {/* Payment Channels Focus Box */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                Paiements Nationaux au Niger
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Réglez facilement via MyNita ou Amanata
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Pour assurer la traçabilité et la transparence de chaque démarche, nous acceptons les transferts via les réseaux <strong>MyNita</strong> et <strong>Amanata</strong> partout au Niger. Après transfert, la capture du reçu est transmise directement au service officiel sur WhatsApp Business.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Agence ou application MyNita</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Guichet ou transfert Amanata</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Assistance WhatsApp : {OFFICIAL_WHATSAPP}</span>
                </span>
              </div>
            </div>

            <div className="bg-stone-800/90 p-5 rounded-xl border border-stone-700 space-y-3 text-center">
              <span className="text-xs text-stone-400 block">Prêt(e) à faire le pas ?</span>
              <button
                onClick={onRegisterClick}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Créer mon profil pour le Nikah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-stone-400 block">
                Validation sous 24h par l'administrateur
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
