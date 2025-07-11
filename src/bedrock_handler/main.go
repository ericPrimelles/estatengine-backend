package main

import (
	"context"
	"log"
	"os"
	"sync"

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
	SessionId string `json:"session_id"`
}

type Response struct {
	Description     string `json:"description"`
	FeaturesBasic   string `json:"features_basic"`
	FeaturesHistory string `json:json:"features_history"`
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
	inputs := map[string]string{
		"description":      "description: " + address,
		"features_basic":   "features-basic: " + address,
		"features_history": "features-history: " + address,
		"features_details": "features-details: " + address,
		"area":             "area: " + address,
		"comparables":      "comparable: " + address,
	}

	var wg sync.WaitGroup
	resultChan := make(chan fieldResult, 6)
	id := uuid.NewString()
	for field, input := range inputs {
		wg.Add(1)

		go func(field, input string) {

			defer wg.Done()
			log.Println(input)
			resp, err := client.InvokeAgent(ctx, &bedrockagentruntime.InvokeAgentInput{
				AgentId:      &agentId,
				AgentAliasId: &agentAliasId,
				SessionId:    &id,
				//MemoryId:     &agentMemoryId,
				InputText: &input,
			})

			if err != nil {
				resultChan <- fieldResult{field: field, err: err}
				return
			}
			defer resp.GetStream().Close()

			var result string

			for event := range resp.GetStream().Events() {
				switch e := event.(type) {
				case *types.ResponseStreamMemberChunk:
					result += string(e.Value.Bytes)
				}

			}
			log.Printf("%s, %s", field, result)
			resultChan <- fieldResult{field: field, data: result}
		}(field, input)
	}

	// Wait and close the channel
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Collect results
	var res Response
	for r := range resultChan {
		if r.err != nil {
			return Response{}, r.err
		}
		switch r.field {
		case "description":
			res.Description = r.data
		case "features_basic":
			res.FeaturesBasic = r.data
		case "features_history":
			res.FeaturesHistory = r.data
		case "features_details":
			res.FeaturesDetails = r.data
		case "area":
			res.Area = r.data
		case "comparables":
			res.Comparables = r.data
		}
	}

	return res, nil
}

func awsString(v string) *string {
	return &v
}

func main() {
	lambda.Start(handler)
}
