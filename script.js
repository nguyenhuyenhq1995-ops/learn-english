const words=[
 {word:"Apple",pron:"/ˈæp.əl/",meaning:"Quả táo",emoji:"🍎"},
 {word:"Book",pron:"/bʊk/",meaning:"Quyển sách",emoji:"📖"},
 {word:"学校",pron:"",meaning:"",emoji:""},
 {word:"Beautiful",pron:"/ˈbjuː.tɪ.fəl/",meaning:"Xinh đẹp",emoji:"🌷"},
 {word:"Family",pron:"/ˈfæm.əl.i/",meaning:"Gia đình",emoji:"👨‍👩‍👧"},
 {word:"Friend",pron:"/frend/",meaning:"Bạn bè",emoji:"🤝"},
 {word:"Water",pron:"/ˈwɔː.tər/",meaning:"Nước",emoji:"💧"},
 {word:"Study",pron:"/ˈstʌd.i/",meaning:"Học tập",emoji:"✏️"}
].filter(w=>w.word!=="学校");
const questions=[
 ["Apple có nghĩa là gì?",["Quả cam","Quả táo","Quả chuối","Quả nho"],1],
 ["Book có nghĩa là gì?",["Cây bút","Cái bàn","Quyển sách","Cặp sách"],2],
 ["Beautiful có nghĩa là gì?",["Xinh đẹp","Thông minh","Nhanh","Vui vẻ"],0],
 ["Family có nghĩa là gì?",["Bạn bè","Gia đình","Trường học","Công việc"],1],
 ["Friend có nghĩa là gì?",["Giáo viên","Học sinh","Bạn bè","Hàng xóm"],2],
 ["Water có nghĩa là gì?",["Sữa","Nước","Cà phê","Trà"],1],
 ["Study có nghĩa là gì?",["Chơi","Ngủ","Học tập","Làm việc"],2],
 ["Từ nào có nghĩa là 'quyển sách'?",["Book","Apple","Water","Friend"],0],
 ["Từ nào có nghĩa là 'gia đình'?",["Beautiful","Study","Family","Water"],2],
 ["Từ nào có nghĩa là 'bạn bè'?",["Friend","Book","Apple","Study"],0]
];
let learned=JSON.parse(localStorage.getItem("leLearned")||"[]"), count=Number(localStorage.getItem("leQuizCount")||0), best=Number(localStorage.getItem("leBest")||0), current=0, selected=null, score=0, finished=false;
const $=id=>document.getElementById(id);
function renderWords(){ $("wordGrid").innerHTML=words.map((w,i)=>`<article class="word-card"><div class="emoji">${w.emoji}</div><h3>${w.word}</h3><div class="pronunciation">${w.pron}</div><p>${w.meaning}</p><button class="${learned.includes(i)?"done":""}" onclick="toggleLearned(${i})">${learned.includes(i)?"✓ Đã học":"+ Đánh dấu đã học"}</button></article>`).join(""); updateStats();}
function toggleLearned(i){learned=learned.includes(i)?learned.filter(x=>x!==i):[...learned,i];localStorage.setItem("leLearned",JSON.stringify(learned));renderWords();}
function updateStats(){$("learnedCount").textContent=learned.length;$("quizCount").textContent=count;$("bestScore").textContent=best+"%";}
function renderQuestion(){selected=null;$("feedback").textContent="";$("nextBtn").disabled=true;$("nextBtn").textContent=current===questions.length-1?"Xem kết quả":"Câu tiếp theo";$("questionNumber").textContent=`Câu ${current+1}/${questions.length}`;$("quizStatus").textContent="Chọn đáp án đúng";$("quizProgress").style.width=((current+1)/questions.length*100)+"%";$("questionText").textContent=questions[current][0];$("answerList").innerHTML=questions[current][1].map((a,i)=>`<button class="answer" data-index="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join("");document.querySelectorAll(".answer").forEach(b=>b.addEventListener("click",()=>chooseAnswer(Number(b.dataset.index))));}
function chooseAnswer(i){if(selected!==null)return;selected=i;const correct=questions[current][2];document.querySelectorAll(".answer").forEach((b,j)=>{if(j===correct)b.classList.add("correct");else if(j===i)b.classList.add("wrong");});if(i===correct){score++;$("feedback").textContent="Chính xác! Bạn đã chọn đúng."; }else{$("feedback").textContent="Chưa chính xác. Đáp án đúng: "+questions[current][1][correct]+".";} $("nextBtn").disabled=false;}
$("nextBtn").addEventListener("click",()=>{if(selected===null)return;if(current<questions.length-1){current++;renderQuestion();}else{const pct=Math.round(score/questions.length*100);count++;best=Math.max(best,pct);localStorage.setItem("leQuizCount",count);localStorage.setItem("leBest",best);updateStats();$("questionNumber").textContent="Hoàn thành";$("quizStatus").textContent="Kết quả của bạn";$("questionText").textContent=`Bạn trả lời đúng ${score}/${questions.length} câu (${pct}%).`; $("answerList").innerHTML=`<p class="result-message">${pct>=80?"Rất tốt! Hãy tiếp tục phát huy.":pct>=50?"Khá tốt! Hãy ôn tập thêm từ vựng.":"Hãy ôn lại từ vựng và thử lại nhé."}</p>`;$("feedback").textContent="";$("nextBtn").textContent="Làm lại";$("nextBtn").disabled=false;$("nextBtn").onclick=()=>{current=0;score=0;$("nextBtn").onclick=null;renderQuestion();};}});
renderWords();renderQuestion();