// Questão 2 - Books to Scrape: título e preço dos livros das páginas 1 e 2

interface Livro {
  titulo: string;
  preco: string;
}

const extrairLivros = (): Cypress.Chainable<Livro[]> =>
  cy.get("article.product_pod").then(($livros) =>
    $livros.toArray().map((el) => ({
      titulo: Cypress.$(el).find("h3 a").attr("title") ?? "",
      preco: Cypress.$(el).find(".price_color").text().trim(),
    }))
  );

describe("Q2 - Books to Scrape: paginação", () => {
  it("extrai os livros das páginas 1 e 2 e imprime o total", () => {
    const todos: Livro[] = [];

    cy.visit("http://books.toscrape.com/");

    extrairLivros().then((livros) => {
      expect(livros).to.have.length(20);
      todos.push(...livros);
    });

    cy.get("li.next a").click();
    cy.url().should("include", "page-2.html");
    cy.get("article.product_pod").should("have.length", 20);

    extrairLivros().then((livros) => {
      todos.push(...livros);
    });

    cy.then(() => {
      todos.forEach((l) => cy.task("log", `${l.titulo} - ${l.preco}`));
      cy.task("log", `\nTotal de livros extraídos: ${todos.length}`);

      expect(todos).to.have.length(40);
      cy.writeFile("output/q2_livros.json", todos);
    });
  });
});
