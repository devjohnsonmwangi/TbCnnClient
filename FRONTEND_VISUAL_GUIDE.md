# E-Afya Frontend - Visual Component Guide

## 🎬 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                      LANDING PAGE (/)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  🔝 [Navigation Bar - E-Afya | Features | Models | About]          │
│                                                                       │
│  ╔═══════════════════════════════════════════════════════════╗     │
│  ║  💡 Healthcare AI Powered By Innovation                  ║     │
│  ║                                                           ║     │
│  ║  Early Disease Detection Powered by AI                   ║     │
│  ║                                                           ║     │
│  ║  Upload your X-rays and get intelligent, AI-powered     ║     │
│  ║  analysis for TB, Pneumonia, Lung Cancer, Bone Fr...    ║     │
│  ║                                                           ║     │
│  ║  [🚀 START DIAGNOSIS] [Learn More]                       ║     │
│  ║                                                           ║     │
│  ║  ✓ HIPAA Compliant                                       ║     │
│  ║  ✓ 99.2% Accuracy                                        ║     │
│  ║  ✓ Real-time Results                                     ║     │
│  ╚═══════════════════════════════════════════════════════════╝     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Why Choose E-Afya?                                          │   │
│  │                                                             │   │
│  │ [⚡Lightning Fast] [🔒 Highly Accurate] [📊Interpretable]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Supported Conditions                                        │   │
│  │                                                             │   │
│  │ ┌──────────────┐  ┌──────────────┐                         │   │
│  │ │ 🫁 TB        │  │ 💨 Pneumonia │                         │   │
│  │ │ Detection    │  │ Detection    │                         │   │
│  │ └──────────────┘  └──────────────┘                         │   │
│  │                                                             │   │
│  │ ┌──────────────┐  ┌──────────────┐                         │   │
│  │ │ 🧬 Lung Can. │  │ 🦴 Bone Fr.  │                         │   │
│  │ │ Classification  │ Detection    │                         │   │
│  │ └──────────────┘  └──────────────┘                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  [🎯 Ready to Get Started?] → Redirects to /patient-intake         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                     User clicks "Start"
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│               PATIENT INTAKE FORM (/patient-intake)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [← Back to Home]                                                   │
│                                                                       │
│  Patient Intake Form                                                │
│  Step 1 of 3 - Personal Information                                │
│  [████░░░░░░░░░░░░░░░░░] 33%                                       │
│                                                                       │
│  ╔═════════════════════════════════════════════════════════════╗   │
│  ║  Step 1: Personal Information                              ║   │
│  ║                                                             ║   │
│  ║  First Name*      │  Last Name*                            ║   │
│  ║  [John        ]   │  [Doe           ]                      ║   │
│  ║                                                             ║   │
│  ║  Email Address*: [john@example.com              ]           ║   │
│  ║                                                             ║   │
│  ║  Age*         │  Gender*                                   ║   │
│  ║  [30      ]   │  [Select ▼]                               ║   │
│  ║                                                             ║   │
│  ║  Medical History (Optional)                                ║   │
│  ║  [Previous illnesses, surgeries, or relevant...           ]║   │
│  ║  [                                                         ]║   │
│  ║                                                             ║   │
│  ║                              [← Previous] [Next →] [ 50% ]║   │
│  ╚═════════════════════════════════════════════════════════════╝   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    Next → Step 2
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│               PATIENT INTAKE FORM (/patient-intake)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Patient Intake Form                                                │
│  Step 2 of 3 - Medical Details                                     │
│  [█████████░░░░░░░░░░░░░░░░░│] 66%                                 │
│                                                                       │
│  ╔═════════════════════════════════════════════════════════════╗   │
│  ║  Step 2: Medical Details                                   ║   │
│  ║                                                             ║   │
│  ║  Select Condition Type*                                    ║   │
│  ║                                                             ║   │
│  ║  ┌─────────────┐  ┌─────────────┐                         ║   │
│  ║  │ 🫁 TB       │  │ 💨 Pneumonia│                         ║   │
│  ║  └─────────────┘  └─────────────┘                         ║   │
│  ║  ┌─────────────┐  ┌─────────────┐                         ║   │
│  ║  │ 🧬 Lung Can.│  │ 🦴 Bone Fr. │                         ║   │
│  ║  └─────────────┘  └─────────────┘                         ║   │
│  ║                                                             ║   │
│  ║  Describe Your Symptoms*                                   ║   │
│  ║  [Please describe any symptoms you are experiencing...   ]║   │
│  ║  [                                                         ]║   │
│  ║  [                                                         ]║   │
│  ║                                                             ║   │
│  ║                              [← Previous] [Next →]        ║   │
│  ╚═════════════════════════════════════════════════════════════╝   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    Next → Step 3
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│               PATIENT INTAKE FORM (/patient-intake)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Patient Intake Form                                                │
│  Step 3 of 3 - X-ray Upload                                        │
│  [███████████████████████░] 100%                                    │
│                                                                       │
│  ╔═════════════════════════════════════════════════════════════╗   │
│  ║  Step 3: Upload X-ray Images                               ║   │
│  ║                                                             ║   │
│  ║  ╔────────────────────────────────────────────────────╗    ║   │
│  ║  ║  🚀 Drag and Drop Your X-rays                      ║    ║   │
│  ║  ║                                                    ║    ║   │
│  ║  ║  Drag your X-ray images here or [browse]          ║    ║   │
│  ║  ║                                                    ║    ║   │
│  ║  ║  ✓ Supported: JPEG, PNG, WebP                     ║    ║   │
│  ║  ║  ✓ Max size: 10MB                                 ║    ║   │
│  ║  ║  ✓ Up to 5 images                                 ║    ║   │
│  ║  ╚────────────────────────────────────────────────────╝    ║   │
│  ║                                                             ║   │
│  ║  Selected Files (3/5)                                      ║   │
│  ║  ┌──────────┐  ┌──────────┐  ┌──────────┐                 ║   │
│  ║  │ [Preview]│  │ [Preview]│  │ [Preview]│                 ║   │
│  ║  │ X-ray1   │  │ X-ray2   │  │ X-ray3   │                 ║   │
│  ║  │ 2.5 MB   │  │ 3.1 MB   │  │ 1.8 MB   │                 ║   │
│  ║  └──────────┘  └──────────┘  └──────────┘                 ║   │
│  ║                                                             ║   │
│  ║  ⚠️ Important Disclaimer:                                  ║   │
│  ║  This system is NOT a substitute for professional medical ║   │
│  ║  evaluation. Always consult qualified healthcare...       ║   │
│  ║                                                             ║   │
│  ║  ☐ I understand this tool and consent to use it...       ║   │
│  ║                                                             ║   │
│  ║                              [← Previous] [✓ Submit & Analyze]║   │
│  ╚═════════════════════════════════════════════════════════════╝   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                       Submit Form
                              ↓
              API: Create Patient + Upload Images
                              ↓
                    Polling: Get Job Status
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│              DIAGNOSTIC RESULTS (/results)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [← New Analysis] [🏠 Home]                                         │
│                                                                       │
│  ╔═════════════════════════════════════════════════════════════╗   │
│  ║         ✓ Analysis Complete                               ║   │
│  ║   Your AI-powered diagnostic report is ready              ║   │
│  ║                                                             ║   │
│  ║  ┌───────────────────┐  ┌───────────────────┐             ║   │
│  ║  │ ⚠️ TB Detection    │  │ Diagnostic         │             ║   │
│  ║  │                   │  │ Confidence         │             ║   │
│  ║  │ POSITIVE          │  │                    │             ║   │
│  ║  │                   │  │ 92.3%              │             ║   │
│  ║  │ Signs of TB were  │  │ ████████░          │             ║   │
│  ║  │ detected in the   │  │                    │             ║   │
│  ║  │ imaging           │  │ The AI model is    │             ║   │
│  ║  │                   │  │ 92.3% confident    │             ║   │
│  ║  └───────────────────┘  └───────────────────┘             ║   │
│  ║                                                             ║   │
│  ║  ┌───────────────────────────────────────────┐             ║   │
│  ║  │ ⚠️ Risk Level Assessment                  │             ║   │
│  ║  │ High Risk                                  │             ║   │
│  ║  │ Medical evaluation should be sought        │             ║   │
│  ║  │ urgently                                   │             ║   │
│  ║  └───────────────────────────────────────────┘             ║   │
│  ║                                                             ║   │
│  ║  Affected Areas Identified                                ║   │
│  ║  ┌────────────────────┐  ┌────────────────────┐            ║   │
│  ║  │ 📍 Upper Right Lobe│  │ 📍 Middle Lobe     │            ║   │
│  ║  │ Lung region showing│  │ Lung region showing│            ║   │
│  ║  │ potential abnormal.│  │ potential abnormal.│            ║   │
│  ║  └────────────────────┘  └────────────────────┘            ║   │
│  ║  ┌────────────────────┐                                     ║   │
│  ║  │ 📍 Bronchi Inflamm.│                                     ║   │
│  ║  │ Lung region showing│                                     ║   │
│  ║  │ potential abnormal.│                                     ║   │
│  ║  └────────────────────┘                                     ║   │
│  ║                                                             ║   │
│  ║  Heatmap Analysis                                          ║   │
│  ║  ┌───────────────────────────────────────────┐             ║   │
│  ║  │ [Grad-CAM Heatmap Visualization]          │             ║   │
│  ║  │ [Showing affected regions in red/yellow]  │             ║   │
│  ║  └───────────────────────────────────────────┘             ║   │
│  ║                                                             ║   │
│  ║  💡 Medical Recommendations                               ║   │
│  ║  ✓ Immediate consultation with pulmonologist              ║   │
│  ║  ✓ Chest CT scan for detailed examination                 ║   │
│  ║  ✓ Sputum test to confirm TB diagnosis                    ║   │
│  ║  ✓ Initiate appropriate antimicrobial therapy             ║   │
│  ║  ✓ Isolation precautions if confirmed positive            ║   │
│  ║                                                             ║   │
│  ║  🚀 Next Steps                                             ║   │
│  ║  1. Schedule appointment with healthcare provider...      ║   │
│  ║  2. Bring medical records and imaging results              ║   │
│  ║  3. Prepare list of current medications and allergies     ║   │
│  ║  4. Follow up testing as recommended by physician          ║   │
│  ║                                                             ║   │
│  ║  ⚠️ Important Disclaimer                                   ║   │
│  ║  This AI-assisted analysis is for informational purposes  ║   │
│  ║  only and should not be considered definitive diagnosis... ║   │
│  ║                                                             ║   │
│  ╚═════════════════════════════════════════════════════════════╝   │
│                                                                       │
│  ╔═════════════════════════════════════════════════════════════╗   │
│  ║                    Report Actions                          ║   │
│  ║                                                             ║   │
│  ║  [🖨️ Print Report] [⬇️ Download Report] [+ New Analysis]   ║   │
│  ║                                                             ║   │
│  ╚═════════════════════════════════════════════════════════════╝   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 Component Color Coding

