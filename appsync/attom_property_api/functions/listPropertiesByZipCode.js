import {util} from "@aws-appsync/utils";


/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const {zipcode, page, limit} = ctx.args;
    const resourcePath = `property/address?postalcode=${zipcode}&page=${page}&pagesize=${limit}`;
    return{
        version : "2018-05-29",
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "apikey": process.env.AT_API_KEY
        },
        resourcePath: resourcePath


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
            data: ctx.result.property || [],
            message: "Ok"
        };
    }
};