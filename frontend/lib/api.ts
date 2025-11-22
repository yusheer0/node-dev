const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Функции для работы с JWT в cookies теперь не нужны на фронтенде,
// так как токен хранится в secure cookie и автоматически отправляется браузером

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  approved?: boolean;
  isSpam?: boolean;
  article?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  articles?: Article[];
}

// Функция для обработки ошибок fetch
async function fetchWithErrorHandling(url: string, options?: RequestInit, requireAuth: boolean = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  // Токен теперь передается автоматически через secure cookie,
  // поэтому не нужно добавлять Authorization header

  const res = await fetch(url, {
    ...options,
    headers,
    // Отключаем кеширование для предсказуемого поведения при ошибках
    cache: 'no-store',
    // Включаем credentials для отправки cookies
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Если токен истек или недействителен, сессия автоматически завершается
      // (cookie очищается на сервере)
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export async function getArticles(): Promise<{ articles: Article[]; total: number }> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/articles`, {
      next: { revalidate: 60 }
    });
  } catch (error) {
    // Если это ошибка сети или соединение отклонено, возвращаем пустые данные
    if (error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    )) {
      console.warn(`API недоступен (${API_BASE_URL}/articles):`, error.message);
      return { articles: [], total: 0 };
    }
    throw error;
  }
}

export async function getTopArticles(limit: number = 3): Promise<{ articles: Article[] }> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/articles/top?limit=${limit}`, {
      next: { revalidate: 60 }
    });
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    )) {
      console.warn(`API недоступен (${API_BASE_URL}/articles/top):`, error.message);
      return { articles: [] };
    }
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchWithErrorHandling(`${API_BASE_URL}/categories`, {
      next: { revalidate: 300 } // Кешируем на 5 минут
    });
    return response;
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    )) {
      console.warn(`API недоступен (${API_BASE_URL}/categories):`, error.message);
      return [];
    }
    throw error;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/categories/slug/${slug}`, {
      next: { revalidate: 300 } // Кешируем на 5 минут
    });
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    )) {
      console.warn(`API недоступен (${API_BASE_URL}/categories/slug/${slug}):`, error.message);
      throw error;
    }
    throw error;
  }
}

export async function getArticlesByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<{ articles: Article[]; total: number }> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/articles/category/${categoryId}?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 }
    });
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    )) {
      console.warn(`API недоступен (${API_BASE_URL}/articles/category/${categoryId}):`, error.message);
      return { articles: [], total: 0 };
    }
    throw error;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/articles/slug/${slug}`, {
      next: { revalidate: 60 }
    });
  } catch (error) {
    // Если это ошибка сети, выбрасываем её дальше, чтобы страница могла обработать notFound()
    if (error instanceof Error && (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    )) {
      console.warn(`API недоступен при получении статьи ${slug}:`, error.message);
      throw error;
    }
    throw error;
  }
}

export async function login(password: string): Promise<{ message: string }> {
  const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password }),
  });

  // Токен теперь автоматически сохраняется в secure cookie на сервере
  return response;
}

export async function logout(): Promise<{ message: string }> {
  const response = await fetchWithErrorHandling(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });

  return response;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    // Пытаемся получить данные из защищенного endpoint
    await getArticlesForAdmin();
    return true;
  } catch (error) {
    return false;
  }
}

export async function getArticlesForAdmin(): Promise<{ articles: Article[]; total: number }> {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/articles/admin/all`, {}, true);
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      return { articles: [], total: 0 };
    }
    throw error;
  }
}

export async function getArticleByIdForAdmin(id: number): Promise<Article> {
  return await fetchWithErrorHandling(`${API_BASE_URL}/articles/admin/${id}`, {}, true);
}

export async function createArticle(articleData: {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published?: boolean;
  views?: number;
}): Promise<Article> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles`, {
    method: 'POST',
    body: JSON.stringify(articleData),
  }, true);
}

export async function updateArticle(id: number, articleData: {
  title?: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  published?: boolean;
  views?: number;
}): Promise<Article> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(articleData),
  }, true);
}

export async function deleteArticle(id: number): Promise<void> {
  await fetchWithErrorHandling(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
  }, true);
}

export async function createComment(articleId: number, commentData: {
  authorName: string;
  authorEmail: string;
  content: string;
}): Promise<Comment> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  });
}

export async function getPendingComments(): Promise<Comment[]> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/0/comments/admin/pending`, {}, true);
}

export async function getSpamComments(): Promise<Comment[]> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/0/comments/admin/spam`, {}, true);
}

export async function getCommentsStats(): Promise<{
  total: number;
  approved: number;
  pending: number;
  spam: number;
}> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/0/comments/admin/stats`, {}, true);
}

export async function approveComment(commentId: number): Promise<Comment> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/0/comments/admin/${commentId}/approve`, {
    method: 'PUT',
  }, true);
}

export async function markCommentAsSpam(commentId: number): Promise<Comment> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/0/comments/admin/${commentId}/spam`, {
    method: 'PUT',
  }, true);
}

export async function deleteComment(commentId: number): Promise<void> {
  return fetchWithErrorHandling(`${API_BASE_URL}/articles/0/comments/admin/${commentId}`, {
    method: 'DELETE',
  }, true);
}

export async function createCategory(categoryData: {
  name: string;
  slug: string;
  description?: string;
  order?: number;
}): Promise<Category> {
  return fetchWithErrorHandling(`${API_BASE_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }, true);
}

export async function updateCategory(id: number, categoryData: {
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
}): Promise<Category> {
  return fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }, true);
}

export async function deleteCategory(id: number): Promise<void> {
  return fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  }, true);
}