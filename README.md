# How to Build a CometChat UI Kit with Threaded Messages

## What You'll Be Building

![Chat UI Screenshot](https://github.com/HADES248/CometChat-threadedMessages/blob/master/src/assets/threadedMessages.png)  
*Alt text: Screenshot of a working CometChat-powered React app with a user logged in and threaded chat visible*

You’ll build a React TypeScript application using CometChat’s official UI Kit that supports threaded messages. Users will be able to log in, view conversations, reply to specific messages, and engage in real-time threaded messaging.

---

## Introduction

In this guide, you’ll integrate **threaded message support** using CometChat’s React UI Kit.

Threads enable replying to specific messages inside conversations, making chats more organized and contextual — especially useful for group chats or complex discussions.

---

## Prerequisites

**Knowledge Required**
- React basics (hooks, JSX, component state)
- TypeScript and ES6+
- Familiarity with `vite` and component folder structures

**Tools Required**
- Node.js v16+
- npm v8+
- Git (optional)
- Code editor like VS Code

---

## CometChat Integration

### Step 1: Set Up Your Basic UI Kit

Before Implementing Threaded Messages, Ensure you have successfully implemented the CometChat UI Kit

- [https://github.com/HADES248/CometChatReact-UI-Kit]

### Step 2: Setting Up the Application

After setting up the base app, replace the default App.tsx and App.css with the versions from this repository to enable threaded messaging:

- App.tsx
  - [https://github.com/HADES248/CometChat-threadedMessages/blob/master/src/App.tsx]
- App.css
  - [https://github.com/HADES248/CometChat-threadedMessages/blob/master/src/App.css]
  
---

These updated files contain:

- UI layout for threaded messages

- Event handling for thread open/close

- Integrated CometChat components like CometChatMessages, CometChatThreadedMessages, etc.

### Step 3: Setting Up Your Threaded Messages

To enable threaded messages, copy and paste the necessary files from the repository:

- CometChatThreadedMessages.tsx
  - [https://github.com/HADES248/CometChat-threadedMessages/blob/master/src/components/CometChatThreadMessages/CometChatThreadedMessage.tsx]
- CometChatThreadedMessages.css
  - [https://github.com/HADES248/CometChat-threadedMessages/blob/master/src/components/CometChatThreadMessages/CometChatThreadedMessage.css]
 

## Step 4: Test & Verify

### Testing
1. Start the development server:
   ```bash
   npm run dev
   ```
- Log in with valid credentials
- Select a conversation
- Send and reply to messages using threads in real time


  
