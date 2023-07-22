# Introduction

A minimalist boilerplate for creating full stack web apps using [Firebase](https://firebase.google.com/), [SvelteKit](https://kit.svelte.dev/), and [Stripe](https://stripe.com/).

## Philosophy

1. Provide all the features to kickstart a modern web app with minimal dependencies.
2. Provide great user and developer experience.

# Hosting

## Server side rendering

Combining SvelteKit, and Firebase's new webframework beta support.

Deploying the entire app, front and back, is as simple as running `firebase deploy`.

# Authentication

User management is a time consuming task, and is often repeated in every project.

Authentication is mostly handled on the server side, providing a more secure, and much nicer user experience.

## Sign in / Sign up

Currently only Google sign in is supported. More options will be added in the future in the template, but you can easily add them yourself.

Signing up will create a record in Firestore, and will add the user to the `users` collection.

## Access control

You can define admin, or custom rôles, and restrict access to pages or functions.

Access control is defined using Firebase's [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims). Although, it might not be the most straightforward thing to use, it brings 2 important advantages:

- Custom claims are accessible via Auth, therefore, they don't require any extra database reads.

## Easy access to current user data

Thanks to a svelte hook, the current user object is available everywhere in the app: in +layout, +pages, and +server files.

# Payment

This template integrates Stripe, and provides a basic example of a subscription based payment system.

## Subscription

A user can subscribe to a plan. This plan has to be defined as a product in Stripe.

## Webhooks

Webhooks are used to update the user's subscription status, and to update the database accordingly. If a product has a `claim` metadata, the user will be granted the same customClaim.

## Stripe Portal

Users can access the Stripe portal to manage their subscription. You need to activate Portal in your Stripe dashboard

## Pricing page

The pricing page is a good example of how to use Stripe's API to get the list of products, and display them.

## Admin

The admin page lists the users, and show their subscription status.

# Design and content

## CSS

This templates uses [Pico Rocks](https://github.com/axel-rock/pico-rocks), a fork of [Pico](https://picocss.com), a lightweight CSS only framework. No install needed.

I encourage you to check Pico's documentation to see it's capabilities.

## Layout

A very standard layout is provided. If you know HTML and CSS, you can easily customise it to your needs.

It tries to be very intuitive to use.

## Pages

A few pages are provided as examples. They are very basic, but gives some necessary informations, and provides a good starting point.

- Home
- User
- Admin
- Pricing (Gets data from Stripe)

# Developer experience

## Easy configuration

Most settings happen in the .env file. Your Stripe and Firebase credentials can be securely stored there.

## Render markdown file

A handy component is provided to render markdown files. It's used on the home page, but can be used anywhere else.

It can also create a table of content.

# Extras

You can set `minInstances` to 1 in the `firebase.json` file, to avoid cold starts. Estimations varies, but my latest tests showed that it costs around 30€/month, significantly more than what I've seen on other sources.

# Examples

Here are the known sites that use this template:

- [Icono](https://icono-search.firebaseapp.com/)

# Roadmap

Here are the features I plan to add:

- Firestore: Basic CRUD examples
- Firestore: Pagination example
- User: Let the user edit their profile
- CSS: Improve responsiveness by adding a mobile menu
- Storage: Add example of file upload
- Auth: Try to find which providers are activated on the project, and show UI accordingly
- Auth: Add full email support (including retrieve password)
- CSS: App mode (full width, no padding) vs Site mode
- UI: Animate page transitions (carousel at a site level)
- Payment: Switch automatically from test to live mode
- Svelte: Create a component to render markdown, as the home page currently does
- Legal: Check if the template is compliant with GDPR, and add a cookie banner if needed
