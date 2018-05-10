import {MessageBox} from 'element-ui'
//yyyy为年 MM为月 dd为日 HH为小时 mm为分钟 ss为秒
export const timeFormat = (time, format) => {
  let t = new Date(time);
  let y = t.getFullYear();
  let M = t.getMonth() + 1;
  if (M < 10) M = '0' + M;
  let d = t.getDate();
  if (d < 10) d = '0' + d;
  let H = t.getHours();
  if (H < 10) H = '0' + H;
  let m = t.getMinutes();
  if (m < 10) m = '0' + m;
  let s = t.getSeconds();
  if (s < 10) s = '0' + s;
  return format.replace(/yyyy/, y).replace(/MM/, M).replace(/dd/, d).replace(/HH/, H).replace(/mm/, m).replace(/ss/, s);
};
export const setCookie=(cname,cvalue,exdays)=>
{
  if(exdays==undefined){
    document.cookie = cname + "=" + cvalue + "; "
    return
  }
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
export const getCookie=(cname)=>
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++)
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
//获取图片数据
export const getBase64Image=(img)=>{
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
  var dataURL = canvas.toDataURL("image/"+ext);

  // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  return dataURL;
};
export const getStyle = (obj,attr)=>
{
  if(obj.currentStyle)
  {
    return obj.currentStyle[attr];
  }
  else
    return getComputedStyle(obj,null)[attr];//放null参数的那个地方放false也可以，只要带一个参数，值您任意，高兴就好。
}
//打印
export const one_print = (content) => {
  let iframe = document.createElement('IFRAME');
  let doc = null;
  iframe.setAttribute('style', 'display:none;');
  document.body.appendChild(iframe);
  doc = iframe.contentWindow.document;
  doc.write(content);
  doc.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  document.body.removeChild(iframe)
}
//获取元素距离顶部的距离
export const getTop = (e) => {
  let y = e.offsetTop;
  while (e = e.offsetParent) {
    y += e.offsetTop;
  }
  return y;
};
export const getExpressName=(message)=>{
  let arr=[];
  let match=message.match(/\{[0-9a-zA-Z]+(\-\g+){0,1}\}/ig);
  match&&match.forEach(value => {
    arr.push(value.split('}')[0].split('{')[1]);
  })
  return arr
};
export const translateExpress=(type,message,imgArr,ip)=>{
  if(type===1){
    if(imgArr.constructor===Array){
      imgArr.forEach((imgObj, index) => {
        var reg=new RegExp('{'+imgObj.name+'}','ig')
        message=message.replace(reg,`<img src="data:image/png;base64,${imgObj.img}" />`)
      });
    }else{
      alert('imgArr不是数组')
    }
  }else if(type===2){
    console.log(imgArr)
    if(imgArr.constructor===Array){
      imgArr.forEach((imgName, index) => {
        var reg=new RegExp('{'+imgName.split('.')[0]+'}','ig')
        message=message.replace(reg,`<img src="http://${ip}/express/${imgName}" />`)
      });
    }else{
      alert('imgArr不是数组')
    }
  }
  return message;
};
export const toBottom=(box)=>{
  box.scrollTop=box.scrollHeight-box.offsetHeight;
};
export const onToTop=(box,callback)=>{
  box.onscroll = ()=>{
    if(box.scrollTop === 0){
      callback();
    }
  }
};
//弹出提示框
export const tipBox = (txt, fn1, fn2) => {
  MessageBox.confirm(txt, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fn1.constructor == Function && fn1();
  }).catch(() => {
    fn2.constructor == Function && fn2();
  });
}
//获取订单状态
export const getOrderStatus = (n) => {
  switch (parseInt(n)) {
    case 2:
      return '待入库';
    case 3:
      return '待入库';
    case 21:
      return '部分入库';
    case 22:
      return '已入库';
    case 23:
      return '已配货';
    case 24:
      return '已提货';
    case 25:
      return '已装车';
    case 26:
      return '已发车';
    default:
      return '';
  }
}
//添加横向滚动条
export const suspendScrollInit = (outerBox, innerBox) => {
  if (innerBox.offsetWidth == outerBox.width) return;
  let scrollBox=outerBox.getElementsByClassName('scroll-box')[0];
  let myScroll;
  if (scrollBox) {
    myScroll=scrollBox.getElementsByTagName('div')[0];
  }else{
    scrollBox = document.createElement('div');
    scrollBox.className = 'scroll-box';
    myScroll = document.createElement('div');
    scrollBox.appendChild(myScroll);
    outerBox.appendChild(scrollBox);
  }
  scrollBox.onscroll=()=>{
    innerBox.style.left = '-' + scrollBox.scrollLeft + 'px';
  }
  //滚动条的宽度=table的宽度
  myScroll.style.width = innerBox.offsetWidth + 'px';
  scrollBox.style.width = outerBox.offsetWidth + 'px';
  //alert(myScroll.scrollLeft)
  scrollBox.scrollLeft = myScroll.scrollLeft;
  let tableScroll= ()=>{
    let nowTop = document.body.offsetHeight - outerBox.getBoundingClientRect().top;
    scrollBox.style.position = (nowTop < outerBox.offsetHeight && nowTop > 40) ? 'fixed' : 'absolute';
  };
  tableScroll();
  return tableScroll;
}
export const suspendScroll=(outerBox,innerBox)=>{
  if(!outerBox||!innerBox) return;
  let scroll=suspendScrollInit(outerBox,innerBox);
  scroll&&window.addEventListener('scroll',scroll);
  //scroll&&(window.onscroll=scroll);
  window.addEventListener('resize',()=>{
    suspendScrollInit(outerBox,innerBox)
  })
}
export const lazyScrollInit=(el)=>{
  el.dataset.flag=1;
}
//滚动到底
export const lazyScroll=(el,callback)=>{
  lazyScrollInit(el);
  // window.onscroll=()=>{
  //   if ((pageYOffset + document.body.offsetHeight-20 ) >= (el.offsetHeight + getTop(el)) && el.getAttribute('data-flag')==1) {
  //     el.dataset.flag=0;
  //     callback()
  //   }
  // };
  window.addEventListener('scroll',()=>{
    if ((pageYOffset + document.body.offsetHeight-20 ) >= (el.offsetHeight + getTop(el)) && el.getAttribute('data-flag')==1) {
      el.dataset.flag=0;
      callback()
    }
  });
};
//深度遍历
export const deepDelete=(obj,keyList)=>{
  for(let key in obj){
    if(obj.constructor==Object&&keyList.includes(key)){
      delete obj[key];
      continue
    }
    obj[key]&&(obj[key].constructor==Array||obj[key].constructor==Object)&&deepDelete(obj[key],keyList)
  }
}

