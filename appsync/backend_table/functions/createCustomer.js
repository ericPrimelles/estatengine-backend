import {util} from "@aws-appsync/utils";

/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */



export function request(ctx) {
    const PK = `REALTOR#ACCOUNT#${ctx.identity?.username ?? "mockUser"}#CUSTOMER`;
    const SK = `${ctx.arguments.input.customerType}#${util.autoId()}`;
    
    let atts = {};
    for (const key in ctx.arguments.input) {
        atts[key] = util.dynamodb.toDynamoDB(ctx.arguments.input[key]);
    }
    return{
        operation : "PutItem",
        key : {
            PK: util.dynamodb.toDynamoDB(PK),
            SK: util.dynamodb.toDynamoDB(SK)
        },
        attributeValues : atts
        
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
            data: ctx.result,
            message: "Ok"
        };
    }
};