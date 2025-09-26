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
	// Fresh implementation
	var words = ["ATLASSIAN","REMEMBER","MOUNTAIN","POKEMON","JAVASCRIPT","ANGULAR","HANGMAN"];
	var selectedWord = "";
	$scope.incorrectLettersChosen = [];
	$scope.correctLettersChosen = [];
	$scope.guesses = 6;
	$scope.hintsLeft = 2;
	$scope.displayWord = "";
	$scope.gameOver = false;
	$scope.didWin = false;
	$scope.revealChars = [];
	$scope.input = { letter: "" };

	// On-screen keyboard rows (QWERTY)
	$scope.keyRows = [
		"QWERTYUIOP".split(""),
		"ASDFGHJKL".split(""),
		"ZXCVBNM".split("")
	];

	function mask(word) {
		return Array(word.length + 1).join("*");
	}

	function selectRandomWord() {
		return words[Math.floor(Math.random() * words.length)];
	}

	function applyKnobUpdate() {
		$timeout(function(){ try { $('.dial').trigger('change'); } catch(e){} }, 0);
	}

	function finalizeGame(win) {
		$scope.gameOver = true;
		$scope.didWin = !!win;
		$scope.revealChars = selectedWord.split('');
		applyKnobUpdate();
	}

	function newGame() {
		$scope.incorrectLettersChosen = [];
		$scope.correctLettersChosen = [];
		$scope.guesses = 6;
		$scope.hintsLeft = 2;
		$scope.gameOver = false;
		$scope.didWin = false;
		$scope.revealChars = [];
		selectedWord = (selectRandomWord() || "HANGMAN").toUpperCase();
		$scope.displayWord = mask(selectedWord);
		$timeout(function(){
			try { document.getElementById('letterInput').focus(); } catch(e){}
		}, 0);
		applyKnobUpdate();
	}

	$scope.playAgain = function(){
		newGame();
	};

	$scope.useHint = function(){
		if ($scope.gameOver || $scope.guesses <= 0 || $scope.hintsLeft <= 0) return;
		// Collect unrevealed indices
		var unrevealed = [];
		for (var i = 0; i < $scope.displayWord.length; i++) {
			if ($scope.displayWord[i] === '*') unrevealed.push(i);
		}
		if (!unrevealed.length) return;

		// Pick random unrevealed index
		var idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
		var target = selectedWord[idx];

		// Reveal all occurrences
		for (var j = 0; j < selectedWord.length; j++) {
			if (selectedWord[j] === target) {
				$scope.displayWord = $scope.displayWord.slice(0, j) + target + $scope.displayWord.slice(j + 1);
			}
		}

		// Track letter if not already added
		var exists = false;
		for (var k = 0; k < $scope.correctLettersChosen.length; k++) {
			if ($scope.correctLettersChosen[k] === target) { exists = true; break; }
		}
		if (!exists) $scope.correctLettersChosen.push(target);

		$scope.guesses--;
		$scope.hintsLeft--;

		// Feedback animation
		var objhand = $(".correct-icon");
		try {
			objhand.stop(true, true);
			objhand.animate({opacity: '0.4'}, "fast")
			       .animate({opacity: '1.0'}, "fast");
		} catch(e){}

		applyKnobUpdate();

		if ($scope.guesses === 0 && $scope.displayWord.indexOf("*") !== -1) {
			finalizeGame(false);
			$timeout(function(){ try { window.scrollTo(0, document.body.scrollHeight); } catch(e){} }, 0);
			return;
		}
		if ($scope.displayWord.indexOf("*") === -1) {
			finalizeGame(true);
		}
	};

	$scope.isValidInput = function(){
		var ch = ($scope.input.letter || '').trim();
		return ch.length === 1 && /^[A-Za-z]$/.test(ch);
	};

	$scope.letterChosen = function(){
		if (!$scope.isValidInput() || $scope.gameOver) {
			$scope.input.letter = "";
			return;
		}
		var ch = $scope.input.letter.toUpperCase();

		// Already chosen?
		for (var i = 0; i < $scope.correctLettersChosen.length; i++) {
			if ($scope.correctLettersChosen[i] === ch) { $scope.input.letter = ""; return; }
		}
		for (var j = 0; j < $scope.incorrectLettersChosen.length; j++) {
			if ($scope.incorrectLettersChosen[j] === ch) { $scope.input.letter = ""; return; }
		}

		// Check correctness
		var correct = false;
		for (var k = 0; k < selectedWord.length; k++) {
			if (selectedWord[k] === ch) {
				$scope.displayWord = $scope.displayWord.slice(0, k) + ch + $scope.displayWord.slice(k + 1);
				correct = true;
			}
		}

		if (correct) {
			try {
				var ok = $(".correct-icon");
				ok.stop(true, true).animate({opacity: '0.4'}, "fast").animate({opacity: '1.0'}, "fast");
			} catch(e){}
			$scope.correctLettersChosen.push(ch);
		} else {
			try {
				var bad = $(".incorrect-icon");
				bad.stop(true, true).animate({opacity: '0.4'}, "fast").animate({opacity: '1.0'}, "fast");
			} catch(e){}
			$scope.guesses--;
			$scope.incorrectLettersChosen.push(ch);
		}

		applyKnobUpdate();
		$scope.input.letter = "";

		if ($scope.guesses === 0) {
			finalizeGame(false);
			$timeout(function(){ try { window.scrollTo(0, document.body.scrollHeight); } catch(e){} }, 0);
		}
		if ($scope.displayWord.indexOf("*") === -1) {
			finalizeGame(true);
		}
	};

	// On-screen keyboard helpers
	$scope.isLetterUsed = function(ch){
		if (!ch) return false;
		ch = ch.toUpperCase();
		for (var i = 0; i < $scope.correctLettersChosen.length; i++) {
			if ($scope.correctLettersChosen[i] === ch) return true;
		}
		for (var j = 0; j < $scope.incorrectLettersChosen.length; j++) {
			if ($scope.incorrectLettersChosen[j] === ch) return true;
		}
		return false;
	};
	$scope.onKeyClick = function(ch){
		if ($scope.gameOver || $scope.guesses <= 0) return;
		if ($scope.isLetterUsed(ch)) return;
		$scope.input.letter = (ch || '').toUpperCase();
		if ($scope.isValidInput()) {
			$scope.letterChosen();
		}
	};

	// Keyboard shortcuts: '/', 'Escape', 'Enter'
	(function(){
		var handler = function(e){
			if (e.key === '/') {
				e.preventDefault();
				var el = document.getElementById('letterInput');
				if (el && !$scope.gameOver) el.focus();
			} else if (e.key === 'Escape') {
				var el2 = document.getElementById('letterInput');
				if (el2) el2.blur();
				if ($scope.input && $scope.input.letter) {
					$scope.input.letter = '';
					$scope.$applyAsync();
				}
			} else if (e.key === 'Enter') {
				if (!$scope.gameOver && $scope.isValidInput()) {
					$scope.$applyAsync(function(){ $scope.letterChosen(); });
				}
			}
		};
		document.addEventListener('keydown', handler);
		$scope.$on('$destroy', function(){
			document.removeEventListener('keydown', handler);
		});
	})();

	newGame();
}]);