import "cypress-file-upload";

Cypress.Commands.add("uploadFile", (selector, fileUrl, type = "") => {
  return cy.fixture(fileUrl, "base64").then(fileContent => {
    cy.get(selector).upload({
      fileContent,
      fileName: fileUrl,
      mimeType: "application/octet-stream",
      encoding: "base64"
    });
  });
});
