# SnapStyles

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure the API.
cp .env.example .env
# Set MONGODB_URI and a random JWT_SECRET of at least 32 characters.

# Step 5: Start the web app and API with auto-reloading.
npm run dev
```

The web app runs at `http://localhost:8080` and the API runs at
`http://localhost:3001`. MongoDB credentials are read only by the Node API and
must never use a `VITE_` prefix, which would expose them to the browser bundle.
Account credentials, profile/contact/address fields, Instagram usernames, and
profile pictures are persisted in the configured MongoDB database. Images use
MongoDB GridFS so they remain available when the API is redeployed; no local
upload volume is required.

SnapStream uses peer-to-peer WebRTC for HD live video and Socket.IO for
signaling and chat. Configure `TURN_URL`, `TURN_USERNAME`, and
`TURN_CREDENTIAL` in production so viewers behind restrictive firewalls can
connect reliably. Only authenticated users can create or broadcast a stream;
the generated viewer link is public.

Creator music search uses the official YouTube Data API and embedded YouTube
player. Enable YouTube Data API v3 in Google Cloud and configure the private
server-side `YOUTUBE_API_KEY`. Music playback state is synchronized through the
stream room; YouTube autoplay policies may require viewers to click
**Enable sound** once.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
