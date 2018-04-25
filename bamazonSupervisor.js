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
console.log(chalk.bgCyan('\n*******************************************'));
console.log(chalk.bgCyan('*  Welcome Bamazon Baby Store Supervisor  *'));
console.log(chalk.bgCyan('*******************************************\n'));

function menu() {

    // instantiate table//
    var table = new Table({
        head: [chalk.cyan('Id'), chalk.cyan('Department'), chalk.cyan('Overhead Costs'), chalk.cyan('Product Sales'), chalk.cyan('Total Profit')]
        , colWidths: [5, 30, 18, 18, 18]
    });

    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Add New Department'],
            name: 'command'
        }
    ]).
        then(function (inquirerResponse) {
            var command = inquirerResponse.command;

            console.log(chalk.bgCyan('\n***   ' + command + '   ***\n'))

            if (command === 'View Product Sales by Department') {
                connection.query('SELECT department_id, departments.department_name, over_head_costs, IFNULL(SUM(product_sales),0) AS product_sales, IFNULL(SUM(product_sales),0) - over_head_costs AS total_profit FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY department_id,departments.department_name, over_head_costs', function (error, response) {
                    //if error, print error//
                    if (error) {
                        console.log(error);
                    }

                    //else, push products into products array//
                    for (var i = 0; i < response.length; i++) {
                        var id = response[i].department_id;
                        var department = response[i].department_name;
                        var over_head_costs = response[i].over_head_costs.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        var product_sales = response[i].product_sales.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        var total_profit = response[i].total_profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        array.push(id);
                        array.push(department);
                        array.push(over_head_costs);
                        array.push(product_sales);
                        array.push(total_profit);

                        table.push(array);
                        array = [];
                    }

                    console.log(table.toString());

                    mainMenu();

                })
            }
            if (command === 'Add New Department') {
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Department Name:',
                        name: 'department'
                    },
                    {
                        type: 'input',
                        message: 'Overhead Costs: ',
                        name: 'overhead'
                    }
                ]).
                then(function(inquirerResponse){
                    var department = inquirerResponse.department;
                    var overhead = inquirerResponse.overhead;

                    var query = connection.query("INSERT INTO departments SET ?",
                    {
                        department_name: department,
                        over_head_costs: overhead
                    },function (err, res) {
                        console.log('\n' + res.affectedRows + " department has been added.\n");
                        mainMenu();
                    })
                }) 
            }
        });
};

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