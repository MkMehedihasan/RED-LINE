import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, Comment } from '../types/news';
import { INITIAL_NEWS } from '../data/initialNews';

const ARTICLES_COLLECTION = 'articles';
const SETTINGS_COLLECTION = '_settings';
const LOCAL_BACKUP_KEY = 'redline_news_articles_v1';
const USER_POSTS_STORAGE_KEY = 'redline_user_custom_posts_v2';

// Helper to get local user custom posts that should never be lost
export function getLocalUserPosts(): NewsArticle[] {
  try {
    const raw = localStorage.getItem(USER_POSTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

// Helper to save local user custom posts
function saveLocalUserPosts(posts: NewsArticle[]): void {
  try {
    localStorage.setItem(USER_POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

// Clean data helper to ensure Firestore never throws undefined property error
function sanitizeArticleData(article: NewsArticle): Record<string, any> {
  return {
    id: String(article.id || `post-${Date.now()}`),
    title: String(article.title || '').trim(),
    slug: String(article.slug || '').trim() || String(article.title || '').trim().toLowerCase().replace(/\s+/g, '-').slice(0, 50),
    category: article.category || 'জাতীয়',
    summary: String(article.summary || article.title || '').trim(),
    content: Array.isArray(article.content) ? article.content : [String(article.content || '')],
    imageUrl: String(article.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80').trim(),
    imageCaption: String(article.imageCaption || '').trim(),
    reporter: String(article.reporter || 'রেড লাইন ডেস্ক').trim(),
    location: String(article.location || 'ঢাকা').trim(),
    publishedAt: article.publishedAt || new Date().toISOString(),
    readTimeMinutes: Number(article.readTimeMinutes) || 2,
    isBreaking: Boolean(article.isBreaking),
    isLead: Boolean(article.isLead),
    tags: Array.isArray(article.tags) ? article.tags : ['জাতীয়', 'রেড লাইন'],
    views: Number(article.views) || 1,
    comments: Array.isArray(article.comments) ? article.comments : []
  };
}

// Merge list ensuring user posts are retained and deduplicated by id
function mergeAndSortArticles(primary: NewsArticle[], secondary: NewsArticle[]): NewsArticle[] {
  const map = new Map<string, NewsArticle>();
  // Add secondary first
  for (const item of secondary) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }
  // Overlay primary (newer or official cloud version)
  for (const item of primary) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }
  const result = Array.from(map.values());
  // Sort descending by publishedAt (newest first)
  result.sort((a, b) => {
    const timeA = new Date(a.publishedAt || 0).getTime();
    const timeB = new Date(b.publishedAt || 0).getTime();
    return timeB - timeA;
  });
  return result;
}

export function subscribeToArticles(
  onUpdate: (articles: NewsArticle[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, ARTICLES_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      const localUserPosts = getLocalUserPosts();

      // Check if Firestore is totally empty and need initial seeding
      if (snapshot.empty) {
        try {
          const stateDocRef = doc(db, SETTINGS_COLLECTION, 'portal_state');
          const stateDoc = await getDoc(stateDocRef);

          if (!stateDoc.exists()) {
            const batch = writeBatch(db);
            const seedArticles = [...localUserPosts, ...INITIAL_NEWS];
            const seen = new Set<string>();
            for (const item of seedArticles) {
              if (!seen.has(item.id)) {
                seen.add(item.id);
                const docRef = doc(db, ARTICLES_COLLECTION, item.id);
                batch.set(docRef, sanitizeArticleData(item));
              }
            }
            batch.set(stateDocRef, { initialized: true, seededAt: new Date().toISOString() });
            await batch.commit();
            return;
          } else {
            // If already initialized but snapshot empty, fallback to local user posts + initial news
            const combined = mergeAndSortArticles(localUserPosts, INITIAL_NEWS);
            onUpdate(combined);
            return;
          }
        } catch (seedErr) {
          console.error('Initial seeding check error:', seedErr);
          const combined = mergeAndSortArticles(localUserPosts, INITIAL_NEWS);
          onUpdate(combined);
          return;
        }
      }

      const remoteItems: NewsArticle[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as NewsArticle;
        remoteItems.push({
          ...data,
          id: docSnap.id,
          comments: Array.isArray(data.comments) ? data.comments : [],
          tags: Array.isArray(data.tags) ? data.tags : ['রেড লাইন']
        });
      });

      // Merge remote items with any local user posts so newly created posts are NEVER lost
      const combined = mergeAndSortArticles(remoteItems, localUserPosts);

      // Save local backup cache
      try {
        localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(combined));
      } catch {
        // ignore
      }

      onUpdate(combined);
    },
    (err) => {
      console.error('Firestore subscription error, using local backup:', err);
      if (onError) onError(err);

      // Fallback to localStorage backup
      try {
        const cached = localStorage.getItem(LOCAL_BACKUP_KEY);
        if (cached) {
          const list = JSON.parse(cached);
          if (Array.isArray(list) && list.length > 0) {
            onUpdate(list);
            return;
          }
        }
      } catch {
        // ignore
      }
      const localUserPosts = getLocalUserPosts();
      onUpdate(mergeAndSortArticles(localUserPosts, INITIAL_NEWS));
    }
  );

  return unsubscribe;
}

export async function fetchSingleArticle(id: string): Promise<NewsArticle | null> {
  // 1. Try fetching from Firestore Cloud
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...snap.data() as NewsArticle, id: snap.id };
    }
  } catch (err) {
    console.warn('Error fetching single article from cloud, checking local storage:', err);
  }

  // 2. Try fetching from Local User Posts Store
  const localUserPosts = getLocalUserPosts();
  const localUserMatch = localUserPosts.find((a) => a.id === id);
  if (localUserMatch) return localUserMatch;

  // 3. Try fetching from Local Storage Backup
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    if (raw) {
      const list: NewsArticle[] = JSON.parse(raw);
      const found = list.find((a) => a.id === id);
      if (found) return found;
    }
  } catch {
    // ignore
  }

  // 4. Check Initial News list
  const initialMatch = INITIAL_NEWS.find((a) => a.id === id);
  if (initialMatch) return initialMatch;

  return null;
}

