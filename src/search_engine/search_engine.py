import os, requests

def handler(event, context):
    """
    Lambda function handler to process search requests.
    
    Args:
        event (dict): The event data containing search parameters.
        context (object): The context object provided by AWS Lambda.
        
    Returns:
        dict: A response containing the search results.
    """
    try:
        GPSE_APIKEY = os.getenv('GPSE_API_KEY')
        API_ID = os.getenv('GOOGLE_API_ID')
        URL = 'https://www.googleapis.com/customsearch/v1'
        max_results = event.get('max_results', 10)
        search_query = event.get('query', '')

        req = requests.get(
            URL,
            params={
                'key': GPSE_APIKEY,
                'cx': API_ID,
                'q': search_query,
                'num': max_results
            }
        )
        results = req.json()
        items = results.get('items', [])
        return {
            'statusCode': 200,
            'body': [{
                'title': item.get('title', ''),
                'url': item.get('link', ''),
                'description': item.get('snippet', '')
            } for item in items]
            
        }
    except Exception as e:
        print(f"Error processing search request: {e}")
        return {
            'statusCode': 500,
            'body': 'Internal Server Error'
        }