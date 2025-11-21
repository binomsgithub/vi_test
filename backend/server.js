import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - only needed in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}
app.use(express.json());

// Session middleware
app.use(
  session({
    name: "vi_session",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Auth user (hardcoded for demo)
const AUTH_USER = {
  username: "poweruser",
  password: "m5c8!!wi}vx",
};

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

// Helper to read and parse CSV
function readCSV(filename) {
  const filePath = join(__dirname, 'data', filename);
  const content = readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });
}

// Helper to filter data based on global filters
function applyFilters(data, filters) {
  return data.filter(row => {
    if (filters.brand && filters.brand !== 'any' && row.brand !== filters.brand) return false;
    if (filters.owner && filters.owner !== 'any' && row.owner !== filters.owner) return false;
    if (filters.franchiseId && filters.franchiseId !== 'any' && row.franchise_id !== filters.franchiseId && row.franchisee_id !== filters.franchiseId) return false;
    if (filters.storeId && filters.storeId !== 'any' && row.store_id !== filters.storeId) return false;
    if (filters.channel && filters.channel !== 'any' && row.channel !== filters.channel) return false;
    if (filters.engagementMode && filters.engagementMode !== 'any' && row.engagement_mode !== filters.engagementMode) return false;
    return true;
  });
}

// Auth routes (public)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === AUTH_USER.username && password === AUTH_USER.password) {
    req.session.user = { username };
    return res.json({ ok: true, username });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("vi_session");
    return res.json({ ok: true });
  });
});

app.get('/api/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  return res.status(401).json({ authenticated: false });
});

