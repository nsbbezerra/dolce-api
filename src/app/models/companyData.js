const mongoose = require("../../database/database");
const Schema = mongoose.Schema;
const configs = require("../../configs/configs");

const CompanyDataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    serviceEmail: {
      type: String,
      required: true,
    },
    passwordEmail: {
      type: String,
      required: true,
    },
    socialName: {
      type: String,
    },
    stateRegistration: {
      type: String,
    },
    municipalRegistration: {
      type: String,
    },
    phoneComercial: {
      type: String,
    },
    celOne: {
      type: String,
    },
    celTwo: {
      type: String,
    },
    taxRegime: {
      type: String, //Simples Naciona, MEI, Lucro Presumido, Lucro Real, Isento
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      comp: {
        type: String,
      },
      bairro: {
        type: String,
        required: true,
      },
      cep: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    logo: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

CompanyDataSchema.virtual("logo_url").get(function () {
  return `${configs.urlImage}/${this.logo}`;
});

const CompanyData = mongoose.model("CompanyData", CompanyDataSchema);

module.exports = CompanyData;
