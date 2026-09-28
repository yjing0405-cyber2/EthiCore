# EthiCore Technical Background and Recent Development Updates

## 3.0 Technical Background

### 3.1 Development

#### 3.1.1 Hardware

- A. Laptop or Personal Computer: The proponents used laptops and desktop computers to develop the system. Laptops provided the flexibility required for remote collaboration, presentations, and software debugging, while desktop computers offered the computational power needed for project compilation, testing, and optimization.
- B. Mobile Devices: Android and iOS smartphones were used to verify cross-platform compatibility, responsive layouts, and overall application stability. These devices were also used to evaluate the readability of content under varying screen sizes, orientations, and aspect ratios.

#### 3.1.2 Software

- A. Development Tools
  - A1. Visual Studio Code: The primary Integrated Development Environment (IDE) used by the proponents. It was selected because of its lightweight performance, code intelligence features, debugging tools, and extension ecosystem that supports efficient mobile application development.
  - A2. Expo Framework: The mobile application was built using Expo, a framework built around React Native. It simplified cross-platform mobile app development by offering fast project setup, built-in device testing tools, and native API support.
  - A3. Expo Go (SDK 54): Used as the main real-time testing tool during development. Expo Go allowed the app to run on physical Android and iOS devices using QR code scanning and live reloading, enabling faster iteration cycles and immediate UI validation.
  - A4. Orbit: Used as an emulator management utility to run and test the application across multiple virtual device profiles directly inside the development environment.

- B. Front End
  - B1. React Native: The core UI framework used to build the system's mobile interface. It enabled component-based design, responsive rendering, and consistent behavior across Android and iOS devices.
  - B2. JavaScript / TypeScript: JavaScript was used for application logic, interactivity, and state management, while the project also uses TypeScript for stronger type safety and maintainability across screens, services, and utilities.

- C. Back End & Services
  - C1. Vercel Serverless API: Vercel hosts the secure server-side endpoint that receives evaluation requests from the mobile application. It acts as the integration layer between the Expo application and Google Generative AI. The endpoint validates the request, applies basic rate limiting, selects an available configured API key, sends the prompt to Gemini, validates the returned JSON, and sends the evaluation result back to the application.
  - C2. Google Generative AI: Gemini is accessed through its HTTPS `generateContent` interface. Gemini analyzes the selected decision, scenario details, and relevant course context, then returns a structured evaluation containing a verdict, reasoning, confidence score, recommendations, consequences, benefits, and ethical principles.
  - C3. Credential Protection: Google API keys are stored as hidden Vercel environment variables, such as `GOOGLE_GENAI_API_KEY` and numbered key variants. They are not included in the Expo bundle or exposed to mobile users. The mobile application contains only the public HTTPS URL of the Vercel endpoint.
  - C4. Remote Evaluation Requirement: Scenario evaluations require an available internet connection and Google Generative AI quota. When the service is unavailable, the application presents an evaluation error instead of silently producing a local AI result.

- D. Design Tools
  - D1. Adobe Photoshop: Used for the editing and optimization of visual assets such as icons, cover images, and interface graphics.
  - D2. Draw.io: Used to create system diagrams, module flowcharts, and documentation representations of the application architecture.

- E. Version Control
  - E1. Git: Used to track code changes, manage versions, and support branching during development.
  - E2. GitHub: Used as the online repository and collaboration platform for project tracking, code review, and source control management.

- F. Web Browsers
  - The application was reviewed using Google Chrome, Mozilla Firefox, Microsoft Edge, Opera, and Brave for responsiveness checks, UI consistency, and browser compatibility validation during web-related review and testing.

#### 3.1.3 Peopleware

- A. The Proponents: Responsible for research, system analysis, user interface design, software prototyping, testing, and final implementation.
  - A1. Project Manager: Oversees the schedule, task assignments, collaboration flow, and overall system progress.
  - A2. Programmer: Responsible for implementing application logic, integrating APIs, and ensuring the software functions properly across modules.
  - A3. Co-Programmer: Contributes to coding support, debugging, and overall system validation.
  - A4. System Analyst: Interprets requirements, translates them into technical specifications, and aligns the system with the learning objectives.
- B. Capstone Adviser: Mr. Koby C. Macale provided continuous technical oversight, academic supervision, and project feedback to ensure quality output.
- C. Resource Persons: Mr. Adrian A. Atienza and other CCS instructors provided academic guidance, subject recommendations, and validation that the system met curricular standards.

#### 3.1.4 Network

