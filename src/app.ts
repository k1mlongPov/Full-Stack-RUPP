import express,{Application, Request, Response} from "express";
import { setupSwagger } from "./swagger";
import products from "./data/products";
import users from "./data/users";
import pool from "./config/db";

const app: Application = express();
app.use(express.json());

setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
    res.send("Server is running...");
})
app.get('/teacher' , async (req: Request, res: Response) => {
    const result = await pool.query(
        "SELECT * FROM teacher"
    );
    res.status(200).json(result.rows);
})
app.get('/teacher/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const query = `SELECT * FROM teacher WHERE id=${id}`;

    const result = await pool.query(query);

   res.status(200).json(result.rows);
})
app.post('/teacher', async (req: Request, res: Response) => {
    const {name, email, gender, subject} = req.body;
    const query =  `INSERT INTO teacher (name, email, gender, subject) VALUES ($1, $2, $3, $4)`;
    const value = [name, email, gender, subject];
    const result = await pool.query(query, value);
    res.status(201).json({
        message: `Successfully created teacher`,
        success: true,
        data: result,
    });
})
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/user", (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'Users request succeed.', data: users});
})
app.get('/user/byId/:id', (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
       return res.status(404).json({success: false, message: 'User not found!'});
    }

    return res.status(200).json({
        success: true,
        user: user,
        message: 'User found!',
    })
})
app.get('/user/byName/:name', (req: Request, res: Response) => {
    const userName = String(req.params.name);
    const user = users.find(
        user => user.name.toLowerCase() === userName.toLowerCase()
    );
    console.log(user);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found!'
        });
    }

    return res.status(200).json({
        success: true,
        user: user,
        message: 'User found!',
    });
})
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
app.post('/user', (req: Request, res: Response) => {
    console.log(req.body);

    const {name, age, role} = req.body || {};

    if (!name || !age || !role) {
        return res.status(400).json({success: false, error: 'Please enter a valid name.'});
    }
    const newUser = {
        id: users.length + 1,
        name,
        age,
        role,
    }

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'Create user succeeded.',
        data: newUser
    });
})
app.put('/user/:id', (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const { name, age, role } = req.body;

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found!',
        });
    }
    const newUser = {
        id: userId,
        name,
        age,
        role,
    }
    users.splice(users.indexOf(user), 1, newUser);
    res.status(200).json({
        success: true,
        message: 'Update user succeeded.',
        data: user,
    });
});
app.patch('/user/:id', (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found!',
        });
    }

    const { name, age, role } = req.body;

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (role !== undefined) user.role = role;

    res.status(200).json({
        success: true,
        message: 'Patch user succeeded.',
        data: user,
    });
})
app.delete('/user/:id', (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({success: false, message: 'User not found!'});
    }

    users.splice(users.indexOf(user), 1);


    return res.status(200).json({
        success: true,
        message: 'Deleted succeeded.!',
    })
})




app.get("/product", (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'Products request succeed.', data: products});
})
app.get('/product/byName/:name' , (req: Request, res: Response) => {
    const productName = String(req.params.name);
    if(!productName) {
        return res.status(404).json({success: false, message: 'Product not found!'});
    }
    const product = products.find(p => p.name === productName);
    return  res.status(200).json({
        success: true,
        product: product,
        message: 'Products request succeeded.',
    })
})
app.get('/product/byId/:id' , (req: Request, res: Response) => {
    const productId = Number(req.params.id);
    if(!productId) {
        return res.status(404).json({success: false, message: 'Product not found!'});
    }
    const product = products.find(p => p.id === productId);
    return  res.status(200).json({
        success: true,
        product: product,
        message: 'Products request succeeded.',
    })
})

app.post('/product', (req: Request, res: Response) => {
    const {name, price, desc} = req.body || {};
    if (!name || !price || !desc || !name) {
        return res.status(400).json({success: false, message: 'Please enter a valid name.'});
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        desc
    }

    products.push(newProduct);
    res.status(201).json({
        success: true,
        message: 'Create product succeeded.',
        data: newProduct
    })
})

export default app;

