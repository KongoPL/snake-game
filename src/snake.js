export class SnakeGame
{
	constructor( mapWidth, mapHeight, defaultSnakeLength = 3, tickSpeed = 250 )
	{
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.defaultSnakeLength = defaultSnakeLength;
		this.tickSpeed = tickSpeed;

		this.gameOver = false;
		this.snakeWins = false;

		this.movementDirection = [0, -1];
		this.movementToBeSet = null;

		this.snake = []; // [int x, int y][]
		this.pointPosition = []; // [int x, int y]
		this._tickInterval = null;
	}


	init()
	{
		this._spawnSnake();
		this._spawnPoint();

		this._tickInterval = setInterval( () =>
		{
			this.tick();
		}, this.tickSpeed );

		this.gameOver = false;
		this.snakeWins = false;
	}


	endGame( snakeWins = false )
	{
		clearInterval( this._tickInterval );

		this.gameOver = true;
		this.snakeWins = snakeWins;
	}


	restart()
	{
		this.endGame();
		this.init();
	}


	_spawnSnake()
	{
		let startX = Math.floor( this.mapWidth / 2 ),
			startY = Math.floor( this.mapHeight / 2 )

		this.snake = [
			[startX, startY]
		];

		for ( let i = 1; i < this.defaultSnakeLength; i++ )
			this.snake.push( [startX, ++startY] );
	}


	_spawnPoint()
	{
		do
		{
			this.pointPosition = [
				this._rand( 0, this.mapWidth - 1 ),
				this._rand( 0, this.mapHeight - 1 ),
			];
		}
		while ( this.canCollectPoint() );
	}


	_rand( min, max )
	{
		return Math.round( Math.random() * ( max - min ) + min );
	}


	canCollectPoint()
	{
		return !!this.snake.find( ( v ) => v[0] == this.pointPosition[0] && v[1] == this.pointPosition[1] );
	}


	setSnakeDirection( x, y )
	{
		this.movementToBeSet = [x, y];
	}


	tick()
	{
		if ( this.gameOver )
			return;

		if ( this.movementToBeSet )
		{
			if ( this.movementDirection[0] != -this.movementToBeSet[0]
				|| this.movementDirection[1] != -this.movementToBeSet[1] )
				this.movementDirection = this.movementToBeSet;

			this.movementToBeSet = null;
		}

		this.snake.unshift( [
			this.snake[0][0] + this.movementDirection[0],
			this.snake[0][1] + this.movementDirection[1],
		] );

		const canCollectPoint = this.canCollectPoint();

		if ( !canCollectPoint )
			this.snake.pop();

		if ( this._isSnakeOutOfBounds()
			|| this._snakeAteHimself() )
			this.endGame( false );
		else if ( this._snakeWon() )
			this.endGame( true );
		else if ( canCollectPoint )
			this._spawnPoint();
	}


	_isSnakeOutOfBounds()
	{
		const head = this.snake[0];

		return ( head[0] <= -1 || this.mapWidth <= head[0] )
			|| ( head[1] <= -1 || this.mapHeight <= head[1] );
	}


	_snakeAteHimself()
	{
		return !!this.snake.filter( ( v, i ) => !!this.snake.find( ( v2, i2 ) => i2 > i && v[0] == v2[0] && v[1] == v2[1] ) ).length;
	}


	_snakeWon()
	{
		return this.snake.length == this.mapWidth * this.mapHeight;
	}
}


export class SnakeGameRenderer
{
	constructor( game, canvas )
	{
		this.game = game;
		this.canvas = canvas;
		this.ctx = canvas.getContext( '2d' );
		this.gameOver = false;

		this.color = {
			bg: "#000000",
			snake: "#00ff00",
			point: "#d00000",
		};
	}


	init()
	{
		setInterval( () => this.render(), this.game.tickSpeed );
	}


	render()
	{
		if ( this.gameOver != this.game.gameOver )
		{
			this.gameOver = this.game.gameOver;

			if ( this.gameOver )
			{
				if ( this.game.snakeWins )
					alert( "0.0 You won!" );
				else if ( confirm( "You lose! Try again?" ) )
					this.game.restart();
			}
		}

		// Background:
		this._drawRect( 0, 0, this.canvas.width, this.canvas.height, this.color.bg );

		// Snake:
		const pointWidth = this.canvas.width / this.game.mapWidth,
			pointHeight = this.canvas.height / this.game.mapHeight;

		for ( let point of this.game.snake )
			this._drawRect(
				pointWidth * point[0],
				pointHeight * point[1],
				pointWidth,
				pointHeight,
				this.color.snake
			);

		// Point:
		this._drawRect( pointWidth * this.game.pointPosition[0], pointHeight * this.game.pointPosition[1], pointWidth, pointHeight, this.color.point );
	}


	_drawRect( x, y, width, height, bgColor )
	{
		this.ctx.fillStyle = bgColor;
		this.ctx.fillRect( x, y, width, height );
	}
}


export class KeyboardInput
{
	constructor( game )
	{
		this._onKeyPress = this._onKeyPress.bind( this );

		this.game = game;

		document.body.addEventListener( 'keydown', this._onKeyPress );
	}


	destroy()
	{
		document.body.removeEventListener( 'keydown', this._onKeyPress );
	}


	_onKeyPress( event )
	{
		const keyCode = event.keyCode;

		if ( keyCode == 38 )
			this.game.setSnakeDirection( 0, -1 );
		else if ( keyCode == 40 )
			this.game.setSnakeDirection( 0, 1 );
		else if ( keyCode == 37 )
			this.game.setSnakeDirection( -1, 0 );
		else if ( keyCode == 39 )
			this.game.setSnakeDirection( 1, 0 );
	}
}