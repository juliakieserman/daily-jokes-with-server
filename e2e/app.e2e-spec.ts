import { JokesAppPage } from './app.po';

describe('jokes-app App', function() {
  let page: JokesAppPage;

  beforeEach(() => {
    page = new JokesAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
