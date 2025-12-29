
import { Asset, Zone, QuotationRequest, SparePart, Shorebase, Vendor, Tender, MaintenanceRecord } from './types';

// Dynamic Date Helper
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const today = new Date().toISOString().split('T')[0];

export const vendors: Vendor[] = [
  {
    id: 'v-001',
    name: 'PT. Samudra Merah Putih',
    type: 'Jasa Pengeboran Terintegrasi',
    status: 'Verified',
    civdExpiry: `${nextYear}-05-20`,
    csmsScore: 95,
    performanceRating: 4.9,
    projectsCompleted: 24,
    riskLevel: 'Low',
    contactEmail: 'bids@samudrahmerah.co.id'
  },
  {
    id: 'v-002',
    name: 'Global Offshore Indonesia',
    type: 'Logistik Kelautan (Marine)',
    status: 'Verified',
    civdExpiry: `${currentYear}-12-15`,
    csmsScore: 88,
    performanceRating: 4.5,
    projectsCompleted: 12,
    riskLevel: 'Low',
    contactEmail: 'ops@globaloffshore.id'
  },
  {
    id: 'v-003',
    name: 'Deepsea Drilling Intl',
    type: 'Pengeboran Lepas Pantai',
    status: 'Verified',
    civdExpiry: `${currentYear}-08-01`,
    csmsScore: 75,
    performanceRating: 3.8,
    projectsCompleted: 8,
    riskLevel: 'Medium',
    contactEmail: 'tender@deepseadrill.com'
  }
];

export const shorebases: Shorebase[] = [
  {
    id: 'sb1',
    name: 'Pangkalan Matak (Anambas)',
    location: 'Kepulauan Anambas',
    coordinates: { lat: 3.5400, lng: 106.2600 },
    capabilities: ['Fuel Bunkering', 'Open Yard', 'Helipad', 'Waste Management'],
    currentStock: [
      { item: 'Minyak Solar (MGO)', qty: 500000, unit: 'Liter' },
      { item: 'Pipa Bor 5 inch', qty: 450, unit: 'Joint' },
      { item: 'Barite (Lumpur)', qty: 2000, unit: 'Sak' }
    ]
  },
  {
    id: 'sb2',
    name: 'Lamongan Shorebase',
    location: 'Jawa Timur',
    coordinates: { lat: -6.8900, lng: 112.3000 },
    capabilities: ['Heavy Lift Crane', 'Warehouse'],
    currentStock: [
      { item: 'Pipa Tubular', qty: 5000, unit: 'MT' },
      { item: 'Unit Semen (Cementing)', qty: 4, unit: 'Unit' }
    ]
  },
  {
    id: 'sb3',
    name: 'Hub Logistik Sorong',
    location: 'Papua Barat',
    coordinates: { lat: -0.8700, lng: 131.2500 },
    capabilities: ['Deep Water Jetty', 'Drilling Mud Plant'],
    currentStock: [
       { item: 'Minyak Solar (MGO)', qty: 100000, unit: 'Liter' },
    ]
  }
];

