# AppointmentManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**admitPatient**](#admitpatient) | **POST** /api/appointments/{appointmentId}/admit | Admit patient (Convert OPD to IPD)|
|[**cancelAppointment**](#cancelappointment) | **DELETE** /api/appointments/{id} | Cancel appointment|
|[**createAppointment**](#createappointment) | **POST** /api/appointments | Create new appointment|
|[**createInvestigationOrder**](#createinvestigationorder) | **POST** /api/appointments/{appointmentId}/investigations | Create investigation order|
|[**createOrUpdateTriage**](#createorupdatetriage) | **POST** /api/appointments/{appointmentId}/triage | Create or update triage data|
|[**createPrescription**](#createprescription) | **POST** /api/appointments/{appointmentId}/prescriptions | Create prescription|
|[**createReferral**](#createreferral) | **POST** /api/appointments/{appointmentId}/refer | Create referral|
|[**dischargePatient**](#dischargepatient) | **POST** /api/appointments/{appointmentId}/discharge | Discharge patient|
|[**getAllAppointments**](#getallappointments) | **GET** /api/appointments | Get all appointments|
|[**getAppointmentById**](#getappointmentbyid) | **GET** /api/appointments/{id} | Get appointment by ID|
|[**getExaminationByAppointment**](#getexaminationbyappointment) | **GET** /api/appointments/{appointmentId}/examination | Get examination|
|[**getInvestigationsByAppointment**](#getinvestigationsbyappointment) | **GET** /api/appointments/{appointmentId}/investigations | Get investigation orders|
|[**getPrescriptionById**](#getprescriptionbyid) | **GET** /api/prescriptions/{id} | Get prescription by ID|
|[**getPrescriptionsByAppointment**](#getprescriptionsbyappointment) | **GET** /api/appointments/{appointmentId}/prescriptions | Get prescriptions|
|[**getTriageByAppointment**](#gettriagebyappointment) | **GET** /api/appointments/{appointmentId}/triage | Get triage data|
|[**getVitalsByAppointment**](#getvitalsbyappointment) | **GET** /api/appointments/{appointmentId}/vitals | Get vitals|
|[**recordExamination**](#recordexamination) | **POST** /api/appointments/{appointmentId}/examination | Record examination|
|[**recordVitals**](#recordvitals) | **POST** /api/appointments/{appointmentId}/vitals | Record vitals|
|[**searchAppointments**](#searchappointments) | **GET** /api/appointments/search | Search appointments|
|[**updateAppointment**](#updateappointment) | **PUT** /api/appointments/{id} | Update appointment|
|[**updateAppointmentStatus**](#updateappointmentstatus) | **PATCH** /api/appointments/{id}/status | Update appointment status|
|[**updateInvestigationResult**](#updateinvestigationresult) | **PATCH** /api/investigations/{id}/result | Update investigation result|
|[**updatePrescriptionStatus**](#updateprescriptionstatus) | **PATCH** /api/prescriptions/{id}/status | Update prescription status|

# **admitPatient**
> AppointmentResponse admitPatient(admitRequest)

Admit patient for inpatient care, allocate bed

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    AdmitRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let admitRequest: AdmitRequest; //

const { status, data } = await apiInstance.admitPatient(
    appointmentId,
    admitRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **admitRequest** | **AdmitRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**AppointmentResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patient admitted successfully |  -  |
|**404** | Appointment not found |  -  |
|**400** | Invalid admission request (e.g., already admitted, bed unavailable) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cancelAppointment**
> cancelAppointment()

Cancel an appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.cancelAppointment(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Appointment cancelled successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createAppointment**
> AppointmentResponse createAppointment(appointmentRequest)

Schedule a new OPD or IPD appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    AppointmentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentRequest: AppointmentRequest; //

const { status, data } = await apiInstance.createAppointment(
    appointmentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentRequest** | **AppointmentRequest**|  | |


### Return type

**AppointmentResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Appointment created successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Access token is missing or invalid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createInvestigationOrder**
> InvestigationOrderResponse createInvestigationOrder(investigationOrderRequest)

Order pathology or radiology investigation

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    InvestigationOrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let investigationOrderRequest: InvestigationOrderRequest; //

const { status, data } = await apiInstance.createInvestigationOrder(
    appointmentId,
    investigationOrderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **investigationOrderRequest** | **InvestigationOrderRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**InvestigationOrderResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Investigation ordered successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createOrUpdateTriage**
> TriageResponse createOrUpdateTriage(triageRequest)

Record pre-consultation assessment by nurse or junior doctor

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    TriageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let triageRequest: TriageRequest; //

const { status, data } = await apiInstance.createOrUpdateTriage(
    appointmentId,
    triageRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **triageRequest** | **TriageRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**TriageResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Triage data recorded successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPrescription**
> PrescriptionResponse createPrescription(prescriptionRequest)

Create prescription with medication items

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    PrescriptionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let prescriptionRequest: PrescriptionRequest; //

const { status, data } = await apiInstance.createPrescription(
    appointmentId,
    prescriptionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **prescriptionRequest** | **PrescriptionRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**PrescriptionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Prescription created successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createReferral**
> AppointmentResponse createReferral(referralRequest)

Refer patient to another department or physician

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    ReferralRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let referralRequest: ReferralRequest; //

const { status, data } = await apiInstance.createReferral(
    appointmentId,
    referralRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referralRequest** | **ReferralRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**AppointmentResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Referral created and new appointment scheduled |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **dischargePatient**
> AppointmentResponse dischargePatient(dischargeRequest)

Discharge patient from IPD

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    DischargeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let dischargeRequest: DischargeRequest; //

const { status, data } = await apiInstance.dischargePatient(
    appointmentId,
    dischargeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dischargeRequest** | **DischargeRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**AppointmentResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Patient discharged successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllAppointments**
> AppointmentPageResponse getAllAppointments()

Retrieve all appointments with pagination

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let page: number; //Page number (0-indexed) (optional) (default to 0)
let size: number; //Number of items per page (optional) (default to 20)
let sort: string; //sort param (optional) (default to 'createdAt,desc')

const { status, data } = await apiInstance.getAllAppointments(
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

**AppointmentPageResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Appointments retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAppointmentById**
> AppointmentDetailResponse getAppointmentById()

Retrieve detailed appointment information

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; //Appointment ID (default to undefined)

const { status, data } = await apiInstance.getAppointmentById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Appointment ID | defaults to undefined|


### Return type

**AppointmentDetailResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Appointment found |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getExaminationByAppointment**
> ExaminationResponse getExaminationByAppointment()

Retrieve examination data for an appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)

const { status, data } = await apiInstance.getExaminationByAppointment(
    appointmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**ExaminationResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Examination retrieved |  -  |
|**404** | Examination not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInvestigationsByAppointment**
> Array<InvestigationOrderResponse> getInvestigationsByAppointment()

Retrieve all investigation orders for an appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)

const { status, data } = await apiInstance.getInvestigationsByAppointment(
    appointmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<InvestigationOrderResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Investigations retrieved |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPrescriptionById**
> PrescriptionResponse getPrescriptionById()

Retrieve prescription details

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getPrescriptionById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**PrescriptionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prescription found |  -  |
|**404** | Prescription not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPrescriptionsByAppointment**
> Array<PrescriptionResponse> getPrescriptionsByAppointment()

Retrieve all prescriptions for an appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)

const { status, data } = await apiInstance.getPrescriptionsByAppointment(
    appointmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<PrescriptionResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prescriptions retrieved |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTriageByAppointment**
> TriageResponse getTriageByAppointment()

Retrieve triage data for an appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)

const { status, data } = await apiInstance.getTriageByAppointment(
    appointmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**TriageResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Triage data retrieved |  -  |
|**404** | Triage data not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getVitalsByAppointment**
> Array<VitalsResponse> getVitalsByAppointment()

Retrieve all vitals records for an appointment

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)

const { status, data } = await apiInstance.getVitalsByAppointment(
    appointmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<VitalsResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Vitals retrieved |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordExamination**
> ExaminationResponse recordExamination(examinationRequest)

Record doctor\'s examination findings and diagnosis

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    ExaminationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let examinationRequest: ExaminationRequest; //

const { status, data } = await apiInstance.recordExamination(
    appointmentId,
    examinationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **examinationRequest** | **ExaminationRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**ExaminationResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Examination recorded successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordVitals**
> VitalsResponse recordVitals(vitalsRequest)

Record patient vitals during triage

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    VitalsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let appointmentId: number; // (default to undefined)
let vitalsRequest: VitalsRequest; //

const { status, data } = await apiInstance.recordVitals(
    appointmentId,
    vitalsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vitalsRequest** | **VitalsRequest**|  | |
| **appointmentId** | [**number**] |  | defaults to undefined|


### Return type

**VitalsResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Vitals recorded successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchAppointments**
> AppointmentPageResponse searchAppointments()

Search appointments by patient name, ID, contact, date, physician, or status

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let patientName: string; //Patient name (partial match) (optional) (default to undefined)
let patientId: number; //Patient ID (optional) (default to undefined)
let contactNumber: string; //Patient contact number (optional) (default to undefined)
let appointmentDate: string; //Appointment date (YYYY-MM-DD) (optional) (default to undefined)
let physicianId: number; //Physician ID (optional) (default to undefined)
let status: AppointmentStatus; //Appointment status (optional) (default to undefined)
let page: number; //Page number (0-indexed) (optional) (default to 0)
let size: number; //Number of items per page (optional) (default to 20)

const { status, data } = await apiInstance.searchAppointments(
    patientName,
    patientId,
    contactNumber,
    appointmentDate,
    physicianId,
    status,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patientName** | [**string**] | Patient name (partial match) | (optional) defaults to undefined|
| **patientId** | [**number**] | Patient ID | (optional) defaults to undefined|
| **contactNumber** | [**string**] | Patient contact number | (optional) defaults to undefined|
| **appointmentDate** | [**string**] | Appointment date (YYYY-MM-DD) | (optional) defaults to undefined|
| **physicianId** | [**number**] | Physician ID | (optional) defaults to undefined|
| **status** | **AppointmentStatus** | Appointment status | (optional) defaults to undefined|
| **page** | [**number**] | Page number (0-indexed) | (optional) defaults to 0|
| **size** | [**number**] | Number of items per page | (optional) defaults to 20|


### Return type

**AppointmentPageResponse**

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

# **updateAppointment**
> AppointmentResponse updateAppointment(appointmentRequest)

Update existing appointment details

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    AppointmentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; // (default to undefined)
let appointmentRequest: AppointmentRequest; //

const { status, data } = await apiInstance.updateAppointment(
    id,
    appointmentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appointmentRequest** | **AppointmentRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AppointmentResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Appointment updated successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAppointmentStatus**
> AppointmentResponse updateAppointmentStatus(updateAppointmentStatusRequest)

Change appointment status (e.g., WAITING, IN_CONSULTATION, etc.)

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    UpdateAppointmentStatusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; // (default to undefined)
let updateAppointmentStatusRequest: UpdateAppointmentStatusRequest; //

const { status, data } = await apiInstance.updateAppointmentStatus(
    id,
    updateAppointmentStatusRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAppointmentStatusRequest** | **UpdateAppointmentStatusRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AppointmentResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Status updated successfully |  -  |
|**404** | Appointment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateInvestigationResult**
> InvestigationOrderResponse updateInvestigationResult(investigationResultRequest)

Record investigation result and report

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    InvestigationResultRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; // (default to undefined)
let investigationResultRequest: InvestigationResultRequest; //

const { status, data } = await apiInstance.updateInvestigationResult(
    id,
    investigationResultRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **investigationResultRequest** | **InvestigationResultRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**InvestigationOrderResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Result updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePrescriptionStatus**
> PrescriptionResponse updatePrescriptionStatus(updatePrescriptionStatusRequest)

Change prescription status (DRAFT, PRESCRIBED, DISPENSED)

### Example

```typescript
import {
    AppointmentManagementApi,
    Configuration,
    UpdatePrescriptionStatusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AppointmentManagementApi(configuration);

let id: number; // (default to undefined)
let updatePrescriptionStatusRequest: UpdatePrescriptionStatusRequest; //

const { status, data } = await apiInstance.updatePrescriptionStatus(
    id,
    updatePrescriptionStatusRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePrescriptionStatusRequest** | **UpdatePrescriptionStatusRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**PrescriptionResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Status updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