export const insertAfter=(newElement,targetElement)=>{
  let parent = targetElement.parentNode;
  // 如果最后的节点是目标元素，则直接添加
  if(parent.lastChild == targetElement){
    parent.appendChild(newElement)
  }else{
    //如果不是，则插入在目标元素的下一个兄弟节点 的前面
    parent.insertBefore(newElement,targetElement.nextSibling)
  }
}

// export const insertTr=(totalTr,data,clickOperate)=>{
//   data.childContent.forEach((item) =>{
//     //if(!item.isShow){
//     //   if(!totalTr[item.index].firstChild.lastChild.className||totalTr[item.index].firstChild.lastChild.className.indexOf('fold')==-1){
//     //     totalTr[item.index].firstChild.innerHTML=totalTr[item.index].firstChild.innerHTML+'<span class="fold"></span>'
//     //   }
//       // while(totalTr[item.index].nextSibling!=totalTr[item.index+1]){
//       //   totalTr[item.index].nextSibling.remove()
//       // }
//       item.content.forEach((item2,index2) =>{
//         let tr=document.createElement('tr');
//         let div=document.createElement('div');
//         let td=document.createElement('td');
//         let i=1;
//         //tr.innerHTML='';
//         if(totalTr[item.index+1]){
//           totalTr[item.index+1].parentNode.insertBefore(tr,totalTr[item.index+1]);
//         }else{
//           totalTr[item.index].parentNode.appendChild(tr)
//         }
//         //insertAfter(tr,totalTr[item.index])
//         if(data.tableHead.includes('操作')){
//           if(data.pageNow){
//             tr.innerHTML='<td></td>';
//           }else{}
//           //let i=1;
//           td.appendChild(div);
//           tr.appendChild(td);
//           // item.operate.forEach((value,index3) =>{
//           //   let a=document.createElement('a')
//           //   if(i!=1){
//           //     let text=document.createTextNode('|')
//           //     div.appendChild(text);
//           //   }
//           //   a.setAttribute('herf','javascript:;')
//           //   a.setAttribute('class','operate')
//           //   a.innerText=value;
//           //   div.appendChild(a);
//           //   a.onclick=function(){
//           //     clickOperate(index3,item2)
//           //   }
//           //   i++;
//           // })
//           //tr.appendChild(td);
//         }else{
//           if(data.pageNow){
//             tr.innerHTML='<td></td>';
//           }else{}
//         }
//         item.operate.forEach((value,index3) =>{
//           let a=document.createElement('a')
//           if(i!=1){
//             let text=document.createTextNode('|')
//             div.appendChild(text);
//           }
//           a.className='operate';
//           if(item.disabled&&item.disabled.constructor==Array){
//             if(item.disabled[index2]&&item.disabled[index2][index3]){
//               a.className=a.className+' disabled'
//             }
//           }
//           a.innerText=value;
//           div.appendChild(a);
//           a.onclick=function(ev,callback){
//             clickOperate([item.index,index2,index3])
//             ev.stopPropagation();
//           }
//           i++;
//         })
//         Object.keys(item2).forEach((key,index) => {
//           //if(data.checkedIndexArr.includes(index)){
//             let arr = ['isChecked']
//             if (!arr.some(item => item == key)){
//               let td=document.createElement('td')
//               let div=document.createElement('div')
//               div.innerHTML=item2[key];
//               td.appendChild(div)
//               tr.appendChild(td)
//             }
//           //}
//         })
//         //insertAfter(tr,totalTr[item.index])
//         tr.className='tr-insert tr-hidden'
//       })
//       // totalTr[item.index].firstChild.getElementsByTagName('span')[0].onclick=function (e) {
//       //   e.stopPropagation();
//       //   let childTr=totalTr[item.index];
//       //   for(let i=0;i<item.number;i++){
//       //     childTr=childTr.nextSibling;
//       //     if(childTr.className.indexOf('tr-hidden')!=-1){
//       //       this.className=this.className+' '+'fold-active';
//       //       childTr.className=childTr.className.replace(/tr-hidden/,'');
//       //     }else{
//       //       this.className='fold';
//       //       childTr.className=childTr.className+' tr-hidden';
//       //     }
//       //   }
//       // }
//     //}
//   })
// }

