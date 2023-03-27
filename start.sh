#!/bin/bash

# Set the default environment to "development" if not provided
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV=development
fi

# Start the Express server
npm start
