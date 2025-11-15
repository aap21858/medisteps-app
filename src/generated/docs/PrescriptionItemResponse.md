# PrescriptionItemResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**medicineName** | **string** |  | [default to undefined]
**genericName** | **string** |  | [optional] [default to undefined]
**dosage** | **string** |  | [default to undefined]
**form** | **string** |  | [default to undefined]
**frequency** | **string** | Dosing frequency (e.g., 1-0-1 for Morning-Afternoon-Night) | [optional] [default to undefined]
**duration** | **number** | Treatment duration | [optional] [default to undefined]
**durationUnit** | **string** |  | [optional] [default to DurationUnitEnum_Days]
**route** | **string** |  | [optional] [default to undefined]
**instructions** | **string** |  | [optional] [default to undefined]
**quantity** | **number** |  | [optional] [default to undefined]
**id** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { PrescriptionItemResponse } from './api';

const instance: PrescriptionItemResponse = {
    medicineName,
    genericName,
    dosage,
    form,
    frequency,
    duration,
    durationUnit,
    route,
    instructions,
    quantity,
    id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
