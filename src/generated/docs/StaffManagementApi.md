# StaffManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteStaff**](#deletestaff) | **DELETE** /api/staff/{id} | Delete staff member|
|[**getAllStaff**](#getallstaff) | **GET** /api/staff/ | Get all staff members|
|[**getStaffById**](#getstaffbyid) | **GET** /api/staff/{id} | Get staff by ID|
|[**registerStaff**](#registerstaff) | **POST** /api/admin/register | Register new staff member|
|[**updateStaff**](#updatestaff) | **PUT** /api/staff/{id} | Update staff member|

# **deleteStaff**
> DeleteStaff200Response deleteStaff()

Delete staff member (Admin only)

### Example

```typescript
import {
    StaffManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteStaff(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**DeleteStaff200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Staff deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllStaff**
> Array<StaffResponse> getAllStaff()

Retrieve all staff members (Admin only)

### Example

```typescript
import {
    StaffManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffManagementApi(configuration);

const { status, data } = await apiInstance.getAllStaff();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<StaffResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Staff list retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStaffById**
> StaffResponse getStaffById()

Retrieve staff member details by ID

### Example

```typescript
import {
    StaffManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getStaffById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StaffResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Staff member found |  -  |
|**404** | Staff not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerStaff**
> RegisterStaff200Response registerStaff(staffRegistrationRequest)

Register new staff/admin user (Admin only)

### Example

```typescript
import {
    StaffManagementApi,
    Configuration,
    StaffRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffManagementApi(configuration);

let staffRegistrationRequest: StaffRegistrationRequest; //

const { status, data } = await apiInstance.registerStaff(
    staffRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffRegistrationRequest** | **StaffRegistrationRequest**|  | |


### Return type

**RegisterStaff200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Staff registered successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStaff**
> UpdateStaff200Response updateStaff(staffUpdateRequest)

Update staff member details (Admin only)

### Example

```typescript
import {
    StaffManagementApi,
    Configuration,
    StaffUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffManagementApi(configuration);

let id: number; // (default to undefined)
let staffUpdateRequest: StaffUpdateRequest; //

const { status, data } = await apiInstance.updateStaff(
    id,
    staffUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffUpdateRequest** | **StaffUpdateRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UpdateStaff200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Staff updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

