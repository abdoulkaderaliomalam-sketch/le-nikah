import React, { useState } from 'react';
import { UserProfile, PaymentMethod, ContactRequest, NigerCity } from '../types';
import { OFFICIAL_WHATSAPP, WHATSAPP_RAW, FRAIS_MISE_EN_CONTACT_FCFA } from '../data/initialData';
import { X, Send, CheckCircle2, ShieldCheck, MessageCircle, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';

interface ContactPaymentModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onSubmitRequest: (request: ContactRequest) => void;
}

export const ContactPaymentModal: React.FC<ContactPaymentModalProps> = ({
  profile,
  onClose,
  onSubmitRequest,
}) => {
  if (!profile) return null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MyNita');
  const [demandeurNom, setDemandeurNom] = useState('');
  const [demandeurTelephone, setDemandeurTelephone] = useState('');
  const [demandeurVille, setDemandeurVille] = useState<NigerCity>('Niamey');
  const [paymentReference, setPaymentReference] = useState('');
  const [demandeurMessage, setDemandeurMessage] = useState('');
  
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-filled WhatsApp message for proof submission
  const encodedWaMessage = encodeURIComponent(
    `Salam Alaykoum. Je souhaite effectuer une mise en contact pour le mariage avec le profil ${profile.code} (${profile.prenomPseudo}, ${profile.ville}). Voici ma preuve de paiement (${paymentMethod}) :`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_RAW}?text=${encodedWaMessage}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!demandeurNom.trim()) {
      setFormError('Veuillez saisir votre nom complet ou prénom.');
      return;
    }
    if (!demandeurTelephone.trim()) {
      setFormError('Veuillez indiquer votre numéro de téléphone (WhatsApp).');
      return;
    }
    if (!paymentReference.trim()) {
      setFormError('Veuillez indiquer le code de transaction ou le reçu MyNita / Amanata.');
      return;
    }

    const newRequest: ContactRequest = {
      id: 'req-' + Date.now(),
      targetProfileId: profile.id,
      targetProfileCode: profile.code,
      targetProfileName: profile.prenomPseudo,
      demandeurNom: demandeurNom.trim(),
      demandeurTelephone: demandeurTelephone.trim(),
      demandeurVille,
      demandeurMessage: demandeurMessage.trim(),
      paymentMethod,
      paymentReference: paymentReference.trim(),
      montantFrais: FRAIS_MISE_EN_CONTACT_FCFA,
      status: 'en_verification',
      createdAt: new Date().toISOString(),
      adminNote: `Paiement déclaré via ${paymentMethod} (Réf: ${paymentReference.trim()}). Preuve attendue sur WhatsApp Business officiel.`,
    };

    onSubmitRequest(newRequest);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 text-stone-900 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span>Mise en Contact Sécurisée · Nikah</span>
            </h3>
            <p className="text-xs text-stone-300">
              Procédure officielle et respectueuse du mariage islamique
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-bold text-stone-900">
                Demande enregistrée avec succès !
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Votre demande de mise en contact pour le profil <strong className="text-emerald-800">{profile.code} ({profile.prenomPseudo})</strong> a été transmise à l'administrateur.
              </p>
            </div>

            {/* Next step: send receipt via WhatsApp Business */}
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Dernière étape : Envoi du reçu sur WhatsApp Business</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Envoyez sans attendre votre capture d'écran / reçu de paiement au contact officiel pour accélérer la validation :
              </p>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer la preuve sur WhatsApp Business ({OFFICIAL_WHATSAPP})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-stone-500 text-center">
                Après vérification de votre paiement, l'administrateur vous appellera pour autoriser et organiser la mise en contact avec bienveillance.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
              >
                Fermer la fenêtre
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            
            {/* Target Profile Recapitulative */}
            <div className="flex items-center gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={profile.photo1}
                alt={profile.prenomPseudo}
                className="w-14 h-14 rounded-lg object-cover border border-stone-300 shrink-0"
              />
              <div className="text-xs space-y-0.5">
                <span className="text-[11px] font-mono text-emerald-800 font-bold block">{profile.code}</span>
                <span className="font-bold text-sm text-stone-900 block">{profile.prenomPseudo}</span>
                <span className="text-stone-600">{profile.age} ans · {profile.ville} · {profile.sexe === 'femme' ? 'Femme' : 'Homme'}</span>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Explanation of Fees */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Frais de mise en contact
                </span>
                <span className="text-base font-bold text-emerald-900 font-mono">
                  {FRAIS_MISE_EN_CONTACT_FCFA.toLocaleString()} FCFA
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Ces frais contribuent à la gestion de la plateforme, à la vérification des intentions sérieuses et à la préservation de la pudeur des familles.
              </p>
            </div>

            {/* Payment Method Selector (MyNita or Amanata) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                1. Choisissez le moyen de paiement (Niger)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MyNita')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${paymentMethod === 'MyNita' ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/30' : 'border-stone-200 hover:border-stone-300'}`}
                >
                  <span className="text-xs font-bold text-stone-900 block">Paiement MyNita</span>
                  <span className="text-[11px] text-stone-600 block mt-0.5">Envoi ou transfert d'argent national MyNita</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Amanata')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${paymentMethod === 'Amanata' ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/30' : 'border-stone-200 hover:border-stone-300'}`}
                >
                  <span className="text-xs font-bold text-stone-900 block">Paiement Amanata</span>
                  <span className="text-[11px] text-stone-600 block mt-0.5">Transfert via agence ou compte Amanata</span>
                </button>
              </div>

              {/* Instructions for Selected Method */}
              <div className="mt-3 p-3.5 bg-stone-100 rounded-lg text-xs text-stone-700 space-y-1.5 border border-stone-200">
                <div className="font-semibold text-stone-900 flex items-center justify-between">
                  <span>Instructions pour {paymentMethod} :</span>
                  <span className="text-[11px] text-emerald-700 font-mono">Bénéficiaire officiel</span>
                </div>
                <p>
                  Transférez le montant exact de <strong className="font-mono text-stone-950">{FRAIS_MISE_EN_CONTACT_FCFA.toLocaleString()} FCFA</strong> vers le compte officiel {paymentMethod} au numéro :
                </p>
                <div className="p-2 bg-white rounded border border-stone-300 font-mono font-bold text-stone-900 flex items-center justify-between">
                  <span>{OFFICIAL_WHATSAPP}</span>
                  <span className="text-[10px] text-stone-500 font-sans font-normal">Contact Business officiel</span>
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  Gardez le numéro de reçu ou faites une capture d'écran de l'opération.
                </p>
              </div>
            </div>

            {/* Submission Form */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 pb-1 border-b border-stone-200">
                2. Vos Coordonnées & Preuve de Paiement
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre Nom ou Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Abdourahamane D."
                    value={demandeurNom}
                    onChange={(e) => setDemandeurNom(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre Numéro WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+227 90 00 00 00"
                    value={demandeurTelephone}
                    onChange={(e) => setDemandeurTelephone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre Ville de résidence <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={demandeurVille}
                    onChange={(e) => setDemandeurVille(e.target.value as NigerCity)}
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
                    Numéro de transaction / Réf. reçu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`Ex: Code reçu ${paymentMethod}`}
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Message d'intention honorable pour l'administrateur
                </label>
                <textarea
                  rows={3}
                  placeholder="Présentez brièvement vos intentions honorables pour le mariage et votre situation..."
                  value={demandeurMessage}
                  onChange={(e) => setDemandeurMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* WhatsApp Business Reminder */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contact officiel WhatsApp Business : <strong>{OFFICIAL_WHATSAPP}</strong></span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
              >
                <span>Ouvrir WhatsApp</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* Action buttons */}
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
                className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-98 rounded-md transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirmer le paiement & envoyer la demande</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
