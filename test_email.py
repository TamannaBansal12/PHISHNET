import httpx
import asyncio

async def test():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/py-api/email/analyze", 
                json={"content": "Urgent: Click this link to verify your password and bank account. http://evil.com/verify"}
            )
            print(f"Status: {response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
