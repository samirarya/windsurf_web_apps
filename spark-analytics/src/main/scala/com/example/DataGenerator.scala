package com.example

import com.github.javafaker.Faker
import java.io.{File, PrintWriter}
import scala.util.Random

object DataGenerator {
  def main(args: Array[String]): Unit = {
    val faker = new Faker()
    val random = new Random()
    
    val writer = new PrintWriter(new File("src/main/resources/sales_data.csv"))
    
    // Write header
    writer.println("id,product,category,price,sale_date,customer_name,quantity")
    
    // Generate 1000 records
    for (i <- 1 to 1000) {
      val id = i
      val product = faker.commerce().productName()
      val category = faker.commerce().department()
      val price = random.nextDouble() * 1000
      val saleDate = faker.date().between(java.sql.Date.valueOf("2024-01-01"), java.sql.Date.valueOf("2025-02-13"))
      val customerName = faker.name().fullName()
      val quantity = random.nextInt(10) + 1
      
      writer.println(f"$id,$product,$category,$price%.2f,$saleDate,$customerName,$quantity")
    }
    
    writer.close()
    println("Generated sales_data.csv successfully!")
  }
}
