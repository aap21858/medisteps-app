# InvestigationOrderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**orderNumber** | **string** |  | [optional] [default to undefined]
**appointmentId** | **number** |  | [optional] [default to undefined]
**patientId** | **number** |  | [optional] [default to undefined]
**patientName** | **string** |  | [optional] [default to undefined]
**orderedBy** | **number** |  | [optional] [default to undefined]
**orderedByName** | **string** |  | [optional] [default to undefined]
**orderType** | [**InvestigationOrderType**](InvestigationOrderType.md) |  | [optional] [default to undefined]
**testName** | **string** |  | [optional] [default to undefined]
**testCode** | **string** |  | [optional] [default to undefined]
**status** | [**InvestigationOrderStatus**](InvestigationOrderStatus.md) |  | [optional] [default to undefined]
**clinicalNotes** | **string** |  | [optional] [default to undefined]
**urgency** | [**InvestigationUrgency**](InvestigationUrgency.md) |  | [optional] [default to undefined]
**resultValue** | **string** |  | [optional] [default to undefined]
**resultUnit** | **string** |  | [optional] [default to undefined]
**resultStatus** | [**InvestigationResultStatus**](InvestigationResultStatus.md) |  | [optional] [default to undefined]
**resultReportUrl** | **string** |  | [optional] [default to undefined]
**resultNotes** | **string** |  | [optional] [default to undefined]
**orderedAt** | **string** |  | [optional] [default to undefined]
**sampleCollectedAt** | **string** |  | [optional] [default to undefined]
**resultReportedAt** | **string** |  | [optional] [default to undefined]
**reportedBy** | **number** |  | [optional] [default to undefined]
**reportedByName** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { InvestigationOrderResponse } from './api';

const instance: InvestigationOrderResponse = {
    id,
    orderNumber,
    appointmentId,
    patientId,
    patientName,
    orderedBy,
    orderedByName,
    orderType,
    testName,
    testCode,
    status,
    clinicalNotes,
    urgency,
    resultValue,
    resultUnit,
    resultStatus,
    resultReportUrl,
    resultNotes,
    orderedAt,
    sampleCollectedAt,
    resultReportedAt,
    reportedBy,
    reportedByName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
