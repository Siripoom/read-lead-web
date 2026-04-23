export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: "manga" | "novel" | "audiobook";
  rating: number;
  reads: string;
  tags: string[];
  price: "free" | number;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  date: string;
  price: "free" | number;
  views: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface Notification {
  id: string;
  type: "new_episode" | "comment" | "purchase" | "system";
  message: string;
  time: string;
  read: boolean;
}

export interface RevenuePoint {
  date: string;
  amount: number;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "completed";
}

export interface Work {
  id: string;
  title: string;
  genre: "manga" | "novel" | "audiobook";
  episodes: number;
  reads: string;
  status: "published" | "draft" | "pending";
  revenue: number;
}

export interface BookWithUpdate {
  book: Book;
  latestEpisode: number;
  latestEpisodeTitle: string;
  updatedAt: string;
}

export const MOCK_BOOKS: Book[] = [
  { id: "1", title: "The Obsidian Chronicles", author: "Elara Vane", cover: "https://placehold.co/160x220/2D1B69/white?text=Obsidian", genre: "novel", rating: 4.9, reads: "134k", tags: ["Fantasy", "Mystery"], price: "free" },
  { id: "2", title: "Shattered Echoes", author: "Marcus Thorne", cover: "https://placehold.co/160x220/1a4a2e/white?text=Shattered", genre: "novel", rating: 4.7, reads: "89k", tags: ["Sci-Fi", "Thriller"], price: "free" },
  { id: "3", title: "Beyond the Pale", author: "S.J. Rivers", cover: "https://placehold.co/160x220/4a1a1a/white?text=Beyond", genre: "manga", rating: 4.8, reads: "210k", tags: ["Action", "Adventure"], price: 10 },
  { id: "4", title: "The Alchemist's Debt", author: "Kai Chen", cover: "https://placehold.co/160x220/1a2a4a/white?text=Alchemist", genre: "manga", rating: 4.5, reads: "56k", tags: ["Fantasy", "Romance"], price: "free" },
  { id: "5", title: "Neon Ghost", author: "Yuki Tanaka", cover: "https://placehold.co/160x220/0d1117/white?text=Neon", genre: "manga", rating: 4.6, reads: "78k", tags: ["Cyberpunk", "Action"], price: 5 },
  { id: "6", title: "Velvet Night", author: "Lyra Moon", cover: "https://placehold.co/160x220/1a0a2e/white?text=Velvet", genre: "novel", rating: 4.3, reads: "23k", tags: ["Romance", "Drama"], price: "free" },
  { id: "7", title: "Root & Bone", author: "Dev Patel", cover: "https://placehold.co/160x220/1a2e0a/white?text=Root", genre: "audiobook", rating: 4.7, reads: "45k", tags: ["Horror", "Supernatural"], price: 15 },
  { id: "8", title: "Starlight Drift", author: "Nova Blake", cover: "https://placehold.co/160x220/0a1a2e/white?text=Starlight", genre: "audiobook", rating: 4.4, reads: "67k", tags: ["Sci-Fi", "Space"], price: "free" },
  { id: "9", title: "The Forest Whispers", author: "Erin Moss", cover: "https://placehold.co/160x220/0a2e1a/white?text=Forest", genre: "novel", rating: 4.9, reads: "312k", tags: ["Fantasy", "Nature"], price: "free" },
  { id: "10", title: "Crimson Tides", author: "Zara Quinn", cover: "https://placehold.co/160x220/2e0a0a/white?text=Crimson", genre: "manga", rating: 4.6, reads: "91k", tags: ["Action", "War"], price: 8 },
  { id: "11", title: "Midnight Protocol", author: "Alex Rowe", cover: "https://placehold.co/160x220/0a0a2e/white?text=Midnight", genre: "novel", rating: 4.5, reads: "44k", tags: ["Thriller", "Tech"], price: "free" },
  { id: "12", title: "Cursed Bloom", author: "Mei Lin", cover: "https://placehold.co/160x220/2e1a0a/white?text=Cursed", genre: "manga", rating: 4.8, reads: "189k", tags: ["Fantasy", "Slice of Life"], price: "free" },
];

export const MOCK_EPISODES: Episode[] = [
  { id: "e1", number: 1, title: "The Beginning of the End", date: "Jan 15, 2026", price: "free", views: 24300, commentCount: 87 },
  { id: "e2", number: 2, title: "Shadows in the Archive", date: "Jan 22, 2026", price: "free", views: 18900, commentCount: 62 },
  { id: "e3", number: 3, title: "The Forbidden Tome", date: "Jan 29, 2026", price: 3, views: 14200, commentCount: 45 },
  { id: "e4", number: 4, title: "Memories Erased", date: "Feb 5, 2026", price: 3, views: 11800, commentCount: 38 },
  { id: "e5", number: 5, title: "The Archivist's Secret", date: "Feb 12, 2026", price: 3, views: 9400, commentCount: 29 },
  { id: "e6", number: 6, title: "Darkness Revealed", date: "Feb 19, 2026", price: 3, views: 7100, commentCount: 21 },
];

