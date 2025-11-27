# Appointment System Redesign Plan

## Executive Summary

This document outlines a comprehensive redesign of the Healix appointment management system to eliminate data redundancy, improve data integrity, and create a more logical flow that integrates seamlessly with pharmacy, pathology, radiology, and other hospital modules.

---

## Problem Statement

### Current Issues

1. **Data Redundancy**
   - `patient_medical_history` stores permanent medical information (allergies, medications, chronic conditions, past surgeries)
   - Previously, separate triage process would duplicate this information
   - **Solution**: Eliminate triage as separate step; integrate assessment into examination

2. **Unclear Data Flow**
   - Confusion about which table is the "source of truth" for medical history
   - **Solution**: `patient_medical_history` is single source of truth; examination captures visit-specific assessment
   - Clear separation between permanent patient data and visit-specific data

3. **Integration Challenges**
   - Current design makes it difficult to integrate with pharmacy, pathology, and radiology
   - Billing and service tracking needs clearer separation
   - IPD/OPD conversion lacks proper audit trail

---

## Design Principles

### 1. Single Source of Truth
- Patient's permanent medical history stored once in `patient_medical_history`
- All appointments reference this data, never duplicate it

### 2. Visit-Specific Data
- Each appointment captures only current visit information
- Chief complaint, symptoms, and assessment captured in examination
- Historical data is referenced, not copied

### 3. Clear Separation
- **Permanent Data**: `patient_medical_history` (updated rarely, by clinicians only)
- **Temporary Data**: Appointment-specific information (one-time use)

### 4. Audit Trail
- Track all changes to patient medical history
- Track all appointment status changes
- Maintain complete history for compliance and analysis

### 5. Role-Based Access Control (RBAC)
- **Only doctors/clinicians** can update medical history
- Non-clinical staff can **view** (read-only) and **flag** for review
- Proper authorization checks at API level
- Audit log captures who made what changes

### 6. Historical Context
- Doctors must see complete patient visit history during consultation
- Past diagnoses, medications, investigations visible in timeline
- Enables continuity of care and informed decision-making

---

## Proposed Architecture

### Data Model Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PATIENT MASTER DATA                       │
├─────────────────────────────────────────────────────────────┤
│ patients                                                     │
│ patient_emergency_contacts                                   │
│ patient_insurance                                            │
│ patient_medical_history (SINGLE SOURCE OF TRUTH)             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPOINTMENT FLOW                          │
├─────────────────────────────────────────────────────────────┤
│ 1. appointments (OPD/IPD booking + chief complaint)          │
│    ↓                                                         │
│ 2. vitals (Vital signs recorded before examination)          │
│    ↓                                                         │
│ 3. appointment_examination (Doctor consultation)             │
│    - Records: vitals review, chief complaint, symptoms       │
│    - Clinical examination findings                           │
│    - Diagnosis and treatment plan                            │
│    - Can update patient_medical_history if needed            │
│    ↓                                                         │
│ 4. Orders & Prescriptions                                    │
│    - prescriptions + prescription_items                      │
│    - investigation_orders (Pathology/Radiology)              │
│    - referrals (appointments.referred_to_*)                  │
│    ↓                                                         │
│ 5. appointment_services (Billing)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Table Redesign

### 1. Keep: `patient_medical_history` (Enhanced)

**Purpose**: Single source of truth for patient's permanent medical information

**Schema Changes**:
```sql
ALTER TABLE patient_medical_history 
ADD COLUMN social_history TEXT AFTER disability;
-- Stores: Smoking, alcohol consumption, occupation, living conditions
```

**Usage**:
- Updated when patient's medical situation changes (new allergy, new chronic condition, surgery)
- Referenced (read-only) during every appointment
- Never duplicated in appointment tables

**Update Triggers**:
- New allergy discovered during appointment
- New chronic condition diagnosed
- Patient undergoes surgery
- Medication list changes significantly

---

### 2. Simplified Workflow: No Separate Triage

**Rationale**: Triage as a separate process creates unnecessary duplication and workflow complexity.

**Why Triage Doesn't Make Sense Here**:
1. **Medical history already exists** at patient level - no need to re-capture
2. **Chief complaint captured** during appointment booking
3. **Vitals recorded** separately by nursing staff
4. **Doctor performs comprehensive examination** anyway - all triage data would be reviewed again

**Traditional Triage Use Cases** (Not applicable here):
- **Emergency Department**: Rapid prioritization of walk-in patients by severity
- **Mass casualty events**: Quick assessment of multiple casualties
- **Field medicine**: Resource allocation in disaster scenarios

**Our Scenario** (Scheduled clinic appointments):
- Patients have scheduled appointments
- Medical history already on file
- Doctor will see every patient regardless of "triage" findings
- Triage becomes redundant data entry

**Simplified Flow**:
```
Check-in → Record Vitals → Doctor Examination
```

All "triage" information (chief complaint, symptoms, assessment) is captured directly in the **examination** phase by the doctor.

---

## Detailed Appointment Flow

### Step 1: Patient Check-In/Registration

**Actions**:
1. Verify patient demographics
2. Display `patient_medical_history` for review (**READ-ONLY**)
3. Ask: "Has anything changed in your medical history?"
4. If YES → **Flag for doctor review** (do NOT update medical history)
5. Record chief complaint for current visit
6. Create appointment with review flags

**Important**: Receptionist/front desk staff **CANNOT** update medical history. Only doctors can update it during examination after clinical verification.

**Frontend Display**:
```++++++++++++++++++++
┌─────────────────────────────────────────────────────────┐
│ Patient Check-In                                        │
├─────────────────────────────────────────────────────────┤
│ Patient: Rahul Patil (SNG2025001)                       │
│                                                         │
│ Medical History (Last updated: 2025-01-15) [READ-ONLY] │
│ ✓ Allergies: Penicillin, Peanuts                       │
│ ✓ Current Medications: Metformin 500mg                 │
│ ✓ Chronic Conditions: Type 2 Diabetes                  │
│                                                         │
│ ⚠ Patient Reports Medical History Changes?             │
│ ○ No  ● Yes                                            │
│                                                         │
│ If Yes, describe what changed:                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Patient mentions new medication: Aspirin 75mg   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ Chief Complaint (Today's Visit):                       │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Fever and cough for 3 days                      │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ [Confirm Check-In]                                     │
│                                                         │
│ ℹ Note: Medical history changes will be reviewed by    │
│   the doctor during consultation.                      │
└─────────────────────────────────────────────────────────┘
```

