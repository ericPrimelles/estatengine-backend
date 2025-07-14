import {util} from "@aws-appsync/utils";


/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const {
            address_line_1,
            address_line_2,
            city,
            zipCode,
            state,
            operation} = ctx.args.preferences || {};
    
    const address = `${address_line_1}${' ' + address_line_2}, ${city}, ${city}, ${state} ${zipCode},`
    
    return{
        version : "2018-05-29",
        operation : "Invoke",
        payload : {
            field: "getHousesForSaleListings",         
            address: address,
            operation: operation

           
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
            data: ctx.result.body,
            message: "Ok"
        };
    }
};