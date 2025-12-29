
import React from 'react';
import { useAssets } from '../../../context/AssetContext';
import { Asset, AssetStatus } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Clock, Shield, AlertCircle, CheckCircle, Ship, Anchor, Truck } from 'lucide-react';

const KanbanColumn = ({ title, status, assets, color, icon: Icon }: any) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-w-[280px] bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className={`p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center ${color} bg-opacity-10`}>
        <div className="flex items-center gap-2">
           <div className={`p-1.5 rounded-md ${color} text-white`}><Icon size={14} /></div>
           <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{title}</h3>
        </div>
        <span className="bg-white dark:bg-slate-800 text-slate-500 text-xs font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{assets.length}</span>
      </div>
      
      <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
         {assets.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs italic">
               Tidak ada aset
            </div>
         )}
         {assets.map((asset: Asset) => (
            <div 
               key={asset.id} 
               onClick={() => navigate(`/product/${asset.id}`)}
               className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group"
            >
               <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-slate-400">{asset.number}</span>
                  {asset.category === 'Kapal' ? <Ship size={14} className="text-slate-400" /> : asset.category === 'Offshore Rig' ? <Anchor size={14} className="text-slate-400" /> : <Truck size={14} className="text-slate-400" />}
               </div>
               <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{asset.name}</h4>
               <p className="text-xs text-slate-500 mb-3 line-clamp-1">{asset.manufacturer} • {asset.yearBuilt}</p>
               
               <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                     <Clock size={10} />
                     <span>Updated today</span>
                  </div>
                  {status === 'Verification' && (
                     <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Butuh Audit</span>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

const AssetVerificationBoard: React.FC = () => {
  const { assets } = useAssets();

  const getAssetsByStatus = (status: AssetStatus) => assets.filter(a => a.status === status);

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col animate-fade-in">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tata Kelola Aset (Governance)</h1>
         <p className="text-slate-500 text-sm mt-1">Papan kerja verifikasi dan validasi aset vendor.</p>
      </div>

      <div className="flex-1 overflow-x-auto">
         <div className="flex gap-4 h-full min-w-[1000px]">
            <KanbanColumn 
               title="Registrasi Baru" 
               status="Registered" 
               assets={getAssetsByStatus('Registered')} 
               color="bg-slate-500" 
               icon={Clock} 
            />
            <KanbanColumn 
               title="Pengisian Katalog" 
               status="Catalog_Filling" 
               assets={getAssetsByStatus('Catalog_Filling')} 
               color="bg-sky-500" 
               icon={MoreHorizontal} 
            />
            <KanbanColumn 
               title="Verifikasi Teknis" 
               status="Verification" 
               assets={getAssetsByStatus('Verification')} 
               color="bg-amber-500" 
               icon={AlertCircle} 
            />
            <KanbanColumn 
               title="Aktif / Operational" 
               status="Active" 
               assets={getAssetsByStatus('Active')} 
               color="bg-emerald-500" 
               icon={CheckCircle} 
            />
         </div>
      </div>
    </div>
  );
};

export default AssetVerificationBoard;
