# AutomationExercise – Playwright + TypeScript Framework

UI automation framework for <https://www.automationexercise.com/> built with **Playwright + TypeScript**, **Page Object Model**, **custom fixtures**, and dual reporting (**Playwright HTML** + **Allure**).

Focus: the **sign-up flow** plus other key user scenarios (login, logout, contact us, product search).

## Highlights

- **POM + components** – one class per page, shared `HeaderComponent`, `BasePage` with URL assertion helper.
- **Custom fixtures** – page objects, `newUser`, `registeredUser`, automatic clean-up, ad-blocking.
- **Stable locators** – the site's own `data-qa` attributes via `getByTestId()` (`testIdAttribute: 'data-qa'`), roles/headings elsewhere. No XPath.
- **Unique data every run** – `buildUser()` generates name/email/password/mobile from timestamp + UUID. No hard-coded emails.
- **Independent tests** – "already registered" users are created through the site's `/api/createAccount` in a fixture and deleted afterwards via `/api/deleteAccount`; UI is what is being tested, API is only setup/teardown.
- **Clean-up** – the sign-up test deletes the account through the UI; a fixture safety-net deletes it via API if the test fails midway.
- **Assert after every navigation** – every page object has `expectLoaded()` checking URL + heading.
- **Allure steps** – page methods are wrapped in `test.step`, so the Allure report shows readable step trees.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ (20/22 recommended) |
| Java (JRE) | 8+ – **only needed to generate/open the Allure report** (`allure-commandline`) |

## Setup

```bash
npm install
npx playwright install chromium
```

## Run tests

```bash
npm test                 # all tests, headless
npm run test:headed      # watch the browser
npm run test:ui          # Playwright UI mode
npm run test:signup      # only the sign-up flow
npx playwright test -g "TC06"   # a single test by title
```

Environment variables (optional):

| Variable | Default | Purpose |
|----------|---------|---------|
| `BASE_URL` | `https://www.automationexercise.com` | Target site |
| `BLOCK_ADS` | `true` | Set `false` to stop blocking ad/tracker hosts |

## Reports

```bash
# Playwright HTML report
npm run report:html

# Allure report (after a test run)
npm run allure:generate
npm run allure:open
# or in one go (generates temp report and opens it)
npm run allure:serve
```

Raw results go to `allure-results/`, the generated report to `allure-report/`.

### Screenshots

| Test execution | Allure report |
|----------------|---------------|
| ![Test execution](docs/screenshots/test-execution.png) | ![Allure report](docs/screenshots/allure-report.png) |

> Run `npm test`, take a screenshot of the terminal output, and save it as `docs/screenshots/test-execution.png`.
> Run `npm run allure:serve`, take a screenshot of the overview/suites page, and save it as `docs/screenshots/allure-report.png`.

## Scenario coverage

| # | Scenario | Test | Expected result asserted |
|---|----------|------|--------------------------|
| 1 | Home → Signup / Login | `01-navigation` TC01 | URL `/login`; "New User Signup!" heading; login & signup forms visible |
| 2 | Register new user (full flow + delete) | `02-signup-flow` TC02 | `/login` → `/signup` ("Enter Account Information") → `/account_created` ("Account Created!" + success message) → "Logged in as <name>" → "Account Deleted!" |
| 3 | Already registered email | `03-signup-negative` TC03 | "Email Address already exist!", stays on `/login` |
| 4 | Empty name / email | `03-signup-negative` TC04 (×3) | Native `required` validation, stays on `/login` |
| 5 | Invalid email format | `03-signup-negative` TC05 (×3) | Native `type=email` validation (`typeMismatch`, message present), stays on `/login` |
| 6 | Login valid | `04-login-logout` TC06 | "Logged in as <name>", Logout link visible |
| 7 | Login wrong password | `04-login-logout` TC07 | "Your email or password is incorrect!" |
| 8 | Logout | `04-login-logout` TC08 | Back on `/login`, logged-out header |
| 9 | Contact Us | `05-contact-us` TC09 | "Success! Your details have been submitted successfully." |
| 10 | Product search | `06-product-search` TC10 | "Searched Products" heading; every result name contains the term |

## Project structure

```
├── playwright.config.ts        # reporters (list, html, allure), baseURL, testIdAttribute
├── src
│   ├── api/userApi.ts          # create/delete user via site REST API (setup/teardown only)
│   ├── components/HeaderComponent.ts
│   ├── data/userFactory.ts     # unique test-data generator
│   ├── fixtures/index.ts       # custom fixtures (pages, users, clean-up, ad-blocking)
│   ├── pages/                  # Page Objects (Base, Home, Login, Signup, AccountCreated, ...)
│   └── utils/url.ts            # URL matcher helper
├── tests/                      # spec files (one feature area per file)
└── docs/screenshots/           # README screenshots
```

## Design notes

- **Why API for setup?** Scenarios 3, 6, 7, 8 need an existing account. Creating it through the UI each time would make them slow and dependent on the sign-up flow. Fixtures create it via API and delete it afterwards, so tests stay independent.
- **Ads:** the demo site injects Google ads / vignette overlays that intercept clicks. An auto fixture aborts ad & tracker requests; URL assertions also tolerate a `#google_vignette` hash.
- **Validation tests (4 & 5):** the site relies on native HTML5 validation (no DOM error text), so tests read `validity` / `validationMessage` from the input.
- **Parallelism:** 2 workers. The site is shared and occasionally slow; unique data makes parallel runs safe.
- **Contact Us** triggers a native `confirm()` dialog – accepted in `ContactUsPage.submit()`.

## Publishing to GitHub (private repo + collaborator)

```bash
git init
git add .
git commit -m "feat: Playwright TS framework with POM, fixtures and Allure"

# GitHub CLI (https://cli.github.com) – creates a PRIVATE repo and pushes
gh repo create automationexercise-playwright --private --source=. --push

# Add the reviewer as collaborator
gh api -X PUT repos/<your-username>/automationexercise-playwright/collaborators/devqa07 -f permission=push
```

Or via the web UI: *New repository → Private*, then *Settings → Collaborators → Add people → `devqa07`*.
