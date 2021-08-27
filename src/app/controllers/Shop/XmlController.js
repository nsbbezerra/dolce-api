const knex = require("../../../database/pg");
const parser = require("fast-xml-parser");
const path = require("path");
const fs = require("fs");
const he = require("he");
const NFe = require("djf-nfe");

async function RemoveXml(url) {
  fs.unlink(url, (err) => {
    if (err) console.log(err);
    else {
      console.log();
    }
  });
}

module.exports = {
  async ReadFile(req, res) {
    const { filename } = req.file;

    try {
      const file = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "docs",
        filename
      );

      const readeadFile = fs.readFileSync(file, "utf-8");
      const nfe = NFe(readeadFile);

      function capitalizeFirstLetter(string) {
        let splited = string.split(" ");
        let toJoin = splited.map((e) => {
          return e.charAt(0).toUpperCase() + e.slice(1);
        });
        let joined = toJoin.join(" ");
        return joined;
      }

      const protocolo = nfe.informacoesProtocolo();
      const emitente = nfe.emitente();
      const destinatario = nfe.destinatario();
      const total_itens = nfe.nrItens();
      const chave = protocolo.chave();

      let Key;

      const find_nfe = await knex("xmlimporter")
        .select("*")
        .where({ nfe_key: chave })
        .first();

      if (find_nfe) {
        Key = find_nfe;
      } else {
        const key = await knex("xmlimporter")
          .insert({ nfe_key: chave })
          .returning("*");
        Key = key[0];
      }

      let Produtos = [];
      let Emitente;
      let Total;

      let empresa = capitalizeFirstLetter(emitente.nome().toLowerCase());

      const provider = await knex("providers")
        .select("*")
        .where({ name: empresa })
        .first();

      if (!provider) {
        const emitEnder = emitente.endereco();
        const newProvider = await knex("providers")
          .insert({
            name: empresa,
            cnpj: emitente.cnpj(),
            contact: emitEnder.telefone(),
            email: emitente.email().toLowerCase(),
            street: capitalizeFirstLetter(emitEnder.logradouro().toLowerCase()),
            number: emitEnder.numero(),
            comp: capitalizeFirstLetter(emitEnder.complemento().toLowerCase()),
            district: capitalizeFirstLetter(emitEnder.bairro().toLowerCase()),
            city: capitalizeFirstLetter(emitEnder.municipio().toLowerCase()),
            cep: emitEnder.cep(),
            state: emitEnder.uf(),
            fantasia: capitalizeFirstLetter(emitente.fantasia().toLowerCase()),
          })
          .returning("*");
        Emitente = newProvider[0];
      } else {
        Emitente = provider;
      }

      for (let index = 0; index < total_itens; index++) {
        const item = nfe.item(index + 1);
        const icms = item.imposto().icms();
        const ipi = item.imposto().ipi();
        const pis = item.imposto().pis();
        const cofins = item.imposto().cofins();

        let product = {
          providers_id: Emitente.id,
          xml_id: Key.id,
          provider_code: item.codigo(),
          name: capitalizeFirstLetter(item.descricao().toLowerCase()),
          sku: item.codigo(),
          barcode: item.ean(),
          cfop: item.cfop(),
          ncm: item.ncm(),
          icms_rate: parseFloat(icms.porcetagemIcms()),
          icms_origin: icms.origem(),
          icms_csosn: icms.cst(),
          icms_st_rate: parseFloat(icms.porcetagemIcmsST()),
          icms_marg_val_agregate: parseFloat(icms.porcentagemMVAST()),
          icms_st_mod_bc: icms.modalidadeBCST(),
          icms_base_calc: parseFloat(icms.baseCalculo()), //ADICIONAR NA TABELA
          imcs_st_base_calc: parseFloat(icms.baseCalculoIcmsST()), //ADICIONAR NA TABELA
          fcp_rate: parseFloat(icms.valorFCPST()),
          fcp_st_rate: parseFloat(icms.porcentagemFCPST()),
          fcp_ret_rate: parseFloat(icms.porcentagemFCPSTRetido()),
          fcp_base_calc: parseFloat(icms.baseCalculoFCP()), //ADICIONAR NA TABELA
          fcp_st_base_calc: parseFloat(icms.baseCalculoFCPST()), //ADICIONAR NA TABELA
          ipi_cst: ipi.cst(),
          ipi_rate: parseFloat(ipi.porcentagemIPI()),
          ipi_code: "0",
          ipi_base_calc: parseFloat(ipi.baseCalculo()), //ADICIONAR NA TABELA
          pis_cst: pis.cst(),
          pis_rate: parseFloat(pis.porcentagemPIS()),
          pis_base_calc: parseFloat(pis.baseCalculo()), //ADICIONAR NA TABELA
          cofins_cst: cofins.cst(),
          cofins_rate: parseFloat(cofins.porcentagemCOFINS()),
          cofins_base_calc: parseFloat(cofins.baseCalculo()), //ADICIONAR NA TABELA
          cest: item.cest(),
          cost_value: parseFloat(item.valorUnitario()),
          other_cost: parseFloat(item.valorOutrasDespesas()),
        };

        Produtos.push(product);
      }

      let total = nfe.total();
      Total = {
        valor_frete: parseFloat(total.valorFrete()),
        total_produtos: total.valorProdutos(),
        total_nota: total.valorNota(),
        chave_nfe: protocolo.chave(),
      };

      async function saveTempProducts(prod) {
        await knex("tempProducts").insert({
          providers_id: prod.providers_id,
          xml_id: prod.xml_id,
          description: "Descrição",
          provider_code: prod.provider_code,
          name: prod.name,
          sku: prod.sku,
          barcode: prod.barcode,
          cfop: prod.cfop,
          ncm: prod.ncm,
          icms_rate: isNaN(prod.icms_rate) ? 0 : prod.icms_rate,
          icms_origin: prod.icms_origin,
          icms_csosn: prod.icms_csosn,
          icms_st_rate: isNaN(prod.icms_st_rate) ? 0 : prod.icms_st_rate,
          icms_marg_val_agregate: isNaN(prod.icms_marg_val_agregate)
            ? 0
            : prod.icms_marg_val_agregate,
          icms_st_mod_bc: isNaN(prod.icms_st_mod_bc) ? 0 : prod.icms_st_mod_bc,
          icms_base_calc: isNaN(prod.icms_base_calc) ? 0 : prod.icms_base_calc, //ADICIONAR NA TABELA
          imcs_st_base_calc: isNaN(prod.imcs_st_base_calc)
            ? 0
            : prod.imcs_st_base_calc,
          fcp_rate: isNaN(prod.fcp_rate) ? 0 : prod.fcp_rate,
          fcp_st_rate: isNaN(prod.fcp_st_rate) ? 0 : prod.fcp_st_rate,
          fcp_ret_rate: isNaN(prod.fcp_ret_rate) ? 0 : prod.fcp_ret_rate,
          fcp_base_calc: isNaN(prod.fcp_base_calc) ? 0 : prod.fcp_base_calc, //ADICIONAR NA TABELA
          fcp_st_base_calc: isNaN(prod.fcp_st_base_calc)
            ? 0
            : prod.fcp_st_base_calc,
          ipi_cst: prod.ipi_cst,
          ipi_rate: isNaN(prod.ipi_rate) ? 0 : prod.ipi_rate,
          ipi_code: prod.ipi_code,
          ipi_base_calc: isNaN(prod.ipi_base_calc) ? 0 : prod.ipi_base_calc,
          pis_cst: prod.pis_cst,
          pis_rate: isNaN(prod.pis_rate) ? 0 : prod.pis_rate,
          pis_base_calc: isNaN(prod.pis_base_calc) ? 0 : prod.pis_base_calc,
          cofins_cst: prod.cofins_cst,
          cofins_rate: isNaN(prod.cofins_rate) ? 0 : prod.cofins_rate,
          cofins_base_calc: isNaN(prod.cofins_base_calc)
            ? 0
            : prod.cofins_base_calc,
          cest: prod.cest,
          cost_value: isNaN(prod.cost_value) ? 0 : prod.cost_value,
          other_cost: isNaN(prod.other_cost) ? 0 : prod.other_cost,
        });
      }

      const ProdutosStore = await knex
        .select("*")
        .from("tempProducts")
        .where({ xml_id: Key.id });

      if (ProdutosStore.length === 0) {
        Produtos.forEach((prod) => {
          saveTempProducts(prod);
        });
      }

      RemoveXml(file);

      return res.status(201).json({ ProdutosStore, Emitente, Total });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao carregar o xml",
        errorMessage,
      });
    }
  },
};
