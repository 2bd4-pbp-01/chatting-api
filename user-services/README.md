# User Services API Documentation

## Installation

Install the required packages:

```bash
npm install
```

To run the API service, navigate to the user-services directory and execute:

```bash
npm run api-service
```

## API Endpoints

> **Note**: Authentication token is required for most endpoints. To obtain a token, you must first register or login.

### Authentication

#### Register
- **URL**: `http://localhost:3000/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
      "username": "neonetz",
      "email": "neonetz@gmail.com",
      "password": "arisu123",
      "confPassword": "arisu123"
  }
  ```
- **Success Response**:
  ```json
  {
      "status_code": 201,
      "message": "Register Berhasil",
      "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
  }
  ```

#### Login
- **URL**: `http://localhost:3000/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
      "email": "neonetz@gmail.com",
      "password": "arisu123"
  }
  ```
- **Success Response**:
  ```json
  {
      "status_code": 200,
      "message": "Login Berhasil",
      "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
  }
  ```

#### Logout
- **URL**: `http://localhost:3000/logout`
- **Method**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**:
  ```json
  {
      "msg": "Anda telah logout"
  }
  ```

### User Management

#### Get Profile
- **URL**: `http://localhost:3000/me`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**:
  ```json
  {
      "status_code": 200,
      "message": "User Ditemukan",
      "data": {
          "id_users": 19,
          "username": "neonetz",
          "email": "neonetz@gmail.com",
          "tipe_user": "anggota"
      }
  }
  ```

### Operator Authority Endpoints

#### Get All Users
- **URL**: `http://localhost:3000/users`
- **Method**: `GET`
- **Required Role**: `operator`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### Get User by ID
- **URL**: `http://localhost:3000/users/:id`
- **Method**: `GET`
- **Required Role**: `operator`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### Create User
- **URL**: `http://localhost:3000/users`
- **Method**: `POST`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "username": "EvilFajri",
      "email": "windows@gmail.com",
      "password": "akuwindowsakubangga",
      "confPassword": "akuwindowsakubangga"
  }
  ```

#### Update User
- **URL**: `http://localhost:3000/users/:id`
- **Method**: `PATCH`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "username": "GoodFajri",
      "email": "Linux@gmail.com",
      "tipe_user": "manager"
  }
  ```

#### Update Password
- **URL**: `http://localhost:3000/users/:id/password`
- **Method**: `PATCH`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "password": "Exp@gmail.com",
      "confPassword": "Exp@gmail.com"
  }
  ```

#### Delete User
- **URL**: `http://localhost:3000/users/:id`
- **Method**: `DELETE`
- **Required Role**: `operator`

### Department Management

#### Create Department
- **URL**: `http://localhost:3000/departments`
- **Method**: `POST`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "nama_department": "Linux Department"
  }
  ```

#### Add User to Department
- **URL**: `http://localhost:3000/departments/addUser`
- **Method**: `POST`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "id_department": 6,
      "id_users": 5
  }
  ```

#### Remove User from Department
- **URL**: `http://localhost:3000/departments/removeUser`
- **Method**: `POST`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "id_department": 6,
      "id_users": 5
  }
  ```

#### Get All Departments
- **URL**: `http://localhost:3000/departments`
- **Method**: `GET`
- **Required Role**: `operator`

#### Get Department by ID
- **URL**: `http://localhost:3000/departments/:id`
- **Method**: `GET`
- **Required Role**: `operator`

#### Update Department
- **URL**: `http://localhost:3000/departments/:id`
- **Method**: `PATCH`
- **Required Role**: `operator`
- **Request Body**:
  ```json
  {
      "nama_department": "Windows Department"
  }
  ```

#### Delete Department
- **URL**: `http://localhost:3000/departments/:id`
- **Method**: `DELETE`
- **Required Role**: `operator`

> **Note**: All users must be removed from a department before it can be deleted.