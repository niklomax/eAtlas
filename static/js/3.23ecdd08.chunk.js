(this.webpackJsonpeatlas=this.webpackJsonpeatlas||[]).push([[3],{2068:function(e,t,a){"use strict";a.r(t);var n=a(56),r=a(57),l=a(107),c=a(67),i=a(68),s=a(1),o=a.n(s),d=a(61),u=a(2017),h=a(23),m=a(690),b=a(86),f=a.n(b),g=a(622),p=a(701),k=a(636),v=a(106),E=a(39);function j(e){var t=Object(s.useState)(e.data),a=Object(E.a)(t,2),n=a[0],r=a[1];Object(s.useEffect)((function(){r(e.data)}),[e.data]);var l=n[0].geometry&&n[0].geometry.coordinates.join(" - ");return o.a.createElement("div",{style:{color:"white"}},"First row is: "," "," ",Object(v.g)(n[0]),o.a.createElement("p",{style:{wordBreak:"break-all"}},l.length>50?l.substring(0,50)+" ... "+l.length+" characters long.":l))}var y=a(691),O=a(969);a.d(t,"default",(function(){return S}));var w=f.a.PRD_URL,S=function(e){Object(c.a)(a,e);var t=Object(i.a)(a);function a(e){var r;return Object(n.a)(this,a),(r=t.call(this,e)).state={checked:!1,loading:!0},r._fetchAndUpdateState=r._fetchAndUpdateState.bind(Object(l.a)(r)),r._generateBarChart=r._generateBarChart.bind(Object(l.a)(r)),r}return Object(r.a)(a,[{key:"_generateBarChart",value:function(e,t){var a=this.state.data;if(e&&t){var n=t;t.length>10&&(n=n.slice(0,10));var r=Object(v.e)(a,e,n);return o.a.createElement(d.b,{margin:{left:100,bottom:100},title:Object(h.p)(e),xType:"ordinal",width:400,height:320,style:{padding:10}},o.a.createElement(d.m,{style:{text:{fill:"#fff"}},tickPadding:10,tickLabelAngle:-45,tickFormat:function(e){return Object(u.a)(".2s")(e)}}),o.a.createElement(d.k,{style:{text:{fill:"#fff"}},tickLabelAngle:-45,tickFormat:function(e){return(e+"").length>15?(e+"").substring(0,8)+"...":e}}),o.a.createElement(d.j,{data:r}))}}},{key:"_fetchAndUpdateState",value:function(e){var t=this,a=e||w+"/api/stats19";Object(h.h)(a,(function(a,n){n?t.setState({loading:!1}):t.setState({loading:!1,data:a.features,name:e||w})}))}},{key:"componentDidMount",value:function(){this._fetchAndUpdateState()}},{key:"render",value:function(){var e=this,t=this.state,a=t.data,n=t.key,r=t.sublist,l=t.name,c=t.loading,i=this.props.dark;return o.a.createElement("div",{className:"content",style:{background:i?"#242730":"white",margin:"auto",padding:"5%",color:i?"#a3a5a8":"black"}},o.a.createElement(g.a,{contentCallback:function(t){var a=t.text,n=t.name;try{var r=JSON.parse(a);e.setState({name:n,data:r.features})}catch(l){}}}),o.a.createElement("center",null,o.a.createElement(k.a,{dark:i,urlCallback:function(t){e._fetchAndUpdateState(t)}})),c&&o.a.createElement("div",{id:"loading"}),a&&o.a.createElement("h3",null,"There are "," ".concat(a.length," ")," features in this (",Object(h.u)(l),") resource."),a&&a.length>0&&o.a.createElement(m.a,{dark:this.props.dark,data:a,propertyValuesCallback:function(t){var a=t.key,n=t.sublist;return e.setState({key:a,sublist:n.sort((function(e,t){return e-t}))})}}),a&&a.length>0&&o.a.createElement(j,{data:a}),n&&r&&o.a.createElement(o.a.Fragment,null,o.a.createElement("hr",null),o.a.createElement(p.a,{title:Object(h.p)(n),sublist:r})),n&&r&&o.a.createElement("center",null,o.a.createElement("h5",null,"For (",Object(h.p)(n),") and its variables:"),o.a.createElement("hr",null),this._generateBarChart(n,r)),o.a.createElement(O.a,{data:a,noAccordion:!0,noLimit:!0,plotStyle:{width:window.innerWidth>960?960:window.innerWidth}}),o.a.createElement("p",null,"Data preview:"),o.a.createElement(y.a,{data:a}))}}]),a}(o.a.Component)}}]);
//# sourceMappingURL=3.23ecdd08.chunk.js.map