// GET /api/filters - Return filter options (public for filter dropdowns)
app.get('/api/filters', (req, res) => {
  try {
    const exploreData = readCSV('explore_calls.csv');
    const brands = [...new Set(exploreData.map(r => r.brand).filter(Boolean))];
    const owners = [...new Set(exploreData.map(r => r.owner).filter(Boolean))];
    const franchiseIds = [...new Set(exploreData.map(r => r.franchise_id).filter(Boolean))];
    const storeIds = [...new Set(exploreData.map(r => r.store_id).filter(Boolean))];
    const channels = [...new Set(exploreData.map(r => r.channel).filter(Boolean))];
    const engagementModes = [...new Set(exploreData.map(r => r.engagement_mode).filter(Boolean))];
    
    res.json({
      brands: ['any', ...brands],
      owners: ['any', ...owners],
      franchiseIds: ['any', ...franchiseIds],
      storeIds: ['any', ...storeIds],
      channels: ['any', ...channels],
      engagementModes: ['any', ...engagementModes],
      callDates: ['any', 'previous_day', 'last_7_days', 'last_30_days', 'custom']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/overview
app.get('/api/overview', requireAuth, (req, res) => {
  try {
    const filters = req.query;
    const hourlyData = readCSV('overview_hourly.csv');
    let storeData = readCSV('overview_store.csv');
    
    // Apply filters to store data where possible
    storeData = applyFilters(storeData, filters);
    
    // Aggregate hourly data (apply multiplier based on brand filter for demo)
    const brandMultiplier = filters.brand && filters.brand !== 'any' ? 0.8 + (filters.brand.charCodeAt(0) % 5) * 0.1 : 1;
    const timeSeries = {};
    hourlyData.forEach(row => {
      const hour = row.hour;
      Object.keys(row).forEach(key => {
        if (key !== 'hour') {
          if (!timeSeries[key]) timeSeries[key] = [];
          const baseValue = parseFloat(row[key]) || 0;
          // Apply slight variation based on brand filter for demo purposes
          const adjustedValue = key === 'total_sessions' || key === 'relevant_conversations' || key === 'pickup_orders' 
            ? baseValue * brandMultiplier 
            : baseValue;
          timeSeries[key].push({ x: hour, y: adjustedValue });
        }
      });
    });
    
    // Calculate KPIs from latest hour or aggregate (with brand adjustment)
    const latestHour = hourlyData[hourlyData.length - 1];
    const baseSessions = (latestHour?.total_sessions || 0) * brandMultiplier;
    const baseConversations = (latestHour?.relevant_conversations || 0) * brandMultiplier;
    const basePickup = (latestHour?.pickup_orders || 0) * brandMultiplier;
    
    const kpisVolume = [
      { id: 'total_sessions', label: 'Total Sessions', value: Math.round(baseSessions) },
      { id: 'relevant_conversations', label: 'Relevant Conversations', value: Math.round(baseConversations) },
      { id: 'pickup_orders', label: 'Pickup Orders', value: Math.round(basePickup) },
      { id: 'order_handle_time', label: 'Order Handle Time', value: latestHour?.order_handle_time || 0, suffix: ' mins', decimals: 1 },
      { id: 'average_check', label: 'Average Check', value: latestHour?.average_check || 0, suffix: '$', decimals: 2 },
    ];
    
    // Read level comparison data (apply slight variation based on filters)
    const levelCompareData = readCSV('overview_level_compare.csv');
    const brandFranchiseStoreCompare = levelCompareData.map(row => {
      const baseBrand = parseFloat(row.brand_value) || 0;
      const baseFranchise = parseFloat(row.franchisee_value) || 0;
      const baseStore = parseFloat(row.store_value) || 0;
      
      // Apply variation based on brand filter for demo
      const brandAdjust = filters.brand && filters.brand !== 'any' ? (filters.brand.charCodeAt(0) % 10 - 5) * 0.5 : 0;
      
      return {
        id: row.metric_id,
        label: row.metric_label,
        unit: row.unit || undefined,
        brandValue: baseBrand + brandAdjust,
        franchiseeValue: baseFranchise + brandAdjust * 0.7,
        storeValue: baseStore + brandAdjust * 0.5,
      };
    });
    
    res.json({
      kpisVolume,
      kpisQuality: [], // Removed - these are now in brandFranchiseStoreCompare
      timeSeries,
      storeRows: storeData,
      brandFranchiseStoreCompare
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/journey-policy
app.get('/api/journey-policy', requireAuth, (req, res) => {
  try {
    const hourlyData = readCSV('journey_policy_hourly.csv');
    const storeData = readCSV('journey_policy_store.csv');
    
    const timeSeries = {};
    hourlyData.forEach(row => {
      const hour = row.hour;
      Object.keys(row).forEach(key => {
        if (key !== 'hour') {
          if (!timeSeries[key]) timeSeries[key] = [];
          timeSeries[key].push({ x: hour, y: parseFloat(row[key]) || 0 });
        }
      });
    });
    
    const latestHour = hourlyData[hourlyData.length - 1];
    const kpisTop = [
      { id: 'policy_adherence_rate', label: 'Policy Adherence Rate', value: latestHour?.policy_adherence_rate || 0, suffix: '%', decimals: 1 },
      { id: 'brand_greeting_pct', label: 'Brand Greeting %', value: latestHour?.brand_greeting_pct || 0, suffix: '%', decimals: 1 },
      { id: 'engaged_without_wait_pct', label: 'Engaged w/o wait %', value: latestHour?.engaged_without_wait_pct || 0, suffix: '%', decimals: 1 },
      { id: 'personalization_pct', label: 'Personalization %', value: latestHour?.personalization_pct || 0, suffix: '%', decimals: 1 },
    ];
    
    // Read level comparison data
    const levelCompareData = readCSV('journey_policy_level_compare.csv');
    const brandFranchiseStoreCompare = levelCompareData.map(row => ({
      id: row.metric_id,
      label: row.metric_label,
      unit: row.unit || undefined,
      brandValue: parseFloat(row.brand_value) || 0,
      franchiseeValue: parseFloat(row.franchisee_value) || 0,
      storeValue: parseFloat(row.store_value) || 0,
    }));
    
    res.json({
      kpisTop: [], // Removed - now in brandFranchiseStoreCompare
      kpisCheckIn: [], // Removed - now in brandFranchiseStoreCompare
      timeSeries,
      storeRows: storeData,
      brandFranchiseStoreCompare
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sales-upsell
app.get('/api/sales-upsell', requireAuth, (req, res) => {
  try {
    const hourlyData = readCSV('sales_upsell_hourly.csv');
    const storeData = readCSV('sales_upsell_store.csv');
    const greetingItems = readCSV('sales_upsell_items_greeting.csv');
    const cartItems = readCSV('sales_upsell_items_cart.csv');
    const upsizeItems = readCSV('sales_upsell_items_upsize.csv');
    
    const timeSeries = {};
    hourlyData.forEach(row => {
      const hour = row.hour;
      Object.keys(row).forEach(key => {
        if (key !== 'hour') {
          if (!timeSeries[key]) timeSeries[key] = [];
          timeSeries[key].push({ x: hour, y: parseFloat(row[key]) || 0 });
        }
      });
    });
    
    // Read level comparison data
    const levelCompareData = readCSV('sales_upsell_level_compare.csv');
    const brandFranchiseStoreCompare = levelCompareData.map(row => ({
      id: row.metric_id,
      label: row.metric_label,
      unit: row.unit || undefined,
      brandValue: parseFloat(row.brand_value) || 0,
      franchiseeValue: parseFloat(row.franchisee_value) || 0,
      storeValue: parseFloat(row.store_value) || 0,
    }));
    
    res.json({
      kpis: [], // Removed - now in brandFranchiseStoreCompare
      timeSeries,
      greetingItems,
      cartItems,
      upsizeItems,
      storeRows: storeData,
      brandFranchiseStoreCompare
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/friendliness
app.get('/api/friendliness', requireAuth, (req, res) => {
  try {
    const hourlyData = readCSV('friendliness_hourly.csv');
    const storeData = readCSV('friendliness_store.csv');
    const distribution = readCSV('friendliness_distribution.csv');
    
    const timeSeries = {};
    hourlyData.forEach(row => {
      const hour = row.hour;
      Object.keys(row).forEach(key => {
        if (key !== 'hour') {
          if (!timeSeries[key]) timeSeries[key] = [];
          timeSeries[key].push({ x: hour, y: parseFloat(row[key]) || 0 });
        }
      });
    });
    
    // Read level comparison data
    const levelCompareData = readCSV('friendliness_level_compare.csv');
    const brandFranchiseStoreCompare = levelCompareData.map(row => ({
      id: row.metric_id,
      label: row.metric_label,
      unit: row.unit || undefined,
      brandValue: parseFloat(row.brand_value) || 0,
      franchiseeValue: parseFloat(row.franchisee_value) || 0,
      storeValue: parseFloat(row.store_value) || 0,
    }));
    
    res.json({
      kpis: [], // Removed - now in brandFranchiseStoreCompare
      timeSeries,
      distribution,
      storeRows: storeData,
      brandFranchiseStoreCompare
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/alerts
app.get('/api/alerts', requireAuth, (req, res) => {
  try {
    const hourlyData = readCSV('alerts_hourly.csv');
    const callsData = readCSV('alerts_calls.csv');
    
    const timeSeries = {};
    hourlyData.forEach(row => {
      const hour = row.hour;
      Object.keys(row).forEach(key => {
        if (key !== 'hour') {
          if (!timeSeries[key]) timeSeries[key] = [];
          timeSeries[key].push({ x: hour, y: parseFloat(row[key]) || 0 });
        }
      });
    });
    
    // Aggregate counts
    const counts = {
      disrespectful_language: callsData.filter(r => r.disrespectful_language === 'Yes').length,
      unfriendly_tone: callsData.filter(r => r.unfriendly_tone === 'Yes').length,
      repeated_mistakes: callsData.filter(r => r.repeated_mistakes === 'Yes').length,
      missed_allergy_disclosure: callsData.filter(r => r.missed_allergy_disclosure === 'Yes').length,
      item_unavailability: callsData.filter(r => r.item_unavailability === 'Yes').length,
      discount_requested: callsData.filter(r => r.discount_requested === 'Yes').length,
      coupon_mentioned: callsData.filter(r => r.coupon_mentioned === 'Yes').length,
      guest_complaint: callsData.filter(r => r.guest_complaint === 'Yes').length,
      price_objection: callsData.filter(r => r.price_objection === 'Yes').length,
      ideal_conversations: callsData.filter(r => 
        r.disrespectful_language === 'No' && 
        r.unfriendly_tone === 'No' && 
        r.repeated_mistakes === 'No'
      ).length,
    };
    
    // Read level comparison data
    const levelCompareData = readCSV('alerts_level_compare.csv');
    const brandFranchiseStoreCompare = levelCompareData.map(row => ({
      id: row.metric_id,
      label: row.metric_label,
      unit: row.unit || undefined,
      brandValue: parseFloat(row.brand_value) || 0,
      franchiseeValue: parseFloat(row.franchisee_value) || 0,
      storeValue: parseFloat(row.store_value) || 0,
    }));
    
    res.json({
      kpisTop: [], // Removed - now in brandFranchiseStoreCompare
      kpisSecond: [], // Removed - now in brandFranchiseStoreCompare
      timeSeries,
      callRows: callsData,
      brandFranchiseStoreCompare
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/explore
app.get('/api/explore', requireAuth, (req, res) => {
  try {
    const { page = 1, pageSize = 50 } = req.query;
    const allData = readCSV('explore_calls.csv');
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    
    res.json({
      rows: allData.slice(start, end),
      total: allData.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/compare
app.get('/api/compare', requireAuth, (req, res) => {
  try {
    const { metric, segmentA, segmentB, segmentC } = req.query;
    const allData = readCSV('explore_calls.csv');
    
    // Parse segment filters (simplified - in real app would parse JSON)
    const parseSegment = (segmentStr) => {
      if (!segmentStr || segmentStr === '{}') return {};
      try {
        return JSON.parse(segmentStr);
      } catch {
        return {};
      }
    };
    
    const filtersA = parseSegment(segmentA);
    const filtersB = parseSegment(segmentB);
    const filtersC = parseSegment(segmentC);
    
    // Filter data for each segment
    const segmentAData = applyFilters(allData, filtersA);
    const segmentBData = applyFilters(allData, filtersB);
    const segmentCData = applyFilters(allData, filtersC);
    
    // Aggregate by hour
    const aggregateByHour = (data, metricKey) => {
      const hourly = {};
      data.forEach(row => {
        const hour = row.call_datetime ? row.call_datetime.substring(11, 13) : '00';
        if (!hourly[hour]) hourly[hour] = { sum: 0, count: 0 };
        hourly[hour].sum += parseFloat(row[metricKey]) || 0;
        hourly[hour].count += 1;
      });
      return Object.keys(hourly).sort().map(hour => ({
        x: hour.padStart(2, '0') + ':00',
        y: hourly[hour].count > 0 ? hourly[hour].sum / hourly[hour].count : 0
      }));
    };
    
    const seriesA = aggregateByHour(segmentAData, metric);
    const seriesB = aggregateByHour(segmentBData, metric);
    const seriesC = aggregateByHour(segmentCData, metric);
    
    res.json({
      series: [
        { segmentLabel: 'Segment A', data: seriesA },
        { segmentLabel: 'Segment B', data: seriesB },
        { segmentLabel: 'Segment C', data: seriesC },
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = join(__dirname, "client-build");
  
  app.use(express.static(clientBuildPath));
  
  // For any non-API route, send index.html so React Router works
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(join(clientBuildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

