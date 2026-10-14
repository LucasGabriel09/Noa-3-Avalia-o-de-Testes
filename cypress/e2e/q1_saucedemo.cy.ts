// Questão 1 - SauceDemo: produtos com preço < $20.00

interface Produto {
  nome: string;
  preco: number;
}

const parsePreco = (texto: string): number =>
  parseFloat(texto.replace("$", "").trim());

describe("Q1 - SauceDemo: ofertas abaixo de $20.00", () => {
  it("faz login, mapeia os produtos e lista os que custam menos de $20", () => {
    cy.visit("https://www.saucedemo.com/");

    cy.get("#user-name").type("standard_user");
    cy.get("#password").type("secret_sauce");
    cy.get("#login-button").click();

    cy.url().should("include", "/inventory.html");

    cy.get(".inventory_item").then(($itens) => {
      const produtos: Produto[] = $itens.toArray().map((el) => ({
        nome: Cypress.$(el).find(".inventory_item_name").text().trim(),
        preco: parsePreco(Cypress.$(el).find(".inventory_item_price").text()),
      }));

      expect(produtos.length).to.be.greaterThan(0);

      const ofertas = produtos.filter((p) => p.preco < 20.0);

      cy.task("log", `\n=== Produtos mapeados: ${produtos.length} ===`);
      cy.task("log", "=== Ofertas (< $20.00) ===");
      ofertas.forEach((p) =>
        cy.task("log", `${p.nome} - $${p.preco.toFixed(2)}`)
      );

      cy.writeFile("output/q1_ofertas.json", ofertas);
    });
  });
});
