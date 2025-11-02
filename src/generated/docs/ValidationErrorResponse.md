# ValidationErrorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **string** |  | [optional] [default to undefined]
**status** | **number** |  | [optional] [default to undefined]
**error** | **string** |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**path** | **string** |  | [optional] [default to undefined]
**validationErrors** | **{ [key: string]: string; }** |  | [optional] [default to undefined]

## Example

```typescript
import { ValidationErrorResponse } from './api';

const instance: ValidationErrorResponse = {
    timestamp,
    status,
    error,
    message,
    path,
    validationErrors,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