**SQL Operations**:
```sql
-- 1. Retrieve patient medical history (READ-ONLY)
SELECT * FROM patient_medical_history WHERE patient_id = 123;

-- 2. Create appointment with chief complaint
INSERT INTO appointments 
(patient_id, chief_complaint, 
 medical_history_review_required, 
 medical_history_review_notes, ...) 
VALUES 
(123, 'Fever and cough for 3 days', 
 TRUE, 
 'Patient mentions new medication: Aspirin 75mg', ...);

-- 3. Medical history is NOT updated at check-in
-- It will be updated by doctor during examination
```

**Key Changes**:
- ❌ **NO** medical history updates during check-in
- ✅ Flag `medical_history_review_required = TRUE` if patient reports changes
- ✅ Record patient's reported changes in `medical_history_review_notes`
- ✅ Doctor reviews and verifies changes during consultation

---

### Step 2: Vitals Recording

**Purpose**: Record current visit measurements

**Table**: `vitals` (already well-designed)

**Data Captured**:
```sql
INSERT INTO vitals 
(appointment_id, weight, height, temperature, heart_rate, 
 respiratory_rate, systolic_bp, diastolic_bp, spo2, 
 recorded_by, recorded_by_name)
VALUES 
(123, 75.5, 175, 98.6, 88, 18.5, 120, 80, 98.0, 
 3, 'Nurse Aliya');

-- Also record symptoms for this visit
INSERT INTO vital_symptoms (vital_id, symptom) VALUES
(LAST_INSERT_ID(), 'Headache'),
(LAST_INSERT_ID(), 'Nausea');
```

**Note**: 
- Vitals are visit-specific (not permanent)
- Symptoms are visit-specific (not permanent allergies)
- This is separate from `patient_medical_history`

---

### Step 3: Doctor Consultation (Examination)

**Enhanced Examination** - Now includes all necessary assessment fields (previously in "triage"):

**Table Schema** - `appointment_examination` (enhanced):
```sql
CREATE TABLE appointment_examination (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    appointment_id BIGINT NOT NULL UNIQUE,
    
    -- Current Visit Assessment (formerly "triage" fields)
    chief_complaint TEXT, -- Can be updated/refined by doctor
    history_present_illness TEXT, -- Detailed history of current complaint
    symptoms TEXT, -- Current symptoms for this visit
    
    -- Clinical Examination
    examination_findings TEXT NOT NULL,
    vitals_reviewed BOOLEAN DEFAULT TRUE, -- Did doctor review vitals?
    
    -- Diagnosis
    primary_diagnosis VARCHAR(255) NOT NULL,
    primary_diagnosis_icd10 VARCHAR(20),
    secondary_diagnoses TEXT, -- JSON array of additional diagnoses
    differential_diagnoses TEXT, -- Diagnoses considered but ruled out
    
    -- Treatment Plan
    treatment_plan TEXT NOT NULL,
    follow_up_instructions TEXT,
    follow_up_date DATE,
    
    -- Medical History Review
    medical_history_reviewed BOOLEAN DEFAULT TRUE,
    medical_history_updated BOOLEAN DEFAULT FALSE,
    medical_history_update_notes TEXT, -- What changed during this visit
    
    -- Metadata
    examined_by BIGINT NOT NULL, -- Doctor ID
    examined_by_name VARCHAR(100),
    examined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_exam_appointment FOREIGN KEY (appointment_id) 
        REFERENCES appointments(id) ON DELETE CASCADE,
    CONSTRAINT fk_exam_doctor FOREIGN KEY (examined_by) 
        REFERENCES staff(id)
);
```

**Fields Added to Examination** (no longer need separate triage):
- ✅ `history_present_illness` - Detailed account of current problem
- ✅ `symptoms` - Current visit symptoms
- ✅ `medical_history_reviewed` - Confirmation doctor reviewed history
- ✅ `medical_history_updated` - Flag if history was updated
- ✅ `medical_history_update_notes` - Audit trail of changes

**Doctor's View** (Enhanced with Complete History):
```
┌─────────────────────────────────────────────────────────────────────┐
│ Consultation - Rahul Patil (APT-20251123-00001)                    │
├─────────────────────────────────────────────────────────────────────┤
│ TAB 1: Current Visit                                                │
│ - Chief Complaint: Fever and cough for 3 days                      │
│ - Today's Vitals: BP 120/80, Temp 98.6°F, HR 88, RR 18.5           │
│ - Symptoms: Headache, Nausea                                       │
│                                                                     │
│ ⚠ Medical History Review Required                                  │
│   Patient reports: "New medication: Aspirin 75mg"                  │
│   [Review & Update Medical History]                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ TAB 2: Medical History (Can Edit)                                   │
│ Last Updated: 2025-01-15 by Dr. Sharma                            │
│                                                                     │
│ Allergies: [Edit] Penicillin, Peanuts                             │
│ Current Medications: [Edit] Metformin 500mg                        │
│ Chronic Conditions: [Edit] Type 2 Diabetes                         │
│ Past Surgeries: [Edit] Appendectomy (2020)                        │
│ Family History: [Edit] Father had heart disease                    │
│                                                                     │
│ [Save Medical History Changes]                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ TAB 3: Past Appointments History ⭐ NEW                             │
│                                                                     │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ 📅 2025-10-15 - Dr. Sharma - General Medicine                 │  │
│ │ Diagnosis: Type 2 Diabetes - Initial diagnosis                │  │
│ │ Prescribed: Metformin 500mg (1-0-1)                           │  │
│ │ Lab Orders: HbA1c, Fasting Sugar                              │  │
│ │ Lab Results: HbA1c 8.2% (High), FBS 165 mg/dL (High)         │  │
│ │ Vitals: BP 130/85, Weight 78kg, BMI 25.5                     │  │
│ │ [View Full Details]                                            │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ 📅 2025-09-20 - Dr. Kumar - General Medicine                  │  │
│ │ Diagnosis: Hypertension                                        │  │
│ │ Prescribed: Amlodipine 5mg (1-0-0)                            │  │
│ │ Vitals: BP 145/95, Weight 79kg                                │  │
│ │ [View Full Details]                                            │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│ 📊 Vitals Trend (Last 6 months)                                    │
│ BP: 145/95 → 135/88 → 130/85 → 120/80                             │
│ Weight: 79kg → 78.5kg → 78kg → 75.5kg ↓                           │
│ FBS: 165 → 145 → 132 ↓                                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ TAB 4: Examination & Diagnosis (Today)                              │
│                                                                     │
│ Examination Findings:                                               │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ Mild pharyngitis, no respiratory distress                   │    │
│ │ Chest clear on auscultation                                 │    │
│ └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│ Primary Diagnosis:                                                  │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ Upper Respiratory Tract Infection (URTI)                    │    │
│ └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│ Treatment Plan:                                                     │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ Antibiotics and symptomatic treatment                        │    │
│ │ Continue Metformin as prescribed                            │    │
│ │ Follow-up in 5 days                                         │    │
│ └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ TAB 5: Orders                                                        │
│ - Prescriptions [+Add]                                              │
│ - Lab Tests [+Add]                                                  │
│ - Radiology [+Add]                                                  │
│ - Referrals [+Add]                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

**SQL Operations for Past Appointments History**:
```sql
-- 1. Get all past appointments with diagnoses
SELECT 
    a.id,
    a.appointment_number,
    a.appointment_date,
    a.appointment_type,
    a.chief_complaint,
    s.first_name || ' ' || s.last_name AS doctor_name,
    d.name AS department_name,
    ae.primary_diagnosis,
    ae.primary_diagnosis_icd10,
    ae.examination_findings,
    ae.treatment_plan
