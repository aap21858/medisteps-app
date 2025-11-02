# BatchPatientResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalRequested** | **number** | Total number of patients in the request | [optional] [default to undefined]
**successCount** | **number** | Number of successfully registered patients | [optional] [default to undefined]
**failureCount** | **number** | Number of failed registrations | [optional] [default to undefined]
**successfulRegistrations** | [**Array&lt;PatientResponse&gt;**](PatientResponse.md) | List of successfully registered patients | [optional] [default to undefined]
**failedRegistrations** | [**Array&lt;FailedRegistration&gt;**](FailedRegistration.md) | List of failed registrations with error details | [optional] [default to undefined]

## Example

```typescript
import { BatchPatientResponse } from './api';

const instance: BatchPatientResponse = {
    totalRequested,
    successCount,
    failureCount,
    successfulRegistrations,
    failedRegistrations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
