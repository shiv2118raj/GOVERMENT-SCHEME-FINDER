import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ApplyPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [resolvedSchemeId, setResolvedSchemeId] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaar: '',
    phone: '',
    income: '',
    caste: '',
    documents: []
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [schemesRes, docsRes] = await Promise.all([
          axios.get('http://localhost:5002/api/schemes'),
          axios.get('http://localhost:5002/api/documents', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        // Find the scheme that matches the URL parameter (name/slug)
        const currentScheme = schemesRes.data.find(scheme => {
          // Check if URL parameter matches scheme _id (direct ObjectId)
          if (scheme._id === schemeId) return true;

          // Check if URL parameter matches slugified scheme name
          const slugifiedName = scheme.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          if (slugifiedName === schemeId) return true;

          // Check if URL parameter matches scheme name case-insensitively
          if (scheme.name.toLowerCase() === schemeId.toLowerCase()) return true;

          return false;
        });

        console.log('Looking for scheme:', schemeId);
        console.log('Available schemes:', schemesRes.data.map(s => ({ id: s._id, name: s.name, slug: s.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })));
        console.log('Found scheme:', currentScheme);

        if (currentScheme) {
          setScheme(currentScheme);
          setResolvedSchemeId(currentScheme._id);
        } else {
          console.error('Scheme not found for ID:', schemeId);
          setScheme(null);
          setResolvedSchemeId(null);
        }

        setUserDocuments(docsRes.data || []);

        // Preselect all existing uploaded documents
        const pre = new Set((docsRes.data || []).map(d => d._id));
        setSelectedDocIds(pre);
      } catch (e) {
        console.error('Failed to load apply data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [schemeId]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate fields in real-time
    const newErrors = { ...errors };

    if (name === 'phone') {
      if (value && !/^\d{10}$/.test(value)) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      } else {
        delete newErrors.phone;
      }
    }

    if (name === 'aadhaar') {
      if (value && !/^\d{12}$/.test(value)) {
        newErrors.aadhaar = 'Aadhaar number must be exactly 12 digits';
      } else {
        delete newErrors.aadhaar;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!resolvedSchemeId) {
      alert('Scheme not found. Please try again.');
      setSubmitting(false);
      return;
    }

    // Validate required fields
    const newErrors = {};

    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.aadhaar || !/^\d{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = 'Aadhaar number must be exactly 12 digits';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5002/api/applications',
        {
          schemeId: resolvedSchemeId, // Use the resolved MongoDB ObjectId
          applicationData: {
            ...formData,
            documents: userDocuments.filter(d => selectedDocIds.has(d._id)),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Application created. You can track it in My Applications.');
      navigate('/applications');
    } catch (error) {
      const msg = error.response?.data?.msg || 'Error creating application';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!scheme) return <div style={{ padding: 24 }}>Scheme not found</div>;

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 24, color: '#fff' }}>
      <h1 style={{ marginBottom: 8 }}>Apply for: {scheme.name}</h1>
      <p style={{ marginBottom: 24, opacity: 0.8 }}>{scheme.description}</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: errors.fullName ? '2px solid #ff4444' : '1px solid #333',
            background: '#141414',
            color: '#fff'
          }}
        />
        {errors.fullName && <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</div>}
        <input
          name="aadhaar"
          placeholder="Aadhaar Number (12 digits)"
          value={formData.aadhaar}
          onChange={handleChange}
          maxLength={12}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: errors.aadhaar ? '2px solid #ff4444' : '1px solid #333',
            background: '#141414',
            color: '#fff'
          }}
        />
        {errors.aadhaar && <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px' }}>{errors.aadhaar}</div>}
        <input
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: errors.phone ? '2px solid #ff4444' : '1px solid #333',
            background: '#141414',
            color: '#fff'
          }}
        />
        {errors.phone && <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</div>}
        <input
          name="income"
          placeholder="Annual Income"
          value={formData.income}
          onChange={handleChange}
          style={{ padding: 12, borderRadius: 8, border: '1px solid #333', background: '#141414', color: '#fff' }}
        />
        <input
          name="caste"
          placeholder="Caste (if applicable)"
          value={formData.caste}
          onChange={handleChange}
          style={{ padding: 12, borderRadius: 8, border: '1px solid #333', background: '#141414', color: '#fff' }}
        />

        {/* Required Documents Overview */}
        {Array.isArray(scheme.documents) && scheme.documents.length > 0 && (
          <div style={{ marginTop: 12, padding: 12, border: '1px solid #333', borderRadius: 8, background: '#0f0f0f' }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Required Documents for this scheme</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {scheme.documents.map((doc, idx) => (
                <li key={idx} style={{ opacity: 0.9 }}>{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Your Uploaded Documents - select to include */}
        <div style={{ marginTop: 12, padding: 12, border: '1px solid #333', borderRadius: 8, background: '#0f0f0f' }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Your Documents (included with application)</div>
          {userDocuments.length === 0 ? (
            <div style={{ opacity: 0.8 }}>No uploaded documents. You can upload from Documents page.</div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {userDocuments.map(doc => (
                <label key={doc._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedDocIds.has(doc._id)}
                    onChange={(e) => {
                      setSelectedDocIds(prev => {
                        const next = new Set(prev);
                        if (e.target.checked) next.add(doc._id); else next.delete(doc._id);
                        return next;
                      });
                    }}
                  />
                  <span>{doc.name} <span style={{ opacity: 0.6 }}>({doc.category})</span></span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(45deg, #6c63ff, #9f7aea)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}


