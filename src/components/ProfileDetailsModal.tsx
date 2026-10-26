import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, MapPin, Briefcase, GraduationCap, Heart, HeartHandshake, PhoneOff } from 'lucide-react';

interface ProfileDetailsModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onRequestContact: (profile: UserProfile) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onRequestContact,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<0 | 1>(0);

  if (!profile) return null;

  const formatMaritalStatus = (status: string) => {
    switch (status) {
      case 'Celibataire': return 'Célibataire (jamais marié/e)';
      case 'Divorce': return 'Divorcé(e)';
      case 'Veuf': return 'Veuf / Veuve';
      case 'Polygame_cherche_seconde': return 'Polygamie acceptée / souhaitée';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 text-stone-900 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Fiche Nikah</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-emerald-800">{profile.code}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Photos Display (2 photos obligatoires) */}
          <div>
            <div className="relative aspect-[16/10] bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
              <img
                src={selectedPhoto === 0 ? profile.photo1 : (profile.photo2 || profile.photo1)}
                alt={`Photo ${selectedPhoto + 1} de ${profile.prenomPseudo}`}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm px-3 py-1 rounded text-xs text-white font-medium">
                Photo {selectedPhoto + 1} sur 2
              </div>
            </div>

            {/* Thumbnails to toggle */}
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setSelectedPhoto(0)}
                className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedPhoto === 0 ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-stone-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={profile.photo1} alt="Miniature 1" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-[10px] text-white text-center py-0.5">Photo 1</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhoto(1)}
                className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedPhoto === 1 ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-stone-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={profile.photo2 || profile.photo1} alt="Miniature 2" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-[10px] text-white text-center py-0.5">Photo 2</span>
              </button>

              <div className="text-xs text-stone-500 pl-2">
                <span>Cliquez pour basculer entre les 2 photos certifiées.</span>
              </div>
            </div>
          </div>

          {/* Profile Overview */}
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>{profile.sexe === 'femme' ? 'Sœur' : 'Frère'}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.age} ans</span>
              <span aria-hidden="true">·</span>
              <span>Recherche {profile.rechercheSexe === 'femme' ? 'une femme' : 'un homme'}</span>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              {profile.prenomPseudo}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span><strong>Ville :</strong> {profile.ville} {profile.quartier ? `(${profile.quartier})` : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>Situation :</strong> {formatMaritalStatus(profile.situationMatrimoniale)}</span>
              </div>
              {profile.profession && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-stone-500 shrink-0" />
                  <span><strong>Profession :</strong> {profile.profession}</span>
                </div>
              )}
              {profile.niveauEtude && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-stone-500 shrink-0" />
                  <span><strong>Études :</strong> {profile.niveauEtude}</span>
                </div>
              )}
              {profile.taille && (
                <div className="text-stone-700">
                  <span><strong>Taille :</strong> {profile.taille}</span>
                </div>
              )}
              {profile.enfants !== undefined && (
                <div className="text-stone-700">
                  <span><strong>Enfant(s) :</strong> {profile.enfants > 0 ? `${profile.enfants} à charge` : 'Aucun enfant'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Présentation */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Présentation personnelle
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed bg-white border border-stone-200 p-4 rounded-xl whitespace-pre-line">
              {profile.presentation}
            </p>
          </div>

          {/* Pratique religieuse */}
          {profile.pratiqueReligieuse && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Pratique religieuse & Deen
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-xl">
                {profile.pratiqueReligieuse}
              </p>
            </div>
          )}

          {/* Critères recherchés */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Profil et critères recherchés pour le Nikah
            </h4>
            <p className="text-sm text-stone-700 bg-stone-50 border border-stone-200 p-4 rounded-xl leading-relaxed">
              {profile.criteresRecherche}
            </p>
          </div>

          {/* Notice Confidentialité */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <PhoneOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-1">Confidentialité & Respect de la Pudeur (Hayaa)</strong>
              <span>
                Conformément aux directives islamiques et pour la sécurité de nos membres au Niger, les numéros de téléphone et coordonnées privées ne sont jamais affichés publiquement. La mise en contact s'effectue après paiement des frais par MyNita ou Amanata et validation par l'administrateur.
              </span>
            </div>
          </div>

        </div>

        {/* Modal footer */}
        <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Frais de mise en contact : </span>
            <strong className="text-stone-900 font-mono text-sm">3 000 FCFA</strong>
            <span className="text-stone-400"> (MyNita ou Amanata)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-md transition-colors cursor-pointer w-full sm:w-auto"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestContact(profile);
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-98 rounded-md transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Demander la mise en contact</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
