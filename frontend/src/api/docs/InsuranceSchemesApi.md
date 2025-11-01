# InsuranceSchemesApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllActiveSchemes**](#getallactiveschemes) | **GET** /api/insurance-schemes | Get all active insurance schemes|
|[**getSchemesByType**](#getschemesbytype) | **GET** /api/insurance-schemes/type/{schemeType} | Get schemes by type|

# **getAllActiveSchemes**
> Array<InsuranceScheme> getAllActiveSchemes()

Retrieve all active insurance schemes ordered by display order

### Example

```typescript
import {
    InsuranceSchemesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InsuranceSchemesApi(configuration);

const { status, data } = await apiInstance.getAllActiveSchemes();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InsuranceScheme>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Insurance schemes retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSchemesByType**
> Array<InsuranceScheme> getSchemesByType()

Get GOVERNMENT or PRIVATE insurance schemes

### Example

```typescript
import {
    InsuranceSchemesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InsuranceSchemesApi(configuration);

let schemeType: 'GOVERNMENT' | 'PRIVATE'; //Scheme type (GOVERNMENT or PRIVATE) (default to undefined)

const { status, data } = await apiInstance.getSchemesByType(
    schemeType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **schemeType** | [**&#39;GOVERNMENT&#39; | &#39;PRIVATE&#39;**]**Array<&#39;GOVERNMENT&#39; &#124; &#39;PRIVATE&#39;>** | Scheme type (GOVERNMENT or PRIVATE) | defaults to undefined|


### Return type

**Array<InsuranceScheme>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Schemes retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

