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
    },
    {
        name: '2. Patterns with Variables',
        description: 'Become a code artist and use variables to help you draw cool pattern art',
        instructions: "You will become a code artist and use variables to help you draw cool pattern art!\n\n 1. Notice that we have a variable called `size` being *assigned* in the beginning. Change it's value from 100 to something else. What does it do?\n 2. We are using 100 in a bunch of places to change where we draw the ellipses. Can you create a new variable, named `gap`, and use it instead of typing 100 in all over the place?\n 3. Using your new gap variable add 14 more ellipses for a total of 16 ellipses and arrange them in a cool pattern of four by four.\n 4. You are an artists now. Like all artists, you must sign your name. Use `text` to sign your name in the bottom right corner of your masterpiece.\n 4. Ready to out wit your friends? Change your background to white. Draw a black rectangle behind the dots that covers half the screen. Change your fill color for the ellipses `fill(30, 30, 30);`. Do the top circles look lighter than the bottom circles? Your eyes may think so, but the code you wrote shows the circles are the exact same color. Weird.",
        source:
"size = 100;\n" +
"background(DARKRED);\n" +
"fill(WHITE);\n" +
"ellipse(100, 100, size, size);\n" +
"ellipse(100 + 100, 100, size, size);\n",
        category: 'Intro',
        sequence: 2
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
