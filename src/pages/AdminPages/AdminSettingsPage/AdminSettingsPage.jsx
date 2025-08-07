import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCog, FaSave, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import { fetchSettings, updateSettings } from '../../../redux/slices/adminSlice';
import './AdminSettingsPage.scss'; 

const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, settingsLoading, settingsError } = useSelector(state => state.admin);

  // State for each individual setting value
  const [defaultChecksValue, setDefaultChecksValue] = useState('');
  const [scrapRatePerKgValue, setScrapRatePerKgValue] = useState('');
  
  // Original values to track changes
  const [originalDefaultChecks, setOriginalDefaultChecks] = useState('');
  const [originalScrapRate, setOriginalScrapRate] = useState('');

  // States for individual update statuses
  const [defaultChecksStatus, setDefaultChecksStatus] = useState({ loading: false, error: null, success: null });
  const [scrapRateStatus, setScrapRateStatus] = useState({ loading: false, error: null, success: null });

  // Overall page status messages
  const [pageError, setPageError] = useState(null);
  const [pageSuccess, setPageSuccess] = useState(null);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update local state when settings data is loaded
  useEffect(() => {
    if (settings) {
      setDefaultChecksValue(settings.defaultChecks);
      setScrapRatePerKgValue(settings.scrapRatePerKg);
      // Store original values
      setOriginalDefaultChecks(settings.defaultChecks);
      setOriginalScrapRate(settings.scrapRatePerKg);
    }
  }, [settings]);

  // Function to handle the update for Default DVLA Checks
  const handleUpdateDefaultChecks = async (e) => {
    e.preventDefault();
    
    // Check if value has changed
    if (Number(defaultChecksValue) === Number(originalDefaultChecks)) {
      return; // No change, don't dispatch
    }
    
    setDefaultChecksStatus({ loading: true, error: null, success: null });
    setPageError(null);

    // Client-side validation for defaultChecksValue
    if (isNaN(defaultChecksValue) || !Number.isInteger(Number(defaultChecksValue)) || Number(defaultChecksValue) < 0) {
      setDefaultChecksStatus({ loading: false, error: "Must be a non-negative integer.", success: null });
      return;
    }

    const payload = {
      defaultChecks: Number(defaultChecksValue),
    };

    const result = await dispatch(updateSettings({ payload }));

    if (result.meta.requestStatus === 'fulfilled') {
      setDefaultChecksStatus({ loading: false, error: null, success: 'Updated!' });
      // Update original value after successful save
      setOriginalDefaultChecks(Number(defaultChecksValue));
      setTimeout(() => setDefaultChecksStatus({ loading: false, error: null, success: null }), 5000);
    } else {
      setDefaultChecksStatus({ loading: false, error: result.error.message || 'Update failed.', success: null });
    }
  };

  // Function to handle the update for Scrap Rate per Kg
  const handleUpdateScrapRatePerKg = async (e) => {
    e.preventDefault();
    
    // Check if value has changed
    if (Number(scrapRatePerKgValue) === Number(originalScrapRate)) {
      return; // No change, don't dispatch
    }
    
    setScrapRateStatus({ loading: true, error: null, success: null });
    setPageError(null);

    // Client-side validation for scrapRatePerKgValue
    if (isNaN(scrapRatePerKgValue) || Number(scrapRatePerKgValue) < 0) {
      setScrapRateStatus({ loading: false, error: "Must be a non-negative number.", success: null });
      return;
    }

    const payload = {
      scrapRatePerKg: Number(scrapRatePerKgValue),
    };

    const result = await dispatch(updateSettings({ payload }));

    if (result.meta.requestStatus === 'fulfilled') {
      setScrapRateStatus({ loading: false, error: null, success: 'Updated!' });
      // Update original value after successful save
      setOriginalScrapRate(Number(scrapRatePerKgValue));
      setTimeout(() => setScrapRateStatus({ loading: false, error: null, success: null }), 5000);
    } else {
      setScrapRateStatus({ loading: false, error: result.error.message || 'Update failed.', success: null });
    }
  };

  const handleRefresh = () => {
    dispatch(fetchSettings());
    setPageError(null);
    setPageSuccess(null);
    setDefaultChecksStatus({ loading: false, error: null, success: null });
    setScrapRateStatus({ loading: false, error: null, success: null });
  };

  // Check if values have changed
  const hasDefaultChecksChanged = Number(defaultChecksValue) !== Number(originalDefaultChecks);
  const hasScrapRateChanged = Number(scrapRatePerKgValue) !== Number(originalScrapRate);

  return (
    <div className="admin-settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1 className="settings-title">
            <FaCog />
            System Settings
          </h1>
          <button
            onClick={handleRefresh}
            className="refresh-button"
            disabled={settingsLoading}
          >
            <FaSyncAlt className={settingsLoading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        {/* Overall Status Messages */}
        {settingsLoading && (
          <div className="status-message status-message--loading">
            <FaSpinner className="spinning" />
            <span>Loading settings...</span>
          </div>
        )}

        {settingsError && (
          <div className="status-message status-message--error">
            <FaExclamationTriangle />
            <span>Error: {settingsError}</span>
          </div>
        )}

        {pageError && (
          <div className="status-message status-message--error">
            <FaExclamationTriangle />
            <span>{pageError}</span>
          </div>
        )}

        {pageSuccess && (
          <div className="status-message status-message--success">
            <FaCheckCircle />
            <span>{pageSuccess}</span>
          </div>
        )}

        {/* Individual Settings Sections */}
        {!settingsLoading && !settingsError && (
          <div className="settings-grid">
            {/* Setting: Default Checks */}
            <div className="setting-card">
              <div className="setting-content">
                <div className="setting-main">
                  <label htmlFor="defaultChecks" className="setting-label">
                    Default DVLA Checks for New Users
                  </label>
                  <div className="setting-description">
                    <div className="description-item">
                      <strong>Purpose:</strong> Sets the number of free DVLA lookup credits automatically granted to new users upon signup.
                    </div>
                    <div className="description-item">
                      <strong>Impact:</strong> Acts as an initial incentive, allowing new users to perform vehicle lookups without purchasing credits first.
                    </div>
                    <div className="description-item">
                      <strong>When to Update:</strong> During promotions for new users or to adjust base value for business strategy alignment.
                    </div>
                  </div>
                  <input
                    type="number"
                    id="defaultChecks"
                    name="defaultChecks"
                    value={defaultChecksValue}
                    onChange={(e) => setDefaultChecksValue(e.target.value)}
                    min="0"
                    step="1"
                    className="setting-input"
                    disabled={settingsLoading || defaultChecksStatus.loading}
                  />
                  {defaultChecksStatus.error && (
                    <div className="field-message field-message--error">
                      <FaExclamationTriangle />
                      <span>{defaultChecksStatus.error}</span>
                    </div>
                  )}
                  {defaultChecksStatus.success && (
                    <div className="field-message field-message--success">
                      <FaCheckCircle />
                      <span>{defaultChecksStatus.success}</span>
                    </div>
                  )}
                </div>
                <div className="setting-action">
                  <button
                    onClick={handleUpdateDefaultChecks}
                    className="save-button"
                    disabled={settingsLoading || defaultChecksStatus.loading || !hasDefaultChecksChanged}
                  >
                    {defaultChecksStatus.loading ? (
                      <>
                        <FaSpinner className="spinning" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Setting: Scrap Rate per Kg */}
            <div className="setting-card">
              <div className="setting-content">
                <div className="setting-main">
                  <label htmlFor="scrapRatePerKg" className="setting-label">
                    Base Scrap Rate per Kg (£)
                  </label>
                  <div className="setting-description">
                    <div className="description-item">
                      <strong>Purpose:</strong> Core monetary value used to calculate automated vehicle quotes based on weight.
                    </div>
                    <div className="description-item">
                      <strong>Impact:</strong> Combined with vehicle weight from DVLA data to generate immediate, accurate scrap value quotes.
                    </div>
                    <div className="description-item">
                      <strong>When to Update:</strong> When market scrap metal prices change to ensure fair, current market-reflecting quotes.
                    </div>
                  </div>
                  <input
                    type="number"
                    id="scrapRatePerKg"
                    name="scrapRatePerKg"
                    value={scrapRatePerKgValue}
                    onChange={(e) => setScrapRatePerKgValue(e.target.value)}
                    min="0"
                    step="0.01"
                    className="setting-input"
                    disabled={settingsLoading || scrapRateStatus.loading}
                  />
                  {scrapRateStatus.error && (
                    <div className="field-message field-message--error">
                      <FaExclamationTriangle />
                      <span>{scrapRateStatus.error}</span>
                    </div>
                  )}
                  {scrapRateStatus.success && (
                    <div className="field-message field-message--success">
                      <FaCheckCircle />
                      <span>{scrapRateStatus.success}</span>
                    </div>
                  )}
                </div>
                <div className="setting-action">
                  <button
                    onClick={handleUpdateScrapRatePerKg}
                    className="save-button"
                    disabled={settingsLoading || scrapRateStatus.loading || !hasScrapRateChanged}
                  >
                    {scrapRateStatus.loading ? (
                      <>
                        <FaSpinner className="spinning" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;