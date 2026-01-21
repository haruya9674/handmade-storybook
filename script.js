async function loadStory(key){
  const res = await fetch("stories.json");
  const data = await res.json();
  const s = data[key];

  // タイトルと本文
  document.getElementById("title").innerText = s.title;
  document.getElementById("story").innerText = s.story;

  // クイズ生成
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";
  s.quiz.forEach((q,i)=>{
    quizDiv.innerHTML += `<p>${i+1}. ${q.q}</p>`;
    q.choices.forEach((c,j)=>{
      quizDiv.innerHTML += `<label><input type="radio" name="q${i}" value="${j}">${c}</label><br>`;
    });
    quizDiv.innerHTML += `<div id="r${i}"></div>`;
  });
}

function speak(){
  stopVoice();
  const u = new SpeechSynthesisUtterance(document.getElementById("story").innerText);
  u.lang = "en-US";
  u.rate = 0.45;
  u.pitch = 1.2;
  speechSynthesis.speak(u);
}
function stopVoice(){ speechSynthesis.cancel(); }

function mark(id, ok, answer){
  document.getElementById(id).innerHTML =
    ok ? `<span class="correct">✔ Correct</span>`
       : `<span class="wrong">✖ Wrong – ${answer}</span>`;
}

function check(){
  let score=0;
  const resDiv=document.getElementById("result");
  const res=document.querySelectorAll("#quiz input[type=radio]:checked");

  res.forEach((r,i)=>{
    const correct = r.value===""+stories[currentKey].quiz[i].answer;
    if(correct) score++;
    mark("r"+i, correct, "Correct choice");
  });

  resDiv.innerHTML=`<p class="score">Score: ${score} / ${stories[currentKey].quiz.length}</p>`;
}
