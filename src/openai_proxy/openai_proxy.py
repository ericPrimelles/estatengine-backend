import boto3, openai


def got_openai_apikey(secret_id):
    try:
        client = boto3.client('secretsmanager')
        response = client.get_secret_value(SecretId=secret_id)
        secret = response['SecretString']
        return secret
    except Exception as e:
        print(f"Error retrieving secret {secret_id}: {e}")
        return None

def handler(event, context):
    try:
        secret_id = event.get('secret_id')
        openai_api_key = got_openai_apikey(secret_id)
        if not openai_api_key:
            return {
                'statusCode': 500,
                'body': 'Failed to retrieve OpenAI API key.'
            }
        openai_client = openai.OpenAI(api_key=openai_api_key)
        response = openai_client.chat.completions.create(
            model=event.get('model', 'gpt-3.5-turbo'),
            max_tokens=event.get('max_tokens', 100),
            tools=event.get('tools', None),
            messages=event.get('messages', []),
        )
        return {
            'statusCode': 200,
            'body': response.choices[0].message['content']
        }
    except Exception as e:
        print(f"Error in OpenAI handler: {e}")
        return {
            'statusCode': 500,
            'body': f"An error occurred: {str(e)}"
        }