export const hidePartlyTd=(vueTr,checkedIndexArr,tableHead,pageNow)=>{
  let add=0;
  if(tableHead.includes('操作')&&pageNow){
    add=2;
  }else if(!tableHead.includes('操作')&&!pageNow){

  }else{
    add=1;
  }
  //console.log(vueTr)
  vueTr.forEach((item, index) => {
    let tr=item;
    while(tr.nextSibling!=vueTr[index+1]){
      tr=tr.nextSibling;
      let tds=tr.getElementsByTagName('td');
      Array.prototype.forEach.call(tds,(td,index2)=>{
        //alert(add)
        if(checkedIndexArr.includes(index2-add)||index2<add){
          td.style.display='table-cell';
        }else{
          td.style.display='none';
        }
      })
    }
  })
}

// export const insertTrEvent=(vueTr,trClickBack,aClickBack)=>{
//   //let tr=this.$refs.table.getElementsByTagName('tr');
//   let tr=vueTr[0].parentNode.getElementsByTagName('tr');
//   vueTr.forEach((value, index) =>{
//     let item=value;
//     for(let i=0;item.nextSibling!=vueTr[index+1];i++){
//       item=item.nextSibling;
//       let item2=item;
//       item2.onclick= () =>{
//         if(item2.className.indexOf('trCheck')==-1){
//           this.trIndex='';
//           for(let j=0;j<tr.length;j++){
//             tr[j].className=tr[j].className.replace(/trCheck/,'')
//           }
//           if(!item2.className)item2.className='';
//           item2.className=item2.className+' trCheck';
//           trClickBack([index,i]);
//           //trClickBack(index);
//         }
//       };
//       Array.prototype.forEach.call(item2.getElementsByTagName('a'),(a,index2)=>{
//         a.onclick=function (e) {
//           aClickBack([index,i,index2]);
//           e.stopPropagation();
//         }
//       })
//     }
//   })
// }

