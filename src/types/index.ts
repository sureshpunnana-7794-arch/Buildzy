export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr' | 'bn' | 'gu' | 'ml';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type City =
  | 'Bengaluru'
  | 'Hyderabad'
  | 'Mumbai'
  | 'Delhi NCR'
  | 'Chennai'
  | 'Pune'
  | 'Kolkata'
  | 'Ahmedabad'
  | 'Vijayawada'
  | 'Visakhapatnam'
  | 'Lucknow'
  | 'Jaipur'
  | 'Kochi';

export interface LocationOption {
  city: City;
  locality: string;
  state: string;
  region: 'South' | 'North' | 'West' | 'East' | 'Central';
}

export type MainTab = 'delivery' | 'dining' | 'ai-studio' | 'tracking';

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  inStock: boolean;
  popular?: boolean;
  minQty?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedProject: string;
}

export interface ListingItem {
  id: string;
  name: string;
  slug: string;
  type: 'builder' | 'architect' | 'materials' | 'soil_lab' | 'subcontractor';
  cuisineTag: string; // e.g. "Turnkey Construction, RCC Duplex, G+2"
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  priceDisplay: string;
  priceNumeric: number;
  locality: string;
  city: City;
  distance: string;
  discountOffer?: string;
  badge?: string;
  isReraVerified: boolean;
  image: string;
  about: string;
  phone: string;
  address: string;
  licenseNumber: string;
  catalog: CatalogItem[];
  reviews: Review[];
  soilTestingSpecs?: {
    testMethod: string;
    boreholeDepth: string;
    safeBearingCapacity: string;
    turnaroundTime: string;
  };
}

export interface CartItem {
  listingId: string;
  listingName: string;
  itemId: string;
  itemName: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface ProjectEstimate {
  plotLength: number;
  plotWidth: number;
  builtUpArea: number;
  floors: string;
  facing: 'East' | 'North' | 'West' | 'South';
  soilType: 'Red Loamy' | 'Black Cotton' | 'Sandy' | 'Rocky Hard';
  finishTier: 'Economy' | 'Standard' | 'Premium';
  soilRecommendation: string;
  cementBags: number;
  cementCost: number;
  steelTonnes: number;
  steelCost: number;
  sandTons: number;
  sandCost: number;
  bricksCount: number;
  bricksCost: number;
  laborCost: number;
  architectureCost: number;
  soilTestingCost: number;
  subtotal: number;
  contingency: number;
  platformFee: number;
  totalEstimate: number;
}

export interface ActiveProjectTracking {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  builderName: string;
  builderPhone: string;
  siteEngineer: string;
  startDate: string;
  targetHandover: string;
  currentStage: string;
  overallProgress: number;
  milestones: {
    id: string;
    title: string;
    status: 'completed' | 'in_progress' | 'upcoming';
    date: string;
    description: string;
    photoUrl?: string;
  }[];
  activeAlerts: {
    id: string;
    severity: 'warning' | 'info' | 'critical';
    title: string;
    description: string;
    actionRequired: string;
  }[];
  recentExpenses: {
    date: string;
    title: string;
    amount: number;
    category: string;
    receiptVerified: boolean;
  }[];
}
