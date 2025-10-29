import streamlit as st
import psycopg2
import pandas as pd
import os
import requests

api_url = "http://godlevel-backend:8000"
params = {
    "page" : 1,
    "pageSize" : 100
}

response = requests.get(api_url + "/sales", params=params)

st.title(response.json())


