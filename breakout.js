$(document).ready(function(){

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	
	var pad_w = canvas.width*0.65;
	var new_pad_w = pad_w/2;
	//var new_pad_w = pad_w/2;
	var pad_h = 10;

	var pad_x = (canvas.width/2 - pad_w/2);
	var pad_y = (canvas.height - 15);

	var secretlevel = [[4,4,4,4,4,4,4,4,4,4,4,4,4,4],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50],
					   [50,50,50,50,50,50,50,50,50,50,50,50,50,50]];

	var level1 = [[4,4,4,4,4,4,4,4,4,4,4,4,4,4],
				  [4,4,4,4,4,4,4,4,4,4,4,4,4,4],
				  [3,3,3,3,3,3,3,3,3,3,3,3,3,3],
				  [3,3,3,3,3,3,3,3,3,3,3,3,3,3],
				  [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
				  [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
				  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				  [1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

	var level2 = [[4,4,4,4,4,4,4,4,4,4,4,4,4,4],
				 [0,4,4,4,4,4,4,4,4,4,4,4,4,0],
				 [0,0,3,3,3,3,3,3,3,3,3,3,0,0],
				 [0,0,0,3,3,3,3,3,3,3,3,0,0,0],
				 [0,0,0,0,2,2,2,2,2,2,0,0,0,0],
				 [0,0,0,0,0,2,2,2,2,0,0,0,0,0],
				 [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
				 [0,0,0,0,0,0,1,1,0,0,0,0,0,0]];

	var level3 = [[4,4,4,4,4,4,4,4,4,4,4,4,4,4],
				 [4,0,4,0,4,0,4,0,4,0,4,0,4,0],
				 [0,3,0,3,0,3,0,3,0,3,0,3,0,3],
				 [3,0,3,0,3,0,3,0,3,0,3,0,3,0],
				 [0,2,0,2,0,2,0,2,0,2,0,2,0,2],
				 [2,0,2,0,2,0,2,0,2,0,2,0,2,0],
				 [0,1,0,1,0,1,0,1,0,1,0,1,0,1],
				 [1,0,1,0,1,0,1,0,1,0,1,0,1,0]];

	var num_bricks_row = 14;
	var brick_height = 30; 
	var brick_width = canvas.width/num_bricks_row;
	var random = Math.floor(Math.random()*4+1); //Used to generate a random level to play.

	

	function draw_bricks(level){
		for(var i = 0; i < level.length; i++){
			for(var j = 0; j < level[i].length; j++){
				draw_brick_helper(j,i, level[i][j]);
			}
		}
	}

	function brick_color(){
		var colors = ['red', 'blue', 'green', 'yellow', 'orange', 'pink']
		var picked_color = Math.floor(Math.random()*6);
		return colors[picked_color];
	}

	function draw_brick_helper(x,y,on_off){
		switch(on_off){
			case 4:
				context.fillStyle = "red"; 
				break;

			case 3:
				context.fillStyle = "orange";
				break;

			case 2:
				context.fillStyle = "green";
				break;

			case 1:
				context.fillStyle = "yellow";
				break;

			case 50:
				context.fillStyle = brick_color(); //Secret rainbow mode!
				break;

			default:
				context.clearRect(x*brick_width, y*brick_height, brick_width, brick_height);
				break;
		}

		if(on_off == 1 || on_off == 2 || on_off == 3 || on_off == 4 || on_off == 50){
			context.fillRect(x*brick_width, y*brick_height, brick_width, brick_height);
			context.strokeRect(x*brick_width+1, y*brick_height+1, brick_width-1, brick_height-1)
		}

	}

	function draw_paddle(){
		context.fillRect(pad_x, pad_y, pad_w, pad_h);
	}

	var ball_x = canvas.width/2;
	var ball_y = canvas.height/2;

	var ball_movement_x = 2;
	var ball_movement_y = 5;

	var paddle_movement_x = 0;
	var keypress = 'NONE';

	function draw_ball(){
		context.beginPath();
		context.arc(ball_x,ball_y,10,0,Math.PI*2,true);
		context.stroke();
		context.fill();
					
	}				
	
	function animate_ball(level){
		if(win_condition(level) == true){
			game_end();
		}
		/*Both of these make sure to keep the ball in the borders.*/
		if((ball_x + ball_movement_x + 10 > canvas.width || ball_x + ball_movement_x - 10 < 0)||
			brick_collision_x(level)) {

			if(Math.abs(ball_movement_x) > 10){
				ball_movement_x = -0.95*ball_movement_x;
			}
			else{
				ball_movement_x = -1.05*ball_movement_x;
			}
		}
		if((ball_y + ball_movement_y - 10 < 0) || brick_collision_y(level)){
			ball_movement_y = -1.1*ball_movement_y;
		}

		/*Bounce off the paddle*/
		if(ball_y + ball_movement_y + 10 >= pad_y){

			if(ball_x + ball_movement_x + 10 <= pad_x + pad_w &&
				ball_x + ball_movement_x +10 >= pad_x){

				if(Math.abs(ball_movement_y) > 20){
				ball_movement_y = -0.9*ball_movement_y;
				}
				else{
				ball_movement_y = -1.15*ball_movement_y;
				}

			}
	}
	
		/*This is the games ending clause*/
		if(ball_y + ball_movement_y + 10 > canvas.height){
			game_end();

		}

		ball_x += ball_movement_x;
		ball_y += ball_movement_y;

	}


	function game_start(){

		game_loop = setInterval(animate, 20);
		// Start Tracking Keystokes
		$(document).keydown(function(evt) {
		    if (evt.keyCode == 37) {
		        keypress = 'LEFT';
		    }
		    else if (evt.keyCode == 39){
		        keypress = 'RIGHT';
		    }
		});         

		$(document).keyup(function(evt) {
		    if (evt.keyCode == 37) {
		        keypress = 'NONE';
		    }
		    else if (evt.keyCode == 39) {
		        keypress = 'NONE';
		    }
		});
	}

	function win_condition(level){
		for(var i = 0; i < level.length; i++){
			for(var j = 0; j < level[i].length; j++){
				if(level[i][j] == 1 || level[i][j] == 2 || level[i][j] == 3 || level[i][j] == 4 || level[i][j] == 50){
					return false;
				} 
			}
		}
		//alert("You have won!")
		return true;
	}

	function animate_paddle(){
		var move_unit = 15;
		if (keypress == 'LEFT'){
			paddle_movement_x = -1*move_unit;
		}
		else if (keypress == 'RIGHT'){
			paddle_movement_x = move_unit;
		}
		else{
			paddle_movement_x = 0;
		}

		if (pad_x + paddle_movement_x + pad_w > canvas.width ||
			pad_x + paddle_movement_x < 0){
			paddle_movement_x = 0;
		}

		pad_x = pad_x + paddle_movement_x; 
	}

		function game_end(){

			clearInterval(game_loop);
			context.fillStyle="black";
			context.font = "35px Georgia";

			context.clearRect(0,0, canvas.width, canvas.height);

			
			if(win_condition(level) == true){
				context.fillText('Winner Winner!', canvas.width/4, canvas.height/2);
				alert("Nice job beating the game, your score is "+score+" Press f5 to restart");

			}
			else{
				context.fillText('Uh oh you LOST!', canvas.width/4, canvas.height/2);
			}

	}

	function randomizer(){

		if(random == 1){
			//draw_bricks(level1);
			return level1;
		}
		else if(random == 2){
			//draw_bricks(level2);
			return level2;
		}
		else if (random == 3){
			//draw_bricks(level3);
			return level3;
		}
		else{
			return secretlevel;
		}
	}

	function brick_collision_x(level){
		var bumped = false;

		for(var i = 0; i < level.length; i++){
			for(var j = 0; j < level[i].length; j++){
				if(level[i][j] == 1 || level[i][j] == 2 || level[i][j] == 3 || level[i][j] == 4 || level[i][j] == 50){
					var brick_x = j * brick_width;
					var brick_y = i * brick_height;
					if(((ball_x + ball_movement_x + 10 >= brick_x) && (ball_x + 10 <= brick_x)) ||
					 ((ball_x - ball_movement_x - 10 <= brick_x + brick_width) && (ball_x - 10 >= brick_x + brick_width))){

						if((ball_y + ball_movement_y - 10 <= brick_y + brick_height) &&
							(ball_y + ball_movement_y + 10 >= brick_y)){

							score += 100 * level[i][j];
							if(level[i][j] == 4){
								pad_w = new_pad_w;
							}
							level[i][j] = 0;
							bumped = true;
						}
					}
				}
			}
		}
		
		return bumped;
	}

	function brick_collision_y(level){
		var bumped = false;

		for(var i = 0; i < level.length; i++){
			for(var j = 0; j < level[i].length; j++){
				if(level[i][j] == 1 || level[i][j] == 2 || level[i][j] == 3 || level[i][j] == 4 || level[i][j] == 50){
					var brick_x = j * brick_width;
					var brick_y = i * brick_height;

					if(((ball_y + ball_movement_y - 10 <= brick_y + brick_height) &&
						(ball_y - 10 >= brick_y + brick_height) ||
						((ball_y + ball_movement_y + 10 >= brick_y) && ball_y + 10 <= brick_y))){

						if(ball_x + ball_movement_x + 10 >= brick_x && ball_x + ball_movement_x - 10 <= brick_x + brick_width){

							score += 100 * level[i][j];
							if(level[i][j] == 4){
								pad_w = new_pad_w;
							}
							level[i][j] = 0;
							bumped = true;

						}
					}
				}
			}
		}
		return bumped;
	}


	function animate(){
		context.clearRect(0,0,canvas.width,canvas.height);		
		draw_bricks(level);
		//randomizer();

		draw_score();

		animate_ball(level);
		animate_paddle();

		draw_paddle();
		draw_ball();

	}

	var score = 0;
	function draw_score(){
		context.fillStyle="black";
		context.font = "30px Georgia";

		//context.clearRect(0,canvas.height-30, canvas.width, 30);
		context.fillText('Score:'+ score, canvas.width/3, canvas.height/2);

		if(level == secretlevel){
			context.fillText('SUPER SECRET LEVEL', canvas.width/5, canvas.height/2+40);
		}
	}


	// Call the methods to make sure they work*/
	game_start();
	var level = randomizer();
	//var level = level2;
	draw_bricks(level);
	draw_paddle();
	draw_ball();
	draw_score();
			
});