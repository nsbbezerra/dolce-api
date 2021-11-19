const knex = require("../../../database/pg");
const parser = require("fast-xml-parser");
const path = require("path");
const fs = require("fs");
const he = require("he");
const NFe = require("djf-nfe");
const { isArray } = require("util");

async function RemoveXml(url) {
  fs.unlink(url, (err) => {
    if (err) console.log(err);
    else {
      console.log();
    }
  });
}

const products_config = [
  "tempProducts.id",
  "tempProducts.name",
  "tempProducts.description",
  "tempProducts.sku",
  "tempProducts.barcode",
  "tempProducts.cfop",
  "tempProducts.ncm",
  "tempProducts.icms_rate",
  "tempProducts.icms_origin",
  "tempProducts.icms_csosn",
  "tempProducts.icms_st_rate",
  "tempProducts.icms_marg_val_agregate",
  "tempProducts.icms_st_mod_bc",
  "tempProducts.fcp_rate",
  "tempProducts.fcp_st_rate",
  "tempProducts.fcp_ret_rate",
  "tempProducts.ipi_cst",
  "tempProducts.ipi_rate",
  "tempProducts.ipi_code",
  "tempProducts.pis_cst",
  "tempProducts.pis_rate",
  "tempProducts.cofins_cst",
  "tempProducts.cofins_rate",
  "tempProducts.cest",
  "tempProducts.cost_value",
"tempProducts.other_cost",
"tempProducts.icms_base_calc",
"tempProducts.imcs_st_base_calc",
"tempProducts.fcp_base_calc",
"tempProducts.fcp_st_base_calc",
"tempProducts.pis_base_calc",
"tempProducts.cofins_base_calc",
  "providers.id as provider_id",
  "providers.fantasia as provider_fantasia",
  "providers.name as provider_name",
];

