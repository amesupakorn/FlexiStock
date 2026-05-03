-- Create a demo customer if not exists
INSERT INTO "Customer" (id, name, email, address)
VALUES ('demo-cust-id', 'Demo Business', 'demo@flexistock.com', '123 Logistics Way, Bangkok')
ON CONFLICT (email) DO NOTHING;

-- Generate historical orders for the last 60 days
DO $$
DECLARE
    rec_p RECORD;
    rec_w RECORD;
    c_id TEXT;
    day_offset INTEGER;
    v_quantity INTEGER;
    v_price DECIMAL;
BEGIN
    SELECT id INTO c_id FROM "Customer" WHERE email = 'demo@flexistock.com' LIMIT 1;

    FOR day_offset IN 0..60 LOOP
        FOR rec_p IN (SELECT id, price FROM "Product") LOOP
            FOR rec_w IN (SELECT id FROM "Warehouse") LOOP
                -- 40% chance of an order
                IF random() > 0.6 THEN
                    v_quantity := floor(random() * 10 + 1);
                    v_price := rec_p.price;
                    
                    INSERT INTO "Order" (id, "customerId", "productId", "warehouseId", quantity, "totalPrice", status, "createdAt")
                    VALUES (
                        'ORD-SEED-' || day_offset || '-' || substr(rec_p.id, 1, 4) || '-' || substr(rec_w.id, 1, 4) || '-' || floor(random() * 1000),
                        c_id,
                        rec_p.id,
                        rec_w.id,
                        v_quantity,
                        v_price * v_quantity,
                        'Delivered',
                        NOW() - (day_offset || ' days')::interval
                    );
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