FROM appointments a
LEFT JOIN staff s ON a.physician_id = s.id
LEFT JOIN dropdown_lookup d ON a.department_id = d.id
LEFT JOIN appointment_examination ae ON a.id = ae.appointment_id
WHERE a.patient_id = 123
  AND a.id != :current_appointment_id
  AND a.status IN ('COMPLETED', 'CLOSED')
ORDER BY a.appointment_date DESC
LIMIT 10;

-- 2. Get past prescriptions for each appointment
SELECT 
    p.prescription_number,
    p.prescription_date,
    pi.medicine_name,
    pi.dosage,
    pi.form,
    pi.frequency,
    pi.duration,
    pi.instructions
FROM prescriptions p
JOIN prescription_items pi ON p.id = pi.prescription_id
WHERE p.appointment_id = :appointment_id
  AND p.status IN ('PRESCRIBED', 'DISPENSED');

-- 3. Get past investigation orders and results
SELECT 
    io.order_number,
    io.order_type,
    io.test_name,
    io.test_code,
    io.status,
    io.result_value,
    io.result_unit,
    io.result_status,
    io.result_report_url,
    io.ordered_at,
    io.result_reported_at
FROM investigation_orders io
WHERE io.appointment_id = :appointment_id
ORDER BY io.ordered_at DESC;

-- 4. Get past vitals for trend analysis
SELECT 
    v.recorded_at,
    v.weight,
    v.height,
    v.systolic_bp,
    v.diastolic_bp,
    v.heart_rate,
    v.temperature,
    v.spo2,
    v.random_blood_sugar,
    v.bmi
FROM vitals v
JOIN appointments a ON v.appointment_id = a.id
WHERE a.patient_id = 123
  AND a.status IN ('COMPLETED', 'CLOSED')
ORDER BY v.recorded_at DESC
LIMIT 12; -- Last 12 visits for trend

-- 5. Doctor views current patient medical history (with edit capability)
SELECT * FROM patient_medical_history WHERE patient_id = 123;

-- 6. Check if medical history review is required
SELECT 
    medical_history_review_required,
    medical_history_review_notes
FROM appointments 
WHERE id = :current_appointment_id;

-- 7. Doctor updates medical history during consultation (if needed)
-- This is the ONLY place where medical history should be updated
UPDATE patient_medical_history 
SET known_allergies = '["Penicillin", "Peanuts", "Latex"]',
    current_medications = '["Metformin 500mg", "Aspirin 75mg"]',
    updated_at = CURRENT_TIMESTAMP,
    updated_by = :doctor_id -- Track who made the change
WHERE patient_id = 123;

-- 8. Create audit record for medical history change
INSERT INTO patient_medical_history_audit
(patient_id, appointment_id, field_changed, old_value, new_value, 
 changed_by, reason)
VALUES
(123, :current_appointment_id, 'current_medications',
 '["Metformin 500mg"]',
 '["Metformin 500mg", "Aspirin 75mg"]',
 :doctor_id,
 'Patient started taking Aspirin as per cardiologist recommendation');

-- 9. Clear the review flag after doctor reviews
UPDATE appointments 
SET medical_history_review_required = FALSE,
    medical_history_reviewed_at = CURRENT_TIMESTAMP,
    medical_history_reviewed_by = :doctor_id
WHERE id = :current_appointment_id;

-- 10. Doctor records examination
INSERT INTO appointment_examination 
(appointment_id, examination_findings, primary_diagnosis, 
 treatment_plan, examined_by)
VALUES 
(123, 'Mild pharyngitis, no respiratory distress', 
 'Upper Respiratory Tract Infection', 
 'Antibiotics and symptomatic treatment', :doctor_id);
```

**Key Features**:
- ✅ **Past Appointments Timeline** - Chronological view of all past visits
- ✅ **Past Diagnoses** - What was diagnosed in previous visits
- ✅ **Medication History** - What was prescribed and when
- ✅ **Investigation Results** - Lab and radiology results from past visits
- ✅ **Vitals Trends** - BP, weight, sugar trends over time (with graphs)
- ✅ **Treatment Outcomes** - What worked, what didn't
- ✅ **Medical History Edit** - Doctor can update after verification
- ✅ **Review Flags** - Alerts doctor if patient reported changes at check-in
- ✅ **Audit Trail** - Every medical history change is logged

**Security & Authorization**:
```java
// Only doctors can update medical history
@PreAuthorize("hasRole('DOCTOR') or hasRole('PHYSICIAN')")
@PutMapping("/patients/{patientId}/medical-history")
public ResponseEntity<MedicalHistory> updateMedicalHistory(
    @PathVariable Long patientId,
    @RequestBody MedicalHistoryUpdateRequest request) {
    // ... implementation
}
```

---

### Step 5: Orders & Prescriptions

#### 5.1 Prescriptions

```sql
-- Create prescription
INSERT INTO prescriptions 
(prescription_number, appointment_id, patient_id, physician_id,
 diagnosis, prescription_date, status)
VALUES 
('RX-20251123-00001', 123, 456, 1, 
 'Upper Respiratory Tract Infection', '2025-11-23', 'PRESCRIBED');

-- Add prescription items
INSERT INTO prescription_items 
(prescription_id, medicine_name, dosage, form, frequency, 
 duration, instructions, quantity)
VALUES 
(LAST_INSERT_ID(), 'Amoxicillin', '500mg', 'Tablet', 
 '1-0-1', 5, 'After meals', 10);
```

**Pharmacy Integration**: Pharmacy module can query `prescriptions` and `prescription_items` tables.

#### 5.2 Investigation Orders (Pathology)

```sql
INSERT INTO investigation_orders 
(order_number, appointment_id, patient_id, ordered_by,
 order_type, test_name, test_code, urgency, status)
VALUES 
('INV-20251123-00001', 123, 456, 1,
 'PATHOLOGY', 'Complete Blood Count', 'CBC', 
 'ROUTINE', 'ORDERED');
```

**Pathology Integration**: Pathology lab can:
- Query orders with `order_type = 'PATHOLOGY'` and `status = 'ORDERED'`
- Update status to 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED'
- Upload results to `result_report_url`

#### 5.3 Investigation Orders (Radiology)

```sql
INSERT INTO investigation_orders 
(order_number, appointment_id, patient_id, ordered_by,
 order_type, test_name, test_code, urgency, status)
VALUES 
('INV-20251123-00002', 123, 456, 1,
 'RADIOLOGY', 'Chest X-Ray', 'CXR', 
 'URGENT', 'ORDERED');
```

**Radiology Integration**: Similar to pathology.

#### 5.4 Referrals

```sql
-- Update appointment with referral information
UPDATE appointments 
SET referred_to_department_id = (SELECT id FROM dropdown_lookup 
                                  WHERE type='DEPARTMENT' AND code='CARDIOLOGY'),
    referred_to_physician_id = 5
WHERE id = 123;

-- Create follow-up appointment (optional)
INSERT INTO appointments 
(patient_id, appointment_type, appointment_date, physician_id,
 referred_from_appointment_id, ...)
VALUES (456, 'OPD', '2025-11-25', 5, 123, ...);
```

---

### Step 6: Billing

```sql
-- Add consultation fee
INSERT INTO appointment_services 
(appointment_id, service_type, service_name, service_code,
 quantity, unit_price, total_price, is_billable, added_by)
VALUES 
(123, 'CONSULTATION', 'General Medicine Consultation', 'CONS-GM',
 1, 500.00, 500.00, TRUE, 1);

-- Add investigation charges
INSERT INTO appointment_services 
(appointment_id, service_type, service_name, service_code,
 quantity, unit_price, total_price, is_billable, added_by)
VALUES 
(123, 'INVESTIGATION', 'Complete Blood Count', 'CBC',
 1, 300.00, 300.00, TRUE, 1);

-- Calculate total
SELECT SUM(total_price - discount) AS total_amount
FROM appointment_services
WHERE appointment_id = 123 AND is_billable = TRUE;
```

---

## When to Update `patient_medical_history`

### Scenarios That Trigger Updates

1. **New Allergy Discovered**
   ```sql
   UPDATE patient_medical_history 
   SET known_allergies = '["Penicillin", "Peanuts", "Latex"]',
       updated_at = CURRENT_TIMESTAMP
   WHERE patient_id = 123;
   
   -- Flag in examination notes
   UPDATE appointment_examination 
   SET medical_history_updated = TRUE,
       medical_history_update_notes = 'Added latex allergy'
   WHERE appointment_id = 456;
   ```

2. **New Chronic Condition Diagnosed**
   ```sql
   UPDATE patient_medical_history 
   SET chronic_conditions = '["Type 2 Diabetes", "Hypertension"]',
       updated_at = CURRENT_TIMESTAMP
   WHERE patient_id = 123;
   ```

3. **Patient Had Surgery**
   ```sql
   -- Append to past_surgeries (JSON or text)
   UPDATE patient_medical_history 
   SET past_surgeries = CONCAT(past_surgeries, ', Knee Replacement (2025-11-23)'),
       updated_at = CURRENT_TIMESTAMP
   WHERE patient_id = 123;
   ```

4. **Medication List Changed**
   ```sql
   UPDATE patient_medical_history 
   SET current_medications = '["Metformin 500mg", "Amlodipine 5mg"]',
       updated_at = CURRENT_TIMESTAMP
   WHERE patient_id = 123;
   ```

### Audit Trail for Medical History Changes

```sql
-- Create audit table for medical history changes
CREATE TABLE patient_medical_history_audit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT, -- Which appointment triggered the change
    
    field_changed VARCHAR(100), -- allergies, chronic_conditions, etc.
    old_value TEXT,
    new_value TEXT,
    
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    
    CONSTRAINT fk_history_audit_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id),
    CONSTRAINT fk_history_audit_appointment FOREIGN KEY (appointment_id) 
        REFERENCES appointments(id),
    CONSTRAINT fk_history_audit_changed_by FOREIGN KEY (changed_by) 
        REFERENCES staff(id)
);
```

---

## SQL Migration Script

### Complete Migration from Old to New Schema

```sql
-- ============================================
-- PHASE 1: Backup Existing Data
-- ============================================

-- Backup triage data
CREATE TABLE appointment_triage_backup AS 
SELECT * FROM appointment_triage;

-- ============================================
-- PHASE 2: Add Missing Fields
-- ============================================

-- Add social_history to patient_medical_history
ALTER TABLE patient_medical_history 
ADD COLUMN IF NOT EXISTS social_history TEXT AFTER disability;

-- ============================================
-- PHASE 3: Enhance appointment_examination Table
-- ============================================

