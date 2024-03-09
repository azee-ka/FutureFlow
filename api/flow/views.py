from django.http import JsonResponse
import requests

def stock_data_view(request):
    # Fetch live stock data from an API (example: Alpha Vantage API)
    api_key = 'YOUR_API_KEY'
    symbol = 'AAPL'  # Example stock symbol (Apple Inc.)
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={api_key}'
    response = requests.get(url)
    data = response.json()

    # Process and return the data
    # Example: Return the latest stock price
    latest_data = data['Time Series (5min)']['2024-03-10 16:00:00']
    stock_price = latest_data['4. close']

    return JsonResponse({'stock_price': stock_price})