export const MOCK_COMMENTS: Comment[] = [
  { id: "c1", user: "BookLover99", avatar: "https://placehold.co/40x40/E11D2E/white?text=B", rating: 5, text: "Absolutely breathtaking! The world-building is unlike anything I've read before.", date: "Mar 15, 2026" },
  { id: "c2", user: "MangaFan42", avatar: "https://placehold.co/40x40/2D1B69/white?text=M", rating: 4, text: "Gripping story from start to finish. Can't wait for the next episode!", date: "Mar 14, 2026" },
  { id: "c3", user: "ReaderX", avatar: "https://placehold.co/40x40/1a4a2e/white?text=R", rating: 5, text: "One of the best stories on this platform. Highly recommended!", date: "Mar 12, 2026" },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "new_episode", message: "New episode of 'The Obsidian Chronicles' is available!", time: "2 min ago", read: false },
  { id: "n2", type: "comment", message: "MangaFan42 replied to your comment.", time: "1 hour ago", read: false },
  { id: "n3", type: "purchase", message: "Your purchase of 'Beyond the Pale Ep.3' was successful.", time: "3 hours ago", read: true },
  { id: "n4", type: "system", message: "Welcome to ReadLead! Start exploring amazing stories.", time: "2 days ago", read: true },
];

export const MOCK_REVENUE_DATA: RevenuePoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  amount: Math.floor(Math.random() * 5000) + 1000,
}));

export const MOCK_WITHDRAWALS: Withdrawal[] = [
  { id: "w001", amount: 5000, method: "Bank Transfer", date: "Mar 20, 2026", status: "pending" },
  { id: "w002", amount: 12000, method: "PayPal", date: "Mar 15, 2026", status: "approved" },
  { id: "w003", amount: 8500, method: "Bank Transfer", date: "Mar 10, 2026", status: "completed" },
  { id: "w004", amount: 3200, method: "PayPal", date: "Mar 5, 2026", status: "rejected" },
  { id: "w005", amount: 7800, method: "Bank Transfer", date: "Feb 28, 2026", status: "completed" },
];

export const MOCK_BOOKS_WITH_UPDATES: BookWithUpdate[] = [
  { book: MOCK_BOOKS[0], latestEpisode: 42, latestEpisodeTitle: "เงาแห่งอดีต", updatedAt: "11 เม.ย." },
  { book: MOCK_BOOKS[1], latestEpisode: 18, latestEpisodeTitle: "จุดจบของการรอคอย", updatedAt: "11 เม.ย." },
  { book: MOCK_BOOKS[2], latestEpisode: 77, latestEpisodeTitle: "ดาบแห่งชะตา", updatedAt: "10 เม.ย." },
  { book: MOCK_BOOKS[3], latestEpisode: 31, latestEpisodeTitle: "หนี้กรรมเก่า", updatedAt: "10 เม.ย." },
  { book: MOCK_BOOKS[4], latestEpisode: 55, latestEpisodeTitle: "แสงสุดท้ายในเมืองมืด", updatedAt: "9 เม.ย." },
  { book: MOCK_BOOKS[5], latestEpisode: 12, latestEpisodeTitle: "คืนแห่งความลับ", updatedAt: "9 เม.ย." },
  { book: MOCK_BOOKS[6], latestEpisode: 88, latestEpisodeTitle: "เสียงจากใต้ดิน", updatedAt: "8 เม.ย." },
  { book: MOCK_BOOKS[7], latestEpisode: 23, latestEpisodeTitle: "ดาวที่หลงทาง", updatedAt: "8 เม.ย." },
  { book: MOCK_BOOKS[8], latestEpisode: 101, latestEpisodeTitle: "เสียงกระซิบของป่า", updatedAt: "7 เม.ย." },
  { book: MOCK_BOOKS[9], latestEpisode: 64, latestEpisodeTitle: "คลื่นสีแดง", updatedAt: "7 เม.ย." },
];

export const MOCK_WORKS: Work[] = [
  { id: "wk1", title: "The Obsidian Chronicles", genre: "novel", episodes: 6, reads: "134k", status: "published", revenue: 45200 },
  { id: "wk2", title: "Dark Meridian", genre: "manga", episodes: 12, reads: "89k", status: "published", revenue: 28700 },
  { id: "wk3", title: "Voices in the Void", genre: "audiobook", episodes: 4, reads: "23k", status: "draft", revenue: 0 },
  { id: "wk4", title: "The Last Archivist", genre: "novel", episodes: 8, reads: "67k", status: "pending", revenue: 18900 },
];
