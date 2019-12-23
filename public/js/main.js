
var GameState = {
  preload: function () {
    this.load.image('background', './assets/images/background.png');
    this.load.image('arrow', './assets/images/arrow.png');

    this.load.spritesheet('chicken', './assets/images/chicken_spritesheet.png', 131, 200, 3); // aqui eu especifico que corto a imagem para tres frames
    this.load.spritesheet('horse', './assets/images/horse_spritesheet.png', 212, 200, 3);
    this.load.spritesheet('pig', './assets/images/pig_spritesheet.png', 297, 200, 3);
    this.load.spritesheet('sheep', './assets/images/sheep_spritesheet.png', 244, 200, 3);


    this.load.audio('chickenSound', ['./audio/chicken.ogg', './assets/audio/chicken.mp3']);
    this.load.audio('horseSound', ['./audio/horse.ogg', './assets/audio/horse.mp3']);
    this.load.audio('pigSound', ['./audio/pig.ogg', './assets/audio/pig.mp3']);
    this.load.audio('sheepSound', ['./audio/sheep.ogg', './assets/audio/sheep.mp3']);

  },

  create: function () {

    //centralizando a imagem
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.background = this.game.add.sprite(0, 0, 'background');


    //coleções de animais
    var animalData = [
      { key: 'chicken', text: 'GALINHA', audio: 'chickenSound' },
      { key: 'horse', text: 'CAVALO', audio: 'horseSound' },
      { key: 'pig', text: 'PORCO', audio: 'pigSound' },
      { key: 'sheep', text: 'OVELHA', audio: 'sheepSound' }
    ]

    this.animals = this.game.add.group();

    var self = this;

    //interando sobre a coleção de animais
    animalData.forEach(element => {
      animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);  //aqui é onde é passado os animais criados para dentro da lista do Pharse o ultimo parametro é o frame inicial;
      animal.anchor.setTo(0.5);
      animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 5, false);
      animal.customParams = { text: element.text, sound: self.game.add.audio(element.audio) };
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);
    });

    //aqui eu pego o primeiro coloco no centro da tela
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

    //mostrando o nome dos animais
    this.showText(this.currentAnimal);


    //left arrow
    this.lefthArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.lefthArrow.anchor.setTo(0.5);
    this.lefthArrow.scale.x = -1;
    this.lefthArrow.customParams = { direction: -1 };
    this.lefthArrow.inputEnabled = true;
    this.lefthArrow.input.pixelPerfectClick = true;
    this.lefthArrow.events.onInputDown.add(this.switchAnimal, this);

    //rigth arrow
    this.rigthArrow = this.game.add.sprite(580, this.world.centerY, 'arrow');
    this.rigthArrow.anchor.setTo(0.5);
    this.rigthArrow.customParams = { direction: 1 };
    this.rigthArrow.inputEnabled = true;
    this.rigthArrow.input.pixelPerfectClick = true;
    this.rigthArrow.events.onInputDown.add(this.switchAnimal, this);

  },

  update: function () {

  },


  //metodo para trocar o animal
  switchAnimal: function (sprite, events) {

    if (this.isMoving) {
      return false;
    }

    this.isMoving = true;

    //esconder o texto
    this.animalText.visible = false;


    var newAnimal, endX;

    if (sprite.customParams.direction > 0) {

      newAnimal = this.animals.next();
      newAnimal.x = -newAnimal.width / 2;
      endX = 640 + this.currentAnimal.width / 2;

    } else {

      newAnimal = this.animals.previous();
      newAnimal.x = 640 + newAnimal.width / 2;
      endX = -this.currentAnimal.width / 2;
    }

    let newAnimalMoviment = this.game.add.tween(newAnimal);
    newAnimalMoviment.to(
      { x: this.game.world.centerX },1000 );


    newAnimalMoviment.onComplete.add(function(){
      this.isMoving = false;
      this.showText(newAnimal);
    }, this);

    newAnimalMoviment.start();

    let currentAnimalMoviment = this.game.add.tween(this.currentAnimal);

    currentAnimalMoviment.to(
      { x: endX },
      1000
    )

    currentAnimalMoviment.start();
    this.currentAnimal = newAnimal;
  },

  //metodo para animar o animal
  animateAnimal: function (sprite, events) {
    sprite.play('animate');
    sprite.customParams.sound.play();
  },

  showText: function (animal) {
    if (!this.animalText) {
      var style ={
        font: 'bold 30pt Arial',
        fill: '#D0171B',
        align: 'center'
      }
      this.animalText = this.game.add.text(this.game.width / 2, this.game.height * 0.85,'', style);
      this.animalText.anchor.setTo(0.5);
    }

    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }

};

var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');