import React, { useState, useEffect } from 'react';
import { UserProfile, ContactRequest, ProfileStatus, Gender, NigerCity, MaritalStatus } from './types';
import {
  getStoredProfiles,
  saveStoredProfiles,
  getStoredRequests,
  saveStoredRequests,
} from './utils/storage';
import { OFFICIAL_WHATSAPP, WHATSAPP_RAW } from './data/initialData';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { ContactPaymentModal } from './components/ContactPaymentModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Footer } from './components/Footer';

import { MessageCircle, Shield, CheckCircle2, RotateCcw, Filter, Users, UserPlus } from 'lucide-react';

export default function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => getStoredProfiles());
  const [requests, setRequests] = useState<ContactRequest[]>(() => getStoredRequests());

  const [activeView, setActiveView] = useState<'home' | 'profiles' | 'how-it-works' | 'admin'>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<UserProfile | null>(null);
  const [selectedProfileForContact, setSelectedProfileForContact] = useState<UserProfile | null>(null);

  // Search & Filter state
  const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
  const [cityFilter, setCityFilter] = useState<NigerCity | 'all'>('all');
  const [maritalFilter, setMaritalFilter] = useState<MaritalStatus | 'all'>('all');

  // Sync to localStorage
  useEffect(() => {
    saveStoredProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveStoredRequests(requests);
  }, [requests]);

  // Validated profiles for public display
  const validatedProfiles = profiles.filter((p) => p.status === 'valide');

  const filteredPublicProfiles = validatedProfiles.filter((p) => {
    if (genderFilter !== 'all' && p.sexe !== genderFilter) return false;
    if (cityFilter !== 'all' && p.ville !== cityFilter) return false;
    if (maritalFilter !== 'all' && p.situationMatrimoniale !== maritalFilter) return false;
    return true;
  });

  // Admin profile actions
  const handleUpdateProfileStatus = (profileId: string, newStatus: ProfileStatus, note?: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, status: newStatus, validationNote: note } : p))
    );
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    if (selectedProfileForDetails?.id === profileId) setSelectedProfileForDetails(null);
    if (selectedProfileForContact?.id === profileId) setSelectedProfileForContact(null);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleRegisterSubmit = (newProfile: UserProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
  };

  // Contact requests actions
  const handleContactRequestSubmit = (newRequest: ContactRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleUpdateRequestStatus = (requestId: string, newStatus: 'autorisee' | 'refusee', note?: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus, adminNote: note } : r))
    );
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const resetFilters = () => {
    setGenderFilter('all');
    setCityFilter('all');
    setMaritalFilter('all');
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setActiveView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      
      {/* Navigation Top Bar */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdminActive={isAdminAuthenticated && activeView === 'admin'}
        activeView={activeView}
        setActiveView={(v) => {
          if (v === 'admin' && !isAdminAuthenticated) {
            setIsAdminLoginOpen(true);
          } else {
            setActiveView(v);
          }
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'admin' && isAdminAuthenticated ? (
          <AdminDashboard
            profiles={profiles}
            requests={requests}
            onUpdateProfileStatus={handleUpdateProfileStatus}
            onDeleteProfile={handleDeleteProfile}
            onUpdateProfile={handleUpdateProfile}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onDeleteRequest={handleDeleteRequest}
            onClose={() => setActiveView('home')}
          />
        ) : (
          <>
            {/* Hero Section */}
            {activeView === 'home' && (
              <HeroSection
                onRegisterClick={() => setIsRegisterOpen(true)}
                onExploreClick={() => {
                  const el = document.getElementById('profiles-list');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                maritalFilter={maritalFilter}
                setMaritalFilter={setMaritalFilter}
                validatedCount={validatedProfiles.length}
              />
            )}

            {/* Profiles Section */}
            <section id="profiles-list" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                    <span>Annonces Modérées</span>
                    <span aria-hidden="true">·</span>
                    <span>Anonymat Garanti</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Profils Célibataires Validés
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Seuls les profils vérifiés par l'administrateur avec 2 photos obligatoires sont affichés publiquement.
                  </p>
                </div>

                {/* Filter tags bar */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Gender Quick Switch */}
                  <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
                    <button
                      onClick={() => setGenderFilter('all')}
                      className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${genderFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setGenderFilter('femme')}
                      className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${genderFilter === 'femme' ? 'bg-emerald-800 text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                    >
                      Femmes
                    </button>
                    <button
                      onClick={() => setGenderFilter('homme')}
                      className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${genderFilter === 'homme' ? 'bg-emerald-800 text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                    >
                      Hommes
                    </button>
                  </div>

                  {/* Reset filters if any active */}
                  {(genderFilter !== 'all' || cityFilter !== 'all' || maritalFilter !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="px-2.5 py-1.5 text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Réinitialiser</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Profiles Grid */}
              {filteredPublicProfiles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-800">
                    Aucun profil correspondant à vos critères actuels
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Essayez d'élargir la ville ou la situation matrimoniale pour découvrir d'autres membres vérifiés.
                  </p>
                  <div>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Afficher tous les profils
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublicProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onSelect={(p) => setSelectedProfileForDetails(p)}
                      onRequestContact={(p) => setSelectedProfileForContact(p)}
                    />
                  ))}
                </div>
              )}

              {/* Inscription Banner Callout */}
              <div className="mt-14 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                    Inscription ouverte à tous les célibataires du Niger
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Vous souhaitez vous engager sur la voie bénie du Nikah ?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                    Déposez votre annonce gratuitement avec 2 photos obligatoires. Vos informations privées restent strictement protégées par l'administrateur.
                  </p>
                </div>

                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Déposer mon profil maintenant</span>
                </button>
              </div>

            </section>

            {/* How It Works Section */}
            <HowItWorksSection onRegisterClick={() => setIsRegisterOpen(true)} />

            {/* Islamic Values & Ethical Matrimony Charter Section */}
            <section className="py-14 bg-white border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-700" />
                      <span>Respect de la Pudeur (Hayaa)</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Aucune coordonnée directe, aucun numéro de téléphone ou nom de famille n'est rendu public. L'administrateur préserve la dignité de chacun.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>Rôle du Tuteur Légal (Wali)</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Pour les postulantes féminines, la mise en relation inclut la prise de contact respectueuse avec le père, le frère ou le tuteur légal selon la Sunnah.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Paiement MyNita / Amanata Traçable</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Les frais fixes de mise en contact filtrent les personnes non sérieuses et soutiennent la vérification rigoureuse du service.
                    </p>
                  </div>

                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Official WhatsApp Business Button */}
      <a
        href={`https://wa.me/${WHATSAPP_RAW}?text=Salam%20Alaykoum.%20Je%20souhaite%20une%20information%20sur%20Le%20Chemin%20pour%20le%20Nikah.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 bg-emerald-700 hover:bg-emerald-600 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 group cursor-pointer border border-emerald-500/40"
        aria-label="Contacter le WhatsApp Business officiel"
        title="WhatsApp Business Officiel (+227 99 61 40 98)"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline text-xs font-semibold">
          WhatsApp Business ({OFFICIAL_WHATSAPP})
        </span>
      </a>

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        profile={selectedProfileForDetails}
        onClose={() => setSelectedProfileForDetails(null)}
        onRequestContact={(p) => {
          setSelectedProfileForDetails(null);
          setSelectedProfileForContact(p);
        }}
      />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegisterSubmit}
      />

      {/* Paid Contact Request Modal (MyNita / Amanata & WhatsApp proof) */}
      <ContactPaymentModal
        profile={selectedProfileForContact}
        onClose={() => setSelectedProfileForContact(null)}
        onSubmitRequest={handleContactRequestSubmit}
      />

      {/* Admin Login PIN Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminAuthenticated(true);
          setActiveView('admin');
        }}
      />

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
