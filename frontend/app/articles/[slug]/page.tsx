import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/api';
import CommentForm from '@/components/CommentForm/CommentForm';
import CommentsList from '@/components/CommentsList/CommentsList';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import articleStyles from '../article.module.scss';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: ArticlePageProps) {
  // Распаковываем Promise params
  const { slug } = await params;

  let article;

  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className={articleStyles.articlePage}>
      <article className={articleStyles.article}>
        <h1 className={articleStyles.articleTitle}>
          {article.title}
        </h1>

        <div className={articleStyles.articleMeta}>
          <time dateTime={article.createdAt}>
            {new Date(article.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span className={articleStyles.articleViews}>
            {article.views} просмотров
          </span>
        </div>

        <ShareButtons
          title={article.title}
          url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/articles/${article.slug}`}
          description={article.excerpt}
        />

        <div className={articleStyles.articleContent}>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      <section className={articleStyles.commentsSection}>
        <h2 className={articleStyles.commentsTitle}>
          Комментарии {article.comments && `(${article.comments.length})`}
        </h2>

        <CommentForm articleId={article.id} />
        <CommentsList comments={article.comments || []} />
      </section>
    </div>
  );
}

// Генерация статических путей
export async function generateStaticParams() {
  try {
    const { articles } = await getArticles();
    
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Метаданные для SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  // Распаковываем Promise params
  const { slug } = await params;
  
  try {
    const article = await getArticleBySlug(slug);
    
    return {
      title: `${article.title} | Мой Блог`,
      description: article.excerpt || article.content.slice(0, 160),
    };
  } catch (error) {
    return {
      title: 'Статья не найдена | Мой Блог',
    };
  }
}