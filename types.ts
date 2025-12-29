
export type AssetCategory = 'Onshore Rig' | 'Offshore Rig' | 'Kapal';
export type AssetStatus = 'Active' | 'Inactive' | 'Maintenance' | 'Registered' | 'Catalog_Filling' | 'Verification';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TechnicalSpecs {
  // Vessel Specific
  bollardPull?: number; // tons
  dwt?: number; // deadweight tonnage
  grossTonnage?: number;
  mainEngine?: string;
  bhp?: number; // Brake Horse Power
  maxSpeed?: number; // knots
  deckArea?: number; // m2
  
  // Rig Specific
  ratedHP?: number; // Horse Power rating
  drillingDepth?: number; // ft
  waterDepth?: number; // ft
  cantileverSkid?: number; // ft
  quartersCapacity?: number; // pax
  variableDeckLoad?: number; // kips
  
  // Common Dimensions
  loa?: number; // Length Overall (m)
  breadth?: number; // m
  depth?: number; // m
  draft?: number; // m
}

export interface MaintenanceRecord {
  id: string;
  title: string;
  date: string;
  type: 'Inspection' | 'Repair' | 'Maintenance';
  description: string;
  status: 'Open' | 'In Progress' | 'Completed'; 
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SparePart {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minLevel: number;
  unit: string;
  location: string;
  lastUpdated: string;
}

export interface Asset {
  id: string;
  number: string;
  name: string;
  category: AssetCategory;
  subType?: string;
  location: string;
  coordinates: Coordinates;
  history: Coordinates[];
  dailyRate: number;
  status: AssetStatus;
  health: number;
  expiryDate?: string;
  crewCount?: number;
  certification: string;
  yearBuilt: number;
  manufacturer: string;
  flagCountry?: string;
  ownerType?: 'National' | 'Foreign';
  ownerVendorId?: string;
  
  // Enhanced Specs
  specs: TechnicalSpecs;
  capacityString?: string; // Display purposes only (e.g. "2000 HP")

  co2Emissions: number;
  totalEmissions: number;
  sustainabilityScore?: number;
  csmsScore: number;
  incidentCount: number;
  daysSinceIncident: number;
  nextMaintenanceDate: string;
  mtbf: number;
  maintenanceLog?: MaintenanceRecord[];
  inventory?: SparePart[];
  currentZoneId?: string;
  bkiData?: any;
  imoNumber?: string;
}

export interface Zone {
  id: string;
  name: string;
  coordinates: Coordinates;
  radius: number;
  color: string;
  type: 'danger' | 'safe';
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  status: 'Verified' | 'Pending' | 'Suspended';
  civdExpiry?: string;
  csmsScore?: number;
  performanceRating?: number;
  projectsCompleted?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  contactEmail?: string;
}

export interface ShorebaseStock {
  item: string;
  qty: number;
  unit: string;
}

export interface Shorebase {
  id: string;
  name: string;
  location: string;
  coordinates: Coordinates;
  capabilities: string[];
  currentStock: ShorebaseStock[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface QuotationRequest {
  id: string;
  date: string;
  assetName: string;
  category: AssetCategory;
  status: 'Approved' | 'Pending' | 'Review' | 'Rejected';
  hps: string;
  tenderId?: string;
  kkksName?: string;
  contactName?: string;
  contactEmail?: string;
  contactNumber?: string;
  projectName?: string;
  additionalInfo?: string;
  dateFrom?: string;
  dateTo?: string;
  techStatus?: 'Valid' | 'Invalid';
  techNotes?: string;
  comments?: Comment[];
}

export interface TenderBid {
  vendorName: string;
  bidAmount: number;
  submittedDate: string;
  status: 'Submitted' | 'Review';
  complianceScore?: number;
}

export interface Tender {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  bidOpeningDate?: string;
  status: 'Draft' | 'Published' | 'Closed';
  items: string[];
  totalValue: number;
  bids?: TenderBid[];
}

export interface Milestone {
  id: string;
  label: string;
  targetDate: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
}

export interface Contract {
  id: string;
  tenderId: string;
  vendorName: string;
  assetNames: string[];
  totalValue: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Disputed';
  blockchainHash: string;
  milestones: Milestone[];
  aiRiskAnalysisReport?: string;
}

export interface Notification {
  id: string;
  assetId: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

export interface Transfer {
  id: string;
  sourceId: string;
  targetId: string;
  item: string;
  quantity: number;
  unit: string;
  status: 'SHIPPING' | 'RECEIVED';
  departureTime: string;
  eta: string;
  coordinates: Coordinates;
}

export interface AssessmentFilter {
  category: AssetCategory | 'All';
  subType?: string;
  startDate: string;
  endDate: string;
  minYear: number;
  minCapacity: number;
  region?: string;
}

export interface AssessmentDoc {
  id: string;
  createdBy: string;
  createdAt: string;
  title: string;
  status: 'Konsep' | 'Tersimpan';
  filters: AssessmentFilter;
  candidates: Asset[];
}
