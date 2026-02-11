# IP. Mixing Digital Inspection

Abnormal Process Program - Digital Inspection Management System

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to project folder:
```bash
cd vercel-deploy
```

3. Install dependencies:
```bash
npm install
```

4. Deploy:
```bash
vercel
```

### Option 2: Deploy via GitHub

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect React and deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Upload this folder directly
4. Vercel will handle the rest

## 📱 Features

- ✅ New Inspection with form validation
- ✅ Status workflow: Open → In Progress → Closed
- ✅ Priority levels (High/Medium/Low)
- ✅ 5M Root Cause Analysis
- ✅ Photo evidence upload
- ✅ Export to Excel
- ✅ Analytics Dashboard
- ✅ History with detail view
- ✅ Responsive design (Mobile/Tablet/Desktop)
- ✅ LocalStorage persistence

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📂 Project Structure

```
vercel-deploy/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── SafetyInspectionApp.jsx
├── package.json
├── vercel.json
└── README.md
```

## 📝 Status Flow

```
NEW INSPECTION
      │
      ▼
┌─────────────┐     ┌─────────────┐
│  🔴 OPEN    │ or  │  🟡 PENDING │
│ High/Critical│     │  Medium/Low │
└──────┬──────┘     └──────┬──────┘
       │                    │
       └────────┬───────────┘
                │
                ▼ 🔧 Start Work
        ┌───────────────┐
        │  🔵 IN        │
        │   PROGRESS    │
        └───────┬───────┘
                │
                ▼ ✅ Mark Complete
        ┌───────────────┐
        │  🟢 CLOSED    │
        └───────────────┘
```

## 📊 Ticket ID Format

`Mix-DD/MM/YY-XXX`

Example: `Mix-10/02/25-042`

---

Built with React ⚛️
