import {initializeBlock, FormField, Input, Button, TablePickerSynced, useBase, useGlobalConfig, Box} from '@airtable/blocks/ui';
import React, { useState } from 'react';
import woocommerceRestApi from '@woocommerce/woocommerce-rest-api';

let storeUrl;
let consumerKey;
let consumerSecret;
let api;

function App() {
    const [viewSettings, setViewSettings] = useState(false);
    return (
        <>
        {!viewSettings && <StoreConnectForm></StoreConnectForm>}
        {!viewSettings && <Button onClick={() => setViewSettings(true)}>Settings</Button>}
        {viewSettings && <SettingsForm></SettingsForm>}
        </>
    );
}

function StoreConnectForm() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const ordersTableId = globalConfig.get('ordersTableId');
    const productsTableId = globalConfig.get('productsTableId');
    const ordersTable = base.getTableByIdIfExists(ordersTableId);
    const productsTable = base.getTableByIdIfExists(productsTableId);
    const orderDataSelected = globalConfig.get('orderDataSelected');
    const [connected, setConnected] = useState(false);
    return (
        <div>
            {!connected && <StoreUrlField></StoreUrlField>}
            {!connected && <ConsumerKeyField></ConsumerKeyField>}
            {!connected && <ConsumerSecretField></ConsumerSecretField>}
            {!connected && <Button onClick={() => {
                api = StoreConnect(storeUrl, consumerKey, consumerSecret);
                setConnected(true);
            }}>Connect</Button>}
            {connected && <Button onClick={() => GetProducts(api, productsTable)}>Get Products</Button>}
            {connected && <Button onClick={() => GetOrders(api, ordersTable, orderDataSelected)}>Get Orders</Button>}
        </div>
    );
}

function StoreUrlField() {
    const [value, setValue] = useState("");
    return (
        <FormField label="Store Url">
            <Input value={value} onChange={e => {
                setValue(e.target.value);
                storeUrl = e.target.value;
            }}/>
        </FormField>
    );
}

function ConsumerKeyField() {
    const [value, setValue] = useState("");
    return (
        <FormField label="Consumer Key">
            <Input value={value} onChange={e => {
                setValue(e.target.value);
                consumerKey = e.target.value;
            }}/>
        </FormField>
    );
}

function ConsumerSecretField() {
    const [value, setValue] = useState("");
    return (
        <FormField label="Consumer Secret">
            <Input value={value} onChange={e => {
                setValue(e.target.value);
                consumerSecret = e.target.value;
            }}/>
        </FormField>
    );
}

function StoreConnect(url, key, secret) {
    const api = new woocommerceRestApi({
        url: url,
        consumerKey: key,
        consumerSecret: secret,
        version: "wc/v3"
    });
    return api;
}

function GetProducts(api, table) {
    let products;
    api.get("products"//, {
        //per_page: 20,}
        )
    .then((response) => {
        products = response.data;
        AddProductsToTable(table, products);
    })
    .catch((error) => {
        console.log(error);
    });
}

function GetOrders(api, table, orderDataSelected) {
    let orders;
    api.get("orders"//, {
        //per_page: 20,}
    )
    .then((response) => {
        orders = response.data;
        AddOrdersToTable(table, orders, orderDataSelected);
    })
    .catch((error) => {
        console.log(error);
    });
}

function AddProductsToTable(table, data, productDataSelected) {
    //globalConfig.get('productFieldsDisplayed');
    let recordDefs = [];
    const entries = new Map();
    data.forEach(row => {
        productDataSelected.forEach(selectedItem => {
            entries.set(selectedItem, row[selectedItem]);
        });
        const fields = Object.fromEntries(entries);
        recordDefs.push(fields);
    });
    if(table.hasPermissionToCreateRecords(recordDefs)) {
        table.createRecordsAsync(recordDefs);
    }
}

function AddOrdersToTable(table, data, orderDataSelected) {
    let recordDefs = [];
    const entries = new Map();
    data.forEach(row => {
        orderDataSelected.forEach(selectedItem => {
            entries.set(selectedItem, row[selectedItem]);
        });
        const fields = Object.fromEntries(entries);
        recordDefs.push(fields);
    });
    if(table.hasPermissionToCreateRecords(recordDefs)) {
        table.createRecordsAsync(recordDefs);
    }
}

function SettingsForm() {
    //const globalConfig = useGlobalConfig();
    //const lineItemsActive = globalConfig.get('orderLineItems');
    return (
        <>
        <Box>
            <OrdersTablePicker></OrdersTablePicker>
            <ProductsTablePicker></ProductsTablePicker>
        </Box>
        <Box>
            <OrderResponseDataSelect></OrderResponseDataSelect>
        </Box>
        <Box>
            <ProductResponseDataSelect></ProductResponseDataSelect>
        </Box>
        </>
    );
    //{lineItemsActive == 'true' && <LineItemsSelect></LineItemsSelect>}
}