-- Add triage-type fields to examination table
ALTER TABLE appointment_examination
ADD COLUMN IF NOT EXISTS history_present_illness TEXT AFTER chief_complaint,
ADD COLUMN IF NOT EXISTS symptoms TEXT AFTER history_present_illness,
ADD COLUMN IF NOT EXISTS vitals_reviewed BOOLEAN DEFAULT TRUE AFTER examination_findings,
ADD COLUMN IF NOT EXISTS medical_history_reviewed BOOLEAN DEFAULT TRUE AFTER treatment_plan,
ADD COLUMN IF NOT EXISTS medical_history_updated BOOLEAN DEFAULT FALSE AFTER medical_history_reviewed,
ADD COLUMN IF NOT EXISTS medical_history_update_notes TEXT AFTER medical_history_updated;

-- ============================================
-- PHASE 4: Migrate Triage Data to Examination (One-time)
-- ============================================

-- If historical triage data exists, migrate to examination records
UPDATE appointment_examination ae
INNER JOIN appointment_triage_backup atb ON ae.appointment_id = atb.appointment_id
SET 
    ae.history_present_illness = COALESCE(ae.history_present_illness, atb.history_present_illness),
    ae.chief_complaint = COALESCE(ae.chief_complaint, atb.chief_complaints),
    ae.medical_history_updated = COALESCE(ae.medical_history_updated, atb.medical_history_updated),
    ae.medical_history_update_notes = COALESCE(ae.medical_history_update_notes, atb.medical_history_update_notes)
WHERE EXISTS (SELECT 1 FROM appointment_triage_backup WHERE appointment_id = ae.appointment_id);

-- Migrate any medical history data from old triage records to patient_medical_history
UPDATE patient_medical_history pmh
JOIN appointment_triage_backup atb ON pmh.patient_id = (
    SELECT patient_id FROM appointments WHERE id = atb.appointment_id
)
SET 
    pmh.known_allergies = COALESCE(pmh.known_allergies, atb.allergies),
    pmh.current_medications = COALESCE(pmh.current_medications, atb.current_medications),
    pmh.family_medical_history = COALESCE(pmh.family_medical_history, atb.family_history),
    pmh.social_history = COALESCE(pmh.social_history, atb.social_history),
    pmh.updated_at = CURRENT_TIMESTAMP
WHERE (pmh.known_allergies IS NULL OR pmh.known_allergies = '')
   OR (pmh.current_medications IS NULL OR pmh.current_medications = '')
   OR (pmh.family_medical_history IS NULL OR pmh.family_medical_history = '');

-- ============================================
-- PHASE 5: Drop Triage Table (No Longer Needed)
-- ============================================

-- All triage functionality now in appointment_examination
DROP TABLE IF EXISTS appointment_triage;

-- ============================================
-- PHASE 6: Create Medical History Audit Table
-- ============================================

CREATE TABLE IF NOT EXISTS patient_medical_history_audit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    
    field_changed VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    
    CONSTRAINT fk_history_audit_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id),
    CONSTRAINT fk_history_audit_appointment FOREIGN KEY (appointment_id) 
        REFERENCES appointments(id),
    CONSTRAINT fk_history_audit_changed_by FOREIGN KEY (changed_by) 
        REFERENCES staff(id)
);

CREATE INDEX IF NOT EXISTS idx_history_audit_patient ON patient_medical_history_audit(patient_id);
CREATE INDEX IF NOT EXISTS idx_history_audit_changed_at ON patient_medical_history_audit(changed_at);

-- ============================================
-- PHASE 7: Cleanup and Verification
-- ============================================

-- Optional: Keep backup table for reference, then drop later
-- DROP TABLE IF EXISTS appointment_triage_backup;

-- Verify migration
SELECT 'Examination records enhanced' AS status, 
       COUNT(*) AS count 
FROM appointment_examination 
WHERE history_present_illness IS NOT NULL OR medical_history_reviewed IS NOT NULL
UNION ALL
SELECT 'Patient histories updated', 
       COUNT(*) 
FROM patient_medical_history 
WHERE updated_at IS NOT NULL
UNION ALL
SELECT 'Audit table created',
       COUNT(*)
FROM information_schema.tables 
WHERE table_name = 'patient_medical_history_audit';
```

---

## Integration Points

### 1. Pharmacy Module

**Query Prescriptions**:
```sql
SELECT 
    p.prescription_number,
    p.patient_id,
    pat.first_name,
    pat.last_name,
    p.prescription_date,
    pi.medicine_name,
    pi.dosage,
    pi.frequency,
    pi.duration,
    pi.quantity
FROM prescriptions p
JOIN patients pat ON p.patient_id = pat.id
JOIN prescription_items pi ON p.id = pi.prescription_id
WHERE p.status = 'PRESCRIBED'
  AND p.dispensed_at IS NULL
ORDER BY p.prescription_date DESC;
```

**Update When Dispensed**:
```sql
UPDATE prescriptions 
SET status = 'DISPENSED',
    dispensed_at = CURRENT_TIMESTAMP,
    dispensed_by = ?
WHERE prescription_number = ?;
```

### 2. Pathology Module

**Query Pending Tests**:
```sql
SELECT 
    io.order_number,
    io.patient_id,
    pat.first_name,
    pat.last_name,
    io.test_name,
    io.clinical_notes,
    io.urgency,
    a.appointment_date
FROM investigation_orders io
JOIN patients pat ON io.patient_id = pat.id
JOIN appointments a ON io.appointment_id = a.id
WHERE io.order_type = 'PATHOLOGY'
  AND io.status IN ('ORDERED', 'SAMPLE_COLLECTED')
ORDER BY 
    CASE io.urgency 
        WHEN 'STAT' THEN 1
        WHEN 'URGENT' THEN 2
        ELSE 3
    END,
    io.ordered_at;
```

**Update Test Results**:
```sql
UPDATE investigation_orders 
SET status = 'COMPLETED',
    result_value = ?,
    result_unit = ?,
    result_status = ?,
    result_report_url = ?,
    result_reported_at = CURRENT_TIMESTAMP,
    reported_by = ?
WHERE order_number = ?;
```

### 3. Radiology Module

Same as pathology, filter by `order_type = 'RADIOLOGY'`.

### 4. Billing Module

**Generate Invoice**:
```sql
SELECT 
    a.appointment_number,
    a.patient_id,
    pat.first_name,
    pat.last_name,
    asv.service_type,
    asv.service_name,
    asv.quantity,
    asv.unit_price,
    asv.total_price,
    asv.discount,
    (asv.total_price - asv.discount) AS net_amount
