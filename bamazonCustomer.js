//Require dependencies//
var inquirer = require('inquirer');
var mysql = require('mysql');
var chalk = require('chalk');

//global variables//
var ordered;
var db_inStock;
var db_product;
var db_itemId;
var db_price;

//connect to mySQL DB//
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Eli03242017!',
    database: 'bamazon'
});

//Store Welcome//
console.log(chalk.bgCyan('\n***************************************'));
console.log(chalk.bgCyan('*  Welcome to the Bamazon Baby Store  *'));
console.log(chalk.bgCyan('***************************************\n'));


//List all products & prompt users to purchase//
function setup() {
    ordered = false;
    //variables//
    var products = [];//array for products to use in inquirer prompt

    console.log('');

    //select from products table//
    connection.query('SELECT * FROM products', function (error, response) {
        //if error, print error//
        if (error) {
            console.log(error);
        }

        //else, push products into products array//
        for (var i = 0; i < response.length; i++) {
            var id = response[i].item_id;
            var product = response[i].product_name;
            var price = response[i].price;

            var row = id + ' | ';
            row += product + ' | $';
            row += price;
            products.push(row);
        }

        //setup validation for inquirer/
        const requireQuantity = value => {
            if (isNaN(value)) {
                return 'Please enter a valid quantity.';
            }
            return true;
        };

        inquirer.prompt([
            {
                type: 'list',
                message: chalk.cyan('Which product would you like to purchase? Select from inventory: \n'),
                choices: products, //from product array 
                name: 'productId'
            },
            {
                type: 'input',
                message: 'How many would you like?',
                name: 'quantity',
                validate: requireQuantity
            }
        ]).
            then(function (inquirerResponse) {
                console.log('');

                productId = inquirerResponse.productId;
                quantity = inquirerResponse.quantity;

                //query MySQL database//
                connection.query('SELECT * FROM products WHERE item_id = ?', [productId], function (error, response) {
                    db_inStock = response[0].stock_quantity;
                    db_product = response[0].product_name;
                    db_itemId = response[0].item_id;
                    db_price = response[0].price;

                    //if quantity in stock, let user know they have purchased//
                    if (db_inStock >= quantity) {
                        ordered = true;
                        //display order details//
                        orderDetails();
                        //update database  -  reduce stock_quantity by quantity purchased
                        query = connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantity + ' WHERE item_id=' + db_itemId, function (error, response) {
                        })

                        reOrder();
                    }

                    else {
                        //if none in stock, let user know there are no units in stock and prompt if they would like to place another order//
                        if (db_inStock === 0) {
                            console.log('\nWe\'re sorry.  This item is not in stock.\n');
                            reOrder();
                        }
                        //if some units are in stock, let the user know how many are available & prompt if they would like to order that quantity//
                        if (db_inStock > 0) {
                            console.log('We\'re sorry. This item is not in stock at the quantity you have requested.');
                            console.log('There are currently ' + chalk.cyan(db_inStock) + ' units in stock.\n');

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    message: 'Would you like to reduce your order to ' + chalk.cyan(db_inStock) + ' ' + chalk.cyan(db_product) + '?',
                                    choices: ['Yes', 'No'],
                                    name: 'reduceOrder'
                                }
                            ]).then(function (inquirerResponse) {
                                
                                //if they would like to reduce their order to inStock units, reduce quantity & place order//
                                if (inquirerResponse.reduceOrder === 'Yes') {
                                    ordered = true;
                                    quantity = db_inStock;
                                    //display order details//
                                    orderDetails();
                                    //update database  -  reduce stock_quantity by quantity purchased
                                    query = connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + db_inStock + ' WHERE item_id=' + db_itemId, function (error, response) {

                                        reOrder();
                                    })
                                }
                                else {
                                    reOrder();
                                }
                            })
                        }
                    }
                })
            })
    })
};

//display order details//
function orderDetails(){
console.log(chalk.bgCyan('\n*    Thank you for your purchase!    *\n'));
console.log(chalk.cyan('***   Order Details:   ***'));
console.log(chalk.cyan('Product: ' + db_product));
console.log(chalk.cyan('Units: ' + quantity));
console.log(chalk.cyan('Price Per Unit: ' + db_price));
console.log(chalk.cyan('Total Price: ' + db_price * quantity + '\n'));
}

//prompt user for another order//
function reOrder() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Would you like to place another order?',
            choices: ['Yes', 'No'],
            name: 'reorder'
        }
    ]).
        then(function (inquirerResponse) {
            //if yes, return to setup menu//
            if (inquirerResponse.reorder === 'Yes') {
                setup();
            }
            //if no, end MySQL connection and display message//
            else {
                if (ordered === true) {
                    console.log(chalk.bgCyan('\n***   Thank you for shopping at Bamazon Baby Store   ***'));
                    console.log(chalk.cyan('You should receive your order within 2-4 business days.'));
                }
                else {
                    console.log(chalk.bgCyan('\nWe apologize for the inconvenience. Please try back again!'));
                }
                connection.end();
            }
        })
}

//START//
setup();
