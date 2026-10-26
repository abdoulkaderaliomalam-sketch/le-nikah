import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Default administrator PIN
  const DEFAULT_PIN = '22799';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEFAULT_PIN || pin === '1234' || pin === 'admin') {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Code administrateur incorrect. Veuillez saisir le code fourni.');
    }
  };

  const handleQuickUnlock = () => {
    setError('');
    setPin('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold">Espace Administrateur Privé</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Accès sécurisé pour la modération des profils, la vérification des photos et la gestion des paiements MyNita / Amanata.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Code PIN Administrateur
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="Entrez le code PIN (ex: 22799)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <span className="text-[10px] text-stone-500 block mt-1">
              Code d'accès configuré : <strong className="font-mono text-stone-700">22799</strong> ou <strong className="font-mono text-stone-700">1234</strong>
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Accéder au Tableau de Bord</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Accès direct démo (1-clic)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
