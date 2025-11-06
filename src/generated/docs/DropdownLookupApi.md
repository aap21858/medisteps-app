# DropdownLookupApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createDropdowns**](#createdropdowns) | **POST** /api/dropdowns | Create multiple dropdown lookup entries|
|[**deleteDropdownById**](#deletedropdownbyid) | **DELETE** /api/dropdowns/{id} | Delete dropdown lookup entry|
|[**getAllDropdowns**](#getalldropdowns) | **GET** /api/dropdowns | Get all dropdown entries|
|[**getDropdownById**](#getdropdownbyid) | **GET** /api/dropdowns/{id} | Get dropdown by ID|
|[**getDropdownsByType**](#getdropdownsbytype) | **GET** /api/dropdowns/type/{type} | Get dropdown values by type|
|[**patchDropdown**](#patchdropdown) | **PATCH** /api/dropdowns/{id} | Partially update dropdown lookup entry|
|[**updateDropdown**](#updatedropdown) | **PUT** /api/dropdowns/{id} | Update dropdown lookup entry|

# **createDropdowns**
> Array<DropdownLookupResponse> createDropdowns(dropdownLookupRequest)

Insert multiple lookup records (bulk). Each record must contain type and code.

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

let dropdownLookupRequest: Array<DropdownLookupRequest>; //

const { status, data } = await apiInstance.createDropdowns(
    dropdownLookupRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dropdownLookupRequest** | **Array<DropdownLookupRequest>**|  | |


### Return type

**Array<DropdownLookupResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created successfully |  -  |
|**400** | Invalid input |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteDropdownById**
> deleteDropdownById()

Permanently delete a dropdown lookup entry

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

let id: number; //Dropdown lookup ID (default to undefined)

const { status, data } = await apiInstance.deleteDropdownById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Dropdown lookup ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Deleted successfully |  -  |
|**404** | Entry not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllDropdowns**
> Array<DropdownLookupResponse> getAllDropdowns()

Retrieve all dropdown lookup entries

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

const { status, data } = await apiInstance.getAllDropdowns();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<DropdownLookupResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDropdownById**
> DropdownLookupResponse getDropdownById()

Retrieve a specific dropdown lookup entry by its ID

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

let id: number; //Dropdown lookup ID (default to undefined)

const { status, data } = await apiInstance.getDropdownById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Dropdown lookup ID | defaults to undefined|


### Return type

**DropdownLookupResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Entry not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDropdownsByType**
> Array<DropdownLookupResponse> getDropdownsByType()

Retrieve dropdown lookup entries for a given type. Use query param \'active\' to filter only active values.

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

let type: string; //Lookup type (e.g., INSURANCE_SCHEME, GENDER) (default to undefined)
let active: boolean; //When true, only active entries are returned. When false, only inactive entries. If omitted, returns all. (optional) (default to undefined)

const { status, data } = await apiInstance.getDropdownsByType(
    type,
    active
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**string**] | Lookup type (e.g., INSURANCE_SCHEME, GENDER) | defaults to undefined|
| **active** | [**boolean**] | When true, only active entries are returned. When false, only inactive entries. If omitted, returns all. | (optional) defaults to undefined|


### Return type

**Array<DropdownLookupResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | No entries found for the given type |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **patchDropdown**
> DropdownLookupResponse patchDropdown(requestBody)

Update specific fields of an existing dropdown lookup entry

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

let id: number; //Dropdown lookup ID (default to undefined)
let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.patchDropdown(
    id,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |
| **id** | [**number**] | Dropdown lookup ID | defaults to undefined|


### Return type

**DropdownLookupResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Updated successfully |  -  |
|**404** | Entry not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateDropdown**
> DropdownLookupResponse updateDropdown(dropdownLookupRequest)

Update an existing dropdown lookup entry

### Example

```typescript
import {
    DropdownLookupApi,
    Configuration,
    DropdownLookupRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DropdownLookupApi(configuration);

let id: number; //Dropdown lookup ID (default to undefined)
let dropdownLookupRequest: DropdownLookupRequest; //

const { status, data } = await apiInstance.updateDropdown(
    id,
    dropdownLookupRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dropdownLookupRequest** | **DropdownLookupRequest**|  | |
| **id** | [**number**] | Dropdown lookup ID | defaults to undefined|


### Return type

**DropdownLookupResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Updated successfully |  -  |
|**404** | Entry not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

