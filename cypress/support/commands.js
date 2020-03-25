import "cypress-file-upload";

Cypress.Commands.add("uploadFile", (selector, fileUrl, type = "") => {
  return cy.get(selector).attachFile({
        filePath: fileUrl,
        encoding: "binary",
        mimeType: "application/octet-stream",
    });
});