export const assets: Asset[] = [
  {
    id: '1',
    number: 'RG-2023-001',
    name: 'Rig Darat A (Onshore)',
    category: 'Onshore Rig',
    subType: 'Land Rig',
    location: 'Riau, WK Rokan',
    coordinates: { lat: 1.5000, lng: 101.5000 },
    history: [{ lat: 1.5000, lng: 101.5000 }],
    dailyRate: 250000000,
    status: 'Active',
    health: 98,
    csmsScore: 92,
    incidentCount: 0,
    daysSinceIncident: 365,
    yearBuilt: 2018,
    manufacturer: 'National Oilwell Varco',
    flagCountry: 'Indonesia',
    ownerType: 'National',
    ownerVendorId: 'v-001',
    certification: 'BKI Class',
    capacityString: '2000 HP / 25000 ft',
    specs: {
      ratedHP: 2000,
      drillingDepth: 25000,
    },
    co2Emissions: 12.5,
    totalEmissions: 1200,
    nextMaintenanceDate: `${nextYear}-01-15`,
    mtbf: 5000,
    inventory: [
      {
        id: 'sp-1',
        name: 'Hydraulic Valve Set',
        sku: 'HVS-001',
        category: 'Hydraulics',
        quantity: 5,
        minLevel: 2,
        unit: 'Set',
        location: 'Warehouse A',
        lastUpdated: today
      }
    ],
    maintenanceLog: []
  },
  {
    id: '2',
    number: 'VS-2022-045',
    name: 'Vessel B (AHTS)',
    category: 'Kapal',
    subType: 'AHTS',
    location: 'Laut Jawa',
    coordinates: { lat: -5.5000, lng: 107.5000 },
    history: [{ lat: -5.5000, lng: 107.5000 }],
    dailyRate: 150000000,
    status: 'Active',
    health: 95,
    csmsScore: 88,
    incidentCount: 0,
    daysSinceIncident: 120,
    yearBuilt: 2015,
    manufacturer: 'Damen Shipyards',
    flagCountry: 'Indonesia',
    ownerType: 'National',
    ownerVendorId: 'v-002',
    certification: 'BKI Class',
    capacityString: '80 Ton BP / 5000 DWT',
    specs: {
      bollardPull: 80,
      dwt: 5000,
      maxSpeed: 12,
      loa: 65,
      breadth: 16,
      depth: 6,
      draft: 5
    },
    co2Emissions: 8.2,
    totalEmissions: 800,
    nextMaintenanceDate: `${currentYear}-11-20`,
    mtbf: 4000,
    imoNumber: '9781234',
    inventory: [
      {
        id: 'sp-2',
        name: 'Synthetic Oil (55 Gal)',
        sku: 'OIL-SYN-55',
        category: 'Lubricants',
        quantity: 10,
        minLevel: 5,
        unit: 'Drum',
        location: 'Engine Room Store',
        lastUpdated: today
      }
    ],
    maintenanceLog: []
  },
  {
    id: '3',
    number: 'RG-OFF-009',
    name: 'Rig Lepas Pantai C (Jack-up)',
    category: 'Offshore Rig',
    subType: 'Jack-up',
    location: 'Laut Natuna Utara',
    coordinates: { lat: 4.5000, lng: 108.0000 },
    history: [{ lat: 4.5000, lng: 108.0000 }],
    dailyRate: 1200000000,
    status: 'Active',
    health: 92,
    csmsScore: 90,
    incidentCount: 0,
    daysSinceIncident: 500,
    yearBuilt: 2012,
    manufacturer: 'Keppel FELS',
    flagCountry: 'Panama',
    ownerType: 'Foreign',
    ownerVendorId: 'v-003',
    certification: 'ABS / BKI Dual Class',
    capacityString: '3000 HP / 400 ft Water Depth',
    specs: {
      ratedHP: 3000,
      drillingDepth: 30000,
      waterDepth: 400,
      quartersCapacity: 120,
      variableDeckLoad: 5000
    },
    co2Emissions: 25.0,
    totalEmissions: 5000,
    nextMaintenanceDate: `${currentYear}-10-01`,
    mtbf: 8000,
    inventory: [
      {
        id: 'sp-3',
        name: 'Diesel Filter (Main)',
        sku: 'FIL-DSL-001',
        category: 'Filters',
        quantity: 20,
        minLevel: 10,
        unit: 'Pcs',
        location: 'Store B',
        lastUpdated: today
      }
    ],
    maintenanceLog: []
  }
];

export const zones: Zone[] = [
  {
    id: 'z1',
    name: 'Zona Merah (Natuna)',
    coordinates: { lat: 4.8000, lng: 108.0000 },
    radius: 100000, // meters
    color: '#ef4444', // red
    type: 'danger'
  },
  {
    id: 'z2',
    name: 'Area Konservasi Karang',
    coordinates: { lat: -5.8000, lng: 106.5000 },
    radius: 50000,
    color: '#3b82f6', // blue
    type: 'safe'
  }
];

export const requestsData: QuotationRequest[] = [
  {
    id: 'ME-2024-001',
    date: '2024-01-15',
    assetName: 'Rig Darat 2000 HP',
    category: 'Onshore Rig',
    status: 'Approved',
    hps: 'IDR 45.000.000.000',
    kkksName: 'Pertamina Hulu Rokan',
    contactName: 'Budi Santoso',
    projectName: 'Pengembangan Lapangan Minas',
    dateFrom: '2024-06-01',
    dateTo: '2024-12-31',
    techStatus: 'Valid',
    techNotes: 'Spesifikasi sesuai kebutuhan operasi.'
  },
  {
    id: 'ME-2024-002',
    date: '2024-02-10',
    assetName: 'AHTS Vessel 80T BP',
    category: 'Kapal',
    status: 'Pending',
    hps: 'IDR 12.000.000.000',
    kkksName: 'Medco Energi',
    contactName: 'Siti Aminah',
    projectName: 'Logistik Natuna',
    dateFrom: '2024-05-01',
    dateTo: '2024-08-01'
  }
];