function OrdersTablePicker() {
    return (
        <>
        <label>Select Orders Table</label>
        <TablePickerSynced
            name="ordersTablePicker"
            globalConfigKey="ordersTableId"
            placeholder=" Select the Orders Table"
            width="320px"
        ></TablePickerSynced>
        </>
    );
}

function ProductsTablePicker() {
    return (
        <TablePickerSynced
            name="productsTablePicker"
            globalConfigKey="productsTableId"
            placeholder="Select the Products Table"
            width="320px"
        ></TablePickerSynced>
    );
}

function OrderResponseDataSelect() {
    const globalConfig = useGlobalConfig();
    const orderResponseDataSelectOptions = [
        {value: 'id', string: 'id'},
        {value: 'number', string: 'number'},
        {value: 'order_key', string: 'order key'},
        {value: 'created_via', string: 'created via'},
        {value: 'version', string: 'version'},
        {value: 'status', string: 'status'},
        {value: 'currency', string: 'currency'},
        {value: 'date_created', string: 'date created'},
        {value: 'date_modified', string: 'date modified'},
        {value: 'date_completed', string: 'date completed'},
        {value: 'discount_total', string: 'discount total'},
        {value: 'discount_tax', string: 'discount tax'},
        {value: 'shipping_total', string: 'shipping total'},
        {value: 'shipping_tax', string: 'shipping tax'},
        {value: 'cart_tax', string: 'cart_tax'},
        {value: 'total', string: 'total'},
        {value: 'total_tax', string: 'total tax'},
        {value: 'prices_include_tax', string: 'prices include tax'},
        {value: 'customer_id', string: 'customer id'},
        {value: 'customer_ip_address', string: 'customer ip address'},
        {value: 'customer_user_agent', string: 'customer user agent'},
        {value: 'customer_note', string: 'customer note'},
        {value: 'billing', string: 'billing!'},
        {value: 'shipping', string: 'shipping!'},
        {value: 'payment_method', string: 'payment method'},
        {value: 'payment_method_title', string: 'payment method title'},
        {value: 'transaction_id', string: 'transaction id'},
        {value: 'date_paid', string: 'date paid'},
        {value: 'cart_hash', string: 'cart hash'},
        {value: 'meta_data', string: 'meta data!'},
        {value: 'line_items', string: 'line items!'},
        {value: 'tax_lines', string: 'tax lines!'},
        {value: 'shipping_lines', string: 'shipping lines!'},
        {value: 'fee_lines', string: 'fee lines!'},
        {value: 'coupon_lines', string: 'coupon lines!'},
        {value: 'refunds', string: 'refunds!'},
        {value: '_links', string: 'links!'}
    ];
    return (
        <>
        <label htmlFor="orderDataSelect">Select Order Data</label>
        <select id="orderDataSelect" name="orderDataSelect" multiple>
        {orderResponseDataSelectOptions.map(function(field, index){
            return <option key={index} value={field.value}>{field.string}</option>;
          })}
        </select>
        <Button onClick={() => {
            let selectedArray = [];
            const select = document.getElementById('orderDataSelect');
            const selectCollection = select.selectedOptions;
            selectCollection.forEach(item => {
                selectedArray.push(item.value);
            });
            if(globalConfig.hasPermissionToSet('orderDataSelected', selectedArray)) {
                globalConfig.setAsync('orderDataSelected', selectedArray);
                if(selectedArray.includes('line_items')) {
                    globalConfig.setAsync('orderLineItems', 'true');
                }
            }
        }}>set order data</Button>
        </>
    );
}

