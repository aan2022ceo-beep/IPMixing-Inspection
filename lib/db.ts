import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper functions for database operations
export async function getInspections() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM inspections ORDER BY created_at DESC');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getInspectionById(id: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM inspections WHERE id = $1', [id]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function createInspection(inspection: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO inspections (
        equipment_id, location, shift, date, inspector_name, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
      RETURNING *`,
      [
        inspection.equipment_id,
        inspection.location,
        inspection.shift,
        inspection.date,
        inspection.inspector_name,
        inspection.status || 'Open'
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateInspection(id: string, updates: any) {
  const client = await pool.connect();
  try {
    const entries = Object.entries(updates);
    const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const values = [...entries.map(([, value]) => value), id];
    
    const result = await client.query(
      `UPDATE inspections SET ${setClauses} WHERE id = $${entries.length + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function deleteInspection(id: string) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM inspections WHERE id = $1', [id]);
  } finally {
    client.release();
  }
}

export async function getCategories(inspectionId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM categories WHERE inspection_id = $1 ORDER BY created_at DESC', [inspectionId]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createCategory(category: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO categories (inspection_id, name, level) VALUES ($1, $2, $3) RETURNING *',
      [category.inspection_id, category.name, category.level]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getAbnormalData(inspectionId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM abnormal_data WHERE inspection_id = $1', [inspectionId]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createAbnormalData(data: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO abnormal_data (inspection_id, category_id, item, deviation, description, frequency, duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.inspection_id, data.category_id, data.item, data.deviation, data.description, data.frequency, data.duration]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getFiveM(inspectionId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM five_m WHERE inspection_id = $1', [inspectionId]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createFiveM(analysis: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO five_m (inspection_id, man, method, machine, material, environment, immediate_action)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [analysis.inspection_id, analysis.man, analysis.method, analysis.machine, analysis.material, analysis.environment, analysis.immediate_action]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getPhotos(inspectionId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM photos WHERE inspection_id = $1 ORDER BY created_at DESC', [inspectionId]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createPhoto(photo: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO photos (inspection_id, description, image_base64) VALUES ($1, $2, $3) RETURNING *',
      [photo.inspection_id, photo.description, photo.image_base64]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getMaintenanceRecords(inspectionId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM maintenance_records WHERE inspection_id = $1', [inspectionId]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createMaintenanceRecord(record: any) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO maintenance_records (
        inspection_id, task, priority, assigned_to, status, due_date, completion_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        record.inspection_id,
        record.task,
        record.priority,
        record.assigned_to,
        record.status || 'Open',
        record.due_date,
        record.completion_date,
        record.notes
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateMaintenanceRecord(id: string, updates: any) {
  const client = await pool.connect();
  try {
    const entries = Object.entries(updates);
    const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const values = [...entries.map(([, value]) => value), id];
    
    const result = await client.query(
      `UPDATE maintenance_records SET ${setClauses} WHERE id = $${entries.length + 1} RETURNING *`,
      values
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}
