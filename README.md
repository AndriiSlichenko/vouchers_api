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