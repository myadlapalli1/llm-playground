# Swift Compare

Swift Compare is a web application that allows users to send one prompt to multiple large language models and compare their responses using performance metrics such as latency, token usage, and estimated cost.

The application is designed to make it easier to evaluate different models through one consistent interface.

<p align="center">
  <img src="docs/home-dark.png" alt="Swift Compare main interface" width="850">
</p>

## Features

- Send one prompt to multiple LLMs
- Run model requests in parallel
- Compare model responses
- View latency, token usage, and estimated cost
- Apply shared model parameters
- Apply per-model parameter overrides using JSON
- Save previous comparisons
- Create public or private comparisons
- Access private comparisons using a creator-defined key
- View raw request and response JSON
- Use light and dark themes
- Use the application on desktop and mobile devices

## Themes

Swift Compare supports both light and dark themes.

<table>
  <tr>
    <td align="center"><strong>Light Mode</strong></td>
    <td align="center"><strong>Dark Mode</strong></td>
  </tr>
  <tr>
    <td>
      <img src="docs/home-light.png" alt="Swift Compare light mode" width="420">
    </td>
    <td>
      <img src="docs/home-dark.png" alt="Swift Compare dark mode" width="420">
    </td>
  </tr>
</table>

## How It Works

1. Select the models you want to compare.
2. Enter a prompt.
3. Configure optional parameters such as temperature, maximum tokens, and top-p.
4. Submit the prompt.
5. Each model runs independently and in parallel.
6. Select a model button to view its response.
7. Review response metrics and comparison graphs.
8. Save the comparison as public or private.

### Model Selection

Users can select multiple models before submitting a prompt.

<p align="center">
  <img src="docs/models-dark.png" alt="Swift Compare model selection screen" width="800">
</p>

## Response Comparison

Each selected model receives its own button on the response page.

When a model button is selected, the model's response and performance metrics are displayed in the main response panel.

This avoids cramped side-by-side response columns while still allowing users to switch quickly between models.

<p align="center">
  <img src="docs/response-dark.png" alt="Swift Compare response comparison screen" width="850">
</p>

Each response may include:

- Model name or model ID
- Response content
- Response latency
- Input tokens
- Output tokens
- Total token usage
- Estimated cost
- Raw JSON
- Loading status
- Error status

## Error Handling

All model requests run independently.

If one model fails, the other model requests continue normally.

Failed models are placed in a separate section and are not included in performance comparison graphs.

The time before a request failed or timed out may still be displayed.

## Public and Private Comparisons

Comparisons are private by default.

When creating a private comparison, the creator chooses an access key.

The correct key must be included at the end of the comparison URL to open the comparison. For private comparisons, replace `key-here` with the access key selected when the comparison was created.

<p align="center">
  <img src="docs/sharing-dark.png" alt="Create a public or private comparison" width="600">
</p>

Example:

```text
https://llm-playground-lvj1.onrender.com/api/comparisons/2d86-e3c5-473b-9006-bd05dbaef5eb/key-here
```

Private comparison links should not expose API keys or private account information.

## Metrics

Swift Compare displays metrics for each successful model response.

Supported metrics include:

- Response latency
- Output token usage
- Estimated cost

The app highlights the models with the:

- Lowest latency
- Lowest estimated cost
- Lowest token usage

Additional metrics are viewable in created comparisons.

These metrics measure performance and resource usage. They do not automatically determine which model produced the best response.

## Tech Stack

### Frontend

- Vite
- React
- JavaScript
- Tailwind CSS
- shadcn/ui

### Backend

- Python
- FastAPI
- Uvicorn

### Database

- SQLite

### Hosting

- Vercel — frontend
- Render — backend

## Project Structure

