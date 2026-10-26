import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle, getAccessToken } from '../services/googleAuth';
import {
  fetchGmailProfile,
  listGmailMessages,
  sendGmailEmail,
  GmailMessageSummary,
  GmailUserProfile,
} from '../services/gmailService';
import {
  Mail,
  Send,
  RefreshCw,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Inbox,
  PenSquare,
  Search,
  Sparkles,
  Lock,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface GmailHubProps {
  initialRecipientEmail?: string;
  initialSubject?: string;
  initialBody?: string;
}

export const GmailHub: React.FC<GmailHubProps> = ({
  initialRecipientEmail = '',
  initialSubject = '',
  initialBody = '',
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gmailProfile, setGmailProfile] = useState<GmailUserProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compose State
  const [to, setTo] = useState(initialRecipientEmail);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  // Explicit Confirmation Dialog State (Mandatory for sending emails)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    checkCurrentAuth();
  }, []);

  const checkCurrentAuth = async () => {
    const token = await getAccessToken();
    if (token) {
      loadGmailData();
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        await loadGmailData();
      }
    } catch (err: any) {
      console.error('Sign in failure', err);
      setError(err?.message || 'Erreur lors de la connexion Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setGmailProfile(null);
    setMessages([]);
  };

  const loadGmailData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, msgs] = await Promise.all([
        fetchGmailProfile(),
        listGmailMessages(searchQuery, 12),
      ]);
      setGmailProfile(profileData);
      setMessages(msgs);
    } catch (err: any) {
      console.error('Erreur chargement Gmail', err);
      setError(err?.message || 'Impossible de charger les messages Gmail.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadGmailData();
  };

  // Templates for official Islamic matrimony messages
  const applyTemplate = (type: 'validation' | 'payment' | 'photos') => {
    if (type === 'validation') {
      setSubject('Le Chemin pour le Nikah — Votre profil a été validé');
      setBody(
        `Salam Alaykoum wa Rahmatoullah,\n\nNous avons le plaisir de vous informer que votre profil pour le Nikah a été examiné et validé par l'administrateur.\n\nVotre annonce anonymisée est désormais visible par les célibataires vérifiés au Niger sur la plateforme officielle.\n\nQu'Allah facilite votre union et bénisse votre démarche vers un mariage digne et honorable.\n\nL'équipe administrative — Le Chemin pour le Nikah\nContact WhatsApp Business : +227 99 61 40 98`
      );
    } else if (type === 'payment') {
      setSubject('Le Chemin pour le Nikah — Confirmation du paiement MyNita / Amanata');
      setBody(
        `Salam Alaykoum wa Rahmatoullah,\n\nNous confirmons la bonne réception de vos frais de mise en contact (3 000 FCFA).\n\nAprès vérification, la démarche a été autorisée par l'administrateur. Nous prenons contact avec le tuteur légal (Wali) pour organiser la mise en relation dans le respect des règles islamiques.\n\nFraternellement,\nL'administration officielle du Nikah (Niger)\nWhatsApp Business : +227 99 61 40 98`
      );
    } else if (type === 'photos') {
      setSubject('Le Chemin pour le Nikah — Demande de photos de remplacement');
      setBody(
        `Salam Alaykoum wa Rahmatoullah,\n\nVotre profil est actuellement en attente car les photos transmises nécessitent d'être complétées ou remplacées par deux (2) photos nettes et décentes (tenue pudique, visage dégagé).\n\nMerci de bien vouloir répondre à cet e-mail ou envoyer vos photos sur notre WhatsApp Business officiel (+227 99 61 40 98).\n\nBarakAllahu fikoum.`
      );
    }
    setActiveTab('compose');
  };

  const triggerSendConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) {
      setError('Veuillez renseigner un destinataire.');
      return;
    }
    if (!subject.trim()) {
      setError('Veuillez renseigner un objet.');
      return;
    }
    if (!body.trim()) {
      setError('Veuillez renseigner le contenu du message.');
      return;
    }
    setError(null);
    setIsConfirmModalOpen(true);
  };

  const executeSendEmail = async () => {
    try {
      setIsSending(true);
      setError(null);
      await sendGmailEmail(to.trim(), subject.trim(), body.trim());
      setIsConfirmModalOpen(false);
      setSuccessMessage(`E-mail envoyé avec succès à ${to} via Gmail.`);
      setTo('');
      setSubject('');
      setBody('');
      setTimeout(() => setSuccessMessage(null), 6000);
      loadGmailData();
    } catch (err: any) {
      console.error('Erreur envoi Gmail', err);
      setError(err?.message || 'Erreur lors de l\'envoi de l\'e-mail.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-stone-900">
      
      {/* Top Banner / Google Auth Bar */}
      <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/90 flex items-center justify-center text-white shadow-sm">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Centre de Messagerie Gmail Officiel</span>
            </h3>
            <p className="text-xs text-stone-300">
              Envoi des notifications Nikah, suivi des paiements & contact tuteurs
            </p>
          </div>
        </div>

        {/* Auth State Button */}
        <div>
          {gmailProfile ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-400 block font-mono">
                  {gmailProfile.emailAddress}
                </span>
                <span className="text-[10px] text-stone-400">
                  Connecté via Google
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Se déconnecter de Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg shadow-sm border border-stone-300 transition-all cursor-pointer disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{loading ? 'Connexion en cours...' : 'Se connecter avec Google (Gmail)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-5">
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {!gmailProfile ? (
          <div className="p-10 text-center space-y-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-bold text-stone-900">
                Connectez votre compte Gmail pour gérer les correspondances
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Autorisez l'application à envoyer des confirmations de mariage, à notifier les tuteurs (Wali) et à consulter les e-mails de preuve envoyés par les membres.
              </p>
            </div>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Autoriser l'accès Gmail</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Quick Templates Bar */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Modèles d'e-mails officiels :</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('validation')}
                  className="px-2.5 py-1 bg-white border border-stone-300 hover:border-emerald-500 rounded text-[11px] font-medium text-stone-700 cursor-pointer transition-colors"
                >
                  Validation profil
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('payment')}
                  className="px-2.5 py-1 bg-white border border-stone-300 hover:border-emerald-500 rounded text-[11px] font-medium text-stone-700 cursor-pointer transition-colors"
                >
                  Confirmation MyNita / Amanata
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('photos')}
                  className="px-2.5 py-1 bg-white border border-stone-300 hover:border-emerald-500 rounded text-[11px] font-medium text-stone-700 cursor-pointer transition-colors"
                >
                  Photos à remplacer
                </button>
              </div>
            </div>

            {/* Navigation tabs inside Gmail Hub */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${activeTab === 'inbox' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Boîte de réception ({messages.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('compose')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${activeTab === 'compose' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Rédiger un e-mail</span>
                </button>
              </div>

              {activeTab === 'inbox' && (
                <button
                  onClick={loadGmailData}
                  disabled={loading}
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Actualiser les messages"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {/* TAB 1: Inbox view */}
            {activeTab === 'inbox' && (
              <div className="space-y-3">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher par expéditeur, objet, Nikah, MyNita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-20 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-stone-800 text-white text-[11px] font-semibold rounded hover:bg-stone-700 cursor-pointer"
                  >
                    Filtrer
                  </button>
                </form>

                {/* Messages List */}
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 bg-white">
                  {loading ? (
                    <div className="p-8 text-center text-xs text-stone-500">
                      Chargement des messages Gmail...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500">
                      Aucun message trouvé dans votre boîte de réception Gmail.
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3.5 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs ${m.isUnread ? 'font-semibold bg-amber-50/20' : ''}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-stone-900 font-medium truncate max-w-[200px]">{m.from}</span>
                            <span className="text-[11px] text-stone-400">· {m.date}</span>
                          </div>
                          <h5 className="text-stone-900 truncate mb-0.5 font-bold">{m.subject}</h5>
                          <p className="text-[11px] text-stone-500 truncate">{m.snippet}</p>
                        </div>

                        <button
                          onClick={() => {
                            // Extract email from "from" header if possible
                            const match = m.from.match(/<([^>]+)>/) || [null, m.from];
                            setTo(match[1] || m.from);
                            setSubject(`Re: ${m.subject}`);
                            setActiveTab('compose');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Répondre
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Compose view */}
            {activeTab === 'compose' && (
              <form onSubmit={triggerSendConfirmation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Destinataire (E-mail) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="candidat@gmail.com ou tuteur@..."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Objet de l'e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Le Chemin pour le Nikah — ..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Corps du message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Rédigez votre message officiel ici..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-xs leading-relaxed focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-500">
                    Expéditeur : <strong>{gmailProfile.emailAddress}</strong>
                  </span>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer via Gmail</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR SENDING EMAILS (Mutating user Workspace data) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Confirmation d'envoi d'e-mail
                </h4>
                <p className="text-xs text-stone-500">
                  Action irréversible sur votre compte Gmail
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div><strong>Destinataire :</strong> <span className="font-mono text-emerald-800">{to}</span></div>
              <div><strong>Objet :</strong> {subject}</div>
              <div className="text-[11px] text-stone-600 pt-1 line-clamp-3 italic">
                « {body} »
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-normal">
              Êtes-vous certain de vouloir envoyer cet e-mail officiel depuis votre adresse Gmail <strong>{gmailProfile?.emailAddress}</strong> ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSending}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={executeSendEmail}
                disabled={isSending}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmer et Envoyer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
