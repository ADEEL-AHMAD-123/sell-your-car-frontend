import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs } from '../../redux/slices/blogSlice';
import MainLoader from '../../components/common/Spinner';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';
import './blog-page.scss';

const BlogPage = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading, error, pagination } = useSelector(state => state.blogs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllBlogs({
      params: {
        page: currentPage,
        limit: 9,
      }
    }));
  }, [dispatch, currentPage]);

  if (isLoading) {
    return <MainLoader />;
  }

  if (error) {
    return <div className="error-display">{error}</div>;
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const totalPages = pagination.totalPages;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <main className="blog-listing-page">
      <section className="blog-hero-banner">
        <div className="container">
          <div className="hero-content-wrapper">
            <div className="hero-tag">
              <span>📚 Latest Insights</span>
            </div>
            <h1 className="hero-main-heading">Car Scrapping & Recycling Hub</h1>
            <p className="hero-description-text">
              Expert insights, tips, and guides to help you make the most of your car's journey from road to recycling.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{blogs.length}+</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5k+</span>
                <span className="stat-label">Readers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-content-area">
        <div className="container">
          {blogs.length > 0 ? (
            <div className="blog-posts-grid">
              {blogs.map((blog, index) => (
                <article className={`post-item ${index === 0 ? 'featured-post' : ''}`} key={blog._id}>
                  <div className="post-image-container">
                    <img 
                      src={blog.image.url} 
                      alt={blog.image.altText || blog.title}
                      loading="lazy"
                      className="post-thumbnail"
                    />
                    <div className="post-category-badge">{blog.category}</div>
                  </div>
                  <div className="post-content-area">
                    <Link to={`/blog/${blog.slug}`} className="post-title-wrapper">
                      <h3 className="post-title-text">{blog.title}</h3>
                    </Link>
                    <p className="post-excerpt-text">{blog.metaDescription}</p>
                    <div className="post-metadata">
                      <div className="author-info">
                        <div className="author-avatar">
                          {blog.author.firstName.charAt(0)}{blog.author.lastName.charAt(0)}
                        </div>
                        <span className="author-name">
                          {blog.author.firstName} {blog.author.lastName}
                        </span>
                      </div>
                      <span className="publish-date">{formatDate(blog.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-blog-state">
              <div className="empty-icon">📝</div>
              <h3>No Articles Yet</h3>
              <p>We're working on bringing you amazing content. Check back soon!</p>
            </div>
          )}
          
          {pagination && pagination.totalPages > 1 && (
            <div className="blog-pagination-area">
              <nav className="pagination-controls" aria-label="Blog pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="nav-button prev-button"
                >
                  ← Previous
                </button>
                
                <div className="page-number-list">
                  {generatePageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="page-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`number-button ${currentPage === page ? 'active-page' : ''}`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="nav-button next-button"
                >
                  Next →
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
      
      <FreeQuoteCTA
        heading="Ready to get a fair price for your car?"
        paragraph="Get your free, instant quote in under a minute. No obligation, no hidden fees."
      />
    </main>
  );
};

export default BlogPage;