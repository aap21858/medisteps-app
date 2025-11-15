# PrescriptionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**prescriptionNumber** | **string** |  | [optional] [default to undefined]
**appointmentId** | **number** |  | [optional] [default to undefined]
**patientId** | **number** |  | [optional] [default to undefined]
**patientName** | **string** |  | [optional] [default to undefined]
**physicianId** | **number** |  | [optional] [default to undefined]
**physicianName** | **string** |  | [optional] [default to undefined]
**diagnosis** | **string** |  | [optional] [default to undefined]
**prescriptionDate** | **string** |  | [optional] [default to undefined]
**status** | [**PrescriptionStatus**](PrescriptionStatus.md) |  | [optional] [default to undefined]
**medicationGroup** | **string** |  | [optional] [default to undefined]
**instructions** | **string** |  | [optional] [default to undefined]
**items** | [**Array&lt;PrescriptionItemResponse&gt;**](PrescriptionItemResponse.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**dispensedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { PrescriptionResponse } from './api';

const instance: PrescriptionResponse = {
    id,
    prescriptionNumber,
    appointmentId,
    patientId,
    patientName,
    physicianId,
    physicianName,
    diagnosis,
    prescriptionDate,
    status,
    medicationGroup,
    instructions,
    items,
    createdAt,
    dispensedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
