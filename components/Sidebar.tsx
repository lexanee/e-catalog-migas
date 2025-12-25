
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Database, Search, Settings, LogOut, Ship, Anchor, Truck, ClipboardList, Map, FileSpreadsheet, ShieldCheck, Warehouse, Briefcase, ChevronRight, ChevronDown, Activity, Box, Hexagon, PieChart } from 'lucide-react';

const Sidebar: React.FC<{ isOpen: boolean, setIsOpen: (val: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, end = false, children }: any) => {
     return (
        <NavLink 
           to={to} 
           end={end}
           className={({ isActive }) => 
              `group flex items-center justify-between px-3 py-2 mx-3 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${
                 isActive 
                 ? 'bg-slate-50 dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 border-slate-100 dark:border-slate-800' 
                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`
           }
        >
           {({ isActive }) => (
              <>
                 <div className="flex items-center gap-3">
                    <Icon size={18} className={`transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span className="truncate">{label}</span>
                 </div>
                 {children}
              </>
           )}
        </NavLink>
     );
  }

  return (
    <>
      {/* Mobile Overlay - Solid Dark High Opacity */}
      <div 
         className={`fixed inset-0 z-40 bg-slate-950/90 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative flex flex-col shadow-xl md:shadow-none`}>
         
         {/* Minimal Header */}
         <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-none">
                <Hexagon size={18} className="text-white fill-current" />
            </div>
            <div>
               <h1 className="font-bold text-slate-900 dark:text-white text-sm leading-tight tracking-tight">SKK Migas</h1>
               <p className="text-[10px] text-slate-500 font-medium tracking-wide">Enterprise v2.1</p>
            </div>
         </div>

         {/* Scrollable Nav */}
         <nav className="flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar">
            
            {/* Admin Menu Group */}
            {user?.role === 'admin' && (
               <>
                  <div className="space-y-1">
                     <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dashboard</p>
                     <NavItem to="/" icon={LayoutDashboard} label="Overview" end />
                     <NavItem to="/live-map" icon={Map} label="Geospatial">
                        <span className="flex h-2 w-2 relative">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                     </NavItem>
                  </div>

                  <div className="space-y-1">
                     <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pengadaan (Procurement)</p>
                     
                     {/* Collapsible Product Menu */}
                     <div className="mx-3">
                        <button 
                           onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                           className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${location.pathname.includes('products') ? 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900'}`}
                        >
                           <div className="flex items-center gap-3"><Database size={18} className={location.pathname.includes('products') ? "text-indigo-600" : "text-slate-400"} /> <span>Master Data Aset</span></div>
                           <ChevronDown size={14} className={`transition-transform duration-200 text-slate-400 ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isProductMenuOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                           <div className="pl-4 space-y-1 border-l border-slate-100 dark:border-slate-800 ml-4 my-1">
                              <NavLink to="/products?category=Kapal" className={({isActive}) => `block pl-4 py-1.5 text-xs font-medium transition-colors ${location.search.includes('Kapal') ? 'text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>
                                 Vessels (Kapal)
                              </NavLink>
                              <NavLink to="/products?category=Offshore%20Rig" className={({isActive}) => `block pl-4 py-1.5 text-xs font-medium transition-colors ${location.search.includes('Offshore') ? 'text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>
                                 Offshore Rigs
                              </NavLink>
                              <NavLink to="/products?category=Onshore%20Rig" className={({isActive}) => `block pl-4 py-1.5 text-xs font-medium transition-colors ${location.search.includes('Onshore') ? 'text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>
                                 Onshore Rigs
                              </NavLink>
                           </div>
                        </div>
                     </div>

                     <NavItem to="/request-list" icon={ClipboardList} label="Permintaan (Enquiries)" />
                     <NavItem to="/tenders" icon={FileSpreadsheet} label="Tender" />
                     <NavItem to="/contracts" icon={ShieldCheck} label="Kontrak (Contracts)" />
                  </div>

                  <div className="space-y-1">
                     <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Operasional</p>
                     <NavItem to="/logistics" icon={Warehouse} label="Logistik" />
                     <NavItem to="/vendors" icon={Briefcase} label="Penyedia (Vendors)" />
                  </div>
               </>
            )}

            {/* Vendor Menu */}
            {user?.role === 'vendor' && (
               <div className="space-y-1">
                  <p className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Partner Portal</p>
                  <NavItem to="/vendor" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem to="/product/3" icon={Activity} label="Aset Saya" />
               </div>
            )}
         </nav>

         {/* Footer User Profile - Solid BG */}
         <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                  {user?.avatar || 'US'}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate capitalize">{user?.role} Access</p>
               </div>
               <NavLink to="/settings" className="text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  <Settings size={16} />
               </NavLink>
            </div>
            <button 
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg transition-all"
            >
               <LogOut size={14} /> Sign Out
            </button>
         </div>
      </div>
    </>
  );
};

export default Sidebar;
