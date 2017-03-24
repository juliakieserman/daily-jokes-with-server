
/* TESTER TESTER */
var APP = {
  scheduleJob: function() {
    rule = '* * * * * ';

    var job = schedule.scheduleJob(rule, function() {
      console.log('ping!');
    });
  },
  init: function() {
    APP.scheduleJob();
  }
};

(function() {
  APP.init();
})();