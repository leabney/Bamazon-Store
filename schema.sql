USE bamazon;

CREATE TABLE products
(item_id INT NOT NULL AUTO_INCREMENT
,product_name VARCHAR(100) NOT NULL
,department_name VARCHAR(50) NOT NULL
,price DECIMAL(18,2) NOT NULL
,stock_quantity INT NOT NULL
,primary key (item_id));


INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ('FAO Schwarz Giraffe Giant Plush Toy','Toys and Games',499.99,5)
,('Mega Blocks 80-piece Building Set','Toys and Games',14.89,72)
,('Leapfrog My Pal Violet','Toys and Games',14.99,23)
,('Munchkins Bath Bobbers Toy','Toys and Games',4.99,37)
,('Gerber Babies 5-pack onesies','Clothing and Shoes',12.99,34)
,('Huggies Natural Care Wipes','Health and Household',13.90,4)
,('VTech Musical Rhymes Book','Toys and Games',11.99,23)
,('Aveno Baby Daily Bath Time Gift Set','Health and Household',15.99,13)
,('Infant Optics Baby Monitor','Baby',165.99,4)
,('Summer Infant Contoured Changing Pad','Baby',19.88,7)
,('Huggies Little Snugglers Diapers','Health and Household',30.58,17)
,('Luvable Friends Newborn Socks','Clothing and Shoes',5.17,56)
,('Fisher Price Rock and Play Sleeper','Baby',65.55,2)
,('Pampers Cruisers','Health and Household',44.77,2);

SELECT * FROM products;

CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(50),
over_head_costs DECIMAL(18,2),
primary key (department_id));

INSERT INTO departments (department_name)
SELECT DISTINCT department_name FROM products;


UPDATE departments SET over_head_costs = 10000 WHERE department_id=1;
UPDATE departments SET over_head_costs = 4000 WHERE department_id=2;
UPDATE departments SET over_head_costs = 1000 WHERE department_id=3;
UPDATE departments SET over_head_costs = 5000 WHERE department_id=4;
UPDATE departments SET over_head_costs = 2000 WHERE department_id=5;


ALTER TABLE products 
ADD COLUMN product_sales DECIMAL(18,2);

