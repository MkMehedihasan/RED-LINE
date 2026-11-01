/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { NewsHome } from './components/NewsHome';
import { ArticleDetail } from './components/ArticleDetail';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { INITIAL_NEWS } from './data/initialNews';
import { NewsArticle } from './types/news';
import { 
  subscribeToArticles, 
  fetchSingleArticle,
  addArticleToFirestore, 
  deleteArticleFromFirestore, 
  updateArticleInFirestore,
  addCommentToFirestore,
  incrementArticleViews,
  resetFirestoreToDefaults
} from './services/newsService';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const raw = localStorage.getItem('redline_news_articles_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_NEWS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);

  // Helper to extract article ID from either URL query (?news=... or ?id=...) or hash (#post-... or #news-...)
  const getArticleIdFromUrl = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    // 1. Check query parameter (?news=... or ?id=...)
    const params = new URLSearchParams(window.location.search);
    const queryId = params.get('news') || params.get('id');
    if (queryId) return queryId;

    // 2. Check hash (#post-... or #news-... or #...)
    const hash = window.location.hash;
    if (hash.startsWith('#post-')) return hash.replace('#post-', '');
    if (hash.startsWith('#news-')) return hash.replace('#news-', '');
    if (hash.startsWith('#') && hash.length > 1) return hash.slice(1);

    return null;
  }, []);

  // 1. Subscribe to Firebase Firestore Realtime Sync
  useEffect(() => {
    const unsubscribe = subscribeToArticles((liveArticles) => {
      setArticles(liveArticles);
    });

    return () => unsubscribe();
  }, []);

  // 2. URL Routing: Direct News Linking for Facebook, WhatsApp & Shared Links
  const resolveUrlArticle = useCallback(async () => {
    const targetId = getArticleIdFromUrl();
    if (!targetId) {
      setSelectedArticle(null);
      return;
    }

    // Check if article is already loaded in state
    const foundInState = articles.find((a) => a.id === targetId);
    if (foundInState) {
      setSelectedArticle(foundInState);
      return;
    }

    // If not found in current state, fetch directly from cloud Firestore
    setIsLoadingArticle(true);
    const cloudArticle = await fetchSingleArticle(targetId);
    setIsLoadingArticle(false);

    if (cloudArticle) {
      setSelectedArticle(cloudArticle);
      // Prepend to articles list so related articles and navigation work
      setArticles((prev) => {
        if (prev.some((a) => a.id === cloudArticle.id)) return prev;
        return [cloudArticle, ...prev];
      });
    }
  }, [articles, getArticleIdFromUrl]);

  useEffect(() => {
    resolveUrlArticle();

    const handlePopState = () => {
      resolveUrlArticle();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [resolveUrlArticle]);

  // When selecting an article, update browser URL with ?news=ID and scroll up
  const handleSelectArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    const newUrl = `${window.location.pathname}?news=${encodeURIComponent(article.id)}`;
    window.history.pushState({ articleId: article.id }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Increment views in Firestore
    incrementArticleViews(article.id, article.views);
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Article (Saves to Firebase Cloud Database and publishes instantly)
  const handleAddArticle = async (newArticleData: Omit<NewsArticle, 'id' | 'views' | 'comments'>) => {
    const newId = `post-${Date.now()}`;
    const newArticle: NewsArticle = {
      ...newArticleData,
      id: newId,
      views: 1,
      comments: []
    };

    // 1. Optimistically update local state immediately
    setArticles((prev) => [newArticle, ...prev.filter((a) => a.id !== newArticle.id)]);

    // 2. Save directly to Firebase Firestore and local storage backup
    try {
      await addArticleToFirestore(newArticle);
    } catch (err) {
      console.error('Error saving to cloud Firestore:', err);
    }

    // 3. Immediately close admin panel and open the published article on screen
    setAdminOpen(false);
    handleSelectArticle(newArticle);
  };

  // Keep browser document title synced with current article or home
  useEffect(() => {
    if (selectedArticle) {
      document.title = `${selectedArticle.title} | RED LINE`;
    } else {
      document.title = 'RED LINE | সত্যের সন্ধানে নির্ভীক নিউজ পোর্টাল';
    }
  }, [selectedArticle]);

  // Delete Article (Deletes from Firebase Cloud Database permanently)
  const handleDeleteArticle = async (id: string) => {
    // 1. Optimistically remove from state immediately
    setArticles((prev) => prev.filter((a) => a.id !== id));

    // 2. If the deleted article was currently open, go back to home
    if (selectedArticle?.id === id) {
      handleBackToHome();
    }

    // 3. Permanently delete from Firebase Firestore
    try {
      await deleteArticleFromFirestore(id);
    } catch (err) {
      console.error('Error deleting from cloud Firestore:', err);
    }
  };

  // Update Article (Updates in Firebase Cloud Database)
  const handleUpdateArticle = async (updatedArticle: NewsArticle) => {
    setArticles((prev) =>
      prev.map((item) => (item.id === updatedArticle.id ? updatedArticle : item))
    );

    if (selectedArticle?.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }

    try {
      await updateArticleInFirestore(updatedArticle);
    } catch (err) {
      console.error('Error updating in cloud Firestore:', err);
    }
  };

  // Add Comment to Article
  const handleAddComment = async (articleId: string, author: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author,
      content,
      createdAt: 'এইমাত্র',
      likes: 0
    };

    const targetArticle = articles.find((a) => a.id === articleId);
    const existingComments = targetArticle?.comments || [];

    // Optimistic update
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

    try {
      await addCommentToFirestore(articleId, newComment, existingComments);
    } catch (err) {
      console.error('Failed to save comment to cloud database:', err);
    }
  };

  // Reset to default news
  const handleResetToDefault = async () => {
    try {
      await resetFirestoreToDefaults();
    } catch {
      setArticles(INITIAL_NEWS);
    }
  };

  // Filtered by search query if any
  const displayedArticles = searchQuery.trim()
    ? (articles || []).filter(
        (a) =>
          a &&
          (a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.tags && a.tags.some((t) => t?.toLowerCase().includes(searchQuery.toLowerCase()))))
      )
    : (articles || []);

  // Breaking news items
  const breakingNews = (articles || []).filter((a) => a && a.isBreaking);

  // Related articles for single post view
  const relatedArticles = selectedArticle
    ? (articles || [])
        .filter((a) => a && a.category === selectedArticle.category && a.id !== selectedArticle.id)
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      {/* Header */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleBackToHome();
        }}
        onOpenAdmin={() => setAdminOpen(true)}
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
        {isLoadingArticle ? (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">খবরটি ক্লাউড থেকে লোড হচ্ছে...</p>
          </div>
        ) : selectedArticle ? (
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
          handleBackToHome();
        }}
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
    </div>
  );
}
