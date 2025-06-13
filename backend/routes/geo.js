const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Whitelist untuk keamanan
const allowedSchemas = ['gis', 'public'];
const allowedTables = ['bangunan', 'jalan', 'kecamatan'];
const allowedPublicTables = ['Apartemen', 'Rusun', 'CIP_POINT', 'CIP_LINE']; // yang boleh diakses publik

// Fungsi query
async function getGeoJSON(schema, table) {
  const result = await pool.query(`
    SELECT jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(ST_AsGeoJSON(t)::jsonb)
    )
    FROM (
      SELECT *, ST_Transform(geom, 4326) AS geom
      FROM ${schema}."${table}"
    ) t;
  `);
  return result.rows[0]?.jsonb_build_object || {
    type: 'FeatureCollection',
    features: []
  };
}

/////////////////////////////////////////////////
// PROTECTED: butuh token
router.get('/geojson/:schema/:table', auth, async (req, res) => {
  const { schema, table } = req.params;

  if (!allowedSchemas.includes(schema) || !allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid schema or table' });
  }

  try {
    const data = await getGeoJSON(schema, table);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/////////////////////////////////////////////////
// PUBLIC: tidak butuh token
router.get('/geojson-public/:schema/:table', async (req, res) => {
  const { schema, table } = req.params;

  if (schema !== 'public' || !allowedPublicTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid public schema or table' });
  }

  try {
    const data = await getGeoJSON(schema, table);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
