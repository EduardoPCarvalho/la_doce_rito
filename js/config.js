// ============================================================
// CONFIGURAÇÕES DA LÁ DOCE RITO (edite aqui)
// ============================================================

var SITE = {
  name: "Lá Doce Rito",
  slogan: "Doces que adoçam a vida!",
  complement: "Feito com amor, para adoçar os seus melhores momentos!",
  whatsapp: "5521996966256",          // DDI + DDD + número, só dígitos
  whatsappLabel: "(21) 99696-6256",
  instagram: "ladocerito",            // sem o @
  email: "",                          // opcional: deixe vazio para ocultar
  hours: "",                          // opcional: ex. "Seg a Sáb, 9h às 18h"
  city: "",                           // opcional: ex. "Maricá, RJ"
};

// >>> CATEGORIAS: a ordem aqui é a ordem no cardápio e nos filtros
var CATEGORIES = [
  { id: "potes", name: "Bolos de pote" },
  { id: "tortas", name: "Tortas e bolos" },
  { id: "brownies", name: "Brownies" },
  { id: "extras", name: "Caixas e combos" },
];

// >>> PRODUTOS
// ATENÇÃO: os preços abaixo são EXEMPLOS. Troque pelos valores reais (use ponto: 12.5 = R$ 12,50).
// price: null = "Sob consulta" (o valor é confirmado pelo WhatsApp).
// variants: opções obrigatórias. Texto simples ("Brigadeiro Preto") ou { n: "300 ml", extra: 6 }
//           quando a opção soma um valor ao preço base.
// count: quantos itens o produto vale para o mínimo de entrega (padrão 1; combos podem valer 2).
// img: chave de IMAGES abaixo ou um caminho/link de imagem.
var PRODUCTS = [
  {
    id: "bolo-de-pote", category: "potes", name: "Bolo de Pote",
    desc: "Camadas de bolo fofinho, creme irresistível e muito sabor em cada colherada.",
    price: 12.0, variantLabel: "Escolha o tamanho",
    variants: [{ n: "180 ml", extra: 0 }, { n: "300 ml", extra: 6 }],
    img: "boloDePote",
  },
  {
    id: "brownie", category: "brownies", name: "Brownie",
    desc: "Brownie macio e intenso, recheado com brigadeiro branco ou preto.",
    price: 9.0, variantLabel: "Escolha seu recheio",
    variants: ["Brigadeiro Branco", "Brigadeiro Preto"],
    img: "brownie",
  },
  {
    id: "torta-de-limao", category: "tortas", name: "Torta de Limão",
    desc: "Base crocante, creme suave de limão e aquele toque especial que conquista.",
    price: 14.0, img: "tortaDeLimao",
  },
  {
    id: "bolo-nuvem", category: "tortas", name: "Bolo Nuvem com Morango",
    desc: "Massa leve e fofinha, com creme especial e morangos frescos.",
    price: 16.0, variantLabel: "Escolha o tamanho",
    variants: [{ n: "Fatia", extra: 0 }, { n: "Bolo inteiro", extra: 54 }],
    img: "boloNuvem",
  },
  {
    id: "bolo-chocolate-morango", category: "tortas", name: "Bolo de Chocolate com Morango",
    desc: "Massa de chocolate bem molhadinha, recheio cremoso e morangos frescos.",
    price: 16.0, variantLabel: "Escolha o tamanho",
    variants: [{ n: "Fatia", extra: 0 }, { n: "Bolo inteiro", extra: 54 }],
    img: "boloChocolate",
  },
  {
    id: "brigadeiro-gourmet", category: "extras", name: "Brigadeiros Gourmet (caixa com 6)",
    desc: "Brigadeiros de chocolate cobertos com granulado, em forminhas rosa.",
    price: 24.0, img: "brigadeiros",
  },
  {
    id: "combo-presente", category: "extras", name: "Combo Brownie + Bolo de Pote",
    desc: "Um brownie e um bolo de pote 180 ml para presentear (ou se presentear).",
    price: 20.0, count: 2, img: "brownie",
  },
  {
    id: "caixa-brownies", category: "brownies", name: "Caixa de Brownies (6 unidades)",
    desc: "Seis brownies macios e intensos, com o recheio de brigadeiro que você escolher.",
    price: 48.0, count: 3, variantLabel: "Escolha o recheio",
    variants: ["Brigadeiro Branco", "Brigadeiro Preto", "Metade e metade"],
    img: "brownie",
  },
  {
    id: "torta-inteira", category: "tortas", name: "Torta de Limão inteira",
    desc: "A torta completa, com base crocante, creme suave de limão e chantilly. Ideal para dividir.",
    price: 75.0, count: 4, img: "tortaDeLimao",
  },
  {
    id: "pote-duplo", category: "potes", name: "Kit Bolo de Pote Duplo",
    desc: "Dois bolos de pote de 180 ml para dividir com quem você gosta.",
    price: 22.0, count: 2, img: "boloDePote",
  },
  {
    id: "caixa-presente", category: "extras", name: "Caixa Presente Rito",
    desc: "2 brownies e 6 brigadeiros gourmet em uma caixa, prontos para presentear.",
    price: 45.0, count: 3, img: "brigadeiros",
  },
];

// >>> LOCAIS DE ENTREGA E TAXAS (exemplos: troque pelos reais)
// fee: taxa em R$ (0 = sem taxa, null = a combinar)
// min: quantidade mínima de itens para entregar nesse local (0 = sem mínimo)
// bairro: true pede o campo Bairro   |   address: false = retirada (não pede endereço)
var PLACES = [
  { n: "Itaipuaçu", fee: 3, min: 0 },
  { n: "Maricá", fee: 5, min: 0 },
  { n: "Inoã", fee: 7, min: 0 },
  { n: "Niterói", fee: 0, min: 6, bairro: true },
  { n: "São Gonçalo", fee: 0, min: 6, bairro: true },
];

// >>> TEXTOS DE DESTAQUE (seção "Por que a Lá Doce Rito")
var HIGHLIGHTS = [
  { t: "Feitos com carinho", d: "Cada doce é preparado com dedicação, do primeiro ao último detalhe." },
  { t: "Ingredientes selecionados", d: "Chocolate de verdade, frutas frescas e cremes preparados na hora." },
  { t: "Sabores irresistíveis", d: "Texturas macias, recheios generosos e coberturas que derretem." },
  { t: "Encomendas especiais", d: "Aniversários, presentes e comemorações: fale com a gente pelo WhatsApp." },
];

// >>> IMAGENS (pasta img/). Para trocar uma foto, substitua o arquivo mantendo o nome.
var IMAGES = {
  logo: "img/logo.png",
  logoSm: "img/logo-sm.png",
  boloDePote: "img/bolo-de-pote.jpg",
  brownie: "img/brownie.jpg",
  tortaDeLimao: "img/torta-de-limao.jpg",
  boloNuvem: "img/bolo-nuvem.jpg",
  boloChocolate: "img/bolo-chocolate-morango.jpg",
  brigadeiros: "img/brigadeiros.jpg",
};
