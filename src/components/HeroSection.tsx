import React from 'react';
import { ShieldCheck, Heart, Sparkles, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { Gender, NigerCity, MaritalStatus } from '../types';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
  genderFilter: Gender | 'all';
  setGenderFilter: (val: Gender | 'all') => void;
  cityFilter: NigerCity | 'all';
  setCityFilter: (val: NigerCity | 'all') => void;
  maritalFilter: MaritalStatus | 'all';
  setMaritalFilter: (val: MaritalStatus | 'all') => void;
  validatedCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onExploreClick,
  genderFilter,
  setGenderFilter,
  cityFilter,
  setCityFilter,
  maritalFilter,
  setMaritalFilter,
  validatedCount,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 border-b border-stone-800">
      {/* Background imagery with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/hero_nikah_niger_1793028502136.jpg" 
          alt="Mariage traditionnel islamique au Niger" 
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-950/80" />
        <div className="absolute inset-0 bg-radial-[at_top_right] from-emerald-950/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          
          {/* Reassurance text badge (clean unboxed text with typographic separator) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 font-medium tracking-wide uppercase mb-4">
            <span>Mariage Sunnah au Niger</span>
            <span aria-hidden="true">·</span>
            <span>Profils 100% Vérifiés</span>
            <span aria-hidden="true">·</span>
            <span>Pudeur & Anonymat Préservés</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-none text-balance mb-6">
            Le Chemin Béni vers le <span className="text-amber-400">Nikah</span> au Niger.
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed text-balance mb-8">
            Une démarche sérieuse, digne et encadrée pour fonder un foyer islamique pieux à Niamey, Zinder, Maradi et dans toutes les régions du Niger. Chaque profil est minutieusement validé par l'administrateur avant publication.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onRegisterClick}
              className="px-6 py-3.5 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-md transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Déposer mon annonce (Gratuit)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 text-sm font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Voir les profils validés ({validatedCount})</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800/80 text-xs sm:text-sm text-stone-300">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Contrôle Strict</span>
                <span className="text-stone-400 text-xs">Examen des 2 photos obligatoires et élimination des faux profils.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Secret & Pudeur</span>
                <span className="text-stone-400 text-xs">Aucun numéro de téléphone n'est affiché publiquement.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Mise en contact sûre</span>
                <span className="text-stone-400 text-xs">Paiement MyNita / Amanata & validation administrative.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Search & Filtering Bar */}
        <div id="search-bar" className="mt-12 p-4 sm:p-5 bg-stone-900/90 border border-stone-700/80 rounded-xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-300">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Rechercher parmi les célibataires vérifiés au Niger</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Sexe recherché */}
            <div>
              <label className="block text-[11px] font-medium text-stone-400 mb-1">Je recherche</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as Gender | 'all')}
                className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs sm:text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">Tous (Hommes & Femmes)</option>
                <option value="femme">Une Femme (pour mariage)</option>
                <option value="homme">Un Homme (pour mariage)</option>
              </select>
            </div>

            {/* Ville au Niger */}
            <div>
              <label className="block text-[11px] font-medium text-stone-400 mb-1">Ville au Niger</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value as NigerCity | 'all')}
                className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs sm:text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">Toutes les villes (Niger)</option>
                <option value="Niamey">Niamey</option>
                <option value="Zinder">Zinder</option>
                <option value="Maradi">Maradi</option>
                <option value="Tahoua">Tahoua</option>
                <option value="Agadez">Agadez</option>
                <option value="Tillabéri">Tillabéri</option>
                <option value="Dosso">Dosso</option>
                <option value="Diffa">Diffa</option>
              </select>
            </div>

            {/* Situation matrimoniale */}
            <div>
              <label className="block text-[11px] font-medium text-stone-400 mb-1">Situation matrimoniale</label>
              <select
                value={maritalFilter}
                onChange={(e) => setMaritalFilter(e.target.value as MaritalStatus | 'all')}
                className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs sm:text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">Toutes les situations</option>
                <option value="Celibataire">Célibataire (jamais marié/e)</option>
                <option value="Divorce">Divorcé(e)</option>
                <option value="Veuf">Veuf / Veuve</option>
                <option value="Polygame_cherche_seconde">Polygamie acceptée / souhaitée</option>
              </select>
            </div>

            {/* Action button */}
            <div className="flex items-end">
              <button
                onClick={onExploreClick}
                className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>Afficher les profils</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
