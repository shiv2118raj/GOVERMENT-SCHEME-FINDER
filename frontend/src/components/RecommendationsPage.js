import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from '../contexts/LanguageContext';
import "./RecommendationsPage.css";

const RecommendationsPage = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    age: "",
    income: "",
    caste: "",
    gender: "",
    state: "",
    education: "",
    employment: "",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modern filtering states
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "relevance",
    searchTerm: "",
    minBenefit: "",
    maxAge: "",
    showFavorites: false
  });

  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // ------- Select Option Data -------
  const selectOptions = useMemo(
    () => ({
      income: [
        "Below 1 LPA",
        "Below 2 LPA",
        "2-5 LPA",
        "5-10 LPA",
        "10-18 LPA",
        "Above 18 LPA",
      ],
      caste: ["General", "SC", "ST", "OBC"],
      gender: ["Male", "Female", "Other"],
      state: [
        "Andhra Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Delhi",
        "Gujarat",
        "Haryana",
        "Karnataka",
        "Kerala",
        "Maharashtra",
        "Punjab",
        "Rajasthan",
        "Tamil Nadu",
        "Uttar Pradesh",
        "West Bengal",
        "All",
      ],
    }),
    []
  );

  // ------- Enhanced Categories -------
  const schemeCategories = [
    { id: "all", name: "All Categories", icon: "🎯", count: 0 },
    { id: "Agriculture", name: "Agriculture", icon: "🌾", count: 0 },
    { id: "Education", name: "Education", icon: "📚", count: 0 },
    { id: "Healthcare", name: "Healthcare", icon: "🏥", count: 0 },
    { id: "Housing", name: "Housing", icon: "🏠", count: 0 },
    { id: "Employment", name: "Employment", icon: "💼", count: 0 },
    { id: "Financial", name: "Financial", icon: "💰", count: 0 },
    { id: "Women & Child Welfare", name: "Women & Child", icon: "👶", count: 0 },
    { id: "Senior Citizens", name: "Senior Citizens", icon: "👴", count: 0 },
    { id: "Business", name: "Business", icon: "🚀", count: 0 },
    { id: "MSME", name: "MSME", icon: "🏭", count: 0 },
    { id: "Social Security", name: "Social Security", icon: "🛡️", count: 0 },
    { id: "Energy", name: "Energy", icon: "⚡", count: 0 },
    { id: "Infrastructure", name: "Infrastructure", icon: "🏗️", count: 0 },
    { id: "Sanitation", name: "Sanitation", icon: "🚿", count: 0 },
    { id: "Digital Services", name: "Digital Services", icon: "💻", count: 0 },
    { id: "Food Security", name: "Food Security", icon: "🍽️", count: 0 }
  ];

  // ------- Filtering and Sorting Logic -------
  useEffect(() => {
    let filtered = [...recommendations];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(scheme => scheme.category === filters.category);
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchLower) ||
        scheme.description.toLowerCase().includes(searchLower) ||
        scheme.benefits?.some(benefit => benefit.toLowerCase().includes(searchLower))
      );
    }

    // Favorites filter
    if (filters.showFavorites) {
      filtered = filtered.filter(scheme => favorites.has(scheme._id));
    }

    // Sorting
    switch (filters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // relevance
        // Keep original order (already sorted by relevance from backend)
        break;
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, filters, favorites]);

  // ------- Generic Form Handlers -------
  const handleInput = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const toggleFavorite = (schemeId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(schemeId)) {
        newFavorites.delete(schemeId);
      } else {
        newFavorites.add(schemeId);
      }
      return newFavorites;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      sortBy: "relevance",
      searchTerm: "",
      minBenefit: "",
      maxAge: "",
      showFavorites: false
    });
  };

  // ------- API call -------
  const getRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:5002/api/recommendations",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecommendations(data.recommendations || []);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      alert("⚠️ Error fetching recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (schemeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5002/applications",
        {
          schemeId,
          applicationData: {
            personalInfo: {
              gender: profile.gender,
              state: profile.state,
            },
            eligibilityInfo: {
              income: profile.income,
              caste: profile.caste,
              education: profile.education,
              employment: profile.employment,
            },
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🎉 Application started! Check your Applications section to continue.");
    } catch (error) {
      const msg =
        error.response?.status === 400
          ? "You’ve already applied for this scheme!"
          : "Error starting application.";
      alert(msg);
    }
  };

  // ------------- Derived UI values -------------
  const formFields = [
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
      min: 1,
      max: 100,
    },
    {
      name: "income",
      label: "Annual Income",
      type: "select",
      placeholder: "Select income range",
      options: selectOptions.income,
    },
    {
      name: "caste",
      label: "Caste Category",
      type: "select",
      placeholder: "Select category",
      options: selectOptions.caste,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      placeholder: "Select gender",
      options: selectOptions.gender,
    },
    {
      name: "state",
      label: "State",
      type: "select",
      placeholder: "Select state",
      options: selectOptions.state,
    },
    {
      name: "education",
      label: "Education",
      type: "text",
      placeholder: "e.g., Graduate, 12th Pass",
    },
    {
      name: "employment",
      label: "Employment Status",
      type: "text",
      placeholder: "e.g., Unemployed, Farmer, Student",
    },
  ];

  // ------- Render -------
  return (
    <div className="recommendations-page">
      <header className="recommendations-header">
        <h1>🎯 AI-Powered Scheme Recommendations</h1>
        <p>Discover personalized government schemes with advanced filtering and smart recommendations</p>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Schemes Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">17</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">₹25L+</span>
            <span className="stat-label">Max Benefits</span>
          </div>
        </div>
      </header>

      <section className="profile-form">
        <div className="form-header">
          <h2>📋 Your Profile</h2>
          <p>Tell us about yourself to get personalized recommendations</p>
        </div>

        <div className="form-grid">
          {formFields.map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={profile[field.name]}
                  onChange={handleInput}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...field}
                  value={profile[field.name]}
                  onChange={handleInput}
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            className="get-recommendations-btn primary"
            onClick={getRecommendations}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                🔍 Analyzing Profile...
              </>
            ) : (
              <>
                🚀 Get My Recommendations
              </>
            )}
          </button>

          {hasSearched && (
            <button
              className="get-recommendations-btn secondary"
              onClick={() => {
                setProfile({
                  age: "", income: "", caste: "", gender: "",
                  state: "", education: "", employment: ""
                });
                setHasSearched(false);
                setRecommendations([]);
                setFilteredRecommendations([]);
              }}
            >
              🔄 Start Over
            </button>
          )}
        </div>
      </section>

      {hasSearched && (
        <>
          {/* Modern Filter Bar */}
          {recommendations.length > 0 && (
            <section className="filter-section">
              <div className="filter-header">
                <h2>🔍 Filter & Sort Results</h2>
                <div className="results-summary">
                  Showing {filteredRecommendations.length} of {recommendations.length} schemes
                </div>
              </div>

              <div className="filter-controls">
                {/* Search Bar */}
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="🔍 Search schemes, benefits, or keywords..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                    className="search-input"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="category-filters">
                  {schemeCategories.map(category => {
                    const count = category.id === "all"
                      ? recommendations.length
                      : recommendations.filter(s => s.category === category.id).length;

                    return (
                      <button
                        key={category.id}
                        className={`category-pill ${filters.category === category.id ? 'active' : ''}`}
                        onClick={() => handleFilterChange("category", category.id)}
                        disabled={count === 0 && category.id !== "all"}
                      >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sort and View Controls */}
                <div className="control-row">
                  <div className="sort-controls">
                    <label>Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      className="sort-select"
                    >
                      <option value="relevance">🎯 Relevance</option>
                      <option value="name">📝 Name (A-Z)</option>
                      <option value="category">📂 Category</option>
                      <option value="newest">🆕 Newest First</option>
                    </select>
                  </div>

                  <div className="view-controls">
                    <button
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Grid View"
                    >
                      ⊞
                    </button>
                    <button
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      title="List View"
                    >
                      ☰
                    </button>
                  </div>

                  <div className="filter-actions">
                    <button
                      className={`favorites-btn ${filters.showFavorites ? 'active' : ''}`}
                      onClick={() => handleFilterChange("showFavorites", !filters.showFavorites)}
                    >
                      ❤️ Favorites ({favorites.size})
                    </button>

                    <button
                      className="clear-filters-btn"
                      onClick={clearAllFilters}
                    >
                      🗑️ Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Results Section */}
          <section className="recommendations-results">
            {recommendations.length === 0 ? (
              <div className="no-recommendations">
                <div className="no-results-icon">😔</div>
                <h3>No matching schemes found</h3>
                <p>Try adjusting your profile details or expanding your criteria:</p>
                <ul>
                  <li>Consider selecting &quot;All&quot; for state if you&apos;re flexible</li>
                  <li>Try a broader income range</li>
                  <li>Check if all required fields are filled</li>
                </ul>
              </div>
            ) : filteredRecommendations.length === 0 ? (
              <div className="no-recommendations">
                <div className="no-results-icon">🔍</div>
                <h3>No schemes match your current filters</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button onClick={clearAllFilters} className="clear-filters-btn">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`recommendations-container ${viewMode}`}>
                {filteredRecommendations.map((scheme) => (
                  <article key={scheme._id} className={`recommendation-card ${viewMode}`}>
                    <div className="card-header">
                      <div className="scheme-title-row">
                        <h3>{scheme.name}</h3>
                        <button
                          className={`favorite-btn ${favorites.has(scheme._id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(scheme._id)}
                          title={favorites.has(scheme._id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {favorites.has(scheme._id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                      <span className={`category-badge ${scheme.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {schemeCategories.find(cat => cat.id === scheme.category)?.icon} {scheme.category}
                      </span>
                    </div>

                    <p className="scheme-description">{scheme.description}</p>

                    <div className="benefits-section">
                      <h4>💰 Key Benefits:</h4>
                      <ul className="benefits">
                        {scheme.benefits?.slice(0, viewMode === 'list' ? 5 : 3).map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                        {scheme.benefits?.length > (viewMode === 'list' ? 5 : 3) && (
                          <li className="more-benefits">
                            +{scheme.benefits.length - (viewMode === 'list' ? 5 : 3)} more benefits
                          </li>
                        )}
                      </ul>
                    </div>

                    {viewMode === 'list' && (
                      <div className="additional-info">
                        <div className="eligibility-preview">
                          <strong>📋 Eligibility:</strong>
                          <span>
                            {scheme.eligibility?.income && `Income: ${scheme.eligibility.income}`}
                            {scheme.eligibility?.minAge && ` | Age: ${scheme.eligibility.minAge}+`}
                            {scheme.eligibility?.gender && scheme.eligibility.gender !== 'All' && ` | ${scheme.eligibility.gender}`}
                          </span>
                        </div>
                      </div>
                    )}

                    <footer className="card-footer">
                      <button
                        className="apply-btn primary"
                        onClick={() => handleApply(scheme._id)}
                      >
                        🚀 Apply Now
                      </button>
                      <button className="details-btn secondary">
                        📋 View Details
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default RecommendationsPage;