import React from 'react';
import { OFFICIAL_WHATSAPP, WHATSAPP_RAW } from '../data/initialData';
import { MessageCircle, Shield, Lock, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenRegister: () => void;
  onNavigate: (view: 'home' | 'profiles' | 'how-it-works' | 'gmail') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenRegister,
  onNavigate,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-emerald-900 border border-emerald-700/50 flex items-center justify-center text-amber-300 font-serif font-bold text-base">
                ن
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Le Chemin pour le Nikah
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Première plateforme d'intermédiation matrimoniale au Niger respectant scrupuleusement les valeurs islamiques, la protection de la vie privée et l'implication des tuteurs légaux (Wali).
            </p>

            <div className="pt-1 text-[11px] text-stone-400">
              <span>Niamey · Zinder · Maradi · Tahoua · Agadez · Tillabéri · Dosso · Diffa</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Accueil & Recherche
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profiles')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Profils Célibataires Validés
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Règlement MyNita & Amanata
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gmail')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Messagerie Gmail
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Déposer mon profil
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact & Business WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact Officiel Business
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pour l'envoi de vos reçus de paiement et toute assistance matrimoniale :
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_RAW}?text=Salam%20Alaykoum.%20Je%20vous%20contacte%20depuis%20Le%20Chemin%20pour%20le%20Nikah.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp : {OFFICIAL_WHATSAPP}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
            <span className="text-[10px] text-stone-500 block">
              Numéro Business officiel vérifié
            </span>
          </div>

        </div>

        {/* Quiet Bottom Legal / Admin row */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <span>© {new Date().getFullYear()} Le Chemin pour le Nikah. Tous droits réservés.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pudeur & Confidentialité garanties</span>
            </span>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-200 bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded border border-stone-800 cursor-pointer transition-colors"
              title="Accès Administrateur"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Administration privée</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
