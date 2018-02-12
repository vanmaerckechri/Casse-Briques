<?php
	if (isset($_POST["name1"]) && !empty($_POST["name1"]))
	{
		$monfichier = fopen('assets/DB/score.db', 'r+');
		for ($i = 0; $i < 5; $i++)
		{
			$ligne = fgets($monfichier);
		}
		for ($i = 0; $i < 10; $i++)
		{
			fputs($monfichier, 'bestScores['.$i.'].name = "'.$_POST['name'.$i].'";');
			fputs($monfichier,  "\n");
			fputs($monfichier, 'bestScores['.$i.'].score = "'.$_POST['score'.$i].'";');
			fputs($monfichier,  "\n");
		}
	}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
	<title>Casse Briques</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
	<canvas id="scene" width="800" height="600"></canvas>
	<h2 id="countdown">3</h2>
	<form action="index.php" method="POST" id="scoresForm">
		<input type="text" id="name0" name="name0">
		<input type="text" id="score0" name="score0">
		<input type="text" id="name1" name="name1">
		<input type="text" id="score1" name="score1">
		<input type="text" id="name2" name="name2">
		<input type="text" id="score2" name="score2">
		<input type="text" id="name3" name="name3">
		<input type="text" id="score3" name="score3">
		<input type="text" id="name4" name="name4">
		<input type="text" id="score4" name="score4">
		<input type="text" id="name5" name="name5">
		<input type="text" id="score5" name="score5">
		<input type="text" id="name6" name="name6">
		<input type="text" id="score6" name="score6">
		<input type="text" id="name7" name="name7">
		<input type="text" id="score7" name="score7">
		<input type="text" id="name8" name="name8">
		<input type="text" id="score8" name="score8">		
		<input type="text" id="name9" name="name9">
		<input type="text" id="score9" name="score9">
		<input type="submit">
	</form>
	<script type="text/javascript" src="assets/DB/score.db"></script>
	<script type= "text/javascript" src="assets/js/temp.js"></script>
</body>
</html>