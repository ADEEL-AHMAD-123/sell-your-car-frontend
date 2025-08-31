// src/pages/Dashboard/AdminBlogManagement/_adminBlogManagement.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllBlogs, deleteBlogPost } from '../../../redux/slices/blogSlice';
import MainLoader from '../../../components/common/Spinner';
import { FaEdit, FaTrash, FaPlus, FaEye, FaStar, FaSearch, FaRedo } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './_adminBlogManagement.scss';

const AdminBlogManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, isLoading, error, pagination } = useSelector(state => state.blogs);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isResetting, setIsResetting] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [dispatch, debouncedSearchTerm, filterCategory, sortBy, currentPage, isResetting]);

  const fetchBlogs = (page = 1) => {
    dispatch(getAllBlogs({
      params: {
        page,
        limit: 10,
        searchTerm: debouncedSearchTerm,
        category: filterCategory,
        sortBy,
      }
    }));
    if (isResetting) {
      setIsResetting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Blog Post?',
      text: `"${title}" will be permanently deleted`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const deleteResult = await dispatch(deleteBlogPost({ id }));
      if (deleteResult.meta.requestStatus === 'fulfilled') {
        Swal.fire('Deleted!', 'Blog post deleted successfully', 'success');
        fetchBlogs(currentPage);
      } else {
        Swal.fire('Error', 'Failed to delete blog post', 'error');
      }
    }
  };

  const handleEdit = (blogId) => {
    navigate(`/dashboard/blog/edit/${blogId}`);
  };

  const handleView = (slug) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setSortBy('newest');
    setCurrentPage(1);
    setIsResetting(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryBadge = (category) => {
    const badges = {
      guides: { emoji: '📚', color: 'blue' },
      news: { emoji: '📰', color: 'green' },
      tips: { emoji: '💡', color: 'yellow' },
      announcements: { emoji: '📢', color: 'purple' }
    };
    return badges[category] || { emoji: '📝', color: 'gray' };
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };
  
  const isFiltered = searchTerm || filterCategory !== 'all' || sortBy !== 'newest' || currentPage !== 1;

  return (
    <div className="blog-management">
      <div className="blog-management__container">
        <header className="blog-management__header">
          <div className="header-content">
            <h1>Blog Management</h1>
            <p>Manage your blog posts and content</p>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/dashboard/blog/create')}
          >
            <FaPlus /> New Post
          </button>
        </header>

        <div className="blog-management__filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="guides">Guides</option>
              <option value="news">News</option>
              <option value="tips">Tips</option>
              <option value="announcements">Announcements</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
            {isFiltered && (
              <button className="btn btn--secondary reset-button" onClick={handleReset}>
                <FaRedo /> Reset Filters
              </button>
            )}
          </div>
        </div>
        
        {error ? (
          <div className="error-state">
            <h2>Error Loading Blogs</h2>
            <p>{error}</p>
            <button className="btn btn--primary" onClick={() => fetchBlogs(currentPage)}>
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="loading-state">
            <MainLoader />
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="blog-stats">
              <div className="stat">
                <span className="stat-number">{pagination?.totalBlogs || 0}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{blogs.length}</span>
                <span className="stat-label">Showing</span>
              </div>
            </div>
            
            <div className="blog-grid-container">
              <div className="blog-grid">
                {blogs.map((blog) => {
                  const badge = getCategoryBadge(blog.category);
                  return (
                    <article key={blog._id} className="blog-card">
                      {blog.featured && (
                        <div className="featured-badge">
                          <FaStar /> Featured
                        </div>
                      )}
                      {blog.image?.url && (
                        <div className="blog-card__image">
                          <img src={blog.image.url} alt={blog.image.altText || blog.title} />
                        </div>
                      )}
                      <div className="blog-card__content">
                        <div className="blog-card__meta">
                          <span className={`category-badge category-badge--${badge.color}`}>
                            {badge.emoji} {blog.category}
                          </span>
                          <time>{formatDate(blog.publishedAt)}</time>
                        </div>
                        <h3 className="blog-card__title">{blog.title}</h3>
                        <p className="blog-card__excerpt">
                          {blog.metaDescription || 'No description available'}
                        </p>
                        <div className="blog-card__author">
                          By {blog.author?.firstName} {blog.author?.lastName}
                        </div>
                        <div className="blog-card__actions">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleView(blog.slug)}
                            title="View Post"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="action-btn action-btn--edit"
                            onClick={() => handleEdit(blog._id)}
                            title="Edit Post"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() => handleDelete(blog._id, blog.title)}
                            title="Delete Post"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination__button"
                >
                  Previous
                </button>
                <span className="pagination__info">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="pagination__button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h2>No Blog Posts Found</h2>
            <p>
              {isFiltered
                ? 'No posts match your search criteria'
                : 'Start creating amazing content for your audience'
              }
            </p>
            <button
              className="btn btn--primary"
              onClick={() => navigate('/dashboard/blog/create')}
            >
              <FaPlus /> Create Your First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogManagement;