# Spark Sales Analytics

This is a sample Spark application that demonstrates data processing and analytics using Scala and Apache Spark.

## Project Structure
- `src/main/scala/com/example/DataGenerator.scala`: Generates sample sales data
- `src/main/scala/com/example/SalesAnalytics.scala`: Spark application to analyze the sales data
- `src/main/resources/`: Directory where the generated data will be stored

## Prerequisites
- Java 8 or higher
- SBT (Scala Build Tool)
- Apache Spark

## Running the Application

1. First, generate the test data:
```bash
sbt "runMain com.example.DataGenerator"
```

2. Then, run the Spark analytics application:
```bash
sbt "runMain com.example.SalesAnalytics"
```

## Analytics Performed
1. Total sales by category
2. Top 5 products by revenue
3. Monthly sales trend
