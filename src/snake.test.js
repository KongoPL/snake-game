import { SnakeGame } from './snake.js';

const game = new SnakeGame( 5, 5, 3, 100000 );

beforeEach( () => game.init() );
afterEach( () => game.endGame() );


test( 'Point generates', () =>
{
	expect( game.pointPosition[0] ).toBeDefined();
	expect( game.pointPosition[1] ).toBeDefined();
} );


test( 'Snake generates', () =>
{
	expect( game.snake.length ).toBeGreaterThan( 0 );
} );


test( 'Snake moves', () =>
{
	const headPosition = [...game.snake[0]];

	game.tick();

	if ( game.movementDirection[0] == 0 )
		expect( headPosition[1] ).not.toBe( game.snake[0][1] );
	else
		expect( headPosition[0] ).not.toBe( game.snake[0][0] );
} );


test( 'Snake turns', () =>
{
	const headPosition = [...game.snake[0]];

	game.setSnakeDirection( -1, 0 );
	game.tick();

	expect( headPosition[0] ).not.toBe( game.snake[0][0] );
	expect( headPosition[1] ).toBe( game.snake[0][1] );
} );


test( 'Snake eats point', () =>
{
	game.pointPosition = [...game.snake[0]];
	game.pointPosition[1]--;

	const currentSnakeLength = game.snake.length;

	game.setSnakeDirection( 0, -1 );
	game.tick();

	expect( game.snake.length ).toBeGreaterThan( currentSnakeLength );
} );


test( 'Point respawns after eating', () =>
{
	game.pointPosition = [...game.snake[0]];
	game.pointPosition[1]--;

	const currentPointPosition = [...game.pointPosition];

	game.setSnakeDirection( 0, -1 );
	game.tick();

	expect( game.pointPosition ).not.toMatchObject( currentPointPosition );
} );


test( 'Snake crashes into world bounds', () =>
{
	game.setSnakeDirection( 0, -1 );

	game.snake[0] = [1, 0];
	game.tick();

	expect( game.gameOver ).toBeTruthy();
	expect( game.snakeWins ).toBeFalsy();
} );


test( 'Snake crashes into himself', () =>
{
	game.snake = [
		[0, 1],
		[0, 0],
		[1, 0],
		[1, 1],
		[1, 2]
	];
	/*
	 ##
	 ## <-- Snake
	  #
	*/
	game.setSnakeDirection( 1, 0 );

	game.tick();

	expect( game.gameOver ).toBeTruthy();
	expect( game.snakeWins ).toBeFalsy();
} );


test( 'Snake wins', () =>
{
	game.snake = [];

	// Snake generation pattern:
	// 1234
	// 8765
	// 9012

	for ( let i = 0; i < (game.mapWidth * game.mapHeight) - 1; i++ )
	{
		let x = i % game.mapWidth,
			y = Math.floor( i / game.mapWidth );

		if ( y % 2 == 1 )
			x = game.mapWidth - 1 - i;

		game.snake.unshift( [x, y] );
	}

	game.pointPosition = [
		game.mapWidth - 1,
		game.mapHeight - 1
	];
	game.setSnakeDirection( 1, 0 );
	game.tick();

	expect( game.gameOver ).toBeTruthy();
	expect( game.snakeWins ).toBeTruthy();
} );