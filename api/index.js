const express = require('express')
const pool = require('./db')
const app = express()
app.use(express.json())

app.get("/carts", async (req, res) => {
    try {
        let carts = await pool.query(`SELECT * from carts`)
        res.status(200).send({
            status : true,
            message : 'Carts retrieved successfully',
            data : carts.rows
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
})
app.get("/carts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let carts = await pool.query(`SELECT * FROM carts WHERE "idCart" = $1`, [id]);
        res.status(200).send({
            status : true,
            message : 'Carts retrieved successfully',
            data : carts.rows
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
})

app.post("/carts", async (req, res) => {
    try {
        const { id, name, image, amount, price, weight } = req.body;

        const carts = await pool.query(
            `INSERT INTO carts (id, name, image, amount, price, weight) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`, 
            [id, name, image, amount, price, weight]
        );

        res.status(200).send({
            status: true,
            message: 'Product added to cart successfully',
            data: carts.rows[0] // Mengambil baris pertama dari hasil query
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
});

app.put("/carts/:id", async (req, res) => {
    try {
        const { id, name, image, amount, price, weight } = req.body;
        const idCart = req.params.id;
        const carts = await pool.query(
            `UPDATE carts 
             SET id = $1, name = $2, image = $3, amount = $4, price = $5, weight = $6
             WHERE "idCart" = $7
             RETURNING *`, 
            [id, name, image, amount, price, weight, idCart]
        );
        if (carts.rowCount === 0) {
            return res.status(404).send({
                status: false,
                message: 'Cart not found'
            });
        }

        res.status(200).send({
            status: true,
            message: 'Product change to cart successfully',
            data: carts.rows[0] // Mengambil baris pertama dari hasil query
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
});

app.delete("/carts/:id", async (req,res) => {
    try {
        const idCart = req.params.id;
        const carts = await pool.query(
            `DELETE FROM carts WHERE "idCart" = $1 RETURNING *`, [idCart]
        )

        if (carts.rowCount === 0) {
            return res.status(404).send({
                status: false,
                message: 'Cart not found'
            });
        }
        res.status(200).send({
            status: true,
            message: 'Product Deleted successfully',
            data: carts.rows[0] // Mengambil baris pertama dari hasil query
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
})


const port = 3478
app.listen(port, () => {
    console.log(`API Berjalan Di Port: ${port}`)
})