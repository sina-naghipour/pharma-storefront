import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogService from '../api/BlogService';
import { formatDate } from '../utils/format'; // optional

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await BlogService.getPosts();
      setPosts(data.results || data);
    } catch (err) {
      setError('خطا در دریافت مقالات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>;
  if (error) return <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">مجله سلامت</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group">
            <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100 dark:border-dark-border">
              <div className="h-56 overflow-hidden">
                <img 
                  src={post.featured_image || '/placeholder-blog.jpg'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4">
                <div className="text-sm text-primary-600 dark:text-primary-400 mb-1">{post.category_name}</div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{post.summary}</p>
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                  {new Date(post.published_at).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;