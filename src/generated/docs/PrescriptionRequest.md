# PrescriptionRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**diagnosis** | **string** |  | [default to undefined]
**medicationGroup** | **string** |  | [optional] [default to undefined]
**instructions** | **string** |  | [optional] [default to undefined]
**items** | [**Array&lt;PrescriptionItemRequest&gt;**](PrescriptionItemRequest.md) |  | [default to undefined]

## Example

```typescript
import { PrescriptionRequest } from './api';

const instance: PrescriptionRequest = {
    diagnosis,
    medicationGroup,
    instructions,
    items,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
