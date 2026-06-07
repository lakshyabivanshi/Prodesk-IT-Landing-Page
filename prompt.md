# AI Prompts Used During Cash Flow Tracker Development

## Prompt 1: Currency Storage Strategy

In a multi-currency expense tracker, should I store salary and expenses in the selected currency or store everything in one base currency and convert only for display? Explain the advantages and disadvantages.

### AI Response (Summary)
Store all financial data in a single base currency and convert values only for display. This avoids calculation errors, keeps data consistent, and makes currency switching easier.


## Prompt 2: Dynamic Currency Dropdown

I am fetching exchange rates from an API. Should I manually create currency options in HTML or generate them dynamically from API data? Explain which approach is more scalable and maintainable.

### AI Response (Summary)
Generate dropdown options dynamically from API data. This automatically supports new currencies and reduces manual maintenance.


## Prompt 3: Expense Data Structure

For an expense tracker, what is the best way to structure expense data if I want users to delete individual expenses later? Explain the reasoning behind the data structure.

### AI Response (Summary)
Store each expense as an object containing a unique id, expense name, and amount. The unique id helps identify and remove specific expenses efficiently.


## Prompt 4: Budget Alert Logic

What is a practical way to notify users when they are close to exhausting their monthly budget? Explain the logic behind setting a warning threshold.

### AI Response (Summary)
Instead of warning users only when the balance reaches zero, trigger an alert when the remaining balance falls below a percentage threshold (such as 10% of salary).

## Prompt 5: Expense Visualization

For a personal finance dashboard, which chart type would help users quickly understand the relationship between spending and remaining balance? Explain the reasoning.

### AI Response (Summary)
A pie chart provides an immediate visual comparison between expenses and remaining balance, making spending patterns easier to understand.


## Prompt 6: LocalStorage Persistence

What information should be stored in LocalStorage in a browser-based cash flow tracker? Explain what data should be saved and why.

### AI Response (Summary)
Store salary, expenses, and user preferences such as selected currency. Rebuild the interface using the saved data whenever the application loads.



## Prompt 7: PDF Report Design

What information should be included in a professional financial report PDF generated from a personal expense tracking application?

### AI Response (Summary)
Include a report title, generation date, total salary, total expenses, remaining balance, and a detailed expense table.

---

## Prompt 8: Finance Dashboard Theme Selection

Suggest a professional UI theme for a Cash Flow Tracker. The design should feel modern, trustworthy, and suitable for a finance-related application. Explain why the recommended design style would work well.

### AI Response (Summary)
A dark glassmorphism theme with purple and indigo gradients, backdrop blur effects, glowing accents, and dashboard-style cards creates a modern fintech appearance while maintaining readability and visual hierarchy.

---

## Prompt 9: Reset Feature Behaviour

When implementing a "Reset All" feature in an expense tracker, what actions should occur besides clearing the input fields?

### AI Response (Summary)
Clear stored data, reset displayed values, reset charts, remove warnings, and restore default settings so the application returns to its initial state.

---

## Prompt 10: API Failure Handling

What is the best way to handle failures when fetching exchange rates from a currency API? Explain how the application should behave if the API becomes unavailable.

### AI Response (Summary)
Provide a fallback currency and allow the application to continue functioning. Users should still be able to use core features even when the API request fails.