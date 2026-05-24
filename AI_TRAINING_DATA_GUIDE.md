# 🤖 AI Training Data Guide - Repair Cases

**Date**: May 24, 2026  
**Purpose**: Insert 50 real repair cases for AI learning

---

## 📊 Overview

This guide explains how to insert training data into your database so the AI Repair Assistant can learn from real repair cases and provide better recommendations to technicians.

---

## 🎯 Data Flow

### **Sales Side** (Creates Repair Task):
- **Device Type**: e.g., Smartphone, Laptop, Television
- **Device Brand**: e.g., Samsung, Apple, HP
- **Device Model**: e.g., Galaxy A32, iPhone 11
- **Customer Issue (Symptoms)**: e.g., "Not charging", "No display"

### **Technician Side** (Completes Repair):
- **Diagnosis**: What was found and fixed
- **Repair Sentence**: Detailed repair actions taken
- **Result/Outcome**: SUCCESS, PARTIAL, or FAILED
- **Parts Used**: Components replaced
- **Duration**: Time taken to complete

### **AI Learning**:
The AI analyzes these completed cases to:
- Find similar past repairs
- Recommend solutions
- Predict required parts
- Estimate repair time
- Suggest diagnosis steps

---

## 📁 Files Created

### 1. SQL Script
**File**: `database_migrations/insert_training_repair_cases.sql`

Contains 50 real repair cases with:
- Device information (Type, Brand, Model)
- Customer symptoms
- Technician diagnosis
- Repair outcome
- Parts used
- Repair duration
- Difficulty level

---

## 🚀 How to Insert the Data

### Method 1: Using PostgreSQL Command Line

```bash
# Navigate to the migrations folder
cd "c:\Users\adidace\Documents\Courses\January$\FINAL_YEAR\smartfix (1)\database_migrations"

# Connect to PostgreSQL and run the script
psql -U postgres -d smartfix_db -f insert_training_repair_cases.sql
```

### Method 2: Using pgAdmin

1. Open pgAdmin
2. Connect to your `smartfix_db` database
3. Click **Tools** → **Query Tool**
4. Open the file: `insert_training_repair_cases.sql`
5. Click **Execute** (F5)

### Method 3: Using DBeaver

1. Open DBeaver
2. Connect to `smartfix_db`
3. Right-click on database → **SQL Editor** → **Open SQL Script**
4. Select `insert_training_repair_cases.sql`
5. Click **Execute SQL Statement** (Ctrl+Enter)

### Method 4: Copy-Paste

1. Open the SQL file in a text editor
2. Copy all the INSERT statements
3. Paste into your database query tool
4. Execute

---

## 📊 Data Statistics

### Device Types (50 cases):
- **Smartphones**: 20 cases (40%)
- **Laptops**: 15 cases (30%)
- **Televisions**: 8 cases (16%)
- **Desktop Computers**: 4 cases (8%)
- **Tablets**: 3 cases (6%)
- **Printers**: 4 cases (8%)

### Brands Covered:
- Samsung, Apple, HP, Dell, Lenovo, LG, Sony, Xiaomi, Asus, Acer, MSI, Oppo, Realme, Vivo, OnePlus, Huawei, Google, Motorola, Nokia, Tecno, Infinix, Itel, TCL, Hisense, Sharp, Panasonic, Toshiba, Canon, Epson, Brother, Amazon

### Outcomes:
- **SUCCESS**: 49 cases (98%)
- **PARTIAL**: 1 case (2%)

### Difficulty Levels:
- **EASY**: 18 cases (36%)
- **MEDIUM**: 20 cases (40%)
- **HARD**: 12 cases (24%)

### Common Issues:
- Charging problems (5 cases)
- Display issues (4 cases)
- Battery problems (3 cases)
- Audio/Speaker issues (3 cases)
- Overheating (3 cases)
- Network/Connectivity (3 cases)
- Power issues (3 cases)

---

## 🔍 Verification Queries

After inserting the data, run these queries to verify:

### Check Total Count
```sql
SELECT COUNT(*) as total_cases FROM repair_cases;
-- Expected: 50 (or more if you had existing data)
```

