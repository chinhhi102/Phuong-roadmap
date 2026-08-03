import{b as f,g,x as b,h as v,i as j,E as y,j as e,P as N,L as w,H as k,I as C,c as n,J as L}from"./index-BI30ItsT.js";import{B as c}from"./Button-Brrv6grz.js";import{I as P}from"./Input-3h_iRAyr.js";import{L as S}from"./lock-BPrmNquj.js";/**
 * @license lucide-react v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=f("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);function H(){const r=g(a=>a.progress),{learnerName:s,setLearnerName:m}=b(),x=v(),t=j(n,r,x),p=t.completionPct===100,u=y(r),l=new Date().toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"}),i=L(t.averageScore),h=()=>{const a=`<!doctype html><html><head><meta charset="utf-8"><title>Certificate — ${d(s)}</title>
    <style>
      *{box-sizing:border-box} body{margin:0;font-family:Georgia,'Times New Roman',serif;color:#1c2430}
      .cert{width:1000px;max-width:100%;margin:24px auto;padding:56px;border:14px solid #4f46e5;border-radius:16px;text-align:center;background:linear-gradient(135deg,#fff,#f5f3ff)}
      .k{font-size:13px;letter-spacing:.35em;text-transform:uppercase;color:#6366f1}
      h1{font-size:44px;margin:10px 0} .name{font-size:38px;margin:18px 0;color:#4f46e5;border-bottom:2px solid #ddd;display:inline-block;padding:0 30px 8px}
      .row{display:flex;justify-content:center;gap:48px;margin-top:28px} .row div{font-size:14px;color:#555}
      .row b{display:block;font-size:22px;color:#1c2430}
    </style></head><body>
      <div class="cert">
        <div class="k">BA Academy · Certificate of Completion</div>
        <h1>Business Analyst Program</h1>
        <p>This certifies that</p>
        <div class="name">${d(s)}</div>
        <p>has successfully completed the complete Business Analyst learning path,<br/>demonstrating competency across ${n.length} modules and ${t.totalLessons} lessons.</p>
        <div class="row">
          <div><b>${l}</b>Date</div>
          <div><b>${t.averageScore}%</b>Overall score</div>
          <div><b>${i}</b>Competency level</div>
        </div>
      </div>
      <script>window.onload=function(){window.print()}<\/script>
    </body></html>`,o=window.open("","_blank");o&&(o.document.write(a),o.document.close())};return p?e.jsxs("div",{className:"animate-fade-in",children:[e.jsxs("div",{className:"mb-5 flex flex-wrap items-center justify-between gap-3",children:[e.jsx("h1",{className:"text-2xl font-bold tracking-tight",children:"🎉 Your Certificate"}),e.jsxs(c,{onClick:h,children:[e.jsx(A,{className:"h-4 w-4"})," Print / Save as PDF"]})]}),e.jsxs("div",{className:"rounded-2xl border-[6px] border-primary bg-gradient-to-br from-card to-primary/5 p-8 text-center shadow-xl md:p-12",children:[e.jsx("p",{className:"text-xs uppercase tracking-[0.3em] text-primary",children:"BA Academy · Certificate of Completion"}),e.jsx(C,{className:"mx-auto my-4 h-14 w-14 text-primary"}),e.jsx("h2",{className:"text-2xl font-bold md:text-3xl",children:"Business Analyst Program"}),e.jsx("p",{className:"mt-3 text-sm text-muted-foreground",children:"This certifies that"}),e.jsx("div",{className:"mx-auto my-3 max-w-sm",children:e.jsx(P,{value:s,onChange:a=>m(a.target.value),className:"border-x-0 border-b border-t-0 border-border bg-transparent text-center text-2xl font-semibold"})}),e.jsxs("p",{className:"mx-auto max-w-lg text-sm text-muted-foreground",children:["has successfully completed the complete Business Analyst learning path, demonstrating competency across ",n.length," modules and ",t.totalLessons," lessons."]}),e.jsxs("div",{className:"mt-6 flex flex-wrap justify-center gap-8 text-sm",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-lg font-bold",children:l}),e.jsx("p",{className:"text-muted-foreground",children:"Date"})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-lg font-bold",children:[t.averageScore,"%"]}),e.jsx("p",{className:"text-muted-foreground",children:"Overall score"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-lg font-bold",children:i}),e.jsx("p",{className:"text-muted-foreground",children:"Competency"})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-lg font-bold",children:[u,"h"]}),e.jsx("p",{className:"text-muted-foreground",children:"Time invested"})]})]})]})]}):e.jsxs("div",{className:"animate-fade-in mx-auto max-w-lg py-12 text-center",children:[e.jsx("div",{className:"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted",children:e.jsx(S,{className:"h-7 w-7 text-muted-foreground"})}),e.jsx("h1",{className:"text-2xl font-bold",children:"Certificate locked"}),e.jsxs("p",{className:"mt-1 text-sm text-muted-foreground",children:["Complete all ",t.totalLessons," lessons to unlock your certificate. You're ",t.completionPct,"% there!"]}),e.jsxs("div",{className:"mx-auto mt-5 max-w-sm",children:[e.jsx(N,{value:t.completionPct,gradient:"from-primary to-accent",className:"h-3"}),e.jsxs("p",{className:"mt-2 text-sm text-muted-foreground",children:[t.totalLessons-t.completedLessons," lessons to go"]})]}),e.jsx(w,{to:"/roadmap",className:"mt-5 inline-block",children:e.jsxs(c,{children:[e.jsx(k,{className:"h-4 w-4"})," Keep learning"]})})]})}function d(r){return r.replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]||s)}export{H as default};
