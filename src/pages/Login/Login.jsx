import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../../styles/AuthForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6).required('Password is required'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(
        loginUser({
          data: {
            email: values.email,
            password: values.password,
          },
        })
      );

      if (loginUser.fulfilled.match(result)) {
        navigate('/');
      }
    },
  });

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Login</h2>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          {/* Global error from Redux */}
          {error?.message && (
            <div className="error global-error">{error.message}</div>
          )}

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input type="password" {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
