# Define the binary output
BINARY_NAME=bootstrap


# Set target for Lambda runtime
GOOS=linux
GOARCH=amd64

# Default target
build:
	@echo "🔨 Building Go binary for AWS Lambda..."
	GOOS=$(GOOS) GOARCH=$(GOARCH) go build -o $(BINARY_NAME) main.go