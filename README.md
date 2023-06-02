⚠️ This project is not working yet ⚠️

# Sveltekit Firebase

An opinionated Sveltekit template with Firebase authentication and Firestore.

## Getting started

### Create a Firebase project

Paste your Firebase config infos in the .env file.

Make sure you upgrade to the [Blaze plan](https://firebase.google.com/pricing)

#### Add the Firebase Admin SDK

The Firebase Admin SDK allows to manage session on the server side.

Follow the instructions the generate the required keys, and place them in the same .env file.

Keep these confidential, make sure you don't share your real .env file.

## Enable Firebase Webframeworks

https://gist.github.com/coehne/caf0b3934455d842dfbfe1f4c1544348

`gcloud auth login`

```
gcloud functions add-invoker-policy-binding ssrsveltekitfirebasebp \ # Change this to your generated function name
      --region="europe-west1" \ # Change this to your region
      --member="allUsers" \
      --project="sveltekit-firebase-bp"

      gcloud functions add-invoker-policy-binding ssrsveltekitfirebasebp --region="europe-west1" --member="allUsers"   --project="sveltekit-firebase-bp"
```
