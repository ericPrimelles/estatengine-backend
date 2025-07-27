// appsync/backend_table/functions/createRealtor.js
import { util } from "@aws-appsync/utils";
function request(ctx) {
  const PK = `REALTOR#ACCOUNT#${ctx.identity?.username ?? "mockUser"}#`;
  const SK = `REALTOR#ACCOUNT#${ctx.identity?.username ?? "mockUser"}#`;
  const email = ctx.identity?.claims?.email;
  return {
    operation: "PutItem",
    key: {
      PK: util.dynamodb.toDynamoDB(PK),
      SK: util.dynamodb.toDynamoDB(SK)
    },
    attributeValues: {
      name: util.dynamodb.toDynamoDB(ctx.arguments.input.name),
      midddleName: util.dynamodb.toDynamoDB(ctx.arguments.input.midddleName),
      lastName: util.dynamodb.toDynamoDB(ctx.arguments.input.lastName),
      email: util.dynamodb.toDynamoDB(email),
      phone: util.dynamodb.toDynamoDB(ctx.arguments.input.phone),
      agentType: util.dynamodb.toDynamoDB(ctx.arguments.input.agentType),
      operationAreas: util.dynamodb.toDynamoDB(ctx.arguments.input.operationAreas),
      languages: util.dynamodb.toDynamoDB(ctx.arguments.input.languages),
      communicationStyles: util.dynamodb.toDynamoDB(ctx.arguments.input.communicationStyles),
      realEstateCompany: util.dynamodb.toDynamoDB(ctx.arguments.input.realEstateCompany),
      corporativeColors: util.dynamodb.toDynamoDB(ctx.arguments.input.corporativeColors)
    }
  };
}
var response = (ctx) => {
  if (ctx.error) {
    return {
      data: null,
      message: ctx.error.message
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
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwc3luYy9iYWNrZW5kX3RhYmxlL2Z1bmN0aW9ucy9jcmVhdGVSZWFsdG9yLmpzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVEsWUFBVztBQU1aLFNBQVMsUUFBUSxLQUFLO0FBQ3pCLFFBQU0sS0FBSyxtQkFBbUIsSUFBSSxVQUFVLFlBQVk7QUFDeEQsUUFBTSxLQUFLLG1CQUFtQixJQUFJLFVBQVUsWUFBWTtBQUN4RCxRQUFNLFFBQVEsSUFBSSxVQUFVO0FBQzVCLFNBQU07QUFBQSxJQUNGLFdBQVk7QUFBQSxJQUNaLEtBQU07QUFBQSxNQUNGLElBQUksS0FBSyxTQUFTLFdBQVcsRUFBRTtBQUFBLE1BQy9CLElBQUksS0FBSyxTQUFTLFdBQVcsRUFBRTtBQUFBLElBQ25DO0FBQUEsSUFDQSxpQkFBa0I7QUFBQSxNQUNkLE1BQU0sS0FBSyxTQUFTLFdBQVcsSUFBSSxVQUFVLE1BQU0sSUFBSTtBQUFBLE1BQ3ZELGFBQWEsS0FBSyxTQUFTLFdBQVcsSUFBSSxVQUFVLE1BQU0sV0FBVztBQUFBLE1BQ3JFLFVBQVUsS0FBSyxTQUFTLFdBQVcsSUFBSSxVQUFVLE1BQU0sUUFBUTtBQUFBLE1BQy9ELE9BQU8sS0FBSyxTQUFTLFdBQVcsS0FBSztBQUFBLE1BQ3JDLE9BQU8sS0FBSyxTQUFTLFdBQVcsSUFBSSxVQUFVLE1BQU0sS0FBSztBQUFBLE1BQ3pELFlBQVksS0FBSyxTQUFTLFdBQVcsSUFBSSxVQUFVLE1BQU0sU0FBUztBQUFBLE1BQ2xFLGdCQUFnQixLQUFLLFNBQVMsV0FBVyxJQUFJLFVBQVUsTUFBTSxjQUFjO0FBQUEsTUFDM0UsV0FBVyxLQUFLLFNBQVMsV0FBVyxJQUFJLFVBQVUsTUFBTSxTQUFTO0FBQUEsTUFDakUscUJBQXFCLEtBQUssU0FBUyxXQUFXLElBQUksVUFBVSxNQUFNLG1CQUFtQjtBQUFBLE1BQ3JGLG1CQUFtQixLQUFLLFNBQVMsV0FBVyxJQUFJLFVBQVUsTUFBTSxpQkFBaUI7QUFBQSxNQUNqRixtQkFBbUIsS0FBSyxTQUFTLFdBQVcsSUFBSSxVQUFVLE1BQU0saUJBQWlCO0FBQUEsSUFDckY7QUFBQSxFQUVKO0FBRUo7QUFRTyxJQUFNLFdBQVcsQ0FBQyxRQUFRO0FBQzlCLE1BQUksSUFBSSxPQUFNO0FBQ1QsV0FBTztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sU0FBUyxJQUFJLE1BQU07QUFBQSxJQUN2QjtBQUFBLEVBQ0o7QUFFQSxNQUFJLElBQUksUUFBUTtBQUNaLFdBQU87QUFBQSxNQUNILE1BQU07QUFBQSxRQUNGLElBQUksSUFBSSxPQUFPO0FBQUEsUUFDZixJQUFJLElBQUksT0FBTztBQUFBLFFBQ2YsTUFBTSxJQUFJLE9BQU87QUFBQSxRQUNqQixhQUFhLElBQUksT0FBTztBQUFBLFFBQ3hCLFVBQVUsSUFBSSxPQUFPO0FBQUEsUUFDckIsT0FBTyxJQUFJLE9BQU87QUFBQSxRQUNsQixPQUFPLElBQUksT0FBTztBQUFBLFFBQ2xCLFdBQVcsSUFBSSxPQUFPO0FBQUEsUUFDdEIsZ0JBQWdCLElBQUksT0FBTztBQUFBLFFBQzNCLFdBQVcsSUFBSSxPQUFPO0FBQUEsUUFDdEIscUJBQXFCLElBQUksT0FBTztBQUFBLFFBQ2hDLG1CQUFtQixJQUFJLE9BQU87QUFBQSxRQUM5QixtQkFBbUIsSUFBSSxPQUFPO0FBQUEsTUFDbEM7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNiO0FBQUEsRUFDSjtBQUNKOyIsCiAgIm5hbWVzIjogW10KfQo=
