This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Running the App with Docker Compose (Development)

This project includes a Docker Compose configuration optimized for development using the latest stable Node.js (Node 18). With this setup, hot reloading is enabled—any changes you make locally will be immediately reflected inside the container.

### Prerequisites

- **Docker** and the new integrated **docker compose** plugin installed on your system.
- Your project directory is the root of this repository.

### Build and Run the Docker Container

Run the following command in your project directory:

```bash
docker compose up --build
```

- The `--build` flag ensures the image is rebuilt if there are any changes to the Dockerfile.
- Docker Compose will build the image, start the container, and mount your local project directory to `/app` in the container, enabling hot reload.

### Access the Application

Once the container is running, open your browser and navigate to:

```
http://localhost:3000
```

Your Next.js app should be running in development mode with hot reloading enabled.

### Stopping the Container

To stop the container, press `Ctrl+C` in the terminal where Docker Compose is running, or run:

```bash
docker compose down
```

---

This updated configuration uses the latest integrated **docker compose** command, making it easy to manage your development environment without needing the older `docker-compose` command. Let me know if you need further adjustments or additional details!