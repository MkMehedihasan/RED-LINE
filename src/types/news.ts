export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

export type NewsCategory = 
  | 'জাতীয়' 
  | 'রাজনীতি' 
  | 'আন্তর্জাতিক' 
  | 'অর্থনীতি' 
  | 'খেলাধুলা' 
  | 'তথ্যপ্রযুক্তি' 
  | 'বিনোদন' 
  | 'মতামত';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  summary: string;
  content: string[];
  imageUrl: string;
  imageCaption?: string;
  reporter: string;
  location: string;
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
  isBreaking?: boolean;
  isLead?: boolean;
  isSpecial?: boolean;
  tags: string[];
  comments: Comment[];
  videoUrl?: string;
}
