import {util} from "@aws-appsync/utils";


/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
    const {bedrooms, bathrooms, minPrice, maxPrice, minSize, maxSize} = ctx.args.preferences || {};
    if (bedrooms && (typeof bedrooms !== 'number' || bedrooms < 0)) {
        throw new Error("Invalid number of bedrooms");
    }
    if (bathrooms && (typeof bathrooms !== 'number' || bathrooms < 0)) {
        throw new Error("Invalid number of bathrooms");
    }

    if (minPrice && (typeof minPrice !== 'number' || minPrice < 0)) {
        throw new Error("Invalid minimum price");
    }
    if (maxPrice && (typeof maxPrice !== 'number' || maxPrice < 0)) {
        throw new Error("Invalid maximum price");
    }

    if (minSize && (typeof minSize !== 'number' || minSize < 0)) {
        throw new Error("Invalid minimum size");
    }
    if (maxSize && (typeof maxSize !== 'number' || maxSize < 0)) {
        throw new Error("Invalid maximum size");
    }

    let preferences_string = "";
    if (bedrooms) {
        preferences_string += `bedrooms: ${bedrooms}, `;
    }
    if (bathrooms) {
        preferences_string += `bathrooms: ${bathrooms}, `;
    }
    if (minPrice) {
        preferences_string += `minPrice: ${minPrice}, `;
    }
    if (maxPrice) {
        preferences_string += `maxPrice: ${maxPrice}, `;
    }
    if (minSize) {
        preferences_string += `minSize: ${minSize}, `;
    }
    if (maxSize) {
        preferences_string += `maxSize: ${maxSize}, `;
    }
    let query = `houses for sale in ${ctx.args.city} ${ctx.args.state} ${ctx.args.zipcode}`;
    if (preferences_string) {
        query += ` with preferences: {${preferences_string.slice(0, -2)}}`;
    }
    return{
        version : "2018-05-29",
        operation : "Invoke",
        payload : {
            field: "getHousesForSaleListings",         
            city: ctx.args.city,
            state: ctx.args.state,
            zipcode: ctx.args.zipcode,
            page: ctx.args.page,
            limit: ctx.args.limit,
            query: query,
           
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