# AVEN verification

Verified 2026-11-15.

- TypeScript: passed (`npm run typecheck`).
- Shopping logic: 10 tests passed (`npm test`). Covers variant merging, quantity bounds, malformed storage, address validation, discount rounding and shipping thresholds.
- Expo Doctor: 20/20 checks passed.
- Production web bundle: exported successfully (`npm run export:web`).
- Local browser: inspected phone layouts at 320 and 390 CSS pixels and tablet layout at 768 CSS pixels. Shop content width matched viewport width at 390 and 768 pixels; no page-level horizontal overflow. Product, bag, address, shipping and payment screens remained usable at 320 pixels.
- Adaptive shop/saved grids use two columns on phones and three at tablet widths. Button text can shrink/wrap within its container. Scroll indicators are hidden on shopping lists.
- Browser journey: selected size M, added Restore Oversized Mock Neck, opened bag, entered fictional address, continued through shipping, selected Demo Visa and placed a demo order. Confirmation displayed $128 and bag reset to zero. Payment correctly rejected submission before selecting the demo card.
- Local screenshots: ignored `output/aven-mobile.png`.

## Limits

This is a frontend shopping prototype. No live payment, order, email, inventory or account service is connected. Address/contact details are not persisted. Product photography is reference material and must be licensed or replaced before commercial publication.

No APK was created. Native Android/iOS device behavior has not been verified. Android build experimentation was stopped at the user's request; native build settings are source configuration, not evidence of a successful native build. Browser checks use React Native Web and do not replace device QA.

## Header search and You page refinement

- Moved the search entry from the header icon into a dedicated search bar below the header on tab screens.
- Reworked You with separate saved/bag cards, help rows, collection shortcut, and compact information links.
- Browser checked at 320, 390 and 768 CSS pixels; no page-level horizontal overflow at 320 or 768 pixels. Search for fleece returned the expected hoodie. Shipping & returns opened the correct information page and back navigation returned to You.
- TypeScript passed after these changes. Screenshots are in ignored output/.

## Complete mobile spacing and color review

- Reviewed Home, Shop, Saved (populated and empty), Bag (populated and empty), You, clothing and One Size product templates, Search (results and empty), checkout address/shipping/payment, confirmation, all five information pages, and the missing-page fallback in the local browser.
- Narrow mobile review used 320 x 760; standard mobile Shop review used 390 x 844. Checked rendered screenshots, header geometry and page width; checked pages did not have document-level horizontal overflow.
- Darkened secondary text and inactive tabs to sage #626f60. Calculated contrast is 5.30:1 on white and 4.83:1 on cream. White on the forest action color is 11.68:1. These are palette checks, not a complete accessibility certification.
- Unified saved hearts with rose #8e4b57, improved product badge readability, adjusted Home button spacing, allowed shipping-note text to wrap, and gave bag quantity controls more room.
- Search now appears below headers on browsing/product/information screens. Search itself uses one matching cream input. Checkout intentionally has its compact task header without an additional search bar.
- Tightened the demo payment card typography and wrapping. Field errors clear when their values are edited; validation still runs before continuing.
- Repeated the local $128 demo order through confirmation; bag reset to zero. Restored the original single saved favorite after empty-state testing.
- Final TypeScript, all 10 shopping tests, production web export and git whitespace check passed. Native-device behavior remains unverified. No APK was created or packaged.
- Updated preview screenshots: ignored output/aven-mobile-audit.png and output/aven-colors-you.png.

## Frontend account and shopping expansion — 2026-11-16

Added local profile editing/validation; saved address add/edit/remove/undo/default selection; checkout autofill; persistent order history; receipt details; sample delivered/in-transit tracking; local cancellation, return and exchange requests; replacement-size selection; and buy-again links. Profile/account and order links are connected from You and confirmation.

Also added size/color/price/sample-stock filters, unavailable variant protection, local reviews/ratings, restock preferences, recent searches, recently viewed products, browsing-based recommendations, local activity, support FAQs/drafts, AVEN Circle preview rewards, delivery-region estimates, illustrative currency conversion and a simulated payment-failure/retry path. A friendly route error screen offers retry. Privacy and README copy describe the local persistence model.

Validation:
- TypeScript passed and 15 tests passed, including customer hydration, default-address fallback, corrupt data, sample stock/filter combinations, legacy receipt migration and malformed receipt rejection.
- Production web export passed. No Android/iOS binary or APK was built.
- Browser checks at 390 x 844 and 320 x 760: profile required-field validation and saving; address creation/edit/removal/undo; profile and default-address autofill into checkout; a simulated payment decline followed by successful retry; order creation/history; cancellation; sample return and exchange with replacement size; FAQs/draft saving; preference switches; region/currency estimates; rewards joining; combined product filters; review saving; stock alerts; unavailable product disabled; recently viewed; local activity; and navigation back to account.
- Saved address and newly created order survived reload. Tested account/address/order document widths matched their mobile viewports. Fixed empty-string JSX warnings encountered during testing.
- Screenshots in ignored output/: aven-account.png, aven-addresses.png and aven-orders.png.

All transactions, shipments, requests, loyalty points, reviews, alerts and support messages are local demonstrations. Currency estimates use fixed illustrative rates; catalog and checkout remain USD. No backend, authentication, live payment, carrier, notification service or analytics was connected. Native device/keyboard behavior and accessibility certification remain unverified. Reference photography still requires licensing/replacement before commercial use.
