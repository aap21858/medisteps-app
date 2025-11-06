# DropdownLookupRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | Category/type of the lookup value | [default to undefined]
**code** | **string** | Unique code within the type | [default to undefined]
**description** | **string** | Human readable description | [optional] [default to undefined]
**active** | **boolean** | Whether the value is active | [optional] [default to true]
**displayOrder** | **number** | Order for display in lists | [optional] [default to 0]

## Example

```typescript
import { DropdownLookupRequest } from './api';

const instance: DropdownLookupRequest = {
    type,
    code,
    description,
    active,
    displayOrder,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
