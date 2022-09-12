#!/bin/bash

# Create artifacts directory
echo "Packaging lambdas"

cd ../
mkdir "artifacts"
cd ./lambdas

for directory in ./* ; do
  # Start creating artifact for each lambda
  echo "Creating artifact for $directory"

  cd ./$directory

  # Install only required dependencies
  echo "Installing production dependencies"
  rm -rf node_modules
  npm i --omit=dev --silent

  # Remove test files
  find ./build/src -name '*.spec.*' -type f -delete
  rm -rf ./build/test

  # Zip lambda
  #cd ../../../artifacts
  echo "Packaging lambda"
  zip -r -q $directory.zip node_modules build

  # Copy files
  # mv $directory.zip ../../../artifacts

  echo "Created artifact for $directory"
  echo ""
  cd ../
done
