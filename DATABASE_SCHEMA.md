# Mail Tracker - Database Schema Documentation

## Overview

The Mail Tracker application uses **MongoDB** with **Mongoose** ORM as its database layer. The database stores user accounts, email tracking data, and engagement metrics (opens and clicks).

## Database Collections

### 1. Users Collection

Stores user account information for authentication and authorization.

**Collection Name:** `users`

**Schema:**

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required),
  createdAt: Date (default: Date.now)
}
```

**Fields:**

- `_id`: Unique MongoDB ObjectId
- `name`: User's full name
- `email`: User's email address (unique index)
- `password`: Bcrypt hashed password
- `createdAt`: Account creation timestamp

**Indexes:**

- `email` (unique)
- `createdAt`

---

### 2. Emails Collection

Stores metadata about emails sent through the tracking system.

**Collection Name:** `emails`

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  recipient: String (required),
  subject: String (required),
  content: String (required),
  trackingId: String (required, unique),
  sentAt: Date (default: Date.now)
}
```

**Fields:**

- `_id`: Unique MongoDB ObjectId
- `userId`: Reference to the User who sent the email
- `recipient`: Recipient's email address
- `subject`: Email subject line
- `content`: Email body content
- `trackingId`: Unique tracking identifier (UUID) for this email
- `sentAt`: Timestamp when email was sent

**Indexes:**

- `trackingId` (unique)
- `userId`
- `sentAt`

---

### 3. Open Events Collection

Records when and how emails were opened by recipients.

**Collection Name:** `openevents`

**Schema:**

```javascript
{
  _id: ObjectId,
  emailId: ObjectId (ref: Email, required),
  openedAt: Date (default: Date.now),
  ipAddress: String,
  userAgent: String,
  deviceType: String,
  browser: String,
  operatingSystem: String
}
```

**Fields:**

- `_id`: Unique MongoDB ObjectId
- `emailId`: Reference to the Email document
- `openedAt`: Timestamp when email was opened
- `ipAddress`: Recipient's IP address
- `userAgent`: Browser user agent string
- `deviceType`: Device type (Desktop, Mobile, Tablet)
- `browser`: Browser name (Chrome, Firefox, Safari, etc.)
- `operatingSystem`: OS name (Windows, MacOS, Linux, iOS, Android)

**Indexes:**

- `emailId`
- `openedAt`

---

### 4. Click Events Collection

Records when recipients click on links within tracked emails.

**Collection Name:** `clickevents`

**Schema:**

```javascript
{
  _id: ObjectId,
  emailId: ObjectId (ref: Email, required),
  clickedAt: Date (default: Date.now),
  originalUrl: String (required),
  ipAddress: String,
  userAgent: String,
  deviceType: String,
  browser: String,
  operatingSystem: String
}
```

**Fields:**

- `_id`: Unique MongoDB ObjectId
- `emailId`: Reference to the Email document
- `clickedAt`: Timestamp when link was clicked
- `originalUrl`: The URL that was clicked
- `ipAddress`: Recipient's IP address
- `userAgent`: Browser user agent string
- `deviceType`: Device type (Desktop, Mobile, Tablet)
- `browser`: Browser name
- `operatingSystem`: OS name

**Indexes:**

- `emailId`
- `clickedAt`

---

## Relationships

```
User (1) ──── (N) Email
           └── Contains metadata about sent emails

Email (1) ──── (N) OpenEvent
           └── Records of email opens

Email (1) ──── (N) ClickEvent
           └── Records of link clicks
```

---

## Data Flow

1. **User Registration/Login**
   - User data stored in `users` collection
   - Password is hashed using bcryptjs

2. **Sending Email**
   - Email metadata stored in `emails` collection
   - Unique `trackingId` (UUID) is generated and stored

3. **Email Opened**
   - Open event recorded in `openevents` collection
   - Linked to email via `emailId`
   - Device and browser information captured

4. **Link Clicked**
   - Click event recorded in `clickevents` collection
   - Linked to email via `emailId`
   - Original URL and device info captured

---

## Analytics Aggregations

### Total Opens by Email

```javascript
db.openevents.aggregate([
  { $match: { emailId: ObjectId } },
  { $group: { _id: "$emailId", total: { $sum: 1 } } },
]);
```

### Unique Opens (by IP)

```javascript
db.openevents.aggregate([
  { $match: { emailId: ObjectId } },
  { $group: { _id: { emailId: "$emailId", ip: "$ipAddress" } } },
  { $count: "uniqueOpens" },
]);
```

### Opens by Device Type

```javascript
db.openevents.aggregate([
  { $match: { emailId: ObjectId } },
  { $group: { _id: "$deviceType", count: { $sum: 1 } } },
]);
```

### Click Through Rate

```javascript
db.emails.aggregate([
  { $match: { userId: ObjectId } },
  { $lookup: { from: "clickevents", localField: "_id", foreignField: "emailId", as: "clicks" } },
  { $lookup: { from: "openevents", localField: "_id", foreignField: "emailId", as: "opens" } },
  {
    $group: {
      _id: null,
      totalEmails: { $sum: 1 },
      totalOpens: { $sum: { $size: "$opens" } },
      totalClicks: { $sum: { $size: "$clicks" } },
    },
  },
  {
    $project: {
      _id: 0,
      totalEmails: 1,
      totalOpens: 1,
      totalClicks: 1,
      openRate: { $divide: [{ $multiply: ["$totalOpens", 100] }, "$totalEmails"] },
      clickRate: { $divide: [{ $multiply: ["$totalClicks", 100] }, "$totalEmails"] },
    },
  },
]);
```

---

## Database Configuration

**Environment Variables:**

```
MONGO_URI=mongodb://127.0.0.1:27017/mailtracker
USE_MEMORY_DB=true  # Set to false for production MongoDB
JWT_SECRET=supersecretjwtkey
```

---

## Best Practices

1. **Indexing**: All foreign key references and timestamp fields should be indexed for query performance
2. **Archival**: Consider archiving old email and event records after 1 year
3. **Unique Constraints**: Email tracking requires unique tracking IDs to prevent duplicate counts
4. **TTL Indexes**: Consider adding TTL indexes to delete old event records automatically
5. **Pagination**: Use indexed fields for efficient pagination in analytics queries

---

## Future Enhancements

- Add `bounceStatus` field to Email collection
- Add `unsubscribe` field to User collection
- Add `attachments` array to Email collection
- Add TTL indexes for automatic data retention policies
- Add compound indexes for common query patterns
