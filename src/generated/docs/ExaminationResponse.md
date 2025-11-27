# ExaminationResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chiefComplaint** | **string** | Can be refined by doctor from appointment\&#39;s chief complaint | [optional] [default to undefined]
**historyPresentIllness** | **string** | Detailed narrative of current problem | [optional] [default to undefined]
**symptoms** | **string** | Current symptoms for this visit | [optional] [default to undefined]
**generalAppearance** | **string** |  | [optional] [default to undefined]
**cardiovascularSystem** | **string** |  | [optional] [default to undefined]
**respiratorySystem** | **string** |  | [optional] [default to undefined]
**gastrointestinalSystem** | **string** |  | [optional] [default to undefined]
**centralNervousSystem** | **string** |  | [optional] [default to undefined]
**musculoskeletalSystem** | **string** |  | [optional] [default to undefined]
**examinationFindings** | **string** |  | [optional] [default to undefined]
**vitalsReviewed** | **boolean** | Confirmation that doctor reviewed vitals | [optional] [default to true]
**primaryDiagnosis** | **string** |  | [optional] [default to undefined]
**primaryDiagnosisIcd10** | **string** |  | [optional] [default to undefined]
**differentialDiagnosis** | **string** |  | [optional] [default to undefined]
**treatmentPlan** | **string** |  | [optional] [default to undefined]
**advice** | **string** |  | [optional] [default to undefined]
**followUpDate** | **string** |  | [optional] [default to undefined]
**followUpInstructions** | **string** |  | [optional] [default to undefined]
**medicalHistoryReviewed** | **boolean** | Confirmation that doctor reviewed medical history | [optional] [default to true]
**medicalHistoryUpdated** | **boolean** | Flag if medical history was updated during this visit | [optional] [default to false]
**medicalHistoryUpdateNotes** | **string** | What changed in medical history during this visit | [optional] [default to undefined]
**id** | **number** |  | [optional] [default to undefined]
**appointmentId** | **number** |  | [optional] [default to undefined]
**examinedBy** | **number** |  | [optional] [default to undefined]
**examinedByName** | **string** |  | [optional] [default to undefined]
**examinedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ExaminationResponse } from './api';

const instance: ExaminationResponse = {
    chiefComplaint,
    historyPresentIllness,
    symptoms,
    generalAppearance,
    cardiovascularSystem,
    respiratorySystem,
    gastrointestinalSystem,
    centralNervousSystem,
    musculoskeletalSystem,
    examinationFindings,
    vitalsReviewed,
    primaryDiagnosis,
    primaryDiagnosisIcd10,
    differentialDiagnosis,
    treatmentPlan,
    advice,
    followUpDate,
    followUpInstructions,
    medicalHistoryReviewed,
    medicalHistoryUpdated,
    medicalHistoryUpdateNotes,
    id,
    appointmentId,
    examinedBy,
    examinedByName,
    examinedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
