# WooCommerceManager
Airtable Custom Block for managing a WooCommerce Store
## Usage
### Tables
You can select which tables to use for Orders and Products in the settings form with TablePickers. The table ids will be used so you do not need to worry about errors due to table name change. Table ids are stored in globalConfig. I will be adding features to create the tables for you if they do not exist.
### Fields
Currently, you must manually add the fields to the tables and you must name the fields exactly the same as they are in the data select boxes on the settings form to avoid errors. You must also ensure that the fields are of the correct type for the data requested. Most fields can just be single line text. I will be adding features to create the fields for you based upon the selected items in the data select box.
### Store Connect Form
Enter your store url, consumer key, and consumer secret. Then hit the connect button to connect to your WooCommerce store. Store url must be formatted like this: https://handmademama.net (this is a great site btw). The consumer key and consumer secret are generated in the advanced tab of your store's WooCommerce settings. Click the REST API text button on the top left. For more information on generating keys https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#authentication
### Settings Form
#### Data Select Boxes
Use the data select boxes to choose the data you want to be added to the orders or product table. Selections are saved to globalConfig.
Fields marked with ! contain nested items. I have not finished the functionality for this and requesting those fields will cause an error in Airtable.
### Getting the Data
Once you have configured your settings, connect to your store. You will then see two buttons, one to get orders and one to get products. Click the desired button and your table(s) will be filled withe the requested data.
## Comments/Questions
Contact me at <a href="mailto:h.rustad.design@gmail.com">h.rustad.design@gmail.com</a>
