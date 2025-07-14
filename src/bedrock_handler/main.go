package main

import (
	"context"
	"log"
	"os"

	"github.com/google/uuid"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials/stscreds"
	"github.com/aws/aws-sdk-go-v2/service/bedrockagentruntime"
	"github.com/aws/aws-sdk-go-v2/service/bedrockagentruntime/types"
	"github.com/aws/aws-sdk-go-v2/service/sts"
)

type Request struct {
	Address   string `json:"address"`
	Operation string `json:"operation"`
}

type Response struct {
	Description     string `json:"description"`
	FeaturesBasic   string `json:"features_basic"`
	FeaturesHistory string `json:"features_history"`
	FeaturesDetails string `json:"features_details"`
	Area            string `json:"area"`
	Comparables     string `json:"comparables"`
}

var (
	agentId          = os.Getenv("AGENT_ID")
	agentAliasId     = os.Getenv("AGENT_ALIAS_ID")
	agentMemoryId    = os.Getenv("AGENT_MEMORY_ID")
	crossAccountRole = os.Getenv("CROSS_ACCOUNT_ROLE")
)

func getBedrockClientCrossAccount(ctx context.Context, roleArn string) (*bedrockagentruntime.Client, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, err
	}

	stsClient := sts.NewFromConfig(cfg)

	creds := stscreds.NewAssumeRoleProvider(stsClient, roleArn)

	xCfg := cfg.Copy()
	xCfg.Credentials = aws.NewCredentialsCache(creds)

	client := bedrockagentruntime.NewFromConfig(xCfg)
	return client, nil
}

func handler(ctx context.Context, req Request) (Response, error) {
	// cfg, err := config.LoadDefaultConfig(ctx)
	// if err != nil {
	// 	log.Fatalf("Unable to load AWS SDK config: %v", err)
	// }

	client, err := getBedrockClientCrossAccount(ctx, crossAccountRole)
	if err != nil {
		log.Fatalf("Unable to load AWS SDK config: %v", err)
	}
	type fieldResult struct {
		field string
		data  string
		err   error
	}

	var address string = req.Address
	var operation string = req.Operation
	input := operation + ": " + address

	// var wg sync.WaitGroup
	// resultChan := make(chan fieldResult, 6)
	id := uuid.NewString()

	var res Response
	log.Println(input)
	resp, err := client.InvokeAgent(ctx, &bedrockagentruntime.InvokeAgentInput{
		AgentId:      &agentId,
		AgentAliasId: &agentAliasId,
		SessionId:    &id,
		//MemoryId:     &agentMemoryId,
		InputText: &input,
	})

	if err != nil {
		log.Fatal(err)

	}
	defer resp.GetStream().Close()

	var result string

	for event := range resp.GetStream().Events() {
		switch e := event.(type) {
		case *types.ResponseStreamMemberChunk:
			result += string(e.Value.Bytes)
		}
	}
	log.Printf("%s", result)

	// Collect results
	switch operation {
	case "description":
		res.Description = result
	case "features_basic":
		res.FeaturesBasic = result
	case "features_history":
		res.FeaturesHistory = result
	case "features_details":
		res.FeaturesDetails = result
	case "area":
		res.Area = result
	case "comparables":
		res.Comparables = result
	}

	return res, nil
}

func main() {
	lambda.Start(handler)
}
