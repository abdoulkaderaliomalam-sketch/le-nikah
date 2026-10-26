import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MapPin, User, Briefcase, Eye, HeartHandshake, Image as ImageIcon } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onSelect: (profile: UserProfile) => void;
  onRequestContact: (profile: UserProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSelect,
  onRequestContact,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<0 | 1>(0);

  const formatMaritalStatus = (status: string) => {
    switch (status) {
      case 'Celibataire': return 'Célibataire';
      case 'Divorce': return 'Divorcé(e)';
      case 'Veuf': return 'Veuf / Veuve';
      case 'Polygame_cherche_seconde': return 'Polygamie acceptée';
      default: return status;
    }
  };

  const currentPhoto = activePhotoIndex === 0 ? profile.photo1 : (profile.photo2 || profile.photo1);

  return (
    <article className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Photo Area with 2 photos tabs */}
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          <img
            src={currentPhoto}
            alt={`Photo de profil ${profile.prenomPseudo}`}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if local image doesn't load
              const target = e.target as HTMLImageElement;
              target.src = profile.sexe === 'femme'
                ? '/src/assets/images/avatar_mariama_niamey_1793028502206.jpg'
                : '/src/assets/images/avatar_ibrahim_zinder_1793028504268.jpg';
            }}
          />

          {/* 2 Photos switcher control (interactive segmented control) */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-stone-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-[11px] text-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex(0);
              }}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${activePhotoIndex === 0 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
              title="Photo 1"
            >
              Photo 1
            </button>
            <span className="text-stone-500">/</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex(1);
              }}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${activePhotoIndex === 1 ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
              title="Photo 2"
            >
              Photo 2
            </button>
          </div>

          {/* Code identifier badge */}
          <div className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-amber-300">
            {profile.code}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Header metadata (strictly unboxed with typographic separators) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span>{profile.sexe === 'femme' ? 'Femme' : 'Homme'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-700">{profile.age} ans</span>
            <span aria-hidden="true">·</span>
            <span>{formatMaritalStatus(profile.situationMatrimoniale)}</span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-1 group-hover:text-emerald-800 transition-colors">
            {profile.prenomPseudo}
          </h3>

          <div className="flex items-center gap-1 text-xs text-stone-600 mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{profile.ville}{profile.quartier ? `, ${profile.quartier}` : ''}</span>
          </div>

          {profile.profession && (
            <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{profile.profession}</span>
            </div>
          )}

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
            {profile.presentation}
          </p>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            <span className="font-medium text-stone-700">Recherche : </span>
            <span className="line-clamp-1">{profile.criteresRecherche}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 flex items-center gap-2">
        <button
          onClick={() => onSelect(profile)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-98 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Voir détails</span>
        </button>

        <button
          onClick={() => onRequestContact(profile)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 active:scale-98 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-300/60"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-800" />
          <span>Mise en contact</span>
        </button>
      </div>
    </article>
  );
};
