<img width="1907" height="967" alt="Screenshot 2026-09-19 184431" src="https://github.com/user-attachments/assets/fba966a7-d575-4c7a-ba14-4ca6bf34bf58" /># BankMate — Banking Without the Literacy Barrier

**A kiosk prototype, not a standalone app.** BankMate is designed to be installed on a physical kiosk inside a real bank branch — like an ATM, but for paperwork. It is not meant to be downloaded or used as a personal banking app. A customer walks up to the kiosk, uses it in person, and walks away with a printed, filled-out form ready to sign and hand to bank staff.

Built for the **Bharat Builds Tour: First Commit** hackathon (wemakedevs.org) — **Ship It** track.

---

## The Problem

Millions of people across India can't read or write — but they still need to bank. Every withdrawal, every form, means depending on someone else to fill it out for them. Walk into any bank branch and you'll see it: elderly customers, first-generation literates, people with low vision, all waiting for a staff member to become free just to help with a form that a literate customer would fill in thirty seconds.

## The Solution

BankMate is a voice-first, camera-first kiosk prototype that removes the reading/writing barrier from two common banking tasks:

1. **Cash withdrawal**
2. **Mobile number update**

**Flow:**
```
Scan passbook → Speak your request (Hindi/English) → System understands →
Auto-fills a bank form → Signature left blank → Print
```

The customer never has to read a form or write anything except their own signature. Everything else — identifying who they are, understanding what they want, and filling in the paperwork — is handled by the kiosk.

**Important:** BankMate does **not** perform real transactions and does **not** access real bank accounts. It is a demo/prototype that produces a filled paper form, exactly like the ones customers already sign by hand today.

---

## Demo Video

📺https://youtu.be/HWZC7uqLxhk?si=9_LTZ5_5AVYkILCO

## Screenshots

| Welcome | Camera Scan | Voice Input | Form Preview |
|---|---|---|---|
|<img width="1907" height="967" alt="Screenshot 2026-09-19 184431" src="https://github.com/user-attachments/assets/1033522b-83ef-4bc2-8ff8-a29046bf5909" />|<img width="1833" height="932" alt="Screenshot 2026-09-19 184636" src="https://github.com/user-attachments/assets/2da7842a-0d3a-4f3d-b8ba-0d18ca395355" /> | <img width="1862" height="886" alt="Screenshot 2026-09-19 184708" src="https://github.com/user-attachments/assets/2661f2ce-e568-4f57-8938-7c99daf813a6" /> 


---

## Features

- 🌐 **Bilingual** — Hindi and English, selectable at the start
- 📷 **Camera-based passbook scan** — real `getUserMedia` capture, no file upload needed
- 🎙️ **Voice-first interaction** — real speech recognition, no typing required
- 🔊 **Spoken confirmation** — the kiosk reads back what it understood
- 📝 **Auto-filled forms** — withdrawal and mobile-update forms generated as PDFs, signature always left blank for the customer to sign in person
- 🙋 **Call Staff, anytime** — a single tap on any screen connects the customer to a real bank employee. **BankMate does not replace bank staff — it makes reaching them easier**, and stays out of the way the moment a human is needed
- 🔒 **Privacy-first** — the passbook photo is processed only for that single session and is deleted immediately after; nothing about the customer is stored afterward

---

## Tech Stack

**Frontend:** React + Vite, deployed on AWS Amplify Hosting
**Voice:** Browser-native `webkitSpeechRecognition` (speech-to-text) and `SpeechSynthesis` (text-to-speech)
**PDF generation:** jsPDF (`src/formEngine.js`)
**Backend:** AWS Lambda (Python 3.12), Amazon S3, Amazon API Gateway (HTTP API)
**Region:** ap-south-1 (Mumbai)

## AWS Architecture

