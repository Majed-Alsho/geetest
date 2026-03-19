'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronRight, ChevronDown, ThumbsUp, ThumbsDown, 
  BookOpen, Rocket, Users, Building2, Store, Megaphone, 
  Shield, CreditCard, Scale, Clock, Star, Eye, TrendingUp,
  HelpCircle, MessageCircle, ExternalLink
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/Link';
import { DEFAULT_CATEGORIES, SAMPLE_ARTICLES, FAQArticle, FAQCategory } from '@/types/faq';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ICONS: Record<string, typeof Rocket> = {
  Rocket,
  Users,
  Building2,
  Store,
  Megaphone,
  Shield,
  CreditCard,
  Scale,
};

function ArticleCard({ article, onClick }: { article: FAQArticle; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 truncate">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount} views
            </span>
            <span className="flex items-center gap-1 text-green-500">
              <ThumbsUp className="w-3 h-3" />
              {article.helpfulCount} found helpful
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </motion.button>
  );
}

function ArticleView({ article, onBack }: { article: FAQArticle; onBack: () => void }) {
  const [voted, setVoted] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleVote = (type: 'helpful' | 'not-helpful') => {
    setVoted(type);
    toast.success('Thank you for your feedback!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Knowledge Base
      </button>

      <GlassPanel className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            {article.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                <Star className="w-3 h-3 inline mr-1" />
                Featured
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Updated {new Date(article.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{article.title}</h1>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {article.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) {
              return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={i} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
            }
            if (line.match(/^\d+\. /)) {
              return <li key={i} className="ml-4 text-muted-foreground list-decimal">{line.replace(/^\d+\. /, '')}</li>;
            }
            if (line.trim() === '') {
              return <br key={i} />;
            }
            return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Feedback */}
        <div className="mt-6 p-4 rounded-xl bg-secondary/30">
          <p className="font-medium mb-3">Was this article helpful?</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('helpful')}
              disabled={voted !== null}
              className={cn(
                voted === 'helpful' && "bg-green-500/10 text-green-500 border-green-500/20"
              )}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes
            </Button>
            <Button
              variant="outline"
              size="size"
              onClick={() => handleVote('not-helpful')}
              disabled={voted !== null}
              className={cn(
                voted === 'not-helpful' && "bg-red-500/10 text-red-500 border-red-500/20"
              )}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              No
            </Button>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<FAQArticle | null>(null);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let articles = SAMPLE_ARTICLES;

    if (selectedCategory) {
      articles = articles.filter(a => a.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return articles;
  }, [searchQuery, selectedCategory]);

  // Featured articles
  const featuredArticles = SAMPLE_ARTICLES.filter(a => a.isFeatured);

  // Get current category
  const currentCategory = selectedCategory 
    ? DEFAULT_CATEGORIES.find(c => c.id === selectedCategory) 
    : null;

  if (selectedArticle) {
    return (
      <div className="section-padding">
        <div className="container-narrow">
          <ArticleView 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Knowledge Base
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, learn how to use our platform, and get the most out of your experience.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="pl-12 h-14 text-lg rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Featured Articles */}
        {!selectedCategory && !searchQuery && featuredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <GlassPanel className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    !selectedCategory 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                  All Articles
                </button>
                {DEFAULT_CATEGORIES.map((category) => {
                  const Icon = ICONS[category.icon] || BookOpen;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === category.id 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </nav>
            </GlassPanel>
          </motion.div>

          {/* Articles List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {/* Category Header */}
            {currentCategory && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{currentCategory.name}</h2>
                <p className="text-muted-foreground">{currentCategory.description}</p>
              </div>
            )}

            {/* Search Results Header */}
            {searchQuery && (
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
            )}

            {/* Articles */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-3">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
            ) : (
              <GlassPanel className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try a different search term or browse by category.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </GlassPanel>
            )}
          </motion.div>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <GlassPanel className="p-6 text-center">
            <MessageCircle className="w-10 h-10 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions.
            </p>
            <Link href="/admin" className="btn-accent">
              Contact Support
            </Link>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
