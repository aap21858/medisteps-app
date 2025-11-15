# VitalsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**weight** | **number** | Weight in kg | [optional] [default to undefined]
**height** | **number** | Height in cm | [optional] [default to undefined]
**headCircumference** | **number** | Head circumference in cm (pediatric) | [optional] [default to undefined]
**temperature** | **number** |  | [optional] [default to undefined]
**temperatureUnit** | **string** |  | [optional] [default to TemperatureUnitEnum_F]
**heartRate** | **number** | Heart rate in bpm | [optional] [default to undefined]
**respiratoryRate** | **number** | Respiratory rate in breaths/min | [optional] [default to undefined]
**systolicBp** | **number** | Systolic BP in mmHg | [optional] [default to undefined]
**diastolicBp** | **number** | Diastolic BP in mmHg | [optional] [default to undefined]
**spo2** | **number** | Oxygen saturation % | [optional] [default to undefined]
**randomBloodSugar** | **number** | RBS in mg/dL | [optional] [default to undefined]
**bmi** | **number** | Body Mass Index | [optional] [default to undefined]
**bmiStatus** | **string** |  | [optional] [default to undefined]
**painLevel** | **number** | Pain level on 0-10 scale | [optional] [default to undefined]
**symptoms** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { VitalsRequest } from './api';

const instance: VitalsRequest = {
    weight,
    height,
    headCircumference,
    temperature,
    temperatureUnit,
    heartRate,
    respiratoryRate,
    systolicBp,
    diastolicBp,
    spo2,
    randomBloodSugar,
    bmi,
    bmiStatus,
    painLevel,
    symptoms,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
