
import React, { useState } from 'react';
import { Asset, AssetCategory, AssetStatus } from '../../../types';
import { useAssets } from '../../../context/AssetContext';
import { useAuth } from '../../../context/AuthContext';
import { Search, Upload, Info, CheckCircle, Ship, Anchor, Truck, AlertTriangle, ChevronRight, ChevronLeft, Save } from 'lucide-react';

interface VendorProductSubmissionProps {
  onClose: () => void;
}

// Mock BKI Data for simulation (PDF Page 18: BKI Data Confirmation)
const MOCK_BKI_DB: Record<string, any> = {
   '9737668': {
      name: 'TRITON 501',
      type: 'Anchor Handling Tug Supply (AHTS)',
      grossTonnage: 1558,
      dwt: 2000,
      yearBuilt: 2015,
      manufacturer: 'Batam Shipyard',
      flag: 'Indonesia',
      class: 'BKI Class A1',
      loa: 70,
      breadth: 16
   }
};

const VendorProductSubmission: React.FC<VendorProductSubmissionProps> = ({ onClose }) => {
  const { addAsset } = useAssets();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State matching Vendor Manual requirements
  const [category, setCategory] = useState<AssetCategory>('Kapal');
  const [isBKI, setIsBKI] = useState(true);
  const [imoNumber, setImoNumber] = useState('');
  const [bkiDataFound, setBkiDataFound] = useState<any>(null);
  
  const [ownershipType, setOwnershipType] = useState<'Owner' | 'Operator'>('Owner');
  const [priorityType, setPriorityType] = useState<'1' | '2' | '3'>('1'); // 1=National, 2=Consortium, 3=Foreign
  
  // Basic Info (Manual if Non-BKI, populated if BKI)
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  
  // Documents checklist
  const [docs, setDocs] = useState({
     ownershipProof: false,
     operatorAppointment: false, // Required if Operator
     shareOwnership: false, // Required if Priority 2 or 3
     flagCommitment: false, // Required if Priority 2 or 3
     leasingAgreement: false // Required if Priority 3
  });

  const handleBKISearch = () => {
     setIsLoading(true);
     setTimeout(() => {
        setIsLoading(false);
        const data = MOCK_BKI_DB[imoNumber];
        if (data) {
           setBkiDataFound(data);
           setAssetName(data.name);
           setAssetType(data.type);
        } else {
           alert("Data BKI tidak ditemukan untuk nomor IMO tersebut. Silakan periksa kembali atau gunakan mode Non-BKI.");
        }
     }, 1000);
  };

  const validateStep1 = () => {
     if (category === 'Kapal' && isBKI && !bkiDataFound) return false;
     if (!assetName) return false;
     return true;
  };

  const toggleDoc = (key: keyof typeof docs) => {
      setDocs(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleSubmit = () => {
     // Create Asset Object
     const newAsset: Asset = {
        id: Date.now().toString(),
        number: `PENDING-${Math.floor(Math.random()*10000)}`,
        name: assetName,
        category: category,
        status: 'Verification', // Direct to verification as per manual
        location: 'TBD',
        coordinates: { lat: -6.0, lng: 106.0 }, // Default placeholder
        history: [],
        dailyRate: 0,
        health: 100,
        csmsScore: 0,
        incidentCount: 0,
        daysSinceIncident: 0,
        yearBuilt: bkiDataFound ? bkiDataFound.yearBuilt : new Date().getFullYear(),
        manufacturer: bkiDataFound ? bkiDataFound.manufacturer : 'Unknown',
        flagCountry: bkiDataFound ? bkiDataFound.flag : (priorityType === '1' ? 'Indonesia' : 'Foreign'),
        ownerType: priorityType === '1' ? 'National' : 'Foreign',
        ownerVendorId: user?.id,
        certification: isBKI ? 'BKI Class' : 'Non-BKI',
        capacityString: bkiDataFound ? `${bkiDataFound.dwt} DWT` : 'Pending Specs',
        specs: bkiDataFound ? { dwt: bkiDataFound.dwt, loa: bkiDataFound.loa, breadth: bkiDataFound.breadth } : {},
        co2Emissions: 0,
        totalEmissions: 0,
        nextMaintenanceDate: '',
        mtbf: 0,
        imoNumber: imoNumber,
        subType: assetType
     };

     addAsset(newAsset);
     onClose();
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
       {/* Header */}
       <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengajuan Data Produk</h2>
             <p className="text-xs text-slate-500">Lengkapi data aset sesuai Panduan Vendor (Hal 17-22)</p>
          </div>
          <div className="flex gap-2">
             {[1, 2].map(s => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                   {step > s ? <CheckCircle size={14} /> : s}
                </div>
             ))}
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {step === 1 && (
             <div className="space-y-6">
                {/* Category Selection */}
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Pilih Komoditas</label>
                   <div className="grid grid-cols-3 gap-3">
                      {['Kapal', 'Offshore Rig', 'Onshore Rig'].map((cat) => (
                         <button key={cat} onClick={() => setCategory(cat as AssetCategory)} className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${category === cat ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-white' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            {cat === 'Kapal' ? <Ship size={24}/> : cat.includes('Offshore') ? <Anchor size={24}/> : <Truck size={24}/>}
                            <span className="text-xs font-bold">{cat}</span>
                         </button>
                      ))}
                   </div>
                </div>

                {category === 'Kapal' && (
                   <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-5 animate-fade-in">
                      <div className="flex gap-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                         <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isBKI ? 'border-indigo-600' : 'border-slate-300'}`}>
                                {isBKI && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                            </div>
                            <input type="radio" checked={isBKI} onChange={() => setIsBKI(true)} className="hidden" />
                            <div>
                                <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-indigo-600">Klasifikasi BKI</span>
                                <span className="text-xs text-slate-500">Terdaftar Biro Klasifikasi Indonesia</span>
                            </div>
                         </label>
                         <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!isBKI ? 'border-indigo-600' : 'border-slate-300'}`}>
                                {!isBKI && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                            </div>
                            <input type="radio" checked={!isBKI} onChange={() => setIsBKI(false)} className="hidden" />
                            <div>
                                <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-indigo-600">Non-BKI / Asing</span>
                                <span className="text-xs text-slate-500">IACS Member / Bendera Asing</span>
                            </div>
                         </label>
                      </div>

                      {isBKI ? (
                         <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Cari Data BKI (IMO Number)</label>
                                <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={imoNumber} 
                                    onChange={(e) => setImoNumber(e.target.value)} 
                                    className="flex-1 p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500" 
                                    placeholder="Contoh: 9737668"
                                />
                                <button onClick={handleBKISearch} disabled={isLoading} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors flex items-center gap-2">
                                    {isLoading ? 'Mencari...' : <><Search size={16} /> Cari</>}
                                </button>
                                </div>
                            </div>
                            
                            {bkiDataFound && (
                               <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl text-sm animate-slide-in">
                                  <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-400 font-bold">
                                     <CheckCircle size={18} /> Data BKI Ditemukan
                                  </div>
                                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-700 dark:text-slate-300">
                                     <div><span className="text-xs text-slate-500 block">Nama Kapal</span><span className="font-bold">{bkiDataFound.name}</span></div>
                                     <div><span className="text-xs text-slate-500 block">Tipe</span><span>{bkiDataFound.type}</span></div>
                                     <div><span className="text-xs text-slate-500 block">Tahun Buat</span><span>{bkiDataFound.yearBuilt}</span></div>
                                     <div><span className="text-xs text-slate-500 block">DWT</span><span>{bkiDataFound.dwt} Ton</span></div>
                                  </div>
                                  <p className="text-[10px] text-emerald-600 mt-3 italic">* Data teknis terkunci dari database BKI sesuai panduan.</p>
                               </div>
                            )}
                         </div>
                      ) : (
                         <div className="space-y-3 animate-fade-in">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-400 flex items-start gap-2">
                               <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                               <p>Untuk kapal Non-BKI, Anda wajib melampirkan dokumen kepemilikan saham dan komitmen ganti bendera (jika Asing) pada langkah berikutnya.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nama Kapal</label>
                                <input 
                                type="text" 
                                value={assetName} 
                                onChange={(e) => setAssetName(e.target.value)} 
                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 outline-none focus:border-indigo-500" 
                                placeholder="Masukkan Nama Kapal"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Tipe Kapal</label>
                                <input 
                                type="text" 
                                value={assetType} 
                                onChange={(e) => setAssetType(e.target.value)} 
                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 outline-none focus:border-indigo-500" 
                                placeholder="Contoh: AHTS, PSV, Barge"
                                />
                            </div>
                         </div>
                      )}
                   </div>
                )}

                {/* Manual Input for Rigs */}
                {category !== 'Kapal' && (
                    <div className="space-y-3 animate-fade-in">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Nama Rig</label>
                            <input type="text" value={assetName} onChange={(e) => setAssetName(e.target.value)} className="w-full p-3 border rounded-lg text-sm" placeholder="Nama Rig" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tipe Rig</label>
                            <input type="text" value={assetType} onChange={(e) => setAssetType(e.target.value)} className="w-full p-3 border rounded-lg text-sm" placeholder="Jack-up / Semi-sub / Land Rig" />
                        </div>
                    </div>
                )}
             </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-slide-in">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Status Kepemilikan & Prioritas</h3>
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase block">Status Kepemilikan</label>
                        <select 
                            value={ownershipType} 
                            onChange={(e) => setOwnershipType(e.target.value as any)} 
                            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500"
                        >
                            <option value="Owner">Pemilik (Owner) - Aset Milik Sendiri</option>
                            <option value="Operator">Operator (Disewa) - Aset Sewa / Agen</option>
                        </select>
                    </div>

                    {!isBKI && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase block">Prioritas Cabotage (Permenhub 92/2018)</label>
                            <select value={priorityType} onChange={(e) => setPriorityType(e.target.value as any)} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500">
                                <option value="1">Prioritas 1 (Bendera Indo - Pemilik Nasional)</option>
                                <option value="2">Prioritas 2 (Bendera Indo - JV/Asing)</option>
                                <option value="3">Prioritas 3 (Bendera Asing)</option>
                            </select>
                            
                            {(priorityType === '2' || priorityType === '3') && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-800 dark:text-amber-400">
                                    Wajib unggah Dokumen Kepemilikan Saham & Pernyataan Komitmen Ganti Bendera.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                   <h3 className="font-bold text-sm text-slate-900 dark:text-white px-1">Unggah Dokumen Wajib</h3>
                   
                   <div onClick={() => toggleDoc('ownershipProof')} className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${docs.ownershipProof ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-full ${docs.ownershipProof ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Upload size={16} /></div>
                         <div>
                             <span className={`text-sm font-bold block ${docs.ownershipProof ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>Bukti Kepemilikan (Gross Akta)</span>
                             <span className="text-[10px] text-slate-400">Wajib untuk semua jenis kepemilikan</span>
                         </div>
                      </div>
                      {docs.ownershipProof && <CheckCircle size={20} className="text-emerald-600" />}
                   </div>

                   {ownershipType === 'Operator' && (
                      <div onClick={() => toggleDoc('operatorAppointment')} className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${docs.operatorAppointment ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'}`}>
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${docs.operatorAppointment ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Upload size={16} /></div>
                            <div>
                                <span className={`text-sm font-bold block ${docs.operatorAppointment ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>Dokumen Penunjukan Operator</span>
                                <span className="text-[10px] text-slate-400">Wajib untuk status Operator</span>
                            </div>
                         </div>
                         {docs.operatorAppointment && <CheckCircle size={20} className="text-emerald-600" />}
                      </div>
                   )}

                   {(priorityType === '2' || priorityType === '3') && !isBKI && (
                       <>
                        <div onClick={() => toggleDoc('shareOwnership')} className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${docs.shareOwnership ? 'bg-emerald-50 border-emerald-200' : 'bg-white dark:bg-slate-800 border-dashed border-slate-300'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${docs.shareOwnership ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Upload size={16} /></div>
                                <span className="text-sm font-bold">Dokumen Kepemilikan Saham</span>
                            </div>
                            {docs.shareOwnership && <CheckCircle size={20} className="text-emerald-600" />}
                        </div>
                        <div onClick={() => toggleDoc('flagCommitment')} className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${docs.flagCommitment ? 'bg-emerald-50 border-emerald-200' : 'bg-white dark:bg-slate-800 border-dashed border-slate-300'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${docs.flagCommitment ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Upload size={16} /></div>
                                <span className="text-sm font-bold">Surat Komitmen Ganti Bendera</span>
                            </div>
                            {docs.flagCommitment && <CheckCircle size={20} className="text-emerald-600" />}
                        </div>
                       </>
                   )}
                </div>
             </div>
          )}
       </div>

       {/* Footer Actions */}
       <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between">
          {step === 1 ? (
             <button onClick={onClose} className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          ) : (
             <button onClick={() => setStep(1)} className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"><ChevronLeft size={16} /> Kembali</button>
          )}
          
          {step === 1 ? (
             <button onClick={() => validateStep1() && setStep(2)} disabled={!validateStep1()} className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
                Lanjut <ChevronRight size={16} />
             </button>
          ) : (
             <button onClick={handleSubmit} className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2">
                <Save size={16} /> Kirim Pengajuan
             </button>
          )}
       </div>
    </div>
  );
};

export default VendorProductSubmission;