### Count by Device Type
```sql
SELECT device_type, COUNT(*) as count 
FROM repair_cases 
GROUP BY device_type 
ORDER BY count DESC;
```

### Count by Outcome
```sql
SELECT outcome, COUNT(*) as count 
FROM repair_cases 
GROUP BY outcome;
```

### Count by Difficulty
```sql
SELECT difficulty_level, COUNT(*) as count 
FROM repair_cases 
GROUP BY difficulty_level 
ORDER BY count DESC;
```

### View Recent Cases
```sql
SELECT device_type, device_brand, device_model, symptoms, outcome 
FROM repair_cases 
ORDER BY created_at DESC 
LIMIT 10;
```

### Average Repair Duration by Device Type
```sql
SELECT device_type, 
       AVG(repair_duration_minutes) as avg_duration,
       COUNT(*) as total_cases
FROM repair_cases 
GROUP BY device_type 
ORDER BY avg_duration DESC;
```

---

## 🤖 How AI Uses This Data

### 1. **Similar Case Matching**
When a technician enters symptoms like "Not charging", the AI searches for similar past cases:
```
Input: "Smartphone not charging"
AI Finds: 
- Samsung Galaxy A32: Replaced charging port
- Vivo Y20: Replaced charging flex
- Samsung Galaxy S20 FE: Replaced charging sub-board
```

### 2. **Diagnosis Prediction**
Based on device type and symptoms, AI suggests likely diagnoses:
```
Input: "Laptop overheating"
AI Suggests:
- Clean fan and apply thermal paste (HP EliteBook)
- Replace cooling fan (MSI GF63)
- Clean cooling system (Asus ROG Strix)
```

### 3. **Parts Prediction**
AI predicts which parts will likely be needed:
```
Input: "Smartphone battery draining fast"
AI Predicts: Battery (90% confidence)
```

### 4. **Time Estimation**
AI estimates repair duration based on similar cases:
```
Input: "Replace laptop screen"
AI Estimates: 60-75 minutes (based on past LCD replacements)
```

### 5. **Difficulty Assessment**
AI assesses repair complexity:
```
Input: "Replace TV backlight"
AI Assessment: HARD (100 minutes average)
```

---

## 📈 AI Learning Process

### Phase 1: Data Collection
- Sales creates repair task with symptoms
- Technician completes repair and records diagnosis
- Data stored in `repair_cases` table

### Phase 2: Feature Extraction
- AI extracts keywords from symptoms
- Analyzes device type, brand, model patterns
- Identifies common repair patterns

### Phase 3: Similarity Matching
- Uses Jaccard similarity for keyword matching
- Uses Cosine similarity for semantic matching
- Combines scores for ranking

### Phase 4: Recommendation Generation
- Finds top 5-10 similar cases
- Extracts common diagnoses
- Predicts required parts
- Estimates time and difficulty

---

## 🔧 Database Schema

The `repair_cases` table structure:

```sql
CREATE TABLE repair_cases (
    id BIGSERIAL PRIMARY KEY,
    device_type VARCHAR(255),
    device_brand VARCHAR(255),
    device_model VARCHAR(255),
    symptoms TEXT,              -- From sales (customer issue)
    diagnosis TEXT,             -- From technician (what was done)
    outcome VARCHAR(50),        -- SUCCESS, PARTIAL, FAILED
    parts_used TEXT,            -- Components replaced
    repair_duration_minutes INT,
    difficulty_level VARCHAR(20), -- EASY, MEDIUM, HARD
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 💡 Best Practices

### For Sales Representatives:
1. **Be Specific**: "Screen not working" → "Screen completely black, no backlight"
2. **Include Details**: "Battery issue" → "Battery drains in 2 hours, phone gets hot"
3. **Mention Patterns**: "WiFi drops every 5 minutes"
4. **Note Error Messages**: "Blue screen error 0x0000007B"

### For Technicians:
1. **Record Diagnosis**: What you found wrong
2. **Document Actions**: What you did to fix it
3. **List Parts**: All components replaced
4. **Note Duration**: Actual time spent
5. **Set Difficulty**: EASY, MEDIUM, or HARD
6. **Mark Outcome**: SUCCESS, PARTIAL, or FAILED

### For AI Accuracy:
- More data = Better recommendations
- Detailed symptoms = Better matching
- Consistent terminology = Better learning
- Regular updates = Current knowledge

---

## 🎯 Expected AI Improvements

After inserting this training data:

### Before (No Training Data):
- ❌ No similar cases found
- ❌ Generic recommendations
- ❌ No time estimates
- ❌ No parts predictions

### After (50 Training Cases):
- ✅ 5-10 similar cases per query
- ✅ Specific repair recommendations
- ✅ Accurate time estimates
- ✅ Parts predictions with confidence scores
- ✅ Difficulty assessments
- ✅ Success rate statistics

---

## 📊 Sample AI Output

### Input (from Sales):
```
Device: Smartphone
Brand: Samsung
Model: Galaxy A32
Symptoms: Not charging
```

### AI Output (to Technician):
```
🔍 Similar Cases Found: 3

