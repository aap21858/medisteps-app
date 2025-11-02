# PatientResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**patientId** | **string** |  | [optional] [default to undefined]
**firstName** | **string** |  | [optional] [default to undefined]
**lastName** | **string** |  | [optional] [default to undefined]
**dateOfBirth** | **string** |  | [optional] [default to undefined]
**age** | **number** |  | [optional] [default to undefined]
**gender** | [**Gender**](Gender.md) |  | [optional] [default to undefined]
**bloodGroup** | [**BloodGroup**](BloodGroup.md) |  | [optional] [default to undefined]
**aadharNumber** | **string** |  | [optional] [default to undefined]
**photoUrl** | **string** |  | [optional] [default to undefined]
**mobileNumber** | **string** |  | [optional] [default to undefined]
**emailId** | **string** |  | [optional] [default to undefined]
**preferredContactMethod** | [**PreferredContactMethod**](PreferredContactMethod.md) |  | [optional] [default to undefined]
**addressLine1** | **string** |  | [optional] [default to undefined]
**city** | **string** |  | [optional] [default to undefined]
**district** | **string** |  | [optional] [default to undefined]
**state** | **string** |  | [optional] [default to undefined]
**pinCode** | **string** |  | [optional] [default to undefined]
**emergencyContacts** | [**Array&lt;EmergencyContactResponse&gt;**](EmergencyContactResponse.md) |  | [optional] [default to undefined]
**insurance** | [**InsuranceResponse**](InsuranceResponse.md) |  | [optional] [default to undefined]
**medicalHistory** | [**MedicalHistoryResponse**](MedicalHistoryResponse.md) |  | [optional] [default to undefined]
**status** | [**PatientStatus**](PatientStatus.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { PatientResponse } from './api';

const instance: PatientResponse = {
    id,
    patientId,
    firstName,
    lastName,
    dateOfBirth,
    age,
    gender,
    bloodGroup,
    aadharNumber,
    photoUrl,
    mobileNumber,
    emailId,
    preferredContactMethod,
    addressLine1,
    city,
    district,
    state,
    pinCode,
    emergencyContacts,
    insurance,
    medicalHistory,
    status,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
