# AppointmentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**patientId** | **number** |  | [default to undefined]
**appointmentType** | [**AppointmentType**](AppointmentType.md) |  | [optional] [default to undefined]
**appointmentDate** | **string** |  | [default to undefined]
**appointmentTime** | **string** |  | [default to undefined]
**duration** | **number** | Duration in minutes | [optional] [default to 30]
**departmentId** | **number** |  | [optional] [default to undefined]
**physicianId** | **number** |  | [default to undefined]
**consultationRoom** | **string** |  | [optional] [default to undefined]
**urgencyLevel** | [**UrgencyLevel**](UrgencyLevel.md) |  | [optional] [default to undefined]
**chiefComplaint** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AppointmentRequest } from './api';

const instance: AppointmentRequest = {
    patientId,
    appointmentType,
    appointmentDate,
    appointmentTime,
    duration,
    departmentId,
    physicianId,
    consultationRoom,
    urgencyLevel,
    chiefComplaint,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
