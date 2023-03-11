import kaboom from "kaboom"

// initialize context
kaboom({
  background: [0,0,0],
})

// Load assets
loadSprite("player", "/sprites/player.jpeg")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("up", "/sprites/up.png")
loadSprite("down", "/sprites/down.png")
loadSprite("left", "/sprites/left.png")
loadSprite("right", "/sprites/right.png")
loadSprite("punch", "/sprites/punch.png")


// bullet becomes punching hand


const pad = 24;

scene("start", ({ }) => {
  add([
    text("Rules", {
      width: width() - pad * 2,
    }),
    pos(24, 24),
    { value: 0 },
  ])
  add([
    text("Try to avoid the ghost punching you for as long as you can\nUse arrow keys to move\nThe ghost can disappear...\nClick to start", {
      width: width() - pad * 2,
    }),
    pos(80, 100),
    { value: 0 },
  ])
  onClick(() => {
    go("game", {})
  })
  onTouchStart(() => {
    go("game", {})
  })
})

scene("game", ({ }) => {
  const SPEED = 320;
  const ENEMY_SPEED = 160;
  const BULLET_SPEED = 800;
  var left_on = false;
  var right_on = false;
  var up_on = false;
  var down_on = false;
  var high_score = getData("high_score")
  if (high_score == null){
    high_score = 0
  }
  const player = add([
  	sprite("player"),
  	pos(80, 130),
  	area(),
  	origin("center"),
    scale(0.1)
  ])
  
  const enemy = add([
  	sprite("ghosty"),
  	pos(width() - 80, height() - 80),
  	origin("center"),
  	state("move", [ "idle", "attack", "move", ]),
  ])

  const time = add([
    text("Time: 0 seconds", {
      width: width() - pad * 2,
    }),
    pos(24, 24),
    { value: 0 },
  ])

  const left_button = add([
    sprite("left"),
    opacity(0.5),
    pos(center()['x']-70, center()['y']),
    "left",
    fixed(),
    area(),
  ])

  const up_button = add([
    sprite("up"),
    opacity(0.5),
    pos(center()['x'], center()['y']-70),
    "up",
    fixed(),
    area()
  ])


  const down_button = add([
    sprite("down"),
    opacity(0.5),
    pos(center()['x'], center()['y']+70),
    "down",
    fixed(),
    area()
  ])

  const right_button = add([
    sprite("right"),
    opacity(0.5),
    pos(center()['x']+70, center()['y']),
    "right",
    fixed(),
    area()
  ])

  if (window.matchMedia("(any-hover: none)").matches) {
    left_button.scale = 2;
    left_button.pos['x'] = center()['x']-140;
    left_button.pos['y'] = center()['y']
    up_button.scale = 2;
    up_button.pos['x'] = center()['x'];
    up_button.pos['y'] = center()['y']-140;
    down_button.scale = 2;
    down_button.pos['x'] = center()['x'];
    down_button.pos['y'] = center()['y']+140;
    right_button.scale = 2;
    right_button.pos['x'] = center()['x']+140;
    right_button.pos['y'] = center()['y'];  
  }

    add([
    text("HighScore: " + high_score, {
      width: width() - pad * 2,
    }),
    pos(24, height()-80),
  ])

  loop(0.1, () => {
    if (player.pos['x'] > width() || player.pos['x'] < 0 || player.pos['y'] > height() || player.pos['y'] < 0) {
      player.pos = center()
    }
    time.value += 0.1
    time.value = Math.round(time.value * 10) / 10
    time.text = "Time: " + time.value + " seconds"
  
    if (left_on == true){
      player.move(-SPEED, 0)
    }
    if (right_on == true){
      player.move(SPEED, 0)
    } 
    if (up_on == true){
      player.move(0, -SPEED)
    }
    if (down_on == true){
      player.move(0, SPEED)
    }
  })

  onClick("left", () => {
    player.move(-SPEED, 0)
  })

  onClick("right", () => {
    player.move(SPEED, 0)
  })

  onClick("up", () => {
    player.move(0, -SPEED)
  })

  onClick("down", () => {
    player.move(0, SPEED)
  })
  
  enemy.onStateEnter("idle", async () => {
    enemy.hidden = true;
  	await wait(0.5)
  	enemy.enterState("attack")
  })
  
  enemy.onStateEnter("attack", async () => {
    enemy.hidden = false;
  	if (player.exists()) {
  
  		const dir = player.pos.sub(enemy.pos).unit()
  		add([
  			pos(enemy.pos),
  			move(dir, BULLET_SPEED),
  			sprite("punch"),
        scale(0.2),
  			area(),
  			cleanup(),
  			origin("center"),
  			"bullet",
  		])
  
  	}
  
  	await wait(1)
  	enemy.enterState("move")
  
  })
  
  enemy.onStateEnter("move", async () => {
    enemy.hidden = true;
  	await wait(2)
  	enemy.enterState("idle")  })

    enemy.onStateUpdate("move", () => {
  	if (!player.exists()) return
  	const dir = player.pos.sub(enemy.pos).unit()
  	enemy.move(dir.scale(ENEMY_SPEED))
  })
   enemy.enterState("move")
   player.onCollide("bullet", (bullet) => {
  	destroy(bullet)
  	destroy(player)
  	addKaboom(bullet.pos)
    if (time.value > high_score){
      setData("high_score", time.value)
    }
    go("end", {
      time: time.value
    })
  })
 

  onTouchStart((id, position) => {
    if (left_button.hasPoint(position)) {
      left_on = true;
      left_button.opacity = 1
    } else if (right_button.hasPoint(position)) {
      right_on = true;
      right_button.opacity = 1

    } else if (up_button.hasPoint(position)) {
      up_on = true;
      up_button.opacity = 1
    } else if (down_button.hasPoint(position)) {
      down_on = true;
      down_button.opacity = 1
    }  }) 

  onTouchEnd((id, position) => {
    if (left_button.hasPoint(position)) {
      left_on = false;
      left_button.opacity = 0.5
    } else if (right_button.hasPoint(position)) {
      right_on = false;
      right_button.opacity = 0.5
    } else if (up_button.hasPoint(position)) {
      up_on = false;
      up_button.opacity = 0.5
    } else if (down_button.hasPoint(position)) {
      down_on = false;
      down_button.opacity = 0.5
    }
  })
  onKeyDown("left", () => {
  	player.move(-SPEED, 0)
  })
  
  onKeyDown("right", () => {
  	player.move(SPEED, 0)
  })
  
  onKeyDown("up", () => {
  	player.move(0, -SPEED)
  })
  
  onKeyDown("down", () => {
  	player.move(0, SPEED)
  })
})

scene("end", ({ time }) => {
  add([
    text(`You stayed alive for ${time} seconds!\nYour highscore: ${getData("high_score", 0)}`, {
      width: width() - pad * 2,
    }),
    pos(24, 24),
  ])
  add([
    text("Click to play again!", {
      width: width() - pad * 2,
    }),
    pos(150, height() - 100),
  ])

  onClick(() => {
    go("game", {})
  })

  onTouchStart(() => {
    go("game", {})
  })
  
  onKeyDown("enter", () => {
  	go("game", {})
  })

  onKeyDown("space", () => {
  	go("game", {})
  })
  
})

go("start", {})