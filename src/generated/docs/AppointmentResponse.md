# AppointmentResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**appointmentNumber** | **string** |  | [optional] [default to undefined]
**patientId** | **number** |  | [optional] [default to undefined]
**patientName** | **string** |  | [optional] [default to undefined]
**appointmentType** | [**AppointmentType**](AppointmentType.md) |  | [optional] [default to undefined]
**appointmentDate** | **string** |  | [optional] [default to undefined]
**appointmentTime** | **string** |  | [optional] [default to undefined]
**duration** | **number** |  | [optional] [default to undefined]
**physicianId** | **number** |  | [optional] [default to undefined]
**physicianName** | **string** |  | [optional] [default to undefined]
**departmentId** | **number** |  | [optional] [default to undefined]
**departmentName** | **string** |  | [optional] [default to undefined]
**consultationRoom** | **string** |  | [optional] [default to undefined]
**urgencyLevel** | [**UrgencyLevel**](UrgencyLevel.md) |  | [optional] [default to undefined]
**status** | [**AppointmentStatus**](AppointmentStatus.md) |  | [optional] [default to undefined]
**chiefComplaint** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AppointmentResponse } from './api';

const instance: AppointmentResponse = {
    id,
    appointmentNumber,
    patientId,
    patientName,
    appointmentType,
    appointmentDate,
    appointmentTime,
    duration,
    physicianId,
    physicianName,
    departmentId,
    departmentName,
    consultationRoom,
    urgencyLevel,
    status,
    chiefComplaint,
    notes,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
