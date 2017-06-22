import { LiradsPage } from './app.po';

describe('lirads App', () => {
  let page: LiradsPage;

  beforeEach(() => {
    page = new LiradsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
