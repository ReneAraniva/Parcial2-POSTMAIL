# 📦 POSTMAIL API

API REST para gestionar clientes y envíos de la empresa POSTMAIL. Esta API permite registrar clientes, consultar sus créditos, registrar productos y gestionar envíos.

## 🚀 Tecnologías
- Node.js
- Express
- MongoDB (Mongoose)
- Dotenv

## ⚙️ Requisitos previos

- Tener instalado Node.js
- Tener una base de datos MongoDB (local o Atlas)
- Crear un archivo `.env` con la variable `MONGODB_URI`, la que tiene por defecto la API es `mongodb://localhost:27017/dbPostMail`

## 📥 Instalación

```bash
git clone https://github.com/ReneAraniva/Parcial2-POSTMAIL.git
cd Examen-Parcial-final
npm install
```

## ▶️ Ejecutar el servidor

```bash
node app.js
```

## 📡 Endpoints disponibles

### 🔹 Registrar un envío
```bash
POST /envio
```
**Descripción**: Registra un nuevo envío,guarda los datos del cliente y descuenta créditos del cliente segun el peso.

**Registro del cliente**:
-Al llenar la solicitud del envio se registran los datos del cliente para no tener la necesidad de registralo para hacer el pedido
-Se guardan los datos del id auto generado junto con el nombre del cliente y se le traduce los monto a creditos

**Funcionamiento de los créditos según el peso**:
- Cada envío consume créditos del cliente dependiendo del peso total de los productos incluidos:
  - **Peso ≤ 3 libras**: Consume **1 crédito**.
  - **Peso > 3 y ≤ 6 libras**: Consume **2 créditos**.
  - **Peso > 6 libras**: Consume **3 créditos**.
- Los créditos se descuentan automáticamente del saldo del cliente al registrar el envío.
- Si el envío es eliminado, los créditos consumidos se devuelven automáticamente al cliente.

**Montos disponibles**:
- `$135`: 30 créditos.
- `$160`: 40 créditos.
- `$180`: 60 créditos.

Cuerpo de la solicitud:
```json
{
  "nombre": "Juan Pérez",
  "direccion": "Colonia Escalón, San Salvador",
  "telefono": "555-1234",
  "referencia": "Casa con portón azul",
  "observacion": "Entregar en horario de la tarde",
  "productos": [
    {
      "descripcion": "Laptop",
      "peso": 2.5,
      "bultos": 1,
      "fecha_entrega": "2025-05-10"
    },
    {
      "descripcion": "Monitor",
      "peso": 4.5,
      "bultos": 1,
      "fecha_entrega": "2025-05-10"
    }
  ],
  "monto": 135
}
```

Ejemplo de respuesta:
```json
{
  "message": "Envío registrado exitosamente.",
  "creditoRestante": 28
}
```

---

### 🔹 Obtener todos los envíos
```bash
GET /envio
```
**Descripción**: Devuelve una lista de todos los envíos registrados.

Ejemplo de respuesta:
```json
[
  {
    "_id": "645a1b2c3d4e5f6789012346",
    "clienteId": "645a1b2c3d4e5f6789012345",
    "nombre": "Juan Pérez",
    "direccion": "Colonia Escalón, San Salvador",
    "telefono": "555-1234",
    "referencia": "Casa con portón azul",
    "observacion": "Entregar en horario de la tarde",
    "productos": [
      {
        "descripcion": "Laptop",
        "peso": 2.5,
        "bultos": 1,
        "fecha_entrega": "2025-05-10"
      }
    ]
  },
  {
    "_id": "645a1b2c3d4e5f6789012347",
    "clienteId": "645a1b2c3d4e5f6789012345",
    "nombre": "María Gómez",
    "direccion": "Residencial San Benito, San Salvador",
    "telefono": "555-5678",
    "referencia": "Edificio color beige, apartamento 3B",
    "observacion": "Llamar antes de entregar",
    "productos": [
      {
        "descripcion": "Teléfono celular",
        "peso": 0.3,
        "bultos": 1,
        "fecha_entrega": "2025-05-12"
      },
      {
        "descripcion": "Audífonos inalámbricos",
        "peso": 0.2,
        "bultos": 1,
        "fecha_entrega": "2025-05-12"
      }
    ]
  }
]
```

---

### 🔹 Verificar créditos disponibles de un cliente
```bash
GET /cliente/credito/:clienteId
```
**Descripción**: Consulta los créditos disponibles de un cliente.

Ejemplo de solicitud:
```bash
GET http://localhost:3000/cliente/credito/645a1b2c3d4e5f6789012345
```

Ejemplo de respuesta:
```json
{
  "clienteId": "645a1b2c3d4e5f6789012345",
  "nombre": "Juan Pérez",
  "credito": 135
}
```

---

### 🔹 Consultar un envío por su ID
```bash
GET /envio/:id
```
**Descripción**: Devuelve los detalles de un envío específico.

Ejemplo de solicitud:
```bash
GET http://localhost:3000/envio/645a1b2c3d4e5f6789012346
```

Ejemplo de respuesta:
```json
{
  "_id": "645a1b2c3d4e5f6789012346",
  "clienteId": "645a1b2c3d4e5f6789012345",
  "nombre": "Juan Pérez",
  "direccion": "Colonia Escalón, San Salvador",
  "telefono": "555-1234",
  "referencia": "Casa con portón azul",
  "observacion": "Entregar en horario de la tarde",
  "productos": [
    {
      "descripcion": "Laptop",
      "peso": 2.5,
      "bultos": 1,
      "fecha_entrega": "2025-05-10"
    }
  ]
}
```

---

### 🔹 Eliminar un envío
```bash
DELETE /envio/:id
```
**Descripción**: Elimina un envío y restaura los créditos consumidos al cliente.

Ejemplo de solicitud:
```bash
DELETE http://localhost:3000/envio/645a1b2c3d4e5f6789012346
```

Ejemplo de respuesta:
```json
{
  "message": "Envío eliminado exitosamente y crédito restaurado.",
  "creditoRestante": 30
}
```

---

## 🗂️ Estructura de carpetas

```
Examen Parcial final/
│
├── app.js
├── .env
├── package.json
├── models/
│   ├── cliente.js
│   └── envio.js
├── services/
│   └── databases.js
└── utils/
    └── costoenvio.js
```

---
