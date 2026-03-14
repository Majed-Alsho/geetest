'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  PerformanceMetrics,
  InvestorPortfolio,
  CompetencyArea,
  CompatibilityAnalysis,
  CompanyComparison,
  AIChatMessage,
  AIAnalysisRequest,
  AIAnalysisResponse,
  InvestorAIPreferences,
  OutsourcingCostEstimate,
  COMPETENCY_AREAS,
} from '@/types/investor';

interface InvestorContextType {
  // Portfolio Data
  portfolio: InvestorPortfolio | null;
  performanceMetrics: PerformanceMetrics | null;
  preferences: InvestorAIPreferences | null;
  
  // AI Analysis
  analyses: AIAnalysisResponse[];
  chatHistory: AIChatMessage[];
  
  // Loading States
  isAnalyzing: boolean;
  isChatLoading: boolean;
  
  // Portfolio Actions
  updatePortfolio: (portfolio: Partial<InvestorPortfolio>) => void;
  updatePreferences: (prefs: Partial<InvestorAIPreferences>) => void;
  
  // AI Analysis Actions
  runAnalysis: (request: AIAnalysisRequest) => Promise<AIAnalysisResponse>;
  sendMessage: (message: string) => Promise<string>;
  clearChatHistory: () => void;
  
  // Compatibility Analysis
  analyzeCompatibility: (companyId: string) => Promise<CompatibilityAnalysis>;
  
  // Comparison
  compareCompanies: (company1Id: string, company2Id: string) => Promise<CompanyComparison>;
  
  // Outsourcing Estimates
  getOutsourcingEstimates: (companyId: string, weakAreas: string[]) => Promise<OutsourcingCostEstimate[]>;
  
  // Competency Analysis
  analyzeCompetencies: (companyId: string) => Promise<CompetencyArea[]>;
  
  // Stats
  getInvestorStats: () => {
    totalAnalyses: number;
    savedComparisons: number;
    portfolioHealth: number;
  };
}

const InvestorContext = createContext<InvestorContextType | null>(null);

const PORTFOLIO_KEY = 'gee_investor_portfolio';
const PREFERENCES_KEY = 'gee_investor_preferences';
const ANALYSES_KEY = 'gee_investor_analyses';
const CHAT_KEY = 'gee_investor_chat';

// Helper functions for localStorage
function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

// Generate demo portfolio data
function generateDemoPortfolio(): InvestorPortfolio {
  return {
    totalInvested: 2500000,
    currentValue: 3200000,
    cashAvailable: 500000,
    companies: [
      {
        id: 'portfolio-1',
        name: 'TechStart Inc',
        industry: 'Technology',
        investmentDate: new Date('2022-06-15'),
        investmentAmount: 500000,
        currentValue: 750000,
        ownershipPercentage: 15,
        status: 'active',
        performance: { revenue: 2500000, growth: 45, profitMargin: 18 },
      },
      {
        id: 'portfolio-2',
        name: 'GreenEnergy Solutions',
        industry: 'Energy',
        investmentDate: new Date('2021-03-20'),
        investmentAmount: 750000,
        currentValue: 1100000,
        ownershipPercentage: 20,
        status: 'active',
        performance: { revenue: 4200000, growth: 32, profitMargin: 12 },
      },
      {
        id: 'portfolio-3',
        name: 'HealthCare Plus',
        industry: 'Healthcare',
        investmentDate: new Date('2023-01-10'),
        investmentAmount: 300000,
        currentValue: 380000,
        ownershipPercentage: 10,
        status: 'active',
        performance: { revenue: 1800000, growth: 28, profitMargin: 22 },
      },
    ],
    sectorAllocation: { Technology: 40, Energy: 35, Healthcare: 25 },
    geographyAllocation: { 'North America': 60, Europe: 30, Asia: 10 },
    stageAllocation: { Series_A: 50, Series_B: 35, Seed: 15 },
  };
}

// Generate demo performance metrics
function generateDemoMetrics(): PerformanceMetrics {
  return {
    roi: 28,
    annualizedReturn: 22.5,
    volatility: 18,
    sharpeRatio: 1.25,
    maxDrawdown: 12,
    winRate: 75,
    averageHoldingPeriod: 24,
    diversificationScore: 72,
    riskTolerance: 'moderate',
  };
}

// Generate demo preferences
function generateDemoPreferences(): InvestorAIPreferences {
  return {
    investmentThesis: 'Growth-oriented investments in B2B SaaS and clean technology sectors with proven unit economics.',
    preferredSectors: ['Technology', 'Energy', 'Healthcare'],
    preferredGeographies: ['North America', 'Europe'],
    preferredStages: ['Series A', 'Series B'],
    minInvestment: 250000,
    maxInvestment: 1500000,
    targetROI: 25,
    riskTolerance: 'moderate',
    esgFocus: true,
    specificInterests: ['recurring revenue', 'strong margins', 'experienced team'],
  };
}

export function InvestorProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<InvestorPortfolio | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [preferences, setPreferences] = useState<InvestorAIPreferences | null>(null);
  const [analyses, setAnalyses] = useState<AIAnalysisResponse[]>([]);
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const storedPortfolio = getStoredData<InvestorPortfolio | null>(PORTFOLIO_KEY, null);
    const storedPreferences = getStoredData<InvestorAIPreferences | null>(PREFERENCES_KEY, null);
    const storedAnalyses = getStoredData<AIAnalysisResponse[]>(ANALYSES_KEY, []);
    const storedChat = getStoredData<AIChatMessage[]>(CHAT_KEY, []);

    setPortfolio(storedPortfolio || generateDemoPortfolio());
    setPreferences(storedPreferences || generateDemoPreferences());
    setPerformanceMetrics(generateDemoMetrics());
    setAnalyses(storedAnalyses);
    setChatHistory(storedChat);
  }, []);

  const updatePortfolio = useCallback((updates: Partial<InvestorPortfolio>) => {
    setPortfolio(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveData(PORTFOLIO_KEY, updated);
      return updated;
    });
  }, []);

  const updatePreferences = useCallback((updates: Partial<InvestorAIPreferences>) => {
    setPreferences(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveData(PREFERENCES_KEY, updated);
      return updated;
    });
  }, []);

  const runAnalysis = useCallback(async (request: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response: AIAnalysisResponse = {
      id: `analysis-${Date.now()}`,
      requestType: request.type,
      summary: 'Analysis completed successfully.',
      detailedAnalysis: `Based on your portfolio composition and investment preferences, this analysis evaluates the target company against key metrics including financial performance, market positioning, and strategic fit.`,
      metrics: {
        overallFit: 78,
        financialHealth: 82,
        growthPotential: 75,
        riskLevel: 35,
        synergyScore: 68,
      },
      recommendations: [
        'Consider increasing allocation in the Technology sector for better diversification',
        'The target company shows strong unit economics aligned with your investment thesis',
        'Evaluate marketing capability gap - may require additional investment post-acquisition',
      ],
      actionItems: [
        'Review detailed financial projections',
        'Schedule management meeting to discuss growth strategy',
        'Conduct customer reference calls',
      ],
      confidence: 85,
      generatedAt: new Date(),
    };
    
    setAnalyses(prev => {
      const updated = [response, ...prev].slice(0, 20);
      saveData(ANALYSES_KEY, updated);
      return updated;
    });
    
    setIsAnalyzing(false);
    return response;
  }, []);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsChatLoading(true);
    
    // Add user message
    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => {
      const updated = [...prev, userMsg];
      saveData(CHAT_KEY, updated);
      return updated;
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate AI response (placeholder - will be connected to actual AI later)
    const aiResponse = `Based on my analysis of your portfolio and the companies you're considering, I can provide insights on:

**Key Findings:**
- Your current portfolio has a 28% ROI with moderate risk tolerance
- The target company shows strong alignment with your investment thesis
- Potential synergies exist with your existing Technology holdings

**Recommendations:**
1. The company's 45% growth rate exceeds your target of 25%
2. Consider the marketing infrastructure gap - estimated $15K-25K/month to build in-house capability
3. Your portfolio concentration in Technology (40%) suggests this could enhance sector expertise

Would you like me to dive deeper into any specific metric or comparison?`;
    
    const aiMsg: AIChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        metrics: ['ROI', 'growth', 'synergy'],
        actionItems: ['Review marketing gap', 'Evaluate sector fit'],
      },
    };
    
    setChatHistory(prev => {
      const updated = [...prev, aiMsg];
      saveData(CHAT_KEY, updated);
      return updated;
    });
    
    setIsChatLoading(false);
    return aiResponse;
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
    saveData(CHAT_KEY, []);
  }, []);

  const analyzeCompatibility = useCallback(async (companyId: string): Promise<CompatibilityAnalysis> => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const analysis: CompatibilityAnalysis = {
      overallScore: 78,
      compatibilityLevel: 'good',
      strengths: [
        { area: 'Financial Performance', reason: 'Strong revenue growth aligns with your portfolio targets', impact: 'high' },
        { area: 'Market Position', reason: 'Market leader in growing segment', impact: 'medium' },
        { area: 'Management Team', reason: 'Experienced founders with domain expertise', impact: 'high' },
      ],
      weaknesses: [
        { area: 'Marketing Capabilities', reason: 'Limited internal marketing team', risk: 'medium', mitigationStrategy: 'Outsource to specialized agency or hire CMO', estimatedCost: 20000 },
        { area: 'Geographic Concentration', reason: 'Revenue heavily concentrated in single region', risk: 'low', mitigationStrategy: 'Develop expansion strategy post-investment' },
      ],
      synergyOpportunities: [
        { description: 'Cross-selling opportunities with TechStart Inc', potentialValue: 500000, confidence: 65 },
        { description: 'Shared operational infrastructure', potentialValue: 150000, confidence: 80 },
      ],
      riskFactors: [
        { factor: 'Key person dependency', severity: 'medium', probability: 0.3, mitigation: 'Key person insurance and succession planning' },
        { factor: 'Customer concentration', severity: 'low', probability: 0.2, mitigation: 'Diversification strategy in business plan' },
      ],
      financialProjections: {
        projectedROI: 32,
        breakEvenMonths: 18,
        cashFlowForecast: Array.from({ length: 24 }, (_, i) => ({
          month: i + 1,
          amount: Math.round(-50000 + i * 8000 + Math.random() * 5000),
        })),
      },
    };
    
    setIsAnalyzing(false);
    return analysis;
  }, []);

  const compareCompanies = useCallback(async (company1Id: string, company2Id: string): Promise<CompanyComparison> => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const comparison: CompanyComparison = {
      company1: { id: company1Id, name: 'Company A' },
      company2: { id: company2Id, name: 'Company B' },
      metrics: [
        { name: 'Revenue Growth', company1Value: 45, company2Value: 32, unit: '%', winner: 'company1', significance: 'high' },
        { name: 'Profit Margin', company1Value: 18, company2Value: 24, unit: '%', winner: 'company2', significance: 'medium' },
        { name: 'Customer Retention', company1Value: 92, company2Value: 85, unit: '%', winner: 'company1', significance: 'high' },
        { name: 'Market Share', company1Value: 12, company2Value: 18, unit: '%', winner: 'company2', significance: 'medium' },
        { name: 'Team Size', company1Value: 45, company2Value: 78, unit: 'employees', significance: 'low' },
        { name: 'Asking Price', company1Value: 850000, company2Value: 1200000, unit: '$', winner: 'company1', significance: 'medium' },
        { name: 'Portfolio Fit Score', company1Value: 85, company2Value: 72, unit: '/100', winner: 'company1', significance: 'high' },
      ],
      verdict: {
        recommendedPick: 'company1',
        confidence: 75,
        reasoning: [
          'Company A shows stronger alignment with your investment thesis',
          'Better growth metrics and customer retention',
          'More attractive valuation relative to performance',
          'Marketing gap can be addressed with estimated $15K/month investment',
        ],
      },
      compatibilityWithPortfolio: {
        company1: {
          overallScore: 85,
          compatibilityLevel: 'good',
          strengths: [{ area: 'Growth', reason: 'Exceeds target', impact: 'high' }],
          weaknesses: [],
          synergyOpportunities: [],
          riskFactors: [],
        },
        company2: {
          overallScore: 72,
          compatibilityLevel: 'moderate',
          strengths: [{ area: 'Profitability', reason: 'Higher margins', impact: 'medium' }],
          weaknesses: [],
          synergyOpportunities: [],
          riskFactors: [],
        },
      },
    };
    
    setIsAnalyzing(false);
    return comparison;
  }, []);

  const getOutsourcingEstimates = useCallback(async (
    companyId: string, 
    weakAreas: string[]
  ): Promise<OutsourcingCostEstimate[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const estimates: OutsourcingCostEstimate[] = weakAreas.map(area => {
      const baseCost = Math.round(5000 + Math.random() * 20000);
      return {
        service: area,
        description: `Professional ${area.toLowerCase()} services to address capability gap`,
        monthlyCost: {
          min: Math.round(baseCost * 0.7),
          max: Math.round(baseCost * 1.5),
          average: baseCost,
        },
        annualCost: {
          min: Math.round(baseCost * 0.7 * 12),
          max: Math.round(baseCost * 1.5 * 12),
          average: baseCost * 12,
        },
        providers: [
          { name: 'Provider A', estimatedCost: Math.round(baseCost * 0.9), rating: 4.5 },
          { name: 'Provider B', estimatedCost: Math.round(baseCost * 1.1), rating: 4.8 },
          { name: 'Provider C', estimatedCost: Math.round(baseCost * 0.85), rating: 4.2 },
        ],
        recommendation: `Recommend starting with mid-tier provider and scaling based on results`,
      };
    });
    
    return estimates;
  }, []);

  const analyzeCompetencies = useCallback(async (companyId: string): Promise<CompetencyArea[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return COMPETENCY_AREAS.map(area => {
      const score = Math.round(30 + Math.random() * 60);
      return {
        area,
        score,
        level: score < 40 ? 'weak' : score < 70 ? 'moderate' : 'strong',
        description: `Current capability assessment for ${area.toLowerCase()}`,
        recommendations: score < 70 
          ? [`Consider strengthening ${area.toLowerCase()} capabilities`, `Potential outsourcing opportunity`]
          : ['Maintain current strength', 'Consider for knowledge sharing'],
      };
    });
  }, []);

  const getInvestorStats = useCallback(() => {
    return {
      totalAnalyses: analyses.length,
      savedComparisons: analyses.filter(a => a.requestType === 'comparison').length,
      portfolioHealth: performanceMetrics?.sharpeRatio ? Math.round(performanceMetrics.sharpeRatio * 40) : 50,
    };
  }, [analyses.length, performanceMetrics]);

  return (
    <InvestorContext.Provider
      value={{
        portfolio,
        performanceMetrics,
        preferences,
        analyses,
        chatHistory,
        isAnalyzing,
        isChatLoading,
        updatePortfolio,
        updatePreferences,
        runAnalysis,
        sendMessage,
        clearChatHistory,
        analyzeCompatibility,
        compareCompanies,
        getOutsourcingEstimates,
        analyzeCompetencies,
        getInvestorStats,
      }}
    >
      {children}
    </InvestorContext.Provider>
  );
}

export function useInvestor() {
  const context = useContext(InvestorContext);
  if (!context) {
    return {
      portfolio: null,
      performanceMetrics: null,
      preferences: null,
      analyses: [],
      chatHistory: [],
      isAnalyzing: false,
      isChatLoading: false,
      updatePortfolio: () => {},
      updatePreferences: () => {},
      runAnalysis: async () => { throw new Error('Not available'); },
      sendMessage: async () => { throw new Error('Not available'); },
      clearChatHistory: () => {},
      analyzeCompatibility: async () => { throw new Error('Not available'); },
      compareCompanies: async () => { throw new Error('Not available'); },
      getOutsourcingEstimates: async () => { throw new Error('Not available'); },
      analyzeCompetencies: async () => { throw new Error('Not available'); },
      getInvestorStats: () => ({ totalAnalyses: 0, savedComparisons: 0, portfolioHealth: 0 }),
    };
  }
  return context;
}
