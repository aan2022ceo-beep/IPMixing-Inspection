-- IP Mixing Digital Inspection Database Schema

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  shift VARCHAR(50) NOT NULL,
  inspector VARCHAR(255) NOT NULL,
  machine VARCHAR(50),
  floor VARCHAR(10),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  type VARCHAR(255),
  description TEXT,
  workflow_stage VARCHAR(50),
  priority VARCHAR(50) CHECK (priority IN ('high', 'medium', 'low')),
  quality_impact VARCHAR(50),
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inspection_categories table
CREATE TABLE IF NOT EXISTS inspection_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  category_id VARCHAR(50) NOT NULL,
  findings TEXT,
  risk_level VARCHAR(50) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  machine VARCHAR(50),
  floor VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create category_checkpoints table
CREATE TABLE IF NOT EXISTS category_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES inspection_categories(id) ON DELETE CASCADE,
  checkpoint_name VARCHAR(255) NOT NULL,
  is_checked BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create abnormal_data table
CREATE TABLE IF NOT EXISTS abnormal_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  process_type VARCHAR(255),
  workflow_stage VARCHAR(50),
  priority VARCHAR(50),
  quality_impact VARCHAR(50),
  verification TEXT,
  validation TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create five_m_analysis table
CREATE TABLE IF NOT EXISTS five_m_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abnormal_id UUID NOT NULL REFERENCES abnormal_data(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('man', 'machine', 'method', 'material', 'environment')),
  analysis_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name VARCHAR(255),
  type VARCHAR(50) CHECK (type IN ('camera', 'gallery')),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create machine_maintenance table
CREATE TABLE IF NOT EXISTS machine_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  estimated_time_minutes INTEGER,
  actual_time_minutes INTEGER,
  technician_name VARCHAR(255),
  technician_notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance_checklist table
CREATE TABLE IF NOT EXISTS maintenance_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID NOT NULL REFERENCES machine_maintenance(id) ON DELETE CASCADE,
  checklist_item VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create replaced_parts table
CREATE TABLE IF NOT EXISTS replaced_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID NOT NULL REFERENCES machine_maintenance(id) ON DELETE CASCADE,
  part_id VARCHAR(100),
  part_name VARCHAR(255) NOT NULL,
  unit VARCHAR(50),
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_inspections_date ON inspections(date);
CREATE INDEX idx_inspections_shift ON inspections(shift);
CREATE INDEX idx_inspections_inspector ON inspections(inspector);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_severity ON inspections(severity);
CREATE INDEX idx_inspection_categories_inspection ON inspection_categories(inspection_id);
CREATE INDEX idx_abnormal_data_inspection ON abnormal_data(inspection_id);
CREATE INDEX idx_photos_inspection ON photos(inspection_id);
CREATE INDEX idx_machine_maintenance_inspection ON machine_maintenance(inspection_id);
