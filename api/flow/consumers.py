# consumers.py

import json
from channels.generic.websocket import WebsocketConsumer

class StockConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        # Process incoming data
        # Send updates to the client
        self.send(text_data=json.dumps({
            'message': 'Hello, world!'
        }))