- A. Network Connectivity: A stable internet connection was required during the development and testing phases for API validation, AI service access, and synchronization of application features. Local connectivity and staging environments were used to simulate interactions between the mobile app and its supporting services before deployment.

### 3.2 Implementation

#### 3.2.1 Hardware

- A. Mobile Devices: End-users access the application through physical mobile devices to read lessons, complete activities, and track learning progress. The application was optimized for standard mobile use and tested on multiple devices with varied screen sizes and resolutions.
  - A1. Android Devices
    - Operating System: Android 10.0 or higher
    - RAM: 2 GB or higher
    - Storage: 16 GB or higher available space
    - Processor: Quad-core 1.8 GHz or higher
  - A2. iOS Devices
    - Operating System: iOS 12 or higher
    - RAM: 2 GB or higher
    - Storage: 16 GB or higher available space
    - Processor: Apple A9 chip or higher

#### 3.2.2 Software

- A. Android OS: Android 10.0 or later is required for smooth execution of the application on supported devices.
- B. iOS: iOS 12 or later is required to run the app smoothly on compatible iPhones and iPads.
- C. Google Play Store: Used as the primary distribution channel for Android users, allowing secure installation and updates.
- D. Apple App Store: Used as the deployment channel for iOS users, ensuring compatibility with Apple’s platform requirements and security protocols.
- E. Device Compatibility and Responsive Design: The app underwent adjustments to support different screen heights, resolutions, and small-phone layouts without content clipping or distorted text rendering.

#### 3.2.3 Peopleware

- A. Students (Users): The primary users of the platform. They access the lessons, track their academic progress, and complete learning activities embedded in the system.
- B. CCS Faculty: Secondary users who evaluate and monitor student progress, curriculum alignment, and the overall educational effectiveness of the application.
- C. System Maintainers and Developers: The proponents and project stakeholders continue to maintain, refine, and improve the system after development and deployment.

#### 3.2.4 Network

- A. AI Infrastructure: The EthiCore application communicates with Google Generative AI through a Vercel serverless API. Vercel provides the public HTTPS entry point and keeps provider credentials outside the mobile application, while the Gemini API performs the actual model inference.
- B. Evaluation Request Flow:
  - B1. The learner selects a decision and requests an evaluation in the mobile application.
  - B2. `src/services/geminiBridge.ts` sends the decision, scenario, and relevant course context to the HTTPS Vercel endpoint.
  - B3. The Vercel function validates the request and applies request throttling to reduce abuse and unnecessary quota consumption.
  - B4. The function selects a configured Google API key and calls the configured Gemini model through the HTTPS `generateContent` API.
  - B5. Gemini returns a JSON evaluation. The server validates the response structure before returning it to the mobile application.
  - B6. The application displays the verdict, reasoning, recommendations, possible consequences, possible benefits, and related principles to the learner.
- C. Key and Model Switching: The server can rotate through numbered Google API keys, including `GOOGLE_GENAI_API_KEY`, `GOOGLE_GENAI_API_KEY_2`, and additional numbered keys. It can also try a configured list of Gemini models. This improves resilience when a key or model is unavailable, although keys belonging to the same Google Cloud project may share quota.
- D. Failure and Quota Handling: The API reports configuration errors, rate limits, quota exhaustion, and provider failures using appropriate HTTP responses. The mobile application retries temporary service failures and presents a clear evaluation error when the remote service cannot complete the request.
- E. Internet Dependency & Offline Constraints:
  - Online Operations: A stable internet connection is required for AI-driven features such as content evaluation, question generation, and other real-time learning support features.
  - Offline Limitations: When offline, AI-generated evaluation features and live content generation do not function.
  - Offline Operations: The application leverages local data caching to allow navigation of previously loaded content, static learning material, and local progress histories even without an active internet connection.

#### 3.2.5 AI Evaluation Architecture

Google AI Studio is used to manage Gemini credentials, model settings, and usage limits. The credentials are stored as protected Vercel environment variables rather than inside the Android or iOS application. The Vercel backend connects to Google Generative AI through its HTTPS API and serves as the controlled integration layer between the mobile client and the external model service.

When a learner submits an evaluation, the application sends the selected decision parameters, situational metadata, and relevant course context to the Vercel endpoint over HTTPS. The server validates the request, applies rate limiting, selects an available configured API key and model, and sends the structured prompt to Gemini. The model analyzes the decision in relation to the supplied course material and returns a structured evaluation object containing a formal verdict, rationale, confidence score, actionable recommendations, projected consequences, possible benefits, and related ethical principles.