1. Samsung Galaxy A32 - Not charging
   ✓ Replaced charging port and cleaned corrosion
   Parts: Charging port, Cleaning solution
   Duration: 45 minutes
   Difficulty: MEDIUM
   Outcome: SUCCESS

2. Samsung Galaxy S20 FE - Fast charging not working
   ✓ Replaced charging sub-board
   Parts: Charging sub-board
   Duration: 50 minutes
   Difficulty: MEDIUM
   Outcome: SUCCESS

3. Vivo Y20 - Microphone not working
   ✓ Replaced charging flex with microphone
   Parts: Charging flex
   Duration: 35 minutes
   Difficulty: MEDIUM
   Outcome: SUCCESS

📊 Predictions:
- Likely Issue: Charging port failure or corrosion
- Recommended Parts: Charging port (80% confidence)
- Estimated Time: 40-50 minutes
- Difficulty: MEDIUM
- Success Rate: 100% (based on similar cases)
```

---

## 🔄 Continuous Learning

### Adding More Data:
1. **Automatic**: When technicians complete repairs, data is automatically added
2. **Manual**: Import more cases using similar SQL scripts
3. **Bulk Import**: Use CSV import for large datasets

### Data Quality:
- Review and clean data periodically
- Remove duplicate cases
- Update outdated information
- Standardize terminology

---

## 🚨 Troubleshooting

### Issue: "Table 'repair_cases' doesn't exist"
**Solution**: Run the schema migration first:
```sql
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'repair_cases';

-- If not, create it (check your migration files)
```

### Issue: "Duplicate key error"
**Solution**: The script uses auto-increment IDs, so this shouldn't happen. If it does:
```sql
-- Check existing IDs
SELECT MAX(id) FROM repair_cases;

-- Reset sequence if needed
SELECT setval('repair_cases_id_seq', (SELECT MAX(id) FROM repair_cases));
```

### Issue: "Column doesn't exist"
**Solution**: Your schema might be different. Check your table structure:
```sql
\d repair_cases  -- In psql
-- or
DESCRIBE repair_cases;  -- In MySQL
```

---

## 📝 Next Steps

1. ✅ **Insert the training data** using one of the methods above
2. ✅ **Verify the data** using the verification queries
3. ✅ **Test the AI** by creating a repair task and using the AI Assistant
4. ✅ **Monitor results** and add more cases as technicians complete repairs
5. ✅ **Refine data** by reviewing AI recommendations and updating cases

---

## 📚 Related Files

- `insert_training_repair_cases.sql` - SQL script with 50 cases
- `V1__enhance_repair_intelligence_schema.sql` - Database schema
- `TechnicianAssistanceService.java` - AI service that uses this data
- `CaseSimilarityService.java` - Similarity matching algorithm
- `RepairRecommendationService.java` - Recommendation engine

---

**Status**: ✅ READY TO INSERT  
**Data Quality**: High (Real repair cases)  
**AI Impact**: Significant improvement expected

---

**Generated**: May 24, 2026  
**System**: SmartFix (Intelligent Corex)  
**Purpose**: AI Training Data for Repair Assistant
