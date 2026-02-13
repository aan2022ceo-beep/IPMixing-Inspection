// Client-side data service for API calls
const API_BASE = '/api';

export const dataService = {
  // Inspections
  async getInspections() {
    const res = await fetch(`${API_BASE}/inspections`);
    if (!res.ok) throw new Error('Failed to fetch inspections');
    return res.json();
  },

  async getInspection(id: string) {
    const res = await fetch(`${API_BASE}/inspections/${id}`);
    if (!res.ok) throw new Error('Failed to fetch inspection');
    return res.json();
  },

  async createInspection(data: any) {
    const res = await fetch(`${API_BASE}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create inspection');
    return res.json();
  },

  async updateInspection(id: string, data: any) {
    const res = await fetch(`${API_BASE}/inspections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update inspection');
    return res.json();
  },

  async deleteInspection(id: string) {
    const res = await fetch(`${API_BASE}/inspections/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete inspection');
    return res.json();
  },

  // Categories
  async getCategories(inspectionId: string) {
    const res = await fetch(`${API_BASE}/categories?inspection_id=${inspectionId}`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(data: any) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  // Abnormal Data
  async getAbnormalData(inspectionId: string) {
    const res = await fetch(`${API_BASE}/abnormal-data?inspection_id=${inspectionId}`);
    if (!res.ok) throw new Error('Failed to fetch abnormal data');
    return res.json();
  },

  async createAbnormalData(data: any) {
    const res = await fetch(`${API_BASE}/abnormal-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create abnormal data');
    return res.json();
  },

  // 5M Analysis
  async getFiveM(inspectionId: string) {
    const res = await fetch(`${API_BASE}/five-m?inspection_id=${inspectionId}`);
    if (!res.ok) throw new Error('Failed to fetch 5M analysis');
    return res.json();
  },

  async createFiveM(data: any) {
    const res = await fetch(`${API_BASE}/five-m`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create 5M analysis');
    return res.json();
  },

  async updateFiveM(data: any) {
    const res = await fetch(`${API_BASE}/five-m`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update 5M analysis');
    return res.json();
  },

  // Photos
  async getPhotos(inspectionId: string) {
    const res = await fetch(`${API_BASE}/photos?inspection_id=${inspectionId}`);
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
  },

  async createPhoto(data: any) {
    const res = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create photo');
    return res.json();
  },

  // Maintenance Records
  async getMaintenanceRecords(inspectionId: string) {
    const res = await fetch(`${API_BASE}/maintenance?inspection_id=${inspectionId}`);
    if (!res.ok) throw new Error('Failed to fetch maintenance records');
    return res.json();
  },

  async createMaintenanceRecord(data: any) {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create maintenance record');
    return res.json();
  },

  async updateMaintenanceRecord(data: any) {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update maintenance record');
    return res.json();
  },
};
