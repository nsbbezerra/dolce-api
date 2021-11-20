const {calcularPrecoPrazo} = require('correios-brasil');

module.exports = {
  async CalcSending(req, res) {
    const {
      cepOrigem,
      cepDestino,
      peso,
      formato,
      comprimento,
      altura,
      largura,
      servicos,
      diametro,
    } = req.body;
    let args = {
      sCepOrigem: cepOrigem,
      sCepDestino: cepDestino,
      nVlPeso: peso,
      nCdFormato: formato,
      nVlComprimento: comprimento,
      nVlAltura: altura,
      nVlLargura: largura,
      nCdServico: servicos, //Array com os códigos de serviço
      nVlDiametro: diametro,
    };

    try {
      calcularPrecoPrazo(args)
        .then(response => {
          return res.status(201).json(response);
        })
        .catch(error => {
          const errorMessage = error.message;
          return res.status(400).json({
            message: 'Ocorreu um erro ao calcular o frete',
            errorMessage,
          });
        });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: 'Ocorreu um erro ao calcular o frete',
        errorMessage,
      });
    }
  },
};