export async function addArticleToFirestore(article: NewsArticle): Promise<void> {
  const cleanData = sanitizeArticleData(article) as NewsArticle;

  // 1. Save to dedicated user posts store immediately so it survives anything
  const currentLocal = getLocalUserPosts();
  const updatedLocal = [cleanData, ...currentLocal.filter((a) => a.id !== cleanData.id)];
  saveLocalUserPosts(updatedLocal);

  // 2. Also update main local backup
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    const existing: NewsArticle[] = raw ? JSON.parse(raw) : [...INITIAL_NEWS];
    const merged = [cleanData, ...existing.filter((a) => a.id !== cleanData.id)];
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }

  // 3. Write directly to Firestore Cloud Database
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, cleanData.id);
    await setDoc(docRef, cleanData);

    // Also mark portal state initialized
    try {
      const stateDocRef = doc(db, SETTINGS_COLLECTION, 'portal_state');
      await setDoc(stateDocRef, { initialized: true, lastPostAt: new Date().toISOString() }, { merge: true });
    } catch {
      // non-fatal
    }
  } catch (error) {
    console.error('Failed to save article to Firestore cloud (saved locally):', error);
  }
}

export async function updateArticleInFirestore(article: NewsArticle): Promise<void> {
  const cleanData = sanitizeArticleData(article) as NewsArticle;

  // 1. Update in local user posts store
  const currentLocal = getLocalUserPosts();
  const updatedLocal = currentLocal.map((item) =>
    item.id === cleanData.id ? cleanData : item
  );
  saveLocalUserPosts(updatedLocal);

  // 2. Update in local backup
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    if (raw) {
      const list: NewsArticle[] = JSON.parse(raw);
      const updatedList = list.map((item) => (item.id === cleanData.id ? cleanData : item));
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(updatedList));
    }
  } catch {
    // ignore
  }

  // 3. Update in Firestore
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, cleanData.id);
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error('Failed to update article in Firestore (saved locally):', error);
  }
}

export async function deleteArticleFromFirestore(id: string): Promise<void> {
  // 1. Remove from local user posts store immediately
  const currentLocal = getLocalUserPosts();
  saveLocalUserPosts(currentLocal.filter((a) => a.id !== id));

  // 2. Remove from local backup
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    if (raw) {
      const list: NewsArticle[] = JSON.parse(raw);
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(list.filter((a) => a.id !== id)));
    }
  } catch {
    // ignore
  }

  // 3. Remove from Firestore
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete article from Firestore:', error);
  }
}

export async function addCommentToFirestore(
  articleId: string, 
  comment: Comment, 
  currentComments: Comment[]
): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    const updated = [comment, ...(currentComments || [])];
    await updateDoc(docRef, { comments: updated });
  } catch (error) {
    console.error('Failed to add comment to Firestore:', error);
    throw error;
  }
}

export async function incrementArticleViews(articleId: string, currentViews: number): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, { views: (currentViews || 0) + 1 });
  } catch {
    // Non-critical, ignore
  }
}

export async function resetFirestoreToDefaults(): Promise<void> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);

    // Delete existing
    snapshot.forEach((d) => {
      batch.delete(d.ref);
    });

    // Clear local user posts
    saveLocalUserPosts([]);

    // Re-seed initial
    for (const item of INITIAL_NEWS) {
      const docRef = doc(db, ARTICLES_COLLECTION, item.id);
      batch.set(docRef, sanitizeArticleData(item));
    }

    const stateDocRef = doc(db, SETTINGS_COLLECTION, 'portal_state');
    batch.set(stateDocRef, { initialized: true, resetAt: new Date().toISOString() });

    await batch.commit();

    try {
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(INITIAL_NEWS));
    } catch {
      // ignore
    }
  } catch (error) {
    console.error('Failed to reset Firestore:', error);
    throw error;
  }
}
