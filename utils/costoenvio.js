function calcularCosto(peso) {
    const costoBase = 135; // Costo base por 3 lb
    if (peso <= 3) return costoBase;
    return costoBase * Math.ceil(peso / 3);
  }
  
  module.exports = { calcularCosto };