FROM appointments a
JOIN patients pat ON a.patient_id = pat.id
JOIN appointment_services asv ON a.id = asv.appointment_id
WHERE a.id = ?
  AND asv.is_billable = TRUE;
```

---

## Identified Gaps & Solutions

### Gap 1: Role-Based Access Control (RBAC) for Medical History ⚠️

**Issue**: Current design doesn't specify who can update medical history.

**Solution**: Implement strict RBAC with permission matrix:

| Role              | View Medical History | Update Medical History | Flag for Review | View Past Appointments |
|-------------------|---------------------|------------------------|-----------------|----------------------|
| **Receptionist**  | YES (basic)         | ❌ NO                  | ✅ YES          | ❌ NO                |
| **Nurse**         | YES (full)          | ❌ NO                  | ✅ YES          | LIMITED (basic info) |
| **Doctor**        | YES (full)          | ✅ YES                 | ✅ YES          | YES (complete)       |
| **Lab Tech**      | LIMITED             | ❌ NO                  | ❌ NO           | LIMITED (test results)|
| **Pharmacist**    | LIMITED (allergies) | ❌ NO                  | ❌ NO           | LIMITED (prescriptions)|
| **Admin**         | YES (audit only)    | ❌ NO                  | ❌ NO           | YES (read-only)      |

**Implementation**:
```java
// Spring Security - Only doctors can update medical history
@PreAuthorize("hasAnyRole('DOCTOR', 'PHYSICIAN', 'CONSULTANT')")
@PutMapping("/api/patients/{patientId}/medical-history")
public ResponseEntity<MedicalHistory> updateMedicalHistory(...) {
    // Only accessible by doctors
}

// Receptionists can only flag for review
@PreAuthorize("hasAnyRole('RECEPTIONIST', 'NURSE', 'DOCTOR')")
@PostMapping("/api/appointments/{appointmentId}/flag-medical-history-review")
public ResponseEntity<Void> flagMedicalHistoryReview(...) {
    // Accessible by front-desk staff
}
```

**Schema Update**:
```sql
-- Add fields to appointments table for medical history review
ALTER TABLE appointments 
ADD COLUMN medical_history_review_required BOOLEAN DEFAULT FALSE,
ADD COLUMN medical_history_review_notes TEXT,
ADD COLUMN medical_history_reviewed_at TIMESTAMP,
ADD COLUMN medical_history_reviewed_by BIGINT,
ADD CONSTRAINT fk_appointments_reviewed_by 
    FOREIGN KEY (medical_history_reviewed_by) REFERENCES staff(id);

-- Add updated_by to track who updated medical history
ALTER TABLE patient_medical_history
ADD COLUMN updated_by BIGINT,
ADD CONSTRAINT fk_medical_history_updated_by
    FOREIGN KEY (updated_by) REFERENCES staff(id);
```

---

### Gap 2: No Past Appointments History View ⚠️

**Issue**: Doctor cannot see patient's complete visit history during consultation.

**Solution**: Implement comprehensive "Past Appointments" tab showing:

**Components**:
1. **Timeline View** - Chronological list of all past visits
2. **Past Diagnoses** - What was diagnosed and when
3. **Medication History** - All prescribed medications
4. **Investigation Results** - Lab and radiology reports
5. **Vitals Trends** - Graphs showing BP, weight, sugar trends
6. **Treatment Outcomes** - Follow-up notes

**Implementation**:
```sql
-- Create view for past appointments summary
CREATE VIEW patient_appointment_history AS
SELECT 
    p.id AS patient_id,
    a.id AS appointment_id,
    a.appointment_number,
    a.appointment_date,
    a.appointment_type,
    a.chief_complaint,
    a.status,
    s.first_name || ' ' || s.last_name AS doctor_name,
    d.description AS department,
    ae.primary_diagnosis,
    ae.primary_diagnosis_icd10,
    ae.treatment_plan,
    -- Vitals summary
    v.systolic_bp,
    v.diastolic_bp,
    v.weight,
    v.bmi,
    v.random_blood_sugar,
    -- Prescription count
    (SELECT COUNT(*) FROM prescriptions WHERE appointment_id = a.id) AS prescription_count,
    -- Investigation count
    (SELECT COUNT(*) FROM investigation_orders WHERE appointment_id = a.id) AS investigation_count
FROM patients p
JOIN appointments a ON p.id = a.patient_id
LEFT JOIN staff s ON a.physician_id = s.id
LEFT JOIN dropdown_lookup d ON a.department_id = d.id
LEFT JOIN appointment_examination ae ON a.id = ae.appointment_id
LEFT JOIN vitals v ON a.id = v.appointment_id
WHERE a.status IN ('COMPLETED', 'CLOSED')
ORDER BY a.appointment_date DESC;
```

**API Endpoint**:
```java
@GetMapping("/api/patients/{patientId}/appointment-history")
@PreAuthorize("hasAnyRole('DOCTOR', 'NURSE')")
public ResponseEntity<PatientAppointmentHistory> getPatientHistory(
    @PathVariable Long patientId,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    
    return ResponseEntity.ok(
        patientService.getAppointmentHistory(patientId, page, size)
    );
}
```

---

### Gap 3: No Medical History Version Control ⚠️

**Issue**: Cannot track historical state - "What were the patient's allergies on 2024-01-15?"

**Solution**: Enhanced audit table with version tracking:

```sql
-- Enhanced audit table
CREATE TABLE patient_medical_history_audit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    
    -- What changed
    field_changed VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    
    -- Who & When
    changed_by BIGINT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    
    -- Version tracking
    version_number INT NOT NULL,
    
    -- Context
    change_type VARCHAR(50), -- ADDED, UPDATED, REMOVED
    verified BOOLEAN DEFAULT TRUE, -- Was this clinically verified?
    
    CONSTRAINT fk_history_audit_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id),
    CONSTRAINT fk_history_audit_appointment FOREIGN KEY (appointment_id) 
        REFERENCES appointments(id),
    CONSTRAINT fk_history_audit_changed_by FOREIGN KEY (changed_by) 
        REFERENCES staff(id),
        
    INDEX idx_patient_field_date (patient_id, field_changed, changed_at)
);

