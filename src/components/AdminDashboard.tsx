import React, { useState } from 'react';
import { UserProfile, ContactRequest, ProfileStatus } from '../types';
import { OFFICIAL_WHATSAPP, WHATSAPP_RAW } from '../data/initialData';
import {
  ShieldCheck,
  Check,
  X,
  Trash2,
  Ban,
  Phone,
  Eye,
  Camera,
  CreditCard,
  MessageCircle,
  Users,
  Search,
  CheckCircle,
  Clock,
  Lock,
  LogOut,
  MapPin,
  ExternalLink,
  Edit3
} from 'lucide-react';

interface AdminDashboardProps {
  profiles: UserProfile[];
  requests: ContactRequest[];
  onUpdateProfileStatus: (profileId: string, newStatus: ProfileStatus, note?: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onUpdateRequestStatus: (requestId: string, newStatus: 'autorisee' | 'refusee', note?: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  requests,
  onUpdateProfileStatus,
  onDeleteProfile,
  onUpdateProfile,
  onUpdateRequestStatus,
  onDeleteRequest,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'photos' | 'requests' | 'stats'>('profiles');
  const [statusFilter, setStatusFilter] = useState<ProfileStatus | 'all'>('en_attente');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfileForInspect, setSelectedProfileForInspect] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile | null>(null);

  // Statistics calculation
  const totalProfiles = profiles.length;
  const pendingProfiles = profiles.filter(p => p.status === 'en_attente').length;
  const validatedProfiles = profiles.filter(p => p.status === 'valide').length;
  const blockedProfiles = profiles.filter(p => p.status === 'bloque' || p.status === 'rejete').length;

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'en_verification').length;
  const authorizedRequests = requests.filter(r => r.status === 'autorisee').length;
  const totalRevenueFCFA = requests
    .filter(r => r.status === 'autorisee')
    .reduce((acc, curr) => acc + curr.montantFrais, 0);

