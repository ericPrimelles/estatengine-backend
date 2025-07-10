# Define the binary output
BINARY_NAME=main
BUILD_DIR=bin

# Set target for Lambda runtime
GOOS=linux
GOARCH=amd64

# Default target
build:
	@echo "🔨 Building Go binary for AWS Lambda..."
	GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o $(BUILD_DIR)/$(BINARY_NAME) main.go