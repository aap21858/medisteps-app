# ReferralRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**referralType** | **string** |  | [optional] [default to ReferralTypeEnum_Internal]
**referredToDepartmentId** | **number** |  | [default to undefined]
**referredToPhysicianId** | **number** |  | [optional] [default to undefined]
**referralReason** | **string** |  | [optional] [default to undefined]
**clinicalSummary** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ReferralRequest } from './api';

const instance: ReferralRequest = {
    referralType,
    referredToDepartmentId,
    referredToPhysicianId,
    referralReason,
    clinicalSummary,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
