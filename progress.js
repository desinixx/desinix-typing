async function renderDashboard(){
  const email=requireLogin();
  document.getElementById("dash-user").textContent="Welcome, "+email;
  const res=await fetch(GAS_URL+"?action=getProgress&email="+encodeURIComponent(email));
  const data=await res.json();
  const div=document.getElementById("dash-progress");
  div.className="msg";
  if(Object.keys(data).length===0){ div.textContent="Progress onnum illa."; }
  else{ 
    div.innerHTML="";
    for(let [k,v] of Object.entries(data)){ 
      div.innerHTML+=`<p>${k}: ${v}</p>`; 
    }
  }

  // Chart section
  const labels = Object.keys(data);
  const values = Object.values(data);
  if(labels.length > 0){
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Typing Progress (Characters)',
          data: values,
          backgroundColor: '#1565c0'
        }]
      },
      options: {
        responsive:true,
        plugins:{legend:{display:false}},
        scales:{y:{beginAtZero:true}}
      }
    });
  }
}
