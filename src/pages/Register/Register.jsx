import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../../styles/AuthForm.scss';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6).required('Required'),
      phone: Yup.string().required('Phone is required'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(
        registerUser({
          data: {
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            password: values.password,
            phone: values.phone,
          },
        })
      );
      if (registerUser.fulfilled.match(result)) {
        navigate('/login');
      }
    }
    
  });

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Create Account</h2>
        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="row">
            {/* First Name */}
            <div className="form-group">
              <label>First Name</label>
              <input type="text" {...formik.getFieldProps('firstName')} />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="error">{formik.errors.firstName}</div>
              )}
            </div>
            {/* Last Name */}
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" {...formik.getFieldProps('lastName')} />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="error">{formik.errors.lastName}</div>
              )}
            </div>
          </div>
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
          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <PhoneInput
              country={'gb'}
              value={formik.values.phone}
              onChange={(value) => formik.setFieldValue('phone', value)}
              inputStyle={{ width: '100%' }}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error">{formik.errors.phone}</div>
            )}
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