The response is validated on the server before it is returned to the mobile application. The client then presents the evaluation in the scenario interface without embedding provider credentials or directly exposing the Google API. This serverless design keeps provider secrets outside the application bundle, supports controlled key and model rotation, and prevents network operations from blocking the mobile interface. Evaluation latency depends on network conditions, Vercel execution time, Gemini model availability, and the configured API quota; the system therefore reports service or quota failures clearly instead of claiming that an evaluation was completed when the remote service did not return a valid result.

---

## Recent Development Updates and System Refinements

The following improvements were made during the recent phases of app development to improve usability, learning accessibility, and device compatibility.

### 1. App Icon and Branding Adjustment

- The application icon was reviewed and adjusted to prevent oversizing and visual distortion.
- In the Expo configuration, the adaptive icon foreground was removed to avoid excessive scaling issues on Android devices.
- The icon configuration was preserved with a stable background and app branding so the application maintains a clean and consistent appearance across devices.

Relevant file:
- `app.json`

### 2. Locked Topic Warning Modal Improvement

- The locked topic prompt was refined from a bulky full-screen style into a compact overlay modal.
- The wording was shortened and made more clear so users would immediately understand that they need to finish the previous topic before proceeding.
- The modal was also repositioned to feel less intrusive while still clearly signaling the restriction.

Relevant file:
- `src/screens/TopicScreen.tsx`

### 3. Locked Topic Navigation Protection

- Additional validation was added so the user cannot jump directly into a locked topic via search, topic selection, or navigation replacement.
- This fixed the issue where the app appeared to jump unexpectedly into a restricted topic rather than staying at the valid current topic.
- The system now checks whether the selected destination is valid before navigation is allowed.

Relevant logic:
- `isTopicLockedForTarget`
- `navigation.replace('Topic', ...)` guard checks in the topic screen

Relevant file:
- `src/screens/TopicScreen.tsx`

### 4. Content Layout and Small Screen Compatibility Fix

- The reading screen was adjusted to prevent text from being clipped on smaller devices and different phone dimensions.
- Long text containers were given proper width and shrink behavior so paragraphs remain readable and do not cut off at the edges of the screen.
- The issue was addressed by improving content layout constraints rather than simply resizing text arbitrarily.

Relevant file:
- `src/screens/TopicScreen.tsx`

### 5. Justified Reading Content

- Long-form paragraph texts were updated to use justified alignment for cleaner reading flow.
- This improves readability for explanatory and conceptual content by creating a more uniform text block on mobile screens.
- The justified layout was also applied to related quote and list text blocks to maintain consistency throughout the learning content.

Relevant file:
- `src/screens/TopicScreen.tsx`

### 6. Activity Indicator Enhancement in Chapter List

- The activity status indicator in the chapter cards was improved to be more visible and easier to notice.
- The badge was repositioned lower and closer to the progress bar to form a tighter visual grouping.
- The indicator uses stronger contrast and clearer status colors to represent whether the activity tasks are complete, in progress, or not yet available.
- The progress bar color was also standardized to respect each chapter’s accent color rather than forcing a green color for Chapter 1.

Relevant file:
- `src/screens/ChapterListScreen.tsx`

### 7. AI Service Security and Stability Improvements

- API handling was aligned with Google Generative AI through the Vercel serverless endpoint.
- Google API credentials are stored as protected Vercel environment variables and are never embedded in the application source or mobile bundle.
- Invalid requests, unavailable models, rate limits, quota exhaustion, and malformed model responses are handled explicitly by the server and client.
- Numbered server-side keys and configured model rotation can be used to improve availability when the keys belong to projects with independent access and quota.
- The client retries temporary service failures and reports a clear error when a valid remote evaluation cannot be produced.

Relevant file:
- `src/services/geminiBridge.ts`

---

## Summary of EthiCore Development Contribution

EthiCore was developed as a mobile learning application designed to support Social and Professional Issues education through structured chapters, interactive topic content, progress tracking, and AI-assisted educational support. The application combines a robust cross-platform mobile interface with AI-based evaluation and educational assistance, while also prioritizing accessibility, responsive design, and user clarity.

The most recent refinements focused on improving the learner experience by:

- making chapter and topic indicators more visually clear,
- preventing users from entering restricted content,
- improving small-screen readability and content flow,
- ensuring consistent visual alignment and justification in reading pages,
- and maintaining stable functionality across multiple devices and AI service conditions.

These improvements reflect the project’s commitment to building a polished, responsive, and academically useful mobile learning system.
