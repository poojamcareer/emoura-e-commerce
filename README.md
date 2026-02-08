# Emoura Backend

Run locally:

mvn spring-boot:run

API:
- GET /api/products
- POST /api/events?sessionId=...&eventType=...&productId=...
- GET /api/recommendations?sessionId=...

WebSocket:
- ws endpoint: /ws
- send to /app/recommend
- subscribe to /topic/recommendations
