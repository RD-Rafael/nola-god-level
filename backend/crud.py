from sqlalchemy.orm import Session
from sqlalchemy import select, text
from sqlalchemy.engine import Row
from models import Customer, Sale
import enum

class MetricPeriod(str, enum.Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"

def metric_query(
    db: Session,
    period: MetricPeriod = MetricPeriod.WEEK,
    count: int = 30,
    aggregateFunction: str = "SUM",
    storeList: list[int] = [],
    valueType: str = "total_amount"
) -> list[dict]:

    storeQueryCondition = """"""
    if(len(storeList) != 0):
        print(storeList[0])
        storeQueryCondition += "AND (\n"
        for i in range(0, len(storeList)):
            storeQueryCondition += "store_id = "
            storeQueryCondition += str(storeList[i])
            if i < len(storeList)-1:
                storeQueryCondition += " OR\n"
        storeQueryCondition += ")\n"

    queryStr =f"""
        SELECT 
            DATE_TRUNC('{period.value}', created_at) AS value_period,
            {aggregateFunction}({valueType}) AS value
        FROM sales
        WHERE true {storeQueryCondition}
        GROUP BY value_period
        ORDER BY value_period DESC
        LIMIT {count}
        """
    print(queryStr)

    query = text(
        queryStr
    )

    rows = db.execute(query).all()
    result = [dict(row._mapping) for row in rows]

    return result


def stores_names_query(
    db: Session
) -> list[dict]:
    
    query = text(
        """
        SELECT name
        FROM stores
        """
    )

    rows = db.execute(query).all()
    result = [dict(row._mapping) for row in rows]

    return result