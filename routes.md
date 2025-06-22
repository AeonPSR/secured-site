# API Routes Documentation

---

## `auth.js` – Authentication

### `POST /api/auth/register`
- **Description**: Register a new user
- **Access**: Public
- **Body**:
  ```json
  { "email": "user@mail.com", "username": "john", "password": "1234" }
  ```
- **Response**:
  - `201 Created` if successful
  - `409 Conflict` if email exists

---

### `POST /api/auth/login`
- **Description**: Log in an existing user
- **Access**: Public
- **Body**:
  ```json
  { "email": "user@mail.com", "password": "1234" }
  ```
- **Response**:
  - `200 OK` + session cookie
  - `401 Unauthorized` if credentials fail

---

### `POST /api/auth/logout`
- **Description**: Log out the current user
- **Access**: Authenticated
- **Headers**:
  - Requires valid session
  - CSRF-Token

---

### `GET /api/auth/me`
- **Description**: Get logged-in user's session info
- **Access**: Authenticated
- **Returns**:
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@mail.com",
      "username": "john",
      "role": "admin"
    }
  }
  ```

---

## `cart.js` – Cart Management

### `POST /api/cart/add`
- **Description**: Add product to cart
- **Access**: Authenticated
- **Body**:
  ```json
  { "product_id": 1, "quantity": 2 }
  ```

---

### `GET /api/cart`
- **Description**: Get user's cart contents
- **Access**: Authenticated

---

### `DELETE /api/cart/:id`
- **Description**: Remove one cart item by its cart ID
- **Access**: Authenticated

---

### `POST /api/cart/checkout`
- **Description**: Checkout and clear the cart
- **Access**: Authenticated

---

### `DELETE /api/cart/clear`
- **Description**: Clear the entire cart
- **Access**: Authenticated

---

## `products.js` – Product Management

### `GET /api/products`
- **Description**: Get all products
- **Access**: Public

---

### `GET /api/products/:id`
- **Description**: Get single product by ID
- **Access**: Public

---

### `POST /api/products`
- **Description**: Create a product
- **Access**: Admin only
- **Body**:
  ```json
  { "name": "Apple", "description": "Fresh", "price": 1.5, "image_url": "/apple.png" }
  ```

---

### `PUT /api/products/:id`
- **Description**: Update a product
- **Access**: Admin only
- **Body**:
  ```json
  { "name": "Apple", "description": "Green apple", "price": 1.6, "image_url": "/apple.png" }
  ```

---

### `DELETE /api/products/:id`
- **Description**: Delete a product
- **Access**: Admin only

---

## `users.js` – User Management

### `GET /api/users/me`
- **Description**: Get current user profile (from DB)
- **Access**: Authenticated

---

### `PUT /api/users/me`
- **Description**: Update your username
- **Access**: Authenticated
- **Body**:
  ```json
  { "username": "newname" }
  ```

---

### `GET /api/users`
- **Description**: List all users
- **Access**: Admin only

---

### `DELETE /api/users/:id`
- **Description**: Delete a user by ID
- **Access**: Admin only  
- **Note**: Cannot delete yourself