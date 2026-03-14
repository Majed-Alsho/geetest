// Investor Profile and AI Analysis Types

// Performance Metrics
export interface PerformanceMetrics {
  roi: number; // Return on Investment %
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number; // % of successful investments
  averageHoldingPeriod: number; // in months
  diversificationScore: number; // 0-100
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

// Portfolio Company
export interface PortfolioCompany {
  id: string;
  name: string;
  industry: string;
  investmentDate: Date;
  investmentAmount: number;
  currentValue: number;
  ownershipPercentage: number;
  status: 'active' | 'exited' | 'written_off';
  performance: {
    revenue: number;
    growth: number;
    profitMargin: number;
  };
}

// Investor Portfolio
export interface InvestorPortfolio {
  totalInvested: number;
  currentValue: number;
  cashAvailable: number;
  companies: PortfolioCompany[];
  sectorAllocation: Record<string, number>;
  geographyAllocation: Record<string, number>;
  stageAllocation: Record<string, number>;
}

// Strength/Weakness Analysis
export interface CompetencyArea {
  area: string;
  score: number; // 0-100
  level: 'weak' | 'moderate' | 'strong';
  description: string;
  recommendations: string[];
}

// Compatibility Analysis Result
export interface CompatibilityAnalysis {
  overallScore: number; // 0-100
  compatibilityLevel: 'poor' | 'moderate' | 'good' | 'excellent';
  strengths: {
    area: string;
    reason: string;
    impact: 'low' | 'medium' | 'high';
  }[];
  weaknesses: {
    area: string;
    reason: string;
    risk: 'low' | 'medium' | 'high';
    mitigationStrategy: string;
    estimatedCost?: number;
  }[];
  synergyOpportunities: {
    description: string;
    potentialValue: number;
    confidence: number; // 0-100
  }[];
  riskFactors: {
    factor: string;
    severity: 'low' | 'medium' | 'high';
    probability: number;
    mitigation: string;
  }[];
  financialProjections?: {
    projectedROI: number;
    breakEvenMonths: number;
    cashFlowForecast: { month: number; amount: number }[];
  };
}

// Company Comparison
export interface CompanyComparison {
  company1: {
    id: string;
    name: string;
  };
  company2: {
    id: string;
    name: string;
  };
  metrics: {
    name: string;
    company1Value: number | string;
    company2Value: number | string;
    unit: string;
    winner?: 'company1' | 'company2' | 'tie';
    significance: 'low' | 'medium' | 'high';
  }[];
  verdict: {
    recommendedPick: 'company1' | 'company2' | 'neutral';
    confidence: number;
    reasoning: string[];
  };
  compatibilityWithPortfolio: {
    company1: CompatibilityAnalysis;
    company2: CompatibilityAnalysis;
  };
}

// AI Chat Message
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    metrics?: string[];
    companies?: string[];
    actionItems?: string[];
  };
}

// AI Analysis Request
export interface AIAnalysisRequest {
  type: 'comparison' | 'compatibility' | 'metrics' | 'recommendation' | 'cost_analysis';
  targetCompanyIds?: string[];
  portfolioContext?: boolean;
  specificMetrics?: string[];
  customQuestion?: string;
}

// AI Analysis Response
export interface AIAnalysisResponse {
  id: string;
  requestType: AIAnalysisRequest['type'];
  summary: string;
  detailedAnalysis: string;
  metrics?: Record<string, number>;
  comparison?: CompanyComparison;
  compatibility?: CompatibilityAnalysis;
  recommendations: string[];
  actionItems: string[];
  confidence: number;
  generatedAt: Date;
}

// Outsourcing Cost Estimate
export interface OutsourcingCostEstimate {
  service: string;
  description: string;
  monthlyCost: {
    min: number;
    max: number;
    average: number;
  };
  annualCost: {
    min: number;
    max: number;
    average: number;
  };
  providers: {
    name: string;
    estimatedCost: number;
    rating: number;
  }[];
  recommendation: string;
}

// Investor Preferences for AI
export interface InvestorAIPreferences {
  investmentThesis: string;
  preferredSectors: string[];
  preferredGeographies: string[];
  preferredStages: string[];
  minInvestment: number;
  maxInvestment: number;
  targetROI: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  esgFocus: boolean;
  specificInterests: string[];
}

// Competency Areas for Analysis
export const COMPETENCY_AREAS = [
  'Marketing & Sales',
  'Product Development',
  'Operations',
  'Finance & Accounting',
  'Human Resources',
  'Technology & IT',
  'Legal & Compliance',
  'Supply Chain',
  'Customer Service',
  'Strategic Planning',
] as const;

// Analysis Status
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
