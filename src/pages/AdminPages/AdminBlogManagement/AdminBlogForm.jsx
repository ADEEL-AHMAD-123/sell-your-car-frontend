import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlogPost, updateBlogPost } from '../../../redux/slices/blogSlice';
import MainLoader from '../../../components/common/Spinner';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './_adminBlog.scss';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  // 💡 Updated: The metaDescription validation now allows up to 200 characters
  metaDescription: Yup.string().max(200, 'Max 200 characters').required('Meta description is required'),
  imageAltText: Yup.string().required('Alt text is required'),
});

const AdminBlogForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditing = !!id;
  const { blogs, isLoading } = useSelector(state => state.blogs);
  const blogToEdit = isEditing ? blogs.find(blog => blog._id === id) : null;
  
  const [previewImage, setPreviewImage] = useState(null);
  // 💡 Updated: The character count state now uses 200 as the new limit
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      metaDescription: '',
      image: null,
      imageAltText: '',
      category: 'guides',
      keywords: [],
      featured: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const content = editorRef.current?.getContent() || '';
      if (!content.trim()) {
        toast.error('Content is required');
        return;
      }

      const data = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'image' && values[key]) {
          data.append(key, values[key]);
        } else if (key === 'keywords') {
          data.append('keywords', JSON.stringify(values.keywords));
        } else if (key !== 'image') {
          data.append(key, key === 'content' ? content : values[key]);
        }
      });

      const result = isEditing 
        ? await dispatch(updateBlogPost({ id, data }))
        : await dispatch(createBlogPost({ data }));

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
        navigate('/dashboard/blog');
      } else {
        toast.error(result.payload?.message || 'Operation failed');
      }
    },
  });

  useEffect(() => {
    if (isEditing && blogToEdit) {
      formik.setValues({
        ...blogToEdit,
        image: null,
        imageAltText: blogToEdit.image?.altText || '',
        keywords: Array.isArray(blogToEdit.keywords) ? blogToEdit.keywords : [],
      });
      
      setPreviewImage(blogToEdit.image?.url || null);
      setCharCount((blogToEdit.metaDescription || '').length);
    }
  }, [blogToEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    formik.setFieldValue('image', file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleMetaChange = (e) => {
    const value = e.target.value;
    setCharCount(value.length);
    formik.setFieldValue('metaDescription', value);
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !formik.values.keywords.includes(value)) {
        formik.setFieldValue('keywords', [...formik.values.keywords, value]);
      }
      e.target.value = '';
    }
  };

  const removeKeyword = (keywordToRemove) => {
    formik.setFieldValue(
      'keywords',
      formik.values.keywords.filter(k => k !== keywordToRemove)
    );
  };

  if (isEditing && !blogToEdit) return <MainLoader />;

  return (
    <div className="blog-form">
      <div className="blog-form__container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="title">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
              <p className="subtitle">Craft your content with our powerful editor. Fill in the details to publish or save your post.</p>
              <div className="guide-text">
                <span className="highlight">💡 Pro Tip:</span> Use a large screen device (laptop or desktop) for the best editing experience. The editor is designed for a spacious layout.
              </div>
              <div className="guide-text">
                <span className="highlight">💡 Another Tip:</span> Click the <span className="icon">⋮</span> (three dots) on the content editor toolbar and then the <span className="icon">⛶</span> expand icon to enter fullscreen mode for a distraction-free writing experience.
              </div>
            </div>
            <div className="header-actions">
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard/blog/create')}
                  disabled={isLoading}
                >
                  ✏️ Create New Post
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="blog-form__form">
          <div className="blog-form__grid">
            {/* Main Content */}
            <main className="blog-form__main">
              {/* Title & Meta */}
              <section className="form-section">
                <h2>Basic Information</h2>
                
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    id="title"
                    className="form-input form-input--large"
                    placeholder="Enter post title"
                    {...formik.getFieldProps('title')} 
                  />
                  {formik.touched.title && formik.errors.title && (
                    <span className="form-error">{formik.errors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="metaDescription">Meta Description</label>
                  <div className="meta-input">
                    <textarea
                      id="metaDescription"
                      className="form-input form-textarea"
                      placeholder="Brief description for SEO"
                      // 💡 Updated: The maxLength is now 200
                      maxLength="200"
                      rows="2"
                      value={formik.values.metaDescription}
                      onChange={handleMetaChange}
                      onBlur={formik.handleBlur}
                    />
                    <span className={`char-count ${charCount > 200 ? 'error' : charCount > 180 ? 'warning' : ''}`}>
                      {/* 💡 Updated: The counter limit is now 200 */}
                      {charCount}/200
                    </span>
                  </div>
                  {formik.touched.metaDescription && formik.errors.metaDescription && (
                    <span className="form-error">{formik.errors.metaDescription}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="keywords">Keywords</label>
                  <input 
                    type="text" 
                    id="keywords"
                    className="form-input"
                    placeholder="Type keyword and press Enter"
                    onKeyDown={handleKeywordKeyDown}
                  />
                  {formik.values.keywords.length > 0 && (
                    <div className="tags">
                      {formik.values.keywords.map((keyword, i) => (
                        <span key={i} className="tag" onClick={() => removeKeyword(keyword)}>
                          {keyword} ✕
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Editor */}
              <section className="form-section">
                <h2>Content</h2>
                <div className="editor-container">
                  <Editor
                    apiKey='l6f3fdlflomcknz3v6lz0yyjuefcnmuclverywux19f54brl'
                    onInit={(evt, editor) => {
                      editorRef.current = editor;
                    }}
                    initialValue={formik.values.content}
                    onEditorChange={(content) => formik.setFieldValue('content', content)}
                    init={{
                      height: 500,
                      menubar: false,
                      skin: 'oxide-dark',
                      content_css: 'dark',
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                        'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | fullscreen code',
                      branding: false,
                      resize: false,
                      statusbar: false,
                    }}
                  />
                </div>
                {formik.touched.content && formik.errors.content && (
                  <span className="form-error">{formik.errors.content}</span>
                )}
              </section>
            </main>

            {/* Sidebar */}
            <aside className="blog-form__sidebar">
              {/* Settings */}
              <div className="sidebar-card">
                <h3>Settings</h3>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="category"
                    className="form-select"
                    {...formik.getFieldProps('category')}
                  >
                    <option value="guides">Guides</option>
                    <option value="news">News</option>
                    <option value="tips">Tips</option>
                    <option value="announcements">Announcements</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      className="checkbox"
                      checked={formik.values.featured}
                      onChange={(e) => formik.setFieldValue('featured', e.target.checked)}
                    />
                    <span>Featured Post</span>
                  </label>
                </div>
              </div>

              {/* Image */}
              <div className="sidebar-card">
                <h3>Featured Image</h3>
                
                <div className="image-upload" onClick={() => document.getElementById('imageInput').click()}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span>📷</span>
                      <p>Click to upload image</p>
                      <small>JPG, PNG, WebP (max 5MB)</small>
                    </div>
                  )}
                  <input 
                    type="file"
                    id="imageInput"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="imageAltText">Alt Text</label>
                  <input 
                    type="text" 
                    id="imageAltText"
                    className="form-input"
                    placeholder="Describe the image"
                    {...formik.getFieldProps('imageAltText')} 
                  />
                  {formik.touched.imageAltText && formik.errors.imageAltText && (
                    <span className="form-error">{formik.errors.imageAltText}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="sidebar-card">
                <button 
                  type="submit" 
                  className="btn btn--primary btn--full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogForm;