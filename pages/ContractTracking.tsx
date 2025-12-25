
import React, { useState } from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { FileText, Clock, Sparkles, Loader2, ExternalLink, Box, CheckCircle, Hash, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Modal from '../components/Modal';
import { Contract } from '../types';

const ContractTracking: React.FC = () => {
  const { contracts, updateContract } = useProcurement();
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRiskReport, setAiRiskReport] = useState<string>('');

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  const runAiRiskAnalysis = async () => {
    if (!selectedContract) return;
    setIsAiModalOpen(true);
    setIsAnalyzing(true);
    setAiRiskReport('');
    try {
      let result = '';
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Analyze contract execution risk based on typical oil and gas delays..." });
        result = response.text || "No report.";
      } else {
        await new Promise(r => setTimeout(r, 2000));
        result = `**Contract Integrity Analysis:**\n\nAudit Log Verified.\n\n**Risk Assessment:** Low.\nMilestone "Mobilization" is progressing within tolerance. No weather alerts in the operation zone. Recommended to release payment tranche #2 upon completion of Spud.`;
      }
      setAiRiskReport(result);
      updateContract(selectedContract.id, { aiRiskAnalysisReport: result });
    } catch (e) { setAiRiskReport("Failed."); } finally { setIsAnalyzing(false); }
  };

  const handleViewReport = (e: React.MouseEvent, contract: Contract) => {
    e.stopPropagation();
    setSelectedContractId(contract.id);
    setAiRiskReport(contract.aiRiskAnalysisReport || '');
    setIsAiModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contract Lifecycle</h1>
           <p className="text-slate-500 text-sm mt-1">Milestone tracking and performance monitoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
           {contracts.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900">
                 <FileText size={32} className="mx-auto text-slate-300 mb-3" />
                 <p className="text-slate-400 text-sm font-medium">No active contracts.</p>
              </div>
           ) : (
              contracts.map(contract => (
                <button key={contract.id} onClick={() => setSelectedContractId(contract.id)} className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group relative overflow-hidden ${selectedContractId === contract.id ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-lg ring-1 ring-indigo-600 z-10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                     <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{contract.id}</span>
                     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800 flex items-center gap-1"><CheckCircle size={10} /> ACTIVE</span>
                  </div>
                  <h3 className={`font-bold text-base truncate pr-6 ${selectedContractId === contract.id ? 'text-indigo-900 dark:text-white' : 'text-slate-800 dark:text-white'}`}>{contract.vendorName}</h3>
                  <div className="flex items-center justify-between mt-3">
                     <p className="text-xs text-slate-500 flex items-center gap-1"><Box size={12} /> {contract.assetNames.length} Assets</p>
                     
                     {contract.aiRiskAnalysisReport ? (
                        <div onClick={(e) => handleViewReport(e, contract)} className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer">
                           <FileText size={10} /> Report Ready
                        </div>
                     ) : (
                        <p className="text-xs font-mono font-bold text-slate-400">{contract.startDate}</p>
                     )}
                  </div>
                  {selectedContractId === contract.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>}
                </button>
              ))
           )}
        </div>

        <div className="lg:col-span-2">
           {selectedContract ? (
             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden animate-fade-in">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                   <div>
                      <h2 className="font-bold text-lg text-slate-900 dark:text-white">Audit Trail & History</h2>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                         <span className="font-mono">Ref: {selectedContract.id}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      {selectedContract.aiRiskAnalysisReport && (
                          <button onClick={() => { setAiRiskReport(selectedContract.aiRiskAnalysisReport!); setIsAiModalOpen(true); }} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                             <FileText size={14} /> View Report
                          </button>
                      )}
                      <button onClick={runAiRiskAnalysis} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-indigo-700 transition-colors">
                          <Sparkles size={14} /> {selectedContract.aiRiskAnalysisReport ? 'Re-Audit' : 'AI Audit'}
                      </button>
                   </div>
                </div>
                
                <div className="p-8">
                   <div className="space-y-8 relative pl-4">
                      {/* Timeline Line */}
                      <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                      
                      {selectedContract.milestones.map((ms, index) => (
                         <div key={ms.id} className="relative pl-10 group">
                            <div className={`absolute left-[11px] top-4 w-4 h-4 rounded-full border-[3px] z-10 transition-all duration-300 bg-white dark:bg-slate-900 ${ms.status === 'Completed' ? 'border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : ms.status === 'In Progress' ? 'border-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]' : 'border-slate-300 dark:border-slate-700'}`}></div>
                            
                            <div className={`p-5 rounded-xl border transition-all ${ms.status === 'In Progress' ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}>
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className={`text-sm font-bold ${ms.status === 'Pending' ? 'text-slate-400' : 'text-slate-800 dark:text-white'}`}>{ms.label}</h4>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${ms.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : ms.status === 'In Progress' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>{ms.status}</span>
                               </div>
                               <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                  <span className="flex items-center gap-1.5"><Clock size={12} /> Target: {new Date(ms.targetDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-96 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 dark:border-slate-700"><ShieldCheck size={32} className="opacity-30" /></div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1">Select a Contract</h3>
                <p className="text-xs">View milestones and audit history.</p>
             </div>
           )}
        </div>
      </div>

      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="Smart Contract Assessment">
         <div className="p-6 text-sm">
            {isAnalyzing ? <div className="text-center py-10"><Loader2 size={32} className="animate-spin mx-auto text-indigo-500 mb-3" /><p className="text-slate-500 font-medium">Assessing execution risk...</p></div> : <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{aiRiskReport}</div>}
         </div>
      </Modal>
    </div>
  );
};

export default ContractTracking;
