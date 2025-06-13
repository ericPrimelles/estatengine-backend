import {util} from "@aws-appsync/utils";

/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const PK = `REALTOR#ACCOUNT#${ctx.identity.username}#`;
    const SK = `REALTOR#ACCOUNT#${ctx.identity.username}#`;
    return{
        operation : "PutItem",
        key : {
            PK: util.dynamodb.toDynamoDB(PK),
            SK: util.dynamodb.toDynamoDB(SK)
        },
        attributeValues : {
            name: util.dynamodb.toDynamoDB(ctx.arguments.input.name),
            midddleName: util.dynamodb.toDynamoDB(ctx.arguments.input.midddleName),
            lastName: util.dynamodb.toDynamoDB(ctx.arguments.input.lastName),
            email: util.dynamodb.toDynamoDB(ctx.arguments.input.email),
            phone: util.dynamodb.toDynamoDB(ctx.arguments.input.phone),
            agentTyype: util.dynamodb.toDynamoDB(ctx.arguments.input.agentTyype),
            operationAreas: util.dynamodb.toDynamoDB(ctx.arguments.input.operationAreas),
            languages: util.dynamodb.toDynamoDB(ctx.arguments.input.languages),
            communicationStyles: util.dynamodb.toDynamoDB(ctx.arguments.input.communicationStyles),
            realEstateCompany: util.dynamodb.toDynamoDB(ctx.arguments.input.realEstateCompany),
            corporativeColors: util.dynamodb.toDynamoDB(ctx.arguments.input.corporativeColors)
        }

    };
    
}


/**
 * Called after the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */

export const response = (ctx) => {
    if (ctx.result) {
        return {
            ...ctx.result,
            PK: ctx.result.PK,
            SK: ctx.result.SK
        };
    }
};