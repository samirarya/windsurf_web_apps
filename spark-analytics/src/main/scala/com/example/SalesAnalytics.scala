package com.example

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._

object SalesAnalytics {
  def main(args: Array[String]): Unit = {
    // Create Spark session
    val spark = SparkSession.builder()
      .appName("Sales Analytics")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Read the CSV file
    val salesDF = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/resources/sales_data.csv")

    // Register the DataFrame as a SQL temporary view
    salesDF.createOrReplaceTempView("sales")

    // Perform some analytics
    
    // 1. Total sales by category
    println("Total Sales by Category:")
    val categorySales = salesDF
      .groupBy("category")
      .agg(
        round(sum(col("price") * col("quantity")), 2).as("total_sales"),
        count("*").as("number_of_transactions")
      )
      .orderBy(desc("total_sales"))
    
    categorySales.show()

    // 2. Top 5 products by revenue
    println("\nTop 5 Products by Revenue:")
    val topProducts = salesDF
      .groupBy("product")
      .agg(
        round(sum(col("price") * col("quantity")), 2).as("total_revenue")
      )
      .orderBy(desc("total_revenue"))
      .limit(5)
    
    topProducts.show()

    // 3. Monthly sales trend
    println("\nMonthly Sales Trend:")
    val monthlySales = salesDF
      .withColumn("month", date_format(col("sale_date"), "yyyy-MM"))
      .groupBy("month")
      .agg(
        round(sum(col("price") * col("quantity")), 2).as("total_sales")
      )
      .orderBy("month")
    
    monthlySales.show()

    spark.stop()
  }
}
