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

  # Copy node_modules to build
  mv ./node_modules ./build

  # Zip lambda
  cd ./build
  zip -r -q $directory.zip ./
  mv ./$directory.zip ../../../artifacts

  echo "Created artifact for $directory"
  echo ""
  cd ../../
done
