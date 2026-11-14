# Lá Doce Rito – site de cardápio e pedidos

Abra `index.html` no navegador (ou publique a pasta em qualquer hospedagem estática).

Tudo que muda com frequência fica em `js/config.js`:
- `SITE`: nome, slogan, WhatsApp, Instagram, e-mail, horário, cidade.
- `CATEGORIES` e `PRODUCTS`: produtos, descrições, fotos, recheios (`variants`) e preços.
  **Os preços estão como `null` (“Sob consulta”)**: troque por números, ex. `price: 12.5`.
- `PLACES`: retirada/entrega e taxas (`fee: null` = a combinar).
- `HIGHLIGHTS` e `IMAGES`: textos de destaque e caminhos das fotos (pasta `img/`).

Para adicionar um doce: copie um bloco de `PRODUCTS`, mude o `id` e coloque a foto em `img/`.
