/*
CSI Text Processing Project - Comp Sci I
Leah Teichholtz
12.17.2017
** program can't handle texts over 150k words
EC: Word cloud, more accurate word count, flescher index
Some code from Schiffman demos/ Mr. Rose demos, RiTa library
*/

//http://shiffman.net/a2z/text-analysis/
//https://creative-coding.decontextualize.com/intro-to-ritajs/
//https://docs.google.com/document/d/11wzumQweB2vQx8YgPQTrKXl1pKvIh3Dm6WnMMIKzoPo/edit

var allWordCount = 0;
var allUnique = 0;
var allCharacters = 0;
var allSentences = 0;
var fileCount = 0;
var longWords = [];
var allLongest;
var wordcheck = 0;
//variables for aggregating totals

function setup() {
  createDiv("<h3> Please select a .txt file </h3>")
  createFileInput(gotFile, 'txt'); //file input
  createDiv(" <br>");


  createCanvas(800,400); //setup for the word cloud
  background(245,209,255);
  textAlign(CENTER, CENTER);
  textSize(24);
  noStroke();
  fill(255);
}


function gotFile(file) {
  clear(); //resets the word cloud with each text
  console.log("Loading...");
  var total;

  fileCount++; //tracks how many files are inputted
  var output = "<h1>" + file.name + "</h1>";
   output += "<table><caption> Individual Text Totals </caption><tr><th>Word Count</th><th>Unique Words</th>" + //main individual output table
    "<th>Avg Word Length</th><th>Longest Word</th>" +
    "<th>VRR</th><th>Sentence Count</th><th>Char/Sentence</th>" +
    "<th>Words/Sentence</th><th> Flescher </th> </tr>"

  var table = "<table><caption> Most Frequent Words </caption><tr><th>#</th><th>Word</th><th>Frequency</th><th>NonStop</th><th>Frequency</th></tr>";
//frequent words table
  var txt = file.data; //local variables inside gotFile

  var sentences = [];
  var wordCount = 0;
  var check = 0;
  var longest;
  var newSentences = [];
  var charCount = 0;
  var sentencesChar = 0;

  var unique = {};
  var uniqueCount = 0;

//i keep each change in a separate varibale to be precise as possible when troubleshooting
  var firstTxt = txt.replace(/!|\?/g, '.'); //txt with n ! or ? - replaced with a .
  var secondTxt = firstTxt.replace(/--|–|-|—|_/g, ' '); //txt with no --
  var thirdTxt = secondTxt.replace(/;|"|”|“|,|'|’|‘/g, ""); //replaces punctuation with nothing
  thirdTxt = thirdTxt.replace(/é|É|ę|è|ë|ê/g, "e"); //RiTa doesn't recognize accents
  thirdTxt = thirdTxt.replace(/á|ä|æ|â|à/g, "a"); //so i replace accented characters to speed up code
  thirdTxt = thirdTxt.replace(/í|ï/g, "i"); //otherwise you get an alert everytime in console
  thirdTxt = thirdTxt.replace(/ó|ö|ô/g, "o");
  thirdTxt = thirdTxt.replace(/ú|ü/g, "u");
  thirdTxt = thirdTxt.replace(/ç/g, "c");
  thirdTxt = thirdTxt.replace(/ý/g, "y");

  var newTxt = thirdTxt.replace(/\s\s+/g, ' '); //gets rid of all double spaces that sometimes result

  var sentences = newTxt.split(".");  //modified txt is split into sentences

  for (var i = 0; i < sentences.length; i++) {
    newSentences.push(sentences[i].slice(1, sentences[i].length));
  }

  var newestTxt = newSentences.join(" ");
  var words = newestTxt.split(" ");// split by whitespace

  for (var i = 0; i < words.length; i++) { // for each token
    var word = words[i].toLowerCase();
    // It's a new word!
    if (unique[word] == undefined) { //checks if word is already in Object
      unique[word] = 1;
      // We've seen this word before!
    } else {
      unique[word]++;
    }
  }

  var uniqueArray = [];
  var uniqueCheck = 0;
  var long;

//  console.log(unique);

  for (var k in unique) {
    uniqueCount++;
    allUnique++;
    uniqueArray.push([k, unique[k]]);
  }

uniqueArray = uniqueArray.sort(function (a,b){return b[1]-a[1]}); //sorts by second item in new array - # of occurances
//  console.log(uniqueArray);


 for (j = 0; j < words.length; j++) {
  wordCount++;
  allWordCount++;
  for (i = 0; i < words[j].length; i++) {
   charCount++;
   allCharacters++;
 }
}

  for(var f=0; f < words.length; f++){ //longest word
    if(words[f].length > check){
      check = words[f].length;
      longest = words[f];
    }
  }

longWords.push(longest); //pushes each text's longest word into a new array so the program doesn't have to go through all words again

var uncommon = [];
var myUnique = [];

for(var i = 0; i < uniqueArray.length-1; i++) {
  if(uniqueArray[i][0] !== "")
    myUnique.push([uniqueArray[i][0],uniqueArray[i][1]]);//removes items that have "" (lack of space?)
}

var args = {
  ignoreStopWords: true, //without stop words
  ignoreCase: true, //ignores upper/lower case
}

var uniqueObj = RiTa.concordance(newestTxt, args); //utilizing concordance from RiTa library
//console.log(uniqueObj);

for(var m in uniqueObj) {
  uncommon.push([m, uniqueObj[m]]);//pushing into an array of arrays so the "object" becomes sortable
}


uncommon = uncommon.sort(function (a,b){return b[1]-a[1]}); //sorts by second item in new array - # of occurances

var theTotal = totalValues(uniqueObj);

for (var i = 0; i < 30; i++) { //making the Word Cloud with 30 most uncommon words
  fill(random(255));
  stroke(4);
  textSize((uncommon[i][1]/theTotal) * 10000);
  text(uncommon[i][0], random(75, width-75), random(30, height-30));
}

  for (var m = 0 ; m < 20; m++) { //outputting top 20 words including stop words
      table+=("<tr><td>"+(m+1)+ "</td><td>"+myUnique[m][0]+"</td><td>"+ wordPercent(myUnique[m][1])+"%</td><td>"+uncommon[m][0]+"</td> <td>" + wordPercent(uncommon[m][1])+"%</td></tr>");//outputs frequent common words
  }

  var rs = new RiString(newTxt); //calculating syllables using RiTa library
  var features = rs.features(); // this is for the Flescher index challenge
  var syllables = features.syllables;
  var syllablesCount = syllables.split(/\//).length;

// flescher index = 206.835 – 1.015 * (words / sentences) - 84.6 * (syllables / words)
  var flescher = 206.835 - 1.015 * (wordCount/sentences.length) - 84.6 * (syllablesCount/wordCount);

  var richness = (uniqueCount / wordCount) * 100;

  output += ("<td>"+wordCount+"</td><td>"+uniqueCount+"</td><td> "+nf(charCount / wordCount,1,2)+"</td><td> "+longest+"</td><td> "+nf(richness,1,2)+"%</td><td>"+sentences.length+"</td><td>"+nf(charCount/sentences.length,1,2)+"</td><td>"+nf(wordCount/sentences.length,1,2)+"</td><td>"+nf(flescher,1,2)+"</td></tr>");

  allSentences += sentences.length;

  for(i = 0; i < longWords.length; i++) {
    if(longWords[i].length > wordcheck){ //longest word
      wordcheck = longWords[i].length;
      allLongest = longWords[i];
    }
  }

//# is ID, used with index.html
  select("#words").html((allWordCount/fileCount));
  select("#unique").html((allUnique/fileCount));
  select("#length").html(nf(allCharacters / allWordCount,1,2));
  select("#longest").html(allLongest);
  select("#vrr").html(nf((allUnique/allWordCount * 100),1,2)+"%");
  select("#sentence1").html((allSentences/fileCount));
  select("#charsent").html(nf(allCharacters / allSentences,1,2));
  select("#wordsent").html(nf(allWordCount/allSentences,1,2));
//aggregating averages at top of screen

  createDiv(output); //putting tables on the page
  createDiv(table+"<br>");

  function wordPercent(occurances) { //returns percent of total text
    return nf((occurances/wordCount)*100,1,2);
  }

  function totalValues(obj) { //this is adopted from the RiTa source that was in the homework.
    var total = 0; //it adds all ocurrances to the total
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        total += obj[k];
      }
    }
    return total;
  }

}
