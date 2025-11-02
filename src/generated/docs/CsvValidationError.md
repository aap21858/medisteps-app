# CsvValidationError


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**rowNumber** | **number** | Row number in CSV file (1-based, excluding header) | [optional] [default to undefined]
**rowData** | **{ [key: string]: string; }** | Original row data from CSV | [optional] [default to undefined]
**errors** | **Array&lt;string&gt;** | List of validation errors for this row | [optional] [default to undefined]
**errorType** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CsvValidationError } from './api';

const instance: CsvValidationError = {
    rowNumber,
    rowData,
    errors,
    errorType,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
