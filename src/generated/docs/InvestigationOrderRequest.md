# InvestigationOrderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderType** | [**InvestigationOrderType**](InvestigationOrderType.md) |  | [default to undefined]
**testName** | **string** |  | [default to undefined]
**testCode** | **string** |  | [optional] [default to undefined]
**clinicalNotes** | **string** |  | [optional] [default to undefined]
**urgency** | [**InvestigationUrgency**](InvestigationUrgency.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InvestigationOrderRequest } from './api';

const instance: InvestigationOrderRequest = {
    orderType,
    testName,
    testCode,
    clinicalNotes,
    urgency,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