-- Query to get historical state
SELECT 
    field_changed,
    new_value AS value,
    changed_at
FROM patient_medical_history_audit
WHERE patient_id = 123
  AND changed_at <= '2024-01-15'
  AND field_changed = 'known_allergies'
ORDER BY changed_at DESC
LIMIT 1;
```

---

### Gap 4: No Investigation Results Timeline ⚠️

**Issue**: Doctor ordered CBC last month - where are the results?

**Solution**: Link investigation results prominently in past appointments view:

```sql
-- Query for investigation timeline
SELECT 
    io.order_number,
    io.test_name,
    io.test_code,
    io.ordered_at,
    io.result_reported_at,
    io.result_value,
    io.result_unit,
    io.result_status,
    io.result_report_url,
    a.appointment_date,
    a.appointment_number,
    s.first_name || ' ' || s.last_name AS ordered_by_doctor
FROM investigation_orders io
JOIN appointments a ON io.appointment_id = a.id
JOIN staff s ON io.ordered_by = s.id
WHERE io.patient_id = 123
  AND io.status = 'COMPLETED'
ORDER BY io.result_reported_at DESC;
```

**UI Component**:
```
Past Investigations Timeline:
┌────────────────────────────────────────────────────────┐
│ 📊 Complete Blood Count (CBC) - 2025-10-20           │
│    Ordered: 2025-10-15 by Dr. Sharma                  │
│    Results: WBC 8.2, RBC 4.5, Hemoglobin 13.5 ✓      │
│    Status: NORMAL                                      │
│    [View Full Report]                                  │
├────────────────────────────────────────────────────────┤
│ 🧪 HbA1c - 2025-10-18                                │
│    Ordered: 2025-10-15 by Dr. Sharma                  │
│    Results: 8.2% ⚠️ HIGH                              │
│    Trend: 8.5% → 8.2% (improving)                     │
│    [View Full Report]                                  │
└────────────────────────────────────────────────────────┘
```

---

### Gap 5: No Continuity of Care Tracking ⚠️

**Issue**: Patient was supposed to follow up - did they? What happened?

**Solution**: Add follow-up tracking:

```sql
-- Add to appointments table
ALTER TABLE appointments
ADD COLUMN requires_follow_up BOOLEAN DEFAULT FALSE,
ADD COLUMN follow_up_date DATE,
ADD COLUMN follow_up_instructions TEXT,
ADD COLUMN follow_up_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN follow_up_appointment_id BIGINT,
ADD CONSTRAINT fk_follow_up_appointment
    FOREIGN KEY (follow_up_appointment_id) REFERENCES appointments(id);

-- Query to find patients who missed follow-ups
SELECT 
    p.patient_id,
    p.first_name,
    p.last_name,
    a.appointment_number,
    a.follow_up_date,
    a.follow_up_instructions,
    DATEDIFF(CURRENT_DATE, a.follow_up_date) AS days_overdue
FROM appointments a
JOIN patients p ON a.patient_id = p.id
WHERE a.requires_follow_up = TRUE
  AND a.follow_up_completed = FALSE
  AND a.follow_up_date < CURRENT_DATE
  AND a.status = 'COMPLETED'
ORDER BY a.follow_up_date ASC;
```

---

### Gap 6: No Drug Interaction Checking ⚠️

**Issue**: Doctor prescribes new medication - does it interact with current medications?

**Solution**: Implement drug interaction check:

```java
@Service
public class DrugInteractionService {
    
    public List<DrugInteraction> checkInteractions(
        Long patientId, 
        String newMedicine) {
        
        // Get patient's current medications
        List<String> currentMeds = medicalHistoryRepository
            .findByPatientId(patientId)
            .getCurrentMedicationsList();
        
        // Check against drug interaction database
        return drugInteractionRepository
            .findInteractions(currentMeds, newMedicine);
    }
}

// Usage during prescription
@PostMapping("/api/prescriptions/check-interactions")
public ResponseEntity<DrugInteractionResponse> checkDrugInteractions(
    @RequestBody PrescriptionRequest request) {
    
    List<DrugInteraction> interactions = 
        drugInteractionService.checkInteractions(
            request.getPatientId(), 
            request.getMedicineName()
        );
    
    return ResponseEntity.ok(
        DrugInteractionResponse.builder()
            .hasInteractions(!interactions.isEmpty())
            .interactions(interactions)
            .severity(calculateMaxSeverity(interactions))
            .build()
    );
}
```

---

### Gap 7: No Allergy Alerts ⚠️

**Issue**: Doctor prescribes Penicillin - patient is allergic!

**Solution**: Auto-check allergies before prescription:

```sql
-- Create allergy check function
CREATE FUNCTION check_drug_allergy(
    p_patient_id BIGINT,
    p_medicine_name VARCHAR(255)
) RETURNS BOOLEAN
BEGIN
    DECLARE allergy_found BOOLEAN;
    
    SELECT COUNT(*) > 0 INTO allergy_found
    FROM patient_medical_history
    WHERE patient_id = p_patient_id
      AND JSON_CONTAINS(
          LOWER(known_allergies), 
          JSON_QUOTE(LOWER(p_medicine_name))
      );
    
    RETURN allergy_found;
END;
```

**UI Alert**:
```
⚠️ ALLERGY ALERT
Patient is allergic to: Penicillin
You are trying to prescribe: Amoxicillin (contains Penicillin)

