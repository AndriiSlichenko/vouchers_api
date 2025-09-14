## Starting out

```sh
# Run npm install to install all necessary packages for development
$ npm install
# The test command will set up an in-memory SQLite DB.
$ npm run test

To develop locally with hot reloading, run the following command:
```sh
$ npm run dev
```

## Docker Support

This API has been dockerized for easy deployment and development. You can run the application using Docker in several ways:

### Using Docker Compose (Recommended)

**Production mode:**
```sh
# Build and start the API
$ docker-compose up --build

# Run in background
$ docker-compose up -d --build
```

**Development mode with hot reload:**
```sh
# Start development server with hot reload
$ docker-compose --profile dev up --build api-dev
```

### Using Docker directly

**Build the image:**
```sh
$ docker build -t api .
```

**Run the container:**
```sh
# Run in production mode
$ docker run -p 3000:3000 -v $(pwd)/db:/app/db api

# Run in development mode with volume mounting
$ docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules api npm run dev
```

### Docker Features

- **Multi-stage build** for optimized image size
- **Health checks** to ensure the API is running properly
- **Volume mounting** for database persistence
- **Non-root user** for security
- **Development and production** configurations
- **SQLite database** persistence across container restarts

The API will be available at `http://localhost:3000` when running in production mode, or `http://localhost:3001` in development mode.

## Follow-up
Send us the code when you are done, preferably hosted on a service such as GitHub, Bitbucket, or Gitlab. We will review your solution in a follow-up interview where we will go through and discuss the different aspects of the application, for example:
- Application structure
- Data integrity
- Testing
- Design choices and their advantages and disadvantages