### Landing Page
```
Hero Section:      Emerald to Teal gradient with white text
Features:          Emerald, Blue, Purple cards with icons
CTA Section:       Emerald/Teal with white text
```

### Patient Intake Form
```
Progress Bar:      Emerald to Teal gradient
Active Step:       Emerald with bg-emerald-50
Input Focus:       Emerald-600 border
Error Fields:      Red-500 border with red error text
Success:           Emerald-600 checkmark
```

### X-ray Upload
```
Drag Zone:         Gray to Emerald on hover
Upload Icon:       Emerald-600 in emerald-100 circle
Files:             Green checkmark, gray border
Remove Button:     Red-600 hover background
```

### Results Page
```
Positive Detection: Red-50 background, red icons
Negative Detection: Green-50 background, green icons
Confidence:        Blue card with progress bar
High Risk:         Orange background, orange border
Critical Risk:     Red background, red border
Recommendations:   Blue-50 background
Next Steps:        Emerald-50 background
```

## 📐 Responsive Breakpoints

```
Mobile    (320px - 640px)   → Single column, stacked layouts
Tablet    (640px - 1024px)  → Two column grids
Desktop   (1024px+)          → Three column + full width
```

## 🔄 State Transitions

```
Landing → Start → Patient Intake (Step 1 → 2 → 3) → Submit → Results
  ↓
Home ←─────────────────────────────────────────────────────────↓
  ↓
New Analysis ←──────────────────────────────────── Results page
```

## 🎬 Animation Effects

- **Fade In**: Step transitions in form (animate-fadeIn)
- **Pulse**: Hero background elements (animate-pulse)
- **Spin**: Loading spinner on results page
- **Translate**: Hover effects on buttons (-translate-y-1)
- **Grow**: Card shadows on hover (hover:shadow-lg)

---

This visual guide helps understanding the complete user interface flow and design system of the E-Afya application.
