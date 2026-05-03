-- Add a slow-selling product to demonstrate forecast capabilities
DO $$
DECLARE
    v_product_id TEXT := 'slow-sell-prod-001';
    v_warehouse_id TEXT;
    v_customer_id TEXT;
    v_day_offset INTEGER;
BEGIN
    -- 1. Get a warehouse and a customer
    SELECT id INTO v_warehouse_id FROM "Warehouse" LIMIT 1;
    SELECT id INTO v_customer_id FROM "Customer" WHERE email = 'demo@flexistock.com' LIMIT 1;

    -- If no demo customer, create one
    IF v_customer_id IS NULL THEN
        v_customer_id := 'demo-cust-id';
        INSERT INTO "Customer" (id, name, email, address)
        VALUES (v_customer_id, 'Demo Business', 'demo@flexistock.com', '123 Logistics Way, Bangkok')
        ON CONFLICT (email) DO NOTHING;
    END IF;

    -- 2. Insert the slow-selling product
    INSERT INTO "Product" (id, name, description, price, "createdAt")
    VALUES (v_product_id, 'Low Demand Widget', 'A product with very low historical sales', 499.00, NOW() - INTERVAL '90 days')
    ON CONFLICT (id) DO NOTHING;

    -- 3. Add to inventory
    INSERT INTO "Inventory" (id, "warehouseId", "productId", stock, "minStock", "maxStock")
    VALUES ('inv-' || v_product_id, v_warehouse_id, v_product_id, 100, 10, 200)
    ON CONFLICT (id) DO NOTHING;

    -- 4. Generate very sparse historical orders (e.g., only 5 orders over 60 days)
    -- This will result in a flat or low forecast
    INSERT INTO "Order" (id, "customerId", "productId", "warehouseId", quantity, "totalPrice", status, "createdAt")
    VALUES 
    ('ORD-SLOW-1', v_customer_id, v_product_id, v_warehouse_id, 1, 499.00, 'Delivered', NOW() - INTERVAL '55 days'),
    ('ORD-SLOW-2', v_customer_id, v_product_id, v_warehouse_id, 1, 499.00, 'Delivered', NOW() - INTERVAL '40 days'),
    ('ORD-SLOW-3', v_customer_id, v_product_id, v_warehouse_id, 2, 998.00, 'Delivered', NOW() - INTERVAL '25 days'),
    ('ORD-SLOW-4', v_customer_id, v_product_id, v_warehouse_id, 1, 499.00, 'Delivered', NOW() - INTERVAL '10 days'),
    ('ORD-SLOW-5', v_customer_id, v_product_id, v_warehouse_id, 1, 499.00, 'Delivered', NOW() - INTERVAL '2 days');

    RAISE NOTICE 'Slow-selling product and sparse order history added successfully.';
END $$;
