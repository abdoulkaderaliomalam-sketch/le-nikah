import React from 'react';
import { UserPlus, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  activeView: 'home' | 'profiles' | 'how-it-works' | 'admin' | 'gmail';
  setActiveView: (view: 'home' | 'profiles' | 'how-it-works' | 'admin' | 'gmail') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenAdmin,
  isAdminActive,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-18">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-md bg-emerald-900 border border-emerald-600/40 flex items-center justify-center text-amber-300 font-serif font-bold text-lg shadow-sm">
              ن
            </div>
            <div className="leading-tight">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors whitespace-nowrap">
                Le Chemin pour le Nikah
              </span>
              <span className="hidden sm:block text-[11px] text-stone-400 font-medium">
                Zawaj Sunnah · Niger
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button 
            onClick={() => setActiveView('home')} 
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${activeView === 'home' ? 'text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Accueil
          </button>
          <button 
            onClick={() => setActiveView('profiles')} 
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${activeView === 'profiles' ? 'text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Profils Célibataires
          </button>
          <button 
            onClick={() => setActiveView('how-it-works')} 
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${activeView === 'how-it-works' ? 'text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Fonctionnement & MyNita/Amanata
          </button>
          <button 
            onClick={() => setActiveView('gmail')} 
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${activeView === 'gmail' ? 'text-amber-300 font-semibold' : 'hover:text-white'}`}
          >
            Messagerie Gmail
          </button>
          <button 
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${isAdminActive || activeView === 'admin' ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'}`}
            title="Accès Administrateur réservé"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Espace Admin</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-stone-900" />
            <span>Déposer mon profil</span>
          </button>
        </div>

      </div>
    </header>
  );
};