export function insertTr(obj){
  this.childContent=obj.childContent;
  this.data=null;
  this.index=null;
  this.operate=null;
  this.disabled=null;
  this.rowTr=obj.rowTr;
  this.tableHead=obj.tableHead;
  this.pageNow=obj.pageNow;
}
insertTr.prototype={
  insert() {
    this.data=this.childContent.content;
    this.index=this.childContent.index;
    this.operate=this.childContent.operate;
    this.disabled=this.childContent.disabled;
    this.data.forEach((obj,index) =>{
      let tr=document.createElement('tr');
      //判断插入的位置
      if(this.rowTr[this.index+1]){
        this.rowTr[this.index+1].parentNode.insertBefore(tr,this.rowTr[this.index+1]);
      }else{
        this.rowTr[this.index].parentNode.appendChild(tr)
      }

      this.pageNow&&(tr.innerHTML='<td></td>');
      //操作td插入
      if(this.tableHead.includes('操作')){
        let div=document.createElement('div');
        let td=document.createElement('td');
        td.appendChild(div);
        tr.appendChild(td);
        this.operate.forEach((value,operateNum) =>{
          let a=document.createElement('a')
          if(operateNum!=0){
            let text=document.createTextNode('|')
            div.appendChild(text);
          }
          a.className='operate';
          if(this.disabled&&this.disabled.constructor==Array){
            if(this.disabled[index]&&this.disabled[index][operateNum]){
              a.className=a.className+' disabled'
            }
          }
          a.innerText=value;
          div.appendChild(a);
        });
      }
      // if(this.tableHead.includes('操作')){
      //   if(this.pageNow){
      //     tr.innerHTML='<td></td>';
      //   }else{}
      //   td.appendChild(div);
      //   tr.appendChild(td);
      // }else{
      //   if(this.pageNow){
      //     tr.innerHTML='<td></td>';
      //   }else{}
      // }
      //插入其他td
      Object.keys(obj).forEach((key,index) => {
        //if(data.checkedIndexArr.includes(index)){
        let arr = ['isChecked'];
        if (!arr.some(item => item == key)){
          let td=document.createElement('td');
          let div=document.createElement('div');
          div.innerHTML=obj[key];
          td.appendChild(div);
          tr.appendChild(td)
        }
        //}
      });
      tr.className='tr-insert tr-hidden'
    })
  },
  delete(){
    this.childContent.forEach((item)=>{
      this.index=item.index;
      while(this.rowTr[this.index].nextSibling!=this.rowTr[this.index+1]){
        this.rowTr[this.index].parentNode.removeChild(this.rowTr[this.index].nextSibling)
      }
    });
  },
  addTrEvent(event,clickBack){
    if(!this.rowTr[0]) return
    let tr=this.rowTr[0].parentNode.getElementsByTagName('tr');
    this.rowTr.forEach((value, index) =>{
      let item=value;
      for(let i=0;item.nextSibling!=this.rowTr[index+1];i++){
        item=item.nextSibling;
        let item2=item;
        if(event=='trclick'){
          item2.onclick= () =>{
            if(item2.className.indexOf('trCheck')==-1){
              this.trIndex='';
              for(let j=0;j<tr.length;j++){
                tr[j].className=tr[j].className.replace(/trCheck/,'')
              }
              if(!item2.className)item2.className='';
              item2.className=item2.className+' trCheck';
              clickBack([index,i]);
              //trClickBack(index);
            }
          };
        }
        if(event=='aclick'){
          Array.prototype.forEach.call(item2.getElementsByTagName('a'),(a,index2)=>{
            a.onclick=function (e) {
              clickBack([index,i,index2]);
              e.stopPropagation();
            }
          })
        }
      }
    })
  }
};

