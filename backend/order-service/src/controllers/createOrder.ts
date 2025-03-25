import { Request, Response } from "express";
import prisma from "../database/prisma"; 
import { SelectedItem } from "../database/models/items";
import { sendToInventoryQueue } from "../services/rabbitMqService";

export const createOrder = async (req: Request, res: Response) => {
  const { customerData, selectedItems, warehouse_id } = req.body; 

  try {
    // Create Customer record

    let customer = await prisma.customer.findUnique({
        where: {
          email: customerData.email,
        },
      });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerData.name,
          email: customerData.email,
          address: customerData.address, 
        },
      });
    }

    // Create the Orders linked to the Customer
    const orders = await Promise.all(
      selectedItems.map(async (item: SelectedItem) => {
        const { product, quantity, total } = item;
        const productId = product.id;
    
        // สร้าง order
        const order = await prisma.order.create({
          data: {
            customerId: customer.id,
            productId,
            warehouseId: warehouse_id,
            quantity,
            totalPrice: total,
            status: "Pending",
          },
        });
    
        // ส่งข้อมูลไปยัง RabbitMQ
        await sendToInventoryQueue({
          warehouseId: warehouse_id,
          productId,
          quantity,
          type: "decrease" 
        });
    
        return order;
      })
    );
       

    // Return the created customer and orders
    res.status(201).json({ customer, orders });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};