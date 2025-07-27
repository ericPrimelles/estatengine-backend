import {util} from "@aws-appsync/utils";

/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const PK = `REALTOR#ACCOUNT#${ctx.identity?.username ?? "mockUser"}#`;
    const SK = `REALTOR#ACCOUNT#${ctx.identity?.username ?? "mockUser"}#`;
    const email = ctx.identity?.email
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
            email: util.dynamodb.toDynamoDB(email),
            phone: util.dynamodb.toDynamoDB(ctx.arguments.input.phone),
            agentTyype: util.dynamodb.toDynamoDB(ctx.arguments.input.agentType),
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
   if (ctx.error){
        return {
            data: null,
            message: ctx.error.message,
        };
    }
    
    if (ctx.result) {
        return {
            data: {
                PK: ctx.result.PK,
                SK: ctx.result.SK,
                name: ctx.result.name,
                midddleName: ctx.result.midddleName,
                lastName: ctx.result.lastName,
                email: ctx.result.email,
                phone: ctx.result.phone,
                agentType: ctx.result.agentType,
                operationAreas: ctx.result.operationAreas,
                languages: ctx.result.languages,
                communicationStyles: ctx.result.communicationStyles,
                realEstateCompany: ctx.result.realEstateCompany,
                corporativeColors: ctx.result.corporativeColors
            },
            message: "Ok"
        };
    }
};