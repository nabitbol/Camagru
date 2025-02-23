# Endpoints

## POST /signup

**request body**
```ts
{
    email: string
    username: string
    passwor: string   
}
```

## POST /signup/verify-email

**request body**
```ts
{
    token: string 
}
```

## POST /signin

**request body**
```ts
{
    email: string
    passwor: string   
}
```

## POST /reset-password/send

**request body**
```ts
{
    email: string  
}
```

## POST /reset-password/verify

**request body**
```ts
{
    password: string  
}
```

## GET /images/

**response body**
```ts
{
    url: string
    author: string
    liked: boolean
    likes: number
    comments: number
}
```

## GET /images/:id

**response body**
```ts
{
    url: string
    author: string
    liked: boolean
    likes: number
    comments: comment[]
}
```

## POST /images/:id/comment

**request body**
```ts
{
    comments: string
}
```

## POST /images/:id/toggle-like

## POST /images

## GET /profile

**response body**
```ts
{
    email: string
    username: boolean
    emailNotifications: boolean
}
```

## POST /profile

**request body**
```ts
{
    email: string
    username: boolean
    emailNotifications: boolean
}
```
