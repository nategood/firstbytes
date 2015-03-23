var server = require('../../services/server')();
var Lesson = require('../../models/lesson.js');
server.connect();

var lessons = [
    {
        name: '1. Smiling Face',
        description: 'Draw a face using only code!',
        instructions: "You will be using the First Bytes Editor to draw a face with shapes.\n\n  1. *Change the numbers above!* For example, make change 10 to 250. Can you you figure out what the numbers do?\n  2. *Change the colors.* You can try `RED`, `GREEN`, `BLUE`, `BROWN`, `ORANGE`, `PURPLE`, `PINK`, `YELLOW`, `BLACK`, and `WHITE`.\n  3. *Add another rectangle.* Copy and paste the rect line and play with the numbers.\n  4. Now that you have multiple rectangles, make one rectangle green and one rectangle yellow. \n  5. *Can you make a face using multiple rectangles?* Try create two eyes and a long mouth using three rectangles. \n  6. Alright, pro. Now get creative. Can you add a nose? Eyebrows? An iris to your eyeball?",
        source:
"background(BLUE);\n" +
"\n" +
"fill(WHITE);\n" +
"\n" +
"rect(10, 50, 100, 200);\n" +
"",
        category: 'Intro',
        sequence: 1,
    }
];

lessons.forEach(function(lesson) {
    Lesson.where({category: lesson.category, sequence: lesson.sequence})
        .findOne(function(err, result) {
            if (err) {
                console.log('Something went wrong: ' + err);
                return;
            }
            if (result)  {
                console.log('It already exists! ' + result._id);
                return;
            }
            console.log('Creating lesson, ' + lesson.name);
            var l = new Lesson(lesson);
            l.save(function(err) {
                if (err) {
                    console.log('Unable to save lesson, ' + lesson.name + ', due to error, ' + err);
                }
            });
        });
});

setTimeout(function() {
    server.disconnect();
}, 2000); // lazy hack