Are you sure you want to proceed?
[ Cancel ]  [ Override (with reason) ]
```

---

## Benefits of New Design

### 1. Data Integrity
- ✅ Single source of truth for medical history
- ✅ No data duplication
- ✅ Consistent data across system
- ✅ Easier to maintain and update

### 2. Clear Separation
- ✅ Permanent vs. temporary data clearly defined
- ✅ Visit-specific information properly isolated
- ✅ Medical history changes tracked with audit trail

### 3. Better Integrations
- ✅ Clean API for pharmacy (prescriptions)
- ✅ Clean API for pathology/radiology (investigation_orders)
- ✅ Clean API for billing (appointment_services)
- ✅ Easy to add new modules (physiotherapy, dietetics, etc.)

### 4. Flexibility
- ✅ Triage optional based on clinic needs
- ✅ Supports both OPD and IPD workflows
- ✅ Scalable for future requirements

### 5. Audit & Compliance
- ✅ Complete audit trail for appointments
- ✅ Medical history changes tracked
- ✅ Supports regulatory compliance
- ✅ Easy to generate reports

---

## Implementation Roadmap

### Phase 1: Database Migration (Week 1)
- [ ] Backup existing data
- [ ] Run migration script
- [ ] Verify data integrity
- [ ] Test rollback procedure

### Phase 2: Backend Updates (Week 2-3)
- [ ] Update Entity classes
  - [ ] Simplify `AppointmentTriage` entity
  - [ ] Add `PatientMedicalHistoryAudit` entity
- [ ] Update Service classes
  - [ ] Modify `AppointmentService`
  - [ ] Update `PatientService` to handle medical history
- [ ] Update Controllers
  - [ ] Remove duplicate triage endpoints
  - [ ] Add medical history update endpoints

### Phase 3: API Updates (Week 3)
- [ ] Update Swagger specifications
- [ ] Remove deprecated triage fields
- [ ] Add medical history audit endpoints
- [ ] Update integration endpoints (pharmacy, pathology)

### Phase 4: Frontend Updates (Week 4-5)
- [ ] Update check-in screen
  - [ ] Show medical history for review
  - [ ] Add "Update History" button
- [ ] Simplify triage screen
  - [ ] Remove duplicate fields
  - [ ] Focus on current visit assessment
- [ ] Update doctor consultation screen
  - [ ] Show medical history as reference
  - [ ] Add "Update Medical History" option

### Phase 5: Testing (Week 6)
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end testing
- [ ] Performance testing

### Phase 6: Documentation & Training (Week 7)
- [ ] API documentation
- [ ] User manuals
- [ ] Training materials
- [ ] Video tutorials

### Phase 7: Deployment (Week 8)
- [ ] Staging deployment
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Post-deployment monitoring

---

## Questions & Answers

### Q1: Why remove triage as a separate process?

**Answer**: Triage creates unnecessary duplication in most clinic scenarios:

**Traditional Triage is For:**
- Emergency departments (rapid prioritization of walk-ins)
- Mass casualty events (resource allocation)
- Field medicine (disaster scenarios)

**Our Clinic Scenario:**
- Scheduled appointments (patients already have time slots)
- Medical history on file (no need to re-capture)
- Doctor will see every patient (triage assessment gets repeated)
- Chief complaint captured at booking

**Our Solution**: 
- Integrate assessment fields directly into `appointment_examination`
- Doctor captures history of present illness, symptoms during consultation
- Vitals still recorded separately by nursing staff
- Simplified workflow: Check-in → Vitals → Examination

**Benefits**:
- ✅ No data duplication
- ✅ Simplified data entry
- ✅ Fewer database tables to maintain
- ✅ Clear single workflow

### Q2: Where should chief complaint be stored?

**Answer**: Chief complaint flows through the appointment process:

**Storage Options**:
1. **At Booking**: `appointments.chief_complaint` - Brief reason for visit
2. **During Examination**: `appointment_examination.chief_complaint` - Refined/detailed by doctor
3. **Detailed History**: `appointment_examination.history_present_illness` - Full narrative

**Recommended Flow**:
- **Check-in/Booking** → Store in `appointments.chief_complaint` (e.g., "Fever and cough")
- **Doctor Examination** → Doctor can refine in `appointment_examination.chief_complaint` and add detailed history in `history_present_illness`

**Example**:
```
appointments.chief_complaint: "Headache"
appointment_examination.chief_complaint: "Severe frontal headache"  
appointment_examination.history_present_illness: "Patient reports sudden onset severe frontal headache starting 2 days ago, progressively worsening, associated with nausea and photophobia..."
```

### Q3: How to handle medical history updates during appointment?

**Process**:
1. Doctor discovers new information during examination (e.g., new allergy)
2. System prompts: "Update patient's medical history?"
3. If YES:
   - Update `patient_medical_history` table
   - Create audit record in `patient_medical_history_audit`
   - Flag `appointment_examination.medical_history_updated = TRUE`
   - Record what changed in `appointment_examination.medical_history_update_notes`
4. If NO:
   - Add to examination notes only (visit-specific)

### Q4: What about family history - where does it go?

**Answer**: `patient_medical_history.family_medical_history`

This is permanent patient data (doesn't change per visit).

### Q5: How to handle IPD conversion from OPD?

**Process**:
```sql
-- 1. Update appointment type
UPDATE appointments 
SET appointment_type = 'IPD',
    admission_date = CURRENT_TIMESTAMP,
    bed_id = ?
WHERE id = ?;

-- 2. Create audit log
INSERT INTO ipd_admission_logs 
(appointment_id, previous_type, previous_status, 
 admitted_by, bed_id, admission_notes)
VALUES 
(?, 'OPD', 'IN_CONSULTATION', ?, ?, ?);

-- 3. Add bed charges to services
INSERT INTO appointment_services 
(appointment_id, service_type, service_name, unit_price)
VALUES 
(?, 'BED_CHARGES', 'General Ward Bed', 500.00);
```

---

## Conclusion

This redesigned appointment system:

1. **Eliminates redundancy** by storing medical history once at patient level
2. **Clarifies data flow** with proper separation of permanent vs. visit-specific data
3. **Simplifies workflow** by removing unnecessary triage step and integrating assessment into examination
4. **Enables integrations** with pharmacy, pathology, radiology, and billing
5. **Ensures compliance** with comprehensive audit trails
6. **Scales efficiently** for future module additions

The examination table now includes all necessary assessment fields (history of present illness, symptoms, etc.), eliminating the need for a separate triage process while maintaining flexibility for different clinic workflows.

Patient's permanent medical history is maintained as a single source of truth, updatable only by authorized medical staff during consultation.

---

## Next Steps

1. Review and approve this design
2. Execute database migration script
3. Update backend entities and services
4. Modify API specifications
5. Update frontend components
6. Conduct thorough testing
7. Deploy to production

---

**Document Version**: 1.0  
**Created**: November 23, 2025  
**Last Updated**: November 23, 2025  
**Author**: Healix Development Team

