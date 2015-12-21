'use strict';

var pusherCanvas = angular.module('pusherCanvas', []);

pusherGame.service('Movement', [
    function() {
        return{
            move: function(game, selectedMove, player, animalSelected, selectedAnimalPosition) {

                var validMove = function(allowedMove, selectedMove) {
                    for (var i = 0, len = allowedMove.length; i < len; i++) {
                        if((selectedMove.x+','+selectedMove.y) === allowedMove[i]){
                            return true;
                            break;
                        }
                    }
                    return false;
                };

                switch (player) {
                    case 'Goat':
                        if (game.GoatData.sleeping > 0) {
                            
                            if(validMove(game.PlaceGoat, selectedMove)){
                                //add new goat here
                                console.log("Add new Goat here and change animation")
                                return true;
                            }
                            console.log("Invalid move do nothing");
                            return false;
                        } else {
                            
                        }

                        break;
                    case 'Tiger':
                        
                        if(animalSelected){
                            //animal is selected check if the move is valid 
                            if(validMove(game[selectedAnimalPosition.x+','+selectedAnimalPosition.y], selectedMove)){
                                return true;
                            }
                            
                        }
                        return false;
                        break;
                }
            },
            checkSelect: function(game, clickData, player) {
                var select = false;
                if ((game.GoatData.sleeping > 0) && player === 'Goat')
                    return false;

                for (var i = 0, len = game.position[player].length; i < len; i++) {
                    if ((clickData.x + ',' + clickData.y) === game.position[player][i]) {
                        select = true;
                        break;
                    }
                }
                return select;

            },
            validate: function(event, canvas, xCoordinates, yCoordinates) {
                var xCo = null;
                var yCo = null;
                var valid = false;
                var x = event.pageX - canvas.offsetLeft;
                var y = event.pageY - canvas.offsetTop;
                //for x
                var lowX = x - 40;
                var highX = x + 40;
                //for y
                var lowY = y - 40;
                var highY = y + 40;

                for (var i = 0; i < xCoordinates.length; i++) {
                    if (valid) {
                        break;
                    }
                    for (var j = 0; j < yCoordinates.length; j++) {
                        if ((xCoordinates[i] > lowX && xCoordinates[i] < highX) &&
                                (yCoordinates[j] > lowY && yCoordinates[j] < highY)) {
                            xCo = i;
                            yCo = j;
                            valid = true;
                            break;
                        }
                    }
                }
                return {"valid": valid, "x": xCo, "y": yCo};
            }
        };
    }
]);

pusherGame.service('CanvasServices', ['Movement',
    function(Movement) {
        var canvas;
        var context;
        var xCoordinates;
        var yCoordinates;
        var animalSelected = false;
        var selectedAnimal;
        var actionComplete = false;

        var service = {
            clickCanvas: function(event, scope) {
                if(actionComplete)
                    return false;
                // check if the clicks are on the valid position of canvas
                //and highlight animal if required
                var clickData = Movement.validate(event, canvas, xCoordinates, yCoordinates);

                if (!clickData.valid) {
                    //animalSelected = false;
                    return false;
                }
                if (!scope.game.nextMove[scope.player])
                    return false;

//                var action = false;
                var needToSelect = Movement.checkSelect(scope.game, clickData, scope.player);

                //check if need to select animal here if yes select the animal 
                if (needToSelect && !animalSelected) {
                    alert("select animal");
                    selectedAnimal = {"x": clickData.x, "y": clickData.y};
                    animalSelected = true;
                    return false;
                }

                var selectedMove = {"x": clickData.x, "y": clickData.y};

                if(Movement.move(scope.game, selectedMove, scope.player, animalSelected, selectedAnimal)){
                    console.log("move successfull call factory"); 
                    scope.move = selectedMove;
                    actionComplete = true;
                }
                animalSelected = false;
                return actionComplete;
            },
            drawCanvas: function(scope) {
                var element = angular.element(document.getElementById('game-canvas'));
                canvas = element[0];

                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                context = canvas.getContext('2d');
                var startX = 0 + 20;
                var startY = 0 + 20;
                var width = canvas.offsetWidth - 40;
                var halfWidth = width / 2;
                var height = canvas.offsetHeight - 40;
                var halfHeight = height / 2;

                xCoordinates = [
                    startX,
                    halfWidth / 2 + startX,
                    halfWidth + startX,
                    halfWidth + halfWidth / 2 + startX,
                    width + startX
                ];

                yCoordinates = [
                    startY,
                    halfHeight / 2 + startY,
                    halfHeight + startY,
                    halfHeight + halfHeight / 2 + startY,
                    height + startY
                ];

                var board = new Image();
                board.src = 'img/game-board.png';

                board.onload = function() {
                    context.drawImage(board, 0, 0, board.width, board.height, // source rectangle
                            startX, startY, canvas.width - startX - startX, canvas.height - startX - startY);

                    var helper = {
                        'insertAnimal': function(animals, imgSrc, context, x, y) {
                            var animalPos = (animals);
                            var animal = new Image();
                            animal.src = imgSrc;
                            animal.onload = function() {
                                angular.forEach(animalPos, function(value, key) {
                                    var tempPosition = value.split(',');
                                    var tempX = tempPosition[0];
                                    var tempY = tempPosition[1];
                                    context.drawImage(animal, x[tempX] - animal.width / 2, y[tempY] - animal.height / 2);
                                });
                            };
                        }
                    };

                    console.log(scope.game)

                    //insert tiger
                    helper.insertAnimal(scope.game.position.Tiger, 'img/Tiger-icon.png', context, xCoordinates, yCoordinates);
                    //insert goat
//                    console.log(scope.game)
                    helper.insertAnimal(scope.game.position.Goat, 'img/Goat-icon.png', context, xCoordinates, yCoordinates);

                };
                return canvas;
            }
        };
        return service;
    }]);

