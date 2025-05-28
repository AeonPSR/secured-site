## POST auth/register 
{
  "email": "user@example.com",
  "username": "myuser",
  "password": "securepass123"
}

## POST auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}

## GET products/
## GET products/{id}

# Need login
## POST auth/logout {}
## GET auth/me

# Need admin
## POST products/
{
  "name": "New Product",
  "description": "Details",
  "price": 49.99,
  "image_url": "https://example.com/image.png"
}

## PUT products/{id} (Update existing)
{
  "name": "Updated Product",
  "description": "Updated description",
  "price": 59.99,
  "image_url": "https://example.com/image2.png"
}

## DELETE products/{id}