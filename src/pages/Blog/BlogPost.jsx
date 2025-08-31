import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogBySlug } from '../../redux/slices/blogSlice';
import MainLoader from '../../components/common/Spinner';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';
import MessageCard from '../../components/common/MessageCard';
import './blog-detail.scss';

const BlogPost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, isLoading, error } = useSelector(state => state.blogs);

  useEffect(() => {
    dispatch(getBlogBySlug({ slug }));
  }, [dispatch, slug]);

  if (error) {
    return (
      <MessageCard
        title="Content Not Found"
        message={error}
        type="error"
        buttons={[
          {
            label: 'Go Home',
            onClick: () => navigate('/'),
          },
        ]}
      />
    );
  }
  
  if (isLoading || !blog) {
    return <MainLoader />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };
  
  return (
    <main className="article-detail-page">
      <div className="article-hero-section">
        <div className="container">
          <div className="breadcrumb-nav">
            <button 
              onClick={() => navigate('/blog')} 
              className="back-to-blog"
              aria-label="Back to blog"
            >
              ← Back to Blog
            </button>
          </div>
          
          <article className="article-header-content">
            <div className="article-meta-tags">
              <span className="category-tag">{blog.category}</span>
              <span className="meta-separator">•</span>
              <span className="publish-date-text">{formatDate(blog.publishedAt)}</span>
              <span className="meta-separator">•</span>
              <span className="read-time-text">{calculateReadTime(blog.content)} min read</span>
            </div>
            
            <h1 className="article-main-title">{blog.title}</h1>
            
            <p className="article-subtitle-text">{blog.metaDescription}</p>
            
            <div className="author-details-section">
              <div className="author-profile">
                <div className="author-avatar-circle">
                  {blog.author.firstName.charAt(0)}{blog.author.lastName.charAt(0)}
                </div>
                <div className="author-info-text">
                  <span className="author-full-name">
                    {blog.author.firstName} {blog.author.lastName}
                  </span>
                  <span className="author-role">Content Writer</span>
                </div>
              </div>
              
              <div className="article-actions">
                <button className="share-button" title="Share article">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="bookmark-button" title="Bookmark article">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21L12 16L5 21V5C5 3.89 5.9 3 7 3H17C18.1 3 19 3.89 19 5V21Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <section className="article-content-section">
        <div className="container">
          <div className="article-layout-wrapper">
            <div className="featured-image-container">
              <img 
                src={blog.image.url} 
                alt={blog.image.altText || blog.title} 
                className="featured-article-image"
                loading="eager"
              />
            </div>

            <div className="article-body-content">
              <div 
                className="formatted-content" 
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              <div className="article-footer-section">
                <div className="tags-section">
                  <span className="tags-label">Related to:</span>
                  <span className="topic-tag">{blog.category}</span>
                  <span className="topic-tag">Car Recycling</span>
                  <span className="topic-tag">Auto Industry</span>
                </div>
                
                <div className="social-sharing-section">
                  <span className="sharing-label">Share this article:</span>
                  <div className="social-buttons">
                    <button className="social-btn facebook-btn" title="Share on Facebook">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="social-btn twitter-btn" title="Share on Twitter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button className="social-btn linkedin-btn" title="Share on LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FreeQuoteCTA
        heading="Ready to get a fair price for your car?"
        paragraph="Get your free, instant quote in under a minute. No obligation, no hidden fees."
      />
    </main>
  );
};

export default BlogPost;