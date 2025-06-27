import {util} from "@aws-appsync/utils";


/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    let query = `houses for sale in ${ctx.args.city}, ${ctx.args.state} ${ctx.args.zipcode}`;
    return{
        version : "2018-05-29",
        operation : "Invoke",
        payload : {
            field: "getHousesForSaleListings",
            arguments: {
                city: ctx.args.city,
                state: ctx.args.state,
                zipcode: ctx.args.zipcode,
                page: ctx.args.page,
                limit: ctx.args.limit,
                query: query,
            },
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
            data: ctx.result.bodys,
            message: "Ok"
        };
    }
};