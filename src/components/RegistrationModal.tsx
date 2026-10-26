import React, { useState } from 'react';
import { UserProfile, Gender, MaritalStatus, NigerCity } from '../types';
import { X, Upload, Check, AlertCircle, Camera, ShieldCheck, Heart } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newProfile: UserProfile) => void;
}

const PRESET_PHOTOS = {
  femme: [
    { label: 'Voile turquoise & or', url: '/src/assets/images/avatar_mariama_niamey_1793028502206.jpg' },
    { label: 'Voile vert émeraude', url: '/src/assets/images/avatar_fatima_maradi_1793028503970.jpg' },
  ],
  homme: [
    { label: 'Boubou blanc & broderies', url: '/src/assets/images/avatar_ibrahim_zinder_1793028504268.jpg' },
  ],
};

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [prenomPseudo, setPrenomPseudo] = useState('');
  const [age, setAge] = useState<number | ''>(26);
  const [sexe, setSexe] = useState<Gender>('femme');
  const [ville, setVille] = useState<NigerCity>('Niamey');
  const [quartier, setQuartier] = useState('');
  const [situationMatrimoniale, setSituationMatrimoniale] = useState<MaritalStatus>('Celibataire');
  const [rechercheSexe, setRechercheSexe] = useState<Gender>('homme');
  const [profession, setProfession] = useState('');
  const [niveauEtude, setNiveauEtude] = useState('');
  const [taille, setTaille] = useState('');
  const [pratiqueReligieuse, setPratiqueReligieuse] = useState('');
  const [enfants, setEnfants] = useState<number>(0);
  const [presentation, setPresentation] = useState('');
  const [criteresRecherche, setCriteresRecherche] = useState('');
  
  // 2 mandatory photos
  const [photo1, setPhoto1] = useState<string>('/src/assets/images/avatar_mariama_niamey_1793028502206.jpg');
  const [photo2, setPhoto2] = useState<string>('/src/assets/images/avatar_fatima_maradi_1793028503970.jpg');

  // Private contact for admin only
  const [telephonePrive, setTelephonePrive] = useState('');
  const [nomCompletWali, setNomCompletWali] = useState('');
  const [telephoneWali, setTelephoneWali] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('L\'image dépasse 5 Mo. Veuillez choisir une photo plus légère.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (slot === 1) setPhoto1(reader.result);
          if (slot === 2) setPhoto2(reader.result);
          setFormError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!prenomPseudo.trim()) {
      setFormError('Veuillez renseigner un prénom ou pseudo.');
      return;
    }
    if (!age || age < 18 || age > 80) {
      setFormError('Veuillez renseigner un âge valide (18 ans minimum).');
      return;
    }
    if (!presentation.trim() || presentation.trim().length < 25) {
      setFormError('Veuillez rédiger une présentation détaillée (au moins 25 caractères).');
      return;
    }
    if (!criteresRecherche.trim()) {
      setFormError('Veuillez préciser le profil recherché.');
      return;
    }
    if (!photo1 || !photo2) {
      setFormError('Les 2 photos sont obligatoires pour valider votre annonce.');
      return;
    }
    if (!telephonePrive.trim()) {
      setFormError('Veuillez renseigner votre numéro de téléphone (WhatsApp). Il reste strictement privé.');
      return;
    }

    const cityPrefix = ville.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `NKH-${cityPrefix}-${randomNum}`;

    const newProfile: UserProfile = {
      id: 'prof-' + Date.now(),
      code,
      prenomPseudo: prenomPseudo.trim(),
      age: Number(age),
      ville,
      quartier: quartier.trim() || undefined,
      sexe,
      situationMatrimoniale,
      rechercheSexe,
      profession: profession.trim(),
      niveauEtude: niveauEtude.trim() || undefined,
      taille: taille.trim() || undefined,
      pratiqueReligieuse: pratiqueReligieuse.trim() || undefined,
      enfants: Number(enfants),
      presentation: presentation.trim(),
      criteresRecherche: criteresRecherche.trim(),
      photo1,
      photo2,
      telephonePrive: telephonePrive.trim(),
      nomCompletWali: nomCompletWali.trim() || undefined,
      telephoneWali: telephoneWali.trim() || undefined,
      status: 'en_attente', // strictly pending admin review!
      createdAt: new Date().toISOString(),
      validationNote: 'Nouvelle soumission en attente de validation administrative.',
    };

    onSubmit(newProfile);
    setIsSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 text-stone-900 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span>Inscription pour le Nikah</span>
            </h3>
            <p className="text-xs text-stone-300">
              Démarche honorable, modération rigoureuse & respect de la vie privée
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmittedSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-bold text-stone-900">
                Profil soumis avec succès !
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Votre profil a bien été enregistré avec le statut <strong className="text-amber-800">« En attente de validation »</strong>.
              </p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 text-left space-y-2 mt-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>L'administrateur examine les 2 photos et vérifie l'authenticité de votre annonce pour garantir le sérieux de la communauté.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Dès validation, votre annonce anonymisée sera visible par les célibataires vérifiés. Vos coordonnées privées restent protégées.</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSubmittedSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
              >
                Retour aux profils
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Notification de modération */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-900">
              <strong>Rappel important :</strong> Le profil reste en attente de vérification par l'administrateur. Toutes les annonces suspectes, légères ou non conformes aux valeurs islamiques sont rejetées.
            </div>

            {/* Section 1 : Identité & Localisation */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 pb-1 border-b border-stone-200">
                1. Identité & Localisation au Niger
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Prénom / Pseudo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amina B., Ousmane S."
                    value={prenomPseudo}
                    onChange={(e) => setPrenomPseudo(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-stone-500">Nom de famille non requis publiquement.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Âge <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Sexe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sexe}
                    onChange={(e) => {
                      const newSexe = e.target.value as Gender;
                      setSexe(newSexe);
                      setRechercheSexe(newSexe === 'femme' ? 'homme' : 'femme');
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Ville au Niger <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ville}
                    onChange={(e) => setVille(e.target.value as NigerCity)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
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

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Quartier (Facultatif)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Yantala, Birni, Sabon Gari..."
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 : Situation & Recherche */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 pb-1 border-b border-stone-200">
                2. Situation Matrimoniale & Recherche
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Situation matrimoniale <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={situationMatrimoniale}
                    onChange={(e) => setSituationMatrimoniale(e.target.value as MaritalStatus)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Celibataire">Célibataire (jamais marié/e)</option>
                    <option value="Divorce">Divorcé(e)</option>
                    <option value="Veuf">Veuf / Veuve</option>
                    <option value="Polygame_cherche_seconde">Polygamie (cherche 2ème/3ème épouse)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Recherche <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={rechercheSexe}
                    onChange={(e) => setRechercheSexe(e.target.value as Gender)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="homme">Un Homme</option>
                    <option value="femme">Une Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nombre d'enfants
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={enfants}
                    onChange={(e) => setEnfants(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Profession / Activité
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Enseignant, Commerçant, Santé..."
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Niveau d'études
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Baccalauréat, Licence, Coranique..."
                    value={niveauEtude}
                    onChange={(e) => setNiveauEtude(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Taille approximative
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1m70"
                    value={taille}
                    onChange={(e) => setTaille(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 : 2 photos obligatoires */}
            <div>
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-stone-200">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>3. Deux (2) Photos Obligatoires</span>
                </h4>
                <span className="text-[11px] text-amber-700 font-semibold">Examen strict par l'administrateur</span>
              </div>
              
              <p className="text-xs text-stone-600 mb-4">
                Pour éviter les fausses annonces et garantir la pudeur requise par l'Islam, vous devez fournir 2 photos nettes et décentes (visage découvert, tenue pudique).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1 */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex flex-col items-center">
                  <span className="text-xs font-bold text-stone-800 mb-2">Photo 1 (Obligatoire)</span>
                  <div className="w-32 h-32 rounded-lg bg-stone-200 overflow-hidden mb-3 border border-stone-300 relative group">
                    {photo1 ? (
                      <img src={photo1} alt="Prévisualisation Photo 1" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                        <Camera className="w-6 h-6 mb-1" />
                        <span>Aucune photo</span>
                      </div>
                    )}
                  </div>
                  <label className="w-full">
                    <span className="w-full py-1.5 px-3 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-medium text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser Photo 1</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 1)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo 2 */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex flex-col items-center">
                  <span className="text-xs font-bold text-stone-800 mb-2">Photo 2 (Obligatoire)</span>
                  <div className="w-32 h-32 rounded-lg bg-stone-200 overflow-hidden mb-3 border border-stone-300 relative group">
                    {photo2 ? (
                      <img src={photo2} alt="Prévisualisation Photo 2" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                        <Camera className="w-6 h-6 mb-1" />
                        <span>Aucune photo</span>
                      </div>
                    )}
                  </div>
                  <label className="w-full">
                    <span className="w-full py-1.5 px-3 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-medium text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser Photo 2</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 2)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Section 4 : Présentation & Critères */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 pb-1 border-b border-stone-200">
                4. Présentation & Profil Recherché
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Présentation personnelle (Caractère, mode de vie, attentes) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Présentez-vous sincèrement : votre tempérament, vos valeurs familiales, votre vision du mariage selon le Coran et la Sunnah..."
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md p-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Pratique religieuse & Deen
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Assidu(e) aux prières à l'heure, apprentissage du Coran, port du voile/jilbab..."
                    value={pratiqueReligieuse}
                    onChange={(e) => setPratiqueReligieuse(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Critères recherchés chez le futur conjoint <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ex: Piété, maturité, profession stable, tranche d'âge souhaitée, ville ou acceptation de déménagement..."
                    value={criteresRecherche}
                    onChange={(e) => setCriteresRecherche(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md p-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 5 : Coordonnées Privées (Admin Seul) */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  5. Coordonnées Privées (Visibles Uniquement par l'Administrateur)
                </h4>
              </div>

              <p className="text-[11px] text-emerald-900 leading-normal">
                Ces informations ne figureront <strong>JAMAIS</strong> sur la fiche publique. Elles permettent à l'administrateur de vous joindre pour valider votre annonce et organiser la mise en contact après paiement vérifié.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-stone-800 mb-1">
                    Votre Téléphone WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+227 90 00 00 00"
                    value={telephonePrive}
                    onChange={(e) => setTelephonePrive(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {sexe === 'femme' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-stone-800 mb-1">
                        Nom du Tuteur / Wali (Père, Frère, Oncle)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Elhadj Moussa"
                        value={nomCompletWali}
                        onChange={(e) => setNomCompletWali(e.target.value)}
                        className="w-full bg-white border border-emerald-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-800 mb-1">
                        Téléphone du Tuteur / Wali
                      </label>
                      <input
                        type="tel"
                        placeholder="+227 96 00 00 00"
                        value={telephoneWali}
                        onChange={(e) => setTelephoneWali(e.target.value)}
                        className="w-full bg-white border border-emerald-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer Form Submit */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-md transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-md transition-all shadow-sm cursor-pointer"
              >
                Soumettre mon profil (En attente de validation)
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
