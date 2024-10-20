from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient("mongodb://shantanur03:shantanur03@13.232.136.252:27017/?ssl=true&retryWrites=true&w=majority")
# MONGO_URI = "mongodb+srv://shantanur03:shantanur03@cc208.3s0dk.mongodb.net/"
# client = AsyncIOMotorClient(MONGO_URI)
db = client['CC208']

class Question(BaseModel):
    question: str
    option1: str
    option2: str
    option3: str
    option4: str
    answer: str

class Test(BaseModel):
    created_by: str
    test_name: str
    data: Question

class User(BaseModel):
    created_by: str
    name: str
    email: str
    contact_number: str

class AssignTestRequest(BaseModel):
    test_name: str
    users: list[str]

@app.get("/")
def hello():
    return "hello"

@app.post("/tests/{created_by}/{test_name}/questions")
async def add_question(created_by: str, test_name: str, question: Question):

    test = await db.questions.find_one({"test_name": test_name, "created_by": created_by})
    
    if not test:
        new_data = {"1": question.model_dump()}
        await db.questions.insert_one({
            "test_name": test_name,
            "created_by": created_by,
            "data": new_data
        })

    else:
        next_index = str(len(test['data']) + 1)
        test['data'][next_index] = question.dict()
        await db.questions.update_one(
            {"test_name": test_name, "created_by": created_by},
            {"$set": {"data": test['data']}}
        )

    return {"message": "Question added successfully"}

@app.get("/admin/tests/{created_by}")
async def get_tests(created_by: str):

    tests = await db.questions.find({"created_by": created_by}).to_list(length=100)
    
    test_names = list(set(test["test_name"] for test in tests))
    
    return {"tests": test_names}

@app.get("/questions/{created_by}/{test_name}")
async def get_questions(created_by: str, test_name: str):

    questions = await db.questions.find_one({"test_name": test_name, "created_by": created_by})
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this test")
    
    return {"questions": questions['data']}

@app.post("/addusers")
async def create_user(user: User):
    user_dict = user.model_dump()
    result = db.users.insert_one(user_dict)
    return "Added new user"

@app.get("/admin/users/{admin}")
async def get_users_by_admin(admin: str):
    cursor = db.users.find({"created_by": admin, "assigned_test": {"$exists": False}})
    user_list = []

    async for user in cursor:
        user_data = {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "contact_number": user["contact_number"],
            "created_by": user["created_by"]
        }
        user_list.append(user_data)

    if not user_list:
        raise HTTPException(status_code=404, detail="No users found for this admin")
    
    return user_list

@app.put("/admin/assign-test")
async def assign_test(request: AssignTestRequest):
    # Update each selected user to assign the test
    for user_id in request.users:
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"assigned_test": request.test_name}}
            )
        else:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

    return {"message": "Test assigned successfully"}

@app.put("/assignscore/{user_id}/{score}")
async def update_user_score(user_id: str, score: int):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"score": score}}
    )
    
    return {"message": "Score updated successfully"}

@app.get("/users/{user_id}")
async def get_assigned_test(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if 'assigned_test' not in user:
        raise HTTPException(status_code=400, detail="No test assigned to this user")
    
    return {
        "assigned_test": user["assigned_test"],
        "created_by": user["created_by"]
    }

@app.get("/admin/scores/{created_by}")
async def get_users_with_score(created_by: str):
    users = await db.users.find({"created_by": created_by, "score": {"$exists": True}}).to_list(length=None)

    if not users:
        raise HTTPException(status_code=404, detail="No users found for the given admin")

    formatted_users = []
    for user in users:
        formatted_user = {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "contact_number": user.get("contact_number"),
            "assigned_test": user.get("assigned_test"),
            "score": user.get("score"),
        }
        formatted_users.append(formatted_user)

    return formatted_users
