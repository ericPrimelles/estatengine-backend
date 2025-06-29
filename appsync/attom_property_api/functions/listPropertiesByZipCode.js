import {util} from "@aws-appsync/utils";


/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const {zipcode, page, limit} = ctx.args;
    const resourcePath = `/${ctx.env.STAGE}/property/address?postalcode=${zipcode}&page=${page}&pagesize=${limit}`;
    return{
        version : "2018-05-29",
        method: 'GET',
        params: {
            headers: {
                "Accept": "application/json",
                "apikey": ctx.env.AT_API_KEY
            },
        },
        resourcePath: resourcePath


    };
    
}


/**
 * Called after the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */

export const response = (ctx) => {
    
    if (ctx.error || ctx.result?.statusCode !== 200) {
        return {
            data: null,
            message: ctx.result?.body?.message || "Error fetching properties",
        };
    }
    
    if (ctx.result && ctx.result.statusCode === 200) {
        
        return {
            data: ctx.result.body?.property || [],
            message: "Ok"
        };
    }
};