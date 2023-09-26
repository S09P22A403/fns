import json

from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import Table, MetaData
from recommend.database import engineconn
from datetime import datetime
from decimal import Decimal
import redis
import sys
import numpy as np
import math
import ast

print(sys.path)

app = FastAPI()


class Offset(BaseModel):
    calorie: int
    carbohydrate: float
    protein: float


metadata = MetaData()
Food = Table("food", metadata, autoload_with=engineconn().engine)

redis_host = "13.124.188.144"
redis_port = 6379
try:
    redis_db = redis.StrictRedis(host=redis_host, port=redis_port, db=0)
    print(redis_db.ping())
except Exception as e:
    print(f"Error: {e}")


@app.on_event("startup")
async def load_food_data_to_redis():
    db = engineconn().sessionmaker()
    foods = db.query(Food).all()

    for food in foods:
        data_dict = {
            "food_id": food.food_id,
            "kcal": float(food.kcal),
            "carbs": float(food.carbs),
            "protein": float(food.protein)
        }
        redis_db.set("food:" + str(food.food_id), json.dumps(data_dict))

    print("Data loaded to Redis at startup!")


@app.post("/fastapi/recommend")
async def test(offset: Offset):
    print(offset)
    user_diffs = (offset.calorie, offset.carbohydrate, offset.protein)

    food_keys = redis_db.keys("food:*")

    foods_data = []

    for key in food_keys:
        value = redis_db.get(key)
        data = json.loads(value)
        foods_data.append(data)

    # weights = []
    # for food in foods:
    #
    #
    # return {"offset": offset}
    return {"foods": foods_data}


def recommend_food(calorie_diff, carb_diff, protein_diff, w_i=[1, 1, 1], λ=1):
    # 각 영양소의 차이 계산
    diffs = [
        math.log(1 + abs(calorie_diff)),
        math.log(1 + abs(carb_diff)),
        math.log(1 + abs(protein_diff))
    ]

    # 균형 패널티 계산
    balance_penalty = np.std(diffs)

    # 전체 가중치 합 계산
    W = sum([w * diff for w, diff in zip(w_i, diffs)]) + λ * balance_penalty

    return W
