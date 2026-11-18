// Simula os métodos de resposta do Express para testar os controllers sem servidor HTTP.
function criarResposta() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
}
module.exports = { criarResposta };
