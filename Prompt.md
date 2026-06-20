# AI Usage Documentation – Dev Detective Project

## Prompt 1 – Battle Winner Logic

### Objective

I am building a GitHub Battle Mode where two GitHub users compete.

### Problem

How should I decide the winner fairly?

### Requirements

* Use GitHub API data.
* Keep logic simple for users.
* Avoid complex formulas.

### AI Response

A simple approach is to compare the total stars earned across all public repositories.

Reason:

* Stars represent community appreciation.
* Easy to understand.
* Easy to calculate.

Winner:
User with higher total stars.

Tie:
If both users have equal stars, show Tie.

---

## Prompt 2 – Repository Selection Logic

### Objective

I want to display only 5 repositories on the profile card.

### Problem

Which repositories should be shown?

### AI Response

Show the 5 most recently updated repositories.

Reason:

* Reflects current activity.
* Shows active projects.
* Prevents UI clutter.

---

## Prompt 3 – Loading State

### Objective

Data is fetched from GitHub API.

### Problem

What should happen while data is loading?

### AI Response

Display a loader immediately.

During loading:

* Hide previous results.
* Disable interactions.
* Show a loading indicator.

After response:

* Hide loader.
* Display results.

---

## Prompt 4 – Error Handling

### Objective

Users may enter invalid GitHub usernames.

### Problem

How should errors be handled?

### AI Response

If API returns 404:

* Stop processing.
* Hide profile data.
* Show a clear error message.
* Allow user to search again.

Avoid technical error messages.

---

## Prompt 5 – Battle Mode Feature

### Objective

I want a second mode besides normal search.

### Problem

What feature can make the project more interactive?

### AI Response

Add Battle Mode.

Users enter two GitHub usernames.

Compare:

* Total stars
* Repository activity

Show:

* Winner
* Loser
* Tie

---

## Prompt 6 – Empty Bio Logic

### Objective

Some GitHub users do not have a bio.

### Problem

What should be displayed?

### AI Response

If bio is missing:

Display:
"This profile has no bio."

Reason:

* Prevents empty space.
* Keeps layout consistent.

---

## Prompt 7 – Search Trigger

### Objective

Users should search efficiently.

### Problem

Should search work only through button click?

### AI Response

Support both:

* Search Button
* Enter Key

Reason:

* Faster interaction
* Better accessibility
* Common user expectation.

---

## Prompt 8 – Score Calculation Logic

### Objective

I need a metric for GitHub Battle Mode.

### Problem

Which GitHub metric is easiest for beginners to understand?

### AI Response

Use Total Repository Stars.

Reason:

* Publicly available.
* Easy to explain.
* Reflects project popularity.

---

## Prompt 9 – Mode Switching Logic

### Objective

My application has Search Mode and Battle Mode.

### Problem

What should happen when switching modes?

### AI Response

When mode changes:

* Hide old results.
* Clear previous errors.
* Reset inputs if necessary.
* Display only relevant UI.

This prevents confusion.

---

## Prompt 10 – GitHub API Choice

### Objective

I need user profile information.

### Problem

Why should I use GitHub API instead of hardcoded data?

### AI Response

GitHub API provides:

* Real-time profile data
* Repository information
* Public statistics

Benefits:

* Dynamic content
* Always updated
* More realistic application.

---

## Prompt 11 – Project Improvement Suggestion

### Objective

I am building a GitHub Profile Finder.

### Problem

Suggest one advanced feature that can improve user engagement.

### AI Response

Add Profile Comparison Analytics.

Show:

* Total repositories
* Followers
* Following
* Total stars
* Account age

This gives users deeper insights while keeping the project practical.

---

## Summary

AI was used for:

* Feature Planning
* User Experience Decisions
* Error Handling Strategy
* Battle Mode Design
* Repository Selection Logic
* Score Calculation Logic
* API Usage Decisions
* Future Enhancement Suggestions

AI was NOT used for direct code generation. The implementation, API integration, DOM manipulation, event handling, rendering logic, and UI development were implemented manually.
