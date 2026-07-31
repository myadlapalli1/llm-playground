# DESIGN.md

## Project

Swift Compare is a web app that allows users to send one prompt to multiple LLMs and compare their responses based on several metrics.

## Design Goals

The interface should be:

- easy to understand
- elegant
- professional
- neutral between model providers

The user should be able to navigate the app and understand its design.

## Main Layout

The desktop interface includes:

- left navigation sidebar
- parameter selection
- model selection controls
- comparison creation
- a button for each model response
- output metrics

## Main Pages

- Main Prompt
- Parameters
- Models
- Comparisons
- Responses
- Decisions

# Decisions
## Response Layout

When the user selects multiple models and then sends a prompt, each model is given a button on the response page.

When the user clicks a model button, the model's output and additional metrics are displayed in a box below.

This is the best option because it allows the user to see the output of multiple models without dealing with the cramped display that would come with other layouts, such as side-by-side responses.

## Error Handling

All models are run in parallel, meaning one error will not stop all other models from responding.

If a model does not respond, it is grouped in a dedicated section with other models that did not respond.

Models that do not respond are not included in graph comparisons with other models and do not contribute to cost or token-usage comparisons. However, the time before the request failed or timed out may still be displayed.

## Comparisons

Users have the option to make their comparisons public or private. Comparisons are private by default.

Private comparisons require a key that is created by the user. The correct key is required at the end of a private comparison link to access it.

Users are able to view previous comparisons.

## Metrics

Users can view the model with the lowest cost, latency, and token usage out of the models they selected.

Metrics are displayed on a graph for each model, allowing for easy visual comparison of model performance.

These metrics can be saved in a created comparison.

## Mobile Functionality

While PC is preferred when using this app, mobile is supported through a scalable design.

A mobile user is able to do everything that a desktop user can do, including viewing external JSON.

## Colors

Use a neutral grayscale color system with separate light and dark themes. The interface primarily uses dark charcoal surfaces, white or light-gray text, subtle borders, and muted gray supporting text.

### Light Theme

```css
:root {
  --background: #f4f4f5;
  --surface: #ffffff;
  --surface-subtle: rgba(15, 23, 42, 0.03);
  --text-primary: #18181b;
  --text-secondary: #4b5563;
  --border: #d7dce5;
  --field-background: #ffffff;
  --field-border: #d7dce5;
  --primary: #2563eb;
  --success: #166534;
  --error: #d14343;
}
```

### Dark Theme

```css
.dark {
  --background: #16171d;
  --surface: #212121;
  --surface-subtle: rgba(255, 255, 255, 0.04);
  --text-primary: #f5f7fb;
  --text-secondary: #b1b1b1;
  --border: #252525;
  --field-background: #4d4d4d;
  --field-border: #404040;
  --primary: #2563eb;
  --success: #c0f4c5;
  --error: #ff8e8e;
}
```

Blue may be used as an accent for interactive controls, links, selected states, and focus indicators.

## Typography

Use:

- Cormorant Garamond and Arial for the main interface

Recommended sizes:

- 60px for title text
- 35px for secondary text
- 18px for body text
- 40px for page titles

## Model Response

Each model response should include:

- button with model ID
- response content
- response latency in milliseconds
- token usage
- estimated cost

One model failing should not stop the other responses.

## User Input

The user input should include:

- model selection
- multiline prompt input
- model parameters such as temperature, maximum tokens, and top-p
- per-model parameter overrides using JSON
- comparison creation

All user input apart from the main prompt should live in the left sidebar.

## Accessibility

The app should support:

- keyboard navigation
- visible focus states
- labeled form inputs
- sufficient color contrast
- screen-reader-friendly loading and error messages

Do not communicate information using color alone.

## Avoid

Do not use:

- large gradients
- glowing cards
- excessive animations
- different layouts for different providers
- full-page loading for one model request
- unreadably narrow response columns
- fully displayed API keys

## Initial Priorities

1. Intuitive UI
2. Model selection
3. Prompt submission
4. Loading and error states
5. Response metrics
6. Comparison history
7. Responsive design
8. API settings
