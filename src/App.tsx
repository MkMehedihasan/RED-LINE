/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { NewsHome } from './components/NewsHome';
import { ArticleDetail } from './components/ArticleDetail';
import { AdminPanel } from './components/AdminPanel';
import { BloggerThemeModal } from './components/BloggerThemeModal';
import { Footer } from './components/Footer';
import { INITIAL_NEWS } from './data/initialNews';
import { NewsArticle } from './types/news';

const STORAGE_KEY = 'redline_news_articles_v1';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load news from storage', e);
    }
    return INITIAL_NEWS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [bloggerModalOpen, setBloggerModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save news to storage', e);
    }
  }, [articles]);

  // Handle URL hash for direct news linking from Facebook comments
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#post-')) {
        const id = hash.replace('#post-', '');
        const found = articles.find((a) => a.id === id);
        if (found) {
          setSelectedArticle(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '' || hash === '#') {
        setSelectedArticle(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [articles]);

  // When selecting an article, also update browser hash and increment views
  const handleSelectArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    window.location.hash = `post-${article.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Increment views
    setArticles((prev) =>
      prev.map((item) =>
        item.id === article.id ? { ...item, views: item.views + 1 } : item
      )
    );
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Article (from Admin)
  const handleAddArticle = (newArticleData: Omit<NewsArticle, 'id' | 'views' | 'comments'>) => {
    const newId = `post-${Date.now()}`;
    const newArticle: NewsArticle = {
      ...newArticleData,
      id: newId,
      views: 1,
      comments: []
    };

    setArticles((prev) => [newArticle, ...prev]);
    // Optionally open the newly published article
    handleSelectArticle(newArticle);
  };

  // Delete Article (from Admin)
  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (selectedArticle?.id === id) {
      handleBackToHome();
    }
  };

  // Update Article (from Admin)
  const handleUpdateArticle = (updatedArticle: NewsArticle) => {
    setArticles((prev) =>
      prev.map((item) => (item.id === updatedArticle.id ? updatedArticle : item))
    );
    if (selectedArticle?.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }
  };

  // Add Comment to Article
  const handleAddComment = (articleId: string, author: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author,
      content,
      createdAt: 'এইমাত্র',
      likes: 0
    };

    setArticles((prev) =>
      prev.map((item) => {
        if (item.id === articleId) {
          const updatedComments = [newComment, ...(item.comments || [])];
          const updatedItem = { ...item, comments: updatedComments };
          if (selectedArticle?.id === articleId) {
            setSelectedArticle(updatedItem);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Reset to default news
  const handleResetToDefault = () => {
    setArticles(INITIAL_NEWS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Filtered by search query if any
  const displayedArticles = searchQuery.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : articles;

  // Breaking news items
  const breakingNews = articles.filter((a) => a.isBreaking);

  // Related articles for single post view
  const relatedArticles = selectedArticle
    ? articles
        .filter((a) => a.category === selectedArticle.category && a.id !== selectedArticle.id)
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      {/* Header */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedArticle(null);
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenBloggerModal={() => setBloggerModalOpen(true)}
        onOpenCreatePost={() => setAdminOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onGoHome={handleBackToHome}
      />

      {/* Breaking News Ticker */}
      <BreakingTicker
        breakingArticles={breakingNews.length > 0 ? breakingNews : articles.slice(0, 3)}
        onSelectArticle={handleSelectArticle}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedArticle ? (
          /* Single Article Detail Page */
          <ArticleDetail
            article={selectedArticle}
            onBack={handleBackToHome}
            onAddComment={handleAddComment}
            onSelectArticle={handleSelectArticle}
            relatedArticles={relatedArticles}
          />
        ) : (
          /* Homepage or Category Feed */
          <NewsHome
            articles={displayedArticles}
            selectedCategory={selectedCategory}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedArticle(null);
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBloggerModal={() => setBloggerModalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        articles={articles}
        onAddArticle={handleAddArticle}
        onDeleteArticle={handleDeleteArticle}
        onUpdateArticle={handleUpdateArticle}
        onResetToDefault={handleResetToDefault}
        onViewArticle={handleSelectArticle}
      />

      {/* Blogger Theme Code Modal */}
      <BloggerThemeModal
        isOpen={bloggerModalOpen}
        onClose={() => setBloggerModalOpen(false)}
      />
    </div>
  );
}
