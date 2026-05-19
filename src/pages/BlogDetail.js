import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import BlogService from '../api/BlogService';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const data = await BlogService.getPost(slug);
      setPost(data);
    } catch (err) {
      setError('مقاله یافت نشد');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  if (error) return <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>;
  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6">
        <Link to="/blog" className="text-primary-600 dark:text-primary-400 hover:underline transition">
          ← بازگشت به لیست مقالات
        </Link>
      </div>
      <div className="card bg-white dark:bg-dark-surface overflow-hidden">
        <div className="p-6">
          <div className="text-sm text-primary-600 dark:text-primary-400 mb-2">{post.category?.name}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
            <span>نویسنده: {post.author_name || 'مدیریت'}</span>
            <span>{new Date(post.published_at).toLocaleDateString('fa-IR')}</span>
          </div>
          {post.featured_image && (
            <img src={post.featured_image} alt={post.title} className="w-full rounded-xl mb-6 max-h-96 object-cover shadow-soft" />
          )}
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;