| Service | Role |
|---|---|
| **Amazon S3** | Temporarily stores the passbook photo during processing; the object is deleted immediately after extraction |
| **AWS Lambda** (`bankmate-upload-passbook`) | Decodes the base64 image, uploads to S3, returns extracted passbook details, deletes the S3 object |
| **AWS Lambda** (`bankmate-detect-intent`) | Deployed and ready to classify voice transcripts into WITHDRAWAL / MOBILE_UPDATE / UNKNOWN using Amazon Bedrock (Nova Micro) — see [Current Limitations](#current-limitations-honest-disclosure) below |
| **Amazon API Gateway** | HTTP API exposing `POST /scan-passbook`, CORS-enabled |
| **AWS Amplify Hosting** | Hosts and serves the deployed frontend over HTTPS (required for camera/mic access in the browser) |
| **IAM** | Least-privilege role (`bankmate-lambda-role`) scoped to S3, Textract, and Bedrock access |

---

## Current Limitations 

**Amazon Textract and Amazon Bedrock are currently gated on this AWS account** during new-account identity verification:

- Textract: `AccessDeniedException` — "account is currently being verified"
- Bedrock (Nova Micro / Nova Lite): `ValidationException` — "Operation not allowed"

This was confirmed on two separate AWS accounts and is a **platform-level restriction, not a code or architecture issue**. A screenshot of this exact error is included in the demo video.

**How BankMate works around this today, without changing the architecture:**

| Feature | Intended AWS service | Current substitute |
|---|---|---|
| Passbook data extraction | Amazon Textract | Hardcoded mock data, clearly commented in the Lambda source |
| Voice intent understanding | Amazon Bedrock (Nova Micro) | Browser-native `webkitSpeechRecognition` + deterministic keyword matching (English + Hinglish + Devanagari) |

Both substitutes were built to return data in the **exact same shape** the real AWS service would return (`{accountHolder, accountNumber, branch, mobileNumber}` for Textract; `{intent, amount, language}` for Bedrock). This means swapping in the real services later requires **no changes to the frontend or any downstream screen** — only the Lambda internals change.

### How the swap works, once verification clears

**Textract:**
1. Open `bankmate-upload-passbook` Lambda
2. Replace the hardcoded mock return with a real call to `Textract.AnalyzeExpense` (or `AnalyzeDocument`) on the uploaded S3 image
3. Map Textract's response fields into the same `{accountHolder, accountNumber, branch, mobileNumber}` shape already expected by `PassbookScreen.jsx` — no frontend changes needed

**Bedrock:**
1. Update `bankmate-detect-intent` Lambda to call `bedrock-runtime InvokeModel` with a structured prompt (classifying transcripts into WITHDRAWAL / MOBILE_UPDATE / UNKNOWN, extracting the withdrawal amount)
2. Expose it via a new API Gateway route, e.g. `POST /detect-intent`
3. In `VoiceScreen.jsx`, replace the local `detectIntent(transcript)` function call with a `fetch` to this new endpoint — the returned JSON matches the same `{intent, amount, language}` shape already used everywhere downstream

No other screen, handler, or piece of state management needs to change for either swap.

---

## Deployment

The frontend is deployed on **AWS Amplify Hosting**: https://production.d1h59oid9vou66.amplifyapp.com/

The backend (S3, Lambda, API Gateway) is live and deployed in `ap-south-1`. CORS is open (`*`) for demo purposes.

## Run Locally

```bash
git clone https://github.com/shrutisharma-sh/BankMate.git
cd bankmate-frontend
npm install
npm run dev
```

Open the local URL in **Google Chrome** (voice features use `webkitSpeechRecognition`, which is Chrome-only). Camera and microphone permissions are required.

**Note:** camera and voice input require a secure context (HTTPS or `localhost`). The deployed Amplify URL provides this automatically.

---

## Privacy

- The passbook photo is sent to S3 only for the duration of processing and is **deleted immediately afterward**
- No customer data is stored beyond the single session
- BankMate does not access real bank accounts and does not perform real transactions — it produces a printable form, identical in purpose to the paper forms customers already fill in by hand

---

## Future Scope

- Swap in real Amazon Textract and Amazon Bedrock once account verification clears (architecture already supports this — see above)
- Add regional languages beyond Hindi and English as the kiosk scales to more states
- Support additional banking tasks beyond withdrawal and mobile-number update
- Physical kiosk hardware integration (thermal printer, dedicated mic array, tamper-resistant enclosure) for real branch deployment

---

## Disclaimer

BankMate is a **hackathon prototype** built to demonstrate a concept, not a production banking system. It does not connect to any real bank account, does not move real money, and should not be used for actual financial transactions. All passbook data shown in the demo is either mocked or used with the demonstrator's own consent for testing purposes.

---

## Team

Built by Shruti Sharma for Bharat Builds Tour: First Commit —Ship It Track.
