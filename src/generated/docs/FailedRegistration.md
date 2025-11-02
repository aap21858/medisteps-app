# FailedRegistration


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**requestIndex** | **number** | Index of the failed request in the input array | [optional] [default to undefined]
**patientData** | [**PatientRegistrationRequest**](PatientRegistrationRequest.md) |  | [optional] [default to undefined]
**errorMessage** | **string** | Reason for failure | [optional] [default to undefined]
**errorCode** | **string** | Error code for categorization | [optional] [default to undefined]

## Example

```typescript
import { FailedRegistration } from './api';

const instance: FailedRegistration = {
    requestIndex,
    patientData,
    errorMessage,
    errorCode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
