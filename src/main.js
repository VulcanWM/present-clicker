import kaboom from "kaboom"


kaboom({
  background: [100, 149, 237]
})

const pad = 24;

loadSprite("present", "sprites/present.png")
loadSound("score", "/sounds/score.mp3")

scene("end", ({score}) => {
  destroyAll("present")
  add([
    text(`You got ${score} presents.`, {
      width: width() - pad * 2,
    }),
    pos(24, 24),
  ])
  add([
    text("Press space or click to play again!", {
      width: width() - pad * 2,
    }),
    pos(24, 200),
  ])
  onKeyPress("space", () => {
    go("game", {})
  })
  onClick(() => {
  	go("game", {})
  })
})

scene("game", ({}) => {
  var randomx = Math.floor(Math.random() * (width() - 50)) + 1;
  var randomy = Math.floor(Math.random() * (height() - 50)) + 1;
  
  var present = add([
  	sprite("present"),
    "present",
  	pos(randomx, randomy),
  	area(),
    scale(0.5),
  ])
  
  const score = add([
    text("Score: 1", {
      width: width() - pad * 2,
    }),
    pos(24, 24),
    { value: 1 },
  ])
  
  const timer = add([
    text("Time: 60 seconds", {
      width: width() - pad * 2,
    }),
    pos(48, 80),
    { value: 60 },
  ])

  add([
    text("Press space to go to rules!", {
      width: width() - pad * 2,
    }),
    pos(24,150)
  ])

  onKeyPress("space", () => {
    go("rules", {})
  })
  
  loop(1, () => {
    if (timer.value == 1){
      go("end", {
				score: score.value,
			})
    } else {
      destroyAll("present")
      timer.value -= 1
      timer.text = "Time: " + timer.value + " seconds"
      randomx = Math.floor(Math.random() * (width() - 50)) + 1;
      randomy = Math.floor(Math.random() * (height() - 50)) + 1;
      present = add([
    	  sprite("present"),
        "present",
      	pos(randomx, randomy),
      	area(),
        scale(0.5),
      ])
    }
  })
  
  
  onClick(() => {
  	addKaboom(mousePos())
    play("score")
  })
  
  onClick("present", () => {
    destroyAll("present")
    score.value += 1
    score.text = "Score:" + score.value
    randomx = Math.floor(Math.random() * (width() - 50)) + 1;
    randomy = Math.floor(Math.random() * (height() - 50)) + 1;
    present = add([
  	  sprite("present"),
      "present",
    	pos(randomx, randomy),
    	area(),
      scale(0.5),
    ])
  })
  onTouchStart((id, position) => {
    if (present.hasPoint(position)){
      destroyAll("present")
      score.value += 1
      score.text = "Score:" + score.value
      randomx = Math.floor(Math.random() * (width() - 50)) + 1;
      randomy = Math.floor(Math.random() * (height() - 50)) + 1;
      present = add([
    	  sprite("present"),
        "present",
      	pos(randomx, randomy),
      	area(),
        scale(0.5),
      ])
    } else {
      addKaboom(mousePos())
      play("score")
    }
  })
})

scene("rules", ({}) => {
  add([
    text("It is your birthday today.\nTry to catch as many presents as you can!", {
      width: width() - pad * 2,
    }),
    pos(24, 24),
  ])
  onClick(() => {
    go("game", {})
  })
  onTouchStart((id, position) => {
    go("game", {})
  })
  
})

scene("start", () => {
	go("rules", {})
})

go("start", {})