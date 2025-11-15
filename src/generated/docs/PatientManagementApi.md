# PatientManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activatePatient**](#activatepatient) | **PATCH** /api/patients/{id}/activate | Activate patient by ID|
|[**deletePatient**](#deletepatient) | **DELETE** /api/patients/{id} | Delete (deactivate) patient|
|[**downloadCsvTemplate**](#downloadcsvtemplate) | **GET** /api/patients/download-csv-template | Download CSV template|
|[**getAllPatients**](#getallpatients) | **GET** /api/patients | Get all patients (paginated)|
|[**getPatientById**](#getpatientbyid) | **GET** /api/patients/{id} | Get patient by ID|
|[**getPatientByPatientId**](#getpatientbypatientid) | **GET** /api/patients/patient-id/{patientId} | Get patient by Patient ID|
|[**registerPatient**](#registerpatient) | **POST** /api/patients | Register multiple patients (batch registration)|
|[**searchPatients**](#searchpatients) | **GET** /api/patients/search | Search patients|
|[**updatePatient**](#updatepatient) | **PUT** /api/patients/{id} | Update patient|
|[**uploadPatientsCsv**](#uploadpatientscsv) | **POST** /api/patients/upload-csv | Upload CSV file for bulk patient registration|

# **activatePatient**
> PatientResponse activatePatient()

Set patient status to ACTIVE

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let id: number; //Patient database ID (default to undefined)

const { status, data } = await apiInstance.activatePatient(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Patient database ID | defaults to undefined|


### Return type

**PatientResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patient activated successfully |  -  |
|**404** | Patient not found |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePatient**
> deletePatient()

Soft delete patient by setting status to INACTIVE

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let id: number; //Patient database ID (default to undefined)

const { status, data } = await apiInstance.deletePatient(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Patient database ID | defaults to undefined|


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
|**204** | Patient deactivated successfully |  -  |
|**404** | Patient not found |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **downloadCsvTemplate**
> File downloadCsvTemplate()

Download a CSV template file with proper headers for patient import

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

const { status, data } = await apiInstance.downloadCsvTemplate();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**File**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/csv


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | CSV template file |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllPatients**
> PatientPageResponse getAllPatients()

Retrieve paginated list of all patients

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let page: number; //Page number (0-indexed) (optional) (default to 0)
let size: number; //Number of items per page (optional) (default to 20)
let sort: string; //sort param (optional) (default to 'createdAt,desc')

const { status, data } = await apiInstance.getAllPatients(
    page,
    size,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number (0-indexed) | (optional) defaults to 0|
| **size** | [**number**] | Number of items per page | (optional) defaults to 20|
| **sort** | [**string**] | sort param | (optional) defaults to 'createdAt,desc'|


### Return type

**PatientPageResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patients retrieved successfully |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPatientById**
> PatientResponse getPatientById()

Retrieve patient details by database ID

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let id: number; //Patient database ID (default to undefined)

const { status, data } = await apiInstance.getPatientById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Patient database ID | defaults to undefined|


### Return type

**PatientResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patient found |  -  |
|**404** | Patient not found |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPatientByPatientId**
> PatientResponse getPatientByPatientId()

Retrieve patient details by Patient ID (e.g., SNG2025001)

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let patientId: string; //Patient ID (e.g., SNG2025001) (default to undefined)

const { status, data } = await apiInstance.getPatientByPatientId(
    patientId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patientId** | [**string**] | Patient ID (e.g., SNG2025001) | defaults to undefined|


### Return type

**PatientResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patient found |  -  |
|**404** | Patient not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerPatient**
> BatchPatientResponse registerPatient(patientRegistrationRequest)

Register one or more patients with personal, emergency, insurance, and medical details

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let patientRegistrationRequest: Array<PatientRegistrationRequest>; //

const { status, data } = await apiInstance.registerPatient(
    patientRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patientRegistrationRequest** | **Array<PatientRegistrationRequest>**|  | |


### Return type

**BatchPatientResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Patients registered successfully |  -  |
|**207** | Multi-status - Some patients registered, some failed |  -  |
|**400** | Invalid input data |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchPatients**
> PatientPageResponse searchPatients()

Search patients by name, patient ID, or mobile number

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let query: string; //Search query (name, patient ID, or mobile) (default to undefined)
let page: number; //Page number (0-indexed) (optional) (default to 0)
let size: number; //Number of items per page (optional) (default to 20)

const { status, data } = await apiInstance.searchPatients(
    query,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **query** | [**string**] | Search query (name, patient ID, or mobile) | defaults to undefined|
| **page** | [**number**] | Page number (0-indexed) | (optional) defaults to 0|
| **size** | [**number**] | Number of items per page | (optional) defaults to 20|


### Return type

**PatientPageResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Search results |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePatient**
> PatientResponse updatePatient(patientRegistrationRequest)

Update existing patient details

### Example

```typescript
import {
    PatientManagementApi,
    Configuration,
    PatientRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let id: number; //Patient database ID (default to undefined)
let patientRegistrationRequest: PatientRegistrationRequest; //

const { status, data } = await apiInstance.updatePatient(
    id,
    patientRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patientRegistrationRequest** | **PatientRegistrationRequest**|  | |
| **id** | [**number**] | Patient database ID | defaults to undefined|


### Return type

**PatientResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patient updated successfully |  -  |
|**404** | Patient not found |  -  |
|**400** | Invalid input data |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadPatientsCsv**
> CsvUploadResponse uploadPatientsCsv()

Upload a CSV file containing patient details for batch registration.  **CSV Format:** - First row must be headers (case-insensitive) - Required columns: firstName, lastName, dateOfBirth, gender, mobileNumber, city, pinCode - Optional columns: bloodGroup, aadharNumber, emailId, addressLine1, district, state  **Example CSV:** ``` firstName,lastName,dateOfBirth,gender,bloodGroup,mobileNumber,emailId,city,pinCode Rahul,Patil,1985-03-15,MALE,O+,9876543210,rahul@gmail.com,Sangli,416416 Priya,Sharma,1990-07-22,FEMALE,A+,9876543211,priya@gmail.com,Sangli,416416 ``` 

### Example

```typescript
import {
    PatientManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientManagementApi(configuration);

let file: File; //CSV file containing patient data (default to undefined)

const { status, data } = await apiInstance.uploadPatientsCsv(
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | CSV file containing patient data | defaults to undefined|


### Return type

**CsvUploadResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | CSV processed successfully (may contain partial failures) |  -  |
|**400** | Invalid CSV file or format |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

