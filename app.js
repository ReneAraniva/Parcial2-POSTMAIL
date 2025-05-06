const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Envio = require('./models/envio'); // Modelo de Envío
const Cliente = require('./models/cliente'); // Modelo de Cliente
require('./services/databases'); // Configuración de la base de datos
require('dotenv').config();

const port = process.env.PORT || 3000;
app.use(express.json());

// GET: Obtener todos los envíos
app.get('/envio', async (req, res) => {
  try {
    const envios = await Envio.find();
    res.json(envios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los envíos', detalles: err.message });
  }
});

// POST: Registrar un envío
app.post('/envio', async (req, res) => {
  try {
    const { nombre, direccion, telefono, referencia, observacion, productos, monto } = req.body;

    // Validar el monto seleccionado
    let creditoDisponible = 0;
    switch (monto) {
      case 135: // $135 x 30 envíos
        creditoDisponible = 30;
        break;
      case 160: // $160 x 40 envíos
        creditoDisponible = 40;
        break;
      case 180: // $180 x 60 envíos
        creditoDisponible = 60;
        break;
      default:
        return res.status(400).json({ error: 'Monto inválido. Seleccione un monto válido ($135, $160 o $180).' });
    }

    // Verificar si el cliente ya existe por nombre y teléfono
    let cliente = await Cliente.findOne({ nombre, telefono });
    if (!cliente) {
      // Crear un nuevo cliente si no existe
      cliente = new Cliente({
        nombre,
        credito: creditoDisponible,
      });
      await cliente.save();
    }

    // Calcular el crédito necesario basado en el peso
    let creditoNecesario = 0;
    productos.forEach((producto) => {
      creditoNecesario += Math.ceil(producto.peso / 3); // Cada 3 libras consume 1 crédito
    });

    // Verificar si el cliente tiene crédito suficiente
    if (cliente.credito < creditoNecesario) {
      return res.status(400).json({ error: 'Crédito insuficiente para realizar este envío.' });
    }

    // Crear el envío
    const envio = new Envio({
      clienteId: cliente._id, 
      nombre,
      direccion,
      telefono,
      referencia,
      observacion,
      productos,
    });

    await envio.save();

    // Descontar el crédito del cliente
    cliente.credito -= creditoNecesario;
    await cliente.save();

    res.status(201).json({
      message: 'Envío registrado exitosamente.',
      creditoRestante: cliente.credito,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el envío', detalles: err.message });
  }
});

// GET: Verificar la cantidad de envíos disponibles para un cliente
app.get('/cliente/credito/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Buscar el cliente por _id
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado. Asegúrate de que el clienteId sea correcto.' });
    }

    // Responder con el nombre y los créditos disponibles
    res.json({
      clienteId: cliente._id,
      nombre: cliente.nombre,
      credito: cliente.credito,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar el crédito', detalles: err.message });
  }
});

// GET: Consultar un envío por su ID autogenerado
app.get('/envio/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el envío por su ID
    const envio = await Envio.findById(id);
    if (!envio) {
      return res.status(404).json({ error: 'Envío no encontrado.' });
    }

    // Responder con los datos del envío
    res.json(envio);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el envío', detalles: err.message });
  }
});

// DELETE: Eliminar un envío
app.delete('/envio/:id', async (req, res) => {
  try {
    const envio = await Envio.findById(req.params.id);
    if (!envio) {
      return res.status(404).json({ error: 'Envío no encontrado' });
    }

    // Buscar al cliente asociado al envío
    const cliente = await Cliente.findById(envio.clienteId);
    if (cliente) {
      // Restaurar todos los créditos consumidos por el envío
      let creditoReembolsado = 0;
      envio.productos.forEach((producto) => {
        creditoReembolsado += Math.ceil(producto.peso / 3);
      });

      // Actualizar el crédito del cliente
      cliente.credito += creditoReembolsado;
      await cliente.save();
    }

    
    await Envio.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Envío eliminado exitosamente y crédito restaurado.',
      creditoRestante: cliente ? cliente.credito : 0,
    });
  } catch (err) {
    console.error('Error al eliminar el envío:', err);
    res.status(500).json({ error: 'Error al eliminar el envío', detalles: err.message });
  }
});

app.get('/', (req, res) => res.send('API de POSTMAIL funcionando correctamente'));

app.listen(port, () => 
  console.log(`Servidor corriendo exitosamente en el puerto ${port}`)
);