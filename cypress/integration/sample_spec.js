describe('RL web tests', function() {
  it('replay 3d07e', function() {
    cy.visit("http://localhost:1234");
    cy.contains("Rocket League Replay Parser");
	cy.uploadFile("input[type=file]", '3d07e.replay');
    cy.get('p.description').contains('On 12/8/2016, comagoosie, TheGoldenGarp, TrUeLiFe98 vs. Grim Reefer, Doomsayer2050, PUT YOUR WEIGHT ON IT in a 5v5 soccar match');
  })
})
