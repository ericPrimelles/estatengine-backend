# EstatEngine Backend

Serverless backend for a real-estate data and property analysis application built on AWS.

The project exposes a GraphQL API through AWS AppSync and integrates multiple backend data sources, including DynamoDB, AWS Lambda services, and the ATTOM property data API. The infrastructure and application resources are defined declaratively using the Serverless Framework and AWS CloudFormation resources.

## Architecture

The backend uses AppSync as the primary application API and routing layer.

```text
                         ┌──────────────────┐
                         │     Clients      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ AWS AppSync      │
                         │ GraphQL API      │
                         └────────┬─────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               │                  │                  │
               ▼                  ▼                  ▼
        ┌─────────────┐    ┌─────────────┐    ┌──────────────┐
        │  DynamoDB   │    │   Lambda    │    │ API Gateway  │
        │             │    │             │    │ HTTP Proxy   │
        └─────────────┘    └──────┬──────┘    └──────┬───────┘
                                  │                  │
                         ┌────────┴────────┐         ▼
                         │                 │    ATTOM Property
                         ▼                 ▼        API
                   Search Engine      AI Integration
```

AppSync pipeline resolvers provide the integration layer between the GraphQL schema and the underlying AWS and external services.

## Main Components

### AppSync GraphQL API

AWS AppSync provides the primary API exposed by the backend.

The GraphQL layer is divided into domain-specific schemas and resolver pipelines for:

* backend application data
* property information
* search functionality

Authentication supports both API keys and Amazon Cognito User Pools.

### DynamoDB

Application data is stored in a DynamoDB table using a composite `PK` / `SK` key structure.

The table uses on-demand billing and includes TTL support for automatically expiring temporary records.

### Property Data Integration

Property information is retrieved from the ATTOM Property API.

Rather than exposing the external service directly to the application, the backend routes property requests through an AWS API Gateway proxy protected with IAM authorization.

AppSync communicates with this API through an authenticated HTTP data source.

### Search Service

Search functionality is implemented as a Python AWS Lambda service and exposed to the GraphQL layer as an AppSync Lambda data source.

External search credentials are provided through deployment environment variables rather than stored in the application source.

### AI Integration

The backend includes a Python Lambda component for integrating AI functionality with the application while keeping provider interaction behind the backend layer.

## Infrastructure as Code

The AWS infrastructure is declared primarily in `serverless.yml`.

The deployment provisions and configures:

* AWS AppSync
* AWS Lambda
* Amazon DynamoDB
* Amazon API Gateway
* IAM roles and policies
* AppSync data sources
* GraphQL pipeline resolvers
* Cognito-based authentication integration

Application environments are separated using Serverless Framework stages.

## Repository Structure

```text
.
├── apigateway/
│   └── attom_proxy/
├── appsync/
│   ├── attom_property_api/
│   ├── backend_table/
│   ├── search_engine/
│   ├── datasources.yml
│   └── schema.graphql
├── src/
│   ├── openai_proxy/
│   ├── search_engine/
│   └── package_lambdas.sh
├── serverless.yml
├── package.json
└── package-lock.json
```

The AppSync modules contain their own GraphQL schemas, pipeline definitions, and resolver functions, keeping API behavior separated by backend capability.

## Deployment

The project uses Serverless Framework v4 and Python-based Lambda functions.

Deployment requires the AWS credentials and environment-specific configuration referenced by `serverless.yml`, including the external API credentials and Cognito resources used by the application.

Lambda dependencies are packaged before deployment using the packaging script under `src/`.

A typical deployment follows the Serverless Framework workflow:

```bash
npm install

export STAGE=dev

serverless deploy --stage dev
```

Additional environment variables required by individual integrations must be configured before deployment.

## Technologies

**Backend:** Python, GraphQL
**Cloud:** AWS Lambda, AppSync, API Gateway, DynamoDB, Cognito, IAM
**Infrastructure:** Serverless Framework, CloudFormation, YAML
**Integrations:** ATTOM Property API, external search services, AI APIs

## Project Context

EstatEngine was developed as the backend layer of a larger real-estate application combining property information, search, and AI-assisted analysis.

This repository contains the backend services and application-level AWS infrastructure. Networking and other infrastructure concerns are maintained separately.
