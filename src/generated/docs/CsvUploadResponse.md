# CsvUploadResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fileName** | **string** | Name of the uploaded file | [optional] [default to undefined]
**totalRows** | **number** | Total number of data rows in CSV (excluding header) | [optional] [default to undefined]
**successCount** | **number** | Number of successfully registered patients | [optional] [default to undefined]
**failureCount** | **number** | Number of failed registrations | [optional] [default to undefined]
**validationErrors** | [**Array&lt;CsvValidationError&gt;**](CsvValidationError.md) | List of validation errors for failed rows | [optional] [default to undefined]
**successfulRegistrations** | [**Array&lt;PatientResponse&gt;**](PatientResponse.md) | List of successfully registered patients | [optional] [default to undefined]

## Example

```typescript
import { CsvUploadResponse } from './api';

const instance: CsvUploadResponse = {
    fileName,
    totalRows,
    successCount,
    failureCount,
    validationErrors,
    successfulRegistrations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
