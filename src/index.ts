/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

import { Game } from './handlers/game';


$(document).ready(async () => {  
  const app = Game.instance();

  app.setup(document.getElementById("game"),3);
  app.run();

})