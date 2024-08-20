# Data model

## User

id: uuid
email: string
password: string
username: string
emailVerificationToken: string | null
emailVerified: boolean
images: Image[]
emailNotifications: boolean

## Image

id: uuid
url: string
authot: User
comments: Comment[]
likes: Like[]
createdAt: Date

## Comment

id: uuid
comment: string
author: User
image: Image
createdAt: Date

## Like

id: uuid
author: User
image: Image