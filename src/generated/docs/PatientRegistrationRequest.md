# PatientRegistrationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstName** | **string** |  | [default to undefined]
**lastName** | **string** |  | [default to undefined]
**dateOfBirth** | **string** |  | [default to undefined]
**gender** | [**Gender**](Gender.md) |  | [default to undefined]
**bloodGroup** | [**BloodGroup**](BloodGroup.md) |  | [optional] [default to undefined]
**aadharNumber** | **string** |  | [optional] [default to undefined]
**photoUrl** | **string** |  | [optional] [default to undefined]
**mobileNumber** | **string** |  | [default to undefined]
**emailId** | **string** |  | [optional] [default to undefined]
**preferredContactMethod** | [**PreferredContactMethod**](PreferredContactMethod.md) |  | [optional] [default to undefined]
**addressLine1** | **string** |  | [optional] [default to undefined]
**city** | **string** |  | [default to undefined]
**district** | **string** |  | [optional] [default to undefined]
**state** | **string** |  | [optional] [default to 'Maharashtra']
**pinCode** | **string** |  | [default to undefined]
**emergencyContacts** | [**Array&lt;EmergencyContactRequest&gt;**](EmergencyContactRequest.md) |  | [optional] [default to undefined]
**insurance** | [**InsuranceRequest**](InsuranceRequest.md) |  | [optional] [default to undefined]
**medicalHistory** | [**MedicalHistoryRequest**](MedicalHistoryRequest.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PatientRegistrationRequest } from './api';

const instance: PatientRegistrationRequest = {
    firstName,
    lastName,
    dateOfBirth,
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
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
