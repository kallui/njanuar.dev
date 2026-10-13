---
slug: insightubc
name: InsightUBC
logo: ../../assets/logos/ubc_36x36.png
roles:
  - title: Query engine for UBC course and room data
    years: "2023"
    dates: Sep 2023 - Nov 2023
summary: A query engine and REST API for searching University of British Columbia (UBC) course sections and campus rooms. Built from scratch in TypeScript, it loads raw datasets, stores them, and answers SQL-style queries with filtering, sorting, grouping, and aggregation.
tech: TypeScript · Node.js · Express · REST API · Mocha · HTML · CSS · JavaScript
---

InsightUBC was an academic project built in a team of two for UBC CPSC 310 (Introduction to Software Engineering).

## Overview

InsightUBC lets users search through UBC's course and room data, answering questions like "which sections of CPSC 310 had an average above 90?" or "which rooms on campus seat more than 100 people?".

Rather than using an existing database, the project involved building the database layer itself: ingesting raw data into structured records, persisting it, and implementing a query engine that evaluates filters, projections, sorting, grouping, and aggregations, the same operations a SQL database performs under the hood.

## Data Ingestion & Storage

- Parsed zipped datasets of course sections (JSON) and campus rooms (HTML pages) into typed, structured records.
- Validated incoming data and skipped malformed entries so only valid records were stored.
- Persisted processed datasets to disk so they survive server restarts and can be reloaded without reprocessing.
- Supported adding, removing, and listing multiple datasets, each identified by a unique ID and kind (sections or rooms).

## Query Engine

Queries are written in a JSON-based query language with a structure that maps closely to SQL:

| InsightUBC | SQL equivalent | Purpose |
| --- | --- | --- |
| WHERE | WHERE | Filter with AND, OR, NOT, comparisons, and wildcard string matching |
| OPTIONS.COLUMNS | SELECT | Choose which fields to return |
| OPTIONS.ORDER | ORDER BY | Sort by one or more keys, ascending or descending |
| TRANSFORMATIONS.GROUP | GROUP BY | Group results by one or more keys |
| TRANSFORMATIONS.APPLY | MAX / MIN / AVG / SUM / COUNT | Aggregate values within each group |

For example, finding the highest average for each CPSC course above 90:

```
{
  "WHERE": {
    "AND": [
      { "IS": { "sections_dept": "cpsc" } },
      { "GT": { "sections_avg": 90 } }
    ]
  },
  "OPTIONS": {
    "COLUMNS": ["sections_id", "maxAvg"],
    "ORDER": { "dir": "DOWN", "keys": ["maxAvg"] }
  },
  "TRANSFORMATIONS": {
    "GROUP": ["sections_id"],
    "APPLY": [{ "maxAvg": { "MAX": "sections_avg" } }]
  }
}
```

which is equivalent to:

```
SELECT id, MAX(avg) AS maxAvg
FROM sections
WHERE dept = 'cpsc' AND avg > 90
GROUP BY id
ORDER BY maxAvg DESC;
```

The engine validates each query against the query grammar, rejecting malformed queries or references to missing datasets with clear errors, then evaluates it in stages: filter, group, aggregate, project, and sort.

## Backend & REST API

- Built the backend in TypeScript, Node.js, and Express, exposing RESTful endpoints to add, remove, and list datasets, and to perform queries.
- Applied Object-Oriented Programming principles to design class models for datasets, records, and query components, keeping the architecture modular and extensible.

## Testing

Developed a test suite of unit and integration tests using Mocha to verify dataset processing, query validation, query results, and the REST endpoints.

## Frontend

Created a frontend using HTML, CSS, and JavaScript that lets users search for courses and retrieve results from the backend.
