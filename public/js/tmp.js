try{;var y = 0, y2 = 0, w = 30, size = 30;
var x = FB.random(FB.WIDTH), x2 = FB.random(FB.WIDTH);
var box = 0, points = 0, boxwidth = 100;
var reset = FB.HEIGHT - 100 - size;

FB.draw = function() {
    y += 2;

    FB.background(FB.LIGHTBLUE);
    FB.fill(FB.WHITE);

    FB.fill(FB.DARKGREEN);
    FB.rect(0, 400, FB.WIDTH, FB.WIDTH);
    FB.fill(FB.DARKBROWN);
    FB.rect(0, 430, FB.WIDTH, FB.WIDTH);

    // Bear
    FB.fill(FB.DARKBROWN);
    FB.ellipse(x-10, y-10, 20, 20);
    FB.ellipse(x+10, y-10, 20, 20);
    FB.fill(FB.BLACK);
    FB.ellipse(x-10, y-10, 10, 10);
    FB.ellipse(x+10, y-10, 10, 10);
    FB.fill(FB.DARKBROWN);
    FB.ellipse(x, y, w, w);
    FB.fill(FB.BLACK);
    FB.ellipse(x-5, y-5, 5, 5);
    FB.ellipse(x+5, y-5, 5, 5);
    FB.ellipse(x, y+5, 10, 10);

    FB.fill(FB.BLACK);
    FB.rect(box, 370, boxwidth, 30);

    FB.fill(FB.WHITE);
    FB.text("POINTS " + points, 10, 490);

    if (y >= reset && (x > box && x < box + boxwidth)) {
        points += 10;
    }
    if (y >= reset) {
        y = 0;
        x = FB.random(FB.WIDTH);
    }
};

FB.keyPressed = function() {
    if (FB.keyCode === FB.LEFT) {
        box -= 10;
    }
    if (FB.keyCode === FB.RIGHT) {
        box += 10;
    }
};
;}catch(e){console.log("Error!" + e);}