function ProductResponseDataSelect() {
    const globalConfig = useGlobalConfig();
    const productResponseDataSelectOptions = [
        {value: 'id', string: 'id'},
        {value: 'name', string: 'name'},
        {value: 'slug', string: 'slug'},
        {value: 'permalink', string: 'permalink'},
        {value: 'date_created', string: 'date created'},
        {value: 'date_modified', string: 'date modified'},
        {value: 'type', string: 'type'},
        {value: 'status', string: 'status'},
        {value: 'featured', string: 'featured'},
        {value: 'catalog_visibility', string: 'catalog_visibility'},
        {value: 'description', string: 'description'},
        {value: 'short_description', string: 'short description'},
        {value: 'sku', string: 'sku'},
        {value: 'price', string: 'price'},
        {value: 'regular_price', string: 'regular price'},
        {value: 'sale_price', string: 'sale price'},
        {value: 'date_on_sale_from', string: 'date on sale from'},
        {value: 'date_on_sale_to', string: 'date on sale to'},
        {value: 'price_html', string: 'price html'},
        {value: 'on_sale', string: 'on sale'},
        {value: 'purchasable', string: 'purchasable'},
        {value: 'total_sales', string: 'total sales'},
        {value: 'virtual', string: 'virtual'},
        {value: 'downloadable', string: 'downloadable'},
        {value: 'downloads', string: 'downloads!'},
        {value: 'download_limit', string: 'download limit'},
        {value: 'download_expiry', string: 'download expiry'},
        {value: 'external_url', string: 'external url'},
        {value: 'button_text', string: 'button text'},
        {value: 'tax_status', string: 'tax status'},
        {value: 'tax_class', string: 'tax class'},
        {value: 'manage_stock', string: 'manage stock'},
        {value: 'stock_quantity', string: 'stock quantity'},
        {value: 'stock_status', string: 'stock_status'},
        {value: 'backorders', string: 'backorders'},
        {value: 'backorders_allowed', string: 'backorders allowed'},
        {value: 'backordered', string: 'backordered'},
        {value: 'sold_individually', string: 'sold individually'},
        {value: 'weight', string: 'weight'},
        {value: 'dimensions', string: 'dimensions!'},
        {value: 'shipping_required', string: 'shipping required'},
        {value: 'shipping_taxable', string: 'shipping taxable'},
        {value: 'shipping_class', string: 'shipping class'},
        {value: 'shipping_class_id', string: 'shipping class id'},
        {value: 'reviews_allowed', string: 'reviews allowed'},
        {value: 'average_rating', string: 'average rating'},
        {value: 'rating_count', string: 'rating count'},
        {value: 'related_ids', string: 'related ids!'},
        {value: 'upsell_ids', string: 'upsell ids!'},
        {value: 'cross_sell_ids', string: 'cross sell ids!'},
        {value: 'parent_id', string: 'parent_id'},
        {value: 'purchase_note', string: 'purchase note'},
        {value: 'categories', string: 'categories!'},
        {value: 'tags', string: 'tags!'},
        {value: 'images', string: 'images!'},
        {value: 'attributes', string: 'attributes!'},
        {value: 'default_attributes', string: 'default attributes!'},
        {value: 'variations', string: 'variations!'},
        {value: 'grouped_products', string: 'grouped products!'},
        {value: 'menu_order', string: 'menu order'},
        {value: 'meta_data', string: 'meta data!'},
        {value: '_links', string: 'links!'}
    ];
    return (
        <>
        <label htmlFor="productDataSelect">Select Product Data</label>
        <select id="productDataSelect" name="productDataSelect" multiple>
        {productResponseDataSelectOptions.map(function(field, index){
            return <option key={index} value={field.value}>{field.string}</option>;
          })}
        </select>
        <Button onClick={() => {
            let selectedArray = [];
            const select = document.getElementById('productDataSelect');
            const selectCollection = select.selectedOptions;
            selectCollection.forEach(item => {
                selectedArray.push(item.value);
            });
            if(globalConfig.hasPermissionToSet('productDataSelected', selectedArray)) {
                globalConfig.setAsync('productDataSelected', selectedArray);
            }
        }}>set product data</Button>
        </>
    );
}

//function LineItemsSelect() {
    //const lineItemsOptions = [
        //{value: 'id', string: 'id'},
        //{value: 'name', string: 'name'},
        //{value: 'product_id', string: 'product id'},
        //{value: 'variation_id', string: 'variation id'},
        //{value: 'quantity', string: 'quantity'},
        //{value: 'tax_class', string: 'tax class'},
        //{value: 'subtotal', string: 'subtotal'},
        //{value: 'subtotal_tax', string: 'subtotal tax'},
        //{value: 'total', string: 'total_tax'},
        //{value: 'taxes', string: 'taxes!'},
        //{value: 'meta_data', string: 'meta data!'},
        //{value: 'sku', string: 'sku'},
        //{value: 'price', string: 'price'}
    //];
    //return (
        //<>
        //<label htmlFor="lineItemsSelect">Select Line Items</label>
        //<select id="lineItemsSelect" name="lineItemsSelect" multiple>
        //</select>{lineItemsOptions.map(function(field, index){
            //return <option key={index} value={field.value}>{field.string}</option>;
          //})}
        //</select>
        //</>
    //);
//}

//function LineItemsTaxesSelect() {
    //const lineItemsTaxesOptions = [
        //{value: 'id', string: 'id'},
        //{value: 'total', string: 'total'},
        //{value: 'subtotal', string: 'subtotal'}
    //];
    //return (
        //<>
        //<label htmlFor="lineItemsTaxesSelect">Select Line Items Taxes</label>
        //<select id="lineItemsTaxesSelect" name="lineItemsTaxesSelect" multiple>
        //{lineItemsTaxesOptions.map(function(field, index){
            //return <option key={index} value={field.value}>{field.string}</option>;
          //})}
        //</select>
        //</>
    //);
//}

initializeBlock(() => <App />);