```text
swift-compare/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── app.css
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── data/
│   ├── comparisons.db
│   ├── list_models.py
│   ├── main.py
│   ├── requirements.txt
│   └── sync_models.py
├── docs/
│   ├── home-dark.png
│   ├── home-light.png
│   ├── models-dark.png
│   ├── response-dark.png
│   ├── sharing-dark.png
│   └── mobile.png
├── DESIGN.md
├── README.md
└── .gitignore
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/myadlapalli1/llm-playground
```

### 2. Enter the Project Folder

```bash
cd llm-playground
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Install Backend Dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file inside the backend folder.

### Backend environment variables

```env
PORT=8000

OPENAI_API_KEY=your_openai_api_key
NVIDIA_API_KEY=your_nvidia_api_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

Create a separate `.env` file inside the frontend folder.

### Frontend environment variables

```env
VITE_API_URL=http://localhost:8000
```

For deployment on Vercel, set:

```env
VITE_API_URL=https://llm-playground-lvj1.onrender.com
```

Do not commit real API keys to GitHub.

Add `.env` files to `.gitignore`.

## Running the App Locally

### Start the Backend

From the backend folder:

```bash
uvicorn main:app --reload --port 8000
```

### Start the Frontend

Open a second terminal and run the following from the frontend folder:

```bash
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

The backend will usually run at:

```text
http://127.0.0.1:8000
```

The exact ports may differ depending on the project configuration.

## Model Parameters

The application may support shared parameters such as:

- Temperature
- Maximum output tokens
- Top-p

Users may also provide per-model parameter overrides using JSON.

Example:

```json
{
  "meta/llama-3.3-70b-instruct": {
    "temperature": 0.5,
    "max_tokens": 1000,
    "top_p": 1
  }
}
```

Invalid JSON should be rejected before the request is submitted.

## API Keys

API keys should be stored securely using environment variables or an approved secrets-management system.

API keys should never:

- Be committed to GitHub
- Be displayed in full
- Appear in comparison URLs
- Be returned in API responses
- Be stored in plain text without a clear security decision

## Mobile Support

Swift Compare is designed primarily for desktop use, but mobile devices are supported.

Mobile users should be able to:

- Select models
- Enter prompts
- Change parameters
- Submit comparisons
- Switch between responses
- View metrics
- View raw JSON
- Access saved comparisons

<p align="center">
  <img src="docs/mobile.png" alt="Swift Compare mobile interface" width="320">
</p>

## Accessibility

The interface should support:

- Keyboard navigation
- Visible focus states
- Labeled form controls
- Sufficient color contrast
- Screen-reader-friendly loading states
- Screen-reader-friendly error messages
- Accessible graphs and response buttons

Information should not be communicated through color alone.

## Design Documentation

See `DESIGN.md` for information about:

- Layout
- Response navigation
- Colors
- Typography
- Mobile behavior
- Accessibility
- UI restrictions

## Deployment

The frontend may be deployed using Vercel.

Before deployment:

- Confirm the correct root directory
- Add required environment variables
- Confirm the production API URL
- Check that the build command works locally
- Confirm that private API keys are not exposed to the frontend

Example build command:

```bash
npm run build
```

Example output directory for a Vite project:

```text
dist
```

The current version uses SQLite. Production deployments should use persistent storage or a managed database to prevent saved comparisons from being lost during backend restarts or redeployments.

## Future Improvements

Possible future features include:

- Additional model providers
- Team workspaces
- Model ranking
- Advanced analytics
- Prompt templates
- Conversation sharing controls
- Usage limits and cost alerts

## Security Notes

The private comparison key limits access to a shared comparison, but it should not automatically be treated as strong account-level security.

Before a public release, the project should review:

- API-key security
- Rate limiting
- Input validation
- Model-output sanitization
- Privacy policy
- Provider terms of service

## License

MIT License

## Contributors

Developed by Mohith Yadlapalli as an intern for Buttery Technologies.

## Project Status

Swift Compare is currently under development.

The project name, branding, and production security requirements may be updated before the final company handoff.
