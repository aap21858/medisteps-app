# AuthenticationApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**login**](#login) | **POST** /api/auth/login | User login|
|[**setPassword**](#setpassword) | **POST** /api/auth/set-password | Set/Reset password|
|[**validateToken**](#validatetoken) | **GET** /api/auth/validate | Validate JWT token|

# **login**
> LoginResponse login(loginRequest)

Authenticate user and receive JWT token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**LoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful |  -  |
|**400** | Invalid credentials |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setPassword**
> SetPassword200Response setPassword(setPasswordRequest)

Set password for new user or reset forgotten password

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    SetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let setPasswordRequest: SetPasswordRequest; //

const { status, data } = await apiInstance.setPassword(
    setPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setPasswordRequest** | **SetPasswordRequest**|  | |


### Return type

**SetPassword200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password set successfully |  -  |
|**400** | Invalid or expired token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **validateToken**
> ValidateToken200Response validateToken()

Validate if the provided JWT token is valid

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.validateToken();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ValidateToken200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token is valid |  -  |
|**401** | Invalid or expired token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

