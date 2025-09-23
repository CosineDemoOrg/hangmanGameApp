/*var app = angular.module("HangmanApp", []);
app.controller("GameController", ['$scope', '$timeout', function($scope, $timeout){
	
var words=["rat", "cat", "bat", "mat"];
$scope.incorrectLettersChosen = [];
$scope.correctLettersChosen = [];

$scope.guesses = 6;
$scope.displayWord = '';
$scope.input = {
	letter : ''
}

var selectRandomWord = function(){
	var index = Math.round(Math.random()*words.length);
	return words[index];
}

var newGame = function(){
	$scope.incorrectLettersChosen = [];
	$scope.correctLettersChosen = [];
	$scope.guesses = 6;
	$scope.displayWord = '';

	selectWord =  selectRandomWord();
	var tempDisplayWord = '';
	for (var i = 0; i < selectWord.length; i++) {
		tempDisplayWord +='*';
	}
	$scope.displayWord = tempDisplayWord;
}

$scope.letterChosen = function(){
	for (var i = 0; i < $scope.correctLettersChosen.length; i++) {
		if ($scope.correctLettersChosen[i].toLowerCase() ==$scope.input.letter.toLowerCase()) {
			$scope.input.letter="";
			return;
		}
	}
	for (var i = 0; i < $scope.incorrectLettersChosen.length; i++) {
		if ($scope.incorrectLettersChosen[i].toLowerCase() ==$scope.input.letter.toLowerCase()) {
			$scope.input.letter="";
			return;
		}
	}

	var correct = false;
	for (var i = 0; i < selectWord.length; i++) {
		if (selectWord[i].toLowerCase()==$scope.input.letter.toLowerCase()) {
			$scope.displayWord = $scope.displayWord.slice(0,i)+$scope.input.letter.toLowerCase()+$scope.displayWord.slice(i+1);
		    correct = true;
		}
	}
	if (correct) {
		$scope.correctLettersChosen.push($scope.input.letter.toLowerCase());
	} else{
		$scope.guesses--;
		$scope.incorrectLettersChosen.push($scope.input.letter.toLowerCase());
	}

	$scope.input.letter = "";
	if ($scope.guesses == 0) {
		alert("you lost!");
		$timeout(function() {
			newGame();
		}, 500);
	}
	if ($scope.displayWord.indexOf("*")==-1) {
		alert("you won");
		$timeout(function() {
			newGame();
		}, 500);
	}

}


newGame();

}]);

*/
var app = angular.module("HangmanApp",[]);
app.controller("GameController",['$scope','$timeout',function($scope,$timeout){
		var words=["Altassian","Remember","Mountain","Pokemon"];
		$scope.incorrectLettersChosen=[];
		$scope.correctLettersChosen=[];
		var selectedWord='';
		$scope.guesses=6;
		$scope.displayWord='';
		$scope.gameOver=false;
		$scope.didWin=false;
		$scope.revealChars=[];
		$scope.input = {
			letter: ''
		};
		var selectRandomWord = function() {
			var index = Math.floor(Math.random()*words.length);
			return words[index];
		}
		var newGame = function() {
			
			$scope.incorrectLettersChosen = [];
			$scope.correctLettersChosen=[];
			$scope.guesses=6;
			$scope.hintsLeft=2;
			$scope.displayWord="";
			$scope.gameOver=false;
			$scope.didWin=false;
			$scope.revealChars=[];
			selectedWord=selectRandomWord();
			var tempDisplayWord='';
			for(var i=0;i<selectedWord.length;i++) {
				tempDisplayWord+='*';
			}
			$scope.displayWord=tempDisplayWord;
			// Random word selection.
		}
		$scope.playAgain = function(){
			newGame();
			$timeout(function(){ $('.dial').trigger('change'); },500);
		}
		$scope.useHint = function() {
			// Reveal a random unrevealed letter at the cost of 1 guess and 1 hint
			if ($scope.gameOver || $scope.guesses <= 0 || $scope.hintsLeft <= 0) return;

			// Collect indices of unrevealed positions
			var unrevealed = [];
			for (var i = 0; i < $scope.displayWord.length; i++) {
				if ($scope.displayWord[i] === '*') unrevealed.push(i);
			}
			if (unrevealed.length === 0) return;

			// Pick a random unrevealed position and determine the target letter
			var idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
			var targetLetter = selectedWord[idx].toUpperCase();

			// Reveal all occurrences of that letter
			for (var j = 0; j < selectedWord.length; j++) {
				if (selectedWord[j].toUpperCase() === targetLetter) {
					$scope.displayWord = $scope.displayWord.slice(0, j) + targetLetter + $scope.displayWord.slice(j + 1);
				}
			}

			// Record the letter in correctLettersChosen if not already present
			var exists = false;
			for (var k = 0; k < $scope.correctLettersChosen.length; k++) {
				if ($scope.correctLettersChosen[k].toUpperCase() === targetLetter) {
					exists = true; break;
				}
			}
			if (!exists) {
				$scope.correctLettersChosen.push(targetLetter);
			}

			// Cost one guess and one hint
			$scope.guesses--;
			$scope.hintsLeft--;

			// Animate correct icon for feedback
			var objhand = $(".correct-icon");
			objhand.animate({height: '-100px', opacity: '0.4'}, "fast");
			objhand.animate({width: '200px', opacity: '0.8'}, "fast");
			objhand.animate({height: '100px', opacity: '0.4'}, "fast");
			objhand.animate({width: '100px', opacity: '0.8'}, "fast");

			// Update knob and check game state
			$timeout(function() {
				$('.dial').trigger('change');
			}, 500);

			if ($scope.guesses == 0 && $scope.displayWord.indexOf("*") != -1) {
				// Lost due to running out of guesses without fully revealing
				$scope.gameOver = true;
				$scope.didWin = false;
				$scope.revealChars = selectedWord.toUpperCase().split('');
				$timeout(function() {
					$('.dial').trigger('change');
					try { window.scrollTo(0, document.body.scrollHeight); } catch(e) {}
				}, 500);
				return;
			}

			if ($scope.displayWord.indexOf("*") == -1) {
				// Completed the word via hint
				$scope.gameOver = true;
				$scope.didWin = true;
				$scope.revealChars = selectedWord.toUpperCase().split('');
				$timeout(function() {
					$('.dial').trigger('change');
				}, 500);
			}
		}
		$scope.letterChosen = function() {
			// Check if $scope.input.letter is a single letter and an alphabet and not an already chosen letter.
			// Check if its correct.
			for(var i=0;i<$scope.correctLettersChosen.length;i++) {
				if($scope.correctLettersChosen[i].toUpperCase()==$scope.input.letter.toUpperCase()) {
					$scope.input.letter="";
					return;
				}
			}
			for(var i=0;i<$scope.incorrectLettersChosen.length;i++) {
				if($scope.incorrectLettersChosen[i].toUpperCase()==$scope.input.letter.toUpperCase()) {
					$scope.input.letter="";
					return;
				}
			}
			var correct=false;
			for(var i=0;i<selectedWord.length;i++) {
				if(selectedWord[i].toLowerCase()==$scope.input.letter.toLowerCase()) {
					$scope.displayWord=$scope.displayWord.slice(0,i)+$scope.input.letter.toUpperCase()+$scope.displayWord.slice(i+1);
					correct=true;

				}
			}
			if(correct) {
				var objhand = $(".correct-icon");
				objhand.animate({height: '-100px', opacity: '0.4'}, "fast");
		        objhand.animate({width: '200px', opacity: '0.8'}, "fast");
		        objhand.animate({height: '100px', opacity: '0.4'}, "fast");
		        objhand.animate({width: '100px', opacity: '0.8'}, "fast");

				$scope.correctLettersChosen.push($scope.input.letter.toUpperCase());
			} else {
				var objhand = $(".incorrect-icon");
				objhand.animate({height: '200px', opacity: '0.4'}, "fast");
		        objhand.animate({width: '-200px', opacity: '0.8'}, "fast");
		        objhand.animate({height: '100px', opacity: '0.4'}, "fast");
		        objhand.animate({width: '100px', opacity: '0.8'}, "fast");

				$scope.guesses--;
				$scope.incorrectLettersChosen.push($scope.input.letter.toUpperCase());
			}
			$timeout(function() {
					$('.dial').trigger('change');
				},500);
					
			$scope.input.letter="";
			if($scope.guesses==0) {
				// You Lose
				$scope.gameOver=true;
				$scope.didWin=false;
				$scope.revealChars = selectedWord.toUpperCase().split('');
				$timeout(function() {
					$('.dial').trigger('change');
					// Scroll a bit to ensure inline answer is visible on small screens
					try { window.scrollTo(0, document.body.scrollHeight); } catch(e) {}
				},500);
			}
			if($scope.displayWord.indexOf("*")==-1) {
				// You Win
				$scope.gameOver=true;
				$scope.didWin=true;
				$scope.revealChars = selectedWord.toUpperCase().split('');
				$timeout(function() {
					$('.dial').trigger('change');
				},500);
			}
		}
        
        // Keyboard shortcuts:
        // '/' focuses the letter input when game is active.
        // 'Escape' clears and blurs the input (acts like closing an inline interaction).
        (function(){
            var handler = function(e){
                if (e.key === '/') {
                    e.preventDefault(); // avoid browser quick find
                    var el = document.getElementById('letterInput');
                    if (el && !$scope.gameOver) {
                        el.focus();
                    }
                } else if (e.key === 'Escape') {
                    var el2 = document.getElementById('letterInput');
                    if (el2) el2.blur();
                    if ($scope.input && $scope.input.letter) {
                        $scope.input.letter = '';
                        // ensure Angular digests this external event
                        $scope.$applyAsync();
                    }
                }
            };
            document.addEventListener('keydown', handler);
            // Clean up when controller is destroyed
            $scope.$on('$destroy', function(){
                document.removeEventListener('keydown', handler);
            });
        })();
   

		newGame();
	}]);