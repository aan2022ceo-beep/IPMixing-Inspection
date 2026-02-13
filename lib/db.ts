import { sql } from '@neondatabase/serverless';

export const db = sql;

// Helper functions for database operations
export async function getInspections() {
  const result = await db`SELECT * FROM inspections ORDER BY created_at DESC`;
  return result.rows;
}

export async function getInspectionById(id: string) {
  const result = await db`SELECT * FROM inspections WHERE id = ${id}`;
  return result.rows[0];
}

export async function createInspection(inspection: any) {
  const result = await db`
    INSERT INTO inspections (
      equipment_id, location, shift, date, inspector_name, status
    ) VALUES (
      ${inspection.equipment_id},
      ${inspection.location},
      ${inspection.shift},
      ${inspection.date},
      ${inspection.inspector_name},
      ${inspection.status || 'Open'}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateInspection(id: string, updates: any) {
  const setClauses = Object.entries(updates)
    .map(([key, value]) => `${key} = ${sql([value])}`)
    .join(', ');
  
  const result = await db`UPDATE inspections SET ${sql(setClauses)} WHERE id = ${id} RETURNING *`;
  return result.rows[0];
}

export async function deleteInspection(id: string) {
  await db`DELETE FROM inspections WHERE id = ${id}`;
}

export async function getCategories(inspectionId: string) {
  const result = await db`SELECT * FROM categories WHERE inspection_id = ${inspectionId} ORDER BY created_at DESC`;
  return result.rows;
}

export async function createCategory(category: any) {
  const result = await db`
    INSERT INTO categories (inspection_id, name, level)
    VALUES (${category.inspection_id}, ${category.name}, ${category.level})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getAbnormalData(inspectionId: string) {
  const result = await db`SELECT * FROM abnormal_data WHERE inspection_id = ${inspectionId}`;
  return result.rows;
}

export async function createAbnormalData(data: any) {
  const result = await db`
    INSERT INTO abnormal_data (inspection_id, category_id, item, deviation, description, frequency, duration)
    VALUES (${data.inspection_id}, ${data.category_id}, ${data.item}, ${data.deviation}, ${data.description}, ${data.frequency}, ${data.duration})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getFiveM(inspectionId: string) {
  const result = await db`SELECT * FROM five_m WHERE inspection_id = ${inspectionId}`;
  return result.rows;
}

export async function createFiveM(analysis: any) {
  const result = await db`
    INSERT INTO five_m (inspection_id, man, method, machine, material, environment, immediate_action)
    VALUES (${analysis.inspection_id}, ${analysis.man}, ${analysis.method}, ${analysis.machine}, ${analysis.material}, ${analysis.environment}, ${analysis.immediate_action})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getPhotos(inspectionId: string) {
  const result = await db`SELECT * FROM photos WHERE inspection_id = ${inspectionId} ORDER BY created_at DESC`;
  return result.rows;
}

export async function createPhoto(photo: any) {
  const result = await db`
    INSERT INTO photos (inspection_id, description, image_base64)
    VALUES (${photo.inspection_id}, ${photo.description}, ${photo.image_base64})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getMaintenanceRecords(inspectionId: string) {
  const result = await db`SELECT * FROM maintenance_records WHERE inspection_id = ${inspectionId}`;
  return result.rows;
}

export async function createMaintenanceRecord(record: any) {
  const result = await db`
    INSERT INTO maintenance_records (
      inspection_id, task, priority, assigned_to, status, due_date, completion_date, notes
    ) VALUES (
      ${record.inspection_id},
      ${record.task},
      ${record.priority},
      ${record.assigned_to},
      ${record.status || 'Open'},
      ${record.due_date},
      ${record.completion_date},
      ${record.notes}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateMaintenanceRecord(id: string, updates: any) {
  const fields = Object.entries(updates)
    .map(([key, value]) => `${key} = ${sql([value])}`)
    .join(', ');
  
  const result = await db`UPDATE maintenance_records SET ${sql(fields)} WHERE id = ${id} RETURNING *`;
  return result.rows[0];
}
