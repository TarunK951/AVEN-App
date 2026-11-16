# AVEN App

A React Native / Expo shopping frontend with an original five-piece AVEN collection.

## Collection

- Coast Half-Zip Fleece in Oat
- Ridge Trail Pant in Olive
- Form 7/8 Legging in Graphite
- Field Cotton Overshirt in Sage
- Everyday Canvas Tote in Sand

Ten original AI-generated images are stored in `assets/originals`: one editorial product photograph and one fabric/construction close-up for each piece. Home, collections, search, bag, orders and related-product cards use this catalog. Previous reference photography has been removed.

Product pages include image thumbnails and zoom, individual descriptions, color swatches, size and quantity controls, fit guidance, fabric/care accordions, quality storytelling, reviews and related pieces.

## Features

Home, collection filters, sorting, search history, favorites, bag, saved addresses, profile editing, pay-on-delivery checkout, order details, requests, rewards, support messages and browsing recommendations. Data is saved on-device with AsyncStorage. No server services are required for the frontend. Checkout saves an order locally and leaves its status awaiting confirmation; it does not call a payment or fulfillment service.

## Run and verify

```sh
npm install
npm run start:local
# http://localhost:8086
npm run typecheck
npm test
npm run export:web
```

Use the Expo development workflow appropriate for SDK 58 for native device testing. No APK is included. See QA.md for current validation evidence.
