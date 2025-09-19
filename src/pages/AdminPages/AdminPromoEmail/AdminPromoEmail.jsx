import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import MainLoader from '../../../components/common/Spinner';
import MemoizedEditor from '../../../components/common/MemoizedEditor'; 

import { sendPromotionalEmail } from '../../../redux/slices/promoSlice'; 
import { resetPromoState } from '../../../redux/slices/promoSlice'; 

import './_adminPromoEmail.scss';

const validationSchema = Yup.object({
  subject: Yup.string().required('Subject is required'),
});

const AdminPromoEmail = () => {
  const dispatch = useDispatch();
  const { isLoading, successMessage, error } = useSelector(state => state.promo);
  const editorRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      subject: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const body = editorRef.current?.getContent() || '';
      if (!body.trim()) {
        toast.error('Body content is required');
        return;
      }

      const result = await dispatch(sendPromotionalEmail({data:{
        subject: values.subject,
        body: body,
      }}));
 
      if (result.meta.requestStatus === 'fulfilled') {
        setTimeout(() => {
          toast.success(successMessage || 'Emails sent successfully!');
          resetForm();
          editorRef.current?.setContent('');
          dispatch(resetPromoState());
        }, 100);
      } else {
        toast.error(error || 'Failed to send emails. Please try again.');
      }
    },
  });

  return (
    <div className="promo-container">
      <div className="promo-header">
        <div className="promo-title">
          <h1>📧 Send Promotional Email</h1>
          <p>Broadcast your message to all subscribed users</p>
        </div>
        
        <div className="promo-tips">
          <div className="tip">
            💡 <strong>Editor Tip:</strong> For the best editing experience, use a large device. On desktop, click the expand icon (⛶) in the toolbar for fullscreen mode. On mobile devices, find it under the three dots (⋯) menu.
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="promo-form">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="subject">Email Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Enter your email subject..."
              {...formik.getFieldProps('subject')}
            />
            {formik.touched.subject && formik.errors.subject && (
              <span className="error">{formik.errors.subject}</span>
            )}
          </div>

          <button
            type="submit"
            className="send-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <MainLoader />
                Sending...
              </>
            ) : (
              <>
                ✉️ Send Emails
              </>
            )}
          </button>
        </div>

        <div className="editor-section">
          <label>Email Content</label>
          <div className="editor-wrapper">
            <MemoizedEditor
              initialValue={''}
              onInit={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPromoEmail;