'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, PieChart, BarChart3, Activity, Target,
  Shield, Zap, Brain, MessageCircle, Send, RefreshCw, Download,
  AlertTriangle, CheckCircle, XCircle, Info, ChevronRight, Building2,
  DollarSign, Percent, Users, Globe, Briefcase, Clock, Star, Eye,
  Scale, ArrowUpRight, ArrowDownRight, Minus, Loader2, Lightbulb,
  Wrench, Heart, X, Copy, ExternalLink
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/Link';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestor } from '@/contexts/InvestorContext';
import { formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'overview' | 'portfolio' | 'analysis' | 'compare' | 'chat';

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  unit, 
  trend, 
  icon: Icon, 
  color = 'accent',
  subtitle 
}: { 
  title: string; 
  value: number | string; 
  unit?: string; 
  trend?: 'up' | 'down' | 'neutral';
  icon: typeof TrendingUp;
  color?: 'accent' | 'green' | 'amber' | 'blue' | 'purple';
  subtitle?: string;
}) {
  const colorClasses = {
    accent: 'bg-accent/10 text-accent',
    green: 'bg-green-500/10 text-green-500',
    amber: 'bg-amber-500/10 text-amber-500',
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
      <div className="flex items-start justify-between mb-2">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === 'up' && "text-green-500",
            trend === 'down' && "text-red-500",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
            {trend === 'neutral' && <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {typeof value === 'number' ? value.toLocaleString('en-US') : value}
        {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ 
  label, 
  value, 
  max = 100, 
  color = 'accent',
  showValue = true 
}: { 
  label: string; 
  value: number; 
  max?: number;
  color?: 'accent' | 'green' | 'amber' | 'blue' | 'purple' | 'red';
  showValue?: boolean;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    accent: 'bg-accent',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        {showValue && <span className="font-medium">{value}%</span>}
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={cn("h-full rounded-full", colorClasses[color])}
        />
      </div>
    </div>
  );
}

// Competency Radar Component (Simplified)
function CompetencyChart({ competencies }: { competencies: { area: string; score: number; level: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {competencies.map((comp) => (
        <div key={comp.area} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
          <div className={cn(
            "w-3 h-3 rounded-full",
            comp.level === 'strong' && "bg-green-500",
            comp.level === 'moderate' && "bg-amber-500",
            comp.level === 'weak' && "bg-red-500"
          )} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{comp.area}</p>
            <p className="font-semibold text-sm">{comp.score}/100</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Chat Message Component
function ChatMessage({ message }: { message: { role: string; content: string; timestamp: Date } }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-accent text-accent-foreground" : "bg-purple-500/10 text-purple-500"
      )}>
        {isUser ? <Users className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
      </div>
      <div className={cn(
        "max-w-[80%] p-4 rounded-2xl",
        isUser ? "bg-accent text-accent-foreground" : "bg-secondary/50 border border-border/50"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={cn(
          "text-xs mt-2",
          isUser ? "text-accent-foreground/60" : "text-muted-foreground"
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

export default function InvestorProfile() {
  const { user } = useAuth();
  const { 
    portfolio, 
    performanceMetrics, 
    preferences,
    chatHistory,
    isAnalyzing,
    isChatLoading,
    sendMessage,
    clearChatHistory,
    analyzeCompatibility,
    compareCompanies,
    getOutsourcingEstimates,
    analyzeCompetencies,
    getInvestorStats
  } = useInvestor();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [chatInput, setChatInput] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [outsourcingCosts, setOutsourcingCosts] = useState<any[]>([]);

  const stats = getInvestorStats();

  // Load initial data
  useEffect(() => {
    if (activeTab === 'analysis' && competencies.length === 0) {
      analyzeCompetencies('demo').then(setCompetencies);
    }
  }, [activeTab, competencies.length, analyzeCompetencies]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    try {
      await sendMessage(chatInput);
      setChatInput('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleAnalyzeCompatibility = async () => {
    if (selectedCompanies.length === 0) {
      toast.error('Please select a company to analyze');
      return;
    }
    
    try {
      const result = await analyzeCompatibility(selectedCompanies[0]);
      setCompatibilityResult(result);
      
      // Get outsourcing estimates for weak areas
      const weakAreas = result.weaknesses.map((w: any) => w.area);
      if (weakAreas.length > 0) {
        const costs = await getOutsourcingEstimates(selectedCompanies[0], weakAreas);
        setOutsourcingCosts(costs);
      }
      
      toast.success('Compatibility analysis complete');
    } catch (error) {
      toast.error('Analysis failed');
    }
  };

  if (!user) {
    return (
      <div className="section-padding min-h-[80vh] flex items-center justify-center">
        <GlassPanel className="p-8 text-center max-w-md">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Investor Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your investor profile and AI analysis tools.
          </p>
          <Link href="/login" className="btn-accent">
            Sign In
          </Link>
        </GlassPanel>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
  ];

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold tracking-tight">Investor Dashboard</h1>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                AI-Powered
              </span>
            </div>
            <p className="text-muted-foreground">
              AI-driven insights, portfolio analysis, and investment recommendations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="btn-accent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <MetricCard
            title="Portfolio Value"
            value={portfolio?.currentValue || 0}
            unit=""
            icon={DollarSign}
            color="green"
            trend="up"
            subtitle={`${performanceMetrics?.roi || 0}% ROI`}
          />
          <MetricCard
            title="Annualized Return"
            value={performanceMetrics?.annualizedReturn || 0}
            unit="%"
            icon={TrendingUp}
            color="accent"
            trend="up"
          />
          <MetricCard
            title="Sharpe Ratio"
            value={performanceMetrics?.sharpeRatio || 0}
            icon={Activity}
            color="blue"
          />
          <MetricCard
            title="Win Rate"
            value={performanceMetrics?.winRate || 0}
            unit="%"
            icon={Target}
            color="purple"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Overview */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Performance Metrics
                  </h2>
                  <div className="space-y-4">
                    <ProgressBar label="Diversification Score" value={performanceMetrics?.diversificationScore || 72} color="blue" />
                    <ProgressBar label="Risk-Adjusted Return" value={Math.round((performanceMetrics?.sharpeRatio || 1.25) * 40)} color="accent" />
                    <ProgressBar label="Portfolio Health" value={stats.portfolioHealth} color="green" />
                    <ProgressBar label="Max Drawdown Risk" value={performanceMetrics?.maxDrawdown || 12} color="red" />
                  </div>
                </GlassPanel>

                {/* Sector Allocation */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-accent" />
                    Sector Allocation
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {portfolio?.sectorAllocation && Object.entries(portfolio.sectorAllocation).map(([sector, percentage]) => (
                      <div key={sector} className="text-center p-4 rounded-xl bg-secondary/30">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                          <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <p className="font-semibold">{percentage}%</p>
                        <p className="text-xs text-muted-foreground">{sector}</p>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Risk Profile */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-500" />
                    Risk Profile
                  </h2>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                    <p className="text-amber-500 font-semibold capitalize">
                      {performanceMetrics?.riskTolerance || 'Moderate'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Balanced risk with growth focus
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volatility</span>
                      <span className="font-medium">{performanceMetrics?.volatility || 18}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Drawdown</span>
                      <span className="font-medium">{performanceMetrics?.maxDrawdown || 12}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Holding</span>
                      <span className="font-medium">{performanceMetrics?.averageHoldingPeriod || 24} mo</span>
                    </div>
                  </div>
                </GlassPanel>

                {/* Quick Actions */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setActiveTab('analysis')}
                      className="w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-left flex items-center gap-3 transition-colors"
                    >
                      <Brain className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Run AI Analysis</p>
                        <p className="text-xs text-muted-foreground">Get insights on opportunities</p>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('compare')}
                      className="w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-left flex items-center gap-3 transition-colors"
                    >
                      <Scale className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Compare Companies</p>
                        <p className="text-xs text-muted-foreground">Side-by-side analysis</p>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-left flex items-center gap-3 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Chat with AI</p>
                        <p className="text-xs text-muted-foreground">Ask specific questions</p>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </button>
                  </div>
                </GlassPanel>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-accent" />
                    Portfolio Companies
                  </h2>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">{formatCurrency(portfolio?.currentValue || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {portfolio?.companies.map((company) => (
                    <div 
                      key={company.id}
                      className="p-4 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry} • {company.ownershipPercentage}% ownership</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent">{formatCurrency(company.currentValue)}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={company.performance.growth > 0 ? "text-green-500" : "text-red-500"}>
                            {company.performance.growth > 0 ? '+' : ''}{company.performance.growth}%
                          </span>
                          <span className="text-muted-foreground">growth</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Competency Analysis */}
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Competency Analysis
                </h2>
                {competencies.length > 0 ? (
                  <CompetencyChart competencies={competencies} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing competencies...</p>
                  </div>
                )}
              </GlassPanel>

              {/* Compatibility Analysis */}
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Compatibility Analysis
                </h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select a company to analyze compatibility with your portfolio
                  </p>
                  
                  <select className="w-full p-3 rounded-xl border border-border bg-background">
                    <option value="">Select a company...</option>
                    <option value="comp-1">Tech Startup A - SaaS Platform</option>
                    <option value="comp-2">Green Energy B - Solar Solutions</option>
                    <option value="comp-3">Healthcare C - Telehealth Platform</option>
                  </select>

                  <Button 
                    onClick={handleAnalyzeCompatibility}
                    disabled={isAnalyzing}
                    className="w-full btn-accent"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Run Compatibility Analysis
                      </>
                    )}
                  </Button>

                  {compatibilityResult && (
                    <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold">Overall Fit</span>
                        <span className="text-2xl font-bold text-accent">{compatibilityResult.overallScore}/100</span>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        Compatibility Level: {compatibilityResult.compatibilityLevel}
                      </p>
                    </div>
                  )}
                </div>
              </GlassPanel>

              {/* Outsourcing Cost Estimates */}
              {outsourcingCosts.length > 0 && (
                <GlassPanel className="p-6 lg:col-span-2">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-500" />
                    Outsourcing Cost Estimates
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-calculated estimates to address capability gaps:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {outsourcingCosts.map((cost, i) => (
                      <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                        <h4 className="font-semibold mb-2">{cost.service}</h4>
                        <p className="text-2xl font-bold text-accent mb-1">
                          ${cost.monthlyCost.average.toLocaleString('en-US')}/mo
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Range: ${cost.monthlyCost.min.toLocaleString('en-US')} - ${cost.monthlyCost.max.toLocaleString('en-US')}
                        </p>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              )}
            </motion.div>
          )}

          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-500" />
                  Company Comparison
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Company A</label>
                    <select className="w-full p-3 rounded-xl border border-border bg-background">
                      <option value="">Select first company...</option>
                      <option value="comp-1">Tech Startup A - SaaS Platform</option>
                      <option value="comp-2">Green Energy B - Solar Solutions</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Company B</label>
                    <select className="w-full p-3 rounded-xl border border-border bg-background">
                      <option value="">Select second company...</option>
                      <option value="comp-2">Green Energy B - Solar Solutions</option>
                      <option value="comp-3">Healthcare C - Telehealth</option>
                    </select>
                  </div>
                </div>

                <Button className="btn-accent w-full md:w-auto">
                  <Scale className="w-4 h-4 mr-2" />
                  Compare Companies
                </Button>

                {/* Comparison Results Placeholder */}
                <div className="mt-8 p-6 rounded-xl bg-secondary/30 border border-border/50 text-center">
                  <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Select Two Companies to Compare</h3>
                  <p className="text-sm text-muted-foreground">
                    AI will analyze financial metrics, compatibility with your portfolio, and provide recommendations.
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Chat Area */}
              <div className="lg:col-span-3">
                <GlassPanel className="p-6 h-[600px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      AI Investment Assistant
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearChatHistory}
                    >
                      Clear Chat
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Brain className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Start a conversation</h3>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            Ask me about investment opportunities, portfolio analysis, company comparisons, or financial projections.
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 mt-4">
                            <button 
                              onClick={() => setChatInput("What's the best investment opportunity for my portfolio?")}
                              className="px-3 py-1.5 rounded-full bg-secondary text-sm hover:bg-secondary/80"
                            >
                              Best opportunity for me?
                            </button>
                            <button 
                              onClick={() => setChatInput("Analyze my portfolio's risk exposure")}
                              className="px-3 py-1.5 rounded-full bg-secondary text-sm hover:bg-secondary/80"
                            >
                              Analyze my risks
                            </button>
                            <button 
                              onClick={() => setChatInput("What are my portfolio's weak points?")}
                              className="px-3 py-1.5 rounded-full bg-secondary text-sm hover:bg-secondary/80"
                            >
                              Find weak points
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      chatHistory.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                      ))
                    )}
                    {isChatLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="bg-secondary/50 border border-border/50 p-4 rounded-2xl">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about investments, analysis, or recommendations..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="btn-accent"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassPanel>
              </div>

              {/* Quick Prompts Sidebar */}
              <div>
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4">Quick Prompts</h3>
                  <div className="space-y-2">
                    {[
                      "Compare my top 2 opportunities",
                      "What's my portfolio missing?",
                      "Calculate outsourcing costs",
                      "Risk assessment for new investment",
                      "ROI projection for Tech Startup",
                      "Marketing gap analysis",
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setChatInput(prompt)}
                        className="w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-left text-sm transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
