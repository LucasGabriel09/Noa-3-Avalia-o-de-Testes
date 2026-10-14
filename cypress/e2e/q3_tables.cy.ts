// Questão 3 - Table 1: clientes com "Due" > $50.00

interface Cliente {
  primeiroNome: string;
  ultimoNome: string;
  site: string;
}

describe("Q3 - Tabela HTML: devedores acima de $50.00", () => {
  it("percorre a Table 1 e lista clientes com dívida > $50", () => {
    cy.visit("https://the-internet.herokuapp.com/tables");

    cy.get("#table1 tbody tr").then(($linhas) => {
      const devedores: Cliente[] = [];

      $linhas.toArray().forEach((tr) => {
        // Colunas: Last Name | First Name | Email | Due | Web Site | Action
        const colunas = Cypress.$(tr)
          .find("td")
          .toArray()
          .map((td) => Cypress.$(td).text().trim());

        const due = parseFloat(colunas[3].replace("$", ""));

        if (due > 50.0) {
          devedores.push({
            primeiroNome: colunas[1],
            ultimoNome: colunas[0],
            site: colunas[4],
          });
        }
      });

      expect(devedores.length).to.be.greaterThan(0);

      cy.task("log", "\n=== Clientes com Due > $50.00 ===");
      devedores.forEach((c) =>
        cy.task(
          "log",
          `Primeiro Nome: ${c.primeiroNome} | Último Nome: ${c.ultimoNome} | Web Site: ${c.site}`
        )
      );

      cy.writeFile("output/q3_devedores.json", devedores);
    });
  });
});
