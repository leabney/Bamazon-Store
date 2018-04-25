//Require dependencies//
var inquirer = require('inquirer');
var mysql = require('mysql');
var chalk = require('chalk');
var Table = require('cli-table');


//global variables//
var array = [];

//connect to mySQL DB//
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Eli03242017!',
    database: 'bamazon'
});

//Store Welcome//
console.log(chalk.bgCyan('\n****************************************'));
console.log(chalk.bgCyan('*  Welcome Bamazon Baby Store Manager  *'));
console.log(chalk.bgCyan('****************************************\n'));

function menu() {

    // instantiate table//
var table = new Table({
    head: [chalk.cyan('Id'), chalk.cyan('Product'), chalk.cyan('Price'), chalk.cyan('Quantity')]
    , colWidths: [5, 40, 10, 10]
});

    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            name: 'command'
        }
    ]).
        then(function (inquirerResponse) {
            var command = inquirerResponse.command;

            console.log(chalk.bgCyan('\n***   ' + command + '   ***\n'))

            if (command === 'View Products for Sale') {
                connection.query('SELECT * FROM products', function (error, response) {
                    //if error, print error//
                    if (error) {
                        console.log(error);
                    }

                    //else, push products into products array//
                    for (var i = 0; i < response.length; i++) {
                        var id = response[i].item_id;
                        var product = response[i].product_name;
                        var price = response[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        var quantity = response[i].stock_quantity;
                        array.push(id);
                        array.push(product);
                        array.push(price);
                        array.push(quantity);

                        table.push(array);
                        array = [];
                    }

                    console.log(table.toString());
                    
                    mainMenu();

                })
            }

            else if (command === 'View Low Inventory') {
                connection.query('SELECT * FROM products WHERE stock_quantity<=5 ORDER BY stock_quantity DESC', function (error, response) {
                    //if error, print error//
                    if (error) {
                        console.log(error);
                    }

                    //else, push products into products array//
                    for (var i = 0; i < response.length; i++) {
                        var id = response[i].item_id;
                        var product = response[i].product_name;
                        var price = response[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        var quantity = response[i].stock_quantity;
                        array.push(id);
                        array.push(product);
                        array.push(price);
                        array.push(quantity);

                        table.push(array);
                        array = [];
                    }

                    console.log(table.toString());
                    mainMenu();

                })
            }
            else if (command === 'Add to Inventory') {
                var products = [];
                var query = connection.query('SELECT * FROM products', function (error, response) {

                    //if error, print error//
                    if (error) {
                        console.log(error);
                    }

                    //else, push products into products array//
                    for (var i = 0; i < response.length; i++) {
                        var id = response[i].item_id;
                        var product = response[i].product_name;
                        var department = response[i].department_name;
                        var price = response[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        var quantity = response[i].stock_quantity;

                        var row = id + ' | ';
                        row += product + ' | ';
                        row += department + ' | ';
                        row += price + ' | ';
                        row += quantity;
                        products.push(row);
                    }

                    inquirer.prompt([
                        {
                            type: 'list',
                            message: 'Select product: ',
                            choices: products,
                            name: 'product'
                        },
                        {type: 'input',
                    message: 'Quantity: ',
                name: 'quantity'}
                    ]).
                        then(function (inquirerResponse) {
                            var product = inquirerResponse.product;
                           var productId =product.substring(0,product.indexOf(' '));
                            var quantityAdd = inquirerResponse.quantity;

                            var query = connection.query('UPDATE products SET stock_quantity = stock_quantity + ' + quantityAdd + ' WHERE item_id = ?',[productId], function (error, response) {
                                
                                //if error, print error//
                                if (error) {
                                    console.log(error);
                                }
                                console.log('\nYou have added ' + quantityAdd + ' unit(s) to inventory.\n');
                                mainMenu();
                            })
                        })

                })
            }

            else if (command === 'Add New Product') {
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Product Name: ',
                        name: 'name'
                    },
                    {
                        type: 'input',
                        message: 'Department: ',
                        name: 'department'
                    },
                    {
                        type: 'input',
                        message: 'Quantity: ',
                        name: 'quantity'
                    },
                    {
                        type: 'input',
                        message: 'Sales price: ',
                        name: 'price'
                    }
                ]).
                    then(function (inquirerResponse) {
                        var product = inquirerResponse.name;
                        var department = inquirerResponse.department;
                        var quantity = inquirerResponse.quantity;
                        var price = inquirerResponse.price;

                        var query = connection.query(
                            "INSERT INTO products SET ?",
                            {
                                product_name: product,
                                department_name: department,
                                stock_quantity: quantity,
                                price: price
                            },
                            function (err, res) {
                                console.log('\n' + res.affectedRows + " product has been added to inventory.\n");
                                mainMenu();
                            }
                        );


                    })

            }
        })
}

function mainMenu() {
    delete table;
    console.log('');
    inquirer.prompt([
        {
            type: 'list',
            message: 'Continue?',
            choices: ['Yes', 'No'],
            name: 'continue'
        }
    ]).
        then(function (inquirerResponse) {
            if (inquirerResponse.continue === 'Yes') {
                console.log('');
                menu();
            }
            else {
                console.log(chalk.bgCyan('\n***   You have been disconnected.   ***'));
                connection.end();
            }
        })
};

menu();