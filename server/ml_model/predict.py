import sys
import pandas as pd
from sklearn.tree import DecisionTreeRegressor

# 1. Inputs from Node.js
# weather (0=Clear, 1=Rain), traffic (0-2), distance (km), type (0=Normal, 1=Speed)
weather = int(sys.argv[1]) 
traffic = int(sys.argv[2])
distance = int(sys.argv[3])
post_type = int(sys.argv[4]) 

# 2. Base Calculation (Naive Physics)
avg_speed = 60 # km/h
if post_type == 1: # Speed Post
    avg_speed = 100 # Priority transport
elif post_type == 2: # Prime
    avg_speed = 120 # Air transport

base_hours = distance / avg_speed

# 3. Add Penalties (The "Smart" part)
delay = 0

if weather == 1: # Rain
    delay += 5
    if post_type == 0: # Normal post suffers more in rain
        delay += 10 

if traffic == 2: # High Traffic
    delay += 3

final_prediction_hours = base_hours + delay

print(round(final_prediction_hours, 1))