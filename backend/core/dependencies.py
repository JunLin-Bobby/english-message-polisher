import time
from fastapi import Request, HTTPException
from collections import deque, defaultdict
from core.logger import logger

RATE_LIMIT = 10 
TIME_WINDOW = 60 
request_history = defaultdict(deque)

async def rate_limiter(request:Request):
    """
    A in-memory sliding window rate limiter dependency.
    Protect api from being overwhelemed by too many requests from single ip 
    
    TODO: use Redis 
    """
    
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    #Clean up timestamps older than the time windows 
    while request_history[client_ip] and current_time - request_history[client_ip][0] >= TIME_WINDOW:
        request_history[client_ip].popleft()

    #Check if the client_id exceed the request rate_limit:
    if len(request_history[client_ip]) >= RATE_LIMIT:
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code = 429,
            detail="Too Many Requests. Please try again in a minute."
        )

    #Record the new Request's timestamp
    request_history[client_ip].append(current_time)
