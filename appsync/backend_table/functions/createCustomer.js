import {util} from "@aws-appsync/utils";

/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */

function uuidv4() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    
    // Per RFC4122 standard
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));

    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10, 16).join('')
    ].join('-');
  }

export function request(ctx) {
    const PK = `REALTOR#ACCOUNT#${ctx.identity?.username ?? "mockUser"}#CUSTOMER`;
    const SK = `${ctx.arguments.input.customerType}#${uuidv4()}`;
    x = {a : 1}
    
    return{
        operation : "PutItem",
        key : {
            PK: util.dynamodb.toDynamoDB(PK),
            SK: util.dynamodb.toDynamoDB(SK)
        },
        attributeValues : Object.fromEntries(
            Object.entries(ctx.arguments.input).map(([key, value]) => {
                return [key, util.dynamodb.toDynamoDB(value)];
            })
        )
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
            data: Object.fromEntries(
                Object.entries(ctx.result).map(([key, value]) => {
                    return [key, util.dynamodb.toDynamoDB(value)];
                })
            ),
            message: "Ok"
        };
    }
};