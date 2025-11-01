from sqlalchemy.orm import Session
from sqlalchemy import select, text
from sqlalchemy.engine import Row
from models import Customer, Sale
from enum import Enum


class MetricPeriod(str, Enum):
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
    valueType: str = "faturamento",  # nome da métrica
    metricType: str = "graph",       # gráfico ou singular
):
    #Filtro de lojas
    storeQueryCondition = ""
    if storeList:
        storeQueryCondition = " AND (" + " OR ".join([f"store_id = {sid}" for sid in storeList]) + ")"


    

    # Mapeamos cada métrica a uma expressão SQL base, incluindo se é derivada
    metric_definitions = {
        "faturamento": {
            "column": "total_amount",
            "needs_subquery": False,
            "derived": False,
        },
        "quantidadePedidos": {
            "column": "*",
            "needs_subquery": lambda agg: agg.lower() == "avg",
            "derived": False,
        },
        "itensVendidos": {
            "column": "people_quantity",
            "needs_subquery": lambda agg: agg.lower() == "avg",
            "derived": False,
        },
        "tempoDeEntrega": {
            "column": "delivery_seconds",
            "needs_subquery": False,
            "derived": False,
        },
        "ticketMedio": {
            "column": None,
            "needs_subquery": False,
            "derived": True,
        },
    }

    metric_meta = metric_definitions.get(valueType)
    if metric_meta is None:
        raise ValueError(f"Unsupported metric type: {valueType}")

    agg = aggregateFunction.upper()

    if valueType == "quantidadePedidos":
        # soma = COUNT(*)
        if metricType == "graph" or aggregateFunction.lower() == "sum":
            agg = "COUNT"


    if callable(metric_meta["needs_subquery"]):
        needs_subquery = metric_meta["needs_subquery"](aggregateFunction)
    else:
        needs_subquery = metric_meta["needs_subquery"]

    
    #Query builder
    if metricType == "graph":
        if metric_meta["derived"]:
            # Métrica derivada por periodo, precisa de subquery
            queryStr = f"""
                SELECT
                    DATE_TRUNC('{period.value}', created_at) AS value_period,
                    SUM(total_amount) / NULLIF(COUNT(*), 0) AS value
                FROM sales
                WHERE true {storeQueryCondition}
                GROUP BY value_period
                ORDER BY value_period DESC
                LIMIT {count};
            """
        else:
            queryStr = f"""
                SELECT
                    DATE_TRUNC('{period.value}', created_at) AS value_period,
                    {agg}({metric_meta['column']}) AS value
                FROM sales
                WHERE true {storeQueryCondition}
                GROUP BY value_period
                ORDER BY value_period DESC
                LIMIT {count};
            """

    elif needs_subquery:
        queryStr = f"""
            SELECT AVG(period_total) AS value
            FROM (
                SELECT
                    DATE_TRUNC('{period.value}', created_at) AS period_group,
                    COUNT(*) AS period_total
                FROM sales
                WHERE true {storeQueryCondition}
                AND created_at >= DATE_TRUNC('{period.value}', NOW() - INTERVAL '{count} {period.value}s')
                AND created_at < DATE_TRUNC('week', NOW())
                GROUP BY period_group
            ) AS period_counts;
        """

    elif metric_meta["derived"]:
        # Métrica singular derivada (Ticket médio)
        queryStr = f"""
            SELECT
                SUM(total_amount) / NULLIF(COUNT(*), 0) AS value
            FROM sales
            WHERE true {storeQueryCondition}
              AND created_at >= NOW() - INTERVAL '{count} {period.value}s';
        """

    else:
        queryStr = f"""
            SELECT
                {agg}({metric_meta['column'] if metric_meta['column'] != '*' else '*'}) AS value
            FROM sales
            WHERE true {storeQueryCondition}
            AND created_at >= NOW() - INTERVAL '{count} {period.value}s';
        """
    print("\nGenerated SQL:\n", queryStr)
    rows = db.execute(text(queryStr)).all()
    return [dict(row._mapping) for row in rows]



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