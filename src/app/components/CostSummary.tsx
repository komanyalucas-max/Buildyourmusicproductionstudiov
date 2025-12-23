import { Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StorageType } from './StorageSelector';

interface CostSummaryProps {
  totalStorage: number;
  storageCapacity: number | null;
  storageType: StorageType;
}

export function CostSummary({ totalStorage, storageCapacity, storageType }: CostSummaryProps) {
  const formatStorage = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(0)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  const hasCapacity = storageCapacity !== null && storageType !== null;
  const isOverCapacity = hasCapacity && totalStorage > storageCapacity;
  const usagePercentage = hasCapacity ? Math.min((totalStorage / storageCapacity) * 100, 100) : 0;

  return (
    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
      
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-emerald-500/30">
            <Database className="w-5 h-5 text-emerald-300" />
          </div>
          <h2 className="text-white">Storage Summary</h2>
        </div>

        {/* Total Storage Display */}
        <div className="mb-6 text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-2">Total Storage Needed</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {formatStorage(totalStorage)}
          </div>
        </div>

        {/* Capacity Status */}
        {hasCapacity && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-slate-400">Capacity Used</span>
                <span className={`font-medium ${
                  isOverCapacity ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {usagePercentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOverCapacity
                      ? 'bg-gradient-to-r from-rose-500 to-red-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Status Message */}
            <div className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm ${
              isOverCapacity
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              {isOverCapacity ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-rose-300 text-sm font-medium mb-1">Insufficient Storage</p>
                    <p className="text-rose-400/80 text-xs">
                      You need {formatStorage(totalStorage - storageCapacity)} more storage. 
                      Please select a larger capacity.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 text-sm font-medium mb-1">Perfect Fit!</p>
                    <p className="text-emerald-400/80 text-xs">
                      You have {formatStorage(storageCapacity - totalStorage)} free space remaining.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!hasCapacity && totalStorage > 0 && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
            <p className="text-blue-300 text-sm text-center">
              Select a storage device to see capacity details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}