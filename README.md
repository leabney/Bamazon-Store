# Bamazon Store

This project required MySQL, JavaScript and Node.js to build a storefront for Customer, Manager & Supervisor use.

## Customer View

Customers are first shown product inventory, then asked which product they would like to purchase & how many they would like.

![Customer View 1](/screenshots/customer1.jpg)
![Customer View 2](/screenshots/customer2.jpg)

##### If the product is in stock at the quantity requested:
* The order is placed.  This reduces the quantity available and updates product sales in the bamazon.products table.
* The customer is shown a receipt detailing the product, price and total.

![Customer View 3](/screenshots/customer3.jpg)

##### If the product is out of stock:
* The customer is notifed and asked if they would like to make another purchase.

![Customer View 4](/screenshots/customer4.jpg)

##### If the product is in stock at a lower quantity than requested:
* The customer is asked if they would like to reduce their order quantity.  
  * If yes, the order is placed at the lower quantity.  
  * If no, they are prompted if they would like to make another purchase.
  
![Customer View 5](/screenshots/customer5.jpg)




## Manager View

Managers have 4 options.  After each option is selected, they are prompted if they would like to continue (return to the main menu) or not (disconnect).

![Manager 1](/screenshots/manager1.jpg)


##### View Products for Sale
* This lists all products available for sale.
![Manager 2](/screenshots/manager2.jpg)

##### View Low Inventory
* This lists all products with a stock quantity of 5 or less.
![Manager 3](/screenshots/manager3.jpg)

##### Add to Inventory
 
* This prompts the Manager to select a product & then enter a quantity to add to the inventory.

![Manager 4](/screenshots/manager4.jpg)

![Manager 5](/screenshots/manager5.jpg)

##### Add New Product

* This prompts the Manager to enter the Product Name, Department, Quantity & Sales Price.

![Manager 6](/screenshots/manager6.jpg)

## Supervisor View

Supervisors have 2 options.  After each option is selected, they are prompted if they would like to continue (return to the main menu) or not (disconnect).

![Supervisor 1](/screenshots/supervisor1.jpg)

##### View Product Sales by Department
* This displays total product sales by department.

![Supervisor 2](/screenshots/supervisor2.jpg)

##### Add New Department
* This prompts the Supervisor for the Department Name & Overhead Costs.

![Supervisor 3](/screenshots/supervisor3.jpg)
