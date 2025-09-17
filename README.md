<img width="100" alt="Screenshot 2021-06-29 at 8 12 27 AM" src="https://user-images.githubusercontent.com/39675511/123728969-d2a87b00-d8b1-11eb-9ece-558d4021f816.png">

---

# Thomann UI Automation

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v10.x-blue)](https://www.npmjs.com/)
[![Playwright](https://img.shields.io/badge/Playwright-v1.55.0-orange)](https://playwright.dev/)

Automated UI testing for Thomann using **Playwright** and **TypeScript**.

---

## Table of Contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Running Tests](#running-tests)
* [Reports](#reports)
* [Screenshots & Recordings](#screenshots--recordings)
* [CI with GitHub Actions](#ci-with-github-actions)

---

## Prerequisites

* **Node.js** (recommended: v20.x)
* **npm** (recommended: v10.x)

Check versions with:

```sh
node -v
npm -v
```

---

## Installation

Clone the repository:

```sh
git clone https://github.com/sumant326541/thomann-ui-automation.git
cd thomann-ui-automation
```

Install dependencies:

```sh
npm install
```

---

## Running Tests

### Run all tests

Execute tests in **Chromium**, **Firefox**, and **WebKit** in parallel (headless by default):

```sh
npm run test
```

### Run tests in headed mode

```sh
npm run test-headed
```

### Run tests only on Chromium

```sh
npm run test-chromium
```

---

## Reports

* **HTML reports** are generated in the `playwright-report` folder (configurable in `playwright.config.ts`).
* Open the report:

```sh
npm run report
```

---

## Screenshots & Recordings

* Screenshots and recordings are automatically attached to the **HTML report** for **failed steps**.

---

## CI with GitHub Actions

* Workflow defined in `.github/workflows/push.yml`.
* Test cases are triggered on **pull requests** to the `main` branch.
* Check workflow reports [here](https://github.com/sumant326541/thomann-ui-automation/actions/).

---

## Capturing Inconsistent URLs

* During test execution, some inconsistencies in URL formation have been observed.
* The URLs are automatically captured and logged in the file: failed_url.txt.
* This helps in identifying and debugging issues related to product title and URL mismatch during automation tests.

---