import {util} from "@aws-appsync/utils";

/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const PK = `REALTOR#ACCOUNT#${ctx.identity.username}#`;
    const SK = `REALTOR#ACCOUNT#${ctx.identity.username}#`;
    return{
        operation : "GetItem",
        key : {
            PK: util.dynamodb.toDynamoDB(PK),
            SK: util.dynamodb.toDynamoDB(SK)
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
            data: {...ctx.result},
            message: "Ok"
        };
    }
};