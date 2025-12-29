
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AssetCategory } from '../types';

export interface TechnicalParameter {
  id: string;
  label: string;
  field: string;
  type: 'number' | 'string';
  unit?: string;
}

type ParameterConfig = Record<AssetCategory, TechnicalParameter[]>;

interface MasterDataContextType {
  configurations: ParameterConfig;
  updateConfiguration: (category: AssetCategory, params: TechnicalParameter[]) => void;
  availableLibrary: TechnicalParameter[]; // All possible params that can be added
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

// Initial Default Configuration matching the previous hardcoded values + extras
const INITIAL_CONFIG: ParameterConfig = {
  'Kapal': [
    { id: 'p1', label: 'Tahun Pembuatan (Year)', field: 'yearBuilt', type: 'number' },
    { id: 'p2', label: 'Bollard Pull (Ton)', field: 'bollardPull', type: 'number', unit: 'Ton' },
    { id: 'p3', label: 'Brake Horse Power (BHP)', field: 'bhp', type: 'number', unit: 'BHP' },
    { id: 'p4', label: 'Deadweight (DWT)', field: 'dwt', type: 'number', unit: 'DWT' },
    { id: 'p5', label: 'Bendera (Flag)', field: 'flagCountry', type: 'string' }
  ],
  'Offshore Rig': [
    { id: 'p6', label: 'Tahun Pembuatan (Year)', field: 'yearBuilt', type: 'number' },
    { id: 'p7', label: 'Rig Power (HP)', field: 'ratedHP', type: 'number', unit: 'HP' },
    { id: 'p8', label: 'Drilling Depth (ft)', field: 'drillingDepth', type: 'number', unit: 'ft' },
    { id: 'p9', label: 'Water Depth (ft)', field: 'waterDepth', type: 'number', unit: 'ft' }
  ],
  'Onshore Rig': [
    { id: 'p10', label: 'Tahun Pembuatan (Year)', field: 'yearBuilt', type: 'number' },
    { id: 'p11', label: 'Rig Power (HP)', field: 'ratedHP', type: 'number', unit: 'HP' },
    { id: 'p12', label: 'Drilling Depth (ft)', field: 'drillingDepth', type: 'number', unit: 'ft' }
  ]
};

// Library of all available technical fields in the system (could be expanded)
const AVAILABLE_LIBRARY: TechnicalParameter[] = [
  { id: 'lib1', label: 'Tahun Pembuatan (Year)', field: 'yearBuilt', type: 'number' },
  { id: 'lib2', label: 'Bollard Pull', field: 'bollardPull', type: 'number', unit: 'Ton' },
  { id: 'lib3', label: 'Brake Horse Power (BHP)', field: 'bhp', type: 'number', unit: 'HP' },
  { id: 'lib4', label: 'Deadweight (DWT)', field: 'dwt', type: 'number', unit: 'Ton' },
  { id: 'lib5', label: 'Deck Area', field: 'deckArea', type: 'number', unit: 'm2' },
  { id: 'lib6', label: 'Max Speed', field: 'maxSpeed', type: 'number', unit: 'Knots' },
  { id: 'lib7', label: 'Bendera (Flag)', field: 'flagCountry', type: 'string' },
  { id: 'lib8', label: 'Rig Power (HP)', field: 'ratedHP', type: 'number', unit: 'HP' },
  { id: 'lib9', label: 'Drilling Depth (ft)', field: 'drillingDepth', type: 'number', unit: 'ft' },
  { id: 'lib10', label: 'Water Depth (ft)', field: 'waterDepth', type: 'number', unit: 'ft' },
  { id: 'lib11', label: 'Quarters Capacity (Pax)', field: 'quartersCapacity', type: 'number', unit: 'Pax' },
  { id: 'lib12', label: 'Variable Deck Load', field: 'variableDeckLoad', type: 'number', unit: 'Kips' },
  { id: 'lib13', label: 'Cantilever Skid', field: 'cantileverSkid', type: 'number', unit: 'ft' },
  { id: 'lib14', label: 'Length Overall (LOA)', field: 'loa', type: 'number', unit: 'm' },
];

export const MasterDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [configurations, setConfigurations] = useState<ParameterConfig>(INITIAL_CONFIG);

  const updateConfiguration = (category: AssetCategory, params: TechnicalParameter[]) => {
    setConfigurations(prev => ({
      ...prev,
      [category]: params
    }));
  };

  return (
    <MasterDataContext.Provider value={{ 
      configurations, 
      updateConfiguration, 
      availableLibrary: AVAILABLE_LIBRARY 
    }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (!context) throw new Error('useMasterData must be used within a MasterDataProvider');
  return context;
};
