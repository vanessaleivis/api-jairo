import express from "express";
import fs from "fs";

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Función para leer datos del archivo db.json
const readData = () => {
    try {
        const data = fs.readFileSync("./db.json", "utf-8");
        return JSON.parse(data); // Devuelve un array
    } catch (error) {
        console.error("Error al leer el archivo db.json:", error.message);
        return [];
    }
};

// Función para escribir datos al archivo
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Error al escribir en el archivo db.json:", error.message);
    }
};

// 🟢 Mostrar todos los empleados
app.get("/empleado", (req, res) => {
    const data = readData();
    res.json(data);
});

// 🟢 Mostrar un empleado por ID
app.get("/empleado/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const empleado = data.find((e) => e.id === id);

    if (!empleado) {
        return res.status(404).send("Empleado no encontrado");
    }

    res.json(empleado);
});

// 🟡 Actualizar un empleado por ID
app.put("/empleado/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const newData = req.body;

    const data = readData();
    const index = data.findIndex((e) => e.id === id);

    if (index === -1) {
        return res.status(404).send("Empleado no encontrado");
    }

    data[index] = { ...data[index], ...newData };
    writeData(data);

    res.send(`Empleado con ID ${id} actualizado correctamente`);
});

// 🔴 Eliminar un empleado por ID
app.delete("/empleado/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const filteredData = data.filter((e) => e.id !== id);

    if (data.length === filteredData.length) {
        return res.status(404).send("Empleado no encontrado");
    }

    writeData(filteredData);
    res.send(`Empleado con ID ${id} eliminado correctamente`);
});

// 🔵 Ruta raíz
app.get("/", (req, res) => {
    res.send("Hola Mundo desde Express con empleados.json");
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