  // Filtered Profiles
  const filteredProfiles = profiles.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = p.code.toLowerCase().includes(q);
      const matchName = p.prenomPseudo.toLowerCase().includes(q);
      const matchCity = p.ville.toLowerCase().includes(q);
      const matchPhone = p.telephonePrive.toLowerCase().includes(q);
      return matchCode || matchName || matchCity || matchPhone;
    }
    return true;
  });

  const handleStartEdit = (p: UserProfile) => {
    setEditFormData({ ...p });
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      onUpdateProfile(editFormData);
      setIsEditing(false);
      setSelectedProfileForInspect(editFormData);
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen text-stone-900 pb-16">
      
      {/* Top Admin Header Bar */}
      <div className="bg-stone-950 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-800 flex items-center justify-center text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
                <span>Tableau de Bord Privé · Administration</span>
              </h2>
              <span className="text-[11px] text-stone-400">Le Chemin pour le Nikah (Niger)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded border border-stone-800">
              <span className="text-stone-500">Contact Business :</span>
              <span className="font-mono text-emerald-400 font-bold">{OFFICIAL_WHATSAPP}</span>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter l'Admin</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-stone-800/80 pt-1">
          <button
            onClick={() => { setActiveTab('profiles'); setIsEditing(false); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'profiles' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion des Membres</span>
            {pendingProfiles > 0 && (
              <span className="bg-amber-400 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingProfiles}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('photos'); setIsEditing(false); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'photos' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-white'}`}
          >
            <Camera className="w-4 h-4" />
            <span>Validation des Photos (2 obligatoires)</span>
          </button>

          <button
            onClick={() => { setActiveTab('requests'); setIsEditing(false); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-white'}`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Paiements MyNita / Amanata & Contacts</span>
            {pendingRequests > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingRequests}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('stats'); setIsEditing(false); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${activeTab === 'stats' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-white'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Statistiques & Sécurité</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Profils en attente</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{pendingProfiles}</span>
              <span className="text-xs text-stone-500">à valider</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Profils validés en ligne</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">{validatedProfiles}</span>
              <span className="text-xs text-stone-500">publics</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Demandes de contact</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{totalRequests}</span>
              <span className="text-xs text-stone-500">({pendingRequests} en attente)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-medium text-stone-500 block mb-1">Revenus frais encaissés</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">{totalRevenueFCFA.toLocaleString()}</span>
              <span className="text-xs text-stone-500">FCFA</span>
            </div>
          </div>
        </div>

        {/* TAB 1: Gestion des Membres */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Segmented status filter buttons */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter('en_attente')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${statusFilter === 'en_attente' ? 'bg-amber-400 text-stone-950 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  En attente ({pendingProfiles})
                </button>
                <button
                  onClick={() => setStatusFilter('valide')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${statusFilter === 'valide' ? 'bg-emerald-700 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Validés ({validatedProfiles})
                </button>
                <button
                  onClick={() => setStatusFilter('bloque')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${statusFilter === 'bloque' ? 'bg-red-700 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Bloqués / Suspects
                </button>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${statusFilter === 'all' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Tous ({totalProfiles})
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher code, nom, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

            </div>

            {/* Profiles Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Code & Candidat(e)</th>
                      <th className="py-3 px-4">2 Photos</th>
                      <th className="py-3 px-4">Ville & Situation</th>
                      <th className="py-3 px-4">Coordonnées Privées (Admin)</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions Administrateur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          Aucun profil trouvé pour ce filtre.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          
                          {/* Code & Candidate */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-[11px] font-bold text-stone-900 block">{p.code}</span>
                            <span className="font-semibold text-stone-900 text-sm">{p.prenomPseudo}</span>
                            <div className="text-[11px] text-stone-500">
                              <span>{p.sexe === 'femme' ? 'Femme' : 'Homme'}</span>
                              <span aria-hidden="true"> · </span>
                              <span>{p.age} ans</span>
                            </div>
                          </td>

                          {/* 2 Photos thumbnail */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={p.photo1}
                                alt="Photo 1"
                                className="w-10 h-10 rounded object-cover border border-stone-300"
                              />
                              <img
                                src={p.photo2 || p.photo1}
                                alt="Photo 2"
                                className="w-10 h-10 rounded object-cover border border-stone-300"
                              />
                            </div>
                          </td>

                          {/* City & Marital */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-stone-800 font-medium">
                              <MapPin className="w-3 h-3 text-stone-500" />
                              <span>{p.ville}</span>
                            </div>
                            <span className="text-[11px] text-stone-500">{p.situationMatrimoniale}</span>
                          </td>

                          {/* Private Contact (for Admin only) */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <a
                                href={`https://wa.me/${p.telephonePrive.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-mono font-medium underline"
                                title="Contacter sur WhatsApp"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{p.telephonePrive}</span>
                              </a>
                              {p.nomCompletWali && (
                                <div className="text-[10px] text-stone-500">
                                  <span>Wali : {p.nomCompletWali} ({p.telephoneWali})</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            {p.status === 'valide' && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Validé</span>
                              </span>
                            )}
                            {p.status === 'en_attente' && (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                <Clock className="w-3.5 h-3.5" />
                                <span>En attente</span>
                              </span>
                            )}
                            {p.status === 'bloque' && (
                              <span className="inline-flex items-center gap-1 text-red-700 font-semibold text-[11px]">
                                <Ban className="w-3.5 h-3.5" />
                                <span>Bloqué</span>
                              </span>
                            )}
                            {p.status === 'rejete' && (
                              <span className="inline-flex items-center gap-1 text-stone-600 font-semibold text-[11px]">
                                <X className="w-3.5 h-3.5" />
                                <span>Rejeté</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Inspect details */}
                              <button
                                onClick={() => setSelectedProfileForInspect(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                                title="Voir la fiche complète"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                                title="Modifier ce profil"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Accept / Validate button */}
                              {p.status !== 'valide' && (
                                <button
                                  onClick={() => onUpdateProfileStatus(p.id, 'valide', 'Validé par l\'administrateur')}
                                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Valider et publier"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Valider</span>
                                </button>
                              )}

                              {/* Block button */}
                              {p.status !== 'bloque' && (
                                <button
                                  onClick={() => onUpdateProfileStatus(p.id, 'bloque', 'Profil suspect ou non conforme')}
                                  className="p-1.5 text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded cursor-pointer"
                                  title="Bloquer profil suspect"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete button (fausses annonces) */}
                              <button
                                onClick={() => {
                                  if (confirm(`Supprimer définitivement l'annonce de ${p.prenomPseudo} (${p.code}) ?`)) {
                                    onDeleteProfile(p.id);
                                  }
                                }}
                                className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                                title="Supprimer définitivement la fausse annonce"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Validation des Photos */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                Vérification visuelle des 2 photos obligatoires
              </h3>
              <p className="text-xs text-stone-600">
                L'Islam exige pudeur (Hayaa) et sérieux. Assurez-vous que les 2 photos correspondent à une personne réelle, décente, sans filtres trompeurs ni images volées.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-emerald-800">{p.code}</span>
                      <span className={`text-[11px] font-semibold ${p.status === 'valide' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {p.status === 'valide' ? 'Validé' : 'En attente'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 mb-2">
                      {p.prenomPseudo} · {p.age} ans ({p.ville})
                    </h4>

                    {/* Both 2 photos side by side */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                        <img src={p.photo1} alt="Photo 1" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-stone-900/80 text-[10px] text-white px-1.5 py-0.5 rounded">Photo 1</span>
                      </div>
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                        <img src={p.photo2 || p.photo1} alt="Photo 2" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-stone-900/80 text-[10px] text-white px-1.5 py-0.5 rounded">Photo 2</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => onUpdateProfileStatus(p.id, 'valide', 'Photos validées conformes')}
                      className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Photos conformes</span>
                    </button>
                    <button
                      onClick={() => onUpdateProfileStatus(p.id, 'rejete', 'Photos non conformes ou floues')}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-semibold cursor-pointer"
                      title="Rejeter les photos"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Paiements MyNita / Amanata & Demandes de mise en contact */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-0.5">
                  Gestion des Demandes de Mise en Contact & Preuves WhatsApp
                </h3>
                <p className="text-xs text-stone-600">
                  Vérifiez le reçu envoyé sur WhatsApp Business (+227 99 61 40 98) via MyNita ou Amanata avant d'autoriser la mise en relation.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-xs text-emerald-950 font-medium">
                <span>Total Encaissé : </span>
                <strong className="font-mono text-sm font-bold text-emerald-900">{totalRevenueFCFA.toLocaleString()} FCFA</strong>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Demandeur</th>
                      <th className="py-3 px-4">Profil Cible</th>
                      <th className="py-3 px-4">Moyen & Référence Paiement</th>
                      <th className="py-3 px-4">Frais</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Autorisation & Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          Aucune demande de mise en contact pour le moment.
                        </td>
                      </tr>
                    ) : (
                      requests.map((req) => {
                        const targetProfile = profiles.find(p => p.id === req.targetProfileId);
                        return (
                          <tr key={req.id} className="hover:bg-stone-50/70 transition-colors">
                            
                            {/* Demandeur */}
                            <td className="py-3 px-4">
                              <span className="font-semibold text-stone-900 block">{req.demandeurNom}</span>
                              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                                <span>{req.demandeurVille}</span>
                                <span aria-hidden="true">·</span>
                                <a
                                  href={`https://wa.me/${req.demandeurTelephone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:text-emerald-900 font-mono underline"
                                >
                                  {req.demandeurTelephone}
                                </a>
                              </div>
                              {req.demandeurMessage && (
                                <p className="text-[11px] text-stone-600 italic mt-1 line-clamp-2">
                                  « {req.demandeurMessage} »
                                </p>
                              )}
                            </td>

                            {/* Profil Cible */}
                            <td className="py-3 px-4">
                              <span className="font-mono text-[11px] font-bold text-emerald-800 block">{req.targetProfileCode}</span>
                              <span className="font-medium text-stone-900">{req.targetProfileName}</span>
                              {targetProfile && (
                                <div className="text-[10px] text-stone-500">
                                  <span>Tél cible : {targetProfile.telephonePrive}</span>
                                </div>
                              )}
                            </td>

                            {/* Payment */}
                            <td className="py-3 px-4">
                              <div className="font-semibold text-stone-800">{req.paymentMethod}</div>
                              <span className="font-mono text-[11px] text-stone-600 block">Réf : {req.paymentReference}</span>
                              <span className="text-[10px] text-stone-400">Preuve via WhatsApp officiel</span>
                            </td>

                            {/* Montant */}
                            <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                              {req.montantFrais.toLocaleString()} FCFA
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              {req.status === 'autorisee' && (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Autorisée</span>
                                </span>
                              )}
                              {req.status === 'en_verification' && (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>En vérification</span>
                                </span>
                              )}
                              {req.status === 'refusee' && (
                                <span className="inline-flex items-center gap-1 text-red-700 font-semibold text-[11px]">
                                  <X className="w-3.5 h-3.5" />
                                  <span>Refusée</span>
                                </span>
                              )}
                            </td>

                            {/* Action Autorisation */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {req.status !== 'autorisee' && (
                                  <button
                                    onClick={() => onUpdateRequestStatus(req.id, 'autorisee', 'Paiement MyNita / Amanata vérifié.')}
                                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                    title="Confirmer paiement et autoriser la mise en contact"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Autoriser</span>
                                  </button>
                                )}

                                {req.status !== 'refusee' && (
                                  <button
                                    onClick={() => onUpdateRequestStatus(req.id, 'refusee', 'Paiement non reçu ou faux reçu')}
                                    className="p-1.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                                    title="Refuser la demande"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => onDeleteRequest(req.id)}
                                  className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                                  title="Supprimer la demande"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Statistiques & Paramètres de Sécurité */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Villes Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 pb-1 border-b border-stone-200">
                  Répartition Géographique au Niger
                </h4>
                <div className="space-y-2 text-xs">
                  {['Niamey', 'Zinder', 'Maradi', 'Tahoua', 'Agadez', 'Tillabéri', 'Dosso', 'Diffa'].map((city) => {
                    const count = profiles.filter(p => p.ville === city).length;
                    const pct = totalProfiles > 0 ? (count / totalProfiles) * 100 : 0;
                    return (
                      <div key={city} className="flex items-center justify-between">
                        <span className="text-stone-700 w-28">{city}</span>
                        <div className="flex-1 mx-3 bg-stone-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-700 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-stone-900 font-semibold w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Par Sexe & Situation */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 pb-1 border-b border-stone-200">
                  Répartition par Sexe & Situation
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                    <span className="font-medium text-stone-700">Femmes inscrites</span>
                    <strong className="font-mono text-emerald-800 text-sm">
                      {profiles.filter(p => p.sexe === 'femme').length}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                    <span className="font-medium text-stone-700">Hommes inscrits</span>
                    <strong className="font-mono text-emerald-800 text-sm">
                      {profiles.filter(p => p.sexe === 'homme').length}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                    <span className="font-medium text-stone-700">Célibataires jamais marié(e)s</span>
                    <strong className="font-mono text-stone-800 text-sm">
                      {profiles.filter(p => p.situationMatrimoniale === 'Celibataire').length}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                    <span className="font-medium text-stone-700">Divorcé(e)s & Veufs/Veuves</span>
                    <strong className="font-mono text-stone-800 text-sm">
                      {profiles.filter(p => p.situationMatrimoniale === 'Divorce' || p.situationMatrimoniale === 'Veuf').length}
                    </strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Official Business Configuration Notice */}
            <div className="bg-stone-900 text-white p-5 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  Numéro WhatsApp Business Officiel : {OFFICIAL_WHATSAPP}
                </h4>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Ce numéro est configuré comme le canal unique et officiel de la plateforme pour la réception des preuves de paiement MyNita et Amanata. Conformément à vos instructions, vos numéros personnels privés ne sont jamais dévoilés aux utilisateurs.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Profile Inspect / Edit Drawer / Modal */}
      {selectedProfileForInspect && !isEditing && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3 border-stone-200">
              <div>
                <span className="font-mono font-bold text-emerald-800 text-xs">{selectedProfileForInspect.code}</span>
                <h3 className="text-lg font-bold text-stone-900">{selectedProfileForInspect.prenomPseudo}</h3>
              </div>
              <button
                onClick={() => setSelectedProfileForInspect(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-2 gap-3">
              <img src={selectedProfileForInspect.photo1} alt="P1" className="w-full h-36 object-cover rounded-lg border" />
              <img src={selectedProfileForInspect.photo2 || selectedProfileForInspect.photo1} alt="P2" className="w-full h-36 object-cover rounded-lg border" />
            </div>

            <div className="text-xs space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <div><strong>Téléphone Privé :</strong> {selectedProfileForInspect.telephonePrive}</div>
              {selectedProfileForInspect.nomCompletWali && (
                <div><strong>Wali :</strong> {selectedProfileForInspect.nomCompletWali} ({selectedProfileForInspect.telephoneWali})</div>
              )}
              <div><strong>Ville :</strong> {selectedProfileForInspect.ville} ({selectedProfileForInspect.quartier || 'Non précisé'})</div>
              <div><strong>Présentation :</strong> {selectedProfileForInspect.presentation}</div>
              <div><strong>Recherche :</strong> {selectedProfileForInspect.criteresRecherche}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => handleStartEdit(selectedProfileForInspect)}
                className="px-3 py-1.5 bg-stone-800 text-white text-xs font-semibold rounded cursor-pointer"
              >
                Modifier ce profil
              </button>
              <button
                onClick={() => setSelectedProfileForInspect(null)}
                className="px-3 py-1.5 bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-xl border border-stone-200 text-xs">
            <div className="flex items-center justify-between border-b pb-3 border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">Modifier le profil {editFormData.code}</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Prénom / Pseudo</label>
              <input
                type="text"
                value={editFormData.prenomPseudo}
                onChange={(e) => setEditFormData({ ...editFormData, prenomPseudo: e.target.value })}
                className="w-full border p-2 rounded bg-stone-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Âge</label>
                <input
                  type="number"
                  value={editFormData.age}
                  onChange={(e) => setEditFormData({ ...editFormData, age: Number(e.target.value) })}
                  className="w-full border p-2 rounded bg-stone-50"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={editFormData.ville}
                  onChange={(e) => setEditFormData({ ...editFormData, ville: e.target.value as any })}
                  className="w-full border p-2 rounded bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Téléphone Privé (WhatsApp)</label>
              <input
                type="text"
                value={editFormData.telephonePrive}
                onChange={(e) => setEditFormData({ ...editFormData, telephonePrive: e.target.value })}
                className="w-full border p-2 rounded bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Présentation</label>
              <textarea
                rows={3}
                value={editFormData.presentation}
                onChange={(e) => setEditFormData({ ...editFormData, presentation: e.target.value })}
                className="w-full border p-2 rounded bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Critères de recherche</label>
              <textarea
                rows={2}
                value={editFormData.criteresRecherche}
                onChange={(e) => setEditFormData({ ...editFormData, criteresRecherche: e.target.value })}
                className="w-full border p-2 rounded bg-stone-50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-stone-200 text-stone-800 rounded font-medium cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-medium cursor-pointer"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
