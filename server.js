const express = require("express");
const bodyPrarser = require("body-parser");
const dotenv = require("dotenv");
const port = 3001;
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

dotenv.config();

app.use(bodyPrarser.json());
app.use(bodyPrarser.urlencoded({ extended: true }));

app.get("/check-db-connection", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Connected to the database" });
  } catch (error) {
    res.status(500).json({ error: "Cannot connect to the database" });
  }
});

app.post("/customer/create", async (req, res) => {
  try {
    const payload = req.body;
    const customer = await prisma.customer.create({ data: payload });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/customer/list", async (req, res) => {
  try {
    const customer = await prisma.customer.findMany();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//select where id
app.get("/customer/detail/:id", async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//startsWith select where name keyword คำขึ้นต้น
app.get("/customer/startsWith", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          startsWith: keyword,
        },
      },
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//endsWith select where name keyword คำลงท้าย
app.get("/customer/endsWith", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          endsWith: keyword,
        },
      },
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//contains select where name keyword โชว์รายชื่อที่มีตัวอักษรเดียวกันที่ส่งไป
app.get("/customer/contains", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//update
app.put("/customer/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const customer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: payload,
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//delete
app.delete("/customer/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.customer.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "Customer delete successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