module.exports = {
  async Test(req, res) {
    const { filename } = req.file;

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

    const nfeSec = NFe(readeadFile);

    function validadeField(field, type) {
      if (field === undefined || field === null) {
        return type === "text" ? "" : 0;
      } else {
        return type === "text" ? field.toString() : parseFloat(field);
      }
    }

    function capitalizeFirstLetter(string) {
      let splited = string.split(" ");
      let toJoin = splited.map((e) => {
        return e.charAt(0).toUpperCase() + e.slice(1);
      });
      let joined = toJoin.join(" ");
      return joined;
    }

    try {
      const options = {
        attributeNamePrefix: "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: true,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) =>
          he.decode(val, { isAttributeValue: true }), //default is a=>a
        tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"],
      };

      let imported;

      const protocolo = nfeSec.informacoesProtocolo();
      const chave = protocolo.chave();

      let XmlImport;

      const find_nfe = await knex("xmlimporter")
        .select("*")
        .where({ nfe_key: chave })
        .first();

      if (parser.validate(readeadFile) === true) {
        const nfe = parser.parse(readeadFile, options);
        const emitter = nfe.nfeProc.NFe.infNFe.emit;
        const products = nfe.nfeProc.NFe.infNFe.det;

        const empresa = capitalizeFirstLetter(
          validadeField(emitter.xNome, "text").toLowerCase()
        );

        const provider = await knex("providers")
          .select("*")
          .where({ name: empresa })
          .first();

        let Produtos;
        let Emitente;
        let Total;

        if (!find_nfe) {
          imported = false;
          const key = await knex("xmlimporter")
            .insert({ nfe_key: chave })
            .returning("*");
          XmlImport = key[0];

          const ProdutosCompare = await knex
            .select("*")
            .from("tempProducts")
            .where({ xml_id: XmlImport.id });

          if (!provider) {
            const newProvider = await knex("providers")
              .insert({
                name: empresa,
                cnpj: validadeField(emitter.CNPJ, "text"),
                contact: validadeField(emitter.enderEmit.fone, "text"),
                email: "email@email.com",
                street: capitalizeFirstLetter(
                  validadeField(emitter.enderEmit.xLgr, "text").toLowerCase()
                ),
                number: validadeField(emitter.enderEmit.nro, "text"),
                comp: "",
                district: capitalizeFirstLetter(
                  validadeField(emitter.enderEmit.xBairro, "text").toLowerCase()
                ),
                city: capitalizeFirstLetter(
                  validadeField(emitter.enderEmit.xMun, "text").toLowerCase()
                ),
                cep: validadeField(emitter.enderEmit.CEP, "text"),
                state: validadeField(
                  emitter.enderEmit.UF,
                  "text"
                ).toUpperCase(),
                fantasia: capitalizeFirstLetter(
                  validadeField(emitter.xFant, "text").toLowerCase()
                ),
              })
              .returning("*");
            Emitente = newProvider[0];
          } else {
            Emitente = provider;
          }

          async function saveProducts(prods) {
            await knex("tempProducts").insert({
              providers_id: prods.providers_id,
              description: "Descrição",
              xml_id: prods.xml_id,
              provider_code: prods.provider_code,
              name: prods.name,
              sku: prods.sku,
              barcode: prods.barcode,
              cfop: prods.cfop,
              ncm: prods.ncm,
              icms_rate: prods.icms_rate,
              icms_origin: prods.icms_origin,
              icms_csosn: prods.icms_csosn,
              icms_st_rate: prods.icms_st_rate,
              icms_marg_val_agregate: prods.icms_marg_val_agregate,
              icms_st_mod_bc: prods.icms_st_mod_bc,
              icms_base_calc: prods.icms_base_calc, //ADICIONAR NA TABELA
              imcs_st_base_calc: prods.imcs_st_base_calc, //ADICIONAR NA TABELA
              fcp_rate: prods.fcp_rate,
              fcp_st_rate: prods.fcp_st_rate,
              fcp_ret_rate: prods.fcp_ret_rate,
              fcp_base_calc: prods.fcp_base_calc, //ADICIONAR NA TABELA
              fcp_st_base_calc: prods.fcp_st_base_calc, //ADICIONAR NA TABELA
              ipi_cst: prods.ipi_cst,
              ipi_rate: prods.ipi_rate,
              ipi_code: prods.ipi_code,
              ipi_base_calc: prods.ipi_base_calc,
              pis_cst: prods.pis_cst,
              pis_rate: prods.pis_rate,
              pis_base_calc: prods.pis_base_calc, //ADICIONAR NA TABELA
              cofins_cst: prods.cofins_cst,
              cofins_rate: prods.cofins_rate,
              cofins_base_calc: prods.cofins_base_calc, //ADICIONAR NA TABELA
              cest: prods.cest,
              cost_value: prods.cost_value,
              other_cost: prods.other_cost,
            });
          }

          if (isArray(products)) {
            await products.forEach((pro) => {
              const prod = pro.prod;
              const imposto = pro.imposto;
              const icms_to_extract = imposto.ICMS;
              const icmsValues = Object.values(icms_to_extract);
              const icms = icmsValues[0];
              const ipi = imposto.IPI;
              const pis = imposto.PIS;
              const cofins = imposto.COFINS;
              const ipiCstValues = !ipi ? null : Object.values(ipi);
              const ipiCst = ipiCstValues === null ? "" : ipiCstValues[1];
              const pisCstValues = Object.values(pis);
              const pisCst = pisCstValues[0];
              const cofinsCstValues = Object.values(cofins);
              const cofinsCst = cofinsCstValues[0];

              let info = {
                providers_id: Emitente.id,
                xml_id: XmlImport.id,
                provider_code: validadeField(prod.cProd, "text"),
                name: capitalizeFirstLetter(
                  validadeField(prod.xProd, "text").toLowerCase()
                ),
                sku: validadeField(prod.cProd, "text"),
                barcode: validadeField(prod.cEAN, "text"),
                cfop: validadeField(prod.CFOP, "text"),
                ncm: validadeField(prod.NCM, "text"),
                icms_rate: validadeField(icms.pICMS, "number"),
                icms_origin: validadeField(icms.orig, "text"),
                icms_csosn: validadeField(icms.CST, "text"),
                icms_st_rate: validadeField(icms.pICMSST, "number"),
                icms_marg_val_agregate: validadeField(icms.pMVAST, "number"),
                icms_st_mod_bc: validadeField(icms.modBCST, "text"),
                icms_base_calc: validadeField(icms.vBC, "number"), //ADICIONAR NA TABELA
                imcs_st_base_calc: validadeField(icms.vBCST, "number"), //ADICIONAR NA TABELA
                fcp_rate: validadeField(icms.vFCPST, "number"),
                fcp_st_rate: validadeField(icms.pFCPST, "number"),
                fcp_ret_rate: validadeField(icms.pFCPSTRet, "number"),
                fcp_base_calc: validadeField(icms.vBCFCP, "number"), //ADICIONAR NA TABELA
                fcp_st_base_calc: validadeField(icms.vBCFCPST, "number"), //ADICIONAR NA TABELA
                ipi_cst: !ipi ? "" : validadeField(ipiCst.CST, "text"),
                ipi_rate: !ipi ? 0 : validadeField(ipiCst.pIPI, "number"),
                ipi_code: !ipi ? "" : validadeField(ipi.cEnq, "text"),
                ipi_base_calc: !ipi ? 0 : validadeField(ipiCst.vBC, "number"),
                pis_cst: validadeField(pisCst.CST, "text"),
                pis_rate: validadeField(pisCst.pPIS, "number"),
                pis_base_calc: validadeField(pisCst.vBC, "number"), //ADICIONAR NA TABELA
                cofins_cst: validadeField(cofinsCst.CST, "text"),
                cofins_rate: validadeField(cofinsCst.pCOFINS, "number"),
                cofins_base_calc: validadeField(cofinsCst.vBC, "number"), //ADICIONAR NA TABELA
                cest: validadeField(prod.CEST, "text"),
                cost_value: validadeField(prod.vUnTrib, "number"),
                other_cost: validadeField(prod.vOutro, "number"),
              };

              if (ProdutosCompare.length === 0) {
                saveProducts(info);
              }
            });
          } else {
            const prod = products.prod;
            const imposto = products.imposto;
            const icms_to_extract = imposto.ICMS;
            const icmsValues = Object.values(icms_to_extract);
            const icms = icmsValues[0];
            const ipi = imposto.IPI;
            const pis = imposto.PIS;
            const cofins = imposto.COFINS;
            const ipiCstValues = !ipi ? null : Object.values(ipi);
            const ipiCst = ipiCstValues === null ? "" : ipiCstValues[1];
            const pisCstValues = Object.values(pis);
            const pisCst = pisCstValues[0];
            const cofinsCstValues = Object.values(cofins);
            const cofinsCst = cofinsCstValues[0];

            let info = {
              providers_id: Emitente.id,
              xml_id: XmlImport.id,
              provider_code: validadeField(prod.cProd, "text"),
              name: capitalizeFirstLetter(
                validadeField(prod.xProd, "text").toLowerCase()
              ),
              sku: validadeField(prod.cProd, "text"),
              barcode: validadeField(prod.cEAN, "text"),
              cfop: validadeField(prod.CFOP, "text"),
              ncm: validadeField(prod.NCM, "text"),
              icms_rate: validadeField(icms.pICMS, "number"),
              icms_origin: validadeField(icms.orig, "text"),
              icms_csosn: validadeField(icms.CST, "text"),
              icms_st_rate: validadeField(icms.pICMSST, "number"),
              icms_marg_val_agregate: validadeField(icms.pMVAST, "number"),
              icms_st_mod_bc: validadeField(icms.modBCST, "text"),
              icms_base_calc: validadeField(icms.vBC, "number"), //ADICIONAR NA TABELA
              imcs_st_base_calc: validadeField(icms.vBCST, "number"), //ADICIONAR NA TABELA
              fcp_rate: validadeField(icms.vFCPST, "number"),
              fcp_st_rate: validadeField(icms.pFCPST, "number"),
              fcp_ret_rate: validadeField(icms.pFCPSTRet, "number"),
              fcp_base_calc: validadeField(icms.vBCFCP, "number"), //ADICIONAR NA TABELA
              fcp_st_base_calc: validadeField(icms.vBCFCPST, "number"), //ADICIONAR NA TABELA
              ipi_cst: !ipi ? "" : validadeField(ipiCst.CST, "text"),
              ipi_rate: !ipi ? 0 : validadeField(ipiCst.pIPI, "number"),
              ipi_code: !ipi ? "" : validadeField(ipi.cEnq, "text"),
              ipi_base_calc: !ipi ? 0 : validadeField(ipiCst.vBC, "number"),
              pis_cst: validadeField(pisCst.CST, "text"),
              pis_rate: validadeField(pisCst.pPIS, "number"),
              pis_base_calc: validadeField(pisCst.vBC, "number"), //ADICIONAR NA TABELA
              cofins_cst: validadeField(cofinsCst.CST, "text"),
              cofins_rate: validadeField(cofinsCst.pCOFINS, "number"),
              cofins_base_calc: validadeField(cofinsCst.vBC, "number"), //ADICIONAR NA TABELA
              cest: validadeField(prod.CEST, "text"),
              cost_value: validadeField(prod.vUnTrib, "number"),
              other_cost: validadeField(prod.vOutro, "number"),
            };

            saveProducts(info);
          }

          const ProdutosStore = await knex
            .select("*")
            .from("tempProducts")
            .where({ xml_id: XmlImport.id });

          Produtos = ProdutosStore;

          let total = nfeSec.total();
          Total = {
            valor_frete: parseFloat(total.valorFrete()),
            total_produtos: total.valorProdutos(),
            total_nota: total.valorNota(),
            chave_nfe: protocolo.chave(),
          };

          RemoveXml(file);

          return res.status(201).json({ Produtos, Emitente, Total, imported });
        } else {
          imported = true;
          XmlImport = find_nfe;

          Emitente = provider;
          const ProdutosStore = await knex
            .select("*")
            .from("tempProducts")
            .where({ xml_id: XmlImport.id });

          Produtos = ProdutosStore;

          let total = nfeSec.total();
          Total = {
            valor_frete: parseFloat(total.valorFrete()),
            total_produtos: total.valorProdutos(),
            total_nota: total.valorNota(),
            chave_nfe: protocolo.chave(),
          };

          RemoveXml(file);

          return res.status(201).json({ Produtos, Emitente, Total, imported });
        }
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao carregar o xml",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    try {
      const products = await knex
        .select(products_config)
        .from("tempProducts")
        .innerJoin("providers", "providers.id", "tempProducts.providers_id");

      return res.status(200).